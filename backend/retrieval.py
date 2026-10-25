from __future__ import annotations

import os
from typing import AsyncGenerator

from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue, Range, Document
from groq import Groq

COLLECTION_NAME = "one_piece_lore"
EMBED_MODEL = "sentence-transformers/all-minilm-l6-v2"


def _query(text: str, limit: int, query_filter: Filter | None = None) -> list[str]:
    res = get_qdrant().query_points(
        collection_name=COLLECTION_NAME,
        query=Document(text=text, model=EMBED_MODEL),
        query_filter=query_filter,
        limit=limit,
        with_payload=True,
    )
    return [p.payload["text"] for p in res.points if p.payload.get("text")]

_qdrant: QdrantClient | None = None
_groq: Groq | None = None


def get_qdrant() -> QdrantClient:
    global _qdrant
    if _qdrant is None:
        _qdrant = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY"),
            cloud_inference=True,
            check_compatibility=False,
        )
    return _qdrant


def get_groq() -> Groq:
    global _groq
    if _groq is None:
        _groq = Groq(api_key=os.getenv("GROQ_API_KEY"))
    return _groq


def retrieve_context(location_key: str, question: str, max_chapter: int = 9999, top_k: int = 5) -> list[str]:
    return _query(question, top_k, Filter(must=[
        FieldCondition(key="location_key", match=MatchValue(value=location_key)),
        FieldCondition(key="chapter_start", range=Range(lte=max_chapter)),
    ]))


def retrieve_context_global(question: str, top_k: int = 6) -> list[str]:
    """Search across all locations — no location filter."""
    return _query(question, top_k)


def retrieve_context_subject(subject_key: str, entity_type: str, question: str, top_k: int = 6) -> list[str]:
    """Search by subject_key for characters and devil fruits."""
    return _query(question, top_k, Filter(must=[
        FieldCondition(key="type", match=MatchValue(value=entity_type)),
        FieldCondition(key="subject_key", match=MatchValue(value=subject_key)),
    ]))


def _groq_stream(messages: list[dict], max_tokens: int = 1024):
    model = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
    extra = {"reasoning_effort": "low"} if "gpt-oss" in model else {}
    return get_groq().chat.completions.create(
        model=model,
        messages=messages,
        stream=True,
        max_tokens=max_tokens,
        temperature=0.3,
        **extra,
    )


async def _yield_stream(stream) -> AsyncGenerator[str, None]:
    try:
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
    except Exception as e:
        yield f"\n\n*(Error from AI model: {e})*"


async def stream_answer(location_key: str, question: str, context_chunks: list[str]) -> AsyncGenerator[str, None]:
    context = "\n\n---\n\n".join(context_chunks)
    system_prompt = (
        f"You are a One Piece lore expert. Answer questions about {location_key} "
        "using only the provided context. Be concise and accurate; cite chapter numbers "
        "when relevant. If the answer isn't in the context, say so — never invent details.\n\n"
        f"Context:\n{context}"
    )
    stream = _groq_stream([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": question},
    ])
    async for token in _yield_stream(stream):
        yield token


async def stream_answer_global_open(question: str, context_chunks: list[str]) -> AsyncGenerator[str, None]:
    context = "\n\n---\n\n".join(context_chunks)
    system_prompt = (
        "You are a One Piece lore expert. Answer questions about any aspect of One Piece — "
        "characters, locations, devil fruits, story arcs, history, or lore. "
        "Be concise and accurate; cite chapter numbers when relevant. "
        "If the answer isn't in the context, draw on your knowledge of One Piece lore.\n\n"
        f"Context:\n{context}"
    )
    stream = _groq_stream([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": question},
    ])
    async for token in _yield_stream(stream):
        yield token


async def stream_answer_global(subject: str, subject_type: str, question: str, context_chunks: list[str]) -> AsyncGenerator[str, None]:
    context = "\n\n---\n\n".join(context_chunks)
    system_prompt = (
        f"You are a One Piece lore expert specializing in {subject_type} lore. "
        f"Answer the question specifically about {subject}. "
        "Use the provided wiki context. Be concise, accurate, and cite chapter numbers when relevant. "
        "If the answer isn't in the context, draw on your knowledge of One Piece lore.\n\n"
        f"Context:\n{context}"
    )
    stream = _groq_stream([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": question},
    ])
    async for token in _yield_stream(stream):
        yield token
