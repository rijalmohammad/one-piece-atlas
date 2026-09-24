"""
Scrape One Piece Wiki pages, chunk, embed, and upsert to Qdrant Cloud.
Run once: python ingest.py
"""
from __future__ import annotations
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
from qdrant_client.models import VectorParams, Distance, PointStruct, PayloadSchemaType

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "one_piece_lore"
CHUNK_SIZE = 400
CHUNK_OVERLAP = 50
RAW_DIR = Path(__file__).parent.parent / "data" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

# (key, wiki_slug, arc_label, chapter_start, chapter_end)
LOCATION_PAGES: list[tuple[str, str, str, int, int]] = [
    # East Blue
    ("foosha",               "Foosha_Village",            "Romance Dawn Arc",       1,   7),
    ("shellstown",           "Shells_Town",                "Romance Dawn Arc",       2,   7),
    ("orangetown",           "Orange_Town",                "Orange Town Arc",        8,  21),
    ("rareanimals",          "Island_of_Rare_Animals",     "Filler",                18,  18),
    ("warshipisland",        "Warship_Island",             "Filler",                54,  61),
    ("syrupvillage",         "Syrup_Village",              "Syrup Village Arc",     22,  41),
    ("baratie",              "Baratie",                    "Baratie Arc",           43,  68),
    ("arlong",               "Arlong_Park",                "Arlong Park Arc",       69,  95),
    ("loguetown",            "Loguetown",                  "Loguetown Arc",         96, 100),
    # Grand Line — Arabasta Saga
    ("twincape",             "Twin_Cape",                  "Reverse Mountain",     101, 105),
    ("whiskeypeak",          "Whiskey_Peak",               "Arabasta Saga",        106, 114),
    ("littlegarden",         "Little_Garden",              "Arabasta Saga",        115, 129),
    ("drum",                 "Drum_Island",                "Arabasta Saga",        130, 154),
    ("alabasta",             "Arabasta_Kingdom",           "Arabasta Saga",        155, 217),
    ("postalabastainterlude","Arabasta_Kingdom",           "Post-Arabasta Filler", 218, 224),
    ("goatisland",           "Goat_Island",                "Filler",               196, 206),
    ("rulukaIsland",         "Ruluka_Island",              "Filler",               196, 206),
    # Grand Line — Sky Island Saga
    ("jaya",                 "Jaya",                       "Sky Island Saga",      218, 236),
    ("skypiea",              "Skypiea",                    "Sky Island Saga",      237, 302),
    ("g8",                   "G-8",                        "Filler",               196, 206),
    # Grand Line — Water 7 Saga
    ("longrong",             "Long_Ring_Long_Land",        "Water 7 Saga",         303, 321),
    ("oceansdream",          "Ocean%27s_Dream_Arc",        "Filler",               220, 224),
    ("foxysreturn",          "Foxy%27s_Return_Arc",        "Filler",               225, 228),
    ("water7",               "Water_7",                    "Water 7 Saga",         322, 374),
    ("enieslobby",           "Enies_Lobby",                "Water 7 Saga",         375, 430),
    ("postenies",            "Water_7",                    "Post-Enies Lobby",     431, 441),
    ("icehunter",            "Ice_Hunter_Arc",             "Filler",               326, 336),
    # Grand Line — Thriller Bark Saga
    ("thriller",             "Thriller_Bark",              "Thriller Bark Saga",   442, 489),
    ("spaisland",            "Spa_Island_Arc",             "Filler",               382, 384),
    # Grand Line — Summit War Saga
    ("sabaody",              "Sabaody_Archipelago",        "Summit War Saga",      490, 513),
    ("amazonlily",           "Amazon_Lily",                "Summit War Saga",      514, 524),
    ("littleeastblue",       "Little_East_Blue_Arc",       "Filler",               426, 429),
    ("impeldown",            "Impel_Down",                 "Summit War Saga",      525, 549),
    ("marineford",           "Marineford",                 "Marineford Arc",       550, 580),
    ("postwar",              "Post-War_Arc",               "Post-War",             581, 597),
    # New World — Fish-Man Island Saga
    ("fishmanisland",        "Fish-Man_Island",            "Fish-Man Island Arc",  598, 653),
    # New World — Punk Hazard Arc
    ("punkhazard",           "Punk_Hazard",                "Punk Hazard Arc",      654, 699),
    # New World — Dressrosa Arc
    ("dressrosa",            "Dressrosa",                  "Dressrosa Arc",        700, 801),
    ("greenbit",             "Green_Bit",                  "Dressrosa Arc",        700, 801),
    # New World — Zou Arc
    ("zou",                  "Zou",                        "Zou Arc",              802, 824),
    # New World — Whole Cake Island Arc
    ("wholecakeisland",      "Whole_Cake_Island",          "Whole Cake Island Arc",825, 902),
    # New World — Wano Arc
    ("wano",                 "Wano_Country",               "Wano Arc",             909, 1057),
    ("onigashima",           "Onigashima",                 "Wano Arc",             958, 1057),
    # New World — Egghead Arc
    ("egghead",              "Egghead_Island",             "Egghead Arc",         1058, 9999),
]

# (key, wiki_slug)
CHARACTER_PAGES: list[tuple[str, str]] = [
    ("luffy",       "Monkey_D._Luffy"),
    ("zoro",        "Roronoa_Zoro"),
    ("nami",        "Nami"),
    ("usopp",       "Usopp"),
    ("sanji",       "Sanji"),
    ("chopper",     "Tony_Tony_Chopper"),
    ("robin",       "Nico_Robin"),
    ("franky",      "Franky"),
    ("brook",       "Brook"),
    ("smoker",      "Smoker"),
    ("tashigi",     "Tashigi"),
    ("garp",        "Monkey_D._Garp"),
    ("sengoku",     "Sengoku"),
    ("aokiji",      "Kuzan"),
    ("kizaru",      "Borsalino"),
    ("akainu",      "Sakazuki"),
    ("mihawk",      "Dracule_Mihawk"),
    ("crocodile",   "Crocodile_(character)"),
    ("doflamingo",  "Donquixote_Doflamingo"),
    ("kuma",        "Bartholomew_Kuma"),
    ("hancock",     "Boa_Hancock"),
    ("shanks",      "Shanks"),
    ("whitebeard",  "Edward_Newgate"),
    ("blackbeard",  "Marshall_D._Teach"),
    ("buggy",       "Buggy"),
    ("arlong",      "Arlong"),
    ("enel",        "Enel"),
    ("lucci",       "Rob_Lucci"),
    ("moria",       "Gecko_Moria"),
    ("ace",         "Portgas_D._Ace"),
    ("rayleigh",    "Silvers_Rayleigh"),
    ("dragon",      "Monkey_D._Dragon"),
    ("vivi",        "Nefertari_Vivi"),
    ("law",         "Trafalgar_D._Water_Law"),
    ("marco",       "Marco"),
    ("roger",       "Gol_D._Roger"),
    ("jinbe",       "Jinbe"),
    # New World additions
    ("yamato",      "Yamato"),
    ("caesar",      "Caesar_Clown"),
    ("momonosuke",  "Kozuki_Momonosuke"),
    ("katakuri",    "Charlotte_Katakuri"),
    ("kaido",       "Kaido"),
    ("bigmom",      "Charlotte_Linlin"),
    ("king",        "King_(Alber)"),
    ("sabo",        "Sabo"),
    ("vegapunk",    "Vegapunk"),
]

# (key, wiki_slug, arc_name)
ARC_PAGES: list[tuple[str, str, str]] = [
    # East Blue Saga
    ("romance-dawn",        "Romance_Dawn_Arc",             "Romance Dawn Arc"),
    ("orange-town",         "Orange_Town_Arc",              "Orange Town Arc"),
    ("syrup-village",       "Syrup_Village_Arc",            "Syrup Village Arc"),
    ("baratie",             "Baratie_Arc",                  "Baratie Arc"),
    ("arlong-park",         "Arlong_Park_Arc",              "Arlong Park Arc"),
    ("loguetown",           "Loguetown_Arc",                "Loguetown Arc"),
    # Arabasta Saga
    ("reverse-mountain",    "Reverse_Mountain_Arc",         "Reverse Mountain Arc"),
    ("whisky-peak",         "Whisky_Peak_Arc",              "Whisky Peak Arc"),
    ("little-garden",       "Little_Garden_Arc",            "Little Garden Arc"),
    ("drum-island",         "Drum_Island_Arc",              "Drum Island Arc"),
    ("arabasta",            "Arabasta_Arc",                 "Arabasta Arc"),
    # Sky Island Saga
    ("jaya",                "Jaya_Arc",                     "Jaya Arc"),
    ("skypiea",             "Skypiea_Arc",                  "Skypiea Arc"),
    # Water 7 Saga
    ("long-ring",           "Long_Ring_Long_Land_Arc",      "Long Ring Long Land Arc"),
    ("water-7",             "Water_7_Arc",                  "Water 7 Arc"),
    ("enies-lobby",         "Enies_Lobby_Arc",              "Enies Lobby Arc"),
    ("post-enies-lobby",    "Post-Enies_Lobby_Arc",         "Post-Enies Lobby Arc"),
    # Thriller Bark Saga
    ("thriller-bark",       "Thriller_Bark_Arc",            "Thriller Bark Arc"),
    # Summit War Saga
    ("sabaody",             "Sabaody_Archipelago_Arc",      "Sabaody Archipelago Arc"),
    ("amazon-lily",         "Amazon_Lily_Arc",              "Amazon Lily Arc"),
    ("impel-down",          "Impel_Down_Arc",               "Impel Down Arc"),
    ("marineford",          "Marineford_Arc",               "Marineford Arc"),
    ("post-war",            "Post-War_Arc",                 "Post-War Arc"),
    # Fish-Man Island Saga
    ("fish-man-island",     "Fish-Man_Island_Arc",          "Fish-Man Island Arc"),
    # Punk Hazard Arc
    ("punk-hazard",         "Punk_Hazard_Arc",              "Punk Hazard Arc"),
    # Dressrosa Arc
    ("dressrosa",           "Dressrosa_Arc",                "Dressrosa Arc"),
    # Zou Arc
    ("zou",                 "Zou_Arc",                      "Zou Arc"),
    # Whole Cake Island Arc
    ("whole-cake-island",   "Whole_Cake_Island_Arc",        "Whole Cake Island Arc"),
    # Wano Country Arc
    ("wano",                "Wano_Country_Arc",             "Wano Country Arc"),
    # Egghead Arc
    ("egghead",             "Egghead_Arc",                  "Egghead Arc"),
]

# (key, wiki_slug)
FRUIT_PAGES: list[tuple[str, str]] = [
    ("gomu_gomu",        "Gomu_Gomu_no_Mi"),
    ("bara_bara",        "Bara_Bara_no_Mi"),
    ("sube_sube",        "Sube_Sube_no_Mi"),
    ("bomu_bomu",        "Bomu_Bomu_no_Mi"),
    ("kiro_kiro",        "Kiro_Kiro_no_Mi"),
    ("hana_hana",        "Hana_Hana_no_Mi"),
    ("doru_doru",        "Doru_Doru_no_Mi"),
    ("baku_baku",        "Baku_Baku_no_Mi"),
    ("mane_mane",        "Mane_Mane_no_Mi"),
    ("supa_supa",        "Supa_Supa_no_Mi"),
    ("bane_bane",        "Bane_Bane_no_Mi"),
    ("horo_horo",        "Horo_Horo_no_Mi"),
    ("yomi_yomi",        "Yomi_Yomi_no_Mi"),
    ("kage_kage",        "Kage_Kage_no_Mi"),
    ("nikyu_nikyu",      "Nikyu_Nikyu_no_Mi"),
    ("ito_ito",          "Ito_Ito_no_Mi"),
    ("mero_mero",        "Mero_Mero_no_Mi"),
    ("ope_ope",          "Ope_Ope_no_Mi"),
    ("gura_gura",        "Gura_Gura_no_Mi"),
    ("hito_hito",        "Hito_Hito_no_Mi"),
    ("neko_neko_leopard","Neko_Neko_no_Mi,_Model:_Leopard"),
    ("ushi_ushi_giraffe","Ushi_Ushi_no_Mi,_Model:_Giraffe"),
    ("tori_tori_phoenix","Tori_Tori_no_Mi,_Model:_Phoenix"),
    ("moku_moku",        "Moku_Moku_no_Mi"),
    ("suna_suna",        "Suna_Suna_no_Mi"),
    ("mera_mera",        "Mera_Mera_no_Mi"),
    ("goro_goro",        "Goro_Goro_no_Mi"),
    ("hie_hie",          "Hie_Hie_no_Mi"),
    ("yami_yami",        "Yami_Yami_no_Mi"),
    ("pika_pika",        "Pika_Pika_no_Mi"),
    ("magu_magu",        "Magu_Magu_no_Mi"),
    # New World additions
    ("hito_hito_nika",   "Hito_Hito_no_Mi,_Model:_Nika"),
    ("uo_uo_seiryu",     "Uo_Uo_no_Mi,_Model:_Seiryu"),
    ("inu_inu_makami",   "Inu_Inu_no_Mi,_Model:_Okuchi_no_Makami"),
    ("mochi_mochi",      "Mochi_Mochi_no_Mi"),
    ("soru_soru",        "Soru_Soru_no_Mi"),
    ("gasu_gasu",        "Gasu_Gasu_no_Mi"),
    ("ryu_ryu_ptero",    "Ryu_Ryu_no_Mi,_Model:_Pteranodon"),
]

WIKI_BASE = "https://onepiece.fandom.com/wiki/"
API_BASE  = "https://onepiece.fandom.com/api.php"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; OnePieceLoreBot/1.0; +personal-project)"}


def scrape_page(slug: str) -> str | None:
    cache_file = RAW_DIR / f"{slug}.txt"
    if cache_file.exists():
        print(f"  [cache] {slug}")
        return cache_file.read_text(encoding="utf-8")

    print(f"  [fetch] {slug}")
    try:
        resp = requests.get(API_BASE, headers=HEADERS, timeout=15, params={
            "action": "parse",
            "page": slug,
            "prop": "text",
            "format": "json",
            "redirects": True,
        })
        resp.raise_for_status()
        data = resp.json()
        html = data.get("parse", {}).get("text", {}).get("*", "")
        if not html:
            print(f"  [error] no html returned")
            return None
    except Exception as e:
        print(f"  [error] {slug}: {e}")
        return None

    soup = BeautifulSoup(html, "html.parser")
    for el in soup.select(
        ".portable-infobox, .navbox, .references, .reflist, "
        "table, .thumb, figure, .noprint, sup, .mw-editsection"
    ):
        el.decompose()

    paragraphs: list[str] = []
    for el in soup.find_all(["p", "h2", "h3"]):
        text = el.get_text(separator=" ", strip=True)
        text = re.sub(r"\[\d+\]", "", text)
        text = re.sub(r"\s+", " ", text).strip()
        if len(text) > 30:
            paragraphs.append(text)

    full_text = "\n\n".join(paragraphs)
    cache_file.write_text(full_text, encoding="utf-8")
    time.sleep(1.0)
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

    # Create payload indexes required for filtered queries
    index_fields = [
        ("location_key",  PayloadSchemaType.KEYWORD),
        ("type",          PayloadSchemaType.KEYWORD),
        ("subject_key",   PayloadSchemaType.KEYWORD),
        ("chapter_start", PayloadSchemaType.INTEGER),
    ]
    for field, schema in index_fields:
        try:
            client.create_payload_index(COLLECTION_NAME, field_name=field, field_schema=schema)
            print(f"  index: {field}")
        except Exception:
            pass  # index already exists


def ingest_locations(model: SentenceTransformer, client: QdrantClient) -> int:
    total = 0
    for loc_key, slug, arc, ch_start, ch_end in LOCATION_PAGES:
        print(f"\n→ [location] {loc_key} ({slug})")
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
                    "type": "location",
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
    return total


def ingest_characters(model: SentenceTransformer, client: QdrantClient) -> int:
    total = 0
    for char_key, slug in CHARACTER_PAGES:
        print(f"\n→ [character] {char_key} ({slug})")
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
                    "type": "character",
                    "subject_key": char_key,
                    "source_url": WIKI_BASE + slug,
                },
            )
            for chunk, emb in zip(chunks, embeddings)
        ]

        client.upsert(COLLECTION_NAME, points=points)
        total += len(points)
        print(f"  ✓ {len(points)} points upserted")
    return total


def ingest_arcs(model: SentenceTransformer, client: QdrantClient) -> int:
    total = 0
    for arc_key, slug, arc_name in ARC_PAGES:
        print(f"\n→ [arc] {arc_key} ({slug})")
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
                    "type": "arc",
                    "subject_key": arc_key,
                    "arc_name": arc_name,
                    "source_url": WIKI_BASE + slug,
                },
            )
            for chunk, emb in zip(chunks, embeddings)
        ]

        client.upsert(COLLECTION_NAME, points=points)
        total += len(points)
        print(f"  ✓ {len(points)} points upserted")
    return total


def ingest_fruits(model: SentenceTransformer, client: QdrantClient) -> int:
    total = 0
    for fruit_key, slug in FRUIT_PAGES:
        print(f"\n→ [devil_fruit] {fruit_key} ({slug})")
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
                    "type": "devil_fruit",
                    "subject_key": fruit_key,
                    "source_url": WIKI_BASE + slug,
                },
            )
            for chunk, emb in zip(chunks, embeddings)
        ]

        client.upsert(COLLECTION_NAME, points=points)
        total += len(points)
        print(f"  ✓ {len(points)} points upserted")
    return total


def ingest() -> None:
    print("Loading embedding model (first run downloads ~90MB)…")
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    print("Connecting to Qdrant Cloud…")
    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    setup_collection(client)

    total = 0
    total += ingest_locations(model, client)
    total += ingest_characters(model, client)
    total += ingest_fruits(model, client)
    total += ingest_arcs(model, client)

    print(f"\nDone. Total vectors upserted this run: {total}")


if __name__ == "__main__":
    ingest()
