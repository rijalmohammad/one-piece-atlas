# One Piece Lore Explorer — Project Handover

## What this is
A personal RAG/LLM web app: scrape One Piece Wiki → embed into a vector store → FastAPI backend with Groq chat → Next.js frontend with an arc-grouped interactive UI.

## Stack
| Layer | Choice | Notes |
|---|---|---|
| LLM | Groq free tier | Use `llama-3.1-8b-instant` or `llama-3.3-70b-versatile` |
| Vector store | Qdrant Cloud free tier | Or ChromaDB locally for dev |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2` | Fast, free, good enough |
| Backend | FastAPI (Python) | Streaming SSE responses |
| Frontend | Next.js + Tailwind | Port the mockup HTML into React components |
| Hosting | Vercel (frontend) + Railway (backend) | Both have free tiers |

## Recommended folder structure
```
one-piece-lore/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── ingest.py            # Scrape + embed + upsert to Qdrant
│   ├── retrieval.py         # Query Qdrant, build prompt, call Groq
│   ├── requirements.txt
│   └── .env                 # GROQ_API_KEY, QDRANT_URL, QDRANT_API_KEY
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main layout
│   │   └── api/chat/route.ts  # Proxy to FastAPI (or call directly)
│   ├── components/
│   │   ├── IslandCard.tsx
│   │   ├── ArcSection.tsx
│   │   ├── SidePanel.tsx
│   │   └── ChatBox.tsx
│   └── lib/
│       └── locations.ts     # LOCS, ARC_GROUPS, REGION_META (ported from mockup)
└── data/
    └── raw/                 # Scraped wiki pages (cache before embedding)
```

## Build order
1. **Data pipeline** — scrape One Piece Wiki by arc, clean + chunk, embed, load into Qdrant
2. **RAG backend** — FastAPI `/query` endpoint: retrieve top-k chunks → Groq prompt → stream response
3. **Frontend** — port the mockup HTML into Next.js React components
4. **Spoiler-safe mode** — filter retrieved chunks by chapter range before passing to Groq

---

## UI mockup (already done)
Published at: `https://claude.ai/artifact/GHAjMimEt4dkBKM9jFYrgf`

Design: arc-grouped island cards → click → slide-in lore panel → inline chat input → RAG response.

Two regions: **East Blue** (9 islands, Ch. 1–100) and **Paradise** (12 islands, Ch. 101–513), pre-timeskip only.

Color palette from the mockup:
```css
--gold:      #F0B020
--parchment: #F5E6C8
--text-dim:  #6A9AC0
--bg:        #060D26
--card-bg:   rgba(6,16,48,0.72)
```
Fonts: Cinzel (headings) + Lato (body) from Google Fonts.

---

## Source-of-truth location data (from the mockup)

These 21 locations are the v1 scope. The `key` is the unique identifier used throughout.

### ARC_GROUPS (region → arc → keys)
```javascript
const ARC_GROUPS = {
  eastblue: [
    { arc: 'Romance Dawn Arc',   keys: ['foosha', 'shellstown'] },
    { arc: 'Orange Town Arc',    keys: ['orangetown'] },
    { arc: 'Syrup Village Arc',  keys: ['rareanimals', 'syrupvillage'] },
    { arc: 'Baratie Arc',        keys: ['baratie'] },
    { arc: 'Arlong Park Arc',    keys: ['arlong'] },
    { arc: 'Loguetown Arc',      keys: ['loguetown', 'goatisland'] },
  ],
  paradise: [
    { arc: 'Reverse Mountain',   keys: ['twincape'] },
    { arc: 'Arabasta Saga',      keys: ['whiskeypeak', 'littlegarden', 'drum', 'alabasta'] },
    { arc: 'Sky Island Saga',    keys: ['jaya', 'skypiea'] },
    { arc: 'Water 7 Saga',       keys: ['longrong', 'water7', 'enieslobby'] },
    { arc: 'Thriller Bark Saga', keys: ['thriller'] },
    { arc: 'Summit War Saga',    keys: ['sabaody'] },
  ]
};
```

### LOCS (full location data)
```javascript
const LOCS = {
  foosha: {
    eyebrow: 'East Blue · Romance Dawn Arc',
    title: 'Goa Kingdom',
    tags: ['Arc: Romance Dawn', 'Ch. 1–7', 'Ep. 1–3'],
    lore: "The kingdom of Goa — home to Foosha Village where Luffy grew up under his grandfather Garp. Shanks' crew docked here, and Luffy accidentally swallowed the Gum-Gum Devil Fruit — beginning the greatest pirate story ever told.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['S','Shanks','#FF6B6B','rgba(200,50,50,0.2)'],['M','Makino','#FFD740','rgba(255,200,0,0.18)'],['G','Garp','#AAAAFF','rgba(100,100,200,0.18)']],
    greeting: "Goa Kingdom — where it all began. Ask me about Luffy's childhood, Shanks' crew, or the Gum-Gum Fruit incident."
  },
  shellstown: {
    eyebrow: 'East Blue · Romance Dawn Arc',
    title: 'Shells Town',
    tags: ['Arc: Romance Dawn', 'Ch. 2–7', 'Ep. 1–3'],
    lore: "A town under the iron grip of Marine Captain Morgan and his son Helmeppo. Roronoa Zoro was imprisoned here — and it was the very first island Luffy visited to recruit his crew.",
    chars: [['Z','Zoro','#7FD47F','rgba(100,200,100,0.2)'],['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['M','Morgan','#AAAAAA','rgba(130,130,130,0.2)'],['K','Koby','#FFB0C0','rgba(220,160,180,0.18)']],
    greeting: "Shells Town — where Zoro's story began. Ask me about Zoro's imprisonment, Captain Morgan, or Luffy's first real fight."
  },
  orangetown: {
    eyebrow: 'East Blue · Orange Town Arc',
    title: 'Orange Town',
    tags: ['Arc: Orange Town', 'Ch. 8–21', 'Ep. 4–8'],
    lore: "A seaside town terrorized by Buggy the Clown and his pirate crew. The crew met Nami here — she was stealing from pirates — and Luffy fought his first warlord-class opponent.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['B','Buggy','#FF4040','rgba(200,40,40,0.2)'],['N','Nami','#FF9C50','rgba(255,150,60,0.2)'],['Z','Zoro','#7FD47F','rgba(100,200,100,0.18)']],
    greeting: "Orange Town — Buggy the Clown's territory and Nami's first appearance. Ask me about Buggy's Devil Fruit, the town's residents, or how Nami joined."
  },
  rareanimals: {
    eyebrow: 'East Blue · Filler',
    title: 'Island of Rare Animals',
    tags: ['Ep. 18 (Filler)'],
    lore: "A brief stop featuring exotic creatures found nowhere else. A small transitional island the crew passed through between adventures in East Blue.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['Z','Zoro','#7FD47F','rgba(100,200,100,0.2)'],['N','Nami','#FF9C50','rgba(255,150,60,0.2)']],
    greeting: "Island of Rare Animals — a brief stop in East Blue. Ask me about the exotic creatures found here."
  },
  syrupvillage: {
    eyebrow: 'East Blue · Syrup Village Arc',
    title: 'Syrup Village',
    tags: ['Arc: Syrup Village', 'Ch. 22–41', 'Ep. 9–18'],
    lore: "A peaceful village and home of Usopp, son of the pirate Yasopp. The mansion of the wealthy Kaya was targeted by Captain Kuro and the Black Cat Pirates — until Usopp and the Straw Hats intervened.",
    chars: [['U','Usopp','#C89040','rgba(180,130,40,0.2)'],['K','Kaya','#AADDFF','rgba(100,180,255,0.2)'],['K','Kuro','#888888','rgba(100,100,100,0.2)'],['L','Luffy','#FF8C42','rgba(255,100,0,0.18)']],
    greeting: "Syrup Village — Usopp's hometown and where he joined the crew. Ask me about Captain Kuro's plan, Kaya, or the long-nosed sniper's origin."
  },
  baratie: {
    eyebrow: 'East Blue · Baratie Arc',
    title: 'Baratie',
    tags: ['Arc: Baratie', 'Ch. 43–68', 'Ep. 20–30'],
    lore: "A floating restaurant shaped like a fish, run by the legendary chef Zeff. Sanji joined the Straw Hats here after the crew clashed with Don Krieg's pirate armada.",
    chars: [['S','Sanji','#FFD740','rgba(255,200,0,0.2)'],['Z','Zeff','#FF8C42','rgba(255,100,0,0.2)'],['K','Krieg','#888888','rgba(120,120,120,0.2)'],['L','Luffy','#FF8C42','rgba(255,100,0,0.18)']],
    greeting: "Baratie — the floating restaurant and Sanji's origin. Ask me about Chef Zeff, Don Krieg's attack, or how Sanji joined."
  },
  arlong: {
    eyebrow: 'East Blue · Arlong Park Arc',
    title: 'Conomi Island',
    tags: ['Arc: Arlong Park', 'Ch. 69–95', 'Ep. 31–44'],
    lore: "The fortress of Arlong, a Fishman who enslaved Nami's village for years. One of the series' most emotional arcs — Nami's past, her tangerine grove, and Luffy's declaration.",
    chars: [['N','Nami','#FF8C42','rgba(255,140,50,0.2)'],['A','Arlong','#20A0C0','rgba(20,140,180,0.2)'],['L','Luffy','#FF8C42','rgba(255,100,0,0.18)'],['B','Bellemere','#FF6080','rgba(220,60,90,0.2)']],
    greeting: "Conomi Island — one of the most emotional arcs. Ask me about Nami's past, Arlong's rule, or the battle for Cocoyashi Village."
  },
  loguetown: {
    eyebrow: 'East Blue · Loguetown Arc',
    title: 'Loguetown',
    tags: ['Arc: Loguetown', 'Ch. 96–100', 'Ep. 45–48'],
    lore: "The 'Town of Beginning and End' — where Gol D. Roger was born and executed. Luffy nearly died on the same scaffold before a lightning bolt saved him. Smoker made his debut here.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['S','Smoker','#AAAAAA','rgba(150,150,150,0.2)'],['Z','Zoro','#7FD47F','rgba(100,200,100,0.18)'],['T','Tashigi','#88BBFF','rgba(80,140,220,0.18)']],
    greeting: "Loguetown — where Roger was born and executed. Ask me about the scaffold scene, Smoker, or the departure for the Grand Line."
  },
  goatisland: {
    eyebrow: 'East Blue · Filler',
    title: 'Goat Island',
    tags: ['Ep. 51 (Filler)'],
    lore: "A small deserted island where Luffy, Zoro, and Nami were stranded after getting lost at sea. An old man named Zenny lives here with a herd of goats — and a half-built ship.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['Z','Zoro','#7FD47F','rgba(100,200,100,0.2)'],['N','Nami','#FF9C50','rgba(255,150,60,0.2)']],
    greeting: "Goat Island — a quiet detour early in the journey. Ask me about Zenny, the goats, or how the crew got here."
  },
  twincape: {
    eyebrow: 'Grand Line · Entry Point',
    title: 'Twin Cape',
    tags: ['Reverse Mountain', 'Ch. 101–105', 'Ep. 62–63'],
    lore: "The twin rock formations where Reverse Mountain splits into the four Blue Seas. The ancient whale Laboon has spent 50 years here waiting for the Rumbar Pirates — and Brook's return. The starting point of the Grand Line.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['B','Laboon','#AADDFF','rgba(100,180,255,0.2)'],['C','Crocus','#FFD060','rgba(230,200,50,0.18)']],
    greeting: "Twin Cape — where the Grand Line begins. Ask me about Reverse Mountain, Laboon's lonely vigil, or the Rumbar Pirates' promise."
  },
  whiskeypeak: {
    eyebrow: 'Paradise · Arabasta Saga',
    title: 'Cactus Island',
    tags: ['Arc: Whiskey Peak', 'Ch. 106–114', 'Ep. 64–67'],
    lore: "The first island after Reverse Mountain — a desert outpost that welcomes pirates with a feast, only for the hosts to reveal themselves as bounty hunters. Zoro's iconic 100-man battle begins here.",
    chars: [['Z','Zoro','#7FD47F','rgba(100,200,100,0.2)'],['V','Vivi','#FFD740','rgba(255,200,0,0.2)'],['L','Luffy','#FF8C42','rgba(255,100,0,0.18)'],['I','Igaram','#AAAAFF','rgba(140,140,220,0.18)']],
    greeting: "Cactus Island (Whiskey Peak) — the deceptive desert outpost. Ask me about the bounty hunter trap, Vivi's reveal, or Zoro vs 100 men."
  },
  littlegarden: {
    eyebrow: 'Paradise · Arabasta Saga',
    title: 'Little Garden',
    tags: ['Arc: Little Garden', 'Ch. 115–129', 'Ep. 70–77'],
    lore: "A prehistoric island where dinosaurs still roam — and where two giants, Dorry and Brogy, have been dueling for 100 years. The crew encountered Mr. 3's Candle Set trap here.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['V','Vivi','#FFD740','rgba(255,200,0,0.2)'],['D','Dorry','#6699FF','rgba(80,120,220,0.2)'],['B','Brogy','#FF9944','rgba(220,130,40,0.2)']],
    greeting: "Little Garden — prehistoric island of giants. Ask me about Dorry and Brogy's duel, Mr. 3's trap, or why the giants kept fighting."
  },
  drum: {
    eyebrow: 'Paradise · Arabasta Saga',
    title: 'Drum Island',
    tags: ['Arc: Drum Island', 'Ch. 130–154', 'Ep. 78–91'],
    lore: "A snow-covered island terrorized by the tyrant Wapol. Dr. Hiriluk and Dr. Kureha live atop the Drum Rockies — and this is where Tony Tony Chopper, the reindeer doctor, joined the crew.",
    chars: [['C','Chopper','#FF9FC2','rgba(255,120,180,0.2)'],['K','Kureha','#AADDFF','rgba(100,180,255,0.18)'],['H','Hiriluk','#FFBBCC','rgba(255,160,180,0.18)'],['W','Wapol','#888888','rgba(120,120,120,0.18)']],
    greeting: "Drum Island — origin of the crew's doctor. Ask me about Chopper's backstory, Dr. Hiriluk's cherry blossoms, or the battle against Wapol."
  },
  alabasta: {
    eyebrow: 'Paradise · Arabasta Saga',
    title: 'Alabasta Kingdom',
    tags: ['Arc: Alabasta', 'Ch. 155–217', 'Ep. 92–130'],
    lore: "A vast desert kingdom ruled by King Cobra. The Straw Hats raced across its sands to stop Crocodile's Baroque Works — and uncovered the Poneglyph recording the ancient weapon Pluton's location.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['V','Vivi','#FFD740','rgba(255,200,0,0.2)'],['C','Crocodile','#9090FF','rgba(100,100,255,0.18)'],['Z','Zoro','#7FD47F','rgba(100,200,100,0.18)']],
    greeting: "Alabasta — desert sands, ancient weapons, Baroque Works. Ask me about Crocodile's plan, the Poneglyph, or Vivi's farewell."
  },
  jaya: {
    eyebrow: 'Paradise · Sky Island Saga',
    title: 'Jaya',
    tags: ['Arc: Jaya', 'Ch. 218–236', 'Ep. 144–152'],
    lore: "A lawless island where the crew sought information about Sky Island. They met Bellamy the Hyena here, and the legend of the great warrior Montblanc Cricket unlocked the path to Skypiea.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['Z','Zoro','#7FD47F','rgba(100,200,100,0.2)'],['B','Bellamy','#8888CC','rgba(100,100,180,0.2)'],['C','Cricket','#C88040','rgba(180,120,50,0.18)']],
    greeting: "Jaya — the lawless island and gateway to the sky. Ask me about Bellamy, Montblanc Cricket, or how they reached Skypiea."
  },
  skypiea: {
    eyebrow: 'Paradise · Sky Island Saga',
    title: 'Skypiea',
    tags: ['Arc: Skypiea', 'Ch. 237–302', 'Ep. 153–195'],
    lore: "A mysterious island in the sky reached via the Knock Up Stream. Home to the ancient civilization of Shandora and the self-proclaimed god Enel — a user of the Goro Goro no Mi.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['E','Enel','#FFD740','rgba(255,220,0,0.2)'],['W','Wyper','#FF8C42','rgba(200,80,20,0.2)'],['R','Robin','#7B68EE','rgba(100,80,200,0.18)']],
    greeting: "Skypiea — the floating island above clouds. Ask me about Enel's god complex, the Shandorian city, or the ancient Poneglyph."
  },
  longrong: {
    eyebrow: 'Paradise · Water 7 Saga',
    title: 'Long Ring Long Land',
    tags: ['Arc: Davy Back Fight', 'Ch. 303–321', 'Ep. 207–219'],
    lore: "A peculiar flat island where the crew was challenged to a Davy Back Fight by the Foxy Pirates — a series of games where the winner takes crew members from the loser.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['F','Foxy','#CC6688','rgba(180,80,100,0.2)'],['N','Nami','#FF9C50','rgba(255,150,60,0.18)'],['Z','Zoro','#7FD47F','rgba(100,200,100,0.18)']],
    greeting: "Long Ring Long Land — the Davy Back Fight island. Ask me about the Foxy Pirates, the game rules, or how they escaped."
  },
  water7: {
    eyebrow: 'Paradise · Water 7 Saga',
    title: 'Water 7',
    tags: ['Arc: Water 7', 'Ch. 322–374', 'Ep. 229–263'],
    lore: "A city built on water, home to the world's finest shipwrights and the shadowy CP9 intelligence unit. The Going Merry received its heartbreaking diagnosis here, and Robin was taken.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['R','Robin','#7B68EE','rgba(100,80,200,0.2)'],['F','Franky','#4FC3F7','rgba(30,140,200,0.2)'],['I','Iceburg','#AADDFF','rgba(100,180,255,0.18)']],
    greeting: "Water 7 — city of canals and secrets. Ask me about Iceburg, CP9, Franky's origin, or the fate of the Going Merry."
  },
  enieslobby: {
    eyebrow: 'Paradise · Water 7 Saga',
    title: 'Enies Lobby',
    tags: ['Arc: Enies Lobby', 'Ch. 375–430', 'Ep. 264–336'],
    lore: "The island of justice — a Marine judicial fortress at the edge of a waterfall abyss. The Straw Hats declared war on the World Government to rescue Robin. Luffy rang the Golden Belfry. The Going Merry's final voyage.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['R','Robin','#7B68EE','rgba(100,80,200,0.2)'],['F','Franky','#4FC3F7','rgba(30,140,200,0.2)'],['Z','Zoro','#7FD47F','rgba(100,200,100,0.18)']],
    greeting: "Enies Lobby — the raid that changed everything. Ask me about Robin's rescue, Luffy's Gear Second debut, or the Going Merry's farewell."
  },
  thriller: {
    eyebrow: 'Paradise · Thriller Bark Saga',
    title: 'Thriller Bark',
    tags: ['Arc: Thriller Bark', 'Ch. 442–489', 'Ep. 337–381'],
    lore: "The world's largest ship turned into a ghost island by Gecko Moria. Brook joined the crew here after 50 years alone at sea — and Zoro made his greatest sacrifice to protect his captain.",
    chars: [['B','Brook','#AAAAFF','rgba(160,160,220,0.2)'],['M','Moria','#9966CC','rgba(130,80,180,0.2)'],['Z','Zoro','#7FD47F','rgba(100,200,100,0.2)'],['L','Luffy','#FF8C42','rgba(255,100,0,0.18)']],
    greeting: "Thriller Bark — ghost ship and Brook's lonely wait. Ask me about Moria's powers, Brook's past, or Zoro's sacrifice."
  },
  sabaody: {
    eyebrow: 'Paradise · Summit War Saga',
    title: 'Sabaody Archipelago',
    tags: ['Arc: Sabaody', 'Ch. 490–513', 'Ep. 385–405'],
    lore: "A mangrove archipelago just before the New World where the Straw Hats were scattered by Bartholomew Kuma. Home to the slave auction house — a dark window into the World Nobles.",
    chars: [['L','Luffy','#FF8C42','rgba(255,100,0,0.2)'],['K','Kuma','#AAAAFF','rgba(100,100,200,0.2)'],['R','Rayleigh','#FFD740','rgba(255,200,0,0.18)'],['N','Nami','#FF9C50','rgba(255,150,60,0.18)']],
    greeting: "Sabaody — gateway to the New World and the crew's darkest hour. Ask me about Rayleigh, the Celestial Dragons, or the separation."
  },
};
```

---

## Data pipeline plan

### Scraping targets (One Piece Wiki — fandom.com)
For each location key, scrape its dedicated wiki page. Priority pages:

| Location key | Wiki URL slug |
|---|---|
| foosha | Foosha_Village |
| shellstown | Shells_Town |
| orangetown | Orange_Town |
| baratie | Baratie |
| arlong | Arlong_Park |
| loguetown | Loguetown |
| twincape | Twin_Cape |
| whiskeypeak | Whiskey_Peak |
| littlegarden | Little_Garden |
| drum | Drum_Island |
| alabasta | Arabasta_Kingdom |
| jaya | Jaya |
| skypiea | Skypiea |
| longrong | Long_Ring_Long_Land |
| water7 | Water_7 |
| enieslobby | Enies_Lobby |
| thriller | Thriller_Bark |
| sabaody | Sabaody_Archipelago |

Also scrape arc-level pages for broader context (e.g. `Arabasta_Saga`, `Water_7_Arc`).

### Chunking strategy
- Chunk size: ~400 tokens with 50-token overlap
- Metadata per chunk: `{ location_key, arc, chapter_start, chapter_end, source_url }`
- The `chapter_start`/`chapter_end` fields enable spoiler-safe filtering

### Embedding + upsert
```python
# ingest.py sketch
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct

model = SentenceTransformer('all-MiniLM-L6-v2')  # 384-dim
client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

# Create collection once
client.recreate_collection(
    collection_name="one_piece_lore",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

# Per chunk:
embedding = model.encode(chunk_text).tolist()
client.upsert("one_piece_lore", points=[
    PointStruct(id=uuid, vector=embedding, payload={
        "text": chunk_text,
        "location_key": "alabasta",
        "arc": "Arabasta Saga",
        "chapter_start": 155,
        "chapter_end": 217,
        "source_url": "https://onepiece.fandom.com/wiki/Arabasta_Kingdom"
    })
])
```

---

## RAG backend plan

### FastAPI endpoint
```python
# main.py sketch
@app.post("/query")
async def query(location_key: str, question: str, max_chapter: int = 9999):
    # 1. Embed the question
    q_vec = model.encode(question).tolist()

    # 2. Retrieve top-5 chunks from Qdrant, filtered by chapter
    results = client.search(
        collection_name="one_piece_lore",
        query_vector=q_vec,
        query_filter=Filter(must=[
            FieldCondition(key="location_key", match=MatchValue(value=location_key)),
            FieldCondition(key="chapter_start", range=Range(lte=max_chapter)),
        ]),
        limit=5,
    )

    # 3. Build prompt
    context = "\n\n".join(r.payload["text"] for r in results)
    system_prompt = f"""You are a One Piece lore expert. Answer questions about {location_key} using only the provided context. Be concise, accurate, and cite chapter numbers when relevant. If the answer isn't in the context, say so.

Context:
{context}"""

    # 4. Call Groq and stream the response
    stream = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": question}],
        stream=True,
    )
    return StreamingResponse(groq_stream_generator(stream), media_type="text/event-stream")
```

---

## Frontend porting notes

The mockup HTML at `https://claude.ai/artifact/GHAjMimEt4dkBKM9jFYrgf` is the design source of truth. When porting to Next.js:

- `LOCS`, `ARC_GROUPS`, `REGION_META` → `lib/locations.ts` (TypeScript typed)
- `build_cards()` → `<ArcSection>` + `<IslandCard>` components
- `open_loc()` / `close_panel()` → React state + `useCallback`
- Side panel `panel-open` class + `right: 360px` desktop push → CSS transition on a wrapper div
- Mobile bottom sheet (72vh, `translateY`) → same CSS logic, driven by state
- Chat input → calls `/api/chat` route (Next.js proxy to FastAPI) with streaming via `fetch` + `ReadableStream`
- The `ICONS` SVG strings → inline SVG in a React `<Icon key={locationKey} />` component

### Spoiler-safe mode
Add a chapter slider or arc picker to the UI. Pass `max_chapter` to the `/query` endpoint. The backend filters Qdrant results to only return chunks where `chapter_start <= max_chapter`.

---

## Open decisions
- **Qdrant Cloud vs ChromaDB**: Qdrant for production (hosted free tier, filter support). ChromaDB locally during dev if you want zero config.
- **Embedding model**: `all-MiniLM-L6-v2` (384d, fast) vs `nomic-embed-text` (768d, better quality). Start with MiniLM.
- **Groq model**: `llama-3.1-8b-instant` for speed/free tier, `llama-3.3-70b-versatile` for quality.
- **Wiki scraping**: Use `requests` + `BeautifulSoup`, respect rate limits, cache raw HTML before processing.
