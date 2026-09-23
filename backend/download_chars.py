"""
Download pre-timeskip character portrait images from the One Piece Wiki API.
Saves them to frontend/public/chars/<slug>.webp

Usage:
    cd backend
    python3 download_chars.py
"""
from __future__ import annotations
import re
import time
import requests
from pathlib import Path

OUT_DIR = Path(__file__).parent.parent / "frontend" / "public" / "chars"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Use the Fandom MediaWiki API to get image URLs — bypasses the 403 on wiki pages
API = "https://onepiece.fandom.com/api.php"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; OneAtlas/1.0; educational project)",
    "Accept": "application/json",
}

CHARACTERS = [
    ("monkey-d-luffy",    "Monkey D. Luffy"),
    ("roronoa-zoro",      "Roronoa Zoro"),
    ("nami",              "Nami"),
    ("usopp",             "Usopp"),
    ("sanji",             "Sanji"),
    ("tony-tony-chopper", "Tony Tony Chopper"),
    ("nico-robin",        "Nico Robin"),
    ("franky",            "Franky"),
    ("brook",             "Brook"),
    ("gol-d-roger",       "Gol D. Roger"),
    ("shanks",            "Shanks"),
    ("whitebeard",        "Edward Newgate"),
    ("monkey-d-garp",     "Monkey D. Garp"),
    ("smoker",            "Smoker"),
    ("tashigi",           "Tashigi"),
    ("sengoku",           "Sengoku"),
    ("aokiji",            "Kuzan"),
    ("kizaru",            "Borsalino"),
    ("akainu",            "Sakazuki"),
    ("dracule-mihawk",    "Dracule Mihawk"),
    ("boa-hancock",       "Boa Hancock"),
    ("bartholomew-kuma",  "Bartholomew Kuma"),
    ("gecko-moria",       "Gecko Moria"),
    ("buggy",             "Buggy"),
    ("arlong",            "Arlong"),
    ("crocodile",         "Crocodile"),
    ("enel",              "Enel"),
    ("rob-lucci",         "Rob Lucci"),
    ("blackbeard",        "Marshall D. Teach"),
    ("portgas-d-ace",     "Portgas D. Ace"),
    ("silvers-rayleigh",  "Silvers Rayleigh"),
    ("monkey-d-dragon",   "Monkey D. Dragon"),
    ("nefertari-vivi",    "Nefertari Vivi"),
    ("trafalgar-law",     "Trafalgar D. Water Law"),
    ("marco",             "Marco"),
    ("jinbe",             "Jinbe"),
]


def get_page_image_url(page_title: str) -> str | None:
    """Use MediaWiki API pageimages prop to get the main image URL."""
    try:
        resp = requests.get(API, headers=HEADERS, timeout=15, params={
            "action": "query",
            "titles": page_title,
            "prop": "pageimages",
            "pithumbsize": 300,
            "format": "json",
        })
        resp.raise_for_status()
        data = resp.json()
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            thumb = page.get("thumbnail", {})
            if thumb.get("source"):
                return thumb["source"]
    except Exception as e:
        print(f"  ✗ API error: {e}")
    return None


def download_image(url: str, out_path: Path) -> bool:
    try:
        r = requests.get(url, headers=HEADERS, timeout=20, stream=True)
        r.raise_for_status()
        with open(out_path, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"  ✗ download failed: {e}")
        return False


def main():
    print(f"Saving to: {OUT_DIR}\n")
    for slug, wiki_name in CHARACTERS:
        # Check if already downloaded (any extension)
        existing = list(OUT_DIR.glob(f"{slug}.*"))
        if existing:
            print(f"  ✓ {slug} already downloaded, skipping")
            continue

        print(f"  → {slug} ({wiki_name})")
        img_url = get_page_image_url(wiki_name)
        if not img_url:
            print(f"  ✗ no image found for {wiki_name}")
            time.sleep(1)
            continue

        # Derive extension from URL
        ext = ".png" if ".png" in img_url.lower() else ".webp"
        out = OUT_DIR / f"{slug}{ext}"
        ok = download_image(img_url, out)
        if ok:
            size = out.stat().st_size // 1024
            print(f"  ✓ saved {out.name} ({size} KB) from {img_url[:60]}…")
        time.sleep(1.0)

    print("\nDone. Add imageFile fields to frontend/lib/characters.ts once images are verified.")


if __name__ == "__main__":
    main()
