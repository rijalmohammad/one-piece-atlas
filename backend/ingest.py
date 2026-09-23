"""
Scrape One Piece Wiki pages, chunk, embed, and upsert to Qdrant Cloud.
Run once: python ingest.py
"""
import os
import re
import time
import uuid
from pathlib import Path
from dotenv import load_dotenv

import requests
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct, Filter, FieldCondition, MatchValue

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "one_piece_lore"
CHUNK_SIZE = 400
CHUNK_OVERLAP = 50
RAW_DIR = Path(__file__).parent.parent / "data" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

WIKI_PAGES = [
    ("foosha",        "Foosha_Village",         "Romance Dawn Arc",    1,   7),
    ("shellstown",    "Shells_Town",             "Romance Dawn Arc",    2,   7),
    ("orangetown",    "Orange_Town",             "Orange Town Arc",     8,  21),
    ("rareanimals",   "Island_of_Rare_Animals",  "Filler",             18,  18),
    ("syrupvillage",  "Syrup_Village",           "Syrup Village Arc",  22,  41),
    ("baratie",       "Baratie",                 "Baratie Arc",        43,  68),
    ("arlong",        "Arlong_Park",             "Arlong Park Arc",    69,  95),
    ("loguetown",     "Loguetown",               "Loguetown Arc",      96, 100),
    ("goatisland",    "Goat_Island",             "Filler",             51,  51),
    ("twincape",      "Twin_Cape",               "Reverse Mountain",  101, 105),
    ("whiskeypeak",   "Whiskey_Peak",            "Arabasta Saga",     106, 114),
    ("littlegarden",  "Little_Garden",           "Arabasta Saga",     115, 129),
    ("drum",          "Drum_Island",             "Arabasta Saga",     130, 154),
    ("alabasta",      "Arabasta_Kingdom",        "Arabasta Saga",     155, 217),
    ("jaya",          "Jaya",                    "Sky Island Saga",   218, 236),
    ("skypiea",       "Skypiea",                 "Sky Island Saga",   237, 302),
    ("longrong",      "Long_Ring_Long_Land",     "Water 7 Saga",      303, 321),
    ("water7",        "Water_7",                 "Water 7 Saga",      322, 374),
    ("enieslobby",    "Enies_Lobby",             "Water 7 Saga",      375, 430),
    ("thriller",      "Thriller_Bark",           "Thriller Bark Saga",442, 489),
    ("sabaody",       "Sabaody_Archipelago",     "Summit War Saga",   490, 513),
]

WIKI_BASE = "https://onepiece.fandom.com/wiki/"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; OnePieceLoreBot/1.0; +personal-project)"}


def scrape_page(slug: str) -> str | None:
    cache_file = RAW_DIR / f"{slug}.txt"
    if cache_file.exists():
        print(f"  [cache] {slug}")
        return cache_file.read_text(encoding="utf-8")

    url = WIKI_BASE + slug
    print(f"  [fetch] {url}")
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except Exception as e:
        print(f"  [error] {slug}: {e}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")
    content = soup.select_one(".mw-parser-output")
    if not content:
        return None

    for el in content.select(
        ".portable-infobox, .navbox, .references, .reflist, "
        "table, .thumb, figure, .noprint, sup, .mw-editsection"
    ):
        el.decompose()

    paragraphs: list[str] = []
    for el in content.find_all(["p", "h2", "h3"]):
        text = el.get_text(separator=" ", strip=True)
        text = re.sub(r"\[\d+\]", "", text)
        text = re.sub(r"\s+", " ", text).strip()
        if len(text) > 30:
            paragraphs.append(text)

    full_text = "\n\n".join(paragraphs)
    cache_file.write_text(full_text, encoding="utf-8")
    time.sleep(1.5)
    return full_text


def chunk_text(text: str) -> list[str]:
    words = text.split()
    chunks: list[str] = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i : i + CHUNK_SIZE])
        if len(chunk.strip()) > 50:
            chunks.append(chunk)
        i += CHUNK_SIZE - CHUNK_OVERLAP
    return chunks


def setup_collection(client: QdrantClient) -> None:
    existing = {c.name for c in client.get_collections().collections}
    if COLLECTION_NAME not in existing:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )
        print(f"Created collection '{COLLECTION_NAME}'")
    else:
        print(f"Using existing collection '{COLLECTION_NAME}'")


def ingest() -> None:
    print("Loading embedding model (first run downloads ~90MB)…")
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    print("Connecting to Qdrant Cloud…")
    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    setup_collection(client)

    total = 0
    for loc_key, slug, arc, ch_start, ch_end in WIKI_PAGES:
        print(f"\n→ {loc_key} ({slug})")
        text = scrape_page(slug)
        if not text:
            print(f"  [skip] no content")
            continue

        chunks = chunk_text(text)
        print(f"  {len(chunks)} chunks")

        embeddings = model.encode(chunks, show_progress_bar=False)
        points = [
            PointStruct(
                id=str(uuid.uuid4()),
                vector=emb.tolist(),
                payload={
                    "text": chunk,
                    "location_key": loc_key,
                    "arc": arc,
                    "chapter_start": ch_start,
                    "chapter_end": ch_end,
                    "source_url": WIKI_BASE + slug,
                },
            )
            for chunk, emb in zip(chunks, embeddings)
        ]

        client.upsert(COLLECTION_NAME, points=points)
        total += len(points)
        print(f"  ✓ {len(points)} points upserted")

    print(f"\nDone. Total vectors in Qdrant: {total}")


if __name__ == "__main__":
    ingest()
