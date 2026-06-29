import type { Locale, LocalizedFact } from "./types";

export interface PanelOverlay {
  description?: string;
  tagline?: string;
  facts?: LocalizedFact[];
}

const en: Record<string, PanelOverlay> = {
  // Black holes
  m87: {
    tagline: "First Ever Imaged",
    description:
      "M87* is a supermassive black hole in the giant galaxy Messier 87. In 2019, the Event Horizon Telescope captured the first direct image of a black hole's shadow, turning a decades-long theory into visual evidence.",
    facts: [
      { k: "Type", v: "Supermassive black hole" },
      { k: "Mass", v: "~6.5 billion Suns" },
      { k: "Distance", v: "~55 million light-years" },
      { k: "Milestone", v: "First direct image (2019)" },
    ],
  },
  sgra: {
    tagline: "Heart Of The Milky Way",
    description:
      "Sagittarius A* sits at the center of our Milky Way and anchors the orbits of nearby stars. It is relatively quiet for its size, but it defines the gravitational core of our galaxy.",
    facts: [
      { k: "Type", v: "Supermassive black hole" },
      { k: "Mass", v: "~4.3 million Suns" },
      { k: "Distance", v: "~26,000 light-years" },
      { k: "Milestone", v: "EHT image released in 2022" },
    ],
  },
  gaiabh1: {
    tagline: "The Closest Candidate",
    description:
      "Gaia BH1 is the nearest known dormant black hole candidate to Earth. It was inferred from the motion of its companion star, showing how precision stellar tracking can reveal invisible compact objects.",
    facts: [
      { k: "Type", v: "Stellar-mass black hole" },
      { k: "Mass", v: "~10 Suns" },
      { k: "Distance", v: "~1,560 light-years" },
      { k: "Feature", v: "Detected via stellar wobble" },
    ],
  },
  cygx1: {
    tagline: "Historic X-Ray Source",
    description:
      "Cygnus X-1 is one of the first widely accepted black hole systems. Powerful X-rays come from hot gas pulled off its blue supergiant companion, making it a classic laboratory for accretion physics.",
    facts: [
      { k: "Type", v: "Stellar black hole binary" },
      { k: "Mass", v: "~21 Suns" },
      { k: "Distance", v: "~7,200 light-years" },
      { k: "Fame", v: "Landmark black hole candidate" },
    ],
  },
  ton618: {
    tagline: "A Quasar Giant",
    description:
      "TON 618 is an ultraluminous quasar powered by one of the most massive black holes ever estimated. Its central engine devours matter at an enormous rate and outshines entire galaxies.",
    facts: [
      { k: "Type", v: "Ultramassive black hole" },
      { k: "Mass", v: "~66 billion Suns" },
      { k: "Distance", v: "~10.4 billion light-years" },
      { k: "Host", v: "Quasar TON 618" },
    ],
  },
  gargantua: {
    tagline: "Interstellar Icon",
    description:
      "Gargantua is the fictional black hole from Interstellar. It is designed as a rapidly spinning Kerr black hole, where extreme gravity and frame dragging create dramatic lensing and strong time dilation.",
    facts: [
      { k: "Type", v: "Fictional Kerr black hole" },
      { k: "Origin", v: "Film: Interstellar (2014)" },
      { k: "Feature", v: "Extreme gravitational lensing" },
      { k: "Theme", v: "Strong time dilation" },
    ],
  },

  // Exoplanet system cards
  kepler90: {
    tagline: "Packed Eight-Planet Family",
    description:
      "Kepler-90 is the first known exoplanetary system with eight confirmed planets, matching our Solar System in count. Most of its planets orbit very close to the star, forming a compact and crowded architecture.",
    facts: [
      { k: "Distance", v: "~2,540 light-years" },
      { k: "Star Type", v: "G-type dwarf (Sun-like)" },
      { k: "Planets", v: "8 confirmed" },
      { k: "Highlight", v: "Kepler-90i found with AI" },
    ],
  },
  hd10180: {
    tagline: "Potential Planet-Count Champion",
    description:
      "HD 10180 is a Sun-like system with seven confirmed planets and additional candidates. If all candidates are confirmed, it may surpass the Solar System in total planet count.",
    facts: [
      { k: "Distance", v: "~127 light-years" },
      { k: "Star Type", v: "G-type dwarf" },
      { k: "Planets", v: "7 confirmed, up to 9 possible" },
      { k: "Status", v: "One of the richest known systems" },
    ],
  },
  trappist1: {
    tagline: "Seven Rocky Worlds",
    description:
      "TRAPPIST-1 is a compact red-dwarf system with seven Earth-size rocky planets. Several orbit within the habitable zone, making it a prime target for atmospheric and biosignature studies.",
    facts: [
      { k: "Distance", v: "~40 light-years" },
      { k: "Star Type", v: "Ultra-cool M dwarf" },
      { k: "Planets", v: "7 rocky planets" },
      { k: "Habitable Zone", v: "e, f, g are key candidates" },
    ],
  },
  hr8799: {
    tagline: "Directly Imaged Giants",
    description:
      "HR 8799 hosts four massive giant planets on wide orbits. This was one of the first systems where multiple exoplanets were directly imaged, offering rare snapshots of planets in formation-era conditions.",
    facts: [
      { k: "Distance", v: "~129 light-years" },
      { k: "Star Type", v: "A-type main-sequence star" },
      { k: "Planets", v: "4 giant planets" },
      { k: "Milestone", v: "Multi-planet direct imaging" },
    ],
  },
  psr1257: {
    tagline: "First Exoplanet System Found",
    description:
      "PSR B1257+12 was the first confirmed exoplanet system, discovered around a pulsar in 1992. Its planets likely formed or survived in an extreme post-supernova environment.",
    facts: [
      { k: "Distance", v: "~2,300 light-years" },
      { k: "Central Object", v: "Millisecond pulsar" },
      { k: "Planets", v: "3 known" },
      { k: "Milestone", v: "First confirmed exoplanet system" },
    ],
  },

  // Exoplanet host stars
  "kepler90-star": {
    description:
      "Kepler-90 is a Sun-like G-type star slightly larger than the Sun. Its tightly packed eight-planet system demonstrates how planetary systems can form in very different layouts.",
    facts: [
      { k: "Spectral Class", v: "G0V" },
      { k: "Radius", v: "~1.2 solar radii" },
      { k: "Known Planets", v: "8" },
    ],
  },
  "hd10180-star": {
    description:
      "HD 10180 is a stable G-type dwarf and a major benchmark for high-multiplicity radial-velocity systems.",
    facts: [
      { k: "Spectral Class", v: "G1V" },
      { k: "Similarity", v: "Very Sun-like" },
      { k: "Known Planets", v: "7 confirmed (+ candidates)" },
    ],
  },
  "trappist1-star": {
    description:
      "TRAPPIST-1 is an ultra-cool red dwarf only slightly larger than Jupiter. Its low luminosity allows seven planets to orbit in an extremely compact chain.",
    facts: [
      { k: "Spectral Class", v: "M8V" },
      { k: "Radius", v: "~0.12 solar radii" },
      { k: "Known Planets", v: "7" },
    ],
  },
  "hr8799-star": {
    description:
      "HR 8799 is a young, hot A-type star whose giant planets still glow in infrared, helping astronomers image them directly.",
    facts: [
      { k: "Spectral Class", v: "A5V" },
      { k: "Age", v: "~30 million years" },
      { k: "Known Planets", v: "4 directly imaged giants" },
    ],
  },
  "psr1257-star": {
    description:
      "PSR B1257+12 is a rapidly rotating neutron star. Its periodic radio pulses revealed tiny timing variations that exposed orbiting planets.",
    facts: [
      { k: "Type", v: "Millisecond pulsar" },
      { k: "Spin Rate", v: "~161 rotations per second" },
      { k: "Nature", v: "Stellar remnant (neutron star)" },
    ],
  },

  // Exoplanets - Kepler-90
  kepler90b: {
    description: "A hot inner super-Earth in the Kepler-90 system, orbiting close to its host star.",
    facts: [
      { k: "Type", v: "Super-Earth" },
      { k: "Orbital Period", v: "~7 days" },
    ],
  },
  kepler90c: {
    description: "A rocky world in a very tight orbit, receiving intense stellar radiation.",
    facts: [
      { k: "Type", v: "Rocky planet" },
      { k: "Orbital Period", v: "~8.7 days" },
    ],
  },
  kepler90i: {
    description:
      "The eighth discovered member of the system, identified with machine-learning analysis of Kepler data.",
    facts: [
      { k: "Status", v: "AI-assisted discovery" },
      { k: "Orbital Period", v: "~14.4 days" },
    ],
  },
  kepler90d: {
    description: "A mini-Neptune marking the transition from inner rocky worlds to larger outer planets.",
    facts: [
      { k: "Type", v: "Mini-Neptune" },
      { k: "Orbital Period", v: "~60 days" },
    ],
  },
  kepler90e: {
    description: "A mid-system mini-Neptune with a likely volatile-rich envelope.",
    facts: [
      { k: "Type", v: "Mini-Neptune" },
      { k: "Orbital Period", v: "~92 days" },
    ],
  },
  kepler90f: {
    description: "A cooler intermediate planet located beyond the tightly packed inner region.",
    facts: [
      { k: "Type", v: "Mini-Neptune" },
      { k: "Orbital Period", v: "~125 days" },
    ],
  },
  kepler90g: {
    description: "A larger gas-rich outer planet, substantially bigger than the inner members.",
    facts: [
      { k: "Type", v: "Gas planet" },
      { k: "Orbital Period", v: "~211 days" },
    ],
  },
  kepler90h: {
    description: "The outer giant of Kepler-90, orbiting at roughly Earth-Sun distance.",
    facts: [
      { k: "Type", v: "Gas giant" },
      { k: "Orbital Period", v: "~331 days" },
    ],
  },

  // Exoplanets - HD 10180
  hd10180b: {
    description: "A very hot inner candidate planet with an ultra-short orbital period.",
    facts: [
      { k: "Status", v: "Candidate" },
      { k: "Orbital Period", v: "~1.2 days" },
    ],
  },
  hd10180c: {
    description: "An inner Neptune-class planet confirmed through radial-velocity signals.",
    facts: [
      { k: "Type", v: "Neptune-class" },
      { k: "Orbital Period", v: "~5.8 days" },
    ],
  },
  hd10180d: {
    description: "A confirmed Neptune-class world with a short-to-medium period orbit.",
    facts: [
      { k: "Type", v: "Neptune-class" },
      { k: "Orbital Period", v: "~16 days" },
    ],
  },
  hd10180e: {
    description: "A mid-range Neptune-class planet in the system's intermediate zone.",
    facts: [
      { k: "Type", v: "Neptune-class" },
      { k: "Orbital Period", v: "~50 days" },
    ],
  },
  hd10180f: {
    description: "A colder Neptune-class planet orbiting farther from the host star.",
    facts: [
      { k: "Type", v: "Neptune-class" },
      { k: "Orbital Period", v: "~122 days" },
    ],
  },
  hd10180g: {
    description: "A long-period outer Neptune-class planet in the confirmed architecture.",
    facts: [
      { k: "Type", v: "Neptune-class" },
      { k: "Orbital Period", v: "~600 days" },
    ],
  },
  hd10180h: {
    description: "The far outer confirmed Neptune-class planet with a multi-year orbit.",
    facts: [
      { k: "Type", v: "Neptune-class" },
      { k: "Orbital Period", v: "~2,200 days" },
    ],
  },
  hd10180i: {
    description: "An additional candidate that could raise the total confirmed planet count.",
    facts: [
      { k: "Status", v: "Candidate" },
      { k: "Significance", v: "Could become the 8th confirmed planet" },
    ],
  },

  // Exoplanets - TRAPPIST-1
  trappist1b: {
    description: "The innermost TRAPPIST-1 planet, likely extremely hot and strongly irradiated.",
    facts: [
      { k: "Type", v: "Rocky planet" },
      { k: "Orbital Period", v: "~1.5 days" },
    ],
  },
  trappist1c: {
    description: "A hot rocky world often compared to a compact, irradiated Venus-like planet.",
    facts: [
      { k: "Type", v: "Rocky planet" },
      { k: "Orbital Period", v: "~2.4 days" },
    ],
  },
  trappist1d: {
    description: "A small rocky planet near the inner edge of the system's temperate region.",
    facts: [
      { k: "Type", v: "Rocky planet" },
      { k: "Orbital Period", v: "~4.0 days" },
    ],
  },
  trappist1e: {
    description: "A prime habitable-zone candidate, close in size and insolation to Earth.",
    facts: [
      { k: "Status", v: "Core habitable-zone candidate" },
      { k: "Orbital Period", v: "~6.1 days" },
    ],
  },
  trappist1f: {
    description: "A temperate planet that may host water-rich environments under the right atmosphere.",
    facts: [
      { k: "Status", v: "Habitable-zone candidate" },
      { k: "Orbital Period", v: "~9.2 days" },
    ],
  },
  trappist1g: {
    description: "The largest habitable-zone member, potentially an ocean or ice-rich world.",
    facts: [
      { k: "Status", v: "Outer habitable-zone candidate" },
      { k: "Orbital Period", v: "~12.4 days" },
    ],
  },
  trappist1h: {
    description: "The outermost known TRAPPIST-1 planet, likely cold and low-irradiation.",
    facts: [
      { k: "Type", v: "Cold rocky/icy planet" },
      { k: "Orbital Period", v: "~18.8 days" },
    ],
  },

  // Exoplanets - HR 8799
  hr8799e: {
    description: "The innermost directly imaged giant in HR 8799, still glowing from youth.",
    facts: [
      { k: "Mass", v: "~7-10 Jupiter masses" },
      { k: "Observation", v: "Direct imaging" },
    ],
  },
  hr8799d: {
    description: "A massive giant planet with an orbit wide enough for direct observation.",
    facts: [
      { k: "Mass", v: "~7-10 Jupiter masses" },
      { k: "Observation", v: "Direct imaging" },
    ],
  },
  hr8799c: {
    description: "A giant planet where atmospheric studies detect molecules like water and methane.",
    facts: [
      { k: "Mass", v: "~7-10 Jupiter masses" },
      { k: "Atmosphere", v: "Water and methane signatures" },
    ],
  },
  hr8799b: {
    description: "The outermost giant, somewhat lighter than its sibling giants but still massive.",
    facts: [
      { k: "Mass", v: "~5 Jupiter masses" },
      { k: "Observation", v: "Direct imaging" },
    ],
  },

  // Exoplanets - PSR B1257+12
  psr1257a: {
    description: "A very low-mass pulsar planet, among the smallest known exoplanets.",
    facts: [
      { k: "Mass", v: "~0.02 Earth masses" },
      { k: "Orbital Period", v: "~25 days" },
    ],
  },
  psr1257b: {
    description: "A super-Earth-mass pulsar planet in a high-radiation environment.",
    facts: [
      { k: "Mass", v: "~4 Earth masses" },
      { k: "Orbital Period", v: "~66 days" },
    ],
  },
  psr1257c: {
    description: "Another super-Earth-mass pulsar planet, dynamically linked with planet b.",
    facts: [
      { k: "Mass", v: "~4 Earth masses" },
      { k: "Orbital Period", v: "~98 days" },
    ],
  },

  // Moons (custom descriptions)
  europa: {
    description:
      "Europa's cracked ice shell likely hides a global salty ocean, making it one of the most promising places to search for life beyond Earth.",
    facts: [
      { k: "Parent", v: "Jupiter" },
      { k: "Key Feature", v: "Subsurface ocean beneath ice" },
    ],
  },
  titan: {
    description:
      "Titan is Saturn's largest moon with a thick nitrogen atmosphere, methane clouds, and hydrocarbon lakes on the surface.",
    facts: [
      { k: "Parent", v: "Saturn" },
      { k: "Key Feature", v: "Lakes and seas of liquid methane/ethane" },
    ],
  },
  io: {
    description:
      "Io is the most volcanically active world in the Solar System, heated by strong tidal forces from Jupiter and neighboring moons.",
    facts: [
      { k: "Parent", v: "Jupiter" },
      { k: "Key Feature", v: "Extreme tidal volcanism" },
    ],
  },
  ganymede: {
    description:
      "Ganymede is the largest moon in the Solar System and the only moon known to possess its own intrinsic magnetic field.",
    facts: [
      { k: "Parent", v: "Jupiter" },
      { k: "Key Feature", v: "Largest moon with intrinsic magnetosphere" },
    ],
  },
  callisto: {
    description:
      "Callisto is an ancient, heavily cratered moon with a deep impact history and possible buried salty layers.",
    facts: [
      { k: "Parent", v: "Jupiter" },
      { k: "Key Feature", v: "Old heavily cratered surface" },
    ],
  },
  triton: {
    description:
      "Triton orbits Neptune in retrograde motion, suggesting it was likely a captured Kuiper Belt object with active cryovolcanic history.",
    facts: [
      { k: "Parent", v: "Neptune" },
      { k: "Key Feature", v: "Retrograde captured moon" },
    ],
  },
  phobos: {
    description:
      "Phobos is the larger Martian moon, irregular in shape and gradually spiraling inward toward Mars.",
    facts: [
      { k: "Parent", v: "Mars" },
      { k: "Key Feature", v: "Orbit is slowly decaying" },
    ],
  },
  deimos: {
    description:
      "Deimos is Mars' smaller outer moon, smoother than Phobos and likely a captured primitive body.",
    facts: [
      { k: "Parent", v: "Mars" },
      { k: "Key Feature", v: "Small, distant, likely captured body" },
    ],
  },
  titania: {
    description:
      "Titania is the largest moon of Uranus, an icy world with giant fault canyons carved by ancient internal expansion.",
    facts: [
      { k: "Parent", v: "Uranus" },
      { k: "Key Feature", v: "Huge tectonic chasms in icy crust" },
    ],
  },

  // Station and comet
  station: {
    description:
      "This orbital station serves as a long-duration deep-space platform for observation, docking, and system-wide mission coordination.",
    facts: [
      { k: "Type", v: "Crewed orbital station" },
      { k: "Role", v: "Research, docking, and mission operations" },
      { k: "Orbit", v: "Mars vicinity operations hub" },
    ],
  },
  halley: {
    description:
      "Halley's Comet is the best-known periodic comet, returning roughly every 76 years from the outer Solar System with a bright coma and tail near perihelion.",
    facts: [
      { k: "Type", v: "Periodic comet" },
      { k: "Period", v: "~76 years" },
      { k: "Origin", v: "Short-period comet nucleus of ice and dust" },
    ],
  },
};

const ja: Record<string, PanelOverlay> = {
  // Black holes
  m87: {
    tagline: "史上初の直接撮像",
    description:
      "M87* は巨大楕円銀河 M87 の中心にある超大質量ブラックホールです。2019年、イベント・ホライズン・テレスコープがブラックホールの影を初めて直接撮像し、理論を歴史的な観測事実へ変えました。",
    facts: [
      { k: "種類", v: "超大質量ブラックホール" },
      { k: "質量", v: "太陽の約65億倍" },
      { k: "距離", v: "約5,500万光年" },
      { k: "快挙", v: "初の直接画像（2019年）" },
    ],
  },
  sgra: {
    tagline: "天の川銀河の中心",
    description:
      "いて座A* は天の川銀河の中心に位置し、周囲の恒星軌道を支配する重力源です。活動は比較的穏やかですが、銀河核そのものを定義する存在です。",
    facts: [
      { k: "種類", v: "超大質量ブラックホール" },
      { k: "質量", v: "太陽の約430万倍" },
      { k: "距離", v: "約2万6,000光年" },
      { k: "快挙", v: "EHT画像公開（2022年）" },
    ],
  },
  gaiabh1: {
    tagline: "最も近い候補天体",
    description:
      "Gaia BH1 は地球に最も近い休眠型ブラックホール候補です。伴星の運動解析から存在が示され、見えない高密度天体を恒星測位で突き止める代表例になりました。",
    facts: [
      { k: "種類", v: "恒星質量ブラックホール" },
      { k: "質量", v: "太陽の約10倍" },
      { k: "距離", v: "約1,560光年" },
      { k: "特徴", v: "伴星のふらつきで検出" },
    ],
  },
  cygx1: {
    tagline: "歴史的X線源",
    description:
      "はくちょう座X-1は、ブラックホール実在説を決定づけた代表的連星系です。青色超巨星から流入した高温ガスが強いX線を放ち、降着物理の古典的研究対象となっています。",
    facts: [
      { k: "種類", v: "恒星ブラックホール連星" },
      { k: "質量", v: "太陽の約21倍" },
      { k: "距離", v: "約7,200光年" },
      { k: "意義", v: "画期的ブラックホール候補" },
    ],
  },
  ton618: {
    tagline: "クエーサー級の怪物",
    description:
      "TON 618 は超高輝度クエーサーで、中心には観測史上最大級のブラックホール質量推定値が存在します。莫大な降着によって銀河級の光度を放ちます。",
    facts: [
      { k: "種類", v: "超巨大ブラックホール" },
      { k: "質量", v: "太陽の約660億倍" },
      { k: "距離", v: "約104億光年" },
      { k: "母天体", v: "クエーサー TON 618" },
    ],
  },
  gargantua: {
    tagline: "映画が生んだ象徴",
    description:
      "ガルガンチュアは映画『インターステラー』に登場する架空のブラックホールです。高速回転するカー時空を前提に、極端な重力レンズ効果と時間遅延が表現されています。",
    facts: [
      { k: "種類", v: "架空のカー・ブラックホール" },
      { k: "出典", v: "映画『インターステラー』（2014）" },
      { k: "特徴", v: "極端な重力レンズ効果" },
      { k: "テーマ", v: "強い時間遅延" },
    ],
  },

  // Exoplanet system cards
  kepler90: {
    tagline: "8惑星の過密ファミリー",
    description:
      "ケプラー90は、太陽系と同じ8個の惑星が確認された最初の系外惑星系です。多くの惑星が恒星近傍に密集しており、非常にコンパクトな系構造を示します。",
    facts: [
      { k: "距離", v: "約2,540光年" },
      { k: "恒星型", v: "G型矮星（太陽類似）" },
      { k: "惑星数", v: "8個確認" },
      { k: "注目点", v: "Kepler-90iはAI解析で発見" },
    ],
  },
  hd10180: {
    tagline: "惑星数王者の有力候補",
    description:
      "HD 10180 は太陽に似た恒星を中心に7個の惑星が確認され、さらに追加候補も示唆されています。候補が確定すれば、総数で太陽系を上回る可能性があります。",
    facts: [
      { k: "距離", v: "約127光年" },
      { k: "恒星型", v: "G型矮星" },
      { k: "惑星数", v: "7個確認、最大9個の可能性" },
      { k: "評価", v: "最多級の多惑星系" },
    ],
  },
  trappist1: {
    tagline: "7つの岩石世界",
    description:
      "TRAPPIST-1 は赤色矮星を回る地球サイズ級の岩石惑星7個を持つコンパクト系です。複数惑星がハビタブルゾーンにあり、大気観測と生命兆候探査の最重要ターゲットです。",
    facts: [
      { k: "距離", v: "約40光年" },
      { k: "恒星型", v: "超低温M型矮星" },
      { k: "惑星数", v: "岩石惑星7個" },
      { k: "ハビタブル候補", v: "e・f・gが中心" },
    ],
  },
  hr8799: {
    tagline: "直接撮像された巨惑星群",
    description:
      "HR 8799 は広い軌道を回る巨大惑星4個を持つ若い系です。複数の系外惑星が直接撮像された初期の代表例で、形成過程の理解に大きく貢献しています。",
    facts: [
      { k: "距離", v: "約129光年" },
      { k: "恒星型", v: "A型主系列星" },
      { k: "惑星数", v: "巨大惑星4個" },
      { k: "快挙", v: "多惑星の直接撮像" },
    ],
  },
  psr1257: {
    tagline: "最初に見つかった系外惑星系",
    description:
      "PSR B1257+12 は1992年に発見された、人類史上初の確認系外惑星系です。中心はパルサーで、超新星後の極限環境で惑星が形成・生存した可能性を示します。",
    facts: [
      { k: "距離", v: "約2,300光年" },
      { k: "中心天体", v: "ミリ秒パルサー" },
      { k: "惑星数", v: "3個" },
      { k: "歴史的意義", v: "最初の確認系外惑星系" },
    ],
  },

  // Exoplanet host stars
  "kepler90-star": {
    description:
      "ケプラー90は太陽よりやや大きいG型恒星で、8惑星が高密度に並ぶ独特の系構造を持ちます。",
    facts: [
      { k: "スペクトル型", v: "G0V" },
      { k: "半径", v: "太陽の約1.2倍" },
      { k: "確認惑星数", v: "8個" },
    ],
  },
  "hd10180-star": {
    description:
      "HD 10180 は安定したG型矮星で、多惑星系の視線速度研究における重要な基準星です。",
    facts: [
      { k: "スペクトル型", v: "G1V" },
      { k: "太陽類似度", v: "非常に高い" },
      { k: "確認惑星数", v: "7個（候補あり）" },
    ],
  },
  "trappist1-star": {
    description:
      "TRAPPIST-1 は木星よりわずかに大きい超低温赤色矮星で、低光度のため7惑星が極端に近接した軌道に並びます。",
    facts: [
      { k: "スペクトル型", v: "M8V" },
      { k: "半径", v: "太陽の約0.12倍" },
      { k: "確認惑星数", v: "7個" },
    ],
  },
  "hr8799-star": {
    description:
      "HR 8799 は若く高温なA型恒星で、巨惑星が赤外線で明るく輝くため直接観測が可能になっています。",
    facts: [
      { k: "スペクトル型", v: "A5V" },
      { k: "年齢", v: "約3,000万年" },
      { k: "確認惑星数", v: "直接撮像の巨惑星4個" },
    ],
  },
  "psr1257-star": {
    description:
      "PSR B1257+12 は高速自転する中性子星で、電波パルス周期の微小な揺らぎから周回惑星が検出されました。",
    facts: [
      { k: "種類", v: "ミリ秒パルサー" },
      { k: "自転速度", v: "毎秒約161回転" },
      { k: "本質", v: "恒星残骸（中性子星）" },
    ],
  },

  // Exoplanets - Kepler-90
  kepler90b: {
    description: "ケプラー90系の内側を回る高温スーパーアースです。",
    facts: [
      { k: "分類", v: "スーパーアース" },
      { k: "公転周期", v: "約7日" },
    ],
  },
  kepler90c: {
    description: "恒星に非常に近く、強い放射を受ける岩石惑星です。",
    facts: [
      { k: "分類", v: "岩石惑星" },
      { k: "公転周期", v: "約8.7日" },
    ],
  },
  kepler90i: {
    description: "ケプラーデータを機械学習解析して見つかった8番目のメンバーです。",
    facts: [
      { k: "状態", v: "AI支援で発見" },
      { k: "公転周期", v: "約14.4日" },
    ],
  },
  kepler90d: {
    description: "内側岩石惑星群と外側大型惑星群の中間に位置するミニネプチューンです。",
    facts: [
      { k: "分類", v: "ミニネプチューン" },
      { k: "公転周期", v: "約60日" },
    ],
  },
  kepler90e: {
    description: "揮発性成分に富む可能性が高い中距離のミニネプチューンです。",
    facts: [
      { k: "分類", v: "ミニネプチューン" },
      { k: "公転周期", v: "約92日" },
    ],
  },
  kepler90f: {
    description: "内側の過密領域の外にある、やや低温の中間惑星です。",
    facts: [
      { k: "分類", v: "ミニネプチューン" },
      { k: "公転周期", v: "約125日" },
    ],
  },
  kepler90g: {
    description: "内側メンバーより大きく、ガス成分が優勢な外側惑星です。",
    facts: [
      { k: "分類", v: "ガス惑星" },
      { k: "公転周期", v: "約211日" },
    ],
  },
  kepler90h: {
    description: "ケプラー90系の外縁を回る巨大ガス惑星です。",
    facts: [
      { k: "分類", v: "巨大ガス惑星" },
      { k: "公転周期", v: "約331日" },
    ],
  },

  // Exoplanets - HD 10180
  hd10180b: {
    description: "極端に短い周期で回る高温の内側候補惑星です。",
    facts: [
      { k: "状態", v: "候補惑星" },
      { k: "公転周期", v: "約1.2日" },
    ],
  },
  hd10180c: {
    description: "視線速度法で確認された内側の海王星級惑星です。",
    facts: [
      { k: "分類", v: "海王星級" },
      { k: "公転周期", v: "約5.8日" },
    ],
  },
  hd10180d: {
    description: "短中周期軌道を持つ、確認済みの海王星級惑星です。",
    facts: [
      { k: "分類", v: "海王星級" },
      { k: "公転周期", v: "約16日" },
    ],
  },
  hd10180e: {
    description: "系の中域を回る海王星級の中間惑星です。",
    facts: [
      { k: "分類", v: "海王星級" },
      { k: "公転周期", v: "約50日" },
    ],
  },
  hd10180f: {
    description: "より外側にある低温寄りの海王星級惑星です。",
    facts: [
      { k: "分類", v: "海王星級" },
      { k: "公転周期", v: "約122日" },
    ],
  },
  hd10180g: {
    description: "長周期で公転する外側の海王星級惑星です。",
    facts: [
      { k: "分類", v: "海王星級" },
      { k: "公転周期", v: "約600日" },
    ],
  },
  hd10180h: {
    description: "複数年スケールの軌道を持つ最外縁の確認惑星です。",
    facts: [
      { k: "分類", v: "海王星級" },
      { k: "公転周期", v: "約2,200日" },
    ],
  },
  hd10180i: {
    description: "惑星総数を押し上げる可能性を持つ追加候補天体です。",
    facts: [
      { k: "状態", v: "候補惑星" },
      { k: "意義", v: "8個目確定の可能性" },
    ],
  },

  // Exoplanets - TRAPPIST-1
  trappist1b: {
    description: "TRAPPIST-1 最内側を公転する高温の岩石惑星です。",
    facts: [
      { k: "分類", v: "岩石惑星" },
      { k: "公転周期", v: "約1.5日" },
    ],
  },
  trappist1c: {
    description: "強い恒星照射を受ける高温の岩石世界です。",
    facts: [
      { k: "分類", v: "岩石惑星" },
      { k: "公転周期", v: "約2.4日" },
    ],
  },
  trappist1d: {
    description: "温和領域の内縁付近にある小型岩石惑星です。",
    facts: [
      { k: "分類", v: "岩石惑星" },
      { k: "公転周期", v: "約4.0日" },
    ],
  },
  trappist1e: {
    description: "地球サイズに近く、ハビタブルゾーン中心の最有力候補です。",
    facts: [
      { k: "状態", v: "中心ハビタブル候補" },
      { k: "公転周期", v: "約6.1日" },
    ],
  },
  trappist1f: {
    description: "適切な大気条件なら水環境を保てる可能性がある温和惑星です。",
    facts: [
      { k: "状態", v: "ハビタブル候補" },
      { k: "公転周期", v: "約9.2日" },
    ],
  },
  trappist1g: {
    description: "ハビタブルゾーン外縁側の大型メンバーで、海洋または氷世界の可能性があります。",
    facts: [
      { k: "状態", v: "外縁ハビタブル候補" },
      { k: "公転周期", v: "約12.4日" },
    ],
  },
  trappist1h: {
    description: "TRAPPIST-1 系最外縁にある低温の小型惑星です。",
    facts: [
      { k: "分類", v: "寒冷な岩石・氷惑星" },
      { k: "公転周期", v: "約18.8日" },
    ],
  },

  // Exoplanets - HR 8799
  hr8799e: {
    description: "HR 8799 内側を回る、若さゆえ赤外線で明るい巨大惑星です。",
    facts: [
      { k: "質量", v: "木星の約7〜10倍" },
      { k: "観測", v: "直接撮像" },
    ],
  },
  hr8799d: {
    description: "広い軌道にあるため直接観測が可能な巨大惑星です。",
    facts: [
      { k: "質量", v: "木星の約7〜10倍" },
      { k: "観測", v: "直接撮像" },
    ],
  },
  hr8799c: {
    description: "大気スペクトルに水やメタンの兆候が確認された巨大惑星です。",
    facts: [
      { k: "質量", v: "木星の約7〜10倍" },
      { k: "大気", v: "水・メタンの兆候" },
    ],
  },
  hr8799b: {
    description: "兄弟惑星よりやや軽いが依然として巨大な最外縁メンバーです。",
    facts: [
      { k: "質量", v: "木星の約5倍" },
      { k: "観測", v: "直接撮像" },
    ],
  },

  // Exoplanets - PSR B1257+12
  psr1257a: {
    description: "極低質量で、既知の中でも最小級に属するパルサー惑星です。",
    facts: [
      { k: "質量", v: "地球の約0.02倍" },
      { k: "公転周期", v: "約25日" },
    ],
  },
  psr1257b: {
    description: "強い放射環境にあるスーパーアース質量級のパルサー惑星です。",
    facts: [
      { k: "質量", v: "地球の約4倍" },
      { k: "公転周期", v: "約66日" },
    ],
  },
  psr1257c: {
    description: "b惑星と力学的に関連する、同程度質量のパルサー惑星です。",
    facts: [
      { k: "質量", v: "地球の約4倍" },
      { k: "公転周期", v: "約98日" },
    ],
  },

  // Moons (custom descriptions)
  europa: {
    description:
      "エウロパは割れ目だらけの氷殻の下に全球海を持つ可能性が高く、地球外生命探査の最有力候補の一つです。",
    facts: [
      { k: "主星", v: "木星" },
      { k: "主要特徴", v: "氷殻下の地下海" },
    ],
  },
  titan: {
    description:
      "タイタンは濃い窒素大気を持つ土星最大の衛星で、表面にはメタン雲や液体炭化水素の湖・海が存在します。",
    facts: [
      { k: "主星", v: "土星" },
      { k: "主要特徴", v: "液体メタン・エタンの湖と海" },
    ],
  },
  io: {
    description:
      "イオは太陽系で最も火山活動が活発な天体で、木星と周辺衛星の潮汐力により内部が強く加熱されています。",
    facts: [
      { k: "主星", v: "木星" },
      { k: "主要特徴", v: "極端な潮汐加熱火山活動" },
    ],
  },
  ganymede: {
    description:
      "ガニメデは太陽系最大の衛星で、衛星として唯一、固有の磁場を持つことが確認されています。",
    facts: [
      { k: "主星", v: "木星" },
      { k: "主要特徴", v: "最大衛星かつ固有磁場を保持" },
    ],
  },
  callisto: {
    description:
      "カリストは古い衝突痕で覆われた衛星で、太古の衝突史を色濃く残す天体です。",
    facts: [
      { k: "主星", v: "木星" },
      { k: "主要特徴", v: "古くクレーター密度が高い表面" },
    ],
  },
  triton: {
    description:
      "トリトンは海王星を逆行公転する特異な衛星で、カイパーベルト起源の捕獲天体と考えられています。",
    facts: [
      { k: "主星", v: "海王星" },
      { k: "主要特徴", v: "逆行する捕獲衛星" },
    ],
  },
  phobos: {
    description:
      "フォボスは火星の大きい方の衛星で、不規則形状を持ち、長期的には火星へ接近していく軌道にあります。",
    facts: [
      { k: "主星", v: "火星" },
      { k: "主要特徴", v: "軌道が徐々に減衰" },
    ],
  },
  deimos: {
    description:
      "ダイモスは火星の小型外側衛星で、フォボスより滑らかな外観を持つ捕獲起源候補です。",
    facts: [
      { k: "主星", v: "火星" },
      { k: "主要特徴", v: "小型で遠方、捕獲起源の可能性" },
    ],
  },
  titania: {
    description:
      "チタニアは天王星最大の衛星で、内部膨張の痕跡とみられる巨大な断層谷が氷地殻を走っています。",
    facts: [
      { k: "主星", v: "天王星" },
      { k: "主要特徴", v: "巨大な地殻断裂谷" },
    ],
  },

  // Station and comet
  station: {
    description:
      "この軌道ステーションは、観測・ドッキング・広域任務管制を担う長期運用型の深宇宙拠点です。",
    facts: [
      { k: "種類", v: "有人軌道ステーション" },
      { k: "役割", v: "研究・ドッキング・任務運用" },
      { k: "運用軌道", v: "火星近傍の作戦ハブ" },
    ],
  },
  halley: {
    description:
      "ハレー彗星は最も有名な周期彗星で、約76年ごとに太陽へ接近し、明るいコマと尾を形成します。",
    facts: [
      { k: "種類", v: "周期彗星" },
      { k: "周期", v: "約76年" },
      { k: "起源", v: "氷と塵でできた短周期彗星核" },
    ],
  },
};

export const PANELS: Record<Exclude<Locale, "zh">, Record<string, PanelOverlay>> = {
  en,
  ja,
};

export function getPanelOverlay(
  id: string,
  locale: Locale
): PanelOverlay | undefined {
  if (locale === "zh") return undefined;
  return PANELS[locale][id];
}

export function localizePanelFields(
  id: string,
  locale: Locale,
  zh: { description: string; tagline?: string; facts: LocalizedFact[] }
): { description: string; tagline?: string; facts: LocalizedFact[] } {
  const overlay = getPanelOverlay(id, locale);
  if (!overlay) return zh;
  return {
    description: overlay.description ?? zh.description,
    tagline: overlay.tagline,
    facts: overlay.facts ?? zh.facts,
  };
}
