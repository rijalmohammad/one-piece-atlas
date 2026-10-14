# One Piece Atlas

A full-stack lore reference for the One Piece series. Explore locations, characters, devil fruits, and the story arc timeline, or ask an AI anything about the lore.

## Features

- **Locations**: islands grouped by East Blue, Grand Line, and New World, with a per-location lore panel and chat
- **Characters and Devil Fruits**: searchable, filterable browsers with detail panels and per-entity chat
- **Arc Timeline**: vertical timeline from Romance Dawn to Egghead with manga chapter and anime episode ranges, plus a full story page for each arc
- **Spoiler-safe slider**: hide location content above a chosen chapter
- **Lore chat**: RAG-based Q&A over wiki content, streamed in real time
- **Light and dark themes**

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind
- **Backend**: FastAPI
- **Retrieval**: SentenceTransformers (`all-MiniLM-L6-v2`) embeddings stored in Qdrant
- **LLM**: Groq (streaming)

## How the chat works

1. `backend/ingest.py` scrapes One Piece wiki pages for locations, characters, devil fruits, and arcs, chunks the text, embeds it, and upserts it to Qdrant.
2. At query time the backend embeds the question, retrieves the top matching chunks, and streams a grounded answer from Groq.
3. The Next.js API routes under `frontend/app/api` proxy requests to the backend.

## Project Structure

```
backend/    FastAPI app, retrieval logic, and wiki ingestion script
frontend/   Next.js app (components, lib data, API proxy routes)
data/       Cached raw wiki pages
docs/       Project documentation
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.9+
- A [Qdrant Cloud](https://cloud.qdrant.io) cluster
- A [Groq](https://console.groq.com) API key

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:

```
QDRANT_URL=your-qdrant-cluster-url
QDRANT_API_KEY=your-qdrant-api-key
GROQ_API_KEY=your-groq-api-key
```

Ingest the wiki content (run once; pages are cached in `data/raw`):

```bash
python ingest.py
```

Start the API:

```bash
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. The frontend expects the backend at `http://localhost:8000`; override with the `BACKEND_URL` environment variable.

## Environment Variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `QDRANT_URL` | backend | Qdrant cluster URL |
| `QDRANT_API_KEY` | backend | Qdrant API key |
| `GROQ_API_KEY` | backend | Groq API key |
| `GROQ_MODEL` | backend (optional) | Model name, defaults to `openai/gpt-oss-20b` |
| `FRONTEND_URL` | backend (optional) | Allowed CORS origin |
| `BACKEND_URL` | frontend (optional) | Backend base URL |

## Disclaimer

Fan project. One Piece and its characters belong to Eiichiro Oda and Shueisha. Lore content is sourced from the One Piece Wiki.
