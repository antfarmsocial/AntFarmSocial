/*
 * Ant Farm Social
 * afsData.js (Configuration and content)
 *
 * This file contains or generates data structures containing configuration and content that would be obtrusive in the main file.
 *
 */

let types = {  // Note: Don't use keys "D", "Q", or "W" for these - they are reserved CSS identifiers for drone/queen/worker!
  N: {
    n: 'Black',
    v: 1, // speed
    s: 'm', // size
    d: 2, // 2 = meat/protein preference.
    t: "A common basic ant that could not be more plain if it tried, which it won't."
  },
  T: {
    n: 'Tiny',
    v: .8, // speed
    s: 's', // size
    d: 1, // 1 = sugar/carb/sweet eater.
    t: "The pesky little critter that gets stuck to your bottle of sweet chilli sauce."
  },
  B: {
    n: 'Bull',
    v: 1.2, // speed
    b: 1, // This ant bites.
    s: 'l', // size
    d: 2, // 2 = meat/protein preference.
    m: 50, // maxmood
    t: "A very nasty mean ant with a bad temper and a painful bite that penetrates your jeans."
  },
  G: {
    n: 'Green',
    v: 1.1, // speed
    b: 1, // This ant bites.
    s: 'm', // size
    d: 1, // 1 = sugar/carb/sweet eater.
    m: 75, // maxmood
    t: "This type of ant gets really mad if you pick it up and throw it at someone's neck."
  },
  F: {
    n: 'Fire',
    v: .9, // speed
    b: 1, // This ant bites.
    s: 's', // size
    d: 2, // 2 = meat/protein preference.
    m: 75, // maxmood
    t: "Fire ants are a severe invasive species and impact the quality of human life."
  },
  C: {
    n: 'Crazy',
    v: 1.5, // Note: Code assumes this is max speed.
    s: 'l', // size
    d: 1, // 1 = sugar/carb/sweet eater.
    m: 50, // maxmood
    t: "Notable for their quick erratic movements, these ants are simply quite cray."
  },
  J: {
    n: 'Ghost',
    v: .7, // speed
    s: 's', // size
    d: 2, // 2 = meat/protein preference.
    p: 1, // pro-level (don't autospawn)
    t: "The spookiest of all the ants, these tiny critters are quite the spectre-cle."
  },
  P: {
    n: 'Pharaoh',
    v: .7, // speed
    b: 1, // This ant bites.
    s: 'm', // size
    d: 2, // 2 = meat/protein preference.
    p: 1, // pro-level (don't autospawn)
    t: "This type of ant will completely rely on a poor man to do everything for them."
  },
  M: {
    n: 'Chimera',
    v: .6, // speed
    s: 's', // size
    d: 0, // 0 - no food preference
    p: 1, // pro-level (don't autospawn)
    t: "This impossibly blue critter is slow, can adapt to different diets, and is illusory."
  },
  Z: {
    n: 'Sugar',
    v: .6, // speed
    s: 'm', // size
    d: 1, // 1 = sugar/carb/sweet eater.
    p: 1, // pro-level (don't autospawn)
    t: "An ant that has so much diabetes it can barely walk and always feels tingly."
  },
  K: {
    n: 'Carpenter',
    v: .6, // speed
    s: 'm', // size
    d: 1, // 1 = sugar/carb/sweet eater.
    p: 1, // pro-level (don't autospawn)
    t: "Fantastic at construction, but always slowed down from lugging a tool belt."
  },
  H: {
    n: 'Red Harvester',
    v: .7, // speed
    b: 1, // This ant bites.
    s: 'm', // size
    d: 1, // 1 = sugar/carb/sweet eater.
    p: 1, // pro-level (don't autospawn)
    t: "This type of ant reaps the benefits of the strange places it just fell into."
  },
},

castes = {Q: 'Queen', D: 'Drone', W: 'Worker'},

items = {

  // BASIC ITEMS
  dirt: {
    n: 'Dirt Bucket',
    desc: "When you need to collect, bring a bucket!<br>For no reason in particular this one is full of dirt.",
    lvl: 0, // Default level.
    t: 'filler',
    max: 1,
    keep: 1,
    quip: [
      ["Here's your dirt, enjoy!", "Enjoy. Your. Dirt."],
      ["It's gonna get DIRRTY"],
      ["Dirty Diana? No…"],
      ["We Dirty A.N.T. (We do it for fun)"],
      ["That's probably not the best stuff for an ant farm"],
      ["Ah, pay dirt…"],
    ]
  },
  trash: {
    n: 'Trash Bag',
    desc: "You buy it.<br>You deal with it.",
    lvl: 0,
    max: 1,
    t: 'sanitation',
    keep: 1,
    quip: [
      ["Off to the Staten Island dump"],
      ["You coulda probably recycled that"],
      ["What a waste"],
      ["Oh Sadie… the cleaning lady…"],
      ["Great now throw it in the East River"],
      ["You certainly know your way around garbage"],
      ["Yeah that was a load of rubbish"],
    ]
  },
  tg: {
    n: 'The Glass',
    desc: "Want to know what your ants are up to?<br>Take a closer look.",
    lvl: 2,
    max: 1,
    keep: 1
  },
  car: {
    n: 'Carousel',
    desc: "Cycle through your farms automatically.<br>Like a screen saver but with ants.",
    lvl: 80,
    max: 1,
    keep: 1
  },

  // ANT MAINTENANCE ITEMS
  cola: {
    n: 'Cola',
    desc: "You're like 99% parched here.<br>You could really use a cola.",
    lvl: 0,
    max: 1,
    t: 'hydration',
    dr: 10,
    fd: 2,
    health: 1,
    sweet: 1,
    keep: 1,
    quip: [
      ["Why you never drink water, fatty?"],
      ["She shoot Coca-Cola"],
      ["Oy Scarface, settle down with the coke"],
      ["Who is this?  Whitney Houston?"],
      ["You want some fries to go with that mate?"],
      ["And the waters prevailed upon the earth an hundred and fifty days"],
    ]
  },
  bread: {
    n: 'Artesano Bread',
    desc: "With artisan hands, it is crafted with care.<br>Each crumb a masterpiece, beyond compare.",
    lvl: 2,
    t: 'nutrition',
    fd: 10,
    max: 1,
    keep: 1,
    quip: [
      ['A culinary delight, Artesano bread, a heavenly sight.'],
      ['Texture divine, a tender embrace, symphony of flavor, a delicate grace.'],
      ['Crust golden-brown, a whispering crunch. Gateway to taste, a lovely munch.'],
      ['Savor each bite with gratitude and glee for artesano bread is so right for me.'],
    ]
  },
  danish: {
    n: 'Cheese Danish',
    desc: "Nothing compares to a cheese danish.<br>This one has been stepped on though.",
    lvl: 5,
    t: 'nutrition',
    fd: 12,
    sweet: 1,
    max: 1,
    keep: 1,
    quip: [
      ['Let them eat crumbs!'],
      ["Happiness is a warm Cheese Danish."],
      ['Sweet cheese wrapped in dough,', 'A burst of warmth in each bite,', 'Mornings taste so right.'],
    ]
  },
  saltpork: {
    n: 'Salt Pork!',
    desc: "I want some Salt Pork!<br>I need halp!!!",
    lvl: 5,
    t: 'nutrition',
    fd: 12,
    meat: 1,
    max: 1,
    keep: 1,
    quip: [
      ['You could have just used bacon.'],
      ['I never eat a pig, cos a pig is a cop.'],
      ['Get some pork on your fork.'],
    ]
  },
  asti: {
    n: 'Asti Spumante',
    desc: "When you've got good taste it shows.<br>The celebration grows!",
    lvl: 5,
    max: 1,
    t: 'hydration',
    dr: 12,
    fd: 0,
    //md: -3,
    health: -1,
    keep: 1,
    quip: [
      ['When my bottle pop.'],
      ['When my bottle pop, shake me.'],
      ["Throw 'em back till I lose count…"],
      ["Don't cry for me next door neighbor."],
      ['You brought home champagne!'],
      ["It's imported champagne"],
      ["Mmm it's delicious champagne"],
      ['A good taste for good friends'],
    ]
  },
  hotdog: {
    n: 'Microwaved Hot Dog',
    desc: "That's the only way I cook my wieners.<br>(An ALDI in-house brand)",
    lvl: 8,
    t: 'nutrition',
    fd: 12,
    meat: 1,
    max: 1,
    keep: 1,
    quip: [
      ['A scent comes wafting...'],
      ['Packaging said, "Warning: Do not recycle this plastic."'],
      ["Ooh, it's hot dog time."],
      ['These boys were 89 cents.'],
      ['8 wieners, 89 cents.'],
      ['Leaking. Leaking! The Hog Dogs are leaking, people!'],
    ]
  },

  // PLAYER POWER-UPS
  cologne: {
    n: 'Antaeus Cologney',
    desc: "Smother yourself with it and the ants come marching in.<br>This is actually a real product.",
    max: 3,
    t: 'pheremone',
    lvl: 12,
    quip: [
      ['Smell like a man, man.'],
      ['Find Your Magic.'],
      ['Between Love and Madness Lies Obsession.'],
      ['The Power of Cool.'],
      ['The Essence of Mediterranean Beauty.'],
      ['Be Unexpected.'],
      ['A New Freshness.'],
      ["I'm the only one and I wore cologne."],
      ['You just cologney brother, when you need a hand.'],
    ]
  },
  antyvenom: {
    n: 'Anty Venom',
    desc: "A challenging tonic from a mystical northern land.<br>Not sure how to pronounce the brand, but it relieves pain, and definitely exists for a reason.",
    max: 6,
    lvl: 40,
    quip: [
      ['Not sure that was worth it.'],
      ['Eww.'],
      ['The drink is punishment in itself.'],
      ['Blerrhhh.'],
      ["Tonight's the night you fight your dad."],
      ['Turning taste buds into taste foes since 1933.'],
      ['When you need to unfriend someone… in person.'],
      ['The Champagne of Pain.'],
      ['Because your taste buds hate you.'],
    ]
  },
  clonekit: {
    n: 'Cloning Kit',
    desc: "Clones one of your worker ants three times.<br> ",
    lvl: 25,
    max: 1,
    t: 'science gizmo',
    quip: [
      ["The best way to predict the future is to create it."],
      ['We have not only the ability, but', 'the responsibility to guide our own evolution.'],
      ['Cloning is the sincerest form of flattery.'],
      ["You were so preoccupied with whether or not you could,", "you didn't stop to think if you should."],
      ["Genetic power is the most awesome force the planet's ever seen,", "but you wield it like a kid who's found his dad's gun."],
    ]
  },
  speedo: {
    n: 'Speedo',
    desc: "Warp time with this radio controller to speed up your farm.<br>(burns out after a few minutes)",
    lvl: 45,
    max: 1,
    t: 'science gizmo',
    quip: [
      ['Engage!'], ['Punch it!'], ["Let's light this candle!"], ['Taking the leap!'], ['Warp factor 9 now!'], ['Full burn'], ['Max thrust!'], ['Jumping ahead now!'],
    ]
  },

  // HATS
  spadoni: {
    n: 'Spa Doné Hat',
    desc: "I don't think that's the right spelling.<br>But you can call it whatever you like.",
    t: 'hat',
    lvl: 30,
    max: 1
  },
  spy: {
    n: 'Spy Hat',
    desc: "Sometimes ants need to go undercover.<br>And they usually use an alias.",
    t: 'hat',
    lvl: 40,
    max: 1
  },
  gangster: {
    n: 'Gangster Hat',
    desc: "Johnny Salami and Tony the Baker got ones just like it.<br>Those aren't even their real names.",
    t: 'hat',
    lvl: 40,
    max: 1
  },
  gangster: {
    n: 'Jazz Hat',
    desc: 'What do you call someone wearing a "Make Jazz Great Again" hat?<br>A Trumpet Supporter.',
    t: 'hat',
    lvl: 40,
    max: 1
  },
  landry: {
    n: 'Tom Landry Hat',
    desc: "It's officially known as the Tom Landry hat.<br>But you can call it a Cowboy hat for all I care.",
    t: 'hat',
    lvl: 40,
    max: 1
  },
  rhi: {
    n: 'Rhianna Hat',
    desc: "Ooh na na, what's my name?<br>Ooh na na, what's my name?",
    t: 'hat',
    lvl: 60,
    max: 1
  },
  bogart: {
    n: 'Humphrey Bogart Hat',
    desc: "Of all the ant farms in all the towns in all the world…<br>She walks into mine.",
    t: 'hat',
    lvl: 60,
    max: 1
  },
  jt: {
    n: 'Justin Timberlake Hat',
    desc: "What did you expect?<br>A Suit & Tie?",
    t: 'hat',
    lvl: 60,
    max: 1
  },
  sinatra: {
    n: 'Frank Sinatra Hat',
    desc: "Something stupid:<br>The way you look tonight.",
    t: 'hat',
    lvl: 60,
    max: 1
  },
  cohen: {
    n: 'Leonard Cohen Hat',
    desc: "You say I took the name in vain,<br>I don't even know the name.",
    t: 'hat',
    lvl: 60,
    max: 1
  },
  mj: {
    n: 'Michael Jackson Hat',
    desc: "Who?<br>He!",
    t: 'hat',
    lvl: 80,
    max: 1
  },
  depp: {
    n: 'Johnny Depp Hat',
    desc: "The Mad Hatter's very own<br> ",
    t: 'hat',
    lvl: 80,
    max: 1
  },
  pitt: {
    n: 'Brad Pitt Hat',
    desc: "So you're Brad Pitt.<br>That don't impress me much.",
    t: 'hat',
    lvl: 80,
    max: 1
  },
  walt: {
    n: 'Walt Disney Hat',
    desc: "Put it right on top of<br>the most magical place on Earth.",
    t: 'hat',
    lvl: 80,
    max: 1
  },

  // PAINTS
  green: {
    n: "Juicy Green",
    desc: 'Nothing says natural like a vibrant green.<br>So paint your plastics with this copper, arsenic, and cadmium blend.',
    t: 'paint',
    lvl: 20,
    col: '#64bc41',
    max: 3
  },
  red: {
    n: 'Reddy Rich',
    desc: "You know what it is.<br>You Reddy?",
    t: 'paint',
    lvl: 30,
    col: '#d83030',
    max: 3
  },
  blue: {
    n: 'Bright Blue',
    desc: "The shade of brilliant blue.<br>It's sure to catch every eye.",
    t: 'paint',
    lvl: 30,
    col: '#3fa1ec',
    max: 3
  },
  yellow: {
    n: 'Yellow',
    desc: 'Look at this paint, look how it shines for you.<br>And it was called "Yellow".',
    t: 'paint',
    lvl: 40,
    col: '#ffca46',
    max: 3
  },
  orchid: {
    n: "Owens' Orchid",
    desc: "It's the paint with<br>a helluva nice taint.",
    t: 'paint',
    max: 3,
    lvl: 50,
    col: '#9932CC'
  },
  orange: {
    n: "Orange Groove",
    desc: "Marmalade, juice, or chicken.<br>This paint has a lot of… versatility.",
    t: 'paint',
    max: 3,
    lvl: 60,
    col: '#fb8500'
  },
  white: {
    n: "Titanium",
    desc: "I'm bull**it proof.  Nothing to lose.<br>Fire-A-Way! Fire-A-Way!",
    t: 'paint',
    max: 3,
    lvl: 80,
    col: '#efefef'
  },
  pink: {
    n: "P!nk",
    desc: "Out of paints that are most like a color type, this is one of the two in the pink.<br>So what?",
    t: 'paint',
    max: 3,
    lvl: 80,
    col: '#FF69B4'
  },
  black: {
    n: "Midnight",
    desc: "It's not exactly midnight.<br>It's close to midnight.",
    t: 'paint',
    max: 3,
    lvl: 80,
    col: '#333333'
  },
  silver: {
    n: "Ardent Argent",
    desc: "That is silver.<br> ",
    t: 'paint',
    max: 2,
    lvl: 100,
    col: '#dcdddf',
    fx: 'm', // metallic
    quip: [
      ["Don't cry for me."],
      ['Ardent Argent is an arduous agent.'],
      ['The silver spoon is the hardest to remove from the mouth.'],
      ["Oh there's that silver lining..."],
      ['A shiny new masterpiece'],
    ]
  },
  gold: {
    n: "Comedy Gold",
    desc: "It's gold. It's gold.<br> ",
    t: 'paint',
    max: 2,
    lvl: 120,
    col: '#e6b510',
    fx: 'm', // metallic
    quip: [
      ['Solid gold...'],
      ['I got the Midas touch'],
      ["I ain't saying she's a gold digger..."],
      ["It's a gold-plated life"],
    ]
  },
  // Dummy item for crucible burnt farms.
  metal: {
    nodrop: 1,
    fx: 'm'
  },

  // ANT TUBES
  harv: {
    n: "The Red Queen",
    desc: "There are worse lives to live.<br>Don't feel sorry for me.",
    t: 'ants',
    max: 1,
    lvl: 120,
    col: 'red',
    ant: 'H'
  },
  carp: {
    n: "The Carpenters",
    desc: "Look what Mr Postman has delivered!<br>Oh yes, wait a minute.",
    t: 'ants',
    max: 1,
    lvl: 120,
    col: 'orange',
    ant: 'K',
    W: 5 // Gives 5 workers.
  },
  sug: {
    n: "Sugar Mama",
    desc: "An older, more experienced, Queen.<br>She'll get things going for you.",
    t: 'ants',
    max: 1,
    lvl: 140,
    col: 'yellow',
    ant: 'Z'
  },
  chi: {
    n: "Lady Chimera",
    desc: "It's pronounced <em>chimera</em>.<br>But, go on…",
    t: 'ants',
    max: 1,
    lvl: 140,
    col: 'blue',
    ant: 'M'
  },
  phar: {
    n: "Queen Of The Nile",
    desc: "Mother of Pharaohs.<br>She'll light the darkness that threatens the land.",
    t: 'ants',
    max: 1,
    lvl: 160,
    col: 'orchid',
    ant: 'P'
  },
  ghst: {
    n: "The Ghost Crew",
    desc: "I ain't afraid of no ghost.<br> ",
    t: 'ants',
    max: 1,
    lvl: 160,
    col: 'silver',
    ant: 'J',
    W: 7 // Gives 7 workers.
  },
  vial: {
    n: "Ant Collection Vial",
    desc: "Ants love getting into these<br>and can survive in them forever.",
    lvl: 0,
    t: 'ants',
    nodrop: 1
  },
  collected: {
    n: "Collected Ants",
    desc: "",
    lvl: 0,
    t: 'ants',
    nodrop: 1
  },

  // EXPANSION ITEMS
  plate: {
    n: 'Plate',
    desc: "For the bottom, the flared base...<br>plate.",
    lvl: 10,
    max: 2,
    t: 'name plaque',
    quip: [
      ['Nice name!'],
      ['Why did you choose that?'],
      ['Interesting choice!'],
      ['OK well we did that.']
    ],
    keep: 1
  },
  antFarm: {
    n: 'Ant Farm',
    desc: "Set up a new Ant Farm.<br>100% SCIENTIFICALLY ACCURATE",
    lvl: 20,
    max: 2,
    t: 'expansion pack',
    quip: [
      ['Alright! Here is a new farm.'],
      ['New farm for you.'],
      ['Here is your unboxed ant farm.'],
      ['A clean slate.'],
      ["You just wanna be startin' something."],
      ["Enter HEYSCOOPS at checkout!"],
    ]
  },
  tube: {
    n: 'ToobWay™ Connector',
    desc: "DO YOU KNOW DA WAY™<br>YOU DO NOT KNOW DA WAY™",
    lvl: 40,
    max: 2,
    t: 'expansion accessory',
    keep: 1,
  },
  sand: {
    n: 'Sand Bag',
    desc: "The town provides free sand for flooding.<br>You could use this for ants or something.",
    lvl: 10,
    t: 'filler',
    max: 1,
    keep: 1,
    quip: [
      ['These are the days of our lives.'],
      ['Like sands through an ant farm glass…'],
      ['Enter the sand, man.'],
      ["It's course and rough and irritating."],
      ['And it gets everywhere.'],
    ]
  },
  gel: {
    n: 'NASA Gel',
    desc: "Ant habitat gel that ants can get some food and water from too.<br>Not exactly natural for ants, but I wonder what else we could put ants into?",
    lvl: 20,
    t: 'filler',
    max: 2,
    quip: [
      ["I don't think you're ready for this."],
      ['Can you dig it? (Yes)'],
      ["That's one small step for an ant"]
      ["Failure is not an option"],
      ["Do the other things, not because they are easy, but because they are hard."],
      ["The dream of yesterday is the hope of today and the reality of tomorrow."],
    ]
  },
  beer: {
    n: 'Beer Jell-O',
    desc: "Ant habitat jell-O that provides some food/water<br>and improves ant mood a lot.",
    lvl: 50,
    t: 'filler',
    max: 1,
    quip: [
      ['Can you dig it? (Yes)'],
      ['Open your world'],
      ['Stay thirsty, my friends'],
      ['This is the original'],
      ['Take pride in your beer'],
      ['Be legacy'],
      ['Watch it wiggle, see it jiggle'],
      ["There's always room for Jell-O"],
      ["The Jell-O that jingles"],
    ]
  },
  product: {
    n: 'Professional Wet-Look Product',
    desc: 'Ant habitat product that provides some food/water,<br>as well as a little mood and health boost.',
    lvl: 60,
    t: 'filler',
    max: 1,
    quip: [
      ['For all ant types'],
      ['For flip, bounce, and hold'],
      ['Shape your style!'],
      ['Rock your style!'],
      ['Salon proven'],
    ]
  },
  lube: {
    n: 'Expired Bulk Personal Lubricant',
    desc: 'Ant habitat filth that provides some food/water,<br>attracts queens, and encourages laying.',
    lvl: 69,
    t: 'filler',
    max: 1,
    quip: [
      ["I don't think you're ready for this."],
      ['Lube glorious lube'],
      ['This fkn town…'],
      ['Keeps love going'],
      ['For a smooth ride'],
      ['Slip into pleasure'],
    ]
  },
  slime: {
    n: 'Slime',
    desc: "Ant habitat slime that provides a decent amount of food/water, and some health.<br>* grape flavored",
    lvl: 76,
    t: 'filler',
    max: 1,
    quip: [
      ['Slime… anyone?'],
      ["I don't know about this"],
      ["What is slime made of? I don't know!"],
      ["Grape? Next time get lime slime!"]
      ['Drip. Drop. Squish. Pop!'],
      ['The fun that never dries up'],
    ]
  },
  ooze: {
    n: 'The Secret Ooze',
    desc: "Ant habitat ooze that provides some food/water<br>and gives a lot of health but decreases mood.",
    lvl: 84,
    t: 'filler',
    max: 1,
    quip: [
      ['Get ready to ooze with excitement'],
      ["That's no ordinary ooze… it's the secret of our past!"],
      ["The mutagen is unstable. If we're not careful, it could mutate us even further!"],
      ["Dude, I still can't believe a little ooze made us totally awesome!"],
      ["The ooze is what made us… and it can make others like us!"],
    ]
  },
  feng: {
    n: 'Mystical Feng Shui Pack',
    desc: "For ants who crave better energy flow. Includes suspiciously scented incense.<br>Reorder your farms to achieve inner ant-peace.",
    lvl: 168,
    t: 'farm-sorter',
    max: 1,
    keep: 1
  },

  // SCENERY ITEMS
  mountains: {
    n: 'Mountains',
    desc: "Mountains rise tall like ant hills, their grandeur the landscape fulfills.<br>Ain't no mountain too high, for the ants or the sky. Both conquer with tiny, strong wills.",
    t: 'scenery',
    lvl: 5,
    max: 2
  },
  liberty: {
    n: 'French Statue',
    desc: "Your huddled colonies yearning to breathe free.<br>Yet captive they will remain.",
    t: 'decor',
    lvl: 10,
    max: 2
  },
  pyramids: {
    n: 'Pyramids',
    desc: "The pyramids house kings of old, in chambers with tunnels untold.<br>Like ants in their nest, the Pharaohs find rest, in a labyrinth of treasure and gold.",
    t: 'scenery',
    lvl: 30,
    max: 2
  },
  obelisk: {
    n: 'Obelisk',
    desc: "You may tell one person about your ant farm.<br>(we don't talk about the tiny pyramid at the top)",
    t: 'decor',
    max: 1,
    lvl: 30
  },
  barn: {
    n: 'Barn',
    desc: "Ants have sophisticated ways to store food.<br>A barn is not one of those ways.",
    t: 'decor',
    max: 2,
    lvl: 30
  },
  piff: {
    n: 'Piff',
    desc: "Best show I've seen in ages.<br>(chairs were uncomfortable - one star)",
    t: 'decor',
    max: 1,
    lvl: 60
  },
  jesus: {
    n: 'Jesus',
    desc: "The Ant Christ<br>Not to be confused with the other guy.",
    t: 'decor',
    max: 1,
    lvl: 70
  },

  // BACKGROUND CARD ITEMS
  clouds: {
    n: 'Cloudy Days',
    desc: "Add some immersive realism to your farm<br>with this high-quality printed card.",
    t: 'card',
    max: 1,
    lvl: 20
  },
  canada: {
    n: 'Canada',
    desc: "<br>It's somewhere above…",
    t: 'card',
    max: 1,
    lvl: 50
  },
  vegas: {
    n: 'Vegas',
    desc: "<br>(note: ants may become preoccupied with parking and weather)",
    t: 'card',
    lvl: 60,
    max: 1
  },
  desert: {
    n: 'Desolation',
    desc: "A printed card so realistic that you can feel the despair and hopelessness<br>just like if you really drove to Arizona.",
    t: 'card',
    max: 1,
    lvl: 60
  },
  space: {
    n: 'The Final Frontier',
    desc: "I hear it's not as good as Star Trek: The Experience<br>I wanted to go to that. Who was in that, anyway?",
    t: 'card',
    max: 1,
    lvl: 80
  },

  // SPECIAL ITEMS
  antfax: {
    n: 'ANT FAX',
    desc: "THE ant fact organizer<br>of the nineties.",
    t: 'educational fun',
    max: 1,
    lvl: 20,
    keep: 1
  },
  antfaxpro: {
    n: 'ANT FAX PRO',
    desc: "Even more fun ant facts<br>for the brightest of learners.",
    t: 'educational fun',
    max: 1,
    lvl: 120,
    keep: 1
  },
  box: {
    n: 'Nerd Box',
    desc: "Whatever's in there might fill the empty void in your soul.<br>Just like the crate that housed the ark of the covenant.",
    t: 'gift',
    lvl: 17,
    max: 3,
    quip: [
      ['Enter HEYSCOOPS at checkout!'],
      ['From the nerd community as a whole.'],
      ['Any of the items that you crave'],
      ['It really is about the experience'],
      ['For me personally, Nerd Box is great.'],
      ['I think we all love Nerd Box'],
      ['Nerd Box is the 23rd best nerd subscription service'],
      ['Only the price of 6 to 8 cups of Starbucks coffee a day'],
    ]
  },
  bus: {
    n: 'Ticket 2 Ride',
    desc: "Mystical pass to a whole new backdrop, doubles as an unspoken confession of mid-life crisis…<br>…admits one man/child.",
    t: 'location swapper',
    max: 2,
    lvl: 25,
    quip: [
      ["You wanna go for a ride?"],
      ['Jump in!'],
      ['Jump on board!'],
      ["Let's fkn go!"],
      ["The wheels on the bus go 'round and 'round"],
      ["Great! Let's go…"]
    ]
  },
  backdrop: {
    n: 'Low Key Backdrop',
    desc: "This backdrop has been scientifically proven to make your ex wish they hadn't dumped you.<br> ",
    t: 'location enhancer',
    max: 2,
    lvl: 75,
    quip: [
      ["Introducing the backdrop that's more exciting than my last family dinner!"],
      ["Get ready for a backdrop so beautiful, even your selfies will be jealous."],
      ["I've finally found the perfect backdrop!"],
      ["Behold the new backdrop!"],
      ["I promised myself I wouldn't fall in love with a backdrop, but here we are..."],
      ["If this backdrop had a dating profile, it would say 'seeks good lighting and interesting subjects.'"],
      ["This is the backdrop you didn't know you needed but will absolutely love."],
      ["It's so stunning!"]
    ]
  },
  crucible: {
    n: 'The Crucible',
    desc: "Liquid metal<br> ",
    t: 'bad idea',
    max: 2,
    lvl: 200,
    quip: [
      ["Tsssssssssssssss..."],
      ["Yeowwwww"],
      ["Aaaaaaargghhhhhh"],
    ]
  },
  ebay: {
    n: 'eBay',
    desc: "A digital garage sale for old ant farms.<br>The highest bid will be a serving of disappointment.",
    t: 'app',
    max: 1,
    keep: 1,
    lvl: 200
  },
  coexist: {
    n: '☪︎☮︎é✡︎ì࿊✞',
    desc: "Advocates that ants of different faiths and belief systems can live together peacefully.",
    t: 'sticker',
    max: 1,
    lvl: 222
  },
  mom: {
    n: 'Mom',
    desc: "Bucket to mop, you've done it all.<br>You cleaned up.",
    t: 'percent DAT UGLY BITCH',
    max: 1,
    keep: 1,
    lvl: 100,
    nodrop: 1 // Don't randomly drop this item.
  },

},

// Button labels.
dropOK = ['Yeah OK', 'Alrighty', 'Rightio', 'Huh', 'What', 'k', 'Mmm Hmm', 'Yup', 'Got it', 'OK whatever', 'Sweet', 'Thanks I guess'],
achOK = ['Yes', 'I did', 'Cheers', 'Woohoo', 'Bam', 'Boom', 'Nice', 'Yay', 'Right?', 'There it is', 'Click this', 'Awesome'],

// Pools of random messages for specific occasions.
welcome = [['Welcome to Ant Farm Social.', "We're preaching ants."],['Hey Johnny, do you wanna go to an Ant Farm Social?']],
newFarm = [['Here is your new Ant Farm. You need to get you some ants.', 'You may notice some free ants roaming your screen.']],
biteMsg = [["You've been bit!", "You can't collect ants until you're better"], ["Ouch! You were bitten!", "You'll need to wait until this passes"]],
tapMsg = [["They don't like that"], ['Stop that'], ["Tappa-Tappa-Tappa"], ['Shh! This is the listening side of the plexiglass'], ['This is supposed to be a quiet activity']],
firstPoint = [['You scored your first point! 🏆'], ['🎉🎉🎉 1 point! 🎉🎉🎉'], ['You caught your first ant! 🐜'], ["Well done, there's your first one. 1️⃣"]],
secondPoint = [['You scored your second point! You go you! 😉'], ['Two points!!! 🥇🥇'], ["Two's company!"], ['Oh the number one is not my favourite number.', "Because one means there's just me and there's no you."]],
lidLift = [['Check your openings for papers'], ["It's ALWAYS open"], ["It's like a sweathouse in there"], ["I lifted the lid, and now I have questions."], ["Lift the lid of curiosity"],
["Some secrets are best left untouched"], ["You might regret this"], ["Get back in your hole!"], ["The mystery beneath is revealed!"], ["Dealing with what's inside? That's the real challenge."],
["What are you looking in there for?"], ["Why do that?"], ["Hey put that back!"], ["Leave it on buddy"], ["What if they escape?"]],

kudos = [
  // Silly congratulatory messages.
  [
    ["Ain't nobody catch ants 🐜 like you"],
    ["Way to go hot shot 🔥🎯🔥"],
    ["You can DO IT! 🤗"],
    ["🎸You're a ROCK STAR ⚡🤟⚡"],
    ["Yo! You scorin' like Jordan ⛹️🏀⛹🏿🏀⛹️‍♂️"],
    ["We're gonna SCORE tonight! 🎳"],
    ["🔥🔥🔥 Oh you are on FIRE 🔥🔥🔥"],
    ["😎 You're the boss apple sauce"],
    ["They should just call you Hank Pym 👨‍🔬⚗️🔬"],
    ["You're gonna have more ants than Paul Rudd 🦸🏻‍♂️"],
    ["🤙😎 Ants in my pants make me wanna hula dance 🏄🏝"],
    ["It's exhausting always rooting for the ant-hero 🎸🦸🏼‍♀️"],
    ["🎯 Bullseye!"],
    ["🏌️ Yeah that'll play ⛳"],
    ["Slam dunk! 🏀"],
    ["⚽ GOAL!!! ⚽"],
    ["🏈 TOUCHDOWN!"],
    ["💥 Boom!!!"],
    ["Gobble me, swallow me, ants down inside of me YEAH"],
    ["You're crushing it like a pro! 💪🏽💥"],
    ["Ant-tastic job! 🐜👏"],
    ["You nailed it! 🔨✨"],
    ["Bravo! You're unstoppable! 🏆🌟"],
    ["You're the bee's knees! 🐝🎉"],
    ["High five! ✋ You did it! 🙌"],
    ["You're a wizard at this! 🧙‍♂️✨"],
    ["👏 Standing ovation for you! 👏"],
    ["You've got the Midas touch! 💛✨"],
    ["You're a legend in the making! 🌟💫"],
    ["Keep shining! ✨ You're a star! 🌟"],
    ["Rock on, champ! 🎸🔥"],
    ["You're a dynamo! 💥💪"],
    ["Ant-believable job! 🐜🔥"],
    ["You're soaring high! 🦅🚀"],
    ["You make it look easy! 🏅😎"],
    ["Champ status achieved! 🏆🏅"],
    ["You're a powerhouse! ⚡💥"],
    ["Out of this world! 🌌🚀"],
    ["🦪🌎 The world is your oyster 🌎🦪"],
    ["Keep rocking! 🎸 You're amazing! 🤟"],
    ["You're the Beyoncé of this hive! 🐝👑"],
    ["Ant-man? More like Superman! 🦸‍♂️💪"],
    ["Smashing it like the Hulk! 💥🦸‍♂️"],
    ["You're a wizard, Harry! 🧙‍♂️✨"],
    ["You've got the moves like Jagger! 🕺🎤"],
    ["You're a Jedi master! ✨🧙‍♂️"],
    ["Making waves like Beyoncé! 🐝🌊"],
    ["You got this! Just like Rocky! 🥊🏅"],
    ["A thriller, like MJ! 🎤🕺"],
    ["As fierce as Katniss Everdeen! 🏹🔥"],
    ["Unstoppable, like Wonder Woman! 🦸‍♀️💪"],
    ["On fire like Katniss in the arena! 🔥🏹"],
    ["You're a star, just like Lady Gaga! ⭐🎤"],
    ["Oh, you're the GOAT like Michael Jordan! 🐐🏀"],
    ["Making magic like Harry Potter! ✨🧙‍♂️"],
    ["Legendary, like Prince! 🎸💜"],
    ["As sharp as Sherlock Holmes! 🕵️‍♂️🔍"],
    ["Hitting high notes like Mariah Carey! 🎤🎶"],
    ["As cool as the other side of the pillow, like Denzel Washington! 😎🎬"],
    ["You're the king of the world, like Leo in Titanic! 🚢👑"],
    ["A hero, like Spidey! 🕷️🦸‍♂️"],
    ["You rock harder than AC/DC! 🎸⚡"],
    ["You're soaring like an eagle, like in Free Bird! 🦅🎸"],
    ["Unbreakable, like Bruce Willis! 💪🎬"],
    ["Shine bright like a diamond 💎🎤"],
    ["As smooth as James Bond! 🍸🕶️"],
    ["You're the one that I want, ooh ooh ooh! 🎶💃"],
    ["Hey now! You're a rockstar, get your game on, go play! 🌟🎤"],
    ["As cool as Fonzie! 😎👍"],
    ["You roar, like Katy Perry! 🦁🎤"],
    ["All ants are equal, but some are more equal than others."],
  ],
  // Reserved congratulatory messages.
  [
    ["Cool, you did it. 👍"],
    ["Nice. You're like, the best, or whatever. 🌟"],
    ["Oh, look at you go. 🏆"],
    ["Great job. 🐝"],
    ["Wow, you're a real superstar. 🌟🎤"],
    ["You're really something. 🏅"],
    ["You're like a legend. 🌟"],
    ["Well done. 🎯"],
    ["Oh, another win. 🏆"],
    ["You're so cool. 😎"],
    ["Wow, you're amazing. 🐐"],
    ["You did it, yay. 🎉"],
    ["Cool, you're on fire. 🔥"],
    ["You're like, awesome. ⭐"],
    ["So great, wow. 🎤"],
    ["Oh, neat. 🎯"],
    ["Great, you did it. 🏆"],
    ["Way to go, hot stuff. 🔥"],
    ["Good job, I guess. 🎉"],
    ["🎈 Cool beans. 🎈"],
    ["Nice work, I guess. 🥱"],
    ["Oh, you did that. 🥳"],
    ["Impressive, kinda. 🌟"],
    ["You did a thing. 🎉"],
    ["Congrats, I suppose. 🌟"],
    ["Oh wow, look at you. 🏆"],
    ["Well, that happened. 🎈"],
    ["You're like, okay at this. 🏅"],
    ["Yay, or whatever. 🎉"],
    ["Great, another win. 🏅"],
    ["You're alright at this. ⭐"],
    ["Nice job, or something. 🎯"],
    ["Well, good for you. 🏆"],
    ["Cool, another achievement. 🌟"],
    ["Oh, you did it. 🏅"],
    ["Nice one, I guess. 🥇"],
    ["Yay, you did a thing. 🎉"],
    ["Wow, you did it. 🏆"],
    ["Oh look, you won another ant. 🥇"],
    ["Great, you succeeded. 🏅"],
    ["You're kinda good at this. ⭐"],
    ["Nice, you accomplished it. 🎉"],
    ["Wow, you did a thing. 🏆"],
    ["Cool, you achieved something. 🥇"],
  ],
  // Apathetic congratulatory messages.
  [
    ["Congrats."],
    ["Impressive, kind of."],
    ["You did it, I guess."],
    ["Oh, you managed that."],
    ["Well done, sorta."],
    ["Good for you, I suppose."],
    ["Way to go, I guess."],
    ["Congrats, or something."],
    ["Well done, I guess."],
    ["You're something special, I suppose."],
    ["Cool story, bro."],
    ["Oh, another achievement."],
    ["You're the best, apparently."],
    ["Congrats or whatever."],
    ["You got another point."],
    ["You captured an ant."],
    ["Another point for you."],
    ["One more ant."],
    ["You scored again."],
    ["Another ant down."],
    ["You got one."],
    ["One more for you."],
    ["You got another."],
    ["You did it again."],
    ["Captured one more."],
    ["Another capture."],
    ["One more point."],
    ["You caught another."],
    ["Got another one."],
    ["You took another."],
    ["Another one caught."],
    ["Scored again."],
    ["You got it."],
    ["Another one for you."],
    ["You took one."],
    ["Another taken."],
    ["Point for you."],
    ["Another for you."],
    ["One more caught."],
    ["You managed another."],
    ["Captured again."],
    ["You caught it."],
    ["Another ant captured."],
  ],
  // Congratulatory messages that are indicative of malaise,
  // and that have contempt and disdain for the player, or are demeaning taunts.
  [
    ["Wow, another one. How impressive. Not."],
    ["Oh, you got another? Big deal."],
    ["Another ant? You're really scraping the bottom of the barrel."],
    ["Congratulations, you captured an ant. How thrilling."],
    ["Oh look, another point. Yawn."],
    ["You got one more. Should we throw a parade?"],
    ["Another ant? What an overachiever."],
    ["Wow, another point. You must be so proud."],
    ["You caught another? Stunning."],
    ["Oh great, another ant. How riveting."],
    ["You did it again. Must be exhausting being so mediocre."],
    ["Another one? Try harder."],
    ["Got another one? Don't hurt yourself."],
    ["Wow, another capture. How absolutely thrilling."],
    ["One more? Aren't you just special."],
    ["Another point? You must be so pleased with yourself."],
    ["You took another? What an accomplishment."],
    ["Oh, another ant. Your life must be so exciting."],
    ["You managed another one. How impressive."],
    ["One more? Seriously?"],
    ["Another one for you. Shocking."],
    ["Wow, another point. Try not to strain yourself."],
    ["You got another one? Please, contain your excitement."],
    ["Another capture? Yawn."],
    ["Oh look, another ant. How amazing."],
    ["Another point? Groundbreaking."],
    ["Wow, you caught another. Should we celebrate?"],
    ["One more? You're on fire. Not."],
    ["You took another. Be still, my heart."],
    ["Another one? I'm trembling with excitement."],
    ["Another one. Wow."],
    ["Big deal."],
    ["Yay, another."],
    ["You got one."],
    ["Great, another."],
    ["Another. Cool."],
    ["Oh, another."],
    ["You got it."],
    ["Another. Nice."],
    ["One more. Yay."],
    ["You did it."],
    ["Another. Sure."],
    ["Oh look, another."],
    ["Yet another. Whatever."],
    ["Wow. Another."],
    ["You got another."],
  ],
],

jokes = [
  // Terrible ants jokes / limericks / triple-threats.
  [
    // Terrible jokes
    ["What do you call two teenage ants running off to Vegas?", "Antelope"],
    ["How many ants are needed to fill an apartment?", "Tenants"],
    ["What do you call an ant who likes to be alone?", "Independant"],
    ["What is the biggest ant in the world?", "Elephant"],
    ["What do you call a really tall ant?", "Giant"],
    ["What do you call a 100 year old ant?", "Antique"],
    ["What game do ants play with elephants?", "Squash"],
    ["Why don't anteaters get sick?", "Because they are full of antibodies"],
    ["What do you call an ant from overseas?", "Important"],
    ["What do you call an ant with frogs legs?", "Antphibian"],
    ["What's the difference between writing your will and owning an ant farm?", "One is a legacy and the other is a sea of legs."],
    ["Why did the ant race along the boxtop?", 'Because the box said: "Tear Along Dotted Line."'],
    ["What do you call an ant who sluffs school?", "Truant"],
    ["What kind of ant is good at adding things up?", "Accountant"],
    ["What did Pink Panther say when he stepped on an ant?", "Dead Ant, Dead Ant….Dead Ant, Dead Ant, Dead Ant…"],
    ["Who do you call for injured ants?", "The Ant-bulance!"],
    ["What do you call an army ant?", "Militant"],
    ["What is the top ranking ant in the military?", "Lieutenant"],
    ["What do you get when you cross an ant with French royalty?", "Marie Ant-toinette!"],
    ["Will an Ant trip if you…", "Give it antacid?"],
    ["What do you call an ant bartender?", "Piss-ant"],
    ["What do you call a captive ant that hasn't been freed?", "Antebellum"],
    ["What do ants sing while working?", "A sea sh-anty"],
    ["Don't you just love the ant-icipation?"],
    ["The stories playing out in this farm could make an ant-hology"],
    ["Some of the older ants are ant-iques!"],
    ["Having a queen is better than ant-archy"],
    ["This farm should have its own national ant-hem"],
    ["Ant nothin but a G thang"],

    // Limericks
    ["There once was an ant with great charm,", "Living in an ant farm, so warm.", "With tunnels so neat,", "It couldn't be beat,", "In its tiny ant-sized farm!"],
    ["In an ant farm, there lived a queen,", "Ruling over ants, small and keen.", "They dug and they toiled,", "Building tunnels coiled,", "Creating a bustling ant scene!"],
    ["In the ant farm, mischief would brew,", "As ants marched in a mischievous queue.", "They'd steal all the crumbs,", "With their tiny ant thumbs,", "Creating chaos, that ant farm crew!"],
    ["There once was a tiny, small ant,", "Who worked with such vigor and chant.", "With friends in a line,", "They'd build and they'd dine,", "And never once would they recant."],
    ["In a bustling ant colony hive,", "The ants work and keep it alive.", "With a queen in command,", "They all lend a hand,", "Together, they strive and they thrive."],
    ["An ant farm's a sight to behold,", "With tunnels and stories untold.", "They dig and they play,", "In their own little way,", "Creating a world to unfold."],
    ["In a game of great simulation,", "I build worlds with pure dedication.", "From cities to farms,", "With intricate charms,", "It's a digital creation sensation."],
    ["On an ant farm, the critters all teem,", "Through tunnels, they follow a dream.", "They work and they play,", "In their own ant-ish way,", "In a life that's more grand than it seems."],
    ["In a game, I command with great ease,", "An ant colony's tasks I appease.", "They gather and build,", "With roles to be filled,", "In a world where I do as I please."],

    // Haikus
    ["In lines they march on,", "Small lives with purpose unite,", "Harmony in soil."],
    ["Ant farm in the glass,", "World within a world of work,", "Silent toil abides."],
    ["Beneath our tall feet,", "Ants weave tales of earth and grit,", "Wisdom in their stride."],
    ["Tiny architects,", "Building dreams in grains of sand,", "Lessons in each step."],
    ["Through tunnels they roam,", "Echoes of their journeys blend,", "Life's maze intertwined."],
    ["Tiny crumbs vanish,", "Ants host a grand buffet feast,", "Who invited them?"],
    ["Ants in my picnic,", "Uninvited, yet so keen,", "Guess they like my cheese."],
    ["Ant colony scheme,", "Build an empire underground,", "No one tell the queen."],
    ["Ant farm's daily grind,", "Tiny riots over crumbs,", "Drama in small worlds."],
    ["Marching in a line,", "Ants on a mission for food,", "Where's the GPS?"],

    // Triple threat 1
    ["185 ants walk into a bar…", "The bartender says 'We don't serve ants here.'", "The ants reply 'We just came for the ant-tastic drinks!'"],
    ["185 ants walk into a bar…", "The bartender says 'We don't serve ants in here!'", "One ant goes 'We're just looking for a tiny sip!'"],
    ["185 ants walk into a bar…", "The bartender says 'We don't serve ants.'", "One ant replies 'That's quite ant-agonizing!'"],
    ["185 ants walk into a casino bar…", "The bartender says 'Hey, we've got a strict no-ants policy.'", "The ants say 'We just wanted to raise the ant-te!'"],

    // Triple threat 2
    ["I like my women like I like my ants:", "Carrying more than their own weight."],
    ["I like my men like I like my ant colonies:", "Communicating without saying a word."],
    ["I like my women like I like my ant farms:", "Full of tunnels."],
    ["I like my men like I like my ant simulator:", "Always challenging."],
    ["I like my men like I like my ants:", "Knowing who's queen."],
    ["I like my women like I like my ants:", "All over my picnic."],
    ["I like my men like I like my ant colonies:", "Swarming around me."],
    ["I like my men like I like my ant colonies:", "Easily squashed."],
    ["I like my women like I like my ant farms:", "Behind glass I can peep through."],
    ["I like my women like I like my ant simulator:", "Easy to quit."],
    ["I like my women like I like my ants:", "In my pants."],
    ["I like my men like I like my ant farms:", "Digging deep."],
    ["I like my women like I like my ants:", "Small."],
    ["I like my women like I like my ants:", "Always finding a way into my house."],
    ["I like my men like I like my ant colonies:", "Coming in hundreds."],

    // Triple threat 3
    ["They call me the ant farm,", "Because I'm very dirty."],
    ["They call me the simulator game,", "Because people love to play with me but it's all just pretend."],
    ["They call me the pheromone trail,", "Because I lead everyone to the action."],
    ["They call me the ant farm glass,", "Because you can see right through my intentions."],
    ["They call me the ant trap,", "Because once you step in, you can't get out."],
    ["They call me the glitch,", "Because I can mess up your simulation in ways you never expected."],

    // Ant trivia that keeps mentioning Israel
    ["In Israel, the Cataglyphis niger ant has been studied extensively","due to its remarkable navigational abilities.","These ants live in harsh desert environments","and have adapted to find their way back to their nests","over long distances using the position of the sun and internal step-counting.","Israeli researchers have been fascinated by their precise homing skills","in the extreme heat of the southern Israeli Negev desert.","This ability to navigate in seemingly featureless landscapes…","has drawn parallels to modern robotic navigation techniques."," ","In fact, the research conducted in Israel on desert ants…","has contributed to the understanding of biological navigation systems","which in turn has inspired improvements in robotics","and Israeli autonomous vehicle guidance systems."],
    ["In Israel, scientists discovered a unique species of blind subterranean ants","called Aphaenogaster phillipsi, which thrive in caves in the Galilee region.","These ants have adapted to their dark, underground environment","by losing their eyesight completely and relying on chemical signals","and vibrations to communicate and navigate.","This discovery is quite significant because it highlights","the extreme adaptations organisms can develop","in response to their specific environments."," ","Additionally, these Israeli cave ants have attracted interest from biologists","studying evolutionary processes and how creatures adapt over time","to isolated and challenging Israeli habitats."],
    ["In Israel's Hula Valley there is an ant species called Crematogaster scutellaris","and it plays a surprising role in local agriculture.","These ants have a symbiotic relationship with fig trees.","The ants protect the fig trees from herbivorous insects and pests","in exchange for the sugary secretions produced by the tree's fig wasps.", "This mutualistic interaction has been observed to significantly benefit the fig trees","resulting in healthier plants and higher fruit yields for Israelis."," ","This ant-fig partnership garnered attention from agricultural researchers in Israel","as they study natural methods of pest control","that reduce the need for chemical pesticides","contributing to more sustainable farming practices in that region of Israel."],
    ["In Israel, researchers have studied the Tapinoma israele.","These ants are known for their highly efficient recruitment behavior.","When they discover a food source, they quickly recruit other members of their colony", "using chemical trails to lead them directly to the food.","What makes Tapinoma israele particularly interesting is their speed and coordination","with which they mobilize their colony compared to other ant species."," ","This behavior has implications for the study of collective intelligence and swarm behavior","areas that are of great interest in fields like computer science and robotics.","Israeli researchers are exploring how ant foraging can inspire algorithms","for solving problems like optimizing routes in networks or coordinating robot swarms."],
  ],

  // Philosophical ant puns and jokes.
  [
    ["If an ant is contemplating existence…", '…does that make it an "ant-thropologist"?'],
    ["Do ants dream of giant picnic blankets…", '…or is that just an "ant-illusion"?'],
    ["If an ant meditates in the middle of a colony and no one hears it…", '…does it still reach "ant-lightenment"?'],
    ["Is the purpose of an ant's life to build the perfect ant-hill…", '…or to find the ultimate "ant-swer"?'],
    ["If an ant writes a philosophical treatise…", '…would it be considered "ant-ellectual" property?'],
    ["When ants gather for deep conversations…", '…do they form an "ant-hology" of thoughts?'],
    ["Can an ant change its destiny…", '…or is it stuck in an "ant-ernal" cycle?'],
    ["If an ant has an existential crisis…", '…is it called an "ant-xiety" attack?'],
    ['Do ants ponder the "ant-oropy" of their universe…', "…and their place within it?"],
    ["Is an ant that seeks knowledge on the meaning of life…", '…a true "ant-seeker"?'],
    ["If ants had a concept of ethics…", '…would they follow an "ant-ics" code?'],
    ["Do ants ever wonder if their tiny actions create…", '…"ant-icipated" consequences in the grand scheme of life?'],
    ["Can an ant ever escape its predetermined role…", '…or is it bound by "ant-tuition"?'],
    ["If an ant questions the nature of reality…", '…is it engaging in "ant-ology"?'],
    ['Is there an ultimate "ant-cestor"…', "…that all ants revere as the origin of their species?"],
    ["Do ants believe in the concept of free will…", '…or do they accept their "ant-omated" existence?'],
    ["If an ant philosopher wrote about love…", '…would it call it "ant-icipation"?'],
    ["Do ants have their own version of…", '…the "ant-iest" argument for the existence of a higher power?'],
    ["If an ant achieves great things…", '…does it ponder if it has fulfilled its "ant-ential"?'],
    ["When ants gather to discuss the mysteries of the universe…", '…do they hold an "ant-cient" symposium?'],
    ["Can an ant's search for knowledge…", '…be considered an "ant-ellectual" journey?'],
    ["If an ant believes in multiple lives…", '…does it wonder about its "ant-carnation"?'],
    ["Is an ant's journey through life…", '…guided by "ant-uition" or random chance?'],
    ["If ants had their own version of existential dread…", '…would they call it "ant-nihilation"?'],
    ["When an ant faces a moral dilemma…", '…does it seek advice from an "ant-agonist"?'],
    ["We're a microcosm of life in general and the co-dependency of all life."],
  ],

  // Philosophical questions referring to ants.
  [
    ["Do ants have an awareness of their role within the colony…", "…or do they act purely on instinct without consciousness?"],
    ["If an ant could understand human concepts of freedom…", "…would it see its life as confined by its duties or liberated by its purpose?"],
    ["Do ants experience a sense of community and belonging…", "…and how does this compare to human experiences of society and relationships?"],
    ["Can the collective behavior of an ant colony teach us about…", "…the nature of emergent phenomena in complex systems?"],
    ["Do ants possess a form of morality, and if so…", "…how do their moral codes compare to human ethics?"],
    ["If an ant had the ability to reflect on its existence…", "…what might it consider the meaning or purpose of its life?"],
    ["How does the life of an ant challenge our understanding…", "…of individual versus collective identity?"],
    ["Do ants exhibit any behaviors that suggest they experience emotions or subjective states…", "…and how might this influence our perception of…", "…consciousness in non-human species?"],
    ["What can the intricate social structure of an ant colony teach us…", "…about the balance between order and chaos in nature?"],
    ["If ants were capable of philosophical thought, how might they interpret…", "…the concept of free will within the confines of their highly structured lives?"],
    ["How does the life cycle of an ant mirror…", "…the existential questions humans face about birth, life, and death?"],
    ["Do ants have a form of communication that could be considered a language…", "…and what implications does this have for our understanding of…", "…communication and intelligence in other species?"],
    ["If ants were able to contemplate the universe…", "…how might their understanding differ from human cosmology and metaphysics?"],
    ["How do ants perceive time, and what can this tell us…", "…about the subjective experience of temporality across different species?"],
    ["Do ants have any form of aesthetic appreciation, and if so…", "…what does this say about the nature of beauty and art in the natural world?"],
    ["How might an ant's perspective on its environment inform…", "…our own understanding of ecological relationships and interdependence?"],
    ["If an ant could consider its own mortality…", "…how might it approach the concept of an afterlife or legacy?"],
    ["Do the cooperative behaviors of ants suggest an innate altruism…", "…and how does this compare to human theories of ethics and moral behavior?"],
    ['How does the concept of "self" apply to an ant…', "…nd what does this reveal about the nature of individual identity?"],
    ["If ants could engage in philosophical discourse…", "…what questions would they ask about the nature of reality and existence?"],
    ["If an ant colony operates as a unified organism…", "…can we consider each individual ant as merely a transient expression of a larger, collective consciousness?"],
    ["Do ants, in their tireless labor and unwavering devotion to the colony…", "…illustrate a form of existence that transcends individuality and embraces a higher purpose beyond the self?"],
    ["Could the intricate structures built by ants be seen…", "…as physical manifestations of an abstract, collective will…", "…a reminder that individual identity is an illusion in the face of greater collective goals?"],
    ["If an ant's life is spent in service to the colony…", "…does this challenge the notion of individual agency and free will…", "…suggesting instead that our actions are predetermined by our roles within a larger social framework?"],
    ["In contemplating the hierarchical organization of ant colonies…", "…do we glimpse a reflection of our own societal structures…", "…and does this provoke us to question the authenticity of our individual roles and identities?"],
    ["Can the ephemeral nature of an ant's life—devoted entirely to the survival and prosperity of the colony…", "…serve as a metaphor for our own fleeting existence…", "…prompting us to reconsider the significance of our own pursuits and ambitions?"],
    ["When an ant sacrifices itself for the greater good of the colony…", "…does this act challenge our understanding of altruism and selflessness…", "…raising doubts about the authenticity of our own moral convictions and ethical choices?"],
    ["Do ants, through their instinctual behaviors and collective intelligence…", "…offer a glimpse into a reality where individual consciousness is subsumed by a communal mind…", "…a concept that challenges our traditional notions of selfhood and personal identity?"],
    ["Could the complex pheromone trails laid by ants…", "…be seen as a form of communication that transcends language…", "…suggesting a deeper, non-verbal mode of interaction…", "…that evokes existential questions about…", "…the limits of human understanding and perception?"],
    ["If ants exhibit behaviors that seem to defy individual survival instincts…", "…in favor of the collective good, does this compel us to reconsider the nature of self-preservation…", "…and the motivations behind our own actions in a world driven by material desires and personal gain?"],
    ["In observing the tireless labor of ants and their unwavering dedication to the colony…", "…do we confront our own existential anxieties about purpose and meaning…", "…prompting us to question whether our pursuits in the material world…", "…are ultimately fulfilling or illusory?"],
    ["When ants construct elaborate nests and fortifications…", "…could these structures be seen as symbolic representations of our own quest…", "…for permanence and security in an impermanent and unpredictable universe?"],
    ["If an ant's life is measured in moments of collective achievement…", "…rather than individual accomplishments…", "…does this challenge our preconceptions about success and fulfillment…", "…urging us to rethink the value of personal ambition and ego-driven pursuits?"],
    ["Can the orderly and disciplined behavior of ants…", "…in the face of adversity teach us lessons about resilience and adaptability…", "…prompting us to reconsider our own responses to challenges and uncertainties in life?"],
    ["When an ant navigates its environment with precision and purpose…", "…guided by instincts honed over millions of years of evolution…", "…does this suggest a form of knowledge and wisdom that transcends individual experience…", "…calling into question our own understanding of intelligence and consciousness?"],
  ],

  // Statements of existential dread referring to ants.
  [
    ["The ceaseless labor of ants, each one lost in its duties…", "…mirrors the existential terror of a life…", "…consumed by purpose yet devoid of meaning."],
    ["In the intricate tunnels of an ant colony…", "…I see the futility of our human constructions…", "…mere facades masking the void within."],
    ["The collective unity of ants belies a terrifying truth:", "Individual identity dissolves into insignificance…", "…amidst the vast expanse of cosmic indifference."],
    ["When ants march in unison, driven by instincts older than time…", "…I am haunted by the realization that our own pursuits may be equally predetermined…", "…devoid of true agency."],
    ["Ants, in their blind obedience to the colony…", "…serve as a stark reminder of our own submission to societal norms…", "…our identities eroded by conformity to systems we can neither control nor escape."],
    ["The ephemeral life of an ant…", "…devoted to tasks it cannot comprehend…", "…mirrors the existential dread of being trapped in cycles of existence…", "…devoid of purpose beyond mere survival."],
    ["Amidst the bustling activity of an ant hill…", "…I confront the chilling prospect that…", "…our own achievements may be nothing more than…", "…frantic attempts to stave off the inevitable void."],
    ["When an ant sacrifices itself for the colony…", "…I am struck by the tragic beauty of selflessness…", "…yet haunted by the realization that…", "…such acts may be futile gestures in an indifferent universe."],
    ["The intricate patterns of ant behavior…", "…governed by unseen forces of evolution…", "…evoke a profound terror:", "Are we, too, unwitting actors in a cosmic drama…", "…our destinies shaped by forces beyond our comprehension?"],
    ["As ants build their nests with unwavering determination…", "…I am gripped by a profound sense of dread:", "Are our own pursuits of security and stability merely illusions…", "…fragile defenses against the chaos that surrounds us?"],
    ["Watching ants toil endlessly…", "…I'm confronted by the terrifying insignificance of my own fleeting existence."],
    ["The brief life of an ant reminds me of my own impending mortality…", "…each moment slipping away into oblivion."],
    ["As ants build and die…", "…I am haunted by the realization that my own efforts are equally transient and meaningless."],
    ["The relentless march of ants mirrors the inescapable approach of my own death…", "…a destiny I cannot evade."],
    ["In the endless cycle of an ant's life, I see the futility of my own…", "…bound by the same inescapable end."],
    ["The insignificance of a single ant in its colony…", "…reflects the terrifying insignificance of my own life in the grand scheme."],
    ["Each ant's sacrifice for the colony reminds me…", "…of the inevitable end that awaits…", "…rendering my struggles pointless."],
    ["The relentless, instinctual drive of ants serves as…", "…a bleak reminder of my own mortality, driven by forces beyond control."],
    ["As ants face their brief existence…", "…I am struck by the horrifying brevity of my own life…", "…a fleeting moment in time."],
    ["The transient life of an ant is a stark reminder of my own mortality…", "…each passing day a step closer to the end."],
    ["Ants' short, dutiful lives reflect my own ephemeral existence…", "…underscoring the inevitability of death."],
    ["The fragile life of an ant mirrors my own mortality…", "…a constant reminder of the end that looms ever closer."],
    ["The cycle of life and death in ants brings a chilling awareness…", "…of my own finite time on this earth."],
    ["Observing ants, I am gripped by the dread of my own mortality…", "…every moment a reminder of the approaching void."],
    ["The brevity of an ant's life starkly parallels my own…", "…a sobering reminder that death awaits us all."],
    ["Have you ever seen an ant die of dehydration on a hot day just as it gets to water?", "I have."],
  ],

  // Uplifting or enlightening statements and jokes.
  [
    ["In the tireless work of ants, I find peace…", "…realizing that every small effort contributes to a greater purpose."],
    ["Watching ants, I embrace the fleeting nature of life…", "…finding joy in each moment, no matter how brief."],
    ["The unity of ants in their colony reminds me that we are all connected…", "…and this interconnectedness brings me profound contentment."],
    ["As ants build their intricate nests…", "…I see the beauty in our own creations…", "…ephemeral yet meaningful."],
    ["The determined march of ants shows me that persistence…", "…even in the face of mortality…", "…is a celebration of life itself."],
    ["Observing ants, I realize that our lives, though short…", "…are filled with moments that ripple through time, leaving a lasting impact."],
    ["The sacrificial acts of ants for their colony reveal the beauty of selflessness…", "…inspiring me to live with compassion and purpose."],
    ["The simple, instinctual life of an ant teaches me to embrace the present…", "…finding joy in the here and now."],
    ["In the cycle of an ant's life, I see the natural ebb and flow of existence…", "…finding peace in the inevitability of my own journey."],
    ["The small but mighty ant teaches me that every action…", "…no matter how small…", "…has value and significance."],
    ["Watching ants…", "…I find solace in the realization that life's meaning is found in the journey…", "…not the destination."],
    ["The collaborative spirit of ants reminds me that together…", "…we can achieve greatness, and this unity brings me joy."],
    ["The industrious ant shows me that a life of purpose…", "…however modest…", "…is a life well-lived."],
    ["Watching ants work with purpose…", "…I realize that even in fleeting moments…", "…there is profound beauty in existence."],
    ["The brief life of an ant teaches me to cherish every moment…", "…finding joy in the simplicity of being."],
    ["In the intricate dance of ants…", "…I see a reflection of life's delicate balance…", "…embracing my own journey with newfound serenity."],
    ["The relentless march of ants reminds me that each step…", "…no matter how small…", "…contributes to the grand tapestry of life."],
    ["As ants build and thrive, I understand that my efforts…", "…however transient…", "…create ripples of meaning in the universe."],
    ["The unity of an ant colony reveals the power of connection and purpose…", "…inspiring me to live harmoniously and fully."],
    ["Each ant's sacrifice for the colony illuminates the beauty of selflessness…", "…filling me with a sense of peace and fulfillment."],
    ["The instinctual drive of ants to live fully in their short lives…", "…inspires me to embrace my mortality with joy and gratitude."],
    ["Observing ants face their brief existence with purpose…", "…I find a comforting reminder that life is to be lived, not feared."],
    ["The transient life of an ant teaches me to savor the present…", "…finding happiness in the here and now."],
    ["Ants' short, meaningful lives reveal the truth that every moment holds significance…", "…bringing me a profound sense of enlightenment."],
    ["The fragile life of an ant reflects the delicate beauty of my own existence…", "…inspiring me to live with grace and joy."],
    ["The cycle of life and death in ants brings a comforting awareness…", "…of the natural flow of existence, filling me with peace."],
    ["Observing ants, I am filled with the realization that life's brevity…", "…is what makes it precious, encouraging me to live fully."],
    ["The brevity of an ant's life highlights the importance of…", "…making each moment count…", "…infusing my days with joy and purpose."],
    ["Watching ants work together, I see the strength in community and collaboration…", "…uplifting my spirit with a sense of belonging."],
    ["The small, purposeful actions of ants remind me that every effort…", "…no matter how tiny…", "…contributes to the greater good, bringing me joy."],
    ["In the diligent efforts of ants, I find a metaphor for resilience and adaptability…", "…encouraging me to face life's challenges with a light heart."],
    ["The ephemeral life of an ant becomes a source of inspiration…", "…teaching me to embrace my mortality with a smile and a sense of adventure."],
    ["Each ant's dedication to its role fills me with a profound understanding of purpose…", "…leading me to accept and celebrate my own life's journey."],
    ["The purposeful life of an ant inspires me to find joy in my daily tasks…", "…knowing that each moment is a part of a larger, beautiful whole."],
    ["Watching ants thrive in their communities, I am reminded that…", "…our connections bring us strength and happiness, enriching our lives with meaning."],
    ["In the simplicity of an ant's existence, I find profound wisdom…", "…teaching me to appreciate the little things and live with a light heart."],
    ["The coordinated efforts of ants show me the power of unity…", "…filling me with hope and a sense of belonging in the world."],
    ["The ephemeral journey of an ant teaches me to embrace change…", "…and find joy in the present, making every moment a celebration."],
    ["Ants' tireless work for the good of the colony inspires me…", "…to contribute positively to the world around me…", "…filling my life with purpose and joy."],
    ["Seeing ants face their challenges with resilience…", "…I am uplifted by the reminder that…", "…I, too, can overcome obstacles with grace and determination."],
    ["The small yet significant actions of ants encourage me to live mindfully…", "…appreciating the beauty in every step of my own journey."],
    ["Observing ants, I am filled with a sense of wonder at the interconnectedness of life…", "…bringing me peace and a joyful acceptance of my place in the world."],
    ["The dedication of ants to their community teaches me the value of cooperation and mutual support…", "…uplifting my spirit with the power of togetherness."],
    ["Why did the ant meditate?", "To find inner peace in every little crumb of life."],
    ["What do you call an ant who writes philosophical musings?", "A profound-ant."],
    ["Why did the ant join a yoga class?", "To learn how to be truly present in every tiny step."],
    ["How do ants achieve enlightenment?", "By realizing they're part of a greater colony and not sweating the small stuff."],
    ["Why don't ants get stressed about the future?", "They know life is short, so they focus on enjoying the sweet moments."],
    ["What's an ant's favorite philosophy?", "Ant-icism: believing that even the smallest beings can make a big impact."],
    ["How do ants find joy in their work?", "They know that every grain of sand they carry is a step towards building a great colony."],
    ["Why did the ant philosopher feel content?", "He realized that every little task contributes to the grand design of life."],
    ["What did the enlightened ant say to the anxious ant?", "Don't worry, be ant-happy!"],
    ["How do ants stay optimistic?", "They see every obstacle as just another pebble in the path to greatness."],
    ["Why did the ant laugh at existential dread?", "Because it knew that even in the face of mortality, it's the journey that counts, not just the destination."],
    ["What's an ant's secret to a happy life?", "They take it one step at a time and enjoy every morsel along the way."],
    ["Why did the ant philosopher stop worrying about the meaning of life?", "He found it in every leaf, crumb, and trail."],
    ["How do ants teach us about joy?", "By showing that even the smallest creatures can lead lives filled with purpose and community."],
    ["What did the ant say when it reached enlightenment?", "I finally understand - it's all about the colony, man!"],
    ["Why did the ant sit under the Bodhi tree?", "To achieve ant-enlightenment and discover the true nature of crumb-ness."],
    ["How do ants stay so wise?", "They follow the teachings of their guru, Ant-istotle, who said…", '"Happiness depends on ourselves…and a good picnic."'],
    ["What's an ant's favorite religious philosophy?", "Ant-theism: believing that even the smallest acts of kindness…", "…can create a ripple effect of joy."],
    ["Why do ants never get lost in existential thoughts?", "Because they know the meaning of life is to carry on and share crumbs with their friends."],
    ["How do ants find spiritual fulfillment?", "They practice ant-erior design, creating cozy little homes that spark joy."],
    ["What did the Zen ant say?", '"Be present, like a crumb on the wind."'],
    ["How do ants reach Nirvana?", "By following the Eightfold Path… of sugar trails!"],
    ["Why did the ant become a monk?", "To find the true sweetness within and master the art of crumb-centration."],
    ["What's an ant's version of the Golden Rule?", "Treat others' crumbs as you would want your crumbs to be treated."],
    ["How do ants keep their spirits high?", "They chant, *Om…nivore's delight!*"],
    ["Why did the ant start a philosophy club?", 'To discuss the big questions, like, "What is the sound of one crumb falling?"'],
    ["How do ants achieve spiritual balance?", "Through daily practices of crumb-gathering and mindful munching."],
    ["What's an ant's motto for a happy life?", '"Keep calm and crumb on."'],
    ["How do ants view the afterlife?", "As an endless picnic in the sky, filled with eternal crumbs."],
    ["Why did the ant meditate in the colony?", "To find inner piece… of cake!"],
    ["What did the ant philosopher say about life?", '"Life is a series of tiny steps. Enjoy every single one, especially the ones toward dessert."'],
    ["How do ants practice gratitude?", "By appreciating every crumb, knowing that each one is a gift from the universe."],
    ["Why did the ant visit the oracle?", "To find out if there's more to life than just crumbs - and discovered there's also cake!"],
    ["How do ants stay enlightened?", 'They follow the teachings of the Dal-ant Lama, who says, "Be kind, be diligent, and always share your crumbs."'],
    ["What's the ant's secret to inner peace?", "Realizing that every trail leads to a new adventure, and every crumb is a tiny miracle."],
  ],
],

// Achievements list.
ach = {
  'blood': {
    n: "Blood Type",
    desc: "Have one kind of ant in a farm.",
    lvls: 1,
    sub: "of a kind",
    ico: "🩸",
    lvl: 3,
  },
  'sac': {
    n: "Sacrifices",
    desc: "Feed rival ants to meat eaters.",
    lvls: 1,
    sub: "ants sacrificed",
    ico: "🤼‍♂️",
    lvl: 5,
  },
  'scene': {
    n: "Be Scene",
    desc: "Place scenery items.",
    lvls: 1,
    sub: "items placed",
    ico: "⛰️",
    lvl: 20,
  },
  'fac': {
    n: "Factory Fourm",
    desc: "Have four farms developing.",
    sub: "farms",
    ico: "🏭",
    lvl: 25,
  },
  'tri': {
    n: "Tri-fill-cta",
    desc: "Have 3 fill types used at the same time.",
    ico: "3️⃣",
    lvl: 30,
  },
  'arty': {
    n: "Arty Farty",
    desc: "Paint several items.",
    lvls: 1,
    sub: "items painted",
    ico: "🎨",
    lvl: 32,
  },
  'sweep': {
    n: "Queen Sweep",
    desc: "A single queen wipes out a colony.",
    ico: "👸🏾",
    lvl: 35,
  },
  'kweens': {
    n: "Kweens",
    desc: "Have multiple queens in a colony.",
    ico: "👑",
    lvl: 40,
  },
  'progeny': {
    n: "Progeny",
    desc: "Start a farm without capturing free ants.",
    ico: "🐜",
    lvl: 45,
  },
  'man': {
    n: "Man Fairies",
    desc: "Nurse drone ants to adulthood.",
    lvls: 1,
    sub: "drones",
    ico: "🧚‍♂️",
    lvl: 50,
  },
  'drag': {
    n: "Dragged Queen",
    desc: "Insert a queen taken from another farm.",
    ico: "💃",
    lvl: 55,
  },
  'hb': {
    n: "Heartbreaker",
    desc: 'Have a nest with 10 "other" causes of death.',
    ico: "💔",
    lvl: 60,
  },
  'day': {
    n: "Twinny Faux",
    desc: "Keep a farm going at least a day.",
    ico: "🌗",
    lvl: 65,
  },
  'weak': {
    n: "The Weak End",
    desc: "Keep a farm going for 7 days.",
    ico: "📅",
    lvl: 80,
  },
  'mom': {
    n: "Get Mom",
    desc: "What the heck???",
    ico: "🤔",
    lvl: 100,
  },
},

// The blank data structure of a farm object.
farmDefault = {
  stats: {
    death: {
      hunger: 0,
      thirst: 0,
      fight: 0,
      other: 0,
    },
    cap: 0,
  },
  a: [], // ants
  e: [], // eggs
  c: [], // carry
  tuns: [],
  hills: [],
  items: [],
  decals: [],
  nips: [],
  dig: [],
},

// Actions that can be enqueued when in certain areas, and a flag indicating whether they can be done randomly.
// The first item in each list is the default action. There should always be a corresponding function in act[action].
// Some functions rely on the actions being listed here, stop doubting it.
acts = {
  'bg': {crawl: 1, uncrawl: 1, rest: 1, fight: 0, slip: 0, land: 0, kip: 0, lay: 0, nip: 0, freeze: 0, die: 0, carry: 0},
  'top': {pace: 1, dive: 1, dig: 1, crawl: 1, rest: 1, eat: 1, drink: 1, fight: 0, kip: 0, lay: 0, get: 0, nip: 0, freeze: 0, die: 0, carry: 0},
  'bot': {dive: 1, climb: 1, rest: 1, srv: 0, fight: 0, eat: 0, kip: 0, lay: 0, get: 0, nip: 0, freeze: 0, die: 0, carry: 0, drop: 0},
},

// Nip Ids (Note: 0 is not a valid key for nipIds)
nipIds = [0, 'nip-bl', 'nip-br', 'nip-tl', 'nip-tr'],

// Reasons an ant might die.
deathCauses = {
  hunger: 'of hunger',
  thirst: 'of thirst',
  fight: 'in a fight',
  other: 'of a broken heart'
},

// HTML for farm.
farmTemplate =
`<div id="kit">
  <div id="wrapper" class="farm" data-col="green">
    <div id="a-nip-tl" class="nants nip-tl"></div>
    <div id="a-nip-tr" class="nants nip-tr"></div>
    <div id="a-nip-bl" class="nants nip-bl"></div>
    <div id="a-nip-br" class="nants nip-br"></div>
    <div id="farm" data-fill="none">
      <div id="card"></div>
      <div id="scenery" class="above"></div>
      <div id="food" class="above"></div>
      <div id="hills" class="above"></div>
      <div id="fill" class="fill"><div class="specks"></div></div>
      <div id="tunnels" class="fill"></div>
    </div>
    <div id="glass">
      <div id="frost"></div>
      <div class="ahole-set">
        <div class="ahole"></div>
        <div class="ahole"></div>
        <div class="ahole"></div>
      </div>
      <div class="ahole-set">
        <div class="ahole"></div>
        <div class="ahole"></div>
        <div class="ahole"></div>
      </div>
    </div>
    <div id="decals"></div>
    <div id="l-wrap">
      <div id="loupe"><div id="lg"></div><div id="lh"></div></div>
      <div id="l-inf">
        <div id="l-head"></div>
        <div id="l-l">
          <div id="l-t"><span class="txt"></span><span class="emo">🐜</span></div>
          <div id="l-c"><span class="txt"></span><span class="emo"></span></div>
          <div id="l-d"><span class="txt"></span><span class="emo">⌛</span></div>
          <div id="l-a"><span class="txt"></span><span class="emo">💡</span></div>
        </div>
        <div id="l-r">
          <div id="l-rot"><span class="emo">☣️</span><span class="bar"></span></div>
          <div id="l-decay"><span class="emo">🥀</span><span class="bar"></span></div>
          <div id="l-fd"><span class="emo">🍔</span><span class="bar"></span></div>
          <div id="l-dr"><span class="emo">🥤</span><span class="bar"></span></div>
          <div id="l-md"><span class="emo"></span><span class="bar"></span></div>
          <div id="l-hp"><span class="emo">♥️</span><span class="bar"></span></div>
        </div>
      </div>
    </div>
    <div class="frame-l frame"></div>
    <div class="frame-r frame"></div>
    <div id="dropzone" class="glow"></div>
    <div id="lid">
      <div class="hole frame"></div>
      <div class="frame-t frame"></div>
    </div>
    <div class="frame-b frame"></div>
    <div id="nip-tl" class="nip frame"><div class="nipcap frame"></div></div>
    <div id="nip-tr" class="nip frame"><div class="nipcap frame"></div></div>
    <div id="nip-bl" class="nip frame"><div class="nipcap frame"></div></div>
    <div id="nip-br" class="nip frame"><div class="nipcap frame"></div></div>
    <div id="vial" class="vial">
      <div class="vc"></div>
      <div class="vt"></div>
      <div class="vf"></div>
      <div class="vw"></div>
      <div class="vs"><div></div></div>
    </div>
    <div id="t-nip-tl" class="toob nip-tl"><div></div><span><span>►</span><span>►</span><span>►</span></span></div>
    <div id="t-nip-tr" class="toob nip-tr"><div></div><span><span>►</span><span>►</span><span>►</span></span></div>
    <div id="t-nip-bl" class="toob nip-bl"><div></div><span><span>►</span><span>►</span><span>►</span></span></div>
    <div id="t-nip-br" class="toob nip-br"><div></div><span><span>►</span><span>►</span><span>►</span></span></div>
  </div>
  <div id="base" class="frame" data-col="green">
    <div id="sign" class="plate">
      <div class="sign-l plate"></div>
      <h1 id="n">ANT FARM SOCIAL</h1>
      <div class="sign-r plate"></div>
    </div>
    <div class="trim plate">
      <div class="trim-inner"></div>
    </div>
  </div>
</div>`,

// HTML for ant.
antTemplate =
`<div id="ant" class="ant">
  <div class="spot"></div>
  <div class="body">
    <div class="body-mag">
      <div class="body-wrap">
        <div class="legs legs-l">
          <div class="leg"><div class="foot"></div></div>
          <div class="leg"><div class="foot"></div></div>
          <div class="leg"><div class="foot"></div></div>
        </div>
        <div class="head">
          <div class="antenna"></div>
          <div class="antenna"></div>
          <div class="hat"></div>
          <div class="c"></div>
        </div>
        <div class="torso"></div>
        <div class="rear"></div>
        <div class="legs legs-r">
          <div class="leg"><div class="foot"></div></div>
          <div class="leg"><div class="foot"></div></div>
          <div class="leg"><div class="foot"></div></div>
        </div>
        <div class="wings">
          <div class="wing wing-l"></div>
          <div class="wing wing-r"></div>
        </div>
      </div>
    </div>
  </div>
</div>`,

// Locations for the bus tickets (the bg images and corresponding ambient audio).
locs = {
  // Keyed by the base slugs of the image filenames, c: count of bgs, a: audio file.
  beach: {c: 5}, // Default 'a' is 'wind'.
  park: {c: 5, a: 'park'},
  country: {c: 6, a: 'wild'},
  lake: {c: 3, a: 'wild'},
  dystopia: {c: 8},
  picnic: {c: 3, a: 'park'},
  desert: {c: 6},
};

// STICKERS
// Dynamically added because they're all identical.
for (let i = 1; i < 9; i++) {
  items['s' + ('' + i).padStart(2, 0)] = {
    n: 'a sticker',
    desc: '',
    t: 'sticker',
    max: 1,
    lvl: 100,
  }
}

