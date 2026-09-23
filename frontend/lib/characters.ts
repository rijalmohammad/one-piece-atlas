export type Faction =
  | "Straw Hats"
  | "Marines"
  | "Warlords"
  | "Yonko"
  | "Revolutionaries"
  | "Antagonists"
  | "Allies";

export interface Character {
  name: string;
  initial: string;
  color: string;
  bg: string;
  faction: Faction;
  role: string;
  devilFruit?: string;
  devilFruitType?: "Paramecia" | "Zoan" | "Logia";
  debutArc: string;
  debutChapter: number;
  description: string;
  bounty?: string;
  imageFile?: string;
  abilities?: string;
  keyMoments?: string[];
  bountyHistory?: { amount: string; note: string }[];
}

export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const CHARACTERS: Character[] = [
  // ── STRAW HATS ────────────────────────────────────────────────────────
  {
    name: "Monkey D. Luffy",
    initial: "L",
    color: "#FF8C42",
    bg: "rgba(255,100,0,0.18)",
    faction: "Straw Hats",
    role: "Captain",
    devilFruit: "Gomu Gomu no Mi",
    devilFruitType: "Paramecia",
    debutArc: "Romance Dawn Arc",
    debutChapter: 1,
    description:
      "Aspiring Pirate King who ate the Gomu Gomu no Mi, turning his body into rubber. Driven by his dream and inspired by Shanks, he assembles the Straw Hat Pirates.",
    bounty: "300,000,000",
    imageFile: "monkey-d-luffy.png",
    abilities:
      "Rubber body grants immunity to blunt force and electricity. Signature moves: Gum-Gum Pistol, Gum-Gum Bazooka, Gum-Gum Rocket, and Gum-Gum Gatling. At Enies Lobby unlocks Gear Second (blood-pump acceleration) and Gear Third (bone inflation). At Marineford demonstrates unconscious Conqueror's Haki. Lacks swordsmanship, navigation, or cooking — raw strength and instinct.",
    keyMoments: [
      "Receives Shanks's straw hat and vows to become Pirate King (Ch. 1)",
      "Recruits Zoro, Nami, Usopp, and Sanji to form the core crew (Ch. 3–68)",
      "Defeats Arlong and liberates Nami's village (Ch. 95)",
      "Enters the Grand Line for the first time at Reverse Mountain (Ch. 101)",
      "Defeats Crocodile three times in Arabasta — the last using blood (Ch. 211)",
      "Reaches Skypiea and defeats the self-proclaimed god Enel (Ch. 296)",
      "Defeats CP9 agent Rob Lucci at Enies Lobby to rescue Robin (Ch. 423)",
      "First knocked unconscious by Bartholomew Kuma at Thriller Bark (Ch. 485)",
      "Arrives at Marineford with Whitebeard's fleet to rescue Ace (Ch. 550)",
      "Loses Ace to Akainu; collapses and is rescued by Trafalgar Law (Ch. 574)",
    ],
    bountyHistory: [
      { amount: "30,000,000", note: "Issued after defeating Arlong (East Blue)" },
      { amount: "100,000,000", note: "Issued after defeating Crocodile (Alabasta)" },
      { amount: "300,000,000", note: "Issued after defeating Rob Lucci and declaring war on the World Government (Enies Lobby)" },
    ],
  },
  {
    name: "Roronoa Zoro",
    initial: "Z",
    color: "#7FD47F",
    bg: "rgba(100,200,100,0.18)",
    faction: "Straw Hats",
    role: "Swordsman / First Mate",
    debutArc: "Romance Dawn Arc",
    debutChapter: 3,
    description:
      "World's greatest swordsman aspirant. Wields three swords and fights with Santoryu. Made a vow at Shells Town to never lose again — and paid dearly at Thriller Bark.",
    bounty: "120,000,000",
    imageFile: "roronoa-zoro.png",
    abilities:
      "Three-sword style (Santoryu): holds a blade in each hand and one in his mouth. Key techniques include Oni Giri, 108 Pound Phoenix, and Shishi Sonson. Can use Two-sword and One-sword styles in extremity. Trains relentlessly; capable of cutting steel with hardened swords. Possesses Conqueror's Haki unconsciously (later confirmed).",
    keyMoments: [
      "Captured by Marines at Shells Town; makes a vow to never lose again (Ch. 5)",
      "First major fight: defeats the three-sword user Cabaji (Ch. 15)",
      "Defeated by Dracule Mihawk and bears his greatest scar (Ch. 51)",
      "Defeats Mr. 1 (Daz Bones) — the first time he cuts steel (Ch. 194)",
      "Fights Kaku at Enies Lobby with twin swords after Kaku's Giraffe awakening (Ch. 407)",
      "Endures all of Luffy's pain at Thriller Bark, telling Kuma 'nothing happened' (Ch. 485)",
    ],
    bountyHistory: [
      { amount: "60,000,000", note: "Issued after the Arabasta incident" },
      { amount: "120,000,000", note: "Raised after Enies Lobby" },
    ],
  },
  {
    name: "Nami",
    initial: "N",
    color: "#FF9C50",
    bg: "rgba(255,150,60,0.18)",
    faction: "Straw Hats",
    role: "Navigator",
    debutArc: "Orange Town Arc",
    debutChapter: 8,
    description:
      "Brilliant cartographer and weather expert. Spent years under Arlong's rule to buy back her village. Obtains the Clima-Tact at Alabasta.",
    bounty: "16,000,000",
    imageFile: "nami.png",
    abilities:
      "Master navigator with encyclopedic weather knowledge. Wields the Clima-Tact (a weather-manipulating staff given by Usopp in Alabasta), upgraded to Perfect Clima-Tact in Water 7. Can read the New World's atmospheric conditions. No direct combat Devil Fruit; relies on deception, weather manipulation, and Luffy as a living weapon.",
    keyMoments: [
      "Revealed as an Arlong pirate spy; her tragic backstory exposed (Ch. 77–95)",
      "Luffy places his hat on her head and sends the crew to fight Arlong (Ch. 81)",
      "Receives the Clima-Tact from Usopp before the Arabasta arc (Ch. 190)",
      "Uses Perfect Clima-Tact to defeat Miss Doublefinger in Arabasta (Ch. 195)",
      "Navigates through Knock-Up Stream to reach Skypiea (Ch. 238)",
      "Helps plan the Enies Lobby escape route on Franky's ships (Ch. 395)",
    ],
    bountyHistory: [
      { amount: "16,000,000", note: "Issued after Enies Lobby" },
    ],
  },
  {
    name: "Usopp",
    initial: "U",
    color: "#C89040",
    bg: "rgba(180,130,40,0.18)",
    faction: "Straw Hats",
    role: "Sniper",
    debutArc: "Syrup Village Arc",
    debutChapter: 23,
    description:
      "Son of the pirate Yasopp, chronic liar turned brave sniper. Gains Sogeking's mask identity at Enies Lobby to save Robin.",
    bounty: "30,000,000",
    imageFile: "usopp.png",
    abilities:
      "Expert marksman with a slingshot (Ginga Pachinko, later Kabuto). Crafts specialty ammunition: fire stars, smoke balls, and Usopp's Impact Dials. Inventor of various gadgets. Possesses natural Observation Haki (later unlocked). Known to rely on deception and elaborate setups to defeat stronger opponents.",
    keyMoments: [
      "Defends Syrup Village from Captain Kuro alongside the crew (Ch. 39)",
      "Develops Usopp's Factory to craft ammunition and tools throughout the journey",
      "Temporarily leaves the crew over the Going Merry dispute — fights Luffy (Ch. 326)",
      "Assumes identity of Sogeking to burn the World Government flag at Enies Lobby (Ch. 398)",
      "Defeats Mr. 4 and Miss Merry Christmas in Arabasta with sheer endurance (Ch. 193)",
    ],
    bountyHistory: [
      { amount: "30,000,000", note: "Issued under 'Sogeking' alias after Enies Lobby" },
    ],
  },
  {
    name: "Sanji",
    initial: "S",
    color: "#FFD740",
    bg: "rgba(255,200,0,0.18)",
    faction: "Straw Hats",
    role: "Cook",
    debutArc: "Baratie Arc",
    debutChapter: 43,
    description:
      "Raised by chef Zeff on Baratie. Never uses his hands in a fight — kicks only. Born in the North Blue as part of the Vinsmoke family, though he hides it.",
    bounty: "77,000,000",
    imageFile: "sanji.png",
    abilities:
      "Black Leg style: fights exclusively with kicks to protect his chef's hands. Signature techniques include Diable Jambe (igniting his leg with friction to burn opponents), Poêle à Frire Spectre, and Party Table Kick Course. Exceptional speed and agility, nearly matching Luffy in aerial combat. Survival cook who can feed hundreds from nothing.",
    keyMoments: [
      "Backstory revealed: stranded with Zeff on a rocky reef, Zeff gave all the food to young Sanji (Ch. 57)",
      "Fights Gin and Don Krieg to protect the Baratie (Ch. 67)",
      "Infiltrates Arabasta disguised to scout — defeats Mr. 2 Bon Clay (Ch. 196)",
      "Rescues Robin from CP9's Nico extraction at Water 7 using stealth (Ch. 364)",
      "Fights Jabra (Wolf CP9) with Diable Jambe for the first time at Enies Lobby (Ch. 408)",
      "Held Ivankov and guards at Impel Down; rescues crew at Marineford (Ch. 541)",
    ],
    bountyHistory: [
      { amount: "77,000,000", note: "Issued after Enies Lobby; poster misidentified his face" },
    ],
  },
  {
    name: "Tony Tony Chopper",
    initial: "C",
    color: "#FF9FC2",
    bg: "rgba(255,120,180,0.18)",
    faction: "Straw Hats",
    role: "Doctor",
    devilFruit: "Hito Hito no Mi",
    devilFruitType: "Zoan",
    debutArc: "Drum Island Arc",
    debutChapter: 134,
    description:
      "A reindeer who ate the Human-Human Fruit and became a doctor under Dr. Hiriluk and Dr. Kureha on Drum Island. Can transform into multiple forms with Rumble Ball.",
    bounty: "50",
    imageFile: "tony-tony-chopper.png",
    abilities:
      "Hito Hito no Mi grants three natural forms: reindeer, human, and hybrid (Walk Point, Brain Point, Heavy Point). The Rumble Ball drug unlocks four additional transformations (Jumping Point, Guard Point, Arm Point, Horn Point) for three minutes each — exceeding three risks a berserk Monster Point. Trained in medicine by Dr. Kureha; can diagnose any illness.",
    keyMoments: [
      "Backstory: outcast reindeer who befriended Dr. Hiriluk; his death inspired Chopper to become a doctor (Ch. 141–145)",
      "Joined the crew after fighting Dr. Kureha's Snow Snow challenge (Ch. 149)",
      "Defeats Wapol's chess soldiers using Arm Point and Horn Point (Ch. 148)",
      "Goes berserk in Monster Point form against the Foxy Pirates (filler)",
      "Fights Kumadori at Enies Lobby; briefly enters Monster Point without Rumble Ball (Ch. 406)",
    ],
    bountyHistory: [
      { amount: "50", note: "World Government mistook him for a pet; the insultingly low bounty is a running joke" },
    ],
  },
  {
    name: "Nico Robin",
    initial: "R",
    color: "#7B68EE",
    bg: "rgba(100,80,200,0.18)",
    faction: "Straw Hats",
    role: "Archaeologist",
    devilFruit: "Hana Hana no Mi",
    devilFruitType: "Paramecia",
    debutArc: "Little Garden Arc",
    debutChapter: 114,
    description:
      "Sole survivor of Ohara, the island of archaeologists destroyed by the World Government. Joined as Miss All Sunday of Baroque Works, then defected to the Straw Hats.",
    bounty: "80,000,000",
    imageFile: "nico-robin.png",
    abilities:
      "Hana Hana no Mi: can sprout copies of any body part from any surface. 'Clutch' breaks limbs by sprouting arms around opponents. Can create giant body parts and perform Gigantesco Mano after Enies Lobby. Also a world-class archaeologist — one of the only people alive who can read Poneglyphs.",
    keyMoments: [
      "Survived Buster Call on Ohara at age 8; has been a fugitive for 20 years (Ch. 391–395)",
      "Served as Crocodile's partner Miss All Sunday; helped the Straw Hats escape Arabasta (Ch. 212)",
      "Surrendered herself to CP9 at Water 7 to protect the crew from Buster Call (Ch. 348)",
      "'I want to live!' — her cry at Enies Lobby moves the crew to declare war on the World Government (Ch. 398)",
      "Defeats CP9 agent Yama at Skypiea (Ch. 264)",
    ],
    bountyHistory: [
      { amount: "79,000,000", note: "Childhood bounty placed by World Government after Ohara" },
      { amount: "80,000,000", note: "Raised after Enies Lobby" },
    ],
  },
  {
    name: "Franky",
    initial: "F",
    color: "#4FC3F7",
    bg: "rgba(30,140,200,0.18)",
    faction: "Straw Hats",
    role: "Shipwright",
    debutArc: "Water 7 Arc",
    debutChapter: 329,
    description:
      "Self-modified cyborg shipwright raised by Tom in Water 7. Built the Thousand Sunny after burning the Going Merry. Body runs on cola.",
    bounty: "44,000,000",
    imageFile: "franky.png",
    abilities:
      "Cyborg body powered by cola: Franky Centaur, Coup de Boo (air cannon from his rear), Franky Fireball, and Strong Hammer. His front is nearly indestructible; his back is exposed. Rebuilt himself using scrap metal from Tom's workshop. Master shipwright who designed and built the Thousand Sunny from Adam Wood.",
    keyMoments: [
      "Backstory: shipwright Tom's apprentice; Tom saved him from execution but was taken by the World Government (Ch. 352–355)",
      "Stole the Straw Hats' money to fund the Thousand Sunny — fought and was defeated by Luffy (Ch. 335)",
      "Joined the crew after building the Thousand Sunny; burns the Going Merry with the crew (Ch. 438)",
      "Fights Spandam and Fukuro at Enies Lobby (Ch. 410)",
      "Defeated by Kuma alongside the crew at Thriller Bark (Ch. 485)",
    ],
    bountyHistory: [
      { amount: "44,000,000", note: "Issued after Enies Lobby" },
    ],
  },
  {
    name: "Brook",
    initial: "B",
    color: "#AAAAFF",
    bg: "rgba(160,160,220,0.18)",
    faction: "Straw Hats",
    role: "Musician",
    devilFruit: "Yomi Yomi no Mi",
    devilFruitType: "Paramecia",
    debutArc: "Thriller Bark Arc",
    debutChapter: 443,
    description:
      "Living skeleton who waited 50 years alone at sea. His soul returned to his body after death thanks to the Revive-Revive Fruit — but found only bones. Promised to return to Laboon.",
    bounty: "33,000,000",
    imageFile: "brook.png",
    abilities:
      "Yomi Yomi no Mi: died once but soul revived; bones animated by soul energy. Soul energy allows him to infuse his blade with cold (later explicit ice-based Haki). Lightweight skeleton body grants speed and evasion. Expert musician and swordsman who uses Soul Solid (post-timeskip) — pre-timeskip style is fast iaijutsu draws.",
    keyMoments: [
      "Backstory: sole survivor of the Rumbar Pirates; waited 50 years alone for a promise to Laboon (Ch. 488)",
      "Meets Laboon at Reverse Mountain — the whale who waited for the Rumbar Pirates (Ch. 102)",
      "Encountered by the Straw Hats in the Florian Triangle (Ch. 442)",
      "Fights Ryuma and loses his shadow to Moria (Ch. 461)",
      "Recovers his shadow after Luffy defeats Moria (Ch. 481)",
      "Joined the Straw Hats as musician after Thriller Bark (Ch. 489)",
    ],
    bountyHistory: [
      { amount: "33,000,000", note: "Issued after Thriller Bark incident" },
    ],
  },
  // ── MARINES ───────────────────────────────────────────────────────────
  {
    name: "Smoker",
    initial: "Sm",
    color: "#AAAAAA",
    bg: "rgba(150,150,150,0.18)",
    faction: "Marines",
    role: "Captain → Commodore",
    devilFruit: "Moku Moku no Mi",
    devilFruitType: "Logia",
    debutArc: "Loguetown Arc",
    debutChapter: 96,
    description:
      "Righteous Marine who first encountered Luffy at Loguetown. Uses Smoke-Smoke Logia powers and Seastone Jitte. Relentlessly pursues Luffy throughout the pre-timeskip.",
    imageFile: "smoker.png",
    abilities:
      "Moku Moku no Mi Logia: can transform into, create, and control smoke. Intangible to non-Haki attacks. Wields a Seastone-tipped Jitte that nullifies Devil Fruit powers on contact. Promoted from Captain to Commodore during the pre-timeskip. One of the few Marines shown to question Absolute Justice.",
    keyMoments: [
      "Corners Luffy at Loguetown before Monkey D. Dragon's intervention saves Luffy (Ch. 100)",
      "Pursues the Straw Hats to Arabasta; briefly allies with them against Baroque Works (Ch. 176)",
      "Fights Crocodile in the desert to buy time for the Straw Hats (Ch. 202)",
      "Encounters the crew again at Marineford during the Summit War (Ch. 565)",
    ],
  },
  {
    name: "Tashigi",
    initial: "Ta",
    color: "#88BBFF",
    bg: "rgba(80,140,220,0.18)",
    faction: "Marines",
    role: "Ensign → Lieutenant",
    debutArc: "Loguetown Arc",
    debutChapter: 96,
    description:
      "Marine swordswoman under Smoker who eerily resembles Zoro's late childhood friend Kuina. Driven to confiscate all named swords from pirates.",
    imageFile: "tashigi.png",
    abilities:
      "Skilled swordswoman with encyclopedic knowledge of all named blades in the world. Wields Shigure, a Meito katana. Studies swordsmanship to take great swords out of criminal hands. Her resemblance to Zoro's dead friend Kuina is a source of complicated emotions for him.",
    keyMoments: [
      "First encountered at Loguetown sword shop identifying blades (Ch. 96)",
      "Accidentally gets Zoro's Sandai Kitetsu and Yubashiri swords; returns them (Ch. 98)",
      "Fights Zoro in Loguetown; Zoro refuses to finish the fight because of her resemblance to Kuina (Ch. 98)",
      "Pursues the crew to Arabasta alongside Smoker (Ch. 176)",
    ],
  },
  {
    name: "Monkey D. Garp",
    initial: "Gp",
    color: "#AAAAFF",
    bg: "rgba(100,100,200,0.18)",
    faction: "Marines",
    role: "Vice Admiral",
    debutArc: "Post-Enies Lobby Arc",
    debutChapter: 431,
    description:
      "Luffy's grandfather and legendary Marine hero who cornered Gold Roger multiple times. Refused repeated promotions to Admiral. Trained Luffy and Coby.",
    imageFile: "monkey-d-garp.png",
    abilities:
      "Legendary physical strength without any Devil Fruit — routinely throws cannonballs like bullets. Conqueror's Haki and Armament Haki mastery. Trained both Luffy (by throwing him into ravines) and Coby. Trusted Gold Roger enough to raise his son Ace. His choice not to execute Roger himself caused the Great Pirate Era.",
    keyMoments: [
      "Raised Luffy and Dragon's son Ace in secret to protect them from the World Government",
      "Reveals to the Water 7 crew that Dragon is Luffy's father (Ch. 432)",
      "Appears at Marineford to fight Whitebeard — conflicted between duty and family (Ch. 566)",
      "Attempts to save Ace himself at Marineford but is stopped by Sengoku (Ch. 573)",
    ],
  },
  {
    name: "Sengoku",
    initial: "Se",
    color: "#D4B060",
    bg: "rgba(180,150,60,0.18)",
    faction: "Marines",
    role: "Fleet Admiral",
    debutArc: "Jaya Arc",
    debutChapter: 234,
    description:
      "Fleet Admiral during the pre-timeskip. Possesses the Hito Hito no Mi, Model: Daibutsu (revealed at Marineford). Orchestrated Marine response at the Summit War.",
    imageFile: "sengoku.png",
    abilities:
      "Hito Hito no Mi, Model: Daibutsu (Mythical Zoan): transforms into a giant golden Buddha capable of shockwave palm strikes. Extreme Haki and tactical genius. Hid Ace's lineage as Roger's son for years. Resigned as Fleet Admiral after Marineford; replaced by Akainu.",
    keyMoments: [
      "Reveals publicly that Portgas D. Ace is Gold Roger's son at Marineford (Ch. 552)",
      "Transforms into his Daibutsu form during the Summit War (Ch. 567)",
      "Attempts to have Ace executed to prevent chaos; stops Garp from saving him (Ch. 573)",
      "Steps down as Fleet Admiral after the war's fallout (post-Ch. 580)",
    ],
  },
  {
    name: "Aokiji (Kuzan)",
    initial: "Ak",
    color: "#88CCFF",
    bg: "rgba(80,180,220,0.18)",
    faction: "Marines",
    role: "Admiral",
    devilFruit: "Hie Hie no Mi",
    devilFruitType: "Logia",
    debutArc: "Long Ring Long Land Arc",
    debutChapter: 303,
    description:
      "Ice Admiral with a lazy disposition but overwhelming power. First Admiral encountered by the Straw Hats. Single-handedly froze half of the ocean around Marineford.",
    imageFile: "aokiji.png",
    abilities:
      "Hie Hie no Mi Logia: creates and becomes ice. Can freeze vast tracts of ocean instantly. Signature moves: Ice Age (freezes sea surface), Ice Block Pheasant Beak, and Ice Saber. Froze Robin's body for 20 years as symbolic mercy. Lost his left leg in a ten-day battle with Akainu on Punk Hazard.",
    keyMoments: [
      "Single-handedly defeats Robin and the entire Straw Hat crew at Long Ring Long Land (Ch. 319–321)",
      "Secretly lets Robin go rather than reporting her capture to Headquarters (Ch. 321)",
      "Freezes the ocean around Marineford for the Summit War (Ch. 557)",
      "Battles Akainu for ten days after the war over who becomes Fleet Admiral (Ch. 650, revealed post-timeskip)",
    ],
  },
  {
    name: "Kizaru (Borsalino)",
    initial: "Kz",
    color: "#FFEE88",
    bg: "rgba(220,200,50,0.18)",
    faction: "Marines",
    role: "Admiral",
    devilFruit: "Pika Pika no Mi",
    devilFruitType: "Logia",
    debutArc: "Sabaody Archipelago Arc",
    debutChapter: 490,
    description:
      "Light Admiral who dismantled the Sabaody Archipelago and scattered the Straw Hats with ease. Attacks at the speed of light. Laid-back but casually devastating.",
    imageFile: "kizaru.png",
    abilities:
      "Pika Pika no Mi Logia: controls and becomes light. Moves at the speed of light; kicks and laser beams are effectively instantaneous. Signature moves: Yasakani no Magatama (laser barrage), Sacred Yata Mirror (reflective defense), Amaterasu. Fought Silvers Rayleigh to a standstill at Sabaody — the first indication of Rayleigh's tier.",
    keyMoments: [
      "Arrives at Sabaody Archipelago and effortlessly dismantles the Eleven Supernovas (Ch. 505)",
      "Faces Silvers Rayleigh in single combat to prevent him from leaving with the Straw Hats (Ch. 508)",
      "Sends the Straw Hats scattering when Kuma teleports them (Ch. 512)",
      "Participates in the Battle of Marineford; battles Whitebeard's division commanders (Ch. 560)",
    ],
  },
  {
    name: "Akainu (Sakazuki)",
    initial: "Ai",
    color: "#FF4444",
    bg: "rgba(200,40,40,0.18)",
    faction: "Marines",
    role: "Admiral",
    devilFruit: "Magu Magu no Mi",
    devilFruitType: "Logia",
    debutArc: "Marineford Arc",
    debutChapter: 550,
    description:
      "Magma Admiral with absolute justice. Killed Portgas D. Ace at Marineford with a magma fist through the chest. The single event that defines the Summit War's tragedy.",
    imageFile: "akainu.png",
    abilities:
      "Magu Magu no Mi Logia: the hottest substance in nature — magma overpowers even Ace's fire. Signature moves: Ryusei Kazan (meteorite magma fists), Meigo (massive magma fist). Extreme believer in Absolute Justice — will sacrifice allies to eliminate threats. Defeated Aokiji after a ten-day duel to claim the Fleet Admiral seat.",
    keyMoments: [
      "Kills several Marine defectors to prevent secrets from leaking — shocking even allies (Ch. 554)",
      "Drives a magma fist through Portgas D. Ace's torso to prevent his escape (Ch. 574)",
      "Severely wounds Whitebeard, who still dies standing (Ch. 576)",
      "Pursues Luffy relentlessly through the war; injures him several times",
      "Becomes Fleet Admiral after defeating Aokiji (revealed post-timeskip)",
    ],
  },
  // ── WARLORDS ──────────────────────────────────────────────────────────
  {
    name: "Dracule Mihawk",
    initial: "Mi",
    color: "#CC8822",
    bg: "rgba(180,100,20,0.18)",
    faction: "Warlords",
    role: "Greatest Swordsman",
    debutArc: "Baratie Arc",
    debutChapter: 49,
    description:
      "The world's greatest swordsman who wields the black blade Yoru. Defeated Zoro and left a scar on his chest. The ultimate goal Zoro strives to surpass.",
    imageFile: "dracule-mihawk.png",
    abilities:
      "Wields Yoru, a black-bladed Zanbato — the world's greatest blade. Renowned for both extreme long-range and close-range sword mastery. Can cut ocean waves at long distance. Fought Shanks to a draw before Shanks lost his arm, after which he lost interest in the rivalry. Also a Warlord of the Sea, though he participates minimally.",
    keyMoments: [
      "Devastates Don Krieg's fleet with a single slash (Ch. 49)",
      "Defeats Zoro at the Baratie with a small dagger while Yoru is sheathed (Ch. 51)",
      "Scars Zoro across the chest as a lesson; tells him to find a stronger master (Ch. 51)",
      "Participates in the Marineford War; hunts Luffy across the battlefield (Ch. 561)",
      "Stops hunting Luffy after Jinbe shields him — respects Luffy's will (Ch. 575)",
    ],
  },
  {
    name: "Crocodile",
    initial: "Cr",
    color: "#9090FF",
    bg: "rgba(100,100,255,0.18)",
    faction: "Warlords",
    role: "Baroque Works Mastermind",
    devilFruit: "Suna Suna no Mi",
    devilFruitType: "Logia",
    debutArc: "Little Garden Arc",
    debutChapter: 113,
    description:
      "Former Warlord and head of Baroque Works who nearly destroyed Arabasta. Luffy defeated him three times — the last after discovering his weakness: blood. Revoked of title after defeat.",
    bounty: "81,000,000",
    imageFile: "crocodile.png",
    abilities:
      "Suna Suna no Mi Logia: can become, create, and control sand. Desert Spada (a sand sword that cuts through earth), Ground Death (dehydrates the ground and anything it touches), and Sandstorm attacks. Weakness: water or blood negates his intangibility. Replaced his left hand with a gold poison hook.",
    keyMoments: [
      "Operates Baroque Works from the shadows as 'Mr. 0' (Ch. 100+)",
      "Defeats Luffy twice — the first by dehydration, the second by desert collapse (Ch. 200–201)",
      "Defeated for the first time after Luffy uses his blood to bypass his Logia intangibility (Ch. 211)",
      "Captured and sent to Impel Down Level 6 after his defeat (Ch. 211)",
      "Breaks out of Impel Down with Luffy and joins Marineford (Ch. 540)",
      "Allies briefly with Whitebeard's forces to fight Marines at Marineford (Ch. 559)",
    ],
    bountyHistory: [
      { amount: "81,000,000", note: "Pre-Warlord bounty" },
    ],
  },
  {
    name: "Donquixote Doflamingo",
    initial: "Do",
    color: "#FF88BB",
    bg: "rgba(200,80,120,0.18)",
    faction: "Warlords",
    role: "Warlord / Heavenly Yaksha",
    devilFruit: "Ito Ito no Mi",
    devilFruitType: "Paramecia",
    debutArc: "Jaya Arc",
    debutChapter: 234,
    description:
      "Flamboyant Warlord introduced at the Jaya arc. Controls people like puppets with his String-String powers. True role as Dressrosa kingpin revealed post-timeskip.",
  },
  {
    name: "Bartholomew Kuma",
    initial: "Ku",
    color: "#AAAAFF",
    bg: "rgba(100,100,200,0.18)",
    faction: "Warlords",
    role: "Warlord / PX Prototype",
    devilFruit: "Nikyu Nikyu no Mi",
    devilFruitType: "Paramecia",
    debutArc: "Thriller Bark Arc",
    debutChapter: 233,
    description:
      "Warlord who can repel anything including pain and air. Scattered the Straw Hats across the world at Sabaody. A Revolutionary turned into a mindless weapon by Vegapunk.",
    imageFile: "bartholomew-kuma.png",
    abilities:
      "Nikyu Nikyu no Mi: paw pads repel any physical substance including pain, air, and light at the speed of light. Can compress air into 'Pad Ho' blasts. Prototype for the Pacifista program — his body was gradually replaced with cybernetics until his free will was erased. Retains a Bible always.",
    keyMoments: [
      "Appears first at Thriller Bark — agrees to let the crew go if Zoro endures Luffy's pain (Ch. 485)",
      "Scatters the Straw Hats at Sabaody when Luffy draws the Admirals — each sent to a different island (Ch. 512)",
      "Secretly programmed by Kuma (while still sentient) to protect the Thousand Sunny until a crew member returns (revealed Ch. 603)",
      "Fights Luffy at Marineford in PX form but cannot speak or be reasoned with (Ch. 563)",
    ],
  },
  {
    name: "Boa Hancock",
    initial: "Ha",
    color: "#FF6688",
    bg: "rgba(200,60,100,0.18)",
    faction: "Warlords",
    role: "Empress of Amazon Lily",
    devilFruit: "Mero Mero no Mi",
    devilFruitType: "Paramecia",
    debutArc: "Amazon Lily Arc",
    debutChapter: 516,
    description:
      "Pirate Empress and Warlord who rules Amazon Lily. Her Love-Love Fruit turns those attracted to her to stone. Helped Luffy reach Impel Down to save Ace.",
    imageFile: "boa-hancock.png",
    abilities:
      "Mero Mero no Mi: petrifies those who feel attraction (love or admiration) via kicks, arrows, and beams. The World's Most Beautiful Woman title means almost everyone is susceptible. Also a skilled haki user with extreme Conqueror's Haki. Snake-Snake Style combat uses her python companions Salome, Marigold, and Sandersonia.",
    keyMoments: [
      "Backstory: enslaved by the Celestial Dragons as a child alongside her sisters; bears their mark (Ch. 521)",
      "Refuses to report Luffy's presence on Amazon Lily — falls in love with him (Ch. 521)",
      "Bribes the Marines with her Warlord status to escort Luffy to Impel Down (Ch. 524)",
      "Fights alongside Luffy at Marineford to rescue Ace (Ch. 563–574)",
    ],
  },
  // ── YONKO / TOP TIERS ─────────────────────────────────────────────────
  {
    name: "Shanks",
    initial: "Sh",
    color: "#FF6B6B",
    bg: "rgba(200,50,50,0.18)",
    faction: "Yonko",
    role: "Yonko / Red Hair Pirates Captain",
    debutArc: "Romance Dawn Arc",
    debutChapter: 1,
    description:
      "Yonko who inspired Luffy to become a pirate and gave him his treasured straw hat. Lost his arm saving Luffy from a Sea King. Famously has no Devil Fruit.",
    imageFile: "shanks.png",
    abilities:
      "No Devil Fruit — relies entirely on Haki mastery. Considered one of the four greatest pirates alive. His Conqueror's Haki is so powerful a single glance stopped an entire Sea King. Fought Whitebeard to a draw. The most mysterious of the Yonko — his true goals are unknown. Carries the Gryphon saber.",
    keyMoments: [
      "Was a cabin boy under Gold Roger at the height of the pirate era (Ch. 506)",
      "Saves young Luffy from a Sea King at the cost of his left arm — gives him his hat (Ch. 1)",
      "Ten years later, leaves Foosha Village and sets off — inspiring Luffy's vow (Ch. 1)",
      "Stops the Marineford War personally by arriving with his full crew (Ch. 579)",
      "Meets with the Gorosei (Five Elders) in Mariejois — the implications are never explained (Ch. 907, post-timeskip)",
    ],
  },
  {
    name: "Edward Newgate (Whitebeard)",
    initial: "Wb",
    color: "#AADDFF",
    bg: "rgba(100,180,220,0.18)",
    faction: "Yonko",
    role: "Strongest Man in the World",
    devilFruit: "Gura Gura no Mi",
    devilFruitType: "Paramecia",
    debutArc: "Marineford Arc",
    debutChapter: 552,
    description:
      "Called the world's strongest man. His Tremor-Tremor Fruit can create quakes capable of destroying islands. Died standing upright at Marineford — the last era of piracy.",
    imageFile: "whitebeard.png",
    abilities:
      "Gura Gura no Mi: creates seismic shockwaves by cracking the air itself. Considered the power to destroy the world. Wields the bisento Murakumogiri, one of the 12 Supreme Grade blades. Fought Gold Roger to a draw. At Marineford he fought while dying from multiple diseases — survived 267 sword wounds, 152 bullets, and 46 cannon shots before finally falling.",
    keyMoments: [
      "Commands the largest pirate fleet in history — 16 division commanders (Ch. 234)",
      "Marches his fleet directly to Marineford to rescue Ace (Ch. 551–552)",
      "Splits the sea in half at Marineford — demonstrates the world-ending scope of Gura Gura (Ch. 557)",
      "Receives a fatal blow from Blackbeard's crew and the Marineford Marines after Ace dies (Ch. 576)",
      "Dies standing upright — his body never fell in battle — the most powerful pirate of his era (Ch. 576)",
    ],
  },
  {
    name: "Marshall D. Teach (Blackbeard)",
    initial: "Bb",
    color: "#3333CC",
    bg: "rgba(40,40,160,0.18)",
    faction: "Antagonists",
    role: "Blackbeard Pirates Captain",
    devilFruit: "Yami Yami no Mi",
    devilFruitType: "Logia",
    debutArc: "Jaya Arc",
    debutChapter: 223,
    description:
      "Dark-Dark Fruit user who can nullify other Devil Fruits on contact. Betrayed Whitebeard's crew by killing Thatch. Triggered the events of Marineford by capturing Ace.",
    bounty: "0",
    imageFile: "blackbeard.png",
    abilities:
      "Yami Yami no Mi Logia: uniquely cannot become intangible — absorbs damage like a normal person. The darkness can nullify any Devil Fruit power on contact, and creates black holes that crush anything. After Marineford somehow acquires Gura Gura no Mi from Whitebeard's corpse — the first person to wield two Devil Fruits simultaneously.",
    keyMoments: [
      "Kills Thatch in Whitebeard's crew to steal the Yami Yami no Mi (Ch. 576, backstory)",
      "Encounters Luffy's crew at Jaya, revealing his dream is also to be Pirate King (Ch. 222)",
      "Captures Ace and turns him over to the Marines in exchange for a Warlord seat (Ch. 440)",
      "Arrives at Marineford with Level 6 Impel Down prisoners (Ch. 565)",
      "Attacks Whitebeard's corpse to somehow steal the Gura Gura fruit (Ch. 576)",
    ],
    bountyHistory: [
      { amount: "0", note: "Exchanged Ace for the Warlord title — had no prior bounty as an unknown pirate" },
    ],
  },
  // ── ANTAGONISTS ───────────────────────────────────────────────────────
  {
    name: "Buggy",
    initial: "Bu",
    color: "#FF4040",
    bg: "rgba(200,40,40,0.18)",
    faction: "Antagonists",
    role: "Buggy Pirates Captain",
    devilFruit: "Bara Bara no Mi",
    devilFruitType: "Paramecia",
    debutArc: "Orange Town Arc",
    debutChapter: 9,
    description:
      "Clown pirate who ate the Chop-Chop Fruit, separating his body into pieces. Former Roger Pirates cabin boy alongside Shanks. Became an unlikely hero to his crew despite himself.",
    bounty: "15,000,000",
    imageFile: "buggy.png",
    abilities:
      "Bara Bara no Mi: separates body into levitating pieces immune to slashing. Buggy Ball explosive cannonballs are his signature weapon — massive area damage. Weakness: his feet cannot fly and he cannot reattach pieces knocked far away. His flashy style and accidental luck earn him a devoted crew.",
    keyMoments: [
      "Rival to Shanks during Roger Pirates days; ate the Chop Fruit accidentally (Ch. 19 flashback)",
      "First antagonist Luffy defeats by stretching his arm into a spring and flicking Buggy's head (Ch. 14)",
      "Imprisoned in Impel Down Level 2; accidentally freed by Luffy (Ch. 526)",
      "Accidentally becomes a hero at Marineford — is catapulted and mistaken for a Whitebeard ally (Ch. 558)",
      "Becomes a Warlord after Marineford due to his reputation — entirely by accident (post-timeskip)",
    ],
    bountyHistory: [
      { amount: "15,000,000", note: "East Blue bounty" },
    ],
  },
  {
    name: "Arlong",
    initial: "Ar",
    color: "#20A0C0",
    bg: "rgba(20,140,180,0.18)",
    faction: "Antagonists",
    role: "Arlong Pirates Captain",
    debutArc: "Arlong Park Arc",
    debutChapter: 69,
    description:
      "Fish-Man who enslaved Nami's village of Cocoyashi for years. Believed Fish-Men were superior to humans. Defeated by Luffy after Nami's tearful plea.",
    bounty: "20,000,000",
    imageFile: "arlong.png",
    abilities:
      "Fishman physiology: ten times human strength and can breathe underwater. Wields Kiribachi — a massive circular saw-toothed sword. Can regrow teeth like a shark. Used a corrupt Marine deal to remain in East Blue despite his bounty. Led the Arlong Pirates from Arlong Park, building a fish-man utopia on the backs of humans.",
    keyMoments: [
      "Enslaved Nami at age 10 — forced her to draw sea charts to buy her village's freedom (Ch. 77)",
      "Bribed Marine Captain Nezumi to overlook his operation in East Blue (Ch. 94)",
      "Defeated by Luffy after Nami's plea — Luffy destroys Arlong Park's tower (Ch. 95)",
    ],
    bountyHistory: [
      { amount: "20,000,000", note: "East Blue bounty — highest in the region before Luffy" },
    ],
  },
  {
    name: "Enel",
    initial: "En",
    color: "#FFD740",
    bg: "rgba(255,220,0,0.18)",
    faction: "Antagonists",
    role: "Self-proclaimed God of Skypiea",
    devilFruit: "Goro Goro no Mi",
    devilFruitType: "Logia",
    debutArc: "Skypiea Arc",
    debutChapter: 240,
    description:
      "Former ruler of Skypiea who believed himself a god. His Rumble-Rumble Logia granted near omniscience via Mantra. Defeated by Luffy — a natural rubber counter — and departed to the moon.",
    imageFile: "enel.png",
    abilities:
      "Goro Goro no Mi Logia: generates, becomes, and controls lightning. Mantra (Observation Haki) lets him hear and predict all within a massive radius — making him effectively omniscient in Skypiea. Can restart his own heart with electricity. Power output is 200 million volts. Has a golden Milky Dial-powered Ark Maxim for travel.",
    keyMoments: [
      "Destroyed his home island Birka and its people for their 'impurity' (Ch. 278 flashback)",
      "Rules Skypiea from the ancient city of Shandora using gold extraction (Ch. 239)",
      "His Mantra is fully countered by Luffy's rubber body — the first and only person Enel cannot predict (Ch. 290)",
      "Defeated by Luffy at the top of the Giant Jack beanstalk (Ch. 295)",
      "Departs to the moon aboard Ark Maxim — discovers ancient robots there (Ch. 296)",
    ],
  },
  {
    name: "Rob Lucci",
    initial: "Lu",
    color: "#888888",
    bg: "rgba(120,120,120,0.18)",
    faction: "Antagonists",
    role: "CP9 Agent",
    devilFruit: "Neko Neko no Mi, Model: Leopard",
    devilFruitType: "Zoan",
    debutArc: "Water 7 Arc",
    debutChapter: 329,
    description:
      "CP9's most powerful agent and the World Government's top assassin at Enies Lobby. His Zoan Leopard form and Rokushiki techniques nearly killed Luffy.",
    imageFile: "rob-lucci.png",
    abilities:
      "Neko Neko no Mi, Model: Leopard grants full leopard and hybrid transformation with extreme speed and claws. Six Powers (Rokushiki) master: Soru (speed), Geppo (sky-walking), Shigan (finger gun), Rankyaku (leg wind blades), Tekkai (iron body), and Kami-e (paper body). Developed the Rokuogan — a concentrated Rokushiki shockwave that bypasses defenses.",
    keyMoments: [
      "Infiltrates Water 7 as a shipwright named Tom's Workers for five years (Ch. 329)",
      "Revealed as CP9's strongest agent with an unmatched Doriki of 4000 (Ch. 373)",
      "Defeats Luffy twice during the Enies Lobby battle before losing to Gear Second+Third combo (Ch. 422)",
      "Took orders from Spandam; executed Iceburg's attempted assassination (Ch. 353)",
    ],
  },
  {
    name: "Gecko Moria",
    initial: "Mo",
    color: "#9966CC",
    bg: "rgba(130,80,180,0.18)",
    faction: "Antagonists",
    role: "Warlord / Thriller Bark Captain",
    devilFruit: "Kage Kage no Mi",
    devilFruitType: "Paramecia",
    debutArc: "Thriller Bark Arc",
    debutChapter: 448,
    description:
      "Warlord who commands Thriller Bark, the world's largest ship. Steals and transplants shadows, building an undead army. Wields Doppelman, his own shadow as a fighter.",
    imageFile: "gecko-moria.png",
    abilities:
      "Kage Kage no Mi: can steal shadows and insert them into corpses to animate Zombie soldiers, or into himself for 'Shadow's Asgard' power amplification. Doppelman is his own shadow manifested as a fighter. When defeated, all stolen shadows return to their owners. Lost his entire crew to Kaidou in the New World — the trauma made him obsessed with power without effort.",
    keyMoments: [
      "Rules the Thriller Bark ghost ship — largest vessel in the world (Ch. 443)",
      "Steals the crew's shadows via Perona's Negative Hollows weakening them (Ch. 462)",
      "Absorbs hundreds of shadows into himself for 'Shadows Asgard' form (Ch. 478)",
      "Defeated by Luffy's 'Nightmare Luffy' form (Ch. 480)",
      "Survived Kizaru's attempt to kill him after Marineford — still alive post-war (Ch. 581)",
    ],
  },
  // ── ALLIES ────────────────────────────────────────────────────────────
  {
    name: "Portgas D. Ace",
    initial: "Ac",
    color: "#FF8C00",
    bg: "rgba(220,100,0,0.18)",
    faction: "Allies",
    role: "Whitebeard Pirates 2nd Division Commander",
    devilFruit: "Mera Mera no Mi",
    devilFruitType: "Logia",
    debutArc: "Drum Island Arc",
    debutChapter: 127,
    description:
      "Luffy's sworn older brother and son of Gold Roger. Flame-Flame Logia user. Captured by Blackbeard and executed at Marineford — the tragedy that breaks Luffy's spirit.",
    bounty: "550,000,000",
    imageFile: "portgas-d-ace.png",
    abilities:
      "Mera Mera no Mi Logia: controls and becomes fire. Signature moves: Hiken (fire pistol), Entei (flame pillar), and Jūjika (fire cross). Possesses Conqueror's Haki — knocked out 50,000 men unconsciously in Impel Down. Son of Gold Roger; hid his heritage and rejected his father's name until the end.",
    keyMoments: [
      "Made a vow with Luffy and Sabo as brothers in the Goa Kingdom (Ch. 586 flashback)",
      "Became 2nd Division Commander of the Whitebeard Pirates (Ch. 159)",
      "First appeared bringing Luffy a letter and fighting Smoker (Ch. 159)",
      "Captured by Blackbeard after fighting him; surrendered to the Marines (Ch. 440)",
      "Executed at Marineford by Akainu's magma fist — dies in Luffy's arms (Ch. 574)",
    ],
    bountyHistory: [
      { amount: "550,000,000", note: "Final pre-capture bounty as Whitebeard's 2nd Division Commander" },
    ],
  },
  {
    name: "Silvers Rayleigh",
    initial: "Ra",
    color: "#FFD740",
    bg: "rgba(220,180,40,0.18)",
    faction: "Allies",
    role: "Dark King / Roger Pirates First Mate",
    debutArc: "Sabaody Archipelago Arc",
    debutChapter: 500,
    description:
      "First Mate of Gold Roger's crew, called the 'Dark King'. Coats the Thousand Sunny in Haki at Sabaody. Later teaches Luffy Haki on Rusukaina during the 2-year training.",
    imageFile: "silvers-rayleigh.png",
    abilities:
      "Master of all three forms of Haki with no Devil Fruit. Conqueror's Haki so refined he can target individuals in a crowd without affecting others. Armament and Observation at Admiral level. Staggeringly fast sword style. In retirement works as a coating mechanic in Sabaody. In his prime was considered equal to the Admirals.",
    keyMoments: [
      "First Mate of Gold Roger — was with him at Laugh Tale when they found the One Piece (Ch. 506)",
      "Retires after Roger's death — becomes a slave liberator and coating mechanic in Sabaody (Ch. 500)",
      "Fights Kizaru to a standstill at Sabaody Archipelago to let the Straw Hats escape (Ch. 508)",
      "Coats the Thousand Sunny with Yarukiman Resin for underwater travel (Ch. 511)",
      "Reaches Luffy on Rusukaina after the war — trains him in Haki for two years (Ch. 597)",
    ],
  },
  {
    name: "Monkey D. Dragon",
    initial: "Dr",
    color: "#44AA44",
    bg: "rgba(50,150,50,0.18)",
    faction: "Revolutionaries",
    role: "Revolutionary Army Leader",
    debutArc: "Loguetown Arc",
    debutChapter: 100,
    description:
      "The most wanted criminal in the world and leader of the Revolutionary Army. Luffy's father — a fact Garp reveals at Water 7. Saved Luffy from Smoker at Loguetown.",
    imageFile: "monkey-d-dragon.png",
    abilities:
      "Power unknown pre-timeskip; widely believed to control wind/weather based on events at Loguetown. The World Government has him listed as the most dangerous man alive — the Revolutionary Army he leads has destabilized multiple nation-states. Son of Garp, father of Luffy — deliberately kept these ties secret.",
    keyMoments: [
      "Appears at Loguetown as wind lifts Luffy from Morgan's block and lightning strikes Buggy (Ch. 100)",
      "Revealed by Garp to be Luffy's father at Water 7 (Ch. 432)",
      "Leads the Revolutionary Army from their base at Baltigo (revealed Ch. 586)",
      "Watches Goa Kingdom burn as a young man — the injustice that drove him to revolution (Ch. 586 flashback)",
    ],
  },
  {
    name: "Nefertari Vivi",
    initial: "Vi",
    color: "#FFD740",
    bg: "rgba(255,200,0,0.18)",
    faction: "Allies",
    role: "Princess of Arabasta",
    debutArc: "Reverse Mountain Arc",
    debutChapter: 103,
    description:
      "Princess of Arabasta who went undercover in Baroque Works as Miss Wednesday. Traveled with the Straw Hats through the Arabasta Saga, choosing to stay in her kingdom rather than join.",
    imageFile: "nefertari-vivi.png",
    abilities:
      "Peacock Slashers: spinning sharp rings attached to fingertips used as cutting weapons. Strong swimmer. Primarily relies on wit, charm, and leadership rather than combat. Her decision to stay in Arabasta rather than join the crew — while holding up the crew's sign of friendship — is one of the most iconic farewells in the series.",
    keyMoments: [
      "Infiltrated Baroque Works as Miss Wednesday alongside Igaram (Ch. 103)",
      "Revealed as princess of Arabasta to the Straw Hats; crew agrees to help her save her kingdom (Ch. 110)",
      "Convinces the rebel army to stop fighting in Arabasta (Ch. 204)",
      "Chooses to stay in Arabasta rather than join the crew (Ch. 216)",
      "Her Arabasta family later becomes a close ally of the crew — Cobra vouches for Robin's character",
    ],
  },
  {
    name: "Trafalgar D. Water Law",
    initial: "La",
    color: "#4FC3F7",
    bg: "rgba(30,140,200,0.18)",
    faction: "Allies",
    role: "Heart Pirates Captain / Surgeon of Death",
    devilFruit: "Ope Ope no Mi",
    devilFruitType: "Paramecia",
    debutArc: "Sabaody Archipelago Arc",
    debutChapter: 498,
    description:
      "Surgeon of Death who saved Luffy at Marineford. His Op-Op Fruit creates a 'Room' where he can rearrange anything. One of the Eleven Supernovas at Sabaody.",
    bounty: "200,000,000",
    imageFile: "trafalgar-law.png",
    abilities:
      "Ope Ope no Mi: creates a spherical 'ROOM' where Law can spatially rearrange anything inside. Shambles teleports objects and people, Takt levitates objects, and Counter Shock delivers a surgical defibrillator strike. The fruit can theoretically grant immortality to another person — at the cost of the user's own life. Trained as a doctor; surgical precision in combat.",
    keyMoments: [
      "One of the Eleven Supernovas with a bounty of 200,000,000 at Sabaody (Ch. 498)",
      "Saves Luffy's life by submarine after Marineford — performs surgery to stabilize him (Ch. 580)",
      "His backstory: joined the Donquixote Pirates as a dying child from Flevance (revealed post-timeskip, Ch. 762)",
      "Appears at Sabaody and briefly allies with Eustass Kid (Ch. 498)",
    ],
    bountyHistory: [
      { amount: "200,000,000", note: "Sabaody Archipelago — one of the Eleven Supernovas" },
    ],
  },
  {
    name: "Marco",
    initial: "Ma",
    color: "#4488FF",
    bg: "rgba(50,100,220,0.18)",
    faction: "Allies",
    role: "Whitebeard Pirates 1st Division Commander",
    devilFruit: "Tori Tori no Mi, Model: Phoenix",
    devilFruitType: "Zoan",
    debutArc: "Marineford Arc",
    debutChapter: 553,
    description:
      "Whitebeard's right-hand man. His Mythical Phoenix Zoan grants blue regenerative flames that heal any wound. Led the charge at Marineford to rescue Ace.",
    abilities:
      "Tori Tori no Mi, Model: Phoenix — a Mythical Zoan that grants regenerative blue flames in all forms. The flames heal his own wounds continuously, making him one of the hardest combatants to injure permanently. Full phoenix flight and hybrid human-phoenix forms. As 1st Division Commander, is second only to Whitebeard in the crew.",
    keyMoments: [
      "Serves as Whitebeard's 1st Division Commander and primary battlefield leader (Ch. 553)",
      "Leads the initial Marineford advance through Admiral fire (Ch. 563)",
      "Fights Kizaru and the three Admirals to protect Whitebeard (Ch. 564–567)",
      "Faces Admiral Kizaru in a prolonged exchange showing the upper boundary of Zoan regeneration (Ch. 564)",
    ],
  },
  {
    name: "Gol D. Roger",
    initial: "R",
    color: "#FFD740",
    bg: "rgba(220,180,40,0.18)",
    faction: "Allies",
    role: "Pirate King / Roger Pirates Captain",
    debutArc: "Romance Dawn Arc",
    debutChapter: 1,
    description:
      "The legendary Pirate King who conquered the Grand Line and left the One Piece at Laugh Tale. His execution in Loguetown sparked the Great Pirate Era. Father of Portgas D. Ace.",
    imageFile: "gol-d-roger.png",
    abilities:
      "No Devil Fruit — yet fought Whitebeard (the world's strongest man) to a perfect draw using pure Haki mastery. Possessed all three Haki types at their peak — his Conqueror's Haki could affect even powerful pirates. Wielded the sword Ace. His death was voluntary — he surrendered to the Marines knowing it would ignite the world.",
    keyMoments: [
      "Conquered the Grand Line and reached the final island 'Laugh Tale' — the only crew to do so (Ch. 506 flashback)",
      "Fought Whitebeard to a draw across multiple legendary clashes (flashback)",
      "Surrendered to the Marines after contracting an incurable disease (flashback)",
      "Spoke his final words from the scaffold in Loguetown — 'My treasure? If you want it, you can have it. Search for it! I left everything this world has to offer there!' — starting the Great Pirate Era (Ch. 1)",
      "Confided the existence of the Void Century to Rayleigh and the crew at Laugh Tale (flashback)",
    ],
  },
  {
    name: "Jinbe",
    initial: "Ji",
    color: "#4488CC",
    bg: "rgba(40,120,180,0.18)",
    faction: "Allies",
    role: "Knight of the Sea / Fish-Man Karate Master",
    debutArc: "Impel Down Arc",
    debutChapter: 528,
    description:
      "Former Warlord of the Sea and Fish-Man Karate grandmaster. Renounced his Warlord title to oppose the World Government. Saved Luffy after the Battle of Marineford.",
    imageFile: "jinbe.png",
    abilities:
      "Fish-Man Karate grandmaster — Fish-Man physiology gives him extreme strength and underwater dominance. Fishman Karate techniques include Arabesque Brick Fist and Vagabond Drill. Can use seawater as projectile slashes. Blood type compatibility with humans — donated blood to save Luffy after the war. No Devil Fruit.",
    keyMoments: [
      "Former captain of the Sun Pirates — Fish-Man crew founded by Fisher Tiger (flashback)",
      "Became a Warlord of the Sea after the Sun Pirates disbanded (flashback)",
      "Imprisoned in Impel Down Level 6 for refusing Marineford orders (Ch. 528)",
      "Renounces his Warlord title publicly to fight alongside Whitebeard at Marineford (Ch. 557)",
      "Donates blood to the dying Luffy and carries him through the war's aftermath (Ch. 579)",
    ],
  },
];

export const FACTIONS: Faction[] = [
  "Straw Hats",
  "Marines",
  "Warlords",
  "Yonko",
  "Antagonists",
  "Allies",
  "Revolutionaries",
];

export const FACTION_COLORS: Record<Faction, string> = {
  "Straw Hats":      "rgba(255,100,0,0.12)",
  "Marines":         "rgba(50,100,200,0.12)",
  "Warlords":        "rgba(100,100,100,0.12)",
  "Yonko":           "rgba(180,30,30,0.12)",
  "Antagonists":     "rgba(150,20,20,0.12)",
  "Allies":          "rgba(50,180,100,0.12)",
  "Revolutionaries": "rgba(50,150,50,0.12)",
};

export const FACTION_BORDER: Record<Faction, string> = {
  "Straw Hats":      "rgba(255,100,0,0.3)",
  "Marines":         "rgba(50,100,200,0.3)",
  "Warlords":        "rgba(150,150,150,0.3)",
  "Yonko":           "rgba(180,30,30,0.3)",
  "Antagonists":     "rgba(180,30,30,0.3)",
  "Allies":          "rgba(50,180,100,0.3)",
  "Revolutionaries": "rgba(50,150,50,0.3)",
};
