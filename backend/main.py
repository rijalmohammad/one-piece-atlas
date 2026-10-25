import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from retrieval import retrieve_context, retrieve_context_global, retrieve_context_subject, stream_answer, stream_answer_global, stream_answer_global_open, get_qdrant

app = FastAPI(title="One Piece Lore API", version="0.1.0")


@app.on_event("startup")
def preload():
    get_qdrant()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/global-query")
async def global_query(question: str = Query(...)):
    if not question.strip():
        raise HTTPException(400, "question is required")

    chunks = retrieve_context_global(question.strip(), top_k=8)

    async def generate():
        async for token in stream_answer_global_open(question.strip(), chunks):
            yield token

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.get("/query")
async def query(
    location_key: str = Query(...),
    question: str     = Query(...),
    max_chapter: int  = Query(9999, ge=1),
):
    if not location_key.strip() or not question.strip():
        raise HTTPException(400, "location_key and question are required")

    chunks = retrieve_context(location_key, question.strip(), max_chapter)

    if not chunks:
        async def fallback():
            yield "I don't have wiki context for that specific question. Try asking something else about this location."
        return StreamingResponse(fallback(), media_type="text/event-stream")

    async def generate():
        async for token in stream_answer(location_key, question.strip(), chunks):
            yield token

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.get("/char-query")
async def char_query(
    character: str = Query(...),
    key: str       = Query(""),
    question: str  = Query(...),
):
    if not character.strip() or not question.strip():
        raise HTTPException(400, "character and question are required")

    if key.strip():
        chunks = retrieve_context_subject(key.strip(), "character", question.strip())
    else:
        chunks = retrieve_context_global(f"{character}: {question.strip()}", top_k=6)

    async def generate():
        async for token in stream_answer_global(character, "characters", question.strip(), chunks):
            yield token

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.get("/fruit-query")
async def fruit_query(
    fruit:    str = Query(...),
    key: str      = Query(""),
    question: str = Query(...),
):
    if not fruit.strip() or not question.strip():
        raise HTTPException(400, "fruit and question are required")

    if key.strip():
        chunks = retrieve_context_subject(key.strip(), "devil_fruit", question.strip())
    else:
        chunks = retrieve_context_global(f"{fruit} Devil Fruit: {question.strip()}", top_k=6)

    async def generate():
        async for token in stream_answer_global(fruit, "Devil Fruits", question.strip(), chunks):
            yield token

    return StreamingResponse(generate(), media_type="text/event-stream")
