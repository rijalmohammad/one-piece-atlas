import os
from typing import AsyncGenerator

from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue, MatchAny, Range
from groq import Groq

COLLECTION_NAME = "one_piece_lore"

_model: SentenceTransformer | None = None
_qdrant: QdrantClient | None = None
_groq: Groq | None = None


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    return _model


def get_qdrant() -> QdrantClient:
    global _qdrant
    if _qdrant is None:
        _qdrant = QdrantClient(url=os.getenv("QDRANT_URL"), api_key=os.getenv("QDRANT_API_KEY"))
    return _qdrant


def get_groq() -> Groq:
    global _groq
    if _groq is None:
        _groq = Groq(api_key=os.getenv("GROQ_API_KEY"))
    return _groq


def retrieve_context(location_key: str, question: str, max_chapter: int = 9999, top_k: int = 5) -> list[str]:
    vec = get_model().encode(question).tolist()
    results = get_qdrant().search(
        collection_name=COLLECTION_NAME,
        query_vector=vec,
        query_filter=Filter(must=[
            FieldCondition(key="location_key", match=MatchValue(value=location_key)),
            FieldCondition(key="chapter_start", range=Range(lte=max_chapter)),
        ]),
        limit=top_k,
    )
    return [r.payload["text"] for r in results if r.payload.get("text")]


def retrieve_context_global(question: str, top_k: int = 6) -> list[str]:
    """Search across all locations — no location filter."""
    vec = get_model().encode(question).tolist()
    results = get_qdrant().search(
        collection_name=COLLECTION_NAME,
        query_vector=vec,
        limit=top_k,
    )
    return [r.payload["text"] for r in results if r.payload.get("text")]


def retrieve_context_subject(subject_key: str, entity_type: str, question: str, top_k: int = 6) -> list[str]:
    """Search by subject_key for characters and devil fruits."""
    vec = get_model().encode(question).tolist()
    results = get_qdrant().search(
        collection_name=COLLECTION_NAME,
        query_vector=vec,
        query_filter=Filter(must=[
            FieldCondition(key="type", match=MatchValue(value=entity_type)),
            FieldCondition(key="subject_key", match=MatchValue(value=subject_key)),
        ]),
        limit=top_k,
    )
    return [r.payload["text"] for r in results if r.payload.get("text")]


async def stream_answer(location_key: str, question: str, context_chunks: list[str]) -> AsyncGenerator[str, None]:
    context = "\n\n---\n\n".join(context_chunks)
    system_prompt = (
        f"You are a One Piece lore expert. Answer questions about {location_key} "
        "using only the provided context. Be concise and accurate; cite chapter numbers "
        "when relevant. If the answer isn't in the context, say so — never invent details.\n\n"
        f"Context:\n{context}"
    )

    stream = get_groq().chat.completions.create(
        model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question},
        ],
        stream=True,
        max_tokens=512,
        temperature=0.3,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta


async def stream_answer_global(subject: str, subject_type: str, question: str, context_chunks: list[str]) -> AsyncGenerator[str, None]:
    context = "\n\n---\n\n".join(context_chunks)
    system_prompt = (
        f"You are a One Piece lore expert specializing in {subject_type} lore. "
        f"Answer the question specifically about {subject}. "
        "Use the provided wiki context. Be concise, accurate, and cite chapter numbers when relevant. "
        "If the answer isn't in the context, draw on your knowledge of One Piece lore.\n\n"
        f"Context:\n{context}"
    )

    stream = get_groq().chat.completions.create(
        model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question},
        ],
        stream=True,
        max_tokens=512,
        temperature=0.3,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
