/* AnimalQuest — shared game data
 * Used by both single-player (animalquest/index.html) and multiplayer.
 * Created by JcWoLF76.
 *
 * Animal entry shape:
 *   id, name, scientific, emoji, rarity, category, regions[]
 *   setting?:    'wild' (default — North American wildlife) or 'zoo' (global)
 *   groups?:     bonus-group ids this animal belongs to
 *   roadkillable?: false to disable the roadkill button (defaults to true)
 */
(function (root) {
    'use strict';

    const RARITY = {
        common:    { label: 'Common',    points: 5,   color: '#7fbf7f' },
        uncommon:  { label: 'Uncommon',  points: 10,  color: '#5da8a8' },
        rare:      { label: 'Rare',      points: 25,  color: '#3a92e0' },
        epic:      { label: 'Epic',      points: 50,  color: '#9b59b6' },
        legendary: { label: 'Legendary', points: 100, color: '#e67e22' },
        mythic:    { label: 'Mythic',    points: 250, color: '#e84393' }
    };

    const CATEGORIES = {
        mammal:    { label: 'Mammals',    emoji: '🦊' },
        bird:      { label: 'Birds',      emoji: '🦅' },
        reptile:   { label: 'Reptiles',   emoji: '🦎' },
        amphibian: { label: 'Amphibians', emoji: '🐸' },
        fish:      { label: 'Fish & Sealife', emoji: '🐟' },
        invert:    { label: 'Inverts & Insects', emoji: '🦋' }
    };

    const ROADKILL_BONUS = 5;
    const FIRST_FINDER_BONUS = 5;
    const SPECIES_QUIZ_OPTION_COUNT = 5;

    const REGIONS = {
        northeast:           { label: 'Northeast & New England', emoji: '🍁' },
        southeast:           { label: 'Southeast & Gulf',         emoji: '🌴' },
        midwest:             { label: 'Midwest & Plains',         emoji: '🌾' },
        'mountain-west':     { label: 'Rocky Mountains',          emoji: '⛰️' },
        'pacific-northwest': { label: 'Pacific Northwest',        emoji: '🌲' },
        southwest:           { label: 'Desert Southwest',         emoji: '🌵' },
        alaska:              { label: 'Alaska & Arctic',          emoji: '❄️' },
        national:            { label: 'National (anywhere)',      emoji: '🇺🇸' },
        zoo:                 { label: 'Zoo (Anywhere)',           emoji: '🦓' }
    };

    const GROUPS = {
        // ───── US-specific (existing) ──────────────────────────────────────
        'wild-five':     { label: 'The Wild Five',        emoji: '🐺',
                           desc: 'Apex of the American wilderness',
                           members: ['gray-wolf','grizzly-bear','mountain-lion','bald-eagle','american-bison'],
                           bonus: 250 },
        'antlered':      { label: 'Antlered Royalty',     emoji: '🦌',
                           desc: 'Spot every member of the antler club',
                           members: ['white-tailed-deer','elk','moose','caribou','pronghorn'],
                           bonus: 100 },
        'backyard':      { label: 'Backyard Bandits',     emoji: '🦝',
                           desc: 'The trash-can patrol',
                           members: ['raccoon','striped-skunk','virginia-opossum','eastern-gray-squirrel','eastern-chipmunk'],
                           bonus: 50 },
        'sky-hunters':   { label: 'Sky Hunters',          emoji: '🦅',
                           desc: 'Things with wings and sharp eyes',
                           members: ['bald-eagle','red-tailed-hawk','great-horned-owl','osprey','turkey-vulture'],
                           bonus: 75 },
        'cold-blooded':  { label: 'Cold-Blooded Crew',    emoji: '🐊',
                           desc: 'Reptiles & friends',
                           members: ['american-alligator','snapping-turtle','garter-snake','horned-lizard','bullfrog'],
                           bonus: 75 },
        'waterfowl':     { label: 'Waterfowl Watch',      emoji: '🦆',
                           desc: 'Friends of the wetlands',
                           members: ['mallard','canada-goose','great-blue-heron','brown-pelican','trumpeter-swan'],
                           bonus: 60 },
        'farm-friends':  { label: 'Farm Friends',         emoji: '🐄',
                           desc: 'Spotted from the road, paddock or pasture',
                           members: ['cow','horse','pig','sheep','goat'],
                           bonus: 40 },
        'roadkill-bingo':{ label: 'Roadkill Bingo',       emoji: '🦴',
                           desc: 'A cursed achievement — five different roadkill spots',
                           special: 'anyRoadkill', threshold: 5, bonus: 75 },

        // ───── New US groups ───────────────────────────────────────────────
        'songbirds':     { label: 'All-American Songbirds', emoji: '🎵',
                           desc: 'The chorus of every backyard',
                           members: ['american-robin','northern-cardinal','blue-jay','northern-mockingbird','american-goldfinch'],
                           bonus: 60 },
        'raptor-row':    { label: 'Raptor Row',           emoji: '🦅',
                           desc: 'Sharpest eyes in the sky',
                           members: ['bald-eagle','golden-eagle','peregrine-falcon','coopers-hawk','northern-harrier'],
                           bonus: 120 },
        'owls-of-night': { label: 'Owls of the Night',    emoji: '🦉',
                           desc: 'Five sets of giant eyes after dark',
                           members: ['great-horned-owl','snowy-owl','barred-owl','barn-owl','eastern-screech-owl'],
                           bonus: 110 },
        'reptile-royalty':{ label: 'Reptile Royalty',     emoji: '👑',
                           desc: 'The rulers of scale and shell',
                           members: ['american-alligator','eastern-diamondback-rattlesnake','gila-monster','eastern-box-turtle','loggerhead-sea-turtle'],
                           bonus: 120 },
        'catch-of-day':  { label: 'Catch of the Day',     emoji: '🎣',
                           desc: 'Freshwater bucket list',
                           members: ['largemouth-bass','rainbow-trout','channel-catfish','walleye','bluegill'],
                           bonus: 75 },
        'apex-pelagics': { label: 'Apex Pelagics',        emoji: '🦈',
                           desc: 'Sharks at the top of the food chain',
                           members: ['great-white-shark','tiger-shark','hammerhead-shark','mako-shark','bull-shark'],
                           bonus: 175 },
        'whales-dolphins':{ label: 'Whales & Dolphins',   emoji: '🐋',
                           desc: 'Cetaceans of every ocean',
                           members: ['humpback-whale','blue-whale','orca','bottlenose-dolphin','gray-whale'],
                           bonus: 175 },
        'butterfly-flight':{ label: 'Butterfly Flight',   emoji: '🦋',
                           desc: 'Five wings of magic',
                           members: ['monarch-butterfly','eastern-tiger-swallowtail','painted-lady','mourning-cloak','black-swallowtail'],
                           bonus: 50 },

        // ───── Zoo / global groups ─────────────────────────────────────────
        'big-cats':      { label: 'Big Cats of the World', emoji: '🐅',
                           desc: 'Every roar deserves a bonus',
                           members: ['african-lion','bengal-tiger','leopard-african','cheetah','jaguar','snow-leopard','mountain-lion'],
                           bonus: 250 },
        'great-apes':    { label: 'The Great Apes',       emoji: '🦍',
                           desc: 'Our nearest relatives',
                           members: ['western-gorilla','common-chimpanzee','bornean-orangutan','bonobo','sumatran-orangutan'],
                           bonus: 200 },
        'marsupial-mob': { label: 'Marsupial Mob',        emoji: '🦘',
                           desc: 'Pouches required',
                           members: ['red-kangaroo','koala','common-wombat','tasmanian-devil','red-necked-wallaby'],
                           bonus: 110 },
        'antarctic':     { label: 'Antarctic Crew',       emoji: '🐧',
                           desc: 'Bottom of the world bunch',
                           members: ['emperor-penguin','king-penguin','adelie-penguin','leopard-seal','weddell-seal'],
                           bonus: 150 },
        'sea-titans':    { label: 'Megafauna of the Sea', emoji: '🌊',
                           desc: 'Ocean giants — anywhere they swim',
                           members: ['blue-whale','whale-shark','manta-ray','great-white-shark','orca'],
                           bonus: 250 },
        'cryptid-quest': { label: 'Cryptid Quest (US)',   emoji: '👁️',
                           desc: 'You will be doubted. You will not care.',
                           members: ['sasquatch','chupacabra','jackalope'],
                           bonus: 500 },
        'world-cryptid': { label: 'World Cryptid Council', emoji: '🌍',
                           desc: 'Legends from every continent',
                           members: ['sasquatch','chupacabra','jackalope','yeti','loch-ness-monster','mokele-mbembe','kraken'],
                           bonus: 1000 }
    };

    // ────────────────────────────────────────────────────────────────────
    //   ANIMALS
    // ────────────────────────────────────────────────────────────────────
    // To keep this file scannable, animals are grouped by category and
    // (within each category) by rarity. Region codes:
    //   'northeast','southeast','midwest','mountain-west',
    //   'pacific-northwest','southwest','alaska','national'
    // 'national' on regions[] = found anywhere in the US.
    //
    // Setting defaults to 'wild'; zoo animals get setting:'zoo'.
    // Roadkillable defaults to true; explicitly false for whales, raptors,
    // alligators, mythic, etc.
    const ANIMALS = [

    // ════════════════════════════════════════════════════════════════════
    //   MAMMALS — US wildlife (~80)
    // ════════════════════════════════════════════════════════════════════

    // ── Common (5) ──
    { id:'eastern-gray-squirrel', name:'Eastern Gray Squirrel', scientific:'Sciurus carolinensis', emoji:'🐿️', rarity:'common', category:'mammal', regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','national'], groups:['backyard'] },
    { id:'fox-squirrel', name:'Fox Squirrel', scientific:'Sciurus niger', emoji:'🐿️', rarity:'common', category:'mammal', regions:['midwest','northeast','southeast','national'] },
    { id:'red-squirrel', name:'American Red Squirrel', scientific:'Tamiasciurus hudsonicus', emoji:'🐿️', rarity:'common', category:'mammal', regions:['northeast','midwest','mountain-west','pacific-northwest','alaska','national'] },
    { id:'eastern-cottontail', name:'Eastern Cottontail Rabbit', scientific:'Sylvilagus floridanus', emoji:'🐇', rarity:'common', category:'mammal', regions:['northeast','southeast','midwest','mountain-west','southwest','national'] },
    { id:'white-tailed-deer', name:'White-tailed Deer', scientific:'Odocoileus virginianus', emoji:'🦌', rarity:'common', category:'mammal', regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','national'], groups:['antlered'] },
    { id:'cow', name:'Cow (Domestic)', scientific:'Bos taurus', emoji:'🐄', rarity:'common', category:'mammal', roadkillable:false, regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','southwest','national'], groups:['farm-friends'] },
    { id:'horse', name:'Horse (Domestic)', scientific:'Equus caballus', emoji:'🐴', rarity:'common', category:'mammal', roadkillable:false, regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','southwest','national'], groups:['farm-friends'] },
    { id:'house-mouse', name:'House Mouse', scientific:'Mus musculus', emoji:'🐭', rarity:'common', category:'mammal', regions:['national'] },
    { id:'deer-mouse', name:'Deer Mouse', scientific:'Peromyscus maniculatus', emoji:'🐭', rarity:'common', category:'mammal', regions:['national'] },
    { id:'brown-rat', name:'Brown Rat', scientific:'Rattus norvegicus', emoji:'🐀', rarity:'common', category:'mammal', regions:['national'] },

    // ── Uncommon (10) ──
    { id:'raccoon', name:'Raccoon', scientific:'Procyon lotor', emoji:'🦝', rarity:'uncommon', category:'mammal', regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','national'], groups:['backyard'] },
    { id:'virginia-opossum', name:'Virginia Opossum', scientific:'Didelphis virginiana', emoji:'🐀', rarity:'uncommon', category:'mammal', regions:['northeast','southeast','midwest','pacific-northwest','national'], groups:['backyard'] },
    { id:'striped-skunk', name:'Striped Skunk', scientific:'Mephitis mephitis', emoji:'🦨', rarity:'uncommon', category:'mammal', regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','southwest','national'], groups:['backyard'] },
    { id:'eastern-chipmunk', name:'Eastern Chipmunk', scientific:'Tamias striatus', emoji:'🐿️', rarity:'uncommon', category:'mammal', regions:['northeast','midwest','mountain-west','national'], groups:['backyard'] },
    { id:'coyote', name:'Coyote', scientific:'Canis latrans', emoji:'🐺', rarity:'uncommon', category:'mammal', regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','southwest','alaska','national'] },
    { id:'groundhog', name:'Groundhog (Woodchuck)', scientific:'Marmota monax', emoji:'🦦', rarity:'uncommon', category:'mammal', regions:['northeast','midwest','southeast'] },
    { id:'pig', name:'Pig (Domestic)', scientific:'Sus scrofa domesticus', emoji:'🐖', rarity:'uncommon', category:'mammal', roadkillable:false, regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','national'], groups:['farm-friends'] },
    { id:'sheep', name:'Sheep (Domestic)', scientific:'Ovis aries', emoji:'🐑', rarity:'uncommon', category:'mammal', roadkillable:false, regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','national'], groups:['farm-friends'] },
    { id:'goat', name:'Goat (Domestic)', scientific:'Capra hircus', emoji:'🐐', rarity:'uncommon', category:'mammal', roadkillable:false, regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','southwest','national'], groups:['farm-friends'] },
    { id:'mule-deer', name:'Mule Deer', scientific:'Odocoileus hemionus', emoji:'🦌', rarity:'uncommon', category:'mammal', regions:['mountain-west','pacific-northwest','southwest'] },
    { id:'snowshoe-hare', name:'Snowshoe Hare', scientific:'Lepus americanus', emoji:'🐇', rarity:'uncommon', category:'mammal', regions:['northeast','midwest','mountain-west','pacific-northwest','alaska'] },
    { id:'black-tailed-jackrabbit', name:'Black-tailed Jackrabbit', scientific:'Lepus californicus', emoji:'🐇', rarity:'uncommon', category:'mammal', regions:['southwest','mountain-west','midwest'] },
    { id:'muskrat', name:'Muskrat', scientific:'Ondatra zibethicus', emoji:'🦫', rarity:'uncommon', category:'mammal', regions:['national'] },
    { id:'porcupine', name:'North American Porcupine', scientific:'Erethizon dorsatum', emoji:'🦔', rarity:'uncommon', category:'mammal', regions:['northeast','midwest','mountain-west','pacific-northwest','alaska'] },
    { id:'little-brown-bat', name:'Little Brown Bat', scientific:'Myotis lucifugus', emoji:'🦇', rarity:'uncommon', category:'mammal', regions:['national'] },
    { id:'big-brown-bat', name:'Big Brown Bat', scientific:'Eptesicus fuscus', emoji:'🦇', rarity:'uncommon', category:'mammal', regions:['national'] },
    { id:'mexican-free-tailed-bat', name:'Mexican Free-tailed Bat', scientific:'Tadarida brasiliensis', emoji:'🦇', rarity:'uncommon', category:'mammal', regions:['southwest','southeast','midwest'] },
    { id:'black-tailed-prairie-dog', name:'Black-tailed Prairie Dog', scientific:'Cynomys ludovicianus', emoji:'🐿️', rarity:'uncommon', category:'mammal', regions:['midwest','mountain-west'] },
    { id:'short-tailed-shrew', name:'Northern Short-tailed Shrew', scientific:'Blarina brevicauda', emoji:'🐭', rarity:'uncommon', category:'mammal', regions:['northeast','midwest','southeast'] },

    // ── Rare (25) ──
    { id:'red-fox', name:'Red Fox', scientific:'Vulpes vulpes', emoji:'🦊', rarity:'rare', category:'mammal', regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','alaska','national'] },
    { id:'gray-fox', name:'Gray Fox', scientific:'Urocyon cinereoargenteus', emoji:'🦊', rarity:'rare', category:'mammal', regions:['northeast','southeast','midwest','mountain-west','southwest'] },
    { id:'arctic-fox', name:'Arctic Fox', scientific:'Vulpes lagopus', emoji:'🦊', rarity:'rare', category:'mammal', regions:['alaska'] },
    { id:'kit-fox', name:'Kit Fox', scientific:'Vulpes macrotis', emoji:'🦊', rarity:'rare', category:'mammal', regions:['southwest'] },
    { id:'black-bear', name:'American Black Bear', scientific:'Ursus americanus', emoji:'🐻', rarity:'rare', category:'mammal', roadkillable:false, regions:['northeast','southeast','mountain-west','pacific-northwest','alaska'] },
    { id:'beaver', name:'American Beaver', scientific:'Castor canadensis', emoji:'🦫', rarity:'rare', category:'mammal', regions:['northeast','midwest','mountain-west','pacific-northwest','alaska','national'] },
    { id:'river-otter', name:'North American River Otter', scientific:'Lontra canadensis', emoji:'🦦', rarity:'rare', category:'mammal', roadkillable:false, regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','alaska'] },
    { id:'armadillo', name:'Nine-banded Armadillo', scientific:'Dasypus novemcinctus', emoji:'🦡', rarity:'rare', category:'mammal', regions:['southeast','southwest'] },
    { id:'wild-boar', name:'Wild Boar (Feral)', scientific:'Sus scrofa', emoji:'🐗', rarity:'rare', category:'mammal', regions:['southeast','southwest','pacific-northwest'] },
    { id:'american-badger', name:'American Badger', scientific:'Taxidea taxus', emoji:'🦡', rarity:'rare', category:'mammal', regions:['midwest','mountain-west','pacific-northwest'] },
    { id:'fisher', name:'Fisher', scientific:'Pekania pennanti', emoji:'🦡', rarity:'rare', category:'mammal', regions:['northeast','midwest','pacific-northwest'] },
    { id:'american-marten', name:'American Marten', scientific:'Martes americana', emoji:'🦡', rarity:'rare', category:'mammal', regions:['northeast','mountain-west','pacific-northwest','alaska'] },
    { id:'long-tailed-weasel', name:'Long-tailed Weasel', scientific:'Mustela frenata', emoji:'🦡', rarity:'rare', category:'mammal', regions:['national'] },
    { id:'mink', name:'American Mink', scientific:'Neogale vison', emoji:'🦦', rarity:'rare', category:'mammal', regions:['national'] },
    { id:'ringtail', name:'Ringtail', scientific:'Bassariscus astutus', emoji:'🦝', rarity:'rare', category:'mammal', regions:['southwest','mountain-west'] },
    { id:'kangaroo-rat', name:'Merriam\'s Kangaroo Rat', scientific:'Dipodomys merriami', emoji:'🐀', rarity:'rare', category:'mammal', regions:['southwest'] },
    { id:'pika', name:'American Pika', scientific:'Ochotona princeps', emoji:'🐭', rarity:'rare', category:'mammal', regions:['mountain-west','pacific-northwest'] },
    { id:'yellow-bellied-marmot', name:'Yellow-bellied Marmot', scientific:'Marmota flaviventris', emoji:'🦦', rarity:'rare', category:'mammal', regions:['mountain-west','pacific-northwest'] },
    { id:'hoary-marmot', name:'Hoary Marmot', scientific:'Marmota caligata', emoji:'🦦', rarity:'rare', category:'mammal', regions:['mountain-west','pacific-northwest','alaska'] },
    { id:'flying-squirrel', name:'Northern Flying Squirrel', scientific:'Glaucomys sabrinus', emoji:'🐿️', rarity:'rare', category:'mammal', regions:['northeast','midwest','pacific-northwest','alaska'] },
    { id:'harbor-seal', name:'Harbor Seal', scientific:'Phoca vitulina', emoji:'🦭', rarity:'rare', category:'mammal', regions:['pacific-northwest','northeast','alaska'] },
    { id:'california-sea-lion', name:'California Sea Lion', scientific:'Zalophus californianus', emoji:'🦭', rarity:'rare', category:'mammal', regions:['pacific-northwest'] },
    { id:'sea-otter', name:'Sea Otter', scientific:'Enhydra lutris', emoji:'🦦', rarity:'rare', category:'mammal', regions:['pacific-northwest','alaska'] },
    { id:'bottlenose-dolphin', name:'Common Bottlenose Dolphin', scientific:'Tursiops truncatus', emoji:'🐬', rarity:'rare', category:'mammal', roadkillable:false, regions:['southeast','pacific-northwest','northeast'], groups:['whales-dolphins'] },

    // ── Epic (50) ──
    { id:'moose', name:'Moose', scientific:'Alces alces', emoji:'🫎', rarity:'epic', category:'mammal', regions:['northeast','mountain-west','pacific-northwest','alaska'], groups:['antlered'] },
    { id:'elk', name:'Elk (Wapiti)', scientific:'Cervus canadensis', emoji:'🦌', rarity:'epic', category:'mammal', regions:['mountain-west','pacific-northwest','alaska'], groups:['antlered'] },
    { id:'bighorn-sheep', name:'Bighorn Sheep', scientific:'Ovis canadensis', emoji:'🐏', rarity:'epic', category:'mammal', roadkillable:false, regions:['mountain-west','southwest'] },
    { id:'mountain-goat', name:'Mountain Goat', scientific:'Oreamnos americanus', emoji:'🐐', rarity:'epic', category:'mammal', roadkillable:false, regions:['mountain-west','pacific-northwest','alaska'] },
    { id:'mountain-lion', name:'Mountain Lion (Cougar)', scientific:'Puma concolor', emoji:'🦁', rarity:'epic', category:'mammal', roadkillable:false, regions:['mountain-west','pacific-northwest','southwest'], groups:['wild-five','big-cats'] },
    { id:'bobcat', name:'Bobcat', scientific:'Lynx rufus', emoji:'🐈', rarity:'epic', category:'mammal', regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','southwest'] },
    { id:'pronghorn', name:'Pronghorn', scientific:'Antilocapra americana', emoji:'🦌', rarity:'epic', category:'mammal', regions:['mountain-west','midwest','southwest'], groups:['antlered'] },
    { id:'manatee', name:'West Indian Manatee', scientific:'Trichechus manatus', emoji:'🐋', rarity:'epic', category:'mammal', roadkillable:false, regions:['southeast'] },
    { id:'orca', name:'Orca (Killer Whale)', scientific:'Orcinus orca', emoji:'🐋', rarity:'epic', category:'mammal', roadkillable:false, regions:['pacific-northwest','alaska'], groups:['whales-dolphins','sea-titans'] },
    { id:'javelina', name:'Collared Peccary (Javelina)', scientific:'Pecari tajacu', emoji:'🐗', rarity:'epic', category:'mammal', regions:['southwest'] },
    { id:'gray-whale', name:'Gray Whale', scientific:'Eschrichtius robustus', emoji:'🐋', rarity:'epic', category:'mammal', roadkillable:false, regions:['pacific-northwest','alaska'], groups:['whales-dolphins'] },
    { id:'humpback-whale', name:'Humpback Whale', scientific:'Megaptera novaeangliae', emoji:'🐋', rarity:'epic', category:'mammal', roadkillable:false, regions:['pacific-northwest','alaska','northeast'], groups:['whales-dolphins'] },
    { id:'northern-elephant-seal', name:'Northern Elephant Seal', scientific:'Mirounga angustirostris', emoji:'🦭', rarity:'epic', category:'mammal', roadkillable:false, regions:['pacific-northwest'] },
    { id:'steller-sea-lion', name:'Steller Sea Lion', scientific:'Eumetopias jubatus', emoji:'🦭', rarity:'epic', category:'mammal', roadkillable:false, regions:['pacific-northwest','alaska'] },
    { id:'walrus', name:'Walrus', scientific:'Odobenus rosmarus', emoji:'🦭', rarity:'epic', category:'mammal', roadkillable:false, regions:['alaska'] },
    { id:'beluga-whale', name:'Beluga Whale', scientific:'Delphinapterus leucas', emoji:'🐋', rarity:'epic', category:'mammal', roadkillable:false, regions:['alaska'] },
    { id:'narwhal', name:'Narwhal', scientific:'Monodon monoceros', emoji:'🐋', rarity:'epic', category:'mammal', roadkillable:false, regions:['alaska'] },
    { id:'ocelot', name:'Ocelot', scientific:'Leopardus pardalis', emoji:'🐈', rarity:'epic', category:'mammal', roadkillable:false, regions:['southwest'] },

    // ── Legendary (100) ──
    { id:'gray-wolf', name:'Gray Wolf', scientific:'Canis lupus', emoji:'🐺', rarity:'legendary', category:'mammal', roadkillable:false, regions:['mountain-west','pacific-northwest','alaska'], groups:['wild-five'] },
    { id:'grizzly-bear', name:'Grizzly Bear', scientific:'Ursus arctos horribilis', emoji:'🐻', rarity:'legendary', category:'mammal', roadkillable:false, regions:['mountain-west','alaska'], groups:['wild-five'] },
    { id:'american-bison', name:'American Bison', scientific:'Bison bison', emoji:'🦬', rarity:'legendary', category:'mammal', roadkillable:false, regions:['mountain-west','midwest'], groups:['wild-five'] },
    { id:'caribou', name:'Caribou (Reindeer)', scientific:'Rangifer tarandus', emoji:'🦌', rarity:'legendary', category:'mammal', regions:['alaska'], groups:['antlered'] },
    { id:'canada-lynx', name:'Canada Lynx', scientific:'Lynx canadensis', emoji:'🐈', rarity:'legendary', category:'mammal', roadkillable:false, regions:['mountain-west','alaska'] },
    { id:'wolverine', name:'Wolverine', scientific:'Gulo gulo', emoji:'🦡', rarity:'legendary', category:'mammal', roadkillable:false, regions:['mountain-west','alaska'] },
    { id:'polar-bear', name:'Polar Bear', scientific:'Ursus maritimus', emoji:'🐻‍❄️', rarity:'legendary', category:'mammal', roadkillable:false, regions:['alaska'] },
    { id:'red-wolf', name:'Red Wolf', scientific:'Canis rufus', emoji:'🐺', rarity:'legendary', category:'mammal', roadkillable:false, regions:['southeast'] },
    { id:'florida-panther', name:'Florida Panther', scientific:'Puma concolor coryi', emoji:'🦁', rarity:'legendary', category:'mammal', roadkillable:false, regions:['southeast'] },
    { id:'blue-whale', name:'Blue Whale', scientific:'Balaenoptera musculus', emoji:'🐋', rarity:'legendary', category:'mammal', roadkillable:false, regions:['pacific-northwest','alaska','northeast'], groups:['whales-dolphins','sea-titans'] },
    { id:'sperm-whale', name:'Sperm Whale', scientific:'Physeter macrocephalus', emoji:'🐋', rarity:'legendary', category:'mammal', roadkillable:false, regions:['pacific-northwest','northeast','alaska'] },
    { id:'right-whale', name:'North Atlantic Right Whale', scientific:'Eubalaena glacialis', emoji:'🐋', rarity:'legendary', category:'mammal', roadkillable:false, regions:['northeast'] },

    // ════════════════════════════════════════════════════════════════════
    //   BIRDS — US wildlife (~120)
    // ════════════════════════════════════════════════════════════════════

    // ── Common (5) ──
    { id:'american-crow', name:'American Crow', scientific:'Corvus brachyrhynchos', emoji:'🐦‍⬛', rarity:'common', category:'bird', regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','southwest','national'] },
    { id:'rock-pigeon', name:'Rock Pigeon', scientific:'Columba livia', emoji:'🕊️', rarity:'common', category:'bird', regions:['national'] },
    { id:'mourning-dove', name:'Mourning Dove', scientific:'Zenaida macroura', emoji:'🕊️', rarity:'common', category:'bird', regions:['national'] },
    { id:'house-sparrow', name:'House Sparrow', scientific:'Passer domesticus', emoji:'🐦', rarity:'common', category:'bird', regions:['national'] },
    { id:'european-starling', name:'European Starling', scientific:'Sturnus vulgaris', emoji:'🐦', rarity:'common', category:'bird', regions:['national'] },
    { id:'american-robin', name:'American Robin', scientific:'Turdus migratorius', emoji:'🐦', rarity:'common', category:'bird', regions:['national'], groups:['songbirds'] },
    { id:'northern-cardinal', name:'Northern Cardinal', scientific:'Cardinalis cardinalis', emoji:'🐦', rarity:'common', category:'bird', regions:['northeast','southeast','midwest','national'], groups:['songbirds'] },
    { id:'blue-jay', name:'Blue Jay', scientific:'Cyanocitta cristata', emoji:'🐦', rarity:'common', category:'bird', regions:['northeast','southeast','midwest','national'], groups:['songbirds'] },
    { id:'mallard', name:'Mallard Duck', scientific:'Anas platyrhynchos', emoji:'🦆', rarity:'common', category:'bird', roadkillable:false, regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','national'], groups:['waterfowl'] },
    { id:'canada-goose', name:'Canada Goose', scientific:'Branta canadensis', emoji:'🪿', rarity:'common', category:'bird', regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','national'], groups:['waterfowl'] },
    { id:'common-grackle', name:'Common Grackle', scientific:'Quiscalus quiscula', emoji:'🐦‍⬛', rarity:'common', category:'bird', regions:['national'] },
    { id:'red-winged-blackbird', name:'Red-winged Blackbird', scientific:'Agelaius phoeniceus', emoji:'🐦‍⬛', rarity:'common', category:'bird', regions:['national'] },
    { id:'american-goldfinch', name:'American Goldfinch', scientific:'Spinus tristis', emoji:'🐦', rarity:'common', category:'bird', regions:['national'], groups:['songbirds'] },
    { id:'house-finch', name:'House Finch', scientific:'Haemorhous mexicanus', emoji:'🐦', rarity:'common', category:'bird', regions:['national'] },
    { id:'song-sparrow', name:'Song Sparrow', scientific:'Melospiza melodia', emoji:'🐦', rarity:'common', category:'bird', regions:['national'] },
    { id:'barn-swallow', name:'Barn Swallow', scientific:'Hirundo rustica', emoji:'🐦', rarity:'common', category:'bird', regions:['national'] },
    { id:'tree-swallow', name:'Tree Swallow', scientific:'Tachycineta bicolor', emoji:'🐦', rarity:'common', category:'bird', regions:['national'] },
    { id:'chickadee-bc', name:'Black-capped Chickadee', scientific:'Poecile atricapillus', emoji:'🐦', rarity:'common', category:'bird', regions:['northeast','midwest','mountain-west','pacific-northwest','alaska'] },
    { id:'tufted-titmouse', name:'Tufted Titmouse', scientific:'Baeolophus bicolor', emoji:'🐦', rarity:'common', category:'bird', regions:['northeast','southeast','midwest'] },
    { id:'white-breasted-nuthatch', name:'White-breasted Nuthatch', scientific:'Sitta carolinensis', emoji:'🐦', rarity:'common', category:'bird', regions:['national'] },
    { id:'common-raven', name:'Common Raven', scientific:'Corvus corax', emoji:'🐦‍⬛', rarity:'common', category:'bird', regions:['mountain-west','pacific-northwest','alaska','southwest','northeast'] },
    { id:'northern-mockingbird', name:'Northern Mockingbird', scientific:'Mimus polyglottos', emoji:'🐦', rarity:'common', category:'bird', regions:['southeast','southwest','national'], groups:['songbirds'] },
    { id:'gray-catbird', name:'Gray Catbird', scientific:'Dumetella carolinensis', emoji:'🐦', rarity:'common', category:'bird', regions:['national'] },
    { id:'brown-thrasher', name:'Brown Thrasher', scientific:'Toxostoma rufum', emoji:'🐦', rarity:'common', category:'bird', regions:['northeast','southeast','midwest'] },
    { id:'killdeer', name:'Killdeer', scientific:'Charadrius vociferus', emoji:'🐦', rarity:'common', category:'bird', regions:['national'] },
    { id:'eastern-bluebird', name:'Eastern Bluebird', scientific:'Sialia sialis', emoji:'🐦', rarity:'common', category:'bird', regions:['northeast','southeast','midwest'] },

    // ── Uncommon (10) ──
    { id:'red-tailed-hawk', name:'Red-tailed Hawk', scientific:'Buteo jamaicensis', emoji:'🦅', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'], groups:['sky-hunters'] },
    { id:'wild-turkey', name:'Wild Turkey', scientific:'Meleagris gallopavo', emoji:'🦃', rarity:'uncommon', category:'bird', regions:['northeast','southeast','midwest','mountain-west','pacific-northwest','national'] },
    { id:'great-blue-heron', name:'Great Blue Heron', scientific:'Ardea herodias', emoji:'🪶', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'], groups:['waterfowl'] },
    { id:'great-egret', name:'Great Egret', scientific:'Ardea alba', emoji:'🪶', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'] },
    { id:'snowy-egret', name:'Snowy Egret', scientific:'Egretta thula', emoji:'🪶', rarity:'uncommon', category:'bird', roadkillable:false, regions:['southeast','southwest','pacific-northwest'] },
    { id:'cattle-egret', name:'Cattle Egret', scientific:'Bubulcus ibis', emoji:'🪶', rarity:'uncommon', category:'bird', roadkillable:false, regions:['southeast','southwest'] },
    { id:'turkey-vulture', name:'Turkey Vulture', scientific:'Cathartes aura', emoji:'🦃', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'], groups:['sky-hunters'] },
    { id:'black-vulture', name:'Black Vulture', scientific:'Coragyps atratus', emoji:'🦃', rarity:'uncommon', category:'bird', roadkillable:false, regions:['southeast','southwest','northeast'] },
    { id:'wood-duck', name:'Wood Duck', scientific:'Aix sponsa', emoji:'🦆', rarity:'uncommon', category:'bird', roadkillable:false, regions:['northeast','southeast','midwest','pacific-northwest'] },
    { id:'hooded-merganser', name:'Hooded Merganser', scientific:'Lophodytes cucullatus', emoji:'🦆', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'] },
    { id:'common-merganser', name:'Common Merganser', scientific:'Mergus merganser', emoji:'🦆', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'] },
    { id:'snow-goose', name:'Snow Goose', scientific:'Anser caerulescens', emoji:'🪿', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'] },
    { id:'tundra-swan', name:'Tundra Swan', scientific:'Cygnus columbianus', emoji:'🦢', rarity:'uncommon', category:'bird', roadkillable:false, regions:['midwest','northeast','pacific-northwest','alaska'] },
    { id:'mute-swan', name:'Mute Swan', scientific:'Cygnus olor', emoji:'🦢', rarity:'uncommon', category:'bird', roadkillable:false, regions:['northeast','midwest'] },
    { id:'sandhill-crane', name:'Sandhill Crane', scientific:'Antigone canadensis', emoji:'🪶', rarity:'uncommon', category:'bird', roadkillable:false, regions:['midwest','mountain-west','southeast','alaska'] },
    { id:'belted-kingfisher', name:'Belted Kingfisher', scientific:'Megaceryle alcyon', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'] },
    { id:'ruby-throated-hummingbird', name:'Ruby-throated Hummingbird', scientific:'Archilochus colubris', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['northeast','southeast','midwest'] },
    { id:'annas-hummingbird', name:'Anna\'s Hummingbird', scientific:'Calypte anna', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['pacific-northwest','southwest'] },
    { id:'pileated-woodpecker', name:'Pileated Woodpecker', scientific:'Dryocopus pileatus', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['northeast','southeast','midwest','pacific-northwest'] },
    { id:'downy-woodpecker', name:'Downy Woodpecker', scientific:'Dryobates pubescens', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'] },
    { id:'northern-flicker', name:'Northern Flicker', scientific:'Colaptes auratus', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'] },
    { id:'red-bellied-woodpecker', name:'Red-bellied Woodpecker', scientific:'Melanerpes carolinus', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['northeast','southeast','midwest'] },
    { id:'baltimore-oriole', name:'Baltimore Oriole', scientific:'Icterus galbula', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['northeast','southeast','midwest'] },
    { id:'scarlet-tanager', name:'Scarlet Tanager', scientific:'Piranga olivacea', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['northeast','southeast','midwest'] },
    { id:'western-tanager', name:'Western Tanager', scientific:'Piranga ludoviciana', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['mountain-west','pacific-northwest','southwest'] },
    { id:'indigo-bunting', name:'Indigo Bunting', scientific:'Passerina cyanea', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['northeast','southeast','midwest'] },
    { id:'painted-bunting', name:'Painted Bunting', scientific:'Passerina ciris', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['southeast','southwest'] },
    { id:'yellow-warbler', name:'Yellow Warbler', scientific:'Setophaga petechia', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'] },
    { id:'common-yellowthroat', name:'Common Yellowthroat', scientific:'Geothlypis trichas', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'] },
    { id:'eastern-meadowlark', name:'Eastern Meadowlark', scientific:'Sturnella magna', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['northeast','southeast','midwest'] },
    { id:'western-meadowlark', name:'Western Meadowlark', scientific:'Sturnella neglecta', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['midwest','mountain-west','southwest','pacific-northwest'] },
    { id:'common-loon', name:'Common Loon', scientific:'Gavia immer', emoji:'🦆', rarity:'uncommon', category:'bird', roadkillable:false, regions:['northeast','midwest','alaska','pacific-northwest'] },
    { id:'pied-billed-grebe', name:'Pied-billed Grebe', scientific:'Podilymbus podiceps', emoji:'🦆', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'] },
    { id:'double-crested-cormorant', name:'Double-crested Cormorant', scientific:'Nannopterum auritum', emoji:'🐦‍⬛', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'] },
    { id:'herring-gull', name:'Herring Gull', scientific:'Larus argentatus', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['northeast','pacific-northwest','alaska'] },
    { id:'ring-billed-gull', name:'Ring-billed Gull', scientific:'Larus delawarensis', emoji:'🐦', rarity:'uncommon', category:'bird', roadkillable:false, regions:['national'] },
    { id:'ring-necked-pheasant', name:'Ring-necked Pheasant', scientific:'Phasianus colchicus', emoji:'🐦', rarity:'uncommon', category:'bird', regions:['midwest','mountain-west','northeast'] },

    // ── Rare (25) ──
    { id:'bald-eagle', name:'Bald Eagle', scientific:'Haliaeetus leucocephalus', emoji:'🦅', rarity:'rare', category:'bird', roadkillable:false, regions:['national'], groups:['wild-five','sky-hunters','raptor-row'] },
    { id:'golden-eagle', name:'Golden Eagle', scientific:'Aquila chrysaetos', emoji:'🦅', rarity:'rare', category:'bird', roadkillable:false, regions:['mountain-west','southwest','alaska','pacific-northwest'], groups:['raptor-row'] },
    { id:'osprey', name:'Osprey', scientific:'Pandion haliaetus', emoji:'🪶', rarity:'rare', category:'bird', roadkillable:false, regions:['national'], groups:['sky-hunters'] },
    { id:'peregrine-falcon', name:'Peregrine Falcon', scientific:'Falco peregrinus', emoji:'🦅', rarity:'rare', category:'bird', roadkillable:false, regions:['national'], groups:['raptor-row'] },
    { id:'american-kestrel', name:'American Kestrel', scientific:'Falco sparverius', emoji:'🦅', rarity:'rare', category:'bird', roadkillable:false, regions:['national'] },
    { id:'merlin', name:'Merlin', scientific:'Falco columbarius', emoji:'🦅', rarity:'rare', category:'bird', roadkillable:false, regions:['national'] },
    { id:'coopers-hawk', name:'Cooper\'s Hawk', scientific:'Astur cooperii', emoji:'🦅', rarity:'rare', category:'bird', roadkillable:false, regions:['national'], groups:['raptor-row'] },
    { id:'sharp-shinned-hawk', name:'Sharp-shinned Hawk', scientific:'Accipiter striatus', emoji:'🦅', rarity:'rare', category:'bird', roadkillable:false, regions:['national'] },
    { id:'northern-harrier', name:'Northern Harrier', scientific:'Circus hudsonius', emoji:'🦅', rarity:'rare', category:'bird', roadkillable:false, regions:['national'], groups:['raptor-row'] },
    { id:'red-shouldered-hawk', name:'Red-shouldered Hawk', scientific:'Buteo lineatus', emoji:'🦅', rarity:'rare', category:'bird', roadkillable:false, regions:['southeast','northeast','pacific-northwest','midwest'] },
    { id:'swainsons-hawk', name:'Swainson\'s Hawk', scientific:'Buteo swainsoni', emoji:'🦅', rarity:'rare', category:'bird', roadkillable:false, regions:['midwest','mountain-west','southwest'] },
    { id:'great-horned-owl', name:'Great Horned Owl', scientific:'Bubo virginianus', emoji:'🦉', rarity:'rare', category:'bird', roadkillable:false, regions:['national'], groups:['sky-hunters','owls-of-night'] },
    { id:'barred-owl', name:'Barred Owl', scientific:'Strix varia', emoji:'🦉', rarity:'rare', category:'bird', roadkillable:false, regions:['northeast','southeast','midwest','pacific-northwest'], groups:['owls-of-night'] },
    { id:'barn-owl', name:'Barn Owl', scientific:'Tyto alba', emoji:'🦉', rarity:'rare', category:'bird', roadkillable:false, regions:['national'], groups:['owls-of-night'] },
    { id:'eastern-screech-owl', name:'Eastern Screech-Owl', scientific:'Megascops asio', emoji:'🦉', rarity:'rare', category:'bird', roadkillable:false, regions:['northeast','southeast','midwest'], groups:['owls-of-night'] },
    { id:'western-screech-owl', name:'Western Screech-Owl', scientific:'Megascops kennicottii', emoji:'🦉', rarity:'rare', category:'bird', roadkillable:false, regions:['mountain-west','pacific-northwest','southwest'] },
    { id:'long-eared-owl', name:'Long-eared Owl', scientific:'Asio otus', emoji:'🦉', rarity:'rare', category:'bird', roadkillable:false, regions:['national'] },
    { id:'short-eared-owl', name:'Short-eared Owl', scientific:'Asio flammeus', emoji:'🦉', rarity:'rare', category:'bird', roadkillable:false, regions:['national'] },
    { id:'burrowing-owl', name:'Burrowing Owl', scientific:'Athene cunicularia', emoji:'🦉', rarity:'rare', category:'bird', roadkillable:false, regions:['midwest','mountain-west','southwest'] },
    { id:'brown-pelican', name:'Brown Pelican', scientific:'Pelecanus occidentalis', emoji:'🦤', rarity:'rare', category:'bird', roadkillable:false, regions:['southeast','pacific-northwest','southwest'], groups:['waterfowl'] },
    { id:'american-white-pelican', name:'American White Pelican', scientific:'Pelecanus erythrorhynchos', emoji:'🦤', rarity:'rare', category:'bird', roadkillable:false, regions:['midwest','mountain-west','southeast','southwest'] },
    { id:'roseate-spoonbill', name:'Roseate Spoonbill', scientific:'Platalea ajaja', emoji:'🦩', rarity:'rare', category:'bird', roadkillable:false, regions:['southeast','southwest'] },
    { id:'roadrunner', name:'Greater Roadrunner', scientific:'Geococcyx californianus', emoji:'🏃', rarity:'rare', category:'bird', roadkillable:false, regions:['southwest'] },
    { id:'wood-stork', name:'Wood Stork', scientific:'Mycteria americana', emoji:'🦤', rarity:'rare', category:'bird', roadkillable:false, regions:['southeast'] },
    { id:'green-heron', name:'Green Heron', scientific:'Butorides virescens', emoji:'🪶', rarity:'rare', category:'bird', roadkillable:false, regions:['national'] },
    { id:'black-crowned-night-heron', name:'Black-crowned Night-Heron', scientific:'Nycticorax nycticorax', emoji:'🪶', rarity:'rare', category:'bird', roadkillable:false, regions:['national'] },
    { id:'trumpeter-swan', name:'Trumpeter Swan', scientific:'Cygnus buccinator', emoji:'🦢', rarity:'rare', category:'bird', roadkillable:false, regions:['midwest','mountain-west','pacific-northwest','alaska'], groups:['waterfowl'] },
    { id:'ruffed-grouse', name:'Ruffed Grouse', scientific:'Bonasa umbellus', emoji:'🐦', rarity:'rare', category:'bird', regions:['northeast','midwest','mountain-west','alaska'] },
    { id:'sage-grouse', name:'Greater Sage-Grouse', scientific:'Centrocercus urophasianus', emoji:'🐦', rarity:'rare', category:'bird', regions:['mountain-west'] },
    { id:'california-quail', name:'California Quail', scientific:'Callipepla californica', emoji:'🐦', rarity:'rare', category:'bird', regions:['pacific-northwest','southwest'] },
    { id:'northern-bobwhite', name:'Northern Bobwhite', scientific:'Colinus virginianus', emoji:'🐦', rarity:'rare', category:'bird', regions:['southeast','midwest'] },

    // ── Epic (50) ──
    { id:'snowy-owl', name:'Snowy Owl', scientific:'Bubo scandiacus', emoji:'🦉', rarity:'epic', category:'bird', roadkillable:false, regions:['alaska','northeast','midwest'], groups:['owls-of-night'] },
    { id:'great-gray-owl', name:'Great Gray Owl', scientific:'Strix nebulosa', emoji:'🦉', rarity:'epic', category:'bird', roadkillable:false, regions:['mountain-west','pacific-northwest','alaska'] },
    { id:'ferruginous-hawk', name:'Ferruginous Hawk', scientific:'Buteo regalis', emoji:'🦅', rarity:'epic', category:'bird', roadkillable:false, regions:['mountain-west','midwest','southwest'] },
    { id:'rough-legged-hawk', name:'Rough-legged Hawk', scientific:'Buteo lagopus', emoji:'🦅', rarity:'epic', category:'bird', roadkillable:false, regions:['national'] },
    { id:'crested-caracara', name:'Crested Caracara', scientific:'Caracara plancus', emoji:'🦅', rarity:'epic', category:'bird', roadkillable:false, regions:['southwest','southeast'] },
    { id:'snail-kite', name:'Snail Kite', scientific:'Rostrhamus sociabilis', emoji:'🦅', rarity:'epic', category:'bird', roadkillable:false, regions:['southeast'] },
    { id:'whooping-crane', name:'Whooping Crane', scientific:'Grus americana', emoji:'🪶', rarity:'epic', category:'bird', roadkillable:false, regions:['midwest','southeast'] },
    { id:'black-skimmer', name:'Black Skimmer', scientific:'Rynchops niger', emoji:'🐦', rarity:'epic', category:'bird', roadkillable:false, regions:['southeast','northeast','southwest'] },
    { id:'piping-plover', name:'Piping Plover', scientific:'Charadrius melodus', emoji:'🐦', rarity:'epic', category:'bird', roadkillable:false, regions:['northeast','southeast','midwest'] },
    { id:'horned-puffin', name:'Horned Puffin', scientific:'Fratercula corniculata', emoji:'🐦', rarity:'epic', category:'bird', roadkillable:false, regions:['alaska'] },
    { id:'tufted-puffin', name:'Tufted Puffin', scientific:'Fratercula cirrhata', emoji:'🐦', rarity:'epic', category:'bird', roadkillable:false, regions:['pacific-northwest','alaska'] },
    { id:'atlantic-puffin', name:'Atlantic Puffin', scientific:'Fratercula arctica', emoji:'🐦', rarity:'epic', category:'bird', roadkillable:false, regions:['northeast'] },
    { id:'gyrfalcon', name:'Gyrfalcon', scientific:'Falco rusticolus', emoji:'🦅', rarity:'epic', category:'bird', roadkillable:false, regions:['alaska'] },
    { id:'painted-redstart', name:'Painted Redstart', scientific:'Myioborus pictus', emoji:'🐦', rarity:'epic', category:'bird', roadkillable:false, regions:['southwest'] },
    { id:'elf-owl', name:'Elf Owl', scientific:'Micrathene whitneyi', emoji:'🦉', rarity:'epic', category:'bird', roadkillable:false, regions:['southwest'] },

    // ── Legendary (100) ──
    { id:'california-condor', name:'California Condor', scientific:'Gymnogyps californianus', emoji:'🦅', rarity:'legendary', category:'bird', roadkillable:false, regions:['southwest','pacific-northwest'] },
    { id:'kirtlands-warbler', name:'Kirtland\'s Warbler', scientific:'Setophaga kirtlandii', emoji:'🐦', rarity:'legendary', category:'bird', roadkillable:false, regions:['midwest'] },
    { id:'florida-grasshopper-sparrow', name:'Florida Grasshopper Sparrow', scientific:'Ammodramus savannarum floridanus', emoji:'🐦', rarity:'legendary', category:'bird', roadkillable:false, regions:['southeast'] },
    { id:'ivory-billed-woodpecker', name:'Ivory-billed Woodpecker', scientific:'Campephilus principalis', emoji:'🐦', rarity:'legendary', category:'bird', roadkillable:false, regions:['southeast'] },
    { id:'spotted-owl', name:'Northern Spotted Owl', scientific:'Strix occidentalis caurina', emoji:'🦉', rarity:'legendary', category:'bird', roadkillable:false, regions:['pacific-northwest'] },

    // ════════════════════════════════════════════════════════════════════
    //   REPTILES — US (~50)
    // ════════════════════════════════════════════════════════════════════

    // ── Common (5) ──
    { id:'garter-snake', name:'Common Garter Snake', scientific:'Thamnophis sirtalis', emoji:'🐍', rarity:'common', category:'reptile', regions:['national'], groups:['cold-blooded'] },
    { id:'green-anole', name:'Green Anole', scientific:'Anolis carolinensis', emoji:'🦎', rarity:'common', category:'reptile', regions:['southeast'] },
    { id:'brown-anole', name:'Brown Anole', scientific:'Anolis sagrei', emoji:'🦎', rarity:'common', category:'reptile', regions:['southeast'] },
    { id:'eastern-fence-lizard', name:'Eastern Fence Lizard', scientific:'Sceloporus undulatus', emoji:'🦎', rarity:'common', category:'reptile', regions:['southeast','midwest','northeast'] },
    { id:'side-blotched-lizard', name:'Common Side-blotched Lizard', scientific:'Uta stansburiana', emoji:'🦎', rarity:'common', category:'reptile', regions:['southwest','mountain-west'] },
    { id:'red-eared-slider', name:'Red-eared Slider', scientific:'Trachemys scripta elegans', emoji:'🐢', rarity:'common', category:'reptile', regions:['southeast','midwest','national'] },
    { id:'painted-turtle', name:'Painted Turtle', scientific:'Chrysemys picta', emoji:'🐢', rarity:'common', category:'reptile', regions:['national'] },
    { id:'eastern-rat-snake', name:'Eastern Ratsnake', scientific:'Pantherophis alleghaniensis', emoji:'🐍', rarity:'common', category:'reptile', regions:['northeast','southeast','midwest'] },
    { id:'northern-water-snake', name:'Northern Water Snake', scientific:'Nerodia sipedon', emoji:'🐍', rarity:'common', category:'reptile', regions:['northeast','southeast','midwest'] },

    // ── Uncommon (10) ──
    { id:'snapping-turtle', name:'Common Snapping Turtle', scientific:'Chelydra serpentina', emoji:'🐢', rarity:'uncommon', category:'reptile', regions:['national'], groups:['cold-blooded'] },
    { id:'eastern-box-turtle', name:'Eastern Box Turtle', scientific:'Terrapene carolina', emoji:'🐢', rarity:'uncommon', category:'reptile', regions:['northeast','southeast','midwest'] },
    { id:'three-toed-box-turtle', name:'Three-toed Box Turtle', scientific:'Terrapene carolina triunguis', emoji:'🐢', rarity:'uncommon', category:'reptile', regions:['southeast','midwest','southwest'] },
    { id:'wood-turtle', name:'Wood Turtle', scientific:'Glyptemys insculpta', emoji:'🐢', rarity:'uncommon', category:'reptile', regions:['northeast','midwest'] },
    { id:'corn-snake', name:'Corn Snake', scientific:'Pantherophis guttatus', emoji:'🐍', rarity:'uncommon', category:'reptile', regions:['southeast','midwest'] },
    { id:'eastern-kingsnake', name:'Eastern Kingsnake', scientific:'Lampropeltis getula', emoji:'🐍', rarity:'uncommon', category:'reptile', regions:['southeast','midwest','northeast'] },
    { id:'milk-snake', name:'Milk Snake', scientific:'Lampropeltis triangulum', emoji:'🐍', rarity:'uncommon', category:'reptile', regions:['national'] },
    { id:'gopher-snake', name:'Gopher Snake', scientific:'Pituophis catenifer', emoji:'🐍', rarity:'uncommon', category:'reptile', regions:['mountain-west','southwest','pacific-northwest','midwest'] },
    { id:'bullsnake', name:'Bullsnake', scientific:'Pituophis catenifer sayi', emoji:'🐍', rarity:'uncommon', category:'reptile', regions:['midwest','mountain-west'] },
    { id:'eastern-hognose', name:'Eastern Hog-nosed Snake', scientific:'Heterodon platirhinos', emoji:'🐍', rarity:'uncommon', category:'reptile', regions:['northeast','southeast','midwest'] },
    { id:'collared-lizard', name:'Common Collared Lizard', scientific:'Crotaphytus collaris', emoji:'🦎', rarity:'uncommon', category:'reptile', regions:['southwest','mountain-west','midwest'] },
    { id:'whiptail-lizard', name:'Western Whiptail', scientific:'Aspidoscelis tigris', emoji:'🦎', rarity:'uncommon', category:'reptile', regions:['southwest','mountain-west'] },

    // ── Rare (25) ──
    { id:'horned-lizard', name:'Texas Horned Lizard', scientific:'Phrynosoma cornutum', emoji:'🦎', rarity:'rare', category:'reptile', regions:['southwest','mountain-west'], groups:['cold-blooded'] },
    { id:'desert-iguana', name:'Desert Iguana', scientific:'Dipsosaurus dorsalis', emoji:'🦎', rarity:'rare', category:'reptile', regions:['southwest'] },
    { id:'common-chuckwalla', name:'Common Chuckwalla', scientific:'Sauromalus ater', emoji:'🦎', rarity:'rare', category:'reptile', regions:['southwest'] },
    { id:'eastern-diamondback-rattlesnake', name:'Eastern Diamondback Rattlesnake', scientific:'Crotalus adamanteus', emoji:'🐍', rarity:'rare', category:'reptile', regions:['southeast'], groups:['reptile-royalty'] },
    { id:'western-diamondback-rattlesnake', name:'Western Diamondback Rattlesnake', scientific:'Crotalus atrox', emoji:'🐍', rarity:'rare', category:'reptile', regions:['southwest','mountain-west'] },
    { id:'timber-rattlesnake', name:'Timber Rattlesnake', scientific:'Crotalus horridus', emoji:'🐍', rarity:'rare', category:'reptile', regions:['northeast','southeast','midwest'] },
    { id:'sidewinder', name:'Sidewinder Rattlesnake', scientific:'Crotalus cerastes', emoji:'🐍', rarity:'rare', category:'reptile', regions:['southwest'] },
    { id:'copperhead', name:'Eastern Copperhead', scientific:'Agkistrodon contortrix', emoji:'🐍', rarity:'rare', category:'reptile', regions:['northeast','southeast','midwest'] },
    { id:'cottonmouth', name:'Cottonmouth (Water Moccasin)', scientific:'Agkistrodon piscivorus', emoji:'🐍', rarity:'rare', category:'reptile', regions:['southeast','southwest'] },
    { id:'coral-snake', name:'Eastern Coral Snake', scientific:'Micrurus fulvius', emoji:'🐍', rarity:'rare', category:'reptile', regions:['southeast'] },
    { id:'coachwhip', name:'Coachwhip', scientific:'Masticophis flagellum', emoji:'🐍', rarity:'rare', category:'reptile', regions:['southeast','southwest','midwest'] },
    { id:'diamondback-terrapin', name:'Diamondback Terrapin', scientific:'Malaclemys terrapin', emoji:'🐢', rarity:'rare', category:'reptile', regions:['northeast','southeast'] },
    { id:'spotted-turtle', name:'Spotted Turtle', scientific:'Clemmys guttata', emoji:'🐢', rarity:'rare', category:'reptile', regions:['northeast','southeast','midwest'] },

    // ── Epic (50) ──
    { id:'american-alligator', name:'American Alligator', scientific:'Alligator mississippiensis', emoji:'🐊', rarity:'epic', category:'reptile', roadkillable:false, regions:['southeast'], groups:['cold-blooded','reptile-royalty'] },
    { id:'gila-monster', name:'Gila Monster', scientific:'Heloderma suspectum', emoji:'🦎', rarity:'epic', category:'reptile', regions:['southwest'], groups:['reptile-royalty'] },
    { id:'desert-tortoise', name:'Desert Tortoise', scientific:'Gopherus agassizii', emoji:'🐢', rarity:'epic', category:'reptile', regions:['southwest'] },
    { id:'gopher-tortoise', name:'Gopher Tortoise', scientific:'Gopherus polyphemus', emoji:'🐢', rarity:'epic', category:'reptile', regions:['southeast'] },
    { id:'loggerhead-sea-turtle', name:'Loggerhead Sea Turtle', scientific:'Caretta caretta', emoji:'🐢', rarity:'epic', category:'reptile', roadkillable:false, regions:['southeast','northeast'], groups:['reptile-royalty'] },
    { id:'green-sea-turtle', name:'Green Sea Turtle', scientific:'Chelonia mydas', emoji:'🐢', rarity:'epic', category:'reptile', roadkillable:false, regions:['southeast'] },

    // ── Legendary (100) ──
    { id:'american-crocodile', name:'American Crocodile', scientific:'Crocodylus acutus', emoji:'🐊', rarity:'legendary', category:'reptile', roadkillable:false, regions:['southeast'] },
    { id:'leatherback-sea-turtle', name:'Leatherback Sea Turtle', scientific:'Dermochelys coriacea', emoji:'🐢', rarity:'legendary', category:'reptile', roadkillable:false, regions:['southeast','northeast','pacific-northwest'] },
    { id:'kemps-ridley', name:'Kemp\'s Ridley Sea Turtle', scientific:'Lepidochelys kempii', emoji:'🐢', rarity:'legendary', category:'reptile', roadkillable:false, regions:['southeast','northeast'] },
    { id:'hawksbill-turtle', name:'Hawksbill Sea Turtle', scientific:'Eretmochelys imbricata', emoji:'🐢', rarity:'legendary', category:'reptile', roadkillable:false, regions:['southeast'] },

    // ════════════════════════════════════════════════════════════════════
    //   AMPHIBIANS — US (~25)
    // ════════════════════════════════════════════════════════════════════

    // ── Common (5) ──
    { id:'bullfrog', name:'American Bullfrog', scientific:'Lithobates catesbeianus', emoji:'🐸', rarity:'common', category:'amphibian', regions:['national'], groups:['cold-blooded'] },
    { id:'green-frog', name:'Green Frog', scientific:'Lithobates clamitans', emoji:'🐸', rarity:'common', category:'amphibian', regions:['northeast','southeast','midwest'] },
    { id:'wood-frog', name:'Wood Frog', scientific:'Lithobates sylvaticus', emoji:'🐸', rarity:'common', category:'amphibian', regions:['northeast','midwest','alaska','mountain-west'] },
    { id:'leopard-frog', name:'Northern Leopard Frog', scientific:'Lithobates pipiens', emoji:'🐸', rarity:'common', category:'amphibian', regions:['national'] },
    { id:'spring-peeper', name:'Spring Peeper', scientific:'Pseudacris crucifer', emoji:'🐸', rarity:'common', category:'amphibian', regions:['northeast','southeast','midwest'] },
    { id:'gray-treefrog', name:'Gray Treefrog', scientific:'Hyla versicolor', emoji:'🐸', rarity:'common', category:'amphibian', regions:['northeast','southeast','midwest'] },
    { id:'pacific-treefrog', name:'Pacific Chorus Frog', scientific:'Pseudacris regilla', emoji:'🐸', rarity:'common', category:'amphibian', regions:['pacific-northwest','mountain-west'] },
    { id:'american-toad', name:'American Toad', scientific:'Anaxyrus americanus', emoji:'🐸', rarity:'common', category:'amphibian', regions:['northeast','southeast','midwest'] },

    // ── Uncommon (10) ──
    { id:'fowlers-toad', name:'Fowler\'s Toad', scientific:'Anaxyrus fowleri', emoji:'🐸', rarity:'uncommon', category:'amphibian', regions:['northeast','southeast','midwest'] },
    { id:'western-toad', name:'Western Toad', scientific:'Anaxyrus boreas', emoji:'🐸', rarity:'uncommon', category:'amphibian', regions:['mountain-west','pacific-northwest','southwest','alaska'] },
    { id:'pickerel-frog', name:'Pickerel Frog', scientific:'Lithobates palustris', emoji:'🐸', rarity:'uncommon', category:'amphibian', regions:['northeast','southeast','midwest'] },
    { id:'eastern-newt', name:'Eastern Newt', scientific:'Notophthalmus viridescens', emoji:'🦎', rarity:'uncommon', category:'amphibian', regions:['northeast','southeast','midwest'] },
    { id:'red-backed-salamander', name:'Eastern Red-backed Salamander', scientific:'Plethodon cinereus', emoji:'🦎', rarity:'uncommon', category:'amphibian', regions:['northeast','midwest','southeast'] },

    // ── Rare (25) ──
    { id:'spotted-salamander', name:'Spotted Salamander', scientific:'Ambystoma maculatum', emoji:'🦎', rarity:'rare', category:'amphibian', regions:['northeast','southeast','midwest'] },
    { id:'tiger-salamander', name:'Eastern Tiger Salamander', scientific:'Ambystoma tigrinum', emoji:'🦎', rarity:'rare', category:'amphibian', regions:['midwest','southeast','northeast'] },
    { id:'marbled-salamander', name:'Marbled Salamander', scientific:'Ambystoma opacum', emoji:'🦎', rarity:'rare', category:'amphibian', regions:['northeast','southeast'] },
    { id:'slimy-salamander', name:'Northern Slimy Salamander', scientific:'Plethodon glutinosus', emoji:'🦎', rarity:'rare', category:'amphibian', regions:['northeast','southeast'] },
    { id:'pacific-giant-salamander', name:'Coastal Giant Salamander', scientific:'Dicamptodon tenebrosus', emoji:'🦎', rarity:'rare', category:'amphibian', regions:['pacific-northwest'] },
    { id:'cane-toad', name:'Cane Toad (Invasive)', scientific:'Rhinella marina', emoji:'🐸', rarity:'rare', category:'amphibian', regions:['southeast'] },

    // ── Epic (50) ──
    { id:'hellbender', name:'Eastern Hellbender', scientific:'Cryptobranchus alleganiensis', emoji:'🦎', rarity:'epic', category:'amphibian', roadkillable:false, regions:['southeast','northeast','midwest'] },
    { id:'mudpuppy', name:'Common Mudpuppy', scientific:'Necturus maculosus', emoji:'🦎', rarity:'epic', category:'amphibian', roadkillable:false, regions:['midwest','northeast','southeast'] },
    { id:'flatwoods-salamander', name:'Reticulated Flatwoods Salamander', scientific:'Ambystoma bishopi', emoji:'🦎', rarity:'epic', category:'amphibian', roadkillable:false, regions:['southeast'] },

    // ════════════════════════════════════════════════════════════════════
    //   FISH & SEALIFE — US (~25)
    // ════════════════════════════════════════════════════════════════════

    // ── Common (5) ──
    { id:'bluegill', name:'Bluegill', scientific:'Lepomis macrochirus', emoji:'🐟', rarity:'common', category:'fish', roadkillable:false, regions:['national'], groups:['catch-of-day'] },
    { id:'crappie', name:'Black Crappie', scientific:'Pomoxis nigromaculatus', emoji:'🐟', rarity:'common', category:'fish', roadkillable:false, regions:['national'] },
    { id:'yellow-perch', name:'Yellow Perch', scientific:'Perca flavescens', emoji:'🐟', rarity:'common', category:'fish', roadkillable:false, regions:['national'] },

    // ── Uncommon (10) ──
    { id:'largemouth-bass', name:'Largemouth Bass', scientific:'Micropterus salmoides', emoji:'🐟', rarity:'uncommon', category:'fish', roadkillable:false, regions:['national'], groups:['catch-of-day'] },
    { id:'smallmouth-bass', name:'Smallmouth Bass', scientific:'Micropterus dolomieu', emoji:'🐟', rarity:'uncommon', category:'fish', roadkillable:false, regions:['national'] },
    { id:'channel-catfish', name:'Channel Catfish', scientific:'Ictalurus punctatus', emoji:'🐟', rarity:'uncommon', category:'fish', roadkillable:false, regions:['national'], groups:['catch-of-day'] },
    { id:'walleye', name:'Walleye', scientific:'Sander vitreus', emoji:'🐟', rarity:'uncommon', category:'fish', roadkillable:false, regions:['midwest','northeast','mountain-west'], groups:['catch-of-day'] },
    { id:'rainbow-trout', name:'Rainbow Trout', scientific:'Oncorhynchus mykiss', emoji:'🐟', rarity:'uncommon', category:'fish', roadkillable:false, regions:['mountain-west','pacific-northwest','northeast','national'], groups:['catch-of-day'] },
    { id:'brook-trout', name:'Brook Trout', scientific:'Salvelinus fontinalis', emoji:'🐟', rarity:'uncommon', category:'fish', roadkillable:false, regions:['northeast','midwest','mountain-west'] },
    { id:'brown-trout', name:'Brown Trout', scientific:'Salmo trutta', emoji:'🐟', rarity:'uncommon', category:'fish', roadkillable:false, regions:['national'] },
    { id:'horseshoe-crab', name:'Atlantic Horseshoe Crab', scientific:'Limulus polyphemus', emoji:'🦀', rarity:'uncommon', category:'invert', roadkillable:false, regions:['northeast','southeast'] },

    // ── Rare (25) ──
    { id:'chinook-salmon', name:'Chinook Salmon', scientific:'Oncorhynchus tshawytscha', emoji:'🐟', rarity:'rare', category:'fish', roadkillable:false, regions:['pacific-northwest','alaska'] },
    { id:'sockeye-salmon', name:'Sockeye Salmon', scientific:'Oncorhynchus nerka', emoji:'🐟', rarity:'rare', category:'fish', roadkillable:false, regions:['pacific-northwest','alaska'] },
    { id:'striped-bass', name:'Striped Bass', scientific:'Morone saxatilis', emoji:'🐟', rarity:'rare', category:'fish', roadkillable:false, regions:['northeast','southeast','pacific-northwest'] },
    { id:'mahi-mahi', name:'Mahi-Mahi', scientific:'Coryphaena hippurus', emoji:'🐠', rarity:'rare', category:'fish', roadkillable:false, regions:['southeast','pacific-northwest'] },
    { id:'tarpon', name:'Atlantic Tarpon', scientific:'Megalops atlanticus', emoji:'🐟', rarity:'rare', category:'fish', roadkillable:false, regions:['southeast'] },
    { id:'red-snapper', name:'Red Snapper', scientific:'Lutjanus campechanus', emoji:'🐠', rarity:'rare', category:'fish', roadkillable:false, regions:['southeast'] },
    { id:'american-lobster', name:'American Lobster', scientific:'Homarus americanus', emoji:'🦞', rarity:'rare', category:'invert', roadkillable:false, regions:['northeast'] },
    { id:'blue-crab', name:'Atlantic Blue Crab', scientific:'Callinectes sapidus', emoji:'🦀', rarity:'rare', category:'invert', roadkillable:false, regions:['northeast','southeast'] },

    // ── Epic (50) ──
    { id:'great-white-shark', name:'Great White Shark', scientific:'Carcharodon carcharias', emoji:'🦈', rarity:'epic', category:'fish', roadkillable:false, regions:['northeast','southeast','pacific-northwest'], groups:['apex-pelagics','sea-titans'] },
    { id:'tiger-shark', name:'Tiger Shark', scientific:'Galeocerdo cuvier', emoji:'🦈', rarity:'epic', category:'fish', roadkillable:false, regions:['southeast'], groups:['apex-pelagics'] },
    { id:'hammerhead-shark', name:'Great Hammerhead Shark', scientific:'Sphyrna mokarran', emoji:'🦈', rarity:'epic', category:'fish', roadkillable:false, regions:['southeast'], groups:['apex-pelagics'] },
    { id:'mako-shark', name:'Shortfin Mako Shark', scientific:'Isurus oxyrinchus', emoji:'🦈', rarity:'epic', category:'fish', roadkillable:false, regions:['southeast','northeast','pacific-northwest'], groups:['apex-pelagics'] },
    { id:'bull-shark', name:'Bull Shark', scientific:'Carcharhinus leucas', emoji:'🦈', rarity:'epic', category:'fish', roadkillable:false, regions:['southeast'], groups:['apex-pelagics'] },
    { id:'manta-ray', name:'Giant Manta Ray', scientific:'Mobula birostris', emoji:'🐟', rarity:'epic', category:'fish', roadkillable:false, regions:['southeast','pacific-northwest'], groups:['sea-titans'] },
    { id:'common-octopus', name:'Common Octopus', scientific:'Octopus vulgaris', emoji:'🐙', rarity:'epic', category:'invert', roadkillable:false, regions:['southeast','pacific-northwest'] },
    { id:'giant-pacific-octopus', name:'Giant Pacific Octopus', scientific:'Enteroctopus dofleini', emoji:'🐙', rarity:'epic', category:'invert', roadkillable:false, regions:['pacific-northwest','alaska'] },

    // ── Legendary (100) ──
    { id:'whale-shark', name:'Whale Shark', scientific:'Rhincodon typus', emoji:'🦈', rarity:'legendary', category:'fish', roadkillable:false, regions:['southeast'], groups:['sea-titans'] },
    { id:'atlantic-bluefin-tuna', name:'Atlantic Bluefin Tuna', scientific:'Thunnus thynnus', emoji:'🐟', rarity:'legendary', category:'fish', roadkillable:false, regions:['northeast'] },

    // ════════════════════════════════════════════════════════════════════
    //   INVERTS / INSECTS — US (~12)
    // ════════════════════════════════════════════════════════════════════

    { id:'monarch-butterfly', name:'Monarch Butterfly', scientific:'Danaus plexippus', emoji:'🦋', rarity:'common', category:'invert', regions:['national'], groups:['butterfly-flight'] },
    { id:'eastern-tiger-swallowtail', name:'Eastern Tiger Swallowtail', scientific:'Papilio glaucus', emoji:'🦋', rarity:'common', category:'invert', regions:['northeast','southeast','midwest'], groups:['butterfly-flight'] },
    { id:'black-swallowtail', name:'Black Swallowtail', scientific:'Papilio polyxenes', emoji:'🦋', rarity:'common', category:'invert', regions:['national'], groups:['butterfly-flight'] },
    { id:'mourning-cloak', name:'Mourning Cloak', scientific:'Nymphalis antiopa', emoji:'🦋', rarity:'uncommon', category:'invert', regions:['national'], groups:['butterfly-flight'] },
    { id:'painted-lady', name:'Painted Lady', scientific:'Vanessa cardui', emoji:'🦋', rarity:'common', category:'invert', regions:['national'], groups:['butterfly-flight'] },
    { id:'honeybee', name:'Western Honey Bee', scientific:'Apis mellifera', emoji:'🐝', rarity:'common', category:'invert', regions:['national'] },
    { id:'common-eastern-bumblebee', name:'Common Eastern Bumble Bee', scientific:'Bombus impatiens', emoji:'🐝', rarity:'common', category:'invert', regions:['northeast','southeast','midwest'] },
    { id:'common-firefly', name:'Common Eastern Firefly', scientific:'Photinus pyralis', emoji:'✨', rarity:'common', category:'invert', regions:['northeast','southeast','midwest'] },
    { id:'periodical-cicada', name:'Periodical Cicada', scientific:'Magicicada septendecim', emoji:'🦗', rarity:'rare', category:'invert', regions:['northeast','southeast','midwest'] },
    { id:'praying-mantis', name:'Carolina Praying Mantis', scientific:'Stagmomantis carolina', emoji:'🦗', rarity:'uncommon', category:'invert', regions:['southeast','midwest','northeast'] },
    { id:'green-darner', name:'Common Green Darner', scientific:'Anax junius', emoji:'🦟', rarity:'uncommon', category:'invert', regions:['national'] },
    { id:'tarantula', name:'Texas Brown Tarantula', scientific:'Aphonopelma hentzi', emoji:'🕷️', rarity:'rare', category:'invert', regions:['southwest','midwest'] },
    { id:'black-widow', name:'Southern Black Widow', scientific:'Latrodectus mactans', emoji:'🕷️', rarity:'rare', category:'invert', regions:['southeast','southwest','midwest'] },

    // ════════════════════════════════════════════════════════════════════
    //   ZOO MODE — Global (~120)
    //   Setting: 'zoo'. These appear when the Zoo toggle is on, regardless
    //   of the selected wild region.
    // ════════════════════════════════════════════════════════════════════

    // ── Africa: Savanna ──
    { id:'african-lion', name:'African Lion', scientific:'Panthera leo', emoji:'🦁', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['big-cats'] },
    { id:'african-bush-elephant', name:'African Bush Elephant', scientific:'Loxodonta africana', emoji:'🐘', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'forest-elephant', name:'African Forest Elephant', scientific:'Loxodonta cyclotis', emoji:'🐘', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'reticulated-giraffe', name:'Reticulated Giraffe', scientific:'Giraffa reticulata', emoji:'🦒', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'plains-zebra', name:'Plains Zebra', scientific:'Equus quagga', emoji:'🦓', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'grevys-zebra', name:'Grevy\'s Zebra', scientific:'Equus grevyi', emoji:'🦓', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'white-rhinoceros', name:'White Rhinoceros', scientific:'Ceratotherium simum', emoji:'🦏', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'black-rhinoceros', name:'Black Rhinoceros', scientific:'Diceros bicornis', emoji:'🦏', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'hippopotamus', name:'Common Hippopotamus', scientific:'Hippopotamus amphibius', emoji:'🦛', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'cheetah', name:'Cheetah', scientific:'Acinonyx jubatus', emoji:'🐆', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['big-cats'] },
    { id:'leopard-african', name:'African Leopard', scientific:'Panthera pardus pardus', emoji:'🐆', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['big-cats'] },
    { id:'spotted-hyena', name:'Spotted Hyena', scientific:'Crocuta crocuta', emoji:'🐺', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'wildebeest', name:'Blue Wildebeest', scientific:'Connochaetes taurinus', emoji:'🦬', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'common-eland', name:'Common Eland', scientific:'Taurotragus oryx', emoji:'🦌', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'impala', name:'Impala', scientific:'Aepyceros melampus', emoji:'🦌', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'gemsbok', name:'Gemsbok (Oryx)', scientific:'Oryx gazella', emoji:'🦌', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'african-wild-dog', name:'African Wild Dog', scientific:'Lycaon pictus', emoji:'🐕', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'meerkat', name:'Meerkat', scientific:'Suricata suricatta', emoji:'🦡', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'aardvark', name:'Aardvark', scientific:'Orycteropus afer', emoji:'🦡', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'african-buffalo', name:'African (Cape) Buffalo', scientific:'Syncerus caffer', emoji:'🐃', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'common-ostrich', name:'Common Ostrich', scientific:'Struthio camelus', emoji:'🐦', rarity:'common', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'greater-flamingo', name:'Greater Flamingo', scientific:'Phoenicopterus roseus', emoji:'🦩', rarity:'common', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'secretary-bird', name:'Secretary Bird', scientific:'Sagittarius serpentarius', emoji:'🦅', rarity:'rare', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },

    // ── Africa: Jungle / Congo ──
    { id:'western-gorilla', name:'Western Gorilla', scientific:'Gorilla gorilla', emoji:'🦍', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['great-apes'] },
    { id:'mountain-gorilla', name:'Mountain Gorilla', scientific:'Gorilla beringei beringei', emoji:'🦍', rarity:'legendary', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'common-chimpanzee', name:'Common Chimpanzee', scientific:'Pan troglodytes', emoji:'🐒', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['great-apes'] },
    { id:'bonobo', name:'Bonobo', scientific:'Pan paniscus', emoji:'🐒', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['great-apes'] },
    { id:'mandrill', name:'Mandrill', scientific:'Mandrillus sphinx', emoji:'🐒', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'okapi', name:'Okapi', scientific:'Okapia johnstoni', emoji:'🦓', rarity:'epic', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'bongo', name:'Eastern Bongo', scientific:'Tragelaphus eurycerus isaaci', emoji:'🦌', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'african-grey-parrot', name:'African Grey Parrot', scientific:'Psittacus erithacus', emoji:'🦜', rarity:'rare', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'goliath-frog', name:'Goliath Frog', scientific:'Conraua goliath', emoji:'🐸', rarity:'epic', category:'amphibian', setting:'zoo', roadkillable:false, regions:['zoo'] },

    // ── South America: Amazon / Andes ──
    { id:'jaguar', name:'Jaguar', scientific:'Panthera onca', emoji:'🐆', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['big-cats'] },
    { id:'capybara', name:'Capybara', scientific:'Hydrochoerus hydrochaeris', emoji:'🐹', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'three-toed-sloth', name:'Brown-throated Three-toed Sloth', scientific:'Bradypus variegatus', emoji:'🦥', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'two-toed-sloth', name:'Hoffmann\'s Two-toed Sloth', scientific:'Choloepus hoffmanni', emoji:'🦥', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'giant-anteater', name:'Giant Anteater', scientific:'Myrmecophaga tridactyla', emoji:'🦡', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'south-american-tapir', name:'South American Tapir', scientific:'Tapirus terrestris', emoji:'🐗', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'toco-toucan', name:'Toco Toucan', scientific:'Ramphastos toco', emoji:'🦜', rarity:'common', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'scarlet-macaw', name:'Scarlet Macaw', scientific:'Ara macao', emoji:'🦜', rarity:'uncommon', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'hyacinth-macaw', name:'Hyacinth Macaw', scientific:'Anodorhynchus hyacinthinus', emoji:'🦜', rarity:'rare', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'llama', name:'Llama', scientific:'Lama glama', emoji:'🦙', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'alpaca', name:'Alpaca', scientific:'Vicugna pacos', emoji:'🦙', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'vicuna', name:'Vicuña', scientific:'Vicugna vicugna', emoji:'🦙', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'guanaco', name:'Guanaco', scientific:'Lama guanicoe', emoji:'🦙', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'andean-condor', name:'Andean Condor', scientific:'Vultur gryphus', emoji:'🦅', rarity:'rare', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'green-anaconda', name:'Green Anaconda', scientific:'Eunectes murinus', emoji:'🐍', rarity:'rare', category:'reptile', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'giant-river-otter', name:'Giant River Otter', scientific:'Pteronura brasiliensis', emoji:'🦦', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'maned-wolf', name:'Maned Wolf', scientific:'Chrysocyon brachyurus', emoji:'🦊', rarity:'epic', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'spectacled-caiman', name:'Spectacled Caiman', scientific:'Caiman crocodilus', emoji:'🐊', rarity:'uncommon', category:'reptile', setting:'zoo', roadkillable:false, regions:['zoo'] },

    // ── Asia: Subcontinent / Southeast ──
    { id:'bengal-tiger', name:'Bengal Tiger', scientific:'Panthera tigris tigris', emoji:'🐅', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['big-cats'] },
    { id:'sumatran-tiger', name:'Sumatran Tiger', scientific:'Panthera tigris sumatrae', emoji:'🐅', rarity:'legendary', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'asian-elephant', name:'Asian Elephant', scientific:'Elephas maximus', emoji:'🐘', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'indian-rhinoceros', name:'Indian Rhinoceros', scientific:'Rhinoceros unicornis', emoji:'🦏', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'sloth-bear', name:'Sloth Bear', scientific:'Melursus ursinus', emoji:'🐻', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'sun-bear', name:'Sun Bear', scientific:'Helarctos malayanus', emoji:'🐻', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'indian-peafowl', name:'Indian Peafowl', scientific:'Pavo cristatus', emoji:'🦚', rarity:'common', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'asian-water-buffalo', name:'Asian Water Buffalo', scientific:'Bubalus bubalis', emoji:'🐃', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'gharial', name:'Gharial', scientific:'Gavialis gangeticus', emoji:'🐊', rarity:'epic', category:'reptile', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'king-cobra', name:'King Cobra', scientific:'Ophiophagus hannah', emoji:'🐍', rarity:'epic', category:'reptile', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'reticulated-python', name:'Reticulated Python', scientific:'Malayopython reticulatus', emoji:'🐍', rarity:'rare', category:'reptile', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'lion-tailed-macaque', name:'Lion-tailed Macaque', scientific:'Macaca silenus', emoji:'🐒', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'sambar-deer', name:'Sambar Deer', scientific:'Rusa unicolor', emoji:'🦌', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'saltwater-crocodile', name:'Saltwater Crocodile', scientific:'Crocodylus porosus', emoji:'🐊', rarity:'epic', category:'reptile', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'komodo-dragon', name:'Komodo Dragon', scientific:'Varanus komodoensis', emoji:'🦎', rarity:'epic', category:'reptile', setting:'zoo', roadkillable:false, regions:['zoo'] },

    // ── Asia: Far East / Himalayas ──
    { id:'giant-panda', name:'Giant Panda', scientific:'Ailuropoda melanoleuca', emoji:'🐼', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'red-panda', name:'Red Panda', scientific:'Ailurus fulgens', emoji:'🦊', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'snow-leopard', name:'Snow Leopard', scientific:'Panthera uncia', emoji:'🐆', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['big-cats'] },
    { id:'amur-tiger', name:'Amur (Siberian) Tiger', scientific:'Panthera tigris altaica', emoji:'🐅', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'amur-leopard', name:'Amur Leopard', scientific:'Panthera pardus orientalis', emoji:'🐆', rarity:'legendary', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'bornean-orangutan', name:'Bornean Orangutan', scientific:'Pongo pygmaeus', emoji:'🦧', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['great-apes'] },
    { id:'sumatran-orangutan', name:'Sumatran Orangutan', scientific:'Pongo abelii', emoji:'🦧', rarity:'epic', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['great-apes'] },
    { id:'japanese-macaque', name:'Japanese Macaque (Snow Monkey)', scientific:'Macaca fuscata', emoji:'🐒', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'asian-black-bear', name:'Asian Black Bear', scientific:'Ursus thibetanus', emoji:'🐻', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'yak', name:'Domestic Yak', scientific:'Bos grunniens', emoji:'🐂', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'takin', name:'Takin', scientific:'Budorcas taxicolor', emoji:'🐂', rarity:'epic', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'markhor', name:'Markhor', scientific:'Capra falconeri', emoji:'🐐', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },

    // ── Australia & Oceania ──
    { id:'red-kangaroo', name:'Red Kangaroo', scientific:'Osphranter rufus', emoji:'🦘', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['marsupial-mob'] },
    { id:'eastern-grey-kangaroo', name:'Eastern Grey Kangaroo', scientific:'Macropus giganteus', emoji:'🦘', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'koala', name:'Koala', scientific:'Phascolarctos cinereus', emoji:'🐨', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['marsupial-mob'] },
    { id:'common-wombat', name:'Common Wombat', scientific:'Vombatus ursinus', emoji:'🦡', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['marsupial-mob'] },
    { id:'tasmanian-devil', name:'Tasmanian Devil', scientific:'Sarcophilus harrisii', emoji:'🦡', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['marsupial-mob'] },
    { id:'red-necked-wallaby', name:'Red-necked Wallaby', scientific:'Notamacropus rufogriseus', emoji:'🦘', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['marsupial-mob'] },
    { id:'platypus', name:'Platypus', scientific:'Ornithorhynchus anatinus', emoji:'🦫', rarity:'epic', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'short-beaked-echidna', name:'Short-beaked Echidna', scientific:'Tachyglossus aculeatus', emoji:'🦔', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'laughing-kookaburra', name:'Laughing Kookaburra', scientific:'Dacelo novaeguineae', emoji:'🐦', rarity:'common', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'emu', name:'Emu', scientific:'Dromaius novaehollandiae', emoji:'🐦', rarity:'common', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'cassowary', name:'Southern Cassowary', scientific:'Casuarius casuarius', emoji:'🐦', rarity:'rare', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'dingo', name:'Dingo', scientific:'Canis dingo', emoji:'🐕', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'quokka', name:'Quokka', scientific:'Setonix brachyurus', emoji:'🦘', rarity:'epic', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'frilled-lizard', name:'Frilled Lizard', scientific:'Chlamydosaurus kingii', emoji:'🦎', rarity:'rare', category:'reptile', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'tuatara', name:'Tuatara', scientific:'Sphenodon punctatus', emoji:'🦎', rarity:'epic', category:'reptile', setting:'zoo', roadkillable:false, regions:['zoo'] },

    // ── Polar & Marine ──
    { id:'emperor-penguin', name:'Emperor Penguin', scientific:'Aptenodytes forsteri', emoji:'🐧', rarity:'uncommon', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['antarctic'] },
    { id:'king-penguin', name:'King Penguin', scientific:'Aptenodytes patagonicus', emoji:'🐧', rarity:'common', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['antarctic'] },
    { id:'adelie-penguin', name:'Adélie Penguin', scientific:'Pygoscelis adeliae', emoji:'🐧', rarity:'common', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['antarctic'] },
    { id:'gentoo-penguin', name:'Gentoo Penguin', scientific:'Pygoscelis papua', emoji:'🐧', rarity:'common', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'humboldt-penguin', name:'Humboldt Penguin', scientific:'Spheniscus humboldti', emoji:'🐧', rarity:'common', category:'bird', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'leopard-seal', name:'Leopard Seal', scientific:'Hydrurga leptonyx', emoji:'🦭', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['antarctic'] },
    { id:'weddell-seal', name:'Weddell Seal', scientific:'Leptonychotes weddellii', emoji:'🦭', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['antarctic'] },
    { id:'galapagos-tortoise', name:'Galápagos Tortoise', scientific:'Chelonoidis niger', emoji:'🐢', rarity:'epic', category:'reptile', setting:'zoo', roadkillable:false, regions:['zoo'] },

    // ── Europe ──
    { id:'european-brown-bear', name:'Eurasian Brown Bear', scientific:'Ursus arctos arctos', emoji:'🐻', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'european-bison', name:'European Bison (Wisent)', scientific:'Bison bonasus', emoji:'🦬', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'iberian-lynx', name:'Iberian Lynx', scientific:'Lynx pardinus', emoji:'🐈', rarity:'legendary', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'eurasian-wolf', name:'Eurasian Wolf', scientific:'Canis lupus lupus', emoji:'🐺', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'red-deer', name:'Red Deer', scientific:'Cervus elaphus', emoji:'🦌', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'eurasian-lynx', name:'Eurasian Lynx', scientific:'Lynx lynx', emoji:'🐈', rarity:'rare', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'alpine-ibex', name:'Alpine Ibex', scientific:'Capra ibex', emoji:'🐐', rarity:'uncommon', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'european-badger', name:'European Badger', scientific:'Meles meles', emoji:'🦡', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'highland-cattle', name:'Highland Cattle', scientific:'Bos taurus taurus', emoji:'🐄', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },
    { id:'european-hedgehog', name:'West European Hedgehog', scientific:'Erinaceus europaeus', emoji:'🦔', rarity:'common', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'] },

    // ════════════════════════════════════════════════════════════════════
    //   MYTHIC — Cryptids of America
    // ════════════════════════════════════════════════════════════════════
    { id:'sasquatch', name:'Sasquatch (Bigfoot)', scientific:'Hominoides cryptidicus', emoji:'🦶', rarity:'mythic', category:'mammal', roadkillable:false, regions:['pacific-northwest','mountain-west'], groups:['cryptid-quest','world-cryptid'] },
    { id:'chupacabra', name:'Chupacabra', scientific:'Canis chupacabrensis', emoji:'👹', rarity:'mythic', category:'mammal', roadkillable:false, regions:['southwest'], groups:['cryptid-quest','world-cryptid'] },
    { id:'jackalope', name:'Jackalope', scientific:'Lepus cornutus', emoji:'🐰', rarity:'mythic', category:'mammal', roadkillable:false, regions:['mountain-west'], groups:['cryptid-quest','world-cryptid'] },

    // ════════════════════════════════════════════════════════════════════
    //   MYTHIC — World Cryptids (zoo)
    // ════════════════════════════════════════════════════════════════════
    { id:'yeti', name:'Yeti (Abominable Snowman)', scientific:'Hominoides himalayicus', emoji:'❄️', rarity:'mythic', category:'mammal', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['world-cryptid'] },
    { id:'loch-ness-monster', name:'Loch Ness Monster', scientific:'Plesiosaurus lochnessiae', emoji:'🦕', rarity:'mythic', category:'reptile', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['world-cryptid'] },
    { id:'mokele-mbembe', name:'Mokele-Mbembe', scientific:'Mokele sauropoda', emoji:'🦕', rarity:'mythic', category:'reptile', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['world-cryptid'] },
    { id:'kraken', name:'The Kraken', scientific:'Architeuthis kraken', emoji:'🐙', rarity:'mythic', category:'invert', setting:'zoo', roadkillable:false, regions:['zoo'], groups:['world-cryptid'] },
    { id:'mongolian-death-worm', name:'Mongolian Death Worm', scientific:'Olgoi-khorkhoi mongoliensis', emoji:'🪱', rarity:'mythic', category:'invert', setting:'zoo', roadkillable:false, regions:['zoo'] }
    ];

    // Apply default `setting: 'wild'` to anything without one (most US species).
    ANIMALS.forEach(a => { if (!a.setting) a.setting = 'wild'; });

    // ────────────────────────────────────────────────────────────────────
    // Helpers
    // ────────────────────────────────────────────────────────────────────

    function getAnimalById(id) { return ANIMALS.find(a => a.id === id) || null; }

    // animalsForRegion(region, opts)
    //   region: a key in REGIONS (or 'national', or 'zoo')
    //   opts.includeZoo: bool — when true, zoo animals are appended to the
    //     region's wild list. When the region itself is 'zoo', only zoo
    //     animals are returned regardless of this flag.
    function animalsForRegion(region, opts) {
        const includeZoo = !!(opts && opts.includeZoo);
        if (region === 'zoo') return ANIMALS.filter(a => a.setting === 'zoo');

        let pool;
        if (!region || region === 'national') {
            pool = ANIMALS.filter(a => a.setting !== 'zoo');
        } else {
            const inRegion = [], outOfRegion = [];
            ANIMALS.forEach(a => {
                if (a.setting === 'zoo') return;
                if (a.regions.includes(region) || a.regions.includes('national')) inRegion.push(a);
                else outOfRegion.push(a);
            });
            pool = inRegion.concat(outOfRegion);
        }
        if (includeZoo) pool = pool.concat(ANIMALS.filter(a => a.setting === 'zoo'));
        return pool;
    }

    function isOutOfRegion(animal, region) {
        if (!animal) return false;
        if (animal.setting === 'zoo') return false;
        if (!region || region === 'national' || region === 'zoo') return false;
        return !animal.regions.includes(region) && !animal.regions.includes('national');
    }

    function pointsForSpot(animal, kind, region) {
        const base = (RARITY[animal.rarity] || RARITY.common).points;
        const ofr = isOutOfRegion(animal, region);
        const multiplier = ofr ? 1.5 : 1;
        const roadkillExtra = (kind === 'roadkill') ? ROADKILL_BONUS : 0;
        return Math.round(base * multiplier) + roadkillExtra;
    }

    function speciesBonusPoints(animal) {
        return (RARITY[animal.rarity] || RARITY.common).points;
    }

    function quizOptions(animal, count) {
        const target = count || SPECIES_QUIZ_OPTION_COUNT;
        if (!animal || !animal.scientific) return [];
        const pool = ANIMALS.filter(a =>
            a.id !== animal.id &&
            a.scientific &&
            a.scientific !== animal.scientific
        );
        // Prefer same category + rarity for plausible distractors.
        let primary = pool.filter(a => a.category === animal.category && a.rarity === animal.rarity);
        if (primary.length < target - 1) primary = pool.filter(a => a.category === animal.category);
        if (primary.length < target - 1) primary = pool;
        const shuffled = primary.slice().sort(() => Math.random() - 0.5);
        const distractors = shuffled.slice(0, target - 1).map(a => a.scientific);
        const options = [animal.scientific, ...distractors];
        return options.sort(() => Math.random() - 0.5);
    }

    function earnedGroups(spots) {
        const earned = [];
        Object.entries(GROUPS).forEach(([gid, g]) => {
            if (g.special === 'anyRoadkill') {
                const roadkillCount = Object.values(spots || {})
                    .filter(s => s && s.roadkill).length;
                if (roadkillCount >= (g.threshold || 5)) earned.push(gid);
                return;
            }
            const allFound = (g.members || []).every(mid => {
                const s = spots && spots[mid];
                return s && (s.live || s.roadkill);
            });
            if (allFound) earned.push(gid);
        });
        return earned;
    }

    function tripTotal(spots, region) {
        let total = 0;
        Object.entries(spots || {}).forEach(([id, s]) => {
            const a = getAnimalById(id);
            if (!a || !s) return;
            if (s.live) total += pointsForSpot(a, 'live', region);
            if (s.roadkill) total += pointsForSpot(a, 'roadkill', region);
            if (s.species) total += speciesBonusPoints(a);
        });
        earnedGroups(spots).forEach(gid => total += GROUPS[gid].bonus || 0);
        return total;
    }

    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyCP7wJIufoS6_BVwlaBXtF0SOzqujN-uHo",
        authDomain: "sparkasia-studios.firebaseapp.com",
        databaseURL: "https://sparkasia-studios-default-rtdb.firebaseio.com/",
        projectId: "sparkasia-studios",
        storageBucket: "sparkasia-studios.firebasestorage.app",
        messagingSenderId: "1056103344185",
        appId: "1:1056103344185:web:7016bd6ad39b7a87cec5e8"
    };

    const API = {
        RARITY,
        CATEGORIES,
        ROADKILL_BONUS,
        FIRST_FINDER_BONUS,
        SPECIES_QUIZ_OPTION_COUNT,
        REGIONS,
        GROUPS,
        ANIMALS,
        FIREBASE_CONFIG,
        getAnimalById,
        animalsForRegion,
        isOutOfRegion,
        pointsForSpot,
        speciesBonusPoints,
        quizOptions,
        earnedGroups,
        tripTotal
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = API;
    } else {
        root.AnimalQuestData = API;
    }
})(typeof window !== 'undefined' ? window : globalThis);
