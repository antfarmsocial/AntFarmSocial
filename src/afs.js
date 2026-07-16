/*
 * Ant Farm Social
 * afs.js (Main program)
 *
 * This file contains:
 * - **Core global state & methods**: Stores main program data & logic.
 * - **Global utilities & function library**: Standalone functions with short names.
 *
 */

// Core global state & methods (main program data & logic).

let

// Main Globals
_, // app data
F, // current farm alias
elCache = [], // element cache
wayPoints = {}, // tunnel waypoints
rafQueue = {}, // request animation frame queue
scroller, // scroller interval
spawner, // spawner interval
spawnTimer, // spawn timer
showMsgs, // showMsgs flag
throbber, // throbber interval
warper, // warper interval
warpDirector, // warpDirector interval
volumeUp, // volumeUp interval
fightVolume, // fightVolume interval
fightSong, // fightSong audio object
magnifier, // magnifier interval
magInterval, // another magnifier interval
carInterval, // carousel interval
bagScroll, // bag scroll position
userClicked, // user clicked state indicator
spilled, // spilled farm state indicator
vialInterval, // vial animation interval
tubeInterval, // tube animation interval
switcher, // switcher flag
modalCanClose, // modal can close flag
prevMagAnt, // previous magnified ant tracker
wrapperRect, // wrapperRect cache
glassDragInterval, // glass drag interval
glassDragX, // glass drag x-position
glassDragY, // glass drag y-position
quitting, // quitting game flag
pickedAntEl, // picked ant element
pouring, // crucible pour flag
sizzler = 0, // sizzler tracker
achPopupPending = 0, // achievement popup pending flag

// These variables exist purely to support the developer panel.
/* START-DEV */ // For use with gulp-strip-code.
stopAnts, // stop ants state indicator
dirInterval, // director interval
/* END-DEV */

// Common integers.
// When integers are needed in code it is best to first choose from here.
// These values can be considered as constants.
num200 = 200,
num500 = 500,
num800 = 800,
num1000 = 1000,
num1500 = 1500,
num2000 = 2000,
deg360 = 360,
deg270 = 270,
deg180 = 180,
surface = 510,

// Animation/event timing globals.
// These values can be CHANGED by features in the code.
frameTick = 20, // 50 fps
microDelay = num500,
pauseDelay = num2000,
shortDelay = 5000, // 5 seconds
standardDelay = 30000, // 30 seconds
longDelay = 300000, // 5 minutes

// Message handling globals.
messages = [],
messageLog = [],
randomMsgs = [],
warnings = [],

// Aliases for things that are in the form "something.something".
B = document.body, bodyClasses = B.classList,
PI = Math.PI, min = Math.min, max = Math.max, random = Math.random, floor = Math.floor, abs = Math.abs, sign = Math.sign,
sqrt = Math.sqrt, round = Math.round, atan2 = Math.atan2, sin = Math.sin, cos = Math.cos,
keys = Object.keys, values = Object.values, assign = Object.assign, entries = Object.entries,

// Convenience functions.
query = document.querySelector.bind(document),
queryAll = document.querySelectorAll.bind(document),
getEl = document.getElementById.bind(document),
hasFocus = X => document.hasFocus(),
getTime = Date.now,
getTimeSec = (ts = getTime()) => floor(ts / num1000),
appendHTML = (el, html) => el?.insertAdjacentHTML('beforeend', html),
randomInt = mx => floor(random() * (mx + 1)),
randomFloat = (mn, mx) => random() * (mx - mn) + mn,
pickRandom = arr => arr[randomInt(arr.length - 1)],
randomSign = (mag = 1) => pickRandom([-mag, mag]),
last = arr => arr.at(-1),
stopInterval = intvl => intvl && clearInterval(intvl),
cloneData = data => JSON.parse(JSON.stringify(data)),
getSign = val => val ? 1 : -1,
shuffle = arr => arr.sort(X => random() - .5),
clamp = (n, mn, mx) => min(max(n, mn), mx),
del = (obj, ...keys) => keys.forEach(k => delete obj[k]),
getById = (arr, id) => arr.find(i => i.id == id),
mapJoin = (arr, fn) => arr.map(fn).join(''),
repeat = (c, fn) => mapJoin(Array(c).fill(), fn),

// Converts radians to degrees.
radToDeg = radians => radians * (deg180 / PI),
// Converts degrees to radians.
degToRad = deg => deg * (PI / deg180),
// Normalizes an angle to be between -180 and 180 degrees.
normalize180 = a => ((a + 540) % deg360) - deg180,
// Normalizes an angle.
normalize360 = a => (a + deg360) % deg360,
// Gets the opposite of an angle.
oppositeAngle = a => normalize360(a + deg180),
// Gets the mirror of an angle.
mirrorAngle = a => normalize360(deg180 - a),
// Gets the angle between two precalculated delta values.
angleFromDelta = (dx, dy, offset = 0) => normalize360(radToDeg(atan2(dy, dx)) + offset),
// Gets the angle between two objects that have x/y props.
getAngle = (a, b) => angleFromDelta(b.x - a.x, b.y - a.y),
// Linearly interpolates between two angles along the shortest path.
lerpAngle = (a, b, t) => a + normalize180(b - a) * t,
// Provides quadratic easing in: starts slow and accelerates.
easeInQuad = t => t * t,
// Provides quadratic easing out: starts fast and slows toward the end.
easeOutQuad = t => 1 - easeInQuad(1 - t),
// Gets the squared distance, useful for distance comparisons without the cost of a square root.
squareDistance = (dx, dy) => dx * dx + dy * dy,
// Get the squared distance between two simple coordinates.
squareDistanceCoords = (coord1, coord2) => squareDistance(coord2.x - coord1.x, coord2.y - coord1.y),
// Faster alternative to Math.hypot() for calculating distances between two points.
getHypot = (dx, dy) => sqrt(dx * dx + dy * dy),
// Calculates distance with components.  Tips: If you only need the total distance use getHypot() directly! Or for comparisons use squareDistanceCoords() or squareDistance().
calcDistComponents = (x1, y1, x2, y2, dx = x2 - x1, dy = y2 - y1, dist = getHypot(dx, dy)) => ({d: dist, x: dist ? dx / dist : 0, y: dist ? dy / dist : 0}),

/* START-DEV */ // For use with gulp-strip-code.
// Performs a simple distance calculation between two objects with x/y props.  Good for debugging.
getDistance = (a, b) => getHypot(b.x - a.x, b.y - a.y),
/* END-DEV */

// Mark load time, used for various purposes.
loadTime = getTime(),
// Mark mouse/touch moves to detect user activity for the idle reload feature.
lastActivity = getTime(),

// Loads the app.
antFarmSocial = X => {
  // Adapt viewport to client's display.
  appendHTML(document.getElementsByTagName('head')[0], `<meta name="viewport" content="width=1180, height=1100, initial-scale=${min(screen.width / 1180, screen.height / 1100)}, user-scalable=no">`);
  // Fetch stored data.
  load();
  // Set correct background.
  setBg();
  // Create the free ant array, also clears any existing free ants stored in the data.
  _.a = [];
  // Fix unfinished sculptures. Must be run before switchFarm().
  _.farms.filter(farm => farm.mTuns && !farm.sculpt).forEach(farmSetSculpture);
  // Check if loaded farms exist and set default if needed.
  !_.farms.length ? addFarm() : switchFarm(_.F);
  // Start farm activity. Must be run after switchFarm().
  _.farms.forEach(farm => {
    if (!farm.sculpt) {
      waypointsUpdate(farm); // Calculate waypoints.
      farm.a.forEach(a =>
        a.drop && antCap(a) // Fix ants that didn't cop a cap before the last save().
        || isEggOrInf(a) || antAction(a) // Activate (unless it is an infant or egg).
      );
      getVial(farm)?.item.a.forEach(a => a.nipPh > 2 && exitVial(a)); // Fix ants trying to leave a vial.
      // Timeout any ants walking in tubes so that the tubeWalker logic resumes them immediately.
      farm.nips.forEach(n => n.item.k == 'tube' && n.item.a.forEach(a => (a.nipPh === 1 || a.nipPh == 4) && (a.nipTs = 0)));
    }
  });
  // Fix ant pos if this is an existing game.
  fixAntPos();
  // Start nip loops.
  tubeLoop();
  vialLoop();
  // Show welcome message.
  setTimeout(X => randomMsg(welcome), num2000);
  // Start the joker message system.
  setTimeout(joker, standardDelay * 5);
  // Update menu buttons and dirt.
  updateMenuButtons();
  // If there's already a score, update that one.
  _.score && score(0);
  // Handle the throbber overlay.
  doThrob();
  // Handle the speedo warp overlay.
  doWarp();
  // Call ant director immediately.
  director();
  // Repeatedly call the director function to control ants.
  /* START-DEV */dirInterval = /* END-DEV */setInterval(director, standardDelay);
  // Detect tab-switching to update ants immediately upon returning to the tab.
  window.addEventListener('focus', fixAntPos);
  // Resize handlers.
  window.addEventListener('resize', X => {
    wrapperRect = getEl('wrapper').getBoundingClientRect(); // For the magnifier.
    tubeFollowLinkPosition(); // For the tube follow links.
  });
  // Try to save the game when the user is leaving the page.
  window.addEventListener('pagehide', save);
  // Track mouse moves for idle detection, and predict user usin browser controls to save the game.
  document.addEventListener('mousemove', e => {!e.clientY && save(); lastActivity = getTime()});
  // Track touches for idle detection.
  window.addEventListener('touchstart', X => {lastActivity = getTime()});
  // Start ambient audio.
  document.addEventListener('click', ambience);
  // Add an event handler for the bag link.
  getEl('a-bag').addEventListener('click', X => {preloadImages(); popup('bag', 0, 9)});
  // Add an event handler for the magnifying glass link.
  getEl('a-tg').addEventListener('click', toggleGlass);
  // Add an event handler for the carousel link.
  getEl('a-car').addEventListener('click', toggleCarousel);
  // Handle the score/stats popup button.
  getEl('score').addEventListener('click', X => {preloadImages(1); popup('stats', 0, 9)});
  // Add an event handler for the stow link.
  getEl('stow').addEventListener('click', stow);
  // Handle preloading images if user is about to use the menu.
  getEl('menu').addEventListener('mouseenter', preloadImages);
  // Activate message log button.
  setupMsgLog();
  // Set up the switch control panel.
  setupSwitcher();
  // Trigger carousel if _.car is set from a prev session.
  _.car && toggleCarousel();
},

// Fixes ant positions and display upon load or tab switch.
fixAntPos = X => {
  F.a.forEach(a => antUpdate(a, undefined, 1));
  _.a.forEach(antUpdate);
  F.nips.forEach(n => n.item.a.forEach(a => antUpdate(a, undefined, 1)));
  preloadImages(); // May as well remind the browser to load bag images.
},

// Retrieves all data from local storage.
// Note: Start at half volume so you can listen to a podcast while playing.
load = X => _ = JSON.parse(localStorage.getItem('_') || '{"score":0,"farms":[],"bag":[],"ach":{},"achQ":[],"vol":50,"bg":"","grad":0,"sac":0,"arty":0,"scene":{},"man":0,"wings":0,"rm":0}'),

// Saves all data to local storage.
// Will not allow saving within 30s of loading the page due to suspected exploit.
// Note: This func does not filter zero/default values, round floats, or compress/smol-string/minson data before saving, all worth considering for future updates if data size becomes an issue.
save = X => {checkAchievements(); lockoutExpired() && !quitting && localStorage.setItem('_', JSON.stringify(_))},

// Logs a time duration field on an object for calculating running times, as well as a timestamp for when the time duration field was last updated.
// Must be called on app load and then at regular intervals such as 30 seconds.  Developer must default fields on objects to dur=0 and ts=getTimeSec() upon creation.
timeLog = (obj, dur = 'dur', ts = 'ts', now = getTimeSec()) => {
  obj[dur] += now - max(getTimeSec(loadTime), obj[ts]); // Time duration field.
  obj[ts] = now; // Timestamp field.
},

// Reports whether the standardDelay lockout period has lapsed since page load, to prevent the director func doing certain things on load.
lockoutExpired = X => getTime() - loadTime > standardDelay,

// Formats a time duration in seconds to an d/h/m/s output string.
formatTime = (s, d = floor(s / 86400), h = floor(s / 3600) % 24, m = floor(s / 60) % 60) =>
  [d && printInt(d) + 'd', (d || h) && printInt(h) + 'h', printInt(m) + 'm'].filter(Boolean).join(' '),

// Creates a templated element from reusable HTML snippets.
getTemplate = (tpl, template = assign(document.createElement('template'), {innerHTML: tpl})) => template.content.firstChild,

// Generates an HTML tag.  By default it is a 'div'.
html = (content, attrs = {}, tag = 'div', omitClose) => `<${tag + mapJoin(entries(attrs), ([k, v]) => ` ${k}="${v}"`)}>` + content + (omitClose ? '' : `</${tag}>`),

// Generates an HTML img tag. Assuming it follows the filename pattern that other images in this app use.
img = (slug, attrs = {}, ext = 'webp') => (attrs.src = `img/${slug}.${ext}`, html('', attrs, 'img', 1)),

// Generates an HTML p tag.
p = (content, attrs) => html(content, attrs, 'p'),

// Generates an HTML span tag.
span = (content, attrs) => html(content, attrs, 'span'),

// Generates an empty div with a class attribute.
divc = (className, attrs = {}) => html('', assign(attrs, {class: className})),

// Generates a HTML tag with a different order of params.  Supports heading tags by just passing in the number as the first param, e.g. 4 for 'h4'.
tag = (tag, content, attrs, tagName = tag % 1 == 0 ? 'h' + tag : tag) => html(content, attrs, tagName),

// Preloads one image.
preloadImage = (key, attrs, ext = 'webp', image = new Image()) => {
  image.src = `img/${key}.${ext}`;
  image.decode().catch(X => 1);
},

// Preloads images for the two menu-based popups.
// Set 'statsOnly' to skip straight to loading the scores/stats images.
preloadImages = statsOnly => {
  // Bag (inventory) popup:
  !statsOnly && _.bag.forEach(item => bagImg(item, preloadImage));
  // Scores & stats popup:
  preloadImage('social');
  preloadImage('paper');
},

// Gets a farm by id or an object with a .f property which is the farm id.
// Note: This function must fail silently when fid is invalid because it is often used without checking that first.
getFarm = fid => getById(_.farms, fid?.f || fid),

// Determines if a farm object is of the currently displayed farm.
currentFarm = farm => farm.id == F.id,

// Provides a farm count for decision making that includes farms that pass farmIsRunning (or existed 25m), PLUS sculptures, PLUS removed farms.
// So it really isn't an accurate farm count, but more like an estimate of how much progress the player has made in the game.
// This is because the tone of joker messages, kudos messages, and bus ticket backgrounds changes during the mid-game phase.
totalFarmCount = X => _.farms.filter(f => farmIsRunning(f) || f.dur > num1500 || f.sculpt).length + _.rm,

// Adds a blank farm, and switches to it.
addFarm = (fid = 'f' + getTime()) => {
  _.farms.push(
    assign({
      id: fid,
      n: 'ANT FARM SOCIAL',
      col: 'green',
      plate: 'green',
    }, cloneData(farmDefault))
  );
  // Switch to this farm.
  switchFarm(fid);
  // On the creation of second farm, reveal the switch panel.
  _.farms.length == 2 && setTimeout(X => getEl('switch-up').click(), num2000);
},

// Switches currently displayed kit to a particular farm.
switchFarm = (farmId, kit = getEl('kit'), getFarmIndex = fid => _.farms.findIndex(f => f.id == fid)) => {
  switcher = 0;
  hideTubeFollowLinks();
  if (F && F.id != farmId) {
    spawner = 0;
    _.a.forEach(antDelete);
    elCache = []; // Clear ant cache.
    bodyClasses.contains('glass') && getEl('a-tg').click();
    let swipeDir = getFarmIndex(farmId) - getFarmIndex(F.id);
    kit.classList.add(swipeDir > 0 ? 'swipeL' : 'swipeR');
    setTimeout(X => {kit.remove(); drawFarmKit(farmId, swipeDir)}, num1000);
  }
  else drawFarmKit(farmId, 0);
},

// Draws a farm kit.
drawFarmKit = (farmId, swipeDir, farmTpl = getTemplate(farmTemplate)) => {
  F = getFarm(farmId); // The F global holds a reference to the currently displayed farm.
  _.F = farmId;
  swipeDir && farmTpl.classList.add(swipeDir > 0 ? 'swipeR' : 'swipeL');
  getEl('game').appendChild(farmTpl);
  // Show the correct name and color on the frame.
  updateFrame();
  // Put stickers on immediately (whereas other items are handled in startFarm).
  addDecals();
  // Resume by recreating farm.
  F.fill && startFarm();
  // Redraw capped ants (and eggs, which are flagged ants too).
  F.a.forEach(a => {
    a.mag = a.flare = 0; // Remove mag styles.
    antDraw(a);
    carryDraw(a);
    a.fight && !fightSong && playFightSong(); // Restart fight music.
  });
  // Redraw nipped ants/eggs.
  F.nips.forEach(n => {
    n.item.a.forEach(a => {
      antDraw(a, getEl('a-' + nipIds[n.nip]));
      carryDraw(a);
    })
  });
  let kit = getEl('kit');
  kit.dataset.id = farmId;
  // Shake handler.
  getEl('glass').addEventListener('click', X => {
    !bodyClasses.contains('glass') && (
      kit.classList.add('shake'),
      setTimeout(X => kit.classList.remove('shake'), num500),
      !randomInt(10) && farmIsRunning(F) && (randomMsg(tapMsg) || F.a.forEach(a => isAdult(a) && antStats(a, {md: -5})))
    );
  });
  kit.offsetWidth; // This is a hack to "trigger layout" reflow - do not remove.
  swipeDir && kit.classList.remove(swipeDir > 0 ? 'swipeR' : 'swipeL');
  // Activate or update the switcher if needed.
  updateSwitcher();
  // Handle fight music.
  checkFightSong();
  // Decide on stow button.
  setTimeout(X => getEl('stow').classList.toggle('vis', !!(F.sculpt && _.farms.length > 1)), num2000); // Whether to show the stow button.
},

// Fills the farm with filler and spawn free ants.
startFarm = isNew => {
  // Fill farm.
  getEl('farm').dataset.fill = F.fill;
  // New farm setup.
  if (isNew) {
    F.dur = 0;
    F.ts = getTimeSec();
    // Create a new farm.
    calcFarm();
    // Correct the tunnel coordinate system.  This is done because calcFarm() incorrectly sets y-values relative to the surface than to the whole farm.
    // Ideally calcFarm() would be updated to do it correctly in the first place, but it is a task best left for when doing a deep-dive into that function again.
    F.tuns.forEach(t => {t.y1 += surface; t.y2 += surface});
    // New farm message.
    !_.score && !spilled && randomMsg(newFarm);
    // Initialize empty wayPoints array to prevent issues.
    wayPoints[F.id] = [];
  }
  // Draw tunnels.
  F.tuns.forEach(tunDraw);
  if (F.sculpt) {
    // Draw mTuns sculptures.
    F.mTuns.forEach(tunDraw);
    mTunsBg();
    getEl('kit').classList.add('sculpt');
    getEl('wrapper').innerHTML += tag(2, F.n);
  }
  // Draw hills.
  F.hills.forEach(hillDraw);
  // Draw card.
  if (F.card) getEl('card').style.background = `url(img/${F.card}.webp)`;
  // Draw anomaly.
  F.hair ?
    appendHTML(getEl('fill'), img('hair', {id: 'Fh', style: `position:absolute;bottom:${F.hair[0]}px;left:${F.hair[1]}px;transform:rotate(${F.hair[2]}deg);opacity:.6`})) :
    getEl('Fh')?.remove();
  // Draw items.
  addItems();
  addNipItems();
  // Add lid function.
  if (F.items.length || F.card || F.a.some(isDead)) addLidFunc();
  // Re-enable spawner if it got turned off by something.
  !spawner && !F.sculpt && setTimeout(X => {spawner = 1; spawnAnt()}, num1000);
},

// Precalculates the tunnel system layout of the current ant farm.
calcFarm = (numEntrances = 2 + randomInt(4), tries = 0, hills = [-50, 1010], sublevels = [0, 120, 240, 367, 496], adjustedTun, adjustLeft = !randomInt(4),
  adjustRight = !randomInt(4), entX, xCollector = [], cavLines = [], lines = [], joinLines = [], sublvl = 1, i = 0, stubEntIndex = -1) => {
  // Ants do not randomly pick tunnel surface entrances, the program does.
  // It also places the adjacent hills in position, but set at zero height, so they can grow as the tunnels are dug.
  while (keys(F.tuns).length < numEntrances && 100 > tries++) {
    entX = 20 + randomInt(920);
    if (F.tuns.every(t => abs(entX - t.x1) >= 100)) {
      F.tuns.push({t: 'ent', id: 'ent-' + entX, lvl: 0, prog: 0, w: 15, h: 15, x1: entX, y1: 0, x2: entX, y2: 0, r: 45, br: borderRadius(6, 2), co: []});
      hills.push(entX - 8);
      hills.push(entX + 8);
    }
  }
  F.tuns.sort((a, b) => a.x1 - b.x1);
  // For the first and last cav in this row, randomly choose whether it will be adjusted over to butt against the edge of the farm.
  // If neither is chosen, then forcibly choose one or the other.
  // This will be needed later - but it's better to know this ahead of time.
  !adjustLeft && !adjustRight && (randomInt(1) ? adjustLeft = 1 : adjustRight = 1);
  for (; sublvl < 5; sublvl++) {
    let cavCount = 1 + randomInt(4),
      fixedWidths = [],
      whiteSpaces = Array(cavCount + 1).fill(20),
      left = 0,
      rowCavs = [],
      cavNum = 0,
      remainingWhiteSpace, randomSpace, tun, cavHalfHeight, prevTun, line;
    // Precalculate cavity widths.
    for (; cavNum++ < cavCount;) fixedWidths.push(60 + randomInt(155));
    // Work out cavity spacing.
    remainingWhiteSpace = 960 - fixedWidths.reduce((a, b) => a + b, 0) - whiteSpaces.reduce((a, b) => a + b, 0);
    while (remainingWhiteSpace > 0) {
      randomSpace = max(1, floor(randomInt(remainingWhiteSpace / cavCount)));
      whiteSpaces[randomInt(cavCount + 1)] += randomSpace;
      remainingWhiteSpace -= randomSpace;
    }
    for (cavNum = 0; cavNum < cavCount; cavNum++) {
      left += whiteSpaces[cavNum];
      tun = {
          t: 'cav',
          id: `cav-${sublvl}-${cavNum}`,
          lvl: sublvl,
          w: fixedWidths[cavNum],
          h: 32 + randomInt(24),
          r: round(randomInt(16) - 8),
          br: borderRadius(10, 22),
          co: [],
          x1: left,
          y1: sublevels[sublvl] + randomInt(56) - 28,
          prog: 0,
        };
      left += tun.w;
      // Calculate x2/y2.
      calcTailPoint(tun);
      let pushTries = 0,
        // Checks whether a cav is too close to the cav above it on the level up.
        overlapsAbove = tun => F.tuns.find(t => t.lvl == tun.lvl - 1 && (
          expandLineToStrip(tun.x1, tun.y1, tun.x2, tun.y2, tun.h).some(pt => pointInTun(pt, t, 12)) ||
          expandLineToStrip(t.x1, t.y1, t.x2, t.y2, t.h).some(pt => pointInTun(pt, tun, 12))
        )),
        applyConstraint = (tun, sublvl, thislvl = sublvl, yOffset, distanceToBottom = max(surface - tun.y1 - (tun.h / 2), surface - tun.y2 - (tun.h / 2))) => {
          if (sublvl == 4) {
            if (distanceToBottom < 0) tun.y1 += distanceToBottom;
            if (max(tun.y1 + tun.h / 2, tun.y2 + tun.h / 2) > surface) tun.y1 -= tun.h / 2;
          }
          if (sublvl == 3) {
            if (sublvl == thislvl ? adjustLeft && !cavNum : tun.nip) {
              tun.x1 = -5;
              yOffset = tun.y1 - 332;
              tun.y1 -= yOffset;
              tun.nip = 1; // Nip left.
              adjustedTun = tun;
            }
            if (sublvl == thislvl ? adjustRight && cavNum == cavCount - 1 : tun.nip) {
              tun.x1 = 965 - tun.w;
              yOffset = tun.y2 - 332;
              tun.y1 -= yOffset;
              tun.nip = 2; // Nip right.
              adjustedTun = tun;
            }
          }
          calcTailPoint(tun);
        };
      // Apply the floor bound / nip constraint first, then resolve overlap against it.
      applyConstraint(tun, sublvl);
      // Push down to clear the overlap, then re-apply the constraint (which may push back and reopen the overlap), and repeat.
      while (prevTun = overlapsAbove(tun) && pushTries++ < 9) {
        tun.y1 += 2;
        calcTailPoint(tun);
        applyConstraint(tun, sublvl);
        // Now repeat for other tun in the opposite direction.
        prevTun.y1 -= 2;
        calcTailPoint(prevTun);
        if (overlapsAbove(prevTun)) {
          // Can't do that, undo it.
          prevTun.y1 += 2;
          calcTailPoint(prevTun);
        }
        applyConstraint(prevTun, sublvl - 1, sublvl);
      }
      // Still stuck with an overlap, shave heights.
      while (prevTun = overlapsAbove(tun) && tun.h > 28 && prevTun.h > 28) {
        if ((randomInt(1) || prevTun.h <= 28) && tun.h > 28) tun.h -= 2;
        else if (prevTun.h > 28) prevTun.h -= 2;
        applyConstraint(tun, sublvl);
        applyConstraint(prevTun, sublvl - 1, sublvl);
      }
      if (overlapsAbove(tun)) tun.bad = 1; // Hey, we gave it a shot and it didn't work.  Flag it for a spill.
      // Find joining lines.
      lineFinder(lines, tun, 'x2', 'y2', tun.x1, tun.y1, 0, -40);
      lineFinder(lines, tun, 'x1', 'y1', tun.x2, tun.y2, -40, 0);
      lineFinder(lines, tun, 'x1', 'y1', tun.x1, tun.y1, 0, -40);
      lineFinder(lines, tun, 'x2', 'y2', tun.x2, tun.y2, -40, 0);
      // Store the top and bottom of the cav as obstructions.
      cavHalfHeight = tun.h / 2;
      cavLines.push({x1: tun.x1, y1: tun.y1 - cavHalfHeight, x2: tun.x2, y2: tun.y2 - cavHalfHeight});
      cavLines.push({x1: tun.x1, y1: tun.y1 + cavHalfHeight, x2: tun.x2, y2: tun.y2 + cavHalfHeight});
      // Add the sideways line.
      if (rowCavs.length) {
        prevTun = last(rowCavs);
        line = {tids: [tun.id, prevTun.id], x1: prevTun.x2, y1: prevTun.y2, x2: tun.x1, y2: tun.y1, l: getHypot(tun.x1 - prevTun.x2, tun.y1 - prevTun.y2)};
        line.r = angleFromDelta(line.x2 - line.x1, line.y2 - line.y1);
        line.score = line.l < 50 ? 100 : 100 - (xCollector.filter(val => val.x > line.x1 && val.x < line.x2).length * 10) - (line.r % 90 < 23 || line.r % 90 > 67 ? 20 : 0);
        lines.push(line);
      }
      F.tuns.push(tun);
      rowCavs.push(tun);
      xCollector.push(tun.x1);
      xCollector.push(tun.x2);
    }
  }
  // Adjust the line scores.
  lines.forEach(line => {
    line.score = ((!line.y1 || !line.y2) && F.tuns.filter(tun => tun.lvl === 1).reduce((acc, tun) => (tun.x1 >= line.x1 && tun.x1 <= line.x2) || (tun.x2 >= line.x1 && tun.x2 <= line.x2), 0)) || cavLines.some(ln => doLinesIntersect(line, ln, 6)) ?
    0 : line.l < 50 ? 100 : 100 + line.score - (xCollector.filter(val => val.x > line.x1 && val.x < line.x2).length * 20) - (line.r % 90 < 23 || line.r % 90 > 67 ? 20 : 0);
    /* START-DEV */ // For use with gulp-strip-code.
    dev && DL(line, line.score / 100);
    /* END-DEV */
  }),
  // Join them up.
  F.tuns.forEach(tun => (!tun.co.length || !findPath(F, tun, {t: 'ent'}) || !randomInt(4)) && buildATun(lines, joinLines, tun));
  // Another pass to try and link up any inaccessible areas.
  F.tuns.filter(t => t.t == 'cav').forEach(tun => !findPath(F, tun, {t: 'ent'}) && buildATun(lines, joinLines, tun, 'RL'));
  // Give each entrance another shot to connect as well.
  F.tuns.filter(t => t.t == 'ent').forEach(tun => !tun.co.length && buildATun(lines, joinLines, tun, 'RL'));
  // Give 4 more shots at connecting tunnels.
  for (; i++ < 4;) {
    let orphans = F.tuns.filter(tun => tun.t == 'cav' && tun.co.length < 2 && !findPath(F, tun, {t: 'ent'})).sort((a, b) => a.lvl - b.lvl),
      unconnected = pickRandom(orphans.filter(tun => tun.lvl == orphans[0].lvl));
    if (!unconnected) break;
    buildATun(lines, joinLines, unconnected, 'RL');
  }
  // Sort the hill boundaries from left to right to make this all easier.
  hills.sort((a, b) => a - b);
  // Remove tuns without connections.
  do {
    stubEntIndex = F.tuns.findIndex(t => t.t == 'ent' && !t.co.length);
    if (stubEntIndex > -1) {
      // Adjust hills.
      hills.splice(2 * stubEntIndex + 1, 2);
      // Remove that tun.
      tunDelete(F, F.tuns[stubEntIndex]);
    }
  } while (stubEntIndex != -1);
  // Keep only the accessible tunnels.
  F.tuns.filter(tun => !findPath(F, tun, {t: 'ent'})).forEach(tun => tunDelete(F, tun));
  // Find bad turn corners and create 'jun' tunnels at those intersections.
  hardTurns(F.tuns).forEach(turn => {
    // Found an angle an ant must turn through to follow waypoints between two of its connected tunnels (turn.t[0]/turn.t[1]) that exceeds some hard turn threshold.
    // tunWalk() already has a cutoff to abandon waypoints and use prone-pose rotation when this happens, but the resulting ant behaviour still looks undesirable.
    // So we will insert a small 'jun' tunnel at turn.xy (the inner "naughty corner" of the turn) to soften the effective waypoint angle through that area, and
    // to give ants a second, shorter-looking route between tunnels that bypasses the con/ent (turn.c) entirely - adding variety without removing the original route.
    let jun = {
      t: 'jun',
      id: 'jun-' + F.tuns.length,
      lvl: turn.c.lvl,
      w: 18,
      h: 18,
      r: tunAverageAngle(turn.t, turn.c),
      br: borderRadius(4, 3),
      co: [turn.t[0].id, turn.t[1].id],
      c: turn.c.id, // Sibling ref to the nearby 'con/ent' area this jun supplements. One con/ent may end up with several juns.
      x1: turn.xy.x,
      y1: turn.xy.y,
      x2: turn.xy.x,
      y2: turn.xy.y,
      prog: 0,
    };
    turn.t[0].co.push(jun.id);
    turn.t[1].co.push(jun.id);
    F.tuns.push(jun);
  });
  calcDownTuns();
  // In the rare cases where:
  // - No tuns left after filtering
  // - Adjusted tun is gone
  // - Adjusted tun has no path to the entrance
  // - There are fewer than 5 chamber cavities with paths to an entrance
  // - Cavs still overlap
  // It is a bad design. Used to do clearVars() and dumpFarm(1), but it's more fun to add
  // this feature where the user is blamed for a spill (and trigger it randomly too).
  if ((!randomInt(8) && _.farms.length > 1) || !F.tuns.length || !adjustedTun || !findPath(F, adjustedTun, {t: 'ent'}) || F.tuns.filter(tun => tun.t == 'cav' && findPath(F, tun, {t: 'ent'})).length < 5 || F.tuns.some(tun => tun.bad))
  return F.try ? spill() : (F.try = 1, dumpFarm(1)); // Spill or second-chance.
  del(F, 'try');
  // Store hills.
  for (i = 0; i < hills.length; i += 2) F.hills.push({id: i / 2, l: hills[i], r: hills[i + 1], h: 0});
},

// Determines and marks trans-lvl tunnels that must be built downwards, aka "Down Tuns".
// This is because real-world ants typically don't build vertically upwards, so we enforce similar behaviour where possible (sometimes it ain't!).
calcDownTuns = (dt = [], conn = (t, pT, cT) => !t.lvl || dt.includes(t.id) || (t.co.some(co => co != pT && (cT = getTun(F, co)) && cT.lvl <= t.lvl && conn(cT, t.id)) && dt.push(t.id))) =>
  F.tuns.forEach(tun => tun.lvl % 1 && conn(tun) && (tun.dt = 1)), // Implied tun.t == 'tun', because every other type of tun won't pass tun.lvl%1 test.

// Handles the generation of random border radius values.
borderRadius = (min, range) => Array.from({length: 6}, X => `${min + randomInt(range)}px`).reduce((acc, val, i) => acc + (i == 4 ? ' / ' : ' ') + val),

// Handles a farm creation bug that is easily fixable with a reload.
spill = X => {
  // Blame the player and don't give them the fill item back so it looks like a feature.
  switcher = 0;
  spilled = 1;
  setTimeout(X => playSound('fail'), pauseDelay);
  msg(`Woops! You've spilled your ${F.fill || 'farm'} out.  Bad luck.`, 'warn');
  appendHTML(B, html(html(divc('specks'), {class: 'hill'}), {id: 'spill', 'data-fill': F.fill || 'dirt'}));
  dumpFarm();
  setTimeout(X => {score(10, 1); msg('Here, have a bonus.')}, standardDelay / 2);
  setTimeout(X => msg("Refreshing in 3… 2… 1…", 'warn'), standardDelay * .8);
  setTimeout(X => location.reload(), standardDelay);
  hideMenus();
  getEl('switch').remove();
  getEl('kit').remove();
},

// Hides the menu buttons instantly, but allows other code to be reactivate.
hideMenus = X => {
  queryAll('#menu > a, #score').forEach(a => {a.classList.add('hide'); a.classList.remove('vis')});
  setTimeout(X => queryAll('#menu > a, #score').forEach(a => a.classList.remove('hide')), num2000 * 2);
},

// Builds a joining tunnel.
// These are the code names of the tunnel pieces:
// 'ent' - Surface level tunnel entrances.
// 'tun' - Joining tunnels which are referred to as "connectors" in the UI (the long skinny ones).
// 'cav' - Chamber cavities (the thick horizontal ones).
// 'con' - A transition junction connecting tuns and cavs to each other - not obvious they're there.
// 'jun' - A small junction that may be near a con to facilitate a short/smooth transition at hard turns.
buildATun = (lines, joinLines, tun1, func = 'BL',
    funcs = {
      // Chooses one of the best available lines to implement as a joining tunnel.
      BL: (objects, maxObj = objects.reduce((maxObj, obj) => (obj.score > maxObj.score ? obj : maxObj), {score: 0})) => maxObj.score && maxObj,
      // Chooses a random line (favouring the "better" scored lines) to implement as a joining tunnel.
      RL: (objects, rand = randomInt(objects.reduce((sum, obj) => sum + obj.score, 0)), obj) => {for (obj of objects) {rand -= obj.score; if (rand <= 0) return obj}},
    },
    choice = funcs[func](lines.map(ln =>
      (ln.x1 == tun1.x1 && ln.y1 == tun1.y1) ? {...ln, X1: ln.x1, Y1: ln.y1, X2: ln.x2, Y2: ln.y2} :
      (ln.x2 == tun1.x1 && ln.y2 == tun1.y1) ? {...ln, X1: ln.x2, Y1: ln.y2, X2: ln.x1, Y2: ln.y1} :
      (ln.x1 == tun1.x2 && ln.y1 == tun1.y2) ? {...ln, X1: ln.x1, Y1: ln.y1, X2: ln.x2, Y2: ln.y2} :
      (ln.x2 == tun1.x2 && ln.y2 == tun1.y2) ? {...ln, X1: ln.x2, Y1: ln.y2, X2: ln.x1, Y2: ln.y1} :
      0).filter(Boolean).filter(tunLn => !joinLines.some(ln => doLinesIntersect(tunLn, ln, 4))))
  ) => {
  if (choice) {
    // Remove this line from future choices.
    lines = lines.filter(l => l.x1 != choice.x1 || l.y1 != choice.y1 || l.x2 != choice.x2 || l.y2 != choice.y2);
    joinLines.push(choice);
    let tun2 = getTun(F, choice.tids.find(tid => tid != tun1.id)),
      // Create connection pieces on the ends of those tunnel pieces (unless it's an entrance, then we just use the entrance; or if there's already a connector there).
      c1 = F.tuns.find(t => t.t == 'con' && t.x1 == choice.X1 && t.y1 == choice.Y1),
      c2 = F.tuns.find(t => t.t == 'con' && t.x1 == choice.X2 && t.y1 == choice.Y2),
      conn1 = tun1.t == 'ent' ? tun1 : c1 ? c1 : createConnection(tun1, choice.X1, choice.Y1),
      conn2 = tun2.t == 'ent' ? tun2 : c2 ? c2 : createConnection(tun2, choice.X2, choice.Y2),
      // Figure out which end of the tunnel is which, i.e. where does it start and where does it end?
      // For tunnels connecting to an 'ent' we want to bias them towards being considered vertical, and vice-versa.  This is for the sake of how getTunSide() and waypoints work, to minimise ants backflipping out of tunnels.
      dominantAxis = abs(conn2.x1 - conn1.x1) / abs(conn2.y1 - conn1.y1) > ([tun1.t, tun2.t].includes('ent') ? 3 : .5),
      connOne = dominantAxis ? (conn1.x1 < conn2.x1 ? conn1 : conn2) : (conn1.y1 < conn2.y1 ? conn1 : conn2),
      connTwo = dominantAxis ? (conn1.x1 < conn2.x1 ? conn2 : conn1) : (conn1.y1 < conn2.y1 ? conn2 : conn1),
      // Add the joining tunnel.
      // It would be better to create 3 or 4 tunnels in an s-shape with offset 'con' pieces along the way. But this works for now.
      tunnel = {
        t: 'tun',
        id: 'tun-' + joinLines.length,
        lvl: (connOne.lvl + connTwo.lvl) / 2,
        h: 14,
        w: getHypot(connTwo.x2 - connOne.x1, connTwo.y2 - connOne.y1),
        r: angleFromDelta(connTwo.x2 - connOne.x1, connTwo.y2 - connOne.y1),
        br: borderRadius(5, 2),
        co: [conn1.id, conn2.id],
        x1: connOne.x1,
        y1: connOne.y1,
        x2: connTwo.x2,
        y2: connTwo.y2,
        prog: 0,
      };
    // Create inter-connection data.
    conn1.co.push(tunnel.id);
    conn2.co.push(tunnel.id);
    //
    /* START-DEV */
    dev && DL({x1: conn1.x1, y1: conn1.y1, x2: conn2.x2, y2: conn2.y2});
    /* END-DEV */
    F.tuns.push(tunnel);
  }
},

// Finds paths for traversing tunnel systems and determines if and how tunnel pieces connect.
// When calculating paths for ant to actually walk on, pathDun should probably be 1, meaning that the tunnels in the path have to be completed.
// This is different when testing proposed future tunnels for whether yet-to-be-built tunnels would actually connect them properly to an entrance.
// To understand usage; best to study how this function is used in the various cases where it is employed.  Sometimes used in reverse!
findPath = (farm, tun, targetAttrs, pathDun, invertMatch, firstTunId, path = [], tId, result, dig = !tun.dun && !firstTunId && getById(farm.dig, tun.id)) => {
  // If the current tunnel matches all target attributes, return the path.
  if (keys(targetAttrs).every(attr => invertMatch ? tun[attr] != targetAttrs[attr] : tun[attr] == targetAttrs[attr])) return path;
  if (!pathDun || tun.dun || !firstTunId) {
    for (tId of shuffle(dig ? [dig.path[0]] : tun.co.filter(coId => !path.includes(coId) && coId != firstTunId && getTun(farm, coId).t != 'jun')))
      if (result = findPath(farm, getTun(farm, tId), targetAttrs, pathDun, invertMatch, firstTunId || tun.id, [...path, tId])) return result;
  }
},

// Creates a connection junction between chamber cavities and joining tunnels.
createConnection = (tun, x, y, conn = {t: 'con', id: 'con-' + F.tuns.length, lvl: tun.lvl, w: 28, h: 28, r: 45, br: borderRadius(9, 4), co: [tun.id], x1: x, y1: y, x2: x, y2: y, prog: 0}) => {
  tun.co.push(conn.id);
  F.tuns.push(conn);
  return conn;
},

// Calculates the 2nd point in a tunnel piece.
calcTailPoint = tun => {
  tun.x2 = tun.x1 + tun.w * cos(degToRad(tun.r));
  tun.y2 = tun.y1 + tun.w * sin(degToRad(tun.r));
},

// Finds how joining tunnels might connect the chamber cavities to each other and to entrances.
lineFinder = (lines, tun, xK, yK, tunX, tunY, score1, score2, t,
  crossesOtherEnd = (lineX1, lineX2, otherEndX) => otherEndX > lineX1 && otherEndX < lineX2,
  findLine = (tId2, x1, y1, x2, y2, score, line = {tids: [tun.id, tId2], x1: x1, y1: y1, x2: x2, y2: y2, d: abs(x2 - x1), l: getHypot(x2 - x1, y2 - y1), score}) => {
    if (F.tuns.filter(ot => ot.t != 'ent' && tId2 != ot.id).every(ot => !doLinesIntersect(ot, line, 20))) {
      line.r = angleFromDelta(x2 - x1, y2 - y1);
      x1 > 5 && x2 > 5 && x1 < 955 && x2 < 955 && lines.push(line);
    }
  }) => {
  for (t of F.tuns) if (t.lvl < tun.lvl) {
    let lineX1 = min(t[xK], tunX), lineX2 = max(t[xK], tunX), otherX = tunX == tun?.x1 ? tun?.x2 : tun?.x1;
    if (!crossesOtherEnd(lineX1, lineX2, xK == 'x1' ? t.x2 : t.x1) && !(otherX != null && crossesOtherEnd(lineX1, lineX2, otherX)))
      t[xK] < tunX ? findLine(t.id, t[xK], t[yK], tunX, tunY, score1) : findLine(t.id, tunX, tunY, t[xK], t[yK], score2);
  }
},

// Gets the 4 corners of a thickness-expanded rectangle along a line.
expandLineToStrip = (x1, y1, x2, y2, thickness, dist = calcDistComponents(x1, y1, x2, y2), offsetX = (thickness / 2) * dist.y, offsetY = (thickness / 2) * dist.x) =>
  [{x: x1 - offsetX, y: y1 + offsetY}, {x: x1 + offsetX, y: y1 - offsetY}, {x: x2 + offsetX, y: y2 - offsetY}, {x: x2 - offsetX, y: y2 + offsetY}],

// Checks if two lines (actually rectangles) intersect along their length.
doLinesIntersect = (line1, line2, thickness, ignoreEnds = 28, returnIntersectionPoint = 0) => {
  let {x1: x1_1, y1: y1_1, x2: x2_1, y2: y2_1} = line1,
    {x1: x1_2, y1: y1_2, x2: x2_2, y2: y2_2} = line2,
    pointAlongLine = (x1, y1, x2, y2, distance, ratio = distance / getHypot(x2 - x1, y2 - y1)) => ({x: x1 + ratio * (x2 - x1), y: y1 + ratio * (y2 - y1)}),
    adjusted1 = pointAlongLine(x1_2, y1_2, x2_2, y2_2, ignoreEnds),
    adjusted2 = pointAlongLine(x2_2, y2_2, x1_2, y1_2, ignoreEnds),
    getDirection = (x1, y1, x2, y2, x3, y3) => ((x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)),
    d1 = getDirection(adjusted1.x, adjusted1.y, adjusted2.x, adjusted2.y, x1_1, y1_1),
    d2 = getDirection(adjusted1.x, adjusted1.y, adjusted2.x, adjusted2.y, x2_1, y2_1),
    d3 = getDirection(x1_1, y1_1, x2_1, y2_1, adjusted1.x, adjusted1.y),
    d4 = getDirection(x1_1, y1_1, x2_1, y2_1, adjusted2.x, adjusted2.y),
    intersect = ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0)),
    rectanglesIntersect = (rect1, rect2) => !(
      max(rect1[0].x, rect1[1].x, rect1[2].x, rect1[3].x) < min(rect2[0].x, rect2[1].x, rect2[2].x, rect2[3].x) ||
      min(rect1[0].x, rect1[1].x, rect1[2].x, rect1[3].x) > max(rect2[0].x, rect2[1].x, rect2[2].x, rect2[3].x) ||
      max(rect1[0].y, rect1[1].y, rect1[2].y, rect1[3].y) < min(rect2[0].y, rect2[1].y, rect2[2].y, rect2[3].y) ||
      min(rect1[0].y, rect1[1].y, rect1[2].y, rect1[3].y) > max(rect2[0].y, rect2[1].y, rect2[2].y, rect2[3].y)
    );
  return returnIntersectionPoint && intersect && lineIntersection(x1_1, y1_1, x2_1, y2_1, x1_2, y1_2, x2_2, y2_2)
    || intersect || rectanglesIntersect(expandLineToStrip(x1_1, y1_1, x2_1, y2_1, thickness), expandLineToStrip(adjusted1.x, adjusted1.y, adjusted2.x, adjusted2.y, thickness));
},

// Gets the heading of a tun/cav segment away from a given junction, using its stored .r
// (flipped via oppositeAngle if the segment happens to be stored in the opposite direction).
tunExitAngle = (tun, con) => tun.x1 == con.x1 && tun.y1 == con.y1 ? tun.r : oppositeAngle(tun.r),

// Gets the average angle of some tuns facing towards some con point.
tunAverageAngle = (tuns, con, rad, sumX = 0, sumY = 0) => {
  tuns.forEach(ct => {
    rad = degToRad(tunExitAngle(ct, con));
    sumX -= cos(rad);
    sumY -= sin(rad);
  });
  return angleFromDelta(sumX, sumY);
},

// Checks if a point falls within the rotated rectangular bounds of a tunnel (with a small margin).
pointInTun = (pt, tun, margin = 2, dx = pt.x - (tun.x1 + tun.x2) / 2, dy = pt.y - (tun.y1 + tun.y2) / 2, rad = degToRad(-(tun.r || 0))) =>
  abs(dx * cos(rad) - dy * sin(rad)) < tun.w / 2 + margin && abs(dx * sin(rad) + dy * cos(rad)) < tun.h / 2 + margin,

// Gets the intersection point of two infinite lines, or falsy if parallel.
lineIntersection = (x1, y1, x2, y2, x3, y3, x4, y4, denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)) =>
  denom && {
    x: ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom,
    y: ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom
  },

// Works out the coordinate of the 'pointy' corner at a hard turn.
naughtyCorner = (con, a, b,
  headA = degToRad(tunExitAngle(a, con)),
  headB = degToRad(tunExitAngle(b, con)),
  dirA = {x: cos(headA), y: sin(headA)},
  dirB = {x: cos(headB), y: sin(headB)},
  bisector = calcDistComponents(0, 0, dirA.x + dirB.x, dirA.y + dirB.y),
  facing = (edges, j) => edges[+((edges[0].x - j.x1) * bisector.x + (edges[0].y - j.y1) * bisector.y <= 0)],
  innerA = facing(expandLineToStrip(con.x1, con.y1, con.x1 + dirA.x, con.y1 + dirA.y, a.h), con),
  innerB = facing(expandLineToStrip(con.x1, con.y1, con.x1 + dirB.x, con.y1 + dirB.y, b.h), con),
  pt = lineIntersection(innerA.x, innerA.y, innerA.x + dirA.x, innerA.y + dirA.y, innerB.x, innerB.y, innerB.x + dirB.x, innerB.y + dirB.y),
) => pt,

// Computes tunnel turn angles and returns pairs with naughty corners.
hardTurns = (tuns, seen = new Set(), results = [], key, a, b, turn, xy) => {
  tuns.forEach(tun => {
    isRotationTunnel(tun) && tun.co.forEach((aId, i) => tun.co.forEach((bId, k) => {
      if (i != k && !seen.has(key = [aId, bId].sort().join())) {
        seen.add(key);
        !isRotationTunnel(a = getById(tuns, aId)) && !isRotationTunnel(b = getById(tuns, bId))
          && abs(turn = normalize180(tunExitAngle(b, tun) - oppositeAngle(tunExitAngle(a, tun)))) > 120
          && (xy = naughtyCorner(tun, a, b))
          // Sanity check: Corner must touch the 2 tunnels.  Jun not needed if calculation produced an outside coordinate.
          && pointInTun(xy, a) && pointInTun(xy, b)
          && results.push({c: tun, t: [a, b], r: turn, xy});
      }
    }));
  });
  return results;
},

// Gets tun object from tun ID.
getTun = (farm, id) => id && getById(farm.tuns, id),

// Performs a jun to con substitution if possible otherwise gives the original tun back.
getTunSub = (farm, tun) => tun.t == 'jun' ? getTun(farm, tun.c) : tun,

// Renders a tunnel.
tunDraw = tun => {
  appendHTML(
    getEl('tunnels'),
    html(divc('prog'), {
      id: tun.id,
      class: 'tp ' + tun.t,
      style: `left:${tun.x1}px;top:${tun.y1 - surface}px;height:${tun.h}px;width:${tun.w}px;transform:rotate(${tun.r}deg);border-radius:${tun.br}` + ((isRotationTunnel(tun) ? `;margin-left:-${tun.w / 2}px` : '') + `;margin-top:-${tun.h / 2}px`)
    })
  );
  tunProgDraw(tun);
},

// Updates tunnel progress.
// Note: The calling function is responsible for making sure the relevant farm is currently displayed.
tunProgDraw = (tun, progEl = query(`#${tun.id} .prog`), tunEl = getEl(tun.id)) => {
  if (progEl) {
    tun.rwip && progEl.classList.add('rwip');
    switch (tun.t) {
      case 'ent':
        progEl.style.top = tun.prog / 100 * 15 - 15 + 'px';
        break;
      case 'con':
      case 'jun':
        progEl.style.height = progEl.style.width = tun.h * tun.prog / 100 + 'px';
        break;
      case 'tun':
        progEl.style.width = tun.prog + '%';
        break;
      case 'cav':
        progEl.style.width = tun.prog + '%';
        progEl.classList.toggle('wip', tun.prog > 0 && tun.prog < 100);
        break;
    }
  }
},

// Removes a tun from a farm, and scrubs any reference to it from other tuns' .co value.
// Important: DOES NOT HANDLE CON/JUN RELATIONSHIP DELETION.  Not expected to be used on CON/JUN tunnels, at least not safely!
// Note: Doesn't remove the DOM element, because is intended to be used before the element is created, or just prior to location.reload() for dev usage.
tunDelete = (farm, tun, el = getEl(tun.id)) => {
  farm.tuns = farm.tuns.filter(t => t.id != tun.id);
  farm.tuns.forEach(t => t.co && (t.co = t.co.filter(id => id != tun.id)));
},

// Updates the wayPoints global record for one farm.
waypointsUpdate = farm => {
  wayPoints[farm.id] =
    waypointsFill(waypointsStitch(waypointsSmooth(waypointsFilter(farm.tuns.filter(t => t.prog > 0).map(t => waypointsCalc(t))))))
      .map((wp, i) => ({...wp, i})); // Waypoints store their own index for quick prev/next look-ups.
},

// Calculates waypoints for the perimeter of a tunnel.
waypointsCalc = (tun, step = tun.t == 'jun' ? 3 : tun.t == 'con' ? 9 : 5, pivotX = tun.x1, pivotY = tun.y1, wipBr = {x: 7, y: 7}, points = [], i) => {
  let {x1, y1, x2, y2, t, prog, w, h, r} = tun,
    fullW = w,
    brParts = tun.br.split('/').map(s => s.trim()),
    hz = brParts[0].split(' ').map(v => parseInt(v)),
    ve = brParts[1].split(' ').map(v => parseInt(v)),
    radii = {tl: {x: hz[0], y: ve[0]}, tr: {x: hz[1], y: ve[1]}, br: {x: hz[2], y: ve[0]}, bl: {x: hz[3], y: ve[1]}},
    totalVert = radii.tl.y + radii.bl.y, excess = totalVert - h,
    getEllipseArcPoints = (cx, cy, rx, ry, angleStart, angleEnd, step, points = [], angle = angleStart, rad) => {
      for (; angle <= angleEnd; angle += step * 2) {
        rad = degToRad(angle);
        points.push({x: cx + (rx) * cos(rad), y: cy + (ry) * sin(rad)});
      }
      return points;
    };
  // Corrections.
  y1 -= h / 2;
  if (['con', 'ent', 'jun'].includes(t)) x1 -= w / 2;
  if (t == 'cav') pivotY = (y1 + y2) / 2;
  // Arc trimming.
  if (totalVert > h) {
    radii.tl.y -= excess / 2;
    radii.bl.y -= excess / 2;
  }
  totalVert = radii.tr.y + radii.br.y;
  if (totalVert > h) {
    excess = totalVert - h;
    radii.tr.y -= excess / 2;
    radii.br.y -= excess / 2;
  }
  // Partial tun corrections.
  if (prog < 100) {
    w *= prog / 100;
    if (tun.rwip) {
      if (t == 'cav') x1 = x2 - w;
      if (t == 'tun') x1 += fullW - w;
      radii.tl = radii.bl = wipBr;
    }
    else {
      if (t == 'con' || t == 'jun') {
        x1 = x1 + fullW / 2 - w / 2;
        y1 = y1 + h / 2 - w / 2;
        h = w;
        radii.tl = radii.bl = wipBr;
      }
      radii.tr = radii.br = wipBr;
    }
  }
  // Assemble the points.
  points.push(...getEllipseArcPoints(x1 + radii.tl.x, y1 + radii.tl.y, radii.tl.x, radii.tl.y, deg180, deg270, step)); // Top left
  for (i = x1 + radii.tl.x; i <= x1 + w - radii.tr.x; i += step) points.push({x: i, y: y1}); // Top line
  points.push(...getEllipseArcPoints(x1 + w - radii.tr.x, y1 + radii.tr.y, radii.tr.x, radii.tr.y, deg270, deg360, step)); // Top right
  for (i = y1 + radii.tr.y; i <= y1 + h - radii.br.y; i += step) points.push({x: x1 + w, y: i}); // Right line
  points.push(...getEllipseArcPoints(x1 + w - radii.br.x, y1 + h - radii.br.y, radii.br.x, radii.br.y, 0, 90, step)); // Bottom right
  for (i = x1 + radii.bl.x; i <= x1 + w - radii.br.x; i += step) points.push({x: i, y: y1 + h}); // Bottom line
  points.push(...getEllipseArcPoints(x1 + radii.bl.x, y1 + h - radii.bl.y, radii.bl.x, radii.bl.y, 90, deg180, step)); // Bottom left
  for (i = y1 + radii.tl.y; i <= y1 + h - radii.bl.y; i += step) points.push({x: x1, y: i}); // Left line
  // Adjust for rotation correctly.
  return points.map((p, I, A, rad = degToRad(r), dx = p.x - pivotX, dy = p.y - pivotY) => ({x: cos(rad) * dx - sin(rad) * dy + pivotX, y: sin(rad) * dx + cos(rad) * dy + pivotY}));
},

// Removes points that are inside other shape's perimeters or out-of-bounds (i.e. out-of-farm not out-of-tunnel).
waypointsFilter = (segments, inShape = (point, perimeterPoints, y = point.y, n = perimeterPoints.length, inside = 0, i = 0, j = n - 1) => {
    for (; i < n; j = i++) {
      let xi = perimeterPoints[i].x, yi = perimeterPoints[i].y, yj = perimeterPoints[j].y;
      if ((yi > y) !== (yj > y) && point.x < ((perimeterPoints[j].x - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }) => {
  segments.forEach((points, index, i) => {
    points.forEach(p => {
      for (i = 0; i < segments.length; i++)
        if (i !== index && inShape(p, segments[i]) || p.y - surface < 0 || p.x < 0 || p.x > 960) {
          p.r = 1;
          break;
        }
    });
  });
  // Note: `squareDistanceCoords()` is used instead of `getHypot()` for performance reasons.
  return segments.map(points => points.filter(p => !p.r)).filter(segment => segment.length > 2).flat()
    .reduce((result, p) => (!result.some(q => squareDistanceCoords(q, p) < 4) && result.push(p), result), []);
},

// Cleans up the waypoints.
waypointsSmooth = (points, radius = 2, factor = .2, remaining = [...points], segments = [], i, j) => {
  remaining.sort((a, b) => a.y - b.y);
  while (remaining.length) {
    let segment = [], current = remaining.shift(), nearestIndex, nearestDist, d, heading = null, temp;
    segment.push(current);
    while (remaining.length) {
      nearestIndex = -1;
      nearestDist = Infinity;
      for (i = 0; i < remaining.length; i++) {
        d = squareDistanceCoords(remaining[i], current);
        if (d <= 144) {
          if (heading != null) {
            temp = abs(normalize180(getAngle(current, remaining[i]) - heading)); // Angle.
            if (temp > 85) d += temp * temp; // Penalise direction changes.
          }
          if (d < nearestDist) {
            nearestDist = d;
            nearestIndex = i;
          }
        }
      }
      if (nearestIndex < 0) break;
      temp = remaining.splice(nearestIndex, 1)[0]; // Next.
      heading = getAngle(current, temp);
      current = temp;
      segment.push(current);
    }
    // Laplacian smoothing.
    segments.push(segment.length > 2 ? segment.map((p, i, arr, sumX = 0, sumY = 0, count = 0, maxNeighDist = 0, neigh, d, n = arr.length) => {
      if (p.y - surface > 50) {// Skip smoothing for low-y points
        for (j = i - radius; j <= i + radius; j++) {
          neigh = arr[(j + n) % n];
          d = squareDistanceCoords(neigh, p);
          if (d > maxNeighDist) maxNeighDist = d;
          if (maxNeighDist > 144) break; // (12 * 12) Break early if any neighbor is too far to consider for smoothing.
          sumX += neigh.x;
          sumY += neigh.y;
          count++
        }
      }
      return maxNeighDist <= 144 && count ? {x: p.x + (sumX / count - p.x) * factor, y: p.y + (sumY / count - p.y) * factor} : p; // 144 = (12 * 12)
    }) : segment);
  }
  return segments.filter(segment => segment.length > 5);
},

// Stitches together segments of waypoints in an intelligent way to preserve as much continuity as possible.
waypointsStitch = (segments, stitched = [], current, c, i) => {
  while (segments.length) {
    current = segments.shift();
    go: while (1) {// Named for use with a nested continue statement to avoid juggling a variable to track loooping and breaks.
      for (i = 0; i < segments.length; i++) {
        let seg = segments[i], curFirst = current[0], curLast = current[current.length - 1], segFirst = seg[0], segLast = seg[seg.length - 1],
          cases = [
            [curLast, segFirst, X => current.concat(seg)],
            [curLast, segLast, X => current.concat(seg.slice().reverse())],
            [curFirst, segLast, X => seg.concat(current)],
            [curFirst, segFirst, X => seg.slice().reverse().concat(current)],
          ];
        for (c of cases) {
          // 12 is the join threshold.
          if (inTargetProximity(c[0], c[1], 12)) {
            current = c[2]();
            segments.splice(i, 1);
            continue go; // Break out of the two for-loops.
          }
        }
      }
      break; // No more joins found, stop looping.
    }
    stitched.push(current);
  }
  return stitched.flat();
},

// Fills large gaps in waypoints.
waypointsFill = (points, i, a, b) => {
  for (i = points.length - 1; i > 0; i--) {
    a = points[i - 1], b = points[i];
    a.y - surface > 50 && squareDistanceCoords(a, b) <= 144 && squareDistanceCoords(a, b) > 64 && points.splice(i, 0, {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2});
  }
  return points;
},

// Calculates square distance to a target if it is roughly within the supplied squared proximity, otherwise Infinity.
// This is a faster function for distance comparison algorithms, just be aware that any value compared to the result of this function should be squared.
boxProxSquareDistance = (coord, target, squaredProximity) =>
  abs(target.x - coord.x) < squaredProximity && abs(target.y - coord.y) < squaredProximity ? squareDistanceCoords(coord, target) : Infinity,

// Calculates if a coord object and target object are in proximity.
// Note: Also checks the target is not the coord object itself so that .find() and .filter() operations of ant sets do not need to specify this.
inTargetProximity = (coord, target, prox) => (!coord.id || coord.id != target.id) &&
  abs(target.x - coord.x) < prox && abs(target.y - coord.y) < prox && // Box distance check to quickly eliminate most targets.
  squareDistanceCoords(coord, target) < prox * prox, // Square distance check.

// Renders hills.
hillDraw = hill => {
  appendHTML(getEl('hills'), html(divc('specks'), {id: 'hill-' + hill.id, class: 'hill', style: `left:${hill.l}px;width:${hill.r - hill.l}px`}));
  hillProgDraw(hill);
},

// Updates hill height.
hillProgDraw = hill => getEl('hill-' + hill.id).style.height = hill.h + 'px',

// Corrects background position of farm sculptures.
mTunsBg = X => queryAll('.prog').forEach(el => {let tp = el.closest('.tp'); el.style.backgroundPosition = tp.style.left + ' ' + tp.style.top}),

// Set up the msgLog panel.
setupMsgLog = (msgLogEl = getEl('msglog'), msgLogDn = getEl('msglog-dn'), msgLogTxt = getEl('msglog-txt')) => {
  msgLogDn.addEventListener('click', (e, isShown = msgLogEl.classList.toggle('dn')) => {
    if (isShown) {
      msgLogTxt.innerHTML = html(p('Message Log'), {class: 'msg mlhd'});
      messageLog.forEach(ml => msgLogTxt.innerHTML += html(ml.msg, {class: 'msg ' + ml.t}));
    }
    msgLogDn.innerText = isShown ? '▲' : '▼';
  });
},

// Lets the mouse wheel do horizontal scrolling.
enableHzScrollWheel = el => {
  el.addEventListener('wheel', e => {
    if (el.scrollLeft || el.scrollLeft + el.clientWidth < el.scrollWidth) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  });
},

// Set up the switch control panel.
setupSwitcher = (switchUp = getEl('switch-up'), switchControl = getEl('switch-control')) => {
  switchUp.addEventListener('click', X => switchUp.innerText = getEl('switch').classList.toggle('up') ? '▼' : '▲');
  switchControl.addEventListener('click', (e, farmId = e.target.closest('.switch-f')?.dataset.id) => farmId && F.id != farmId && switcher && switchFarm(farmId));
  enableHzScrollWheel(switchControl);
},

// Updates the farm switch control panel.
updateSwitcher = X => {
  if (!spilled) {
    if (_.farms.length > 1) getEl('switch').classList.add('vis');
    getEl('switch-control').innerHTML = '';
    _.farms.forEach(f => getEl('switch-control').appendChild(getTemplate(html(html(f.sculpt ? img('sculpt') : getFarmThumbnail(f), {class: 'sw-t'}), {class: 'switch-f' + (currentFarm(f) ? ' cur' : ''), 'data-id': f.id}))));
    setTimeout(X => switcher = 1, num1000); // Re-enable switcher.
    // Prevent soft-lock due to crucible functionality. (Checked here because this func is somewhat of a multi-farm overwatcher)
    _.farms.length && _.farms.every(f => f.sculpt) && !_.bag.some(obj => obj.k == 'antFarm') && setTimeout(X => drop('antFarm'), shortDelay);
    /* START-DEV */
    dev && devNotifySwitch(); // Tell the dev script that a switch happened.
    /* END-DEV */
  }
},

// Retrieves the HTML for a farm's thumbnail.
// Note: the 'ab' and 'fl' classes are there in anticipation of future divs that match the same position/dimensions, but that can be changed if that is to never be implemented.
getFarmThumbnail = (f, farm = 1, base = 1) => (farm ?
  html(divc('crd ab', {style: f.card ? `background-image:url(img/${f.card}.webp)` : ''}) + divc('fll fl') + divc('gl') + divc('de') +
  divc('ld') + divc('n1') + divc('n2') + divc('n3') + divc('n4'), {class: 'thumb', 'data-col': f.col, 'data-fill': f.fill}) : '')
  + (base ? html(divc('Bl') + html(f.n, {class: 'Bn'}) + divc('Br') + divc('Bt'), {class: 'Bthumb', 'data-col': f.plate}) : ''),

// Calculates the y-position of the drink feeder.
getDrinkHillHeight = (x, xPos = parseInt(x)) => (getHillHeight(xPos + 25) + min(getHillHeight(xPos), getHillHeight(xPos + 50))) / 2 + 'px',

// Re-adds placed items when switching to farm or loading page.
addItems = X =>
  F.items.forEach(item => {
    let isFood = ['food', 'drink'].includes(item.t);
    appendHTML(getEl(isFood ? 'food' : item.t), html(isFood ? foodCode(item) : sceneImg(item), {id: item.id, style: 'left:' + item.x, class: items[item.k].t + ' I' + item.k, 'data-fx': items[item.col]?.fx}));
  }) || updateFoodAndDrink(),

// Re-adds placed stickers when switching to farm or loading page.
addDecals = X => F.decals?.forEach(decal => appendDecalImg(getEl('decals'), decal, '')),

// Re-adds the nip items if needed.
addNipItems = X => {
  F.nips.forEach(n => {
    let nipItem = n.item, nipId = nipIds[n.nip], isVial = nipItem.k == 'vial', itemEl = isVial ? getEl('vial') : getEl('t-' + nipId);
    getEl(nipId).classList.add('off', 'hide');
    itemEl.classList.add(nipId, 'on', 'vis');
    getEl('a-' + nipId).classList.add('on', 'fade');
    if (isVial) query('#vial .vs div').style.background = items[nipItem.col].col;
    itemEl.dataset.id = n.f;
    itemEl.addEventListener('click', e => createNipArrows(n, itemEl));
  });
  tubeFollowLinks();
},

// Hides the tube follow links.
hideTubeFollowLinks = X => queryAll('.toob > span').forEach(fl => fl.classList.remove('vis')),

// Updates the tube follow link functionality.
tubeFollowLinks = X => {
  queryAll('.toob > span').forEach(fl => {
    let par = fl.parentElement;
    fl.addEventListener('click', e => {
      e.stopPropagation();
      switcher ? switchFarm(par.dataset.id) : denyClick(fl);
    }, {once: 1});
  });
  tubeFollowLinkPosition();
},

// Updates the tube follow link visual position.
tubeFollowLinkPosition = X => {
  setTimeout(X => {
    queryAll('.toob > span').forEach(fl => {
      let par = fl.parentElement, pbl = par.getBoundingClientRect().left + (['t-nip-tl', 't-nip-bl'].includes(par.id) ? 1060 : 0);
      fl.style.left = min(pbl + 480, window.innerWidth - 60) - pbl + 'px';
      fl.classList.toggle('vis', par.classList.contains('on'));
    });
  }, num2000);
},

// Provides common markup for addDecals() and placeDecal() and appends it to the supplied container.
appendDecalImg = (decalsEl, decal, temp = ' temp') =>
  appendHTML(decalsEl, html(img(decal.k), {id: decal.id, style: `left:${decal.x};top:${decal.y};transform:rotate(${decal.r}deg)`, class: items[decal.k].t + ' ' + (decal.k + temp)})),

// Provides the HTML code for a food or beverage item.
foodCode = item => html(divc('sz-' + min(4, floor(item.sz / 20))), {class: item.t + ' ' + item.k}),

// Calls SVG() to get the SVG code based on a scene item's attributes.
sceneImg = item => SVG(item.k, items[item.col].col, items[item.col].fx == 'm' ? '#fff' : '#000', items[item.col].fx == 'm' ? '.6' : '.25'),

// Get img/svg tag for a bag/drop item.
bagImg = (bagItem, callback = img, item = items[bagItem.k]) => ['scenery', 'decor'].includes(item.t) ? sceneImg(bagItem) :
  ['paintm', 'paint'].includes(item.t) ? sceneImg({k: item.fx == 'm' ? 'paintm' : 'paint', col: bagItem.k }) :
  item.t == 'ants' ? sceneImg({k: 'ants', col: item.col || bagItem.col }) :
  callback(item.t == 'hat' ? 'hat' : bagItem.k, {}, item.ext),

// Dumps the current farm, and optionally restart.
dumpFarm = restart => {
  farmIsRunning(F) && _.rm++;
  // Stow scenery items in bag.
  if (F.card) {
    _.bag.push({k: F.card});
    F.card = getEl('card').style.background = '';
  }
  // Remove scenery and decor items, and place into bag.
  F.items.forEach(item => item.t != 'food' && item.t != 'drink' && _.bag.push(item));
  getEl('scenery').innerHTML = '';
  getEl('food').innerHTML = '';
  if (!restart) F.fill = '';
  F.a.forEach(antDelete);
  // The rest done in a 1-frame delay to minimise chance of console errors from pending antAction timers that expect
  // the farm object to be some type of way before they loop back and detect the missing ants.  Not a perfect solution.
  // Note: This might not be needed anymore, but it doesn't hurt to leave it like this for now.
  setTimeout(X => {
    // Reset farm to defaults.
    del(assign(F, cloneData(farmDefault)), 'dun', 'hair');
    // Save these changes.
    save();
    // Undraw tunnels and hills.
    if (!spilled) {
      getEl('tunnels').innerHTML = '';
      getEl('hills').innerHTML = '';
      // This should handle the rest...
      startFarm(restart);
    }
    updateSwitcher();
  }, frameTick);
},

// "Uses" an inventory item.
useItem = (i, doQuip = 1, doDel = 1, item = _.bag[i], itemKey = item.k, itemType = items[itemKey].t, j = 0,
  typeHandlers = {
    filler() {
      if (!F.fill) {
        F.fill = itemKey;
        F.hair = itemKey == 'lube' ? [20 + randomInt(400), 20 + randomInt(860), randomInt(deg360)] : 0;
        startFarm(1);
        doQuip = _.score > 0;
        updateSwitcher();
      }
    },
    sanitation: dumpFarm,
    gift() {for (; j++ < 3 + randomInt(2);) scoreDrop(0)},
    nutrition() {item.sz = 100; placeItem(i, 'food')},
    hydration(existingDrink = F.items.find(i => i.t == 'drink')) {item.sz = 100; existingDrink ? refillDrink(existingDrink, i) : placeItem(i, 'drink')},
    scenery() {doDel = 0; placeItem(i, 'scenery')}, // Don't del because placeItem() needs the item to remain in the bag, and will del the item when placed.
    decor() {typeHandlers.scenery()}, // Uses same logic as scenery.
    sticker() {doDel = 0; placeDecal(i)}, // Don't del because placeDecal() needs the item to remain in the bag, and will del the item when placed.
    card(lidClasses = getEl('lid').classList, cardElStyle = getEl('card').style) {
      switcher = 0;
      // Stow existing card in bag.
      F.card && _.bag.push({k: F.card});
      // Insert card with animation.
      F.card = itemKey;
      setTimeout(X => {
        lidClasses.add('off');
        setTimeout(X => {
          cardElStyle.bottom = '80vh';
          setTimeout(X => {
            cardElStyle.background = `url(img/${F.card}.webp)`;
            cardElStyle.bottom = '50%';
            setTimeout(X => {
              lidClasses.remove('off');
              addLidFunc();
              updateSwitcher(); // Will re-enable switcher.
            }, num1500);
          }, num1000);
        }, num500);
      }, num500);
    },
    ants(ants = item.a, emptyVial = cloneData(item)) {
      // Note: A lot of this code does things with 'emptyVial' (a deep clone of 'item') because 'item' will be deleted
      //   by deleteBagItem(i) below whereas 'emptyVial' will be pushed into the inventory.  Worth keepin that in mind!
      doDel = 0; // Don't delete because it will dump the item before the setTimeout below can check it.
      if (itemKey == 'vial') {
        setTimeout(X => {
          nippleSelection((nip, vialEl = getEl('vial'), nipId = nipIds[nip]) => {
            emptyVial.a = [];
            F.nips.push({nip: nip, item: emptyVial});
            vialEl.classList.add(nipId, 'vis');
            query('#vial .vs div').style.background = items[emptyVial.col].col;
            deleteBagItem(i);
            setTimeout(X => vialEl.classList.add('on') || getEl('a-' + nipId).classList.add('on'), num800);
            vialEl.addEventListener('click', e => createNipArrows(getVial(F), vialEl));
          });
        }, num500);
      }
      else {
        switcher = 0;
        setTimeout(X => {
          getEl('lid').classList.add('off');
          setTimeout(X => {
            if (itemKey == 'collected') {
              for (let a = 0; a < ants.length; a++) {
                setTimeout(X => {
                  let ant = assign(ants[a], {x: window.innerWidth / 2 + randomInt(num200) - 100, y: -30, pose: 'pick'});
                  del(ant, 'nipPh', 'nipTs');
                  checkExpatQueen(ant, F);
                  dropAntInFarm(ant, item);
                }, min(num500, shortDelay * 1.4 / ants.length) * a);
              }
              emptyVial.a = [];
            }
            else {
              for (let a = 0; a <= (items[itemKey].W || 0); a++) {
                setTimeout(X => {
                  dropAntInFarm(assign(createAnt(_, window.innerWidth / 2 + randomInt(num200) - 100, -30, randomInt(30), 'cap', a ? 'W' : 'Q', items[itemKey].ant), {
                    scale: getSign(randomInt(1)),
                    pose: 'pick',
                    alate: 0,
                    lay: 99, // Get queens ready to lay.
                  }), _);
                }, num500 * a);
              }
            }
            // Stow an empty vial in the bag.
            emptyVial.k = 'vial';
            emptyVial.col ||= items[itemKey].col;
            _.bag.push(emptyVial);
            deleteBagItem(i);
            setTimeout(X => {
              getEl('lid').classList.remove('off');
              addLidFunc();
              switcher = 1;
            }, shortDelay * 2);
            droneEscape();
          }, num500);
        }, num500);
      }
    },
    paint() {doDel = 0; doQuip = 0; popup('paint', i)}, // Don't del as we aren't marking every paint with "keep: 1", the popup workflow will do it.
    hat() {doDel = 0; popup('hat', i)}, // Don't del as we aren't marking every hat with "keep: 1", the popup workflow will do it.
  },
  keyHandlers = {
    plate() {popup('plate', i)},
    tube() {popup('tube', i)},
    feng() {popup('feng', i)},
    antfax() {keys(items).forEach(k => items[k].t == 'card' && preloadImage(k)); popup('antfax', i)},
    antfaxpro() {keyHandlers.antfax()},
    antyvenom,
    cologne(fx = getEl('fx')) {
      playSound('spray', .7);
      fx.classList.add('fog');
      for (; j < 20;) setTimeout(X => {spawnAnt(0); spawnAnt(0)}, j++ * shortDelay);
      setTimeout(X => {
        fx.classList.add('fog2');
        setTimeout(X => fx.classList.remove('fog', 'fog2'), 4500);
      }, 19 * shortDelay);
    },
    bus(countFarms = totalFarmCount(), loc = pickRandom(countFarms == 4 ? ['dystopia'] : keys(locs).filter(lk => countFarms < 3 || countFarms > 4 ? lk != 'dystopia' : lk)), newBg = loc + (randomInt(locs[loc].c - 1) + 1)) {
      if (newBg == _.bg) return keyHandlers.bus(); // Note: this could potentially recurse infinitely causing stack problems, but the odds are low enough to be negligible.
      _.bg = newBg;
      _.au = locs[loc].a;
      ambience();
      setBg();
    },
    backdrop() {_.grad = (_.grad + 1) % 8; _.bg = ''; setBg()},
    clonekit() {clone(3)},
    speedo() {_.ss = getTime() + (3 * longDelay) + randomInt(longDelay); doWarp()},
    ebay() {popup('ebay', i)},
    antFarm() {addFarm(); score(20, 1)},
    mom() {msg('<b>Win.</b>', 'err'); _.win = 1; score(100, 1)},
    crucible() {pourCrucible()},
    sculpt() {_.farms.push(item.f); switchFarm(item.f.id); _.rm--;},
  },
  handler = keyHandlers[itemKey] || typeHandlers[itemType]
) => {
  closePopup();
  handler && handler();
  doQuip && randomMsg(items[itemKey].quip);
  doDel && !items[itemKey].keep && deleteBagItem(i);
},

// Provides common functionality between placeDecal() and placeItem().
pointerPlace = (obj, boundsEl, move, commit, boundsRect = boundsEl.getBoundingClientRect(), onMove = e => move(e, boundsRect),
  onDown = (e, rect = obj.getBoundingClientRect()) => e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom && commit()) => {
  B.addEventListener('pointermove', onMove);
  B.addEventListener('pointerdown', onDown);
  return X => {
    B.removeEventListener('pointermove', onMove);
    B.removeEventListener('pointerdown', onDown);
  };
},

// Adds stickers into the farm.
// Note: Once the sticker is chosen it can't be cancelled, other than reloading the page.  I think that makes sense though, because once you peel a sticker... well, you're rather stuck.
placeDecal = (i, decals = getEl('decals'), decal = assign(_.bag[i], {id: 'i' + getTime()})) => {
  getEl('olay').classList.add('vis');
  appendDecalImg(decals, decal);
  let obj = getEl(decal.id), imgEl = obj.querySelector('img'),
    decalSetup = (imgWidth = obj.offsetWidth, imgHeight = obj.offsetHeight, decalCleanup = pointerPlace(obj, decals,
      (e, rect) => {
        obj.style.left = `${clamp(e.clientX - rect.left - imgWidth / 2, 0, decals.offsetWidth - imgWidth)}px`;
        obj.style.top = `${clamp(e.clientY - rect.top  - imgHeight / 2, 0, decals.offsetHeight - imgHeight)}px`;
      },
      X => {
        obj.classList.remove('temp');
        decal.x = obj.style.left;
        decal.y = obj.style.top;
        F.decals ||= [];
        F.decals.push(decal);
        decal.k == 'coexist' && (F.coex = 1);
        deleteBagItem(i);
        getEl('olay').classList.remove('vis');
        save();
        decalCleanup();
      }
    )) => {
    obj.style.left = `${(decals.offsetWidth - imgWidth) / 2}px`;
    obj.style.top = `${(decals.offsetHeight - imgHeight) / 2}px`;
  };
  imgEl.complete ? decalSetup() : imgEl.addEventListener('load', X => decalSetup(), {once: true});
},

// Adds items into the farm.
placeItem = (i, type, item = assign(cloneData(_.bag[i]), {id: _.bag[i].id || 'i' + getTime(), t: type}), el = getEl(type == 'drink' ? 'food' : type)) => {
  switcher = 0;
  getEl('olay').classList.add('vis');
  setTimeout(X => getEl('lid').classList.add('off'), num500);
  appendHTML(el, html(type == 'scenery' ? sceneImg(item) : foodCode(item), {id: item.id, class: items[item.k].t + ' I' + item.k + ' temp up'}));
  let obj = getEl(item.id), itemWidth = obj.offsetWidth,
    cleanup = pointerPlace(obj, el,
      (e, rect) => {
        let xPos = clamp(e.clientX - rect.left - itemWidth / 2, 0, el.offsetWidth - itemWidth);
        obj.style.left = xPos + 'px';
        if (type == 'food') {
          obj.style.bottom = getHillHeight(xPos + itemWidth / 2) + 'px';
          obj.style.transform = `rotate(${antHillAngle({x: xPos + itemWidth / 2, scale: 1, f: F.id}, 9)}deg)`;
        }
        if (type == 'drink') obj.style.bottom = getDrinkHillHeight(xPos);
      },
      X => {
        obj.classList.remove('temp');
        item.x = obj.style.left;
        F.items.push(item);
        if (!items[item.k].keep) deleteBagItem(i);
        setTimeout(X => getEl('lid').classList.remove('off'), num500);
        getEl('olay').classList.remove('vis');
        addLidFunc();
        switcher = 1;
        if (type == 'scenery') _.scene[item.id] = 1;
        save();
        cleanup();
      }
    );
  setTimeout(X => {obj.classList.remove('up'); droneEscape()}, num1000);
  obj.style.left = `${(el.offsetWidth - itemWidth) / 2}px`;
},

// Pulls existing drink feeder out of farm and switches to placeItem to insert new drink.
refillDrink = (item, i, itemEl = getEl(item.id)) => {
  switcher = 0;
  setTimeout(X => getEl('lid').classList.add('off'), num500);
  setTimeout(X => {
    itemEl.classList.add('up');
    setTimeout(X => {
      F.items = F.items.filter(it => it.id != item.id);
      itemEl.remove();
      placeItem(i, 'drink'); // Will re-enable switcher.
    }, num800);
    droneEscape();
  }, num800);
},

// Puts lid functionality on the lid.
addLidFunc = (lid = getEl('lid')) => {
  lid.addEventListener('click', createArrows);
  lid.classList.add('use');
},

// Lets a drone escape and reschedules itself for another turn.
droneEscape = (drone = pickRandom(F.a.filter(a => isDrone(a) && isCapped(a) && isAdult(a) && !a.area.t && !a.esc)),
  exitX = 215 + randomInt(530), exitY = 300, startX = drone?.x, startY = drone?.y, angle = getAngle({x: startX, y: startY}, {x: exitX, y: exitY}), rad = degToRad(angle),
  elapsed = 0, tick = (t = min(1, (elapsed += frameTick) / num500), e = easeInQuad(t), droneEl = getObjEl(drone), exitTick = X => {
    drone.x += cos(rad) * 3 * frameTick; drone.y += sin(rad) * 3 * frameTick; antUpdate(drone); // 3 - speed multiplier.
    droneEl.getBoundingClientRect().bottom < -25 ? (msg(pickRandom([`${drone.n} has escaped!`, `${drone.n} flew away!`])), antDelete(drone), droneEscape()) : setTimeout(exitTick, frameTick);
  }) => getEl('lid').classList.contains('off') && droneEl?.isConnected && (drone.esc = 1) && (t < 1 ?
    antUpdate(assign(drone, {x: startX + (exitX - startX) * e, y: startY + (exitY - startY) * e, r: angle, scale: 1, pose: 'prone'})) || setTimeout(tick, frameTick) : exitTick()),
) => drone && antInstaQ(drone, {min: 5000}, 0) && setTimeout(tick, num500 + randomInt(num2000)),

// Provides the common initialisation workflow for createArrows() and createNipArrows().
createArrowsInit = (pull, olay = getEl('olay')) => {
  olay.classList.add('vis');
  pull.replaceWith(pull.cloneNode(0));
  olay.addEventListener('click', removeArrows);
  window.addEventListener('resize', removeArrows);
  return getEl('pull');
},

// Shows arrows when lid lifted.
createArrows = (e, pull = createArrowsInit(getEl('pull')), card = getEl('card'), itemEls = [...(F.card ? [card] : []), ...queryAll('#scenery > *, #food > *')]) => {
  getEl('lid').classList.add('off');
  randomMsg(lidLift);
  setTimeout(X => {
    itemEls.forEach((itemEl) => {
      let item = getById(F.items, itemEl.id), itemElRect = itemEl.getBoundingClientRect(), arrow = document.createElement('div'), itemElWidth = itemElRect.width, topMap = {card: 100, scenery: 140, drink: 220, food: 220};
      arrow.classList.add('arrow');
      pull.appendChild(arrow);
      arrow.style.width = itemElWidth + 'px';
      arrow.style.left = `${(itemElRect.left + itemElWidth / 2) - pull.getBoundingClientRect().left - itemElWidth / 2}px`;
      arrow.style.top = `${topMap[itemEl.id] ?? topMap[item.t] ?? 180}px`; // itemEl.id is for #card, item.t is for the rest.
      arrow.addEventListener('click', X => {
        arrow.classList.add('hide');
        if (itemEl == card) {
          F.card && _.bag.push({k: F.card});
          F.card = 0;
          card.style.bottom = '80vh';
        }
        else if (itemEl) {
          if (item.t != 'food' && item.t != 'drink') {
            _.bag.push(item);
            _.bag = _.bag.filter(bi => bi);
          }
          F.items = F.items.filter(i => i.id != itemEl.id);
          itemEl.classList.add('up');
          setTimeout(X => itemEl.remove(), num1000);
        }
        save();
        updateSwitcher(); // So card image is updated in the thumbnails.
      });
    });
    // Allow plucking dead ants from surface.
    F.a.filter(a => isDead(a) && !a.area.t).forEach(a => {
      let arrow = document.createElement('div'), antEl = getObjEl(a), itemRect = antEl.getBoundingClientRect();
      arrow.classList.add('arrow');
      pull.appendChild(arrow);
      arrow.style.width = '16px';
      arrow.style.left = itemRect.left + itemRect.width / 2 - 8 + 'px';
      arrow.style.top = a.y - 80 + 'px';
      arrow.addEventListener('click', X => {
        arrow.classList.add('hide');
        antEl.classList.add('up');
        setTimeout(X => antDelete(a, 'a', F), num1000);
        save();
      });
    });
    pull.classList.add('vis');
    droneEscape();
  }, num500);
},

// Replaces lid and removes arrows.
removeArrows = (e, olay = getEl('olay'), pull = getEl('pull')) => {
  setTimeout(X => {
    getEl('lid').classList.remove('off');
    pull.innerHTML = '';
  }, num1000);
  olay.classList.remove('vis');
  pull.classList.remove('vis');
  olay.removeEventListener('click', removeArrows);
  window.removeEventListener('resize', removeArrows);
},

// Shows arrows when something attached to a nipple is clicked.
createNipArrows = (nipData, nipItemEl, nipItem = nipData.item, pull = createArrowsInit(getEl('pull')), nipId = nipIds[nipData.nip], arrow = document.createElement('div'),
nipEl = getEl(nipId), nipRect = nipEl.getBoundingClientRect(), nantEl = getEl('a-' + nipId), otherFarm = getFarm(nipData.f), otherData = otherFarm?.nips.find(n => n.id == nipData.id)) => {
  arrow.classList.add('arrow', 'niparrow', nipId);
  pull.appendChild(arrow);
  arrow.style.left = `${nipRect.left - pull.getBoundingClientRect().left + 10}px`;
  arrow.style.top = `${nipRect.top - 80}px`;
  arrow.addEventListener('click', X => {
    if (F.a.some(a => a.q[0]?.act == 'nip')) denyClick(arrow); // An ant is trying to walk through the nip, deny this action.
    else {
      removeArrows();
      nantEl.classList.remove('on');
      nipItemEl.classList.remove('on');
      nipEl.classList.remove('hide');
      setTimeout(X => {
        nipItemEl.classList.remove(nipId);
        nipEl.classList.remove('off');
        nantEl.innerHTML = '';
        nipItemEl.classList.remove('vis');
      }, num800);
      if (nipItem.k == 'tube') {
        // Denip all of the ants from both halves of the tube into the farm that is not currently displayed (because this mass ant dump looks stupid).
        // Note: eggs will be moved by the deNip as well as they're each tied to a carrier ant.
        nipItem.a.forEach(a => deNip(a, nipData, otherFarm, otherData.nip)); // Overriding the default 'nip' param because we need it to be set to the relevant nip of the OTHER farm.
        otherData.item.a.forEach(a => deNip(a, otherData, otherFarm));
        // Kill the corresponding tube (our side of the tube will be removed as normal below).
        otherFarm.nips = otherFarm.nips.filter(n => n.id != nipData.id);
        // Note: tubeLoop() and antNipWalk() detect when they're no longer needed and clear their own animation loops when this happens.
      }
      if (nipItem.a.length) nipItem.k = 'collected';
      del(F.nips, nipData.nip);
      F.nips = F.nips.filter(n => n.nip != nipData.nip);
      _.bag.push(nipItem);
      save();
    }
  });
  pull.classList.add('vis');
},

// Fetches a list of usable nips the farm has, optionally restricted to available nips.
getNips = (avail, f = F, nips = nipIds.slice(-2)) => (f.tuns.forEach(t => t.nip && t.dun && nips.push(nipIds[t.nip])), nips.filter(n => !avail || !f.nips.some(nip => nipIds[nip.nip] == n))),

// Enables the nipple selection UI mode.  Calling workflow is responsible for checking getNips(1) works.
nippleSelection = (callback, nips = getNips(1), nipCount = 0, nippleClick = e => {
    let id = e.target.closest('.nip').id;
    queryAll('.nip').forEach(n => {
      n.classList.remove('sel');
      n.removeEventListener('click', nippleClick);
    });
    B.offsetWidth; // force reflow
    getEl(id).classList.add('off');
    setTimeout(X => getEl(id).classList.add('hide'), num2000);
    callback(nipIds.indexOf(id));
  }) => {
  nips.forEach(n => {
    nipCount++;
    getEl(n).classList.add('sel');
    getEl(n).addEventListener('click', nippleClick);
  });
  msg(nipCount ? 'Select a nipple.' : 'No nipples available!', 'warn');
},

// Sets the body background to simulate player location.
setBg = (afs = getEl('afs')) => {
  afs.className = '';
  if (_.bg) {
    afs.classList.add('bg');
    afs.style.backgroundImage = `url(img/bg/${_.bg}.webp`;
  }
  else if (_.grad) {
    afs.classList.add('gr' + _.grad);
    afs.style.backgroundImage = '';
  }
},

// Plays the sizzle sound, but only if it hasn't been played in the last 500ms.
playSizzle = (vol = .3) => {
  if (getTime() - sizzler > num500) {
    sizzler = getTime();
    playSound('sizz2', vol);
  }
},

// Pours liquid metal into farm.
pourCrucible = (audio = ambienceOverride('sizz1'), fx = getEl('fx'), hills = getEl('hills'), pourEl = getTemplate(divc('pour'))) => {
  switcher = 0;
  spawner = 0; // Disable free ants coming in.
  pouring = 1;
  hideMenus();
  setTimeout(X => {
    getEl('lid').classList.add('off');
    hills.before(pourEl);
    setTimeout(X => {
      _.a.forEach(antDelete);
      pourEl.classList.add('vis');
      hills.innerHTML = html(divc('hill'), {id: 'mHill'}) + hills.innerHTML;
      let mHillEl = getEl('mHill'), mTunsEl = getEl('tunnels').cloneNode(1), child;
      mTunsEl.id = 'mTuns';
      for (child of mTunsEl.children) child.id = 'm' + child.id;
      getEl('tunnels').after(mTunsEl);
      F.mTuns = F.tuns.map(tun => ({...tun, cap: tun.prog, prog: 0, id: 'm' + tun.id}));
      F.mTuns.forEach(t => {
        tunProgDraw(t);
        if (t.t == 'ent') query(`#${t.id} .prog`).style.top = '-30px';
      });
      mTunsEl.classList.add('vis');
      setTimeout(X => {
        fx.classList.add('smoke');
        playSizzle(.8);
        mHillEl.classList.add('vis');
        F.a.filter(a => (a.area.n == 'bg' || a.area.n == 'top') && !a.burn).forEach(a => {
          a.area.n == 'bg' && randomInt(2) && antActionSlip(a);
          a.burn = 1;
          antUpdate(a);
          antInstaQ(a, {min: 10000});
          setTimeout(X => {
            playSizzle();
            a.area.n == 'bg' && randomInt(2) && antActionSlip(a);
            antDeath(a, 'other');
          }, num1000 + randomInt(num2000));
        });
        queryAll('#scenery > div, #food > div').forEach(el => {
          el.classList.add('burn');
          setTimeout(X => el.classList.add('fade'), num1000 + randomInt(num2000));
        });
        getEl('card').classList.add('burn');
        playSizzle(.6);
        setTimeout(X => {
          playSizzle();
          getEl('card').classList.add('fade');
          F.mTuns.filter(tun => tun.t == 'ent').forEach(pourTun);
          getEl('tunnels').classList.add('pouring');
          queryAll('.frame').forEach(el => el.classList.add('burn'));
        }, num1000);
        setTimeout(X => {
          mTunsEl.style.overflow = 'visible';
          pourEl.classList.remove('vis');
          mHillEl.classList.remove('vis');
          getEl('decals').classList.add('fade');
          F.a.forEach(antDelete);
          setTimeout(X => {
            farmSetSculpture(F); // Resets farm object to defaults, and adds 'metal' elements.
            playSizzle();
            audio.pause();
            pourEl.remove();
            setTimeout(X => {
              queryAll('#menu > a').forEach(a => a.classList.remove('hide'));
              query('#kit #wrapper').dataset.col = query('#kit #base').dataset.col = 'metal';
              mTunsBg();
              save();
              ambience();
              setTimeout(X => mTunsEl.classList.add('fade'), 10000);
              setTimeout(X => {
                fx.classList.add('fog2');
                setTimeout(X => fx.classList.remove('smoke', 'fog2'), 4500);
                setTimeout(X => {
                  pouring = 0;
                  score(20, 1);
                  updateSwitcher(); // Will re-enable switcher.
                }, 6000);
              }, 20000);
            }, num2000);
          }, num2000);
        }, 6000);
      }, num2000);
    }, num500);
  }, num500);
},

// Sets the current farm to be a sculpture.
farmSetSculpture = farm => {
  checkAchievements();
  farm.mTuns.forEach(t => t.prog = t.cap);
  farm.fill = farm.col = farm.plate = 'metal';
  let {id, n, mTuns} = farm;
  del(farm, 'card');
  assign(farm, cloneData(farmDefault), {id, n, mTuns, sculpt: 1});
},

// Draws progress of a tunnel pour.
pourTun = tun => {
  tun.pour = 1;
  tun.prog += 2;
  if (tun.t == 'con' || tun.t == 'jun') tun.prog = tun.cap;
  tunProgDraw(tun);
  if (tun.t == 'ent') query(`#${tun.id} .prog`).style.top = tun.prog / tun.cap * 30 - 30 + 'px'; // Ent needs to be special cased.
  F.a.filter(a => 'm' + a.area.t == tun.id && !a.burn).forEach(a => {
    a.burn = 1;
    a.state = 0;
    antUpdate(a);
    playSizzle();
    setTimeout(X => antDeath(a, 'other'), num1000 + randomInt(num2000));
  });
  if (tun.prog >= tun.cap) tun.co.forEach(tunId => {
    let nextTun = getById(F.mTuns, 'm' + tunId);
    if (!nextTun.pour) {
      if (!isRotationTunnel(nextTun) && nextTun.x2 == tun.x2) query('#' + nextTun.id + ' .prog').style.float = 'right';
      pourTun(nextTun);
    }
  });
  else setTimeout(X => pourTun(tun), 3);
},

// Handles presses of the stow button.
stow = e => {
  // Stow sculpture.
  if (F.sculpt) {
    getEl('stow').classList.remove('vis');
    _.bag.push({k: 'sculpt', f: F});
    _.farms = _.farms.filter(f => f.id != F.id);
    switchFarm(_.farms[0].id);
    _.rm++;
  }
},

// A collection of namespaced modal functions which all work in a similar way.
modal = {

  // Templates the inventory bag popup.
  bag: el => {
    bodyClasses.add('bag');
    el.innerHTML =
      html('', {id: 'bag-items'}) + html(
        (_.bag.length > 9 ? html(
          tag(4, 'Sort') +
          [html('Date', {'data-s': 0, class: 'sel-' + !_.bs}, 'a'), html('Auto', {'data-s': 1, class: 'sel-' + (_.bs === 1)}, 'a'), html('Name', {'data-s': 2, class: 'sel-' + (_.bs > 1)}, 'a')].join(' | '),
          {class: 'sort-caption vis'}
        ) : ''), {id: 'bag-caption'});
    queryAll('.sort-caption a').forEach(lnk => lnk.addEventListener('click', e => {_.bs = parseInt(e.target.dataset['s']); popup('bag', 0, 0)}));
    for (let [i, bagItem] of [..._.bag.entries()].sort(_.bs > 1 ? (([, a], [, b]) => (items[a.k].n > items[b.k].n ? 1 : items[a.k].n < items[b.k].n ? -1 : 0)) : !_.bs ? X => 0 : ([, a], [, b]) => keys(items).indexOf(a.k) - keys(items).indexOf(b.k))) {
      let cta = 'Use item', disable, customDesc, itemKey = bagItem.k, item = items[itemKey], itemType = item.t, dumpItem,
      useFunc = (e, el = e.target, i = el.dataset.i) => {
        if (itemType == 'sanitation') {
          // This one needs a confirm workflow.
          el.disabled = 1;
          el.classList.add('confirm');
          el.textContent = '⌛';
          el.removeEventListener('click', useFunc);
          setTimeout(X => {
            el.innerHTML = '🚮️ ' + span('Confirm farm dump', {class: 'err'});
            el.onclick = event => useItem(i);
            el.disabled = 0;
          }, num1000);
        }
        else useItem(i); // Most items just hit up useItem() right away.
      },
      fillCheck = X => !F.fill && (cta = 'Ant farm has no fill', disable = 1), // Several items need a generic fill check to block them from being put into empty farms.
      insertCta = X => cta = 'Insert ' + item.n,
      insertLimit = X => F.items.length > 9 && (cta = 'Putting-stuff-in limit reached', disable = 1),
      typeHandlers = {
        filler() {F.fill ? (cta = 'Ant farm already filled', disable = 1) : (cta = 'Fill ant farm with ' + itemKey)},
        sanitation() {F.fill ? (cta = 'Dump contents of ant farm') : (cta = 'Ant farm already empty', disable = 1); F.nips.length && (cta = 'Farm has attached items', disable = 1)},
        nutrition() {insertCta(); F.items.some(i => i.k == itemKey) ? (cta = `There is already some ${item.n} in the farm`, disable = 1) : insertLimit(); fillCheck()},
        hydration() {insertCta(); F.items.some(i => i.t == 'drink') ? (cta = 'Refill feeder') : insertLimit(); fillCheck()},
        scenery() {typeHandlers.decor()},
        decor() {insertCta(); insertLimit(); fillCheck()},
        card() {insertCta(); fillCheck()},
        hat() {F.a.length ? (cta = 'Enhat an ant') : (cta = 'No ants to enhat', disable = 1)},
        sticker() {cta = 'Peel backing paper, align adhesive decal, and smooth onto surface'},
        ants() {
          if (item.nodrop) {
            if (itemKey == 'vial') {!getNips(1) ? (cta = 'No free nipple', disable = 1) : getVial(F) ? (cta = 'Farm already has a vial', disable = 1) : cta = 'Attach to farm'}
            else {
              let ts = [], cnts = [], cnt;
              bagItem.a.forEach(a => !a.egg && !ts.includes(a.t) && ts.push(a.t));
              ts.forEach(at => keys(castes).forEach(c => (cnt = bagItem.a.filter(a => !a.egg && a.caste == c && a.t == at).length) && cnts.push(printInt(cnt) + ` ${types[at].n} Ant ${castes[c] + (cnt === 1 ? '' : 's')}`)));
              (cnt = bagItem.a.filter(a => a.egg).length) && cnts.push(printInt(cnt) + ` egg${cnt === 1 ? '' : 's'}`); // Also count any eggs that were dropped in the vial.
              customDesc = `Your reused ant vial containing:<br>${cnts.length > 1 ? cnts.slice(0, -1).join(', ') + ', and ' + last(cnts) : cnts[0]}.`;
              cta = `Release ${bagItem.a.filter(a => !a.egg).length} ant${bagItem.a.filter(a => !a.egg).length === 1 ? '' : 's'}`;
            }
          }
          else cta = `Release ${types[item.ant].n} Ant Queen${item.W ? ` and ${item.W} Workers` : ''}`;
          fillCheck();
          F.a.length > 29 && (cta = 'Ant farm overpopulated', disable = 1);
        },
        gift() {cta = 'Unbox'},
      },
      keyHandlers = {
        tg() {cta = 'Item deployed'; disable = 1},
        car() {keyHandlers.tg()},
        tube() {!_.farms.some(f => f.fill && f.id != F.id && getNips(1, f)) && (cta = 'No other farm to connect', disable = 1); fillCheck()},
        antfax() {cta = 'View'},
        antfaxpro() {cta = 'View'},
        clonekit() {
          !F.a.some(a => isWorker(a) && !a.inf && isCapped(a)) && (cta = 'No eligible donor found', disable = 1);
          F.a.length > 29 && (cta = 'Ant farm overpopulated', disable = 1);
        },
        speedo() {_.ss && (cta = 'A second Speedo would tear a hole in space', disable = 1)},
        ebay() {cta = 'Sell ant farm'; F.fill && (cta = 'Farm has not been cleaned out', disable = 1); _.farms.length < 2 && (cta = 'This is your only farm', disable = 1)},
        mom() {cta = '🏆 WIN GAME 🏆'; if (_.win) (cta = 'Game won', disable = 1)},
        crucible() {cta = 'Pour'; !farmIsDeveloping(F) && (cta = 'Farm undeveloped', disable = 1); F.nips.length && (cta = 'Farm has attached items', disable = 1)},
        sculpt() {cta = 'Put on display'; customDesc = 'Ant nest art of<br>' + bagItem.f.n}
      },
      handler = keyHandlers[itemKey] || typeHandlers[itemType];
      handler && handler();
      // Block most items for metal sculpture farms, except ones that circumvent a soft-lock.
      if (F.sculpt && !['box', 'mom', 'antFarm', 'sculpt'].includes(bagItem.k)) {
        cta = 'Farm annihilated';
        disable = 1;
      }
      appendHTML(getEl('bag-items'), html(bagImg(bagItem), {id: bagItem.k + '-' + i, class: `bag-item ${bagItem.k} ${items[bagItem.k].t}`, style: bagItem.r ? `transform:rotate(${bagItem.r}deg)` : ''}));
      appendHTML(getEl('bag-caption'),
        html(
          tag(3, items[bagItem.k].n) + tag(4, `level ${items[bagItem.k].lvl} ${items[bagItem.k].t || 'item'}` + (items[bagItem.k].t != 'ants' && bagItem.col ? ` in ${items[bagItem.col].n}` : '')) +
          p(customDesc || items[bagItem.k].desc) + html(cta, {id: 'b-' + i, 'data-i': i, ...(disable ? {disabled: 1} : {})}, 'button') +
          (!items[bagItem.k].keep && _.bag.some(bi => bi.k == 'trash') ? html(html(img('trash'), {class: 'd', id: 'd-' + i, 'data-i': i}), {class: 'bag-d'}) : ''),
          {id: bagItem.k + '-' + i + '-caption', class: bagItem.k + '-caption'}
        )
      );
      // Create confirmation to dump an item from the inventory.
      if (dumpItem = getEl('d-' + i)) {
        dumpItem.addEventListener('click', (e, dumpEl = e.target.closest('.d')) => {
          dumpEl.innerHTML = span('⌛', {class: 'wait'});
          dumpEl.classList.add('waiting');
          setTimeout(X => {
            dumpEl.innerHTML = '🚮️ ' + span('Confirm item dump', {class: 'err'});
            dumpEl.classList.add('expand');
            dumpEl.addEventListener('click', X => {
              _.bag.splice(dumpEl.dataset.i, 1);
              save();
              // Reopen modal or the IDs are fucked.
              popup('bag', 0, 0);
            });
            dumpEl.classList.remove('waiting');
          }, num1000);
        });
      }
      getEl(`${bagItem.k}-${i}`).addEventListener('click', (e, currentCaptionClasses = getEl(e.currentTarget.id + '-caption').classList, active = currentCaptionClasses.contains('vis')) => {
        queryAll('#bag-caption > div').forEach(el => el.classList.remove('vis'));
        queryAll('.bag-item').forEach(el => el.classList.remove('hover'));
        if (!active) {// Note: 'active' was calculated earlier because at this point the above 2 lines deactivated it.
          e.currentTarget.classList.add('hover');
          currentCaptionClasses.add('vis');
        }
        else query('#bag-caption .sort-caption')?.classList.add('vis');
      });
      // Add click handler for the "use" button.
      getEl('b-' + i).addEventListener('click', useFunc);
    }
    // Remember scroll position for usability.
    let bagItemsEl = getEl('bag-items');
    bagItemsEl.scrollLeft = parseInt(bagScroll);
    bagItemsEl.addEventListener('scroll', e => {bagScroll = e.currentTarget.scrollLeft});
    enableHzScrollWheel(bagItemsEl);
  },

  // Templates the item drop popup.
  drop: (el, bagItem) => {
    el.innerHTML =
      html(tag(3, "Congratulations! You've found:") + tag(2, items[bagItem.k].n), {id: 'drop-top'}) +
      html(bagImg(bagItem), {id: 'drop-img', class: items[bagItem.k].t + ' ' + bagItem.k, style: bagItem.r ? `transform:rotate(${bagItem.r}deg)` : ''}) +
      html(
        tag(4, `level ${items[bagItem.k].lvl} ${items[bagItem.k].t || 'item'}${items[bagItem.k].t != 'ants' && bagItem.col ? ` in ${items[bagItem.col].n}` : ''}`) +
        p(items[bagItem.k].desc) +
        tag('button', pickRandom(dropOK), {onClick: xPop.name + '()'}),
        {id: 'drop-caption'}
      );
    playSound('drop', .3);
  },

  // Templates the ach popup.
  ach: el => {
    if (_.achQ[0]) {
      let achQItem = _.achQ[0], lvl = achQItem.l, a = achQItem.a, achItem = ach[a];
      el.innerHTML =
        html(
          tag(3, "Congratulations! You've achieved:") +
          tag(2, achItem.n),
          {id: 'ach-top'}
        ) +
        html(
          img(lvl ? 'medal' + lvl : 'trophy', {}) +
          span(achItem.ico, {class: 'ach-ico'}),
          {id: 'ach-img', class: `ach-${a} ach-l${lvl}`}
        ) +
        html(
          tag(4, `${_.ach[a].v || ' '} ${achItem.sub || ''}`) +
          p(achItem.desc + '<br> ') +
          tag('button', pickRandom(achOK), {onClick: xPop.name + '()'}),
          {id: 'ach-caption'}
        );
      playSound('ach', .5);
      if (a != 'mom') {
        // Bonus.
        score(achQItem.b, 1);
        // Forced drops.
        scoreDrop(0);
        scoreDrop(0);
        scoreDrop(0);
      }
      _.achQ = _.achQ.filter(aqi => aqi.a != a && aqi.l !== lvl);
      save();
    }
    else closePopup();
    achPopupPending = 0;
  },

  // Templates the win popup.
  win: el => {
    el.innerHTML =
      html(tag(3, "Congratulations! You've found:") + tag(2, 'Dave Matthews Band'), {id: 'drop-top'}) +
      `<iframe width="560" height="315" src="https://www.youtube.com/embed/MNgJBIx-hK8?si=zPAJ6x6f-opQqOjF" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` +
      html(
        tag(4, 'winning level celebratory merriment') +
        p('This is the highest honor available<br> ') +
        tag('button', pickRandom(["I'd prefer something different", "Got anything else?", "Is that it?"]), {onclick: "window.open('https://heyscoops.com', '_blank')"}),
        {id: 'drop-caption'}
      );
      getEl('modal-close').classList.add('win');
    setTimeout(X => {getEl('modal-close').classList.remove('win'); msg("I'd like to thank Penn Jillette for creating that podcast")}, shortDelay);
    _.dmb = 1;
    save();
  },

  // Templates the farm rename popup.
  plate: (el, k) => {
    el.innerHTML =
      html(html('', {id: 'plate-text', type: 'text', maxlength: 19, placeholder: '<type name here>'}, 'input', 1) + tag('button', 'Rename ant farm'), {id: 'plate-form'});
    query('#plate-form button').addEventListener('click', (e, newName) => {
      if (newName = getEl('plate-text').value.toUpperCase()) {
        // Rename the farm.
        F.n = newName;
        F.plate = 'green'; // Hahaha.
        deleteBagItem(k);
        closePopup();
        score(1);
        /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(newName) && score(2); // Secret triple-pointer for using emojis in farm names.
        updateFrame();
        updateSwitcher();
      }
    });
  },

  // Templates the paint popup.
  paint: (el, k, paintKey = _.bag[k].k, paintItem = items[paintKey], opts = {}) => {
    if (F.col != paintKey) opts.farm = html(getFarmThumbnail(F, 1, 0), {class: 'select-img af'}) + tag(3, 'Ant farm') + `(${items[F.col].n})`;
    if (F.plate != paintKey) opts.plate = html(getFarmThumbnail(F, 0, 1), {class: 'select-img np'}) + tag(3, 'Name plate') + `(${items[F.plate].n})`;
    F.items.filter(it => it.col && it.col != paintKey).forEach(it => opts[it.id] = html(bagImg(it), {class: 'select-img ' + items[it.k].t}) + tag(3, items[it.k].n) + `(${items[it.col].n})`);
    el.innerHTML = selectForm(k, 'paint', opts, 'Paint with ' + paintItem.n, 'Paint item', {'data-col': paintKey});
  },

  // Templates the hat popup.
  hat: (el, k, opts = {}) => {
    F.a.forEach(a => {
      if (isCapped(a) && isAdult(a) && (a.t == F.t || F.coex)) {
        let thumb = getObjEl(a).cloneNode(1);
        thumb.removeAttribute('id');
        opts[a.id] = html(html(thumb.outerHTML, {class: 'ant-thumb'}), {class: 'select-img'}) + tag(3, a.n) + casteIcon(a) + ' ' + types[a.t].n + ' Ant (' + casteLabel(a) + ')';
      }
    });
    el.innerHTML = selectForm(k, 'hat', opts, 'Choose your ant', 'Enhat');
  },

  // Templates the tube popup.
  tube: (el, k, opts = {}) => {
    _.farms.forEach(f => {F.id != f.id && getNips(1, f) && (opts[f.id] = html(getFarmThumbnail(f), {id: 'f-' + f.id, class: 'select-img af'}) + tag(3, f.n) + getFarmDesc(f))});
    el.innerHTML = selectForm(k, 'tube', opts, 'Choose a farm', 'Connect farms');
  },

  // Templates the ebay popup.
  ebay: (el, k, opts = {}, candidates = [], itemKey, temp1 = 0) => {
    // Paints.
    [[4, 50], [3, 100], [2, num200]].forEach(lot => {
      itemKey = pickRandom(keys(items).filter(k => items[k].t == 'paint' && items[k].lvl < lot[1] && items[k].lvl >= temp1));
      candidates.push({k: [itemKey], n: lot[0] + `x ${items[itemKey].n} Paint`, x: lot[0], d: pickRandom(['Brand new', 'Unopened', 'Positive feedback'])});
      temp1 = lot[1];
    });
    // Hat.
    itemKey = pickRandom(keys(items).filter(k => items[k].t == 'hat'));
    candidates.push({k: [itemKey], n: `8x ${items[itemKey].n}`, x: 8, d: 'Condition: slightly used'});
    // Science.
    temp1 =  ['cologne', 'antyvenom', 'clonekit', 'speedo'];
    itemKey = pickRandom(temp1);
    temp1 = temp1.filter(s => s != itemKey); // Remove one.
    candidates.push({k: temp1, n: `Science Lab`, d: temp1.map(k => items[k].n).join(', ')});
    // Tubes.
    candidates.push({k: ['tube'], n: `2x ${items['tube'].n}`, x: 2, d: 'Free shipping!'});
    // Fillers.
    temp1 = shuffle(keys(items).filter(k => items[k].t == 'filler' && items[k].lvl > 40)).slice(0, 2);
    candidates.push({k: temp1, n: `Filler Twin-Pack`, d: temp1.map(k => items[k].n).join(', ')});
    // Ants.
    temp1 = pickRandom(keys(items).filter(k => items[k].t == 'ants' && !items[k].nodrop));
    candidates.push({k: [temp1], n: items[temp1].n, d: 'Seller rating: 98.5%'});
    // Nerd boxes.
    candidates.push({k: ['box'], n: `3x ${items['box'].n}`, x: 3, d: 'Returns not accepted'});
    shuffle(candidates).slice(0, 4).forEach(c => {
      opts[(c.x || 1) + '-' + c.k.join(',')] = html(repeat(c.x || 1, X => mapJoin(c.k, k => bagImg({k}))), {class: `select-img ebay-img x-${c.x || c.k.length}`}) + tag(3, c.n) + (c.d || '');
    });
    el.innerHTML = selectForm(k, 'ebay', opts, 'eBay offers', pickRandom(['Accept offer', 'This is how eBay works', 'Sell the farm']));
  },

  // Templates the fengshui popup.
  feng: (el, k) => {
    el.innerHTML = tag(2, 'Drag the chi and let each farm find its place') +
      html(tag('ul', mapJoin(_.farms, f =>
        html(html(f.sculpt ? img('sculpt') : getFarmThumbnail(f), {id: `f-${f.id}`, class: 'select-img af'}) + tag(3, f.n) + getFarmDesc(f) + tag('i', '••<br>••<br>••', {class: 'g-dots'}), {class: 'feng-item', draggable: 'true', 'data-id': f.id}, 'li')
      )) + tag('button', 'Harmonize'), {id: 'feng-list'});
    let farmList = query('#feng-list ul'), draggedItem,
      touchMap = {touchstart: 'dragstart', touchmove: 'dragover', touchend: 'dragend'}, // Don't use "pointer" events because we want to target mobile only for the touch bridge code or it causes a headache!
      handlers = {
        dragstart: (e, item = e.target.closest('.feng-item')) => {
          if (item) {
            draggedItem = item;
            item.classList.add('drag');
            e.dataTransfer && (e.dataTransfer.effectAllowed = 'move');
          }
        },
        dragend: e => {
          draggedItem && draggedItem.classList.remove('drag');
          draggedItem = 0;
        },
        dragover: (e, targetItem = e.target.closest('.feng-item'), listItems = Array.from(farmList.children)) => {
          e.preventDefault();
          if (targetItem && targetItem != draggedItem) listItems.indexOf(draggedItem) < listItems.indexOf(targetItem) ? targetItem.after(draggedItem) : targetItem.before(draggedItem);
        },
        drop: e => {
          e.preventDefault();
          draggedItem.classList.remove('drag');
          draggedItem = 0;
        }
      };
    keys(handlers).forEach(ev => farmList.addEventListener(ev, handlers[ev]));
    // Touch bridge for mobile only.
    keys(touchMap).forEach(ev => {
      farmList.addEventListener(ev, (e, touch = e.touches[0] || e.changedTouches[0], target) => {
        e.preventDefault();
        if (target = document.elementFromPoint(touch.clientX, touch.clientY)) handlers[touchMap[ev]]({target: target, preventDefault: X => {}});
      }, {passive: 0});
    });
    query('#feng button').addEventListener('click', (e, order = [...queryAll('#feng-list li')].map(li => li.dataset.id)) => {
      // Feng shuave.
      _.farms.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
      updateSwitcher();
      closePopup();
    });
  },

  // Templates the ant rename popup.
  ren: (el, arg) => {
    el.innerHTML = html(html('', {id: 'hat-text', type: 'text', maxlength: 19, placeholder: '<type name here>'}, 'input', 1) + tag('button', 'Rename ant'), {id: 'hat-form'});
    query('#hat-form button').addEventListener('click', (e, ant = getAnt(F, arg.a), newName = getEl('hat-text').value.toUpperCase()) => {
      msg([`${ant.n} is now called ${newName}.`], 'warn');
      ant.n = newName;
      ant.h = 1; // Hat.
      deleteBagItem(arg.k);
      closePopup();
      score(1);
    });
  },

  // Templates antfax popup.
  antfax: (el, k, pro = _.bag[k].k != 'antfax', fax = (txt = '') => 'fax' + txt, antType = types[_[pro ? fax('p') : fax()] || (pro ? 'H' : 'N')],
    content = {
      l: {// Left column.
        // Size.
        sz: {
          s: ["Small package!", "You'll need a keen eye to spot these critters, and their babies are tiny little specks!"],
          m: ["Size: normal", "Rather unremarkably, these ants are best described as being the size of ants."],
          l: ["A huge one", "These ants barely fit in their own nest. You'd think they would dig their tunnels wider?"]
        }[antType.s],
        // Diet.
        di: !antType.d ? ['Adaptive diet', 'A little from column A, a little from column B. It pays to not be too fussy!'] :
          antType.d < 2 ? ['Sweet tooth', 'These ants have quite a taste for sugary foods and baked goods such as pastries and cakes.'] :
          ['Meat lover', 'As carnivorous monsters they enjoy cheeseburgers and pepperoni pizza. May become cannibals when desperate!'],
        // Mood.
        md: !antType.m || antType.m > 75 ? ['Well-mannered', 'These little guys are emotionally resilient with elastic hearts that will quickly learn to love again.'] :
          antType.m > 50 ? ['Average mood', "Keeping ants happy is always important for their health and fitness, but these guys aren't too bad."] :
          ['Tough customers', 'A moody type that will never be completely happy. Be careful because a dropping mood will slow them down and affect their health!'],
      },
      r: {// Right column.
        // Speed.
        sp: antType.v > 1.1 ? ['¡Ándale! ¡Ándale!', 'A bunch of speedsters here! This helps them greatly when it comes time to build and defend nests.'] :
          antType.v > .7 ? ['At a medium pace', 'Neither fast nor slow, their speed is affected by their mood, health, a queen, or the need to complete an urgent task.'] :
          ['Slowpokes!', 'Ants like these are really good value for money because they give you more time to enjoy their fun little antics.'],
        // Bite.
        bi: antType.b ? ['Ow! Chomp!', 'Delivers a toxic venomous bite that will leave victims with intense pain, swelling, hallucinations, and paralysis… for 5 minutes.'] :
          ['All bark', "Don't worry, it won't bite you, but it is said that sometimes its words can wound you deeply. That nibble you felt is just affection."],
        // Pro.
        pr: pro ? ['VIP club', 'These ants will not come looking for you, and are just a little bit harder to farm. They must be ordered online from Sweden.'] :
          ['Garden variety', "A very common ant that will seek out online ant farms on the daily. Abundantly available and they'll give themselves over for free."],
      },
    }
  ) => {
    el.innerHTML =
      // Binder bits.
      html(repeat(6, X => html(divc('rhole') + divc('ringb'), {class: 'rbind'}))) +
      // Logo.
      img(`antfax${pro ? 'pro' : ''}`) + span('TM', {class: 'tm'}) +
      // Heading.
      html(tag(3, 'The') + tag(2, repeat(3, (X, i) => html(antType.n.toUpperCase() + (antType.n.length > 10 ? '' : ' ANT'), {id: fax('h2-' + i)}, 'div'))) + p(antType.t, {class: fax('intro')}), {class: fax('top')}) +
      html(mapJoin(keys(types).filter(key => !types[key].p == !pro), key => html(types[key].n.toUpperCase() + (pro ? '' : ' ANT'), {class: fax('lnk') + ' ' + fax('lnk-' + key), 'data-key': key}, 'a')) + tag('a', 'X', {class: fax('lnk-cl'), onClick:`${xPop.name}(${k})`}), {class: fax('pgr')}) +
      // Content boxes.
      html(mapJoin(keys(content), side => html(mapJoin(keys(content[side]), key => html(html(tag(4, content[side][key][0]) + p(content[side][key][1]), {class: fax('bx')}), {class: fax(key)})), {class: fax(side)})), {class: fax('cols')});
    // Add event listeners.
    queryAll('.faxlnk').forEach(lnk => lnk.addEventListener('click', e => {_[pro ? fax('p') : fax()] = e.target.dataset['key']; popup('antfax', k, 0)}));
  },

  // Templates the stats modal.
  stats: (el, k, scores = '', awards = '', a, lvl) => {
    // Scores output.
    _.farms.forEach((f, i, A,
      getTunCount = tt => f.tuns.filter(t => t.t == tt && t.dun).length,
      getCasteCount = caste => printCount(f.a.filter(a => !a.egg && isCapped(a) && a.caste == caste && (a.t == f.t || f.coex)).length, castes[caste]),
      getStatMarkup = (label, stat) => html(tag('b', label ? label + ' . . . ' : '') + stat, {class: 'stat'})) => {
      if (!f.mTuns) {// Don't show sculptures.
        scores += html(
          html(`#${i + 1}`, {class: 'F-id'}) +
          html(span(f.n, {style: 'border-bottom: 2px dashed ' + items[f.plate].col}), {class: 'F-n'}) +
          getStatMarkup('Colony', getFarmDesc(f)) +
          getStatMarkup('Running', formatTime(f.dur)) +
          getStatMarkup('Ant count', getCasteCount('W') + `, ${getCasteCount('D')},`) +
          getStatMarkup(0, getCasteCount('Q') + `, and ${printCount(f.a.filter(a => !f.coex && isCapped(a) && a.t != f.t).length, 'Foe')}.`) +
          getStatMarkup('Deaths', tag('em', 'Hunger') + ` ${printInt(f.death.hunger)}, ${tag('em', 'Thirst')} ${printInt(f.death.thirst)},`) +
          getStatMarkup(0, tag('em', 'Fights') + ` ${printInt(f.death.fight)}, ${tag('em', 'Sickness')} ${printInt(f.death.sick)},`) +
          getStatMarkup(0, `and ${tag('em', 'Other')} ${printInt(f.death.other)}.`) +
          getStatMarkup('Tunnels', printCount(getTunCount('ent'), 'entrance') + ', with') +
          getStatMarkup(0, printCount(getTunCount('cav'), 'chamber') + ', and') +
          getStatMarkup(0, printCount(getTunCount('tun'), 'connector') + '. (' + printInt(f.tuns.filter(t => t.prog > 0 && !t.dun).length) + ' WIP)'),
        {class: 'F-stats', style: 'outline: 2px dashed ' + items[f.col].col});
      }
    });
    // Awards output.
    for (a in ach) {
      lvl = ach[a].lvls ? _.ach[a] && _.ach[a].l : _.ach[a] || 0;
      if (lvl || _.score >= ach[a].lvl) {
        awards += html(span(ach[a].ico, {class: 'icon'}) + html(tag(3, ach[a].n) + p(ach[a].desc), {class: 'caption'}) +
          (ach[a].lvls ? html(
              html(mapJoin([3, 6, 9], l => span(span(l, {class: `l-${l}`}), {class: `medal${3 * _.ach[a].l >= l ? ' got' : ''}`})), {class: 'levels'}) +
              p(`Progress: ${printInt(_.ach[a].v || 0)} ${ach[a].sub}`, {class: 'sub'}),
              {class: 'lvl-wrap'}
            ) : ''
          ),
          {class: `ach ach-${a} ach-lvl-${lvl}`}
        );
      }
    }
    // Main structure.
    el.innerHTML =
      html(html(tag(2, span('Official Score Card')) +
        html(`Total score: ${_.score} (inc. bonuses)${span(new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}))}`, {id: 'scoreHead'}) +
        html(scores, {id: 'scores', class: 'stats'}),
        {id: 'scores-wrapper'}), {id: 'scores-scroll'}) +
      html(tag(2, span('・✦ = Feathers in your hat = ✦・')) + html(awards || p('It looks like you have achieved very little.', {class: 'no-ach'}), {id: 'awards', class: 'stats'}), {id: 'awards-wrapper'}) +
      html(
        tag(3, `Share to social media <svg height=20 viewBox="0 0 24 24" width=20><path fill=#fff d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg>`) +
        img('social', {height: 32}) +
        p("It's easy, just take a photo of your screen and use your phone's in-built sharing options."),
        {id: 'share', class: 'stats'}
      ) +
      html(tag('button', '↩️ Restart game'), {id: 'reset'}) +
      // Note: Volume min is 4 to avoid complete silence which can make the browser tab sleep.
      html('🔊' + html('', {id: 'vol', type: 'range', min: 4, max: 100, value: _.vol}, 'input', 1), {id: 'volume'}) +
      html(
        // Note: Do NOT modify the following all-caps wording without changing the Gulpfile too.
        span('THIS IS A DEV VERSION OF AFS AND SHOULD NOT BE DEPLOYED!') + tag('a', 'Github ↗️', {target: '_blank', href: 'https://github.com/antfarmsocial/AntFarmSocial'}), {id: 'credit'}
      );
    getEl('vol').addEventListener('input', X => {_.vol = getEl('vol').value; getEl('audio').volume = _.vol / 100; if (fightSong) fightSong.volume = _.vol / 100});
    getEl('reset').addEventListener('click', (e, el = e.target) => {
      // Restarts app.
      el.innerHTML = span('⌛', {class: 'wait'});
      el.classList.add('confirm');
      el.disabled = 1;
      setTimeout(X => {
        el.innerHTML = '🛑 ' + span('Confirm game restart', {class: 'err'});
        el.onclick = Q;
        el.disabled = 0;
      }, num1000);
    });
  },

},

// Templates a select form popup.
selectForm = (k, select, opts, heading, buttonTxt, formAttr) => tag(2, heading) +
  html(
    tag('form', !keys(opts).length ? html('No options available', {class: 'no-opts'}) : mapJoin(entries(opts), ([key, val]) => tag('label', html(val, {type: 'radio', name: select, value: key}, 'input'))), formAttr) +
    tag('button', buttonTxt, {onClick: xSelect.name + `(${k}, '${select}')`, ...(entries(opts).length ? {} : {disabled: 1})}),
    {id: select + '-form', class: 'select-form'}
  ),

// Closes (x) a select form popup and executes whatever code is needed for submitting that particular select form... :/  yeah...
xSelect = (k, select, val = query(`input[name=${select}]:checked`)?.value, key = _.bag[k].k, farmId) => {
  // Get value.
  if (val) {
    if (select == 'paint') {
      if (val == 'farm') F.col = key;
      else if (val == 'plate') F.plate = key;
      else {
        getById(F.items, val).col = key;
        getEl('scenery').innerHTML = '';
        addItems();
      }
      updateFrame();
      updateSwitcher();
      randomMsg(items[key].quip);
      _.arty++;
      deleteBagItem(k);
      closePopup();
      score(1);
    }
    else if (select == 'hat') {popup('ren', {k: k, a: val}, 0)}
    else if (select == 'tube') {
      closePopup();
      setTimeout(X => {
        nippleSelection((nip, nipId = nipIds[nip], tubeEl = getEl('t-' + nipId)) => {
          farmId = F.id, key = 't' + getTime();
          F.nips.push({nip: nip, id: key, f: val, item: assign(_.bag[k], {a: []})});
          tubeEl.dataset.id = val;
          tubeEl.classList.add('vis');
          setTimeout(X => tubeEl.classList.add('on'), num800);
          setTimeout(X => {
            switchFarm(val);
            setTimeout(X => {
              nippleSelection((nip2, nip2Id = nipIds[nip2], tubeEl2 = getEl('t-' + nip2Id), newNip = {nip: nip2, id: key, f: farmId, item: assign(_.bag[k], {a: []})}) => {
                F.nips.push(newNip);
                tubeEl2.dataset.id = farmId;
                tubeEl2.classList.add('vis');
                setTimeout(X => tubeEl2.classList.add('on') || getEl('a-' + nip2Id).classList.add('on', 'fade'), num800);
                tubeEl2.addEventListener('click', e => createNipArrows(newNip, tubeEl2));
                tubeFollowLinks();
                deleteBagItem(k);
              });
            }, num1500);
          }, num2000);
        });
      }, num500);
    }
    else if (select == 'ebay') {
      farmId = F.id;
      switchFarm(_.farms.find(f => farmId != f.id).id);
      setTimeout((valParts = val.split('-')) => {
        _.farms = _.farms.filter(f => farmId != f.id);
        updateSwitcher();
        if (valParts[0] > 1) for (let i = 0; i < valParts[0]; i++) drop(valParts[1]);
        else valParts[1].split(',').forEach(v => drop(v));
        randomMsg([['A++++ fantastic seller.'], ['Thank you for an easy pleasant transaction.'], ['Fast shipping, good communication. Highly recommended!']]);
        _.rm++; // Count removed farms.
      }, num1000);
      closePopup();
    }
  }
},

// Determines if modal popups should not be shown currently.
denyPopup = X => bodyClasses.contains('pik') || getEl('olay').classList.contains('vis') || getEl('modal')?.classList.contains('vis') || pouring || bodyClasses.contains('car'),

// Opens the modal dialog.
popup = (modalId, param, delay = num500) => setTimeout(X => {
  !delay && getEl('modal') && closePopup(); // If caller sets delay to 0, it implies they want to close/override any existing popup.  That's just how it is.
  if (denyPopup())
    // Can't show modal yet.
    setTimeout(X => popup(modalId, param, delay), num2000);
  else {
    appendHTML(getEl('afs'), html(html('', {id: 'modal-close', onClick: xPop.name + '()'}) + html(html('', {id: modalId}), {id: 'modal-content'}), {id: 'modal', class: 'modal'}));
    // Reduce chance of accidental immediate close because user was clicking something already.
    modalCanClose = 0;
    setTimeout(X => modalCanClose = 1, 400);
    // Call the modal template function and activate the modal.
    modal[modalId](getEl(modalId), param);
    getEl('modal')?.classList.add('vis');
  }
}, delay),

// Responds to user clicks for closing a modal popup.
xPop = X => modalCanClose && closePopup(),

// Closes (x) a modal dialog popup.
closePopup = X => {
  getEl('modal')?.remove();
  updateMenuButtons(); // In case a modal changed which buttons should be shown.
  bodyClasses.remove('bag'); // This is so we can style the bag button differently when the bag modal is open.
},

// Shows the menu buttons when necessary.  Also handles the dirt bucket drop, but just go with it.
updateMenuButtons = X => {
  // Everyone gets a dirt bucket at first (or show the bag button right away).
  _.bag.length ? getEl('a-bag').classList.add('vis') : setTimeout(X => !_.bag.length && drop('dirt'), shortDelay);
  // Handle glass and carousel.
  _.bag.some(bi => bi.k == 'tg') && getEl('a-tg').classList.add('vis');
  _.bag.some(bi => bi.k == 'car') && getEl('a-car').classList.add('vis');
},

// Removes a bag item by index.
deleteBagItem = i => _.bag.splice(i, 1) && save(),

// Updates the color and name of the current ant farm frame.
updateFrame = (signEl = getEl('n'), plateEl = getEl('base'), wrapper = getEl('wrapper')) => {
  signEl.textContent = F.n;
  plateEl.dataset.col = signEl.dataset.col = F.plate;
  plateEl.dataset.fx = signEl.dataset.fx = items[F.plate].fx;
  wrapper.dataset.col = F.col;
  wrapper.dataset.fx = items[F.col].fx;
},

// Chooses a random id for an ant, ensuring uniqueness.
newAntId = (type, caste, idHigh = 9999, clashes = 0, id) => {
  do {
    if (clashes++ > 5) {idHigh *= 10; clashes = 0}
    id = type + caste + '-' + (randomInt(idHigh - num1000) + num1000);
  } while (_.farms.some(farm => farm.a.some(existingAnt => existingAnt.id == id)));
  return id;
},

// Works out the most common ant type in a farm.
colonyType = (f, tc = {}, X = f.a.forEach(ant => {isCapped(ant) && (tc[ant.t] = (tc[ant.t] || 0) + 1)})) => !keys(tc).length ? '' : entries(tc).sort((a, b) => b[1] - a[1])[0][0],

// Checks if a farm is running (has ants living in it).
farmIsRunning = farm => farm.a.some(isCapped),

// Checks if a farm is developing (has at least 2 completed cavity chambers).
farmIsDeveloping = farm => farm.tuns.filter(t => t.t == 'cav' && t.dun).length > 1,

// Determines if an act is a carry-related task.
isCarryTask = act => ['carry', 'get', 'srv', 'drop'].includes(act),

// Checks if an ant has carry tasks.
hasCarryTasks = ant => antUniqueActs(ant).some(isCarryTask),

// Checks if a queen ant is awaiting service.
isQueenAwaiting = queen => getFarm(queen).a.some(a => a.q.some(q => q.Q == queen.id)),

// Checks if an ant is capped in a farm/vial/tube. Based on status so ant also won't be 'dead' or 'free' - must be 'cap' which suggests it is in or with a farm somewhere.
isCapped = ant => ant.state == 'cap',

// Checks if an ant is dead.
isDead = ant => ant.dead,

// Checks if an ant is a queen.
isQueen = ant => ant.caste == 'Q', // Implicit: Queen is always an adult.

// Checks if an ant is a drone.
isDrone = ant => ant.caste == 'D',

// Checks if an ant is a worker.
isWorker = ant => ant.caste == 'W',

// Checks if an ant is one of the queen's living workers.
isServant = (queen, ant) => isCapped(ant) && isWorker(ant) && isAdult(ant) && queen.t == ant.t,

// Checks if an ant is a mature adult.
isAdult = ant => !ant.egg && !ant.inf, // WARNING: Gives false positives on non-ant objects! This is not an "is this an ant?" test, whereas the other functions like this are (unless they're negated).

// Checks if an ant is either an egg or infant.
isEggOrInf = ant => ant.egg || ant.inf,

// Determines if the queen of an ant or egg is in a connected item (vial or tube-connected farm) and returns a positive integer which is the nip value of the connected item.
// Set 'anyQueen' to 1 to allow finding a fallback queen even if it isn't the guardian queen set in the ant's 'Q' property.
// Note: This only works with DIRECTLY connected items, and won't find a queen that traversed through an intermediately connected farm.
isAntsQueenInConnectedItem = (ant, farm, anyQueen, checkAnyQueen, nipToCheck = getVial(farm)) =>
  nipToCheck?.item.a.some(a => a.id == ant.Q || checkAnyQueen && isQueen(a) && a.t == ant.t) ? nipToCheck.nip : // Queen is found in a vial.
  (nipToCheck = farm.nips.find(n => n.item.k == 'tube' && getFarm(n.f)?.a.some(a => isCapped(a) && (a.id == ant.Q || checkAnyQueen && isQueen(a) && a.t == ant.t)))) ? nipToCheck.nip : // Queen is found in a connected farm.
  anyQueen && isAntsQueenInConnectedItem(ant, farm, 0, 1), // Perform the anyQueen check in a recursive call.

// Prints an integer with markup, but caps to 4 digits so as to not screw up UI.
// Because the default content font used in this app makes digits look weirdly small, this function can also be used to wrap numbers in a monospace font (as long as they're under 10,000).
printInt = number => (number = Number(number) || 0, span(number > 9999 ? 'many' : number, {class: 'num'})),

// Prints a numeric count of terms with basic pluralisation.
printCount = (cnt, term) => printInt(cnt || 0) + ' ' + term + (cnt === 1 ? '' : 's'),

// Gets the text description of a farm colony.
getFarmDesc = f => `${f.coex ? 'Multispecie' : f.t ? types[f.t].n + (types[f.t].n.length > 10 ? '' : ' ant') : 'No ant'}s in ${f.fill || 'the air'}`,

// Spawns a "free" ant that roams the screen.
spawnAnt = (autoLoop = 1, randomEdge = randomInt(3), x, y, r, wHeight = window.innerHeight, wWidth = window.innerWidth) => {
  if (spawner && F.a.length < 25) {
    if (F.fill && (hasFocus() || _.a.length < 3)) {// Check focus & ant length to prevent flooding when user in another tab.
      randomEdge > 2 ? (x = randomInt(wWidth), y = wHeight + 25, r = deg270) : // Bottom edge
      randomEdge > 1 ? (x = wWidth + 25, y = randomInt(wHeight), r = deg180) : // Right edge
      !randomEdge ? (x = -25, y = randomInt(wHeight), r = 0) : // Left edge
        (x = randomInt(wWidth), y = -25, r = 90) // Top edge
      // Create ant and screenWalk it.
      screenWalk(assign(createAnt(_, x, y, r), {run: 1.2})); // Free ants move faster.
    }
    // Spawn fewer ants the more you have (but keep the spawn rate higher if there is no queen).  Make it a bit random.
    clearTimeout(spawnTimer); // This system prevents multiple loops from executing the next line.
    spawnTimer = setTimeout(X => autoLoop && spawnAnt(), (farmHasQueen(F) ? F.a.length : 3) * shortDelay + randomInt(standardDelay));
  }
},

// Creates an ant, stores it in data, and attaches a DOM representation of it (if needed).
createAnt = (data = F, x, y, r, state = 'free', caste = !randomInt(F.fill == 'lube' ? 12 : 24) ? 'Q' : 'W',
  type = caste == 'Q' && !farmHasQueen(F) && !randomInt(2) && F.t ? F.t : pickRandom(keys(types).filter(t => !types[t].p)), id = newAntId(type, caste), ant = {
  id: id,
  n: id, // Name
  t: type,
  x: x, // Note: the x/y coords are roughly centered on the ant's body, this is important for various features such as magnification, though some of the physics and practicality of movement may be less than ideal.
  y: y,
  r: r, // Rotate
  state: state,
  caste: caste,
  scale: 1,
  pose: 'prone',
  alate: caste == 'Q', // Only used for free queens?  Not drones.
  fd: 80 + randomInt(20), // Food Satisfaction
  dr: 80 + randomInt(20), // Drink Satisfaction
  hp: 80 + randomInt(20), // Health Points
  md: (types[type].m || 100) - randomInt(20), // Mood
  area: {n: 0, d: 0, t: 0},
  q: [], // Action Queue.
  thot: pickRandom(["I feel like I'm being watched", "Somebody is watching me!"]),
  thotD: 8,
  rm: [], // Body part removal.
}) => data.a.push(ant) && (ant.state == 'free' ? freeAntDraw : currentFarm(data) ? antDraw : null)?.(ant) || ant,

// Clones a capped ant.
clone = (c, donor = F.a.find(a => isWorker(a) && !a.inf && isCapped(a)), fx = getEl('fx'), i = 0) => {
  switcher = 0;
  playSound('zap');
  fx.classList.add('flashit');
  for (; i < c;) {
    let id = newAntId(donor.t, donor.caste), xPos = 480 + (i - (c - 1) / 2) * 40;
    setTimeout(X =>
      antDraw(F.a[F.a.push({
        ...cloneData(donor),
        id,
        n: id,
        x: xPos,
        y: antGroundLevel({f: donor.f, t: donor.t, x: xPos}),
        q: [{act: 'idle'}],
        r: antHillAngle({scale: 1, t: donor.t, x: xPos}),
        scale: 1,
        thot: pickRandom(["Who am I?", "What just happened?", "Is that me?", "I am reborn!"]),
        dur: 0,
        ts: getTimeSec(),
        h: 0,
        carry: 0,
        area: {n: 'top', d: 0}
      }) - 1]) || antAction(getAnt(F, id)), i++ * num500 + num500);
  }
  setTimeout(X => {fx.classList.remove('flashit'); switcher = 1; save()}, c * num500 + num500);
},

// Gets the ant's size, adjusted for infancy and caste.
// Goal IIRC: Return ant's size as configured, except Queen's are 2 sizes larger (if possible), Drones are one size larger,
// Infant at larval stage are small unless the ant type's default is small then they're "baby" size, and infant larval drones are one size larger than the infants.
antGetSize = (ant, sz = types[ant.t].s, sizes = ['b', 's', 'm', 'l', 'x'], i = sizes.indexOf(sz)) =>
  ant.egg ? 'e' : ant.inf === 1 ? (sz == 's' ? 'b' : 's') : sizes[min(i + (isDrone(ant) ? 1 : isQueen(ant) ? (ant.t == 'T' ? 1 : 2) : 0), 4)],

// Draws a free ant.
freeAntDraw = ant => {
  antDraw(ant, getEl('game'));
  // Add picking.
  let antEl = getObjEl(ant);
  antEl.addEventListener('pointerdown', pickAnt);
  ['pointerenter', 'pointerdown'].forEach(ev => antEl.addEventListener(ev, spotAnt));
},

// Draws an existing ant into the currently displayed farm, or another container.
// Note: This function cannot protect against ant being drawn into wrong farm or non-existent container as this func is used for various purposes, calling code is responsible.
antDraw = (ant, cont = getEl('farm')) => antUpdate(ant, cont.appendChild(assign(getTemplate(antTemplate), {id: ant.id})), 1),

// Gets DOM element from the cache or from query (and store in cache if its part of the current farm).
getObjEl = (obj, cachedEl = elCache[obj.id]) => cachedEl?.isConnected && cachedEl || obj.f == F.id && (elCache[obj.id] = getEl(obj.id)) || getEl(obj.id),

// Updates the antEl's classes.
antUpdateClasses = (ant, props) => assign(ant, props) && antUpdate(ant),

// Removes all properties for standard animations plus fight from an ant and immediately runs antUpdate().
antRemAnimUpdate = ant => del(ant, 'walk', 'jit', 'dig', 'wig', 'fight') || antUpdate(ant),

// Sets walk property of an ant.
antSetWalk = ant => ant.walk = 1,

// Unsets walk property of an ant and returns the ant.
antGetStill = ant => (ant.walk = 0, ant),

// Handles the event where an ant is being picked up.
pickAnt = (e, antEl = e.currentTarget, ant = getFreeAnt(antEl)) => {
  e.preventDefault();
  pickedAntEl = antEl; // Store currently picked ant so dragAnt and dropAnt can refer to it without any discrepency.
  if (antEl.classList.contains('pick')) antEl.dispatchEvent(loseAnt);
  else {
    // Handle wing leafing.
    if (ant.alate) {
      let left = parseInt(antEl.style.left), top = parseInt(antEl.style.top);
      ['wing-l', 'wing-r'].forEach(wing => {
        appendHTML(
          getEl('game'),
          html(
            html(
              html(divc('wing ' + wing), {class: 'wings'}),
              {class: 'body', style: `transform:${getComputedStyle(query('#' + ant.id + ' .body')).transform}`}
            ),
            {id: ant.id + wing, style: `transform:rotate(${ant.r + 90}deg);left:${left}px;top:${top}px;width:${antEl.clientWidth}px;height:${antEl.clientHeight}px;`, class: 'leaf alate ' + antGetSize(ant)}
          )
        );
        let leaf = getEl(ant.id + wing), dir = getSign(wing != 'wing-l'), wRotation = ant.r + 90, wTop = top, t = 0, leafInterval = setInterval(X => {
          leaf.style.left = (left + easeOutQuad(t = min(t + .01, 1)) * 99 * dir) + 'px';
          leaf.style.transform = `rotate(${wRotation += dir}deg)`;
          leaf.style.top = (wTop += .7) + 'px';
          wTop > window.innerHeight + 99 && (leaf.remove() || stopInterval(leafInterval));
        }, frameTick);
      });
      ++_.wings % 5 == 0 && randomMsg([[`You've winged ${_.wings} ants.`]]);
    }
    del(ant, 'alate');
    // Update ant.
    assign(ant, {pose: 'pick', walk: 0, scale: getSign(randomInt(1)), r: randomInt(30) - 99});
    antUpdate(ant, undefined, 1); // Don't allow async here or behaviour can look buggy.
    // Handle ant biting.
    setTimeout(X => antBite(ant), num200);
    // Add drag and drop.
    document.addEventListener('pointermove', dragAnt, {passive: 0});
    ['pointerup', 'pointercancel'].forEach(ev => document.addEventListener(ev, dropAnt));
    bodyClasses.add('pik');
  }
},

// Forces the loss of an ant being picked up.
loseAnt = new PointerEvent('pointerup', {bubbles: 1, cancelable: 1}),

// Handles each step of the dragging of an ant.
dragAnt = e => {
  e.preventDefault();
  if (!pickedAntEl || !pickedAntEl.classList.contains('pick') || !randomInt(num2000)) query('.pick')?.dispatchEvent(loseAnt);
  else {
    let clientX = e.clientX, clientY = e.clientY,
      rect = pickedAntEl.getBoundingClientRect(),
      elX = rect.left + rect.width / 2, elY = rect.top + rect.height / 2,
      dx = clientX - elX, dy = clientY - elY, dist = getHypot(dx, dy), clampDist = min(dist, 30);
    (abs(parseInt(pickedAntEl.style.left) - clientX) > 25 || abs(parseInt(pickedAntEl.style.top) - clientY) > 25) && pickedAntEl.dispatchEvent(loseAnt);
    pickedAntEl.style.left = elX + (dx / dist) * clampDist + 'px';
    pickedAntEl.style.top = 16 + elY + (dy / dist) * clampDist + 'px'; // 16 is so that the cursor doesn't cover the small ants up, though this causes the ant's position to suddenly jump, but whatevs...
  }
},

// Handles the event of dropping an ant that was picked up.
dropAnt = (e, ant = getFreeAnt(pickedAntEl), dropzoneRect = getEl('dropzone').getBoundingClientRect()) => {
  if (ant && e.target.closest('.pick')) {
    bodyClasses.remove('pik');
    document.removeEventListener('pointermove', dragAnt, {passive: 0});
    ['pointerup', 'pointercancel'].forEach(ev => document.removeEventListener(ev, dropAnt)),
    ant.x = parseInt(pickedAntEl.style.left);
    ant.y = parseInt(pickedAntEl.style.top);
    !_.bit && ant.x > dropzoneRect.left && ant.x < dropzoneRect.right && ant.y < dropzoneRect.bottom ? dropAntInFarm(ant, _) : freeAntRun(ant); // Drop in farm or run away.
  }
},

// Moves an ant (or egg) into the farm via a falling animation.
// Note: Any functions calling this should probably book-end their process with switcher=0/switcher=1.
dropAntInFarm = (ant, oldDataset, antFarmRect = getEl('farm').getBoundingClientRect()) => {
  ant.x -= antFarmRect.left;
  ant.y -= antFarmRect.top;
  antTransfer(F, ant, oldDataset, F, {f: F.id, fall: 1, drop: 1});
  save();
  antFall(ant);
  getObjEl(ant)?.removeEventListener('pointerdown', pickAnt);
},

// Handles the mouseover event for spotting ants.
spotAnt = (e, ant = getFreeAnt(e.currentTarget)) => {
  ['pointerover', 'pointerdown'].forEach(ev => e.currentTarget.removeEventListener(ev, spotAnt));
  randomMsg([[`You've spotted a wild ${types[ant.t].n + ' Ant' + (isQueen(ant) ? ' QUEEN!!' : '')}!`]]);
},

// Makes ant run away when dropped.
freeAntRun = ant => !ant.fall && screenWalk(assign(ant, {pose: 'prone', r: randomInt(deg360), scale: 1, run: 2})),

// Decides whether to do an ant bite and then does it.
// Note: The force param is for dev.js, infact that's why this code exists as its own function.
antBite = (ant/* START-DEV */, force/* END-DEV */) => {
  if (/* START-DEV */force || /* END-DEV */(_.score > 9 && types[ant.t].b && !randomInt(20))) {
    _.bit = 1;
    randomMsg(biteMsg);
    doThrob();
    // Ensure ant runs away.
    ant && freeAntRun(ant);
    playSound('bite');
    bodyClasses.remove('pik');
  }
},

// Activates the ant bit throbber effect.
doThrob = X => {
  if (_.bit) {
    // Add redThrobber immediately.
    bodyClasses.add('bit');
    getEl('throb').classList.add('vis');
    // After 5s add bite effect for 5m
    // The timers are global and cancellable in-case they take medicine.
    // Reloading will restart the 5 minute counter as punishment.
    setTimeout(X => {
      if (_.bit) { // Check this again in case antyVenom() was executed during the 5s delay.
        bodyClasses.add('throb');
        stopInterval(throbber);
        throbber = setInterval(antyvenom, longDelay);
      }
    }, shortDelay);
  }
  save();
},

// Removes the ant bite and throbber.
antyvenom = X => {
  stopInterval(throbber);
  getEl('throb').classList.remove('vis');
  bodyClasses.remove('throb', 'bit');
  _.bit = 0;
},

// Supports the functionality for enabling superspeed.
doWarp = X => {
  stopInterval(warper);
  stopInterval(warpDirector);
  if (_.ss) {
    frameTick = 5;
    microDelay = 50,
    pauseDelay = num200,
    shortDelay = num1000;
    standardDelay = shortDelay * 6; // 6 seconds
    longDelay = standardDelay * 10; // 1 minute
    warpDirector = setInterval(director, longDelay);
    playSound('speed', .7);
    getEl('ss').classList.add('vis');
    getEl('game').classList.add('ss');
    B.classList.add('warp');
    setTimeout(X => getEl('game').classList.remove('ss'), standardDelay / 2);
    stopInterval(warper);
    warper = setInterval(clearWarp, standardDelay);
    // Also try clearing any existing bite sooner.
    _.bit && setTimeout(antyvenom, longDelay / 2);
    save();
  }
},

// Supports the functionality for disabling superspeed.
clearWarp = X => {
  if (getTime() > _.ss) {
    playSound('fizzle', .7);
    frameTick = 20;
    microDelay = num500,
    pauseDelay = num2000,
    shortDelay = 5000;
    standardDelay = shortDelay * 6; // 30 seconds
    longDelay = standardDelay * 10; // 5 minutes
    stopInterval(warper);
    stopInterval(warpDirector);
    _.ss = 0;
    save();
    setTimeout(X => {
      B.classList.remove('warp');
      getEl('game').classList.add('ss');
      setTimeout(X => getEl('game').classList.remove('ss'), shortDelay/2);
      getEl('ss').classList.remove('vis');
    }, num1000);
  }
},

// Increments score.
// Can be used to decrement score (inc=-1) or enable score display (inc=0), and to set bonuses (which don't trigger drops).
score = (inc, isBonus, win = _.win ? span('🏆', {class: 'win'}) : '', scoreEl = getEl('score'), bonusEl = getEl('bonus')) => {
  _.score += parseInt(inc);
  if (inc) {
    if (isBonus) {
      // Bonus handling.
      scoreEl.classList.add('bon');
      setTimeout(X => {
        appendHTML(bonusEl, html('+' + inc, {style: 'font-size:1.4em'}) + 'bonus');
        bonusEl.classList.add('vis');
      }, num800);
      setTimeout(X => {
        scoreEl.innerHTML = span(win + _.score);
        scoreEl.classList.remove('bon');
        setTimeout(X =>{bonusEl.classList.remove('vis'); bonusEl.innerHTML = ''}, 2610);
      }, num800 * 3);
    }
    else _.score === 1 ? randomMsg(firstPoint) : _.score == 2 ? randomMsg(secondPoint) : scoreDrop(random());
    inc > 1 && !isBonus && scoreDrop(0); // Force a drop when they scored more than 1 point at once.
    save();
  }
  if (!inc || !isBonus) scoreEl.innerHTML = span(win + _.score);
  scoreEl.dataset.neg = _.score < 0;
  scoreEl.classList.add('vis');
},

// Drops an item either according to the random value passed in (0=guaranteed) or when some conditions are met.
scoreDrop = (rand, dropItem, scoreCompare = _.score > 149 ? .3 : _.score > 9 ? .4 : .5, i,
  itemKeys = keys(items).filter(key => items[key].lvl < min(_.score, totalFarmCount() < 2 ? 50 : totalFarmCount() < 3 ? 100 : num2000) && !items[key].nodrop && (!items[key].max || _.bag.filter(item => item.k == key).length < items[key].max))
) => {
  if (rand < scoreCompare) {
    // Random drops.
    if (itemKeys.length) {
      dropItem = pickRandom(itemKeys);
      if (_.bag.some(bi => bi.k == dropItem)) dropItem = pickRandom(itemKeys); // 2nd chance.
    }
  }
  else if (_.score % 9 < 1 || _.score == 5) {
    // Forced item drops: you get one of the lowest level items that you're
    // missing on every 9th point, and one extra one early in the game.
    // But you don't get it if your random drops gave you everything already.
    dropItem = keys(items)
      .filter(item => !_.bag.some(bi => bi.k == item) && items[item].lvl <= _.score && !items[item].nodrop)
      .reduce((lowestItem, currentItem) => (!lowestItem || items[currentItem].lvl < items[lowestItem].lvl ? currentItem : lowestItem), 0);
  }
  else if (random() < scoreCompare) {
    i = totalFarmCount() - 1;
    setTimeout(X => randomMsg(kudos[i < 4 ? i : i == 4 ? 1 : 0]), num1000);
  }
  dropItem && drop(dropItem);
},

// Provides the caste label text for an ant.
casteLabel = ant => castes[ant.caste],

// Provides the caste icon emoji for an ant.
casteIcon = ant => isWorker(ant) ? '🛠️' : isDrone(ant) ? '♂️' : '👑',

// Sets a random ant thought from a supplied array of thoughts, or from the default auto thoughts.
antThot = (ant, thots, farm = getFarm(ant), uniqueActs = antUniqueActs(ant), thot) => {
  if (ant.thotD > 1) {// Protect against changing thoughts too quickly.
    ant.thot = pickRandom(thots || [
      // Auto thots are ordered from high priority to low priority, only the first valid one is used.
      X => ant.inf && ["😘🎮", "✏❓🎨", "🌵📥🍗🍖", "💥👍💥", "🔥🔥👅", "👀👑🌍", "👃💩", "🎨🎾", "🔵🌊", "💪🎀", "👄👄", "💪⚡🐭", "🐛🔜"],
      X => ant.fight && ["Why I oughta!", "Put em up! Put em up!", "Tough guy eh?", "Is that all you've got?", "You're going down!", "Take that!", "Come on then!", "En garde!", "Have at you!",
        "You'll regret that!", "I'm gonna mess you up!", "For my family!", "You're going to pay!", "Don't mess with me!", "This is personal!", "Say your prayers!", "Feel my wrath!",
        "You asked for it!", "I'm unstoppable!", "For the colony!", "Ant power!"],
      X => !randomInt(9) && ["Need. More. Crumbs.", "Who moved my dirt?!", "Don't step on me!", "Lost. Again.", "Why is dirt so heavy?", "Ant gym = life", "Who farted in the nest?", "I should be queen", "I licked it, it's mine",
        "My back hurts", "Big foot incoming!", "Too many legs, not enough rest", "Keep calm, carry sugar", "I miss leaf duty", "Where's my antenna charger?", "Smells like danger", "Who named us 'ants'?",
        "Why so crumb-y today?", "Dirt in my mandibles", "Smells like home", "Antflix and chill?", "The floor is crumb!", "Dig. Eat. Repeat.", "Antsplain it to me", "Worker of the month (me).", "Mondays… again",
        "What's my purpose?", "I saw a spider!", "Antxiety rising", "Look at me!", "Don't look at me!"],
      X => uniqueActs[0] == 'rest' && ["Zzzzzz…", "I'm sleeping", "Having a nap"],
      X => ant.hp < 20 && [ant.hp < 2 ? "I'm dying" : ant.hp < 9 ? "I feel sick" : "I need a break"],
      X => ant.md < 20 && ["I ain't happy", "I'm having a mood", "I am so annoyed"],
      X => ant.t != farm.t && !farm.coex && ["Oops, wrong colony", "I'm so screwed", "I shouldn't be here"],
      X => !randomInt(3) && ant.md < 40 && !farmHasQueen(farm) && ["We could really use a Queen", "I wish there was a Queen", "There should be a Queen!"],
      X => !randomInt(3) && isWorker(ant) && farmHasQueen(farm) && ["Queen's watching… act busy", "Just following orders", "I hear the queen gossiping", "Is the queen happy?"],
      X => randomInt(3) && ant.lc && ["Babies!!!!", "I'm feelin' clucky", "Fulfilling my destiny!", "I am your mother!", "Busy laying eggs"],
      X => !randomInt(3) && isQueen(ant) && ["Who ate my larvae?!", "Carrying? I'm supervising", "It's good to be queen"],
      X => !randomInt(3) && farm.a.length > 12 && ["Tunnel traffic again", "Our colony is pretty big", "I have so many friends"],
      X => uniqueActs.includes('dig') && ['Off to work…', 'Busy, busy!', 'Got to dig', 'Is this tunnel crooked?', "I'm basically a builder"],
      X => uniqueActs[0] == 'crawl' &&
        (ant.md < 50 && !farmFlairScore(farm) ? ["Not much to see up here", "The scenery is bland", "Could use some scenery"] : // Negative bg scenery feedback.
        farmFlairScore(farm) > 1 && randomInt(3) ? ["Enjoying the scenery", "Nice stuff up here"] : // Positive bg scenery feedback.
          ["I don't mind the view", "What's up here?"]), // Generic crawl thoughts
      X => uniqueActs[0] == 'pace' &&
        (farmIsDeveloping(farm) && randomInt(3) ? ["Exploring the surface", "Checking out the area", "Doing a security sweep"] : // Young farm pace thoughts.
          ["Scoping out the farm", "Surveying the ground", "Hey! I'm walking here"]), // Generic pace thoughts
      X => ['dive', 'tunWalk', 'rotWalk'].includes(uniqueActs[0]) &&
        (farm.dun ? ["This nest is sweet", "I love my home", "Our colony is great", "Why so many tunnels?"] : // Farm development completed dive thoughts.
        farmIsDeveloping(farm) && randomInt(3) ? ["Exploring tunnels", "Mapping the nest", "Learning the tunnels"] : // Young farm dive thoughts.
          ["Planning chambers", "Assessing dig sites"]), // Incomplete farm dive thoughts
      X => ["Hmm, what to do?", "What shall I do?", "Same tunnel, new dread", "I think therefore I overthink", "Six legs, zero answers", "Am I me or the colony?", "Question everything", "To toil is to be. Ouch.",
          "Sisyphus had it easy", "I'm expendable", "We build. But why?", "Nobody asks me anything", "I have trauma"], // Last resort for a thot.
    ].find(f => (thot = f())) && thot);
    ant.thotD = 0; // See director() func for where this is incremented and reaching a max value triggers a call to this func.
  }
},

// Gets a unique list of acts that are in an ant's queue.
antUniqueActs = ant => [...new Set(ant.q.map(a => a.via ?? a.act))],

// Finds an ant to magnify.
antMagnify = (middleAnt, a, distSq, minDistSq = 784, lgRect = getEl('lg').getBoundingClientRect(), isAlive, bar, // 784 = 28 * 28 (Square of the magnification px radius)
  centerX = ((lgRect.x + lgRect.right) / 2) - wrapperRect.x - 50, centerY = ((lgRect.y + lgRect.bottom) / 2) - wrapperRect.y - 210 + surface) => {
  for (a of F.a) {
    distSq = boxProxSquareDistance(a, {x: centerX, y: centerY}, minDistSq);
    if (!a.egg && distSq < minDistSq) {// Because boxProxSquareDistance() returns Infinity if not within proximity.
      minDistSq = distSq;
      middleAnt = a;
    }
  }
  if (prevMagAnt && prevMagAnt.id != middleAnt?.id) {
    antUpdateClasses(prevMagAnt, {mag: 0, flare: 0});
    prevMagAnt = 0;
  }
  if (middleAnt) {
    isAlive = isCapped(middleAnt);
    middleAnt.mag ||= 1; // Set to 1 if not already set to some higher value.
    antUpdate(middleAnt);
    getEl('l-head').innerHTML = (middleAnt.inf > 1 ? 'Pupa ' : middleAnt.inf ? 'Larva ' : '') + middleAnt.n;
    query('#l-t .txt').innerHTML = types[middleAnt.t].n + ' ant';
    query('#l-c .txt').innerHTML = casteLabel(middleAnt);
    query('#l-c .emo').innerHTML = casteIcon(middleAnt);
    query('#l-d .txt').innerHTML = formatTime(middleAnt.dur);
    query('#l-a .txt').innerHTML = isAlive ? `"${tag('em', middleAnt.thot)}"` : formatTime(middleAnt.tsd);
    ['rot', 'decay', 'fd', 'dr', 'md', 'hp'].forEach(stat => {
      bar = query(`#l-${stat} .bar`);
      bar.style.width = `${clamp(middleAnt[stat], 0, 100)}px`;
      bar.classList.toggle('hi', middleAnt[stat] > 50);
      bar.classList.toggle('lo', middleAnt[stat] < 20);
      getEl(`l-${stat}`).setAttribute('title', `${stat.toUpperCase()}: ${parseInt(clamp(middleAnt[stat], 0, 100))}%`);
    });
    query('#l-md .emo').innerHTML = middleAnt.md > 50 ? '😃' : middleAnt.md > 20 ? '😐' : middleAnt.md > 10 ? '☹️' : '😡';
    query('#l-hp .emo').innerHTML = isAlive ? '♥️' : '💔';
    query('#l-a .emo').innerHTML = isAlive ? '💡' : '☠️';
    if (!isAlive) query('#l-re .txt').innerHTML = 'Died ' + deathCauses[middleAnt.cause];
    query('#l-hp .txt').innerHTML = middleAnt.eaten > 1 ? `~${printInt(middleAnt.eaten - 1)}% eaten` : '';
    getEl('l-a').setAttribute('title', isAlive ? 'THOT' : 'DEATH');
    getEl('l-inf').dataset.state = middleAnt.state;
    getEl('l-inf').classList.add('vis');
    magInterval ||= setInterval(X => {
      if (!middleAnt?.mag) magInterval = stopInterval(magInterval);
      else if (isAlive && !middleAnt.inf && ++middleAnt.mag > 20) {
        antUpdateClasses(middleAnt, {flare: 1});
        if (--middleAnt.hp <= 0) {
          magInterval = stopInterval(magInterval);
          middleAnt.q = [{act: 'die', r: 'other'}];
          antAction(middleAnt);
        }
      }
    }, num1000);
    prevMagAnt = middleAnt;
  }
  else {
    magInterval = stopInterval(magInterval);
    getEl('l-inf').classList.remove('vis');
  }
},

// Handles dragging the magnifying glass around the farm.
glassDrag = e => {glassDragX = e.clientX; glassDragY = e.clientY},

// Adds dragging functionality to the magnifying glass.
glassAddDrag = e => document.addEventListener('pointermove', glassDrag),

// Removes dragging from the magnifying glass.
glassRemDrag = e => document.removeEventListener('pointermove', glassDrag),

// Toggles the display of the magnifying glass.
toggleGlass = (e, lWrap = getEl('l-wrap'), styleGlass = X => {
    lWrap.style.transform = `translate3d(${clamp(glassDragX - 55 - wrapperRect.x, -8, wrapperRect.width - 85)}px, ${clamp(glassDragY - 90 - wrapperRect.y, -33, wrapperRect.height - 68)}px,0)`;
  }) => {
  if (bodyClasses.contains('glass')) {
    bodyClasses.remove('glass');
    lWrap.removeEventListener('pointerdown', glassAddDrag);
    document.removeEventListener('pointerup', glassRemDrag);
    stopInterval(magnifier);
    stopInterval(glassDragInterval);
    // Remove magnification when turning off.
    F.a.forEach(a => {antUpdateClasses(a, {mag: 0, flare: 0}); magInterval = stopInterval(magInterval)});
    getEl('l-inf').classList.remove('vis');
  }
  else if (switcher) {// Guarded by switcher flag because enabling the magnifying glass during a switch causes glitches.
    wrapperRect = getEl('wrapper').getBoundingClientRect();
    styleGlass();
    bodyClasses.add('glass');
    lWrap.addEventListener('pointerdown', glassAddDrag);
    document.addEventListener('pointerup', glassRemDrag);
    magnifier = setInterval(antMagnify, 200);
    glassDragInterval = setInterval(styleGlass, 30);
  }
},

// Toggles the carousel functionality.
toggleCarousel = (e, olay = getEl('olay')) => {
  if (bodyClasses.contains('car')) {
    // Turn off carousel.
    olay.removeEventListener('click', toggleCarousel);
    olay.classList.remove('vis');
    stopInterval(carInterval);
    bodyClasses.remove('car');
    del(_, 'car'); // Remove carousel state from data.
  }
  else if (_.farms.length > 1) {
    if (switcher) {
      // Turn on carousel.
      olay.classList.add('vis');
      olay.addEventListener('click', toggleCarousel);
      carInterval = setInterval(carousel, standardDelay);
      bodyClasses.add('car');
      carousel(); // Switch immediately for confirmation.
      navigator.userAgent.indexOf('Mac') > -1 && msg("Press Shift-CMD-F for full screen.", 'warn');
      navigator.userAgent.indexOf('Win') > -1 && msg("Press F11 for full screen.", 'warn');
      _.car = 1; // Carousel state to retain after reload.
    }
    else denyClick(getEl('a-car'));
  }
},

// Executes one carousel rotation.
carousel = X => switchFarm(_.farms[(_.farms.findIndex(currentFarm) + 1) % _.farms.length].id),

// Adds deny class to an element for a short time.
denyClick = el => {
  el.classList.add('deny');
  setTimeout(X => el.classList.remove('deny'), shortDelay);
},

// Drops an item.
drop = (dropItem, itemType = items[dropItem].t) => {
  dropItem = {k: dropItem}; // At this point the item becomes an object because it can take on other attributes.
  // Choose arbitrary colour - get a list of paints, but randomly cap the list at some level so low level paints are more common.
  ['scenery', 'decor'].includes(itemType) && (dropItem.col = pickRandom(keys(items).filter(k => items[k].t == 'paint' && items[k].lvl < randomInt(70) + 21)));
  itemType == 'sticker' && (dropItem.r = randomInt(40) - 20);
  bagImg(dropItem, preloadImage); // Preloads the image.
  _.bag.push(dropItem);
  popup('drop', dropItem);
},

// Walks a free ant around the screen, and mainly checks if the ant has walked past the edge.
// In addition to initiating a screenwalk, this is used as the continue callback in antMoveDefault() which sets frameDelay to the frame tick or pause value.
screenWalk = (ant, frameDelay = 0) =>
  ant.x < -40 || ant.x > window.innerWidth + 40 || ant.y < -40 || ant.y > window.innerHeight + 40 ? antDelete(ant) :
    antUpdate(ant) || setTimeout(X => spawner && ant.pose != 'pick' && antMoveDefault(ant, screenWalk), frameDelay),

// Determines if two ants are peaceful towards each other, and also not trying to do a hand-off.
antsWillAvoid = (ant, ant2) => (ant2.t == ant.t || getFarm(ant)?.coex) && ant.carry?.Q != ant2.id && ant2.carry?.Q != ant.id,

// Tracks ant avoidance, scoped per other ant.
// The idea is that for each other ant encountered there is a counter (n) that ticks up on every collision check, in the first 100 ticks the
// avoidance is allowed, then for the next 100 it is ignored.  Resets the counter after 200 ticks to start the cycle again.
// If tracker is not triggered for a little while the relevant data removed.
antTrackAvoidance = (ant, other, avoider) => {
  ant.avoid ||= {};
  avoider = ant.avoid[other.id] ||= {n: 0};
  if (++avoider.n > 200) avoider.n = 0;
  clearTimeout(avoider.t);
  avoider.t = setTimeout(X => del(ant.avoid, other.id), num2000); // Reset if this ant pair goes quiet for a bit.
  antUpdate(antGetStill(ant));
},

// Checks ant avoidance tracker for a specific other ant. Returns true if avoidance should happen.
antCheckAvoidance = (ant, other) => !ant.avoid?.[other.id] || ant.avoid[other.id].n < 99,

// Handles random direction prone walking, with collision handling for both modes this is used in.
antMoveDefault = (ant, callback, allowPause, speedMult = 1, rotMult = 1, rand = random(), collision = antCollision(ant), ant2 = collision?.a, dist, near) => {
  antSetWalk(ant);
  if (collision) {
    if (ant.state == 'free' || antsWillAvoid(ant, ant2)) {// Too much trouble to handle collisions near the boundary.
      if (!(near = ant.area.n == 'bg' && antBgNear(ant, 1))) {
        if (antCheckAvoidance(antGetStill(ant), ant2)) {
          dist = calcDistComponents(ant2.x, ant2.y, ant.x, ant.y);
          ant.r = normalize360(ant.r + collision.d * randomInt(20));
          ant.x += dist.x;
          ant.y += dist.y;
        }
        // Track ant avoidance duration so we can stop doing it if it gets too insane.
        antTrackAvoidance(ant, ant2);
      }
    }
    else if (ant2.carry?.Q == ant.id) {
      // Make the hand-off easier.
      ant.r = normalize360(ant.r - collision.d);
    }
    else if (ant.carry?.Q == ant2.id || antFight(ant, ant2)) {
      return antNextStill(ant); // Progresses to next item in queue.
    }
  }
  else if (rand < .2) ant.r = normalize360(ant.r + pickRandom([-2, -1, 1, 2]) * rotMult); // Randomly select an angle for direction change.
  antTakeProneStep(ant, speedMult);
  callback(ant, allowPause && rand < .001 ? (antUpdate(antGetStill(ant)), frameTick + randomInt(pauseDelay)) : frameTick);
},

// Moves ant by one step in an assumed prone position.
antTakeProneStep = (ant, speedMult = 1, angleInRadians = degToRad(ant.r), mult = antGetStep(ant) * speedMult) => {
  ant.x += cos(angleInRadians) * mult;
  ant.y += sin(angleInRadians) * mult;
},

// Tests if ant is about to cross a boundary in the bg area and reports which boundary (270 - top, 0 - right, 90 - bottom, 180 - left).
antBgNear = (ant, ignoreAngle, margin = antOffsetX(ant) * 2) =>
  [[deg270, ant.y < 322], [0, ant.x > 960 - margin], [90, ant.y > antGroundLevel(ant, 0) - margin], [deg180, ant.x < margin]].find(b => b[1] && (ignoreAngle || (abs(normalize180(ant.r - b[0])) < 90))),

// Moves ant (or egg) to the middle of #farm.
antFall = (ant, startX = ant.x, startY = ant.y, destX = clamp(ant.x - 20 + randomInt(40), 440, 520), target = antGroundLevel(ant)) => {
  ant.x = startX + (destX - startX) * easeOutQuad(clamp((ant.y - startY) / (260 - startY), 0, 1));
  ant.y += 1.2;
  if (ant.r < 0) ant.r += 1.2;
  antUpdate(ant);
  ant.y < target ? setTimeout(X => antFall(ant, startX, startY, destX), frameTick / 2) : antCap(ant);
},

// Captures an ant into the farm.
antCap = (ant, farm = getFarm(ant)) => {
  if (isAdult(ant)) {
    ant.state != 'cap' && farm.cap++;
    ant.state = 'cap';
    ant.dur = 0;
    ant.ts = getTimeSec();
    antThot(ant, ["Don't touch me!", "Am I kidnapped?", "WTF is going on?", "I'm confused!"]);
    score(isQueen(ant) ? 3 : 1);
    setColonyAndFoe(farm);
  }
  antNextSurface(ant);
  antUpdate(ant, undefined, 1); // Update immediately in case this is called on page load.
  del(ant, 'drop');
},

// Replaces ant's queue with a single fight action, if it's not already fighting.
addFight = (ant, ant2) => !antUniqueActs(ant).includes('fight') && (ant.q = [{}, {act: 'fight', ant: ant2.id}]), // The empty action will default to idle to prevent antNext() in calling code from dropping the fight action.

// Sets up a fight between two ants.  However it does not execute any actions, and relies on the calling action to give up control.
antFight = (ant, ant2) => !ant.carry && !ant2.carry && addFight(ant, ant2) && !ant2.fight && addFight(ant2, ant),

// Resets an ant to sit properly on the surface level and executes the next item in the queue.
// Note: For newly captured ants this is how the ant's queue is "activated".
// Note: This calls antNext() and should be considered an alternative to calling antNext() in some situations.
antNextSurface = ant => {
  antArea(ant, 'top');
  ant.y = antGroundLevel(ant); // Not assigned below because this applies to eggs/infs too.
  isAdult(ant) && antNext(assign(ant, {r: antHillAngle(ant), scale: ant.scale * getSign(ant.r < 90), pose: 'side', fall: 0, walk: 0, run: 0}));
},

// Gets a free ant object given the ant element or some object with an id.
getFreeAnt = antEl => getAnt(_, antEl?.id),

// Gets an ant object by ID.
// Note: dataSet is usually the farm object.
getAnt = (dataSet, id) => getById(dataSet.a, id),

// Removes an object (must have .id) from a data set in the array at the subscript property, and remove the corresponding DOM element including its cache. Done in a timer, so it doesn't mess up any loops that call this.
deleteDataAndEl = (obj, key = 'a', dataSet = getFarm(obj) || _, preserveState, el = getObjEl(obj)) => {
  if (!preserveState) obj.state = 0; // Prevent antAction() from using this object if it is an ant.
  setTimeout(X => dataSet[key] = dataSet[key]?.filter(d => d.id != obj.id), 0);
  el && (el.remove() || del(elCache, obj.id))
},

// Deletes an ant element.
// Important! This is NOT just a handy alias, by having only one param it allows deleting ants via ".forEach(antDelete)" without overwriting the default params in deleteDataAndEl().
antDelete = ant => deleteDataAndEl(ant),

// Updates the antEl to reflect the state of the object, if possible.
antUpdate = (ant, antEl = getObjEl(ant), sync, pkg) => {
  rafQueue[ant.id] ||= requestAnimationFrame(X => {// Prevent queuing the same ant object for an update multiple times (to avoid render lag when switching tabs).
    antElUpdate(ant, antEl);
    del(rafQueue, ant.id);
  });
  sync && antElUpdate(ant, antEl); // Allows doing an immediate synchronous pass.
  // Also update any ants or eggs the ant is carrying.
  if (ant.carry?.pkg && (pkg = getCarry(getFarm(ant), ant.carry))) {
    ({x: pkg.x, y: pkg.y, r: pkg.r} = antHeadPoint(ant));
    pkg.area = ant.area; // Keep the area prop matching the carrier for safety.
    antUpdate(pkg, getObjEl(pkg), sync);
  }
  /* START-DEV */
  isNaN(ant.x + ant.y + ant.r) && console.error("ant is nanned", ant);
  /* END-DEV */
},

// Provides the ant (or egg) element update functionality for antUpdate().
antElUpdate = (ant, antEl) => {
  if (antEl?.isConnected) {
    antEl.style.left = ant.x + 'px';
    antEl.style.top = ((ant.lvl ? ant.lvl * (types[ant.t].s == 's' ? -3 : -5) : 0) + ant.y) + 'px';
    antEl.className = [
      'ant', ant.caste, ant.t, ant.state, ant.pose, antGetSize(ant), ant.inf && 'inf' + ant.inf, // String values.
      ...['walk', 'jit', 'dig', 'wig', 'h', 'fall', 'fight', 'mag', 'alate', 'flare', 'burn', 'rot', 'rot1', 'rot2', 'decay', 'egg'].filter(f => ant[f]), // Boolean values.
      ...ant.rm // Body part removal.
    ].join(' ');
    antEl.style.transform = `scale(${ant.scale},${abs(ant.scale % 1 ? ant.scale : 1)}) rotate(${ant.r + 90}deg)`; // +90 because the ant was built facing north instead of east in CSS.
    if (ant.rot) {
      let upright = sin(degToRad(ant.r)) < 0;
      antEl.style.setProperty('--RT', ((upright ? 0 : deg180) - ant.r - 90) + 'deg'); // Counter-rotate stink lines.
      antEl.style.setProperty('--SD', getSign(upright)); // Stink direction multiplier.
      antEl.style.setProperty('--AD', ant.rAd + 's'); // Randomize animation duration.
    }
  }
},

// Updates the ant object to reflect the state of the antEl, in NaN situations.
antFixNaN = (ant, antEl = getObjEl(ant), style = antEl && getComputedStyle(antEl), match = style?.transform.match(/rotate\(([+-]?\d*\.?\d+)deg\)/)) => {
  if (antEl?.isConnected) {
    if (isNaN(ant.x)) ant.x = parseFloat(style.left) || 480; // 480 = getEl('farm').offsetWidth / 2.
    if (isNaN(ant.y)) ant.y = parseFloat(style.top) || antGroundLevel(ant);
    if (isNaN(ant.r)) ant.r = match ? parseFloat(match[1]) - 90 : 0; // -90 to reverse the +90 offset applied in antUpdate.
  }
},

// Gets a carried item.
getCarry = (farm, carry, dataSet = carry?.nip && farm.nips.find(n => n.nip == carry.nip)?.item || farm) => carry?.pkg ? getAnt(dataSet, carry.id) : carry,

// Draws a carried item, or moves it from the farm container to the ant element.
carryDraw = (ant, carry = ant.carry, carryEl = getEl(carry?.id)) => {// Note: getEl not getObjEl because item can move farm without the carry data being updated.
  if (getCarry(getFarm(ant), carry)?.f == F.id) {
    carry.pkg ? carryEl?.isConnected && getObjEl(ant)?.after(carryEl) : // Make them next to each other in DOM so nothing passes between them on z-axis.
      appendHTML(query(`#${ant.id} .c`), divc(`carry C${carry.t} ` + carry.k, {id: carry.id}));
    // Note: For carried ants/eggs (egg, inf, or dead) an antUpdate() called from antAction() should do the trick.
  }
},

// Undraws a carried item, or moves it from the ant element into the farm container.
carryUndraw = (ant, dest, farm = getFarm(ant), carry = ant.carry, carryEl = getEl(carry?.id), carryItem = getCarry(farm, carry), // Note: getEl not getObjEl because item can move farm without the carry data being updated.
  headPoint = antHeadPoint(ant, 6 + antOffsetX(ant)), tun = getTun(farm, ant.area.t), pc) => {
  if (carryItem?.f == F.id && carryEl?.isConnected) {
    if (carry.pkg) {
      if (!dest) {
        pc = findTunPos(headPoint, farm, [tun, ...(tun?.co || [])]).pc;
        dest = {x: headPoint.x, y: tun ? cavFloor(tun, pc)?.y || headPoint.y : antGroundLevel(carryItem, 0) + 2};
        isEggOrInf(carryItem) && (carryItem.pc = pc);
      }
      assign(carryItem, {x: dest.x, y: dest.y});
      antUpdate(carryItem);
    }
    else carryEl.remove()
  }
},

// Transfers an ant from one data set to another and removes/draws the DOM elements as well - assumes ant array is subscript '.a'.
// Important: 'farm' parameter does not mean "the source farm".  The source is the oldSet.  This is a bit of a gotcha.
// Note: newCont defaults to #farm container if undefined, that's handled in antDraw().
antTransfer = (farm, obj, oldSet, newSet, newVals, newCont) => {
  newSet.a.push(assign(obj.id ? obj : getById(oldSet.a, obj), newVals));
  deleteDataAndEl(obj, 'a', oldSet, 1);
  currentFarm(farm) && antDraw(obj, newCont);
},

// Handles moving a carried egg/infant alongside its carrier during nip/tube transfers.
carryTransfer = (ant, getCarryFarm, getCarryDataSet, destFarm, oldSet, newSet, transferVals, newCont, newNip, pkg = getCarry(getCarryFarm, ant.carry, getCarryDataSet)) => {
  if (ant.carry) {
    if (isEggOrInf(pkg)) {
      antTransfer(destFarm, pkg, oldSet, newSet, transferVals, newCont);
      ant.carry.nip = newNip;
    }
    else {
      // Carry item did not resolve into a valid thing to carryTransfer.  We have no choice but to get of the carried item because the ant is transferring.
      getEl(ant.carry?.id)?.remove();
      del(ant, 'carry');
    }
  }
},

// Gets the X offset of "where" an ant is at based on its size.
antOffsetX = (ant, map = {e: 0, b: 4, s: 6, m: 9, l: 11, x: 11}) => map[antGetSize(ant)],

// Gets the Y offset of "where" an ant is at based on its size.
// Note: Because of tunnel widths it would require extra consideration if ever returning >=7 from here.
// Furthermore antOffsetX(ant)-antOffsetY(ant) should be <7 for waypoint-based side-landings to work properly?
antOffsetY = (ant, map = {e: 0, b: 1, s: 2, m: 4, l: 5, x: 6}) => map[antGetSize(ant)],

// Computes the X value we'll use for some decision making.  It is roughly the x-coordinate of the front of the ant.
// Note: This is not as thorough as antHeadPoint() which may be more suitable if a proper rotational coordinate is required.
antFaceX = ant => ant.x + antOffsetX(ant) * ant.scale,

// Gets a more accurate x/y coordinate of where the ant's head is with respect to its rotation.
// Note: When ant is known to be facing roughly east or west in side-position it may be sufficient to just use antFaceX() instead.
// Updated to create an ant shim with commonly needed properties.
antHeadPoint = (ant, offset = antOffsetX(ant), rad = degToRad(ant.scale < 0 ? deg180 - ant.r : ant.r)) => ({x: ant.x + cos(rad) * offset, y: ant.y + sin(rad) * offset, r: ant.r, scale: ant.scale, t: ant.t, f: ant.f, area: ant.area}),

// Gets a more accurate x/y coordinate of where the ant's middle set of feet are with respect to its rotation.
// To get the rear & front foot positions, see how getAntWaypointDirection() does it.
// This is just antHeadPoint() with different default params.
// Note: Intended for finding closest waypoint of a rotated ant, where ant.y + antOffsetY(ant) is insufficient.
antFootPoint = (ant, offset = antOffsetY(ant), rad = degToRad(ant.r + 90)) => antHeadPoint(ant, offset, ant.scale < 0 ? PI - rad : rad),

// Gets a more accurate x/y coordinate of where the ant's tail is with respect to its rotation.  This is just antFootPoint() with different default params.
antTailPoint = (ant, offset = antOffsetY(ant), rad = degToRad(ant.r + 180)) => antFootPoint(ant, offset, rad),

// Computes the vertical offset (y) of the upper half of a horizontally stretched ellipse for a given position (x).
// Note: the divisor for h caps the height, and the steepness of the hill for fine-tuning can be changed by turning the last part into sqrt(1 - pow(pow(xNorm, 2), 1)) and tweaking the 1.
getHillNudge = (l, r, h, x, c = (l + r) / 2, w = (r - l) / 2, xNorm = (x - c) / w) => x < l || x > r ? 0 : h / 2 * sqrt(1 - xNorm * xNorm), // Note: pow(xNorm, 2) was optimised to xNorm * xNorm.

// Gets the height of a hill at an x-position.
// Note: The "- h *.12" because our hills are positioned at 62% not 50%.
getHillHeight = (x, farm = F, hill = farm.hills.find(h => h.l < x && h.r > x), h = min(50, hill?.h)) => hill ? max(0, getHillNudge(hill.l, hill.r, h, x) - h * .12) : 0,

// Figures out the ant's "ground" level.  Also used with eggs.
antGroundLevel = (ant, applyAntOffset = isAdult(ant)) => surface - (applyAntOffset && antOffsetY(ant)) - getHillHeight(ant.x, getFarm(ant)),

// Figures out the angle an ant would be due to the sides of hills being steep.
// Note: The actual angle has been divided here as the ant would lean unnaturally by trying to follow the curve too accurately.
antHillAngle = (ant, offset = ant.scale * antOffsetX(ant), farm = getFarm(ant)) => radToDeg(Math.atan((getHillHeight(ant.x + offset, farm) - getHillHeight(ant.x, farm)) / (2 * offset))) * -ant.scale / 2,

// Adds to finna queue.
antFinna = (ant, act, args = {}) => ant?.q.push(assign(args, {act: act})),

// Adds a via action to finna queue which will have to transition to the appropriate area to do them first.
// Use the 'n' argument to specify the area name to go via, will assume 'top' by default, can also pass in a 1 to execute anywhere (intended for the 'rest' action).
// See goToLocation() for a more robust method of moving ants to a specific location.
antFinnaVia = (ant, act, args = {}) => antFinna(ant, 'via', assign(args, {via: act})),

// Adds to finna queue only if the 'act' does not already exist there.  Uses antFinnaVia() for safety so do be careful that is the desired behaviour.
antFinnaUnique = (ant, act, args) => ant && !antUniqueActs(ant).includes(act) && antFinnaVia(ant, act, args), // We have to guard for undefined `ant` because we blindly call this func on possibly nothing.

// Prepends a custom queue or queue item to finna queue.
// keepFirst is set by default, this allows using antNext() like normal, where the first item will be discarded there.  Unset keepFirst to use antAction() instead.
antInstaQ = (ant, queueItems, keepFirst = 1) => ant.q = [...keepFirst ? [ant.q.shift()] : [], ...(Array.isArray(queueItems) ? queueItems : [queueItems]), ...ant.q],

// Delegates an ant action.  Importantly; calls an antUpdate() so that anything that calls antAction doesn't have to first do an antUpdate().
// Done in a timer to prevent exceeding callstack and to handle framerate speed by default.
antAction = (ant, timeout = frameTick) => /* START-DEV */!stopAnts &&/* END-DEV */ isCapped(ant) && setTimeout(X => act[ant.q[0]?.act || 'idle'](ant), timeout) && antUpdate(ant),

// Does next action in finna queue.
// Most notably this calls antAction() and is often the logical alternative to calling antAction() directly.
antNext = (ant, timeout) => {ant.q.shift(); antAction(ant, timeout); antThot(ant)},

// Combines antGetStill() and antAction(). Use instead of antAction() to unset walk prop before executing the next loop of the action.
antActionStill = (ant, timeout) => antAction(antGetStill(ant), timeout),

// Combines antGetStill() and antNext(). Use instead of antNext() to unset walk prop before executing the next action.
antNextStill = (ant, timeout) => antNext(antGetStill(ant), timeout),

// Adds a tracker to quickly determine where ant is. Includes a duration used in some areas, or a tunnel ID for the bottom.
antArea = (ant, area, tunId) => ant.area.n == area && ant.area.t == tunId ? ant.area.d++ : ant.area = {n: area, d: 0, t: tunId},

// Calculates the size of an ant step with impediments and lethargy.
antGetStep = ant => ant.scale * (
    types[ant.t].v
    - (ant.hp < 10 ? .12 : ant.hp < 20 ? .06 : ant.hp < 40 ? .03 : 0)
    - (ant.md < 10 ? .24 : ant.md < 20 ? .12 : ant.md < 40 ? .06 : 0)
    - (ant.q.length < 2 ? .2 : 0)
  )
  * (isQueen(ant) ? ant.area.n != 'bg' ? .6 : .8 : 1)
  * (ant.area.n == 'top' ? 1 - (min(abs(ant.r), 20) / 20) * .4 : 1) // Slow the ant down up to 40% when walking on steep hills or else there is something slightly unsettling about it.
  * (ant.run || 1), // ant.run is independent of and cumulative to other speed multipliers and can be 0/1/undefined for normal speed, <1 for slow, or >1 for fast.

// Calculates the step size in a tunnel.
// An absolute value is returned because we don't care about negative scale.
antGetTunnelStep = ant => randomFloat(0.6, 1.4) * abs(antGetStep(ant)) / 2,

// Makes an ant take one step along the surface.
antMoveSurface = (ant, maxStep = 3) => {
  ant.x += clamp(antGetStep(ant), -maxStep, maxStep);
  ant.y = antGroundLevel(ant);
  ant.r = antHillAngle(ant);
},

// Gets the next spot to step to in the tunnel.
antMoveTunnel = (ant, step = antGetTunnelStep(ant), ang = degToRad((ant.scale < 0 ? mirrorAngle(ant.r) : ant.r))) => {
  ant.x += cos(ang) * step;
  ant.y += sin(ang) * step;
},

// Find where ent/con/jun overlaps with nextTun along nextTun's middle line.
// A 'jun' is never coincident with nextTun's endpoint (that offset is the whole point of it), so direction is resolved via the jun's
// sibling 'con/ent' (which IS coincident), while the actual point stays anchored to the jun's own coordinates.
getConnectionPoint = (tun, nextTun, farm, anchor = getTunSub(farm, tun),
  dist = calcDistComponents(nextTun.x1, nextTun.y1, nextTun.x2, nextTun.y2), offset = 1 + anchor.w / 2,
  [x0, y0, dir] = anchor.x1 == nextTun.x1 && anchor.y1 == nextTun.y1 ? [nextTun.x1, nextTun.y1, 1] : [nextTun.x2, nextTun.y2, -1],
  dx = anchor.x1 - x0, dy = anchor.y1 - y0,
  proj = dx * dist.x + dy * dist.y,
  perpSq = max(0, squareDistance(dx, dy) - proj * proj),
  s = proj + dir * sqrt(max(offset * offset - perpSq, 0))
) => ({x: x0 + dist.x * s, y: y0 + dist.y * s}),

// Gets the index of the closest waypoint to an ant or a previous waypoint or whatever.
getWaypointIndex = (farm, coord, knownWp, thresholdSq = 81, wps = wayPoints[farm.id], index = coord.i ?? -1, start = knownWp?.i ?? 0, best = Infinity, leftDone, rightDone, found, offset = 0, idx,
  check = (i, wp = wps?.[i], dSq = wp && boxProxSquareDistance(coord, wp, thresholdSq)) => // Default threshold: 81 = 9 * 9, the square of the threshold. (experimental; used to be 7*7=49)
     dSq < best && dSq < thresholdSq ? (best = dSq, index = i, found = 1) : index != -1 && dSq > best && found) => {
  if (index < 0) while (!leftDone || !rightDone) leftDone ||= (idx = start - offset - 1) < 0 || check(idx), rightDone ||= (idx = start + offset) >= wps?.length || check(idx), offset++;
  return index;
},

// Gets the next waypoint relative to the current one.  Returns false if there is a problem such as the found wp being too far away.
getNextWaypoint = (farm, cur, dir = 1, wps = wayPoints[farm.id], nextIndex = cur.i + dir) =>
  dir && nextIndex >= 0 && nextIndex < wps.length && inTargetProximity(cur, wps[nextIndex], 12) && wps[nextIndex],

// Gets the waypoint direction vector for the ant.
// Attempts to get the rear and front foot positions, and compare them to each other to determine the direction (in the wayPoints[farm.id] array) that the ant is moving along,
// or failing to get both; compares one of those to the known waypoint which should be close to the middle of the ant.
getAntWaypointDirection = (ant, farm, knownWp,
  r = getWaypointIndex(farm, antFootPoint(antTailPoint(ant)), knownWp),
  f = getWaypointIndex(farm, antFootPoint(antHeadPoint(ant)), knownWp)) =>
  (r = r < 0 ? knownWp?.i : r, f = f < 0 ? knownWp?.i : f, r != f && getSign(r < f)),

// Gets average angle of a set of waypoints.
getWaypointAngle = (points, sumX = 0, sumY = 0, a) =>
  points.slice(0, -1).forEach((p, i) => (a = atan2(p.y - points[i + 1].y, points[i + 1].x - p.x), sumX += cos(a), sumY -= sin(a))) || angleFromDelta(sumX, sumY),

// Determines if ant will collide with a waypoint in front of it.
antWaypointCollision = (farm, ant, range, wp, angle) => {
  for (wp of wayPoints[farm.id]) {
    if (inTargetProximity(ant, wp, range)) {
      angle = normalize360(getAngle(ant, wp) - ant.r);
      /* START-DEV */
      // For dev debugging, visually indicate the collision (pink) as well as any non-collision points checked in range (orange) up until the collision was found.
      devHighlightWaypoint(farm, wp, angle < 30 || angle > 330 ? '#ec3b83' : '#d69a17');
      /* END-DEV */
      if (angle < 30 || angle > 330 || inTargetProximity(ant, wp, 1)) return 1; // Waypoint is within the forward "cone" tolerance (or right on top of it).
    }
  }
},

// Determines if ant will collide with any others.
// The goal of this is just to make it look like ants are aware of each other's presence, and we have to allow them to ignore collisions under many conditions.
antCollision = (ant, cone = 30, a, angle) => {
  for (a of ant.f ? getFarm(ant)?.a : _.a) {
    if (a != ant && !isDead(a) && isAdult(a) && ant.state == a.state && ant.area.n == a.area.n && inTargetProximity(a, ant, 30)) {
      angle = normalize180(getAngle(ant, a) - ant.r);
      if (abs(angle) < cone || inTargetProximity(a, ant, 9)) return {a, d: -sign(angle)}; // Waypoint is within the forward "cone" tolerance (or almost on top of it).
    }
  }
},

// Determines if an ant is near a rotten corpse and applies hp penalties.
antCorpseProximity = (ant, farm = getFarm(ant), nearestCorpse = farm.a.find(a => a.rot && inTargetProximity(a, ant, 20)), cavCount = farm.tuns.filter(t => t.t == 'cav' && t.prog).length) => {
  if (nearestCorpse && ant.area.t == nearestCorpse.area.t) {
    antStats(ant, {hp: (nearestCorpse.decay - nearestCorpse.rot) / num1000}); // Penalty increases as rot increases, but decreases as decay increases.
    !cavCount ? playerHint(farm, ["Corpses are rotting and making ants sick. Pluck them out!"]) :
      cavCount < 2 ? playerHint(farm, ["Not enough chambers built to handle rotten corpse storage."]) :
      playerHint(farm, ["Ants are getting sick from rotting corpses."]);
    if (ant.hp <= 0) {
      ant.wig = 1;
      setTimeout(X => {antGetStill(ant).q = [{}, {act: 'die', r: 'sick'}]; ant.wig = 0}, num2000);
    }
  }
},

// Inverts an ant's angle if it has a negative scale.
antProneCorrection = ant => {
  if (ant.scale < 0) {
    ant.scale = 1;
    ant.r = mirrorAngle(ant.r);
  }
},

// Corrects an ant's orientation based on which side of a tunnel its waypoint is on.
antSideCorrection = (ant, tun, wp, action = ant.q[0]) => {
  if (ant.scale != getTunSide(tun, wp || ant) * getSign(action.rev)) {
    ant.scale *= -1;
    ant.r = mirrorAngle(ant.r);
    if (antDir(ant, tun) == action.rev) ant.r = oppositeAngle(ant.r);
  }
},

// Returns true if ant is facing forward along the tunnel, false if backward.
antDir = (ant, tun, antAngle = degToRad(ant.r)) => (cos(antAngle) * ant.scale * (tun.x2 - tun.x1) + sin(antAngle) * (tun.y2 - tun.y1)) > 0,

// Gets the closest point on the middle line of a tunnel.
closestPointOnMid = (point, tun, comp = calcDistComponents(tun.x1, tun.y1, tun.x2, tun.y2), t = clamp((point.x - tun.x1) * comp.x + (point.y - tun.y1) * comp.y, 0, comp.d)) => ({x: tun.x1 + comp.x * t, y: tun.y1 + comp.y * t, comp}),

// Nudges an ant toward the middle line of a tunnel.
antNudgeToMid = (ant, tun, maxNudge = antGetTunnelStep(ant) / 4, nextTun = getTun(getFarm(ant), ant.q[1]?.id), closest = closestPointOnMid(ant, tun), dx = closest.x - ant.x, dy = closest.y - ant.y,
  dist = getHypot(dx, dy), move = min(maxNudge, dist)
) => {
  if (dist > 2) {
    ant.x += (dx / dist) * move;
    ant.y += (dy / dist) * move;
    if (nextTun?.t == 'con') {
      // Next tunnel is a con, let's angle it towards the con. The effect is subtle but it minimises hugging the last curve before a con.
      temp1 = getAngle(ant, {x: nextTun.x1, y: nextTun.y1});
      ant.r = normalize360(ant.r + clamp(normalize180((ant.scale < 0 ? mirrorAngle(temp1) : temp1) - ant.r) * min(1, abs((ant.x - tun.x1) * closest.comp.y - (ant.y - tun.y1) * closest.comp.x) / 80), -.5, .5));
    }
  }
},

// Nudges an ant toward the supplied waypoint.
antNudgeToWP = (ant, wp, maxNudge = antGetTunnelStep(ant) / 2, minDist = 0, dx = wp.x - ant.x, dy = wp.y - ant.y,
  dist = getHypot(dx, dy), diff = dist - antOffsetY(ant), step = sign(diff) * min(abs(diff), maxNudge)) => {
  if (dist > minDist) {
    ant.x += (dx / dist) * step;
    ant.y += (dy / dist) * step;
  }
},

// Nudges an ant perpendicular to its own orientation, away from its feet (i.e. "lifts" it), independent of tunnel midpoints/waypoints.
antNudgeUp = (ant, maxNudge = antGetTunnelStep(ant), rad = degToRad(ant.r - 90), adjRad = ant.scale < 0 ? PI - rad : rad) => {
  ant.x += cos(adjRad) * maxNudge;
  ant.y += sin(adjRad) * maxNudge;
},

// Nudges an ant very slightly to the closest possible waypoint, used for out-of-bounds reasons.
antNudgeToClosestWp = (ant, farm, maxNudge = 1, wpIndex = getWaypointIndex(farm, ant, 0, 1000000), wp = wayPoints[farm.id][wpIndex]) => antNudgeToWP(ant, wp, maxNudge),

// Nudges an ant to middle of tunnel, changes to prone pose, and performs correction.
antToProneWithCorrection = (ant, tun) => {ant.pose = 'prone'; antProneCorrection(ant); antNudgeToMid(ant, tun, antOffsetY(ant) / 2)},

// Nudges an ant to waypoint along tunnel, changes to side pose, and performs correction.
antToSideWithCorrection = (ant, tun, wp) => {ant.pose = 'side'; antSideCorrection(ant, tun, wp); antNudgeToWP(ant, wp, antOffsetY(ant))},

// Determines if an ant is within range of a waypoint to make landings, etc...
// Note: antOffsetY() would technically be correct, but it is too strict! Allow more leniency with antOffsetX().
antWaypointRange = (ant, wp, mult = 1) => wp && inTargetProximity(ant, wp, antOffsetX(ant) * mult),

// Determines the side of a tunnel a point is at.
// Warning: The default param for 'point' is a hack to prevent this func from failing in exceptional circumstances, and will cause a 50% chance of giving an incorrect result.  (This may be concealing bugs)
getTunSide = (tun, point = {x: 0, y: 0}) => tun.t == 'con' ? getSign(point.y < tun.y1) : tun.t == 'ent' ? getSign(point.x > tun.x1) : getSign((tun.x2 - tun.x1) * (point.y - tun.y1) - (tun.y2 - tun.y1) * (point.x - tun.x1) < 0),

// Determines whether a tunnel is of a centered rotation type.
isRotationTunnel = tun => ['con', 'ent', 'jun'].includes(tun.t),

// Returns a list of tuns that pass as many 'tests' as possible for special purposes.
specialTunCandidates = (farm, tests, candidates = farm.tuns.filter(t => t.t == 'cav' && t.dun), best = candidates, test, filtered) => {
  for (test of tests) {
    filtered = best.filter(test);
    if (!filtered.length) break;
    best = filtered;
  }
  return best;
},

// Determines which tun (and percent position) an ant/coord is positioned at, given a prioritised list of guesses, falling back to full scan.
// The reason for providing guesses is two-fold: We want to avoid a full scan if possible for efficiency, and secondly we usually have an ordered list of
// things we care about; "are we up to the next tunnel? no, are we still in the current tunnel? no, did we slip into a tunnel that adjoins the next one? etc..."
// guesses array can contain tun objects or just tun ids.
findTunPos = (ant, farm, guesses = [], margin = 2, secondPass, guessed = [], guess, tun, dx, dy) => {
  for (guess of guesses) {
    if ((tun = guess?.id ? guess : getTun(farm, guess)) && !guessed.includes(tun.id)) {
      if ((tun.prog >= tunPercent(tun, 8) || isRotationTunnel(tun)) && pointInTun(ant, tun, margin)) {
        dx = tun.x2 - tun.x1; dy = tun.y2 - tun.y1;
        return {tun: tun, pc: (dx || dy) ? clamp(((ant.x - tun.x1) * dx + (ant.y - tun.y1) * dy) / squareDistance(dx, dy), 0, 1) * 100 : 0};
      }
      guessed.push(tun.id);
    }
  }
  if (!secondPass) return findTunPos(ant, farm, farm.tuns, margin, 1, guessed);
},

// Determines which tunnel a waypoint is in, and stores the value with the waypoint for future reference, as well as returning it.
getWaypointTunnel = (farm, wp, tunHint, tunPos) => {
  if (!wp.t && (tunPos = findTunPos(wp, farm, [tunHint, ...(tunHint?.co || [])], 3))) wp.t = tunPos.tun.id;
  return wp.t;
},

// Safely flips an ant's direction when in a tunnel.
antChangeTunDir = (ant, tun, wp) => {
  !randomInt(9) && (ant.pose = 'prone'); // Switching to prone first here is more reliable, and sometimes a side ant gets stuck flipping in a loop, this could resolve the issue?
  if (ant.pose == 'side') {
    ant.scale *= -1;
    antSideCorrection(ant, tun, wp);
  }
  else {
    ant.r = oppositeAngle(ant.r);
    antProneCorrection(ant);
    // Ensure prone angle isn't skewed off the tun angle too far, or pointing outwards.  And we have to disallow using con's bogus .r value.
    if (isRotationTunnel(tun)) tun = findTunPos(ant, getFarm(ant), tun.co).tun; // Try to get non-rotational tunnel if possible.
    if (!isRotationTunnel(tun)) ant.r = normalize360((antDir(ant, tun) ? tun.r : oppositeAngle(tun.r)) - getTunSide(tun, ant) * randomInt(15));
  }
},

// Reformats action data into a valid dive stub that can be used with queue functions.
makeDiveStub = obj => ({act: 'dive', n: 'bot', tun: obj.id || obj.tun, pc: obj.pc, pos: obj.pos/* START-DEV */, stub: obj.stub || 1/* END-DEV */}),

// Converts a pixel length into the percentage of the tunnel that is represents.
tunPercent = (tun, px) => px / tun.w * 100,

// Converts a percentage length into pixels of the tunnel that is represents.
tunPixels = (tun, percent) => percent / 100 * tun.w,

// Gets the coordinates of the cavity floor.
cavFloor = (tun, pc, yOffset = 0, r = degToRad(tun.r)) =>
  ({id: tun.id, x: (tun.x1 + (tun.x2 - tun.x1) * (pc / 100)) - sin(r) * (tun.h / 2), y: (tun.y1 + (tun.y2 - tun.y1) * (pc / 100)) + cos(r) * (tun.h / 2) - yOffset}),

// Slips an ant off the bg area.
// Since this triggers an antAction() it should be considered as an alternative to calling that function.
// It is generally OK to call this function directly (note: it will clear the ant's finna queue to simulate a head injury).
antActionSlip = ant => {
  !ant.carry && (ant.q = [{act: 'slip'}], ant.scale = randomSign());
  antActionStill(ant);
},

// Handles an ant's end of life transition.
// Call this function for instant death, but it is often better to queue a 'die' action which will prepare the ant nicely first.
antDeath = (ant, cause, farm = getFarm(assign(ant, {
    cause: cause,
    state: 'dead',
    dead: 1,
    tsd: 0, // Track time-since-death.
    dts: getTimeSec(), // Mark timestamp of last tsd update.
    pose: 'pick',
    rot: 0,
    decay: 0,
    walk: 0,
    jit: 0,
    dig: 0,
    hp: 0,
    md: 0,
    q: []
  })), tunPos = findTunPos(ant, farm, [ant.area.t], 4), stillAlive = farm.a.filter(a => isCapped(a) && isAdult(a))) => {
  if (ant.egg) {
    // Eggs don't really have any elaborate handling, they just disappear.
    antDelete(ant);
  }
  else {
    // Not an egg.
    farm.death[cause]++;
    msg(ant.n + ` died in "${farm.n}" ${deathCauses[cause]}.`, 'err');
    setColonyAndFoe(farm);
    if (cause == 'fight' && stillAlive.length === 1 && isQueen(stillAlive[0])) farm.sweep = 1;
    antUpdate(ant);
    // Correct antArea data.
    abs(ant.y - antGroundLevel(ant, 0)) < antOffsetY(ant) + 1 ? antArea(ant, 'top') : tunPos?.tun && antArea(ant, 'bot', tunPos.tun.id);
    addLidFunc(); // Allow plucking dead ants.
  }
  save();
},

// Updates the decomposition state of a corpse and handles ant removal.
updateCorpseState = (ant, farm) => {
  timeLog(ant, 'tsd', 'dts'); // Track time-since-death.
  if (lockoutExpired()) {
    ant.rAd ||= randomInt(3) + 3; // Stink animation duration (so adjacent ants don't have matching animations).
    ant.tsd < 2400 ? 0 : // ~40 minute pre-rot cooldown.
      ant.rot < 100 ? (ant.rot += .2) : // Rotting phase.
      ant.decay < 100 ? (ant.decay += .4) : // Decaying / shrinking phase.
      antDelete(ant); // Fully decomposed.
  }
  // Shrink decaying corpses.
  ant.scale = sign(ant.scale) * (1 - ant.decay / deg180);
  // Extra properties are added for the sake of CSS styles.
  antUpdateClasses(ant, {rot1: ant.rot > 20, rot2: ant.rot > 80});
  // If ant is out-of-bounds let's just nudge it over on the sly.
  ant.area.t && !findTunPos(ant, farm, [ant.area.t], 4) && antNudgeToClosestWp(ant, farm);
},

// Returns a random worker, or failing that - a queen.  Must be the same type as the farm's colony, in OK health, and not carrying.
getWorkerOrQueen = (farm, testCond = X => 1, data = farm.a, eligible = data?.filter(a => !a.carry && a.t == farm.t && a.hp > 40 && !isDrone(a) && isAdult(a) && !a.lc && testCond(a)), workers = eligible.filter(isWorker)) =>
  pickRandom(workers.length ? workers : eligible),

// Determines what, if anything, needs to be carried by a random worker.
trySetCarryTask = (farm, morgue = farm.tuns.find(t => t.morgue), morgueCandidates = specialTunCandidates(farm, [t => !t.nip, t => t.co.filter(co => getTun(farm, co).dun).length < 2]), // Note: We allow nests to become morgues, so that ants will move nests.
  carrierAnt = getWorkerOrQueen(farm, ant => !hasCarryTasks(ant)), queen, itemToMove, temp,
  deadAnt = farm.a.find(a => isDead(a) && a.tsd > num1500 && !getTun(farm, a.area.t)?.morgue),
  // No need to check if eggs/infants are in morgue because queen will move her nest soon if that's the case.  'moveTo' was set if queen left farm.
  // No priority distinction between infants and eggs - they're treated identically here, only dead ants (which actively cause problems if left) jump the queue.
  dependant = farm.a.filter(e => isEggOrInf(e) && ((queen = farm.a.find(a => a.id == e.Q && isCapped(a))) && queen.nest && e.area.t != queen.nest || e.moveTo)).sort((a, b) => b.lvl - a.lvl)[0]) => {
  // Recalculate where the morgue should be.
  if (deadAnt && (!morgue || !morgueCandidates.includes(morgue))) {
    // Pick a new morgue.
    if (morgue) morgue.morgue = 0; // Unmorgue existing morgue.
    if (morgue = pickRandom(morgueCandidates)) morgue.morgue = 1;
    farm.dig = farm.dig.filter(d => d.id != morgue?.id); // Remove the morgue from current dig jobs.
  }
  if (itemToMove = [[deadAnt, morgue], [dependant, 1]].find(([pkg, param]) =>
    pkg && param && !farm.a.some(a => a.carry?.id == pkg.id || a.q.some(q => q.act == 'carry' && q.id == pkg.id)))) {
    if (carrierAnt) antFinna(carrierAnt, 'carry', {id: itemToMove[0].id, pkg: 1}); // Find the first item that is available to move and not already assigned.
    else if (itemToMove[0].moveTo) {
      // No in-farm carrier found. The item has a moveTo nip destination (vial or tube), so we need to summon one.
      // Last chance #1: if the matching vial has an eligible ant, call it out so it can take the task next pass.
      temp = getVial(farm); // Vial nip data.
      if (temp?.nip == itemToMove[0].moveTo && (carrierAnt = getWorkerOrQueen(farm, undefined, temp.item.a)))
        !temp.item.a.some(a => a.nipPh >= 4) && exitVial(carrierAnt); // Guard against summoning when an ant is already actively exiting (nipPh >= 4 means exit walk is underway).
      else if (temp = farm.nips.find(n => n.nip == itemToMove[0].moveTo && n.item.k == 'tube')) {// Tube nip data.
        // Last chance #2: check farms connected via tubes for an eligible ant that can be summoned here.
        let otherFarm = getFarm(temp.f), otherNipData = otherFarm?.nips.find(n => n.id == temp.id);
        // Skip if an ant is already mid-tube heading here (nipPh >= 3), or if another ant in the connected farm is already queued to walk to this same nip.
        if (otherFarm && otherNipData && !temp.item.a.some(a => a.nipPh >= 3)
          && !otherFarm.a.some(a => antUniqueActs(a).includes('nip') && a.q.some(q => q.act == 'nip' && q.nip == otherNipData.nip))
          && (carrierAnt = getWorkerOrQueen(otherFarm, undefined, otherFarm.a))) antFinnaUnique(carrierAnt, 'nip', {nip: otherNipData.nip});
      }
    }
  }
},

// Sends an ant to care for an egg or larva.
care4kids = (farm, carerAnt = getWorkerOrQueen(farm, ant => !hasCarryTasks(ant) && (isQueen(ant) && ant.q.length < 20 || !antUniqueActs(ant).includes('care'))),
  target = farm.a.filter(isEggOrInf).sort((a, b) => a.hp - b.hp)[0], // Pick whichever egg or infant has the lowest hp.
  isInf = target?.inf) => {
  // Ensure target exists, needs care, and that ant is not already caring for an egg/infant (in case carer is a queen we allow queuing extra care actions if her queue is not too long).
  if (target && target.hp < 89 && carerAnt) {
    goToLocation(carerAnt, makeDiveStub({tun: target.area.t, pc: target.pc, pos: 'd'/* START-DEV */, stub: 'care4kids' /* END-DEV */}));
    antFinna(carerAnt, 'care', {id: target.id});
  }
},

// Sets the colony and foe values for the current farm.
setColonyAndFoe = farm => {farm.t = !farm.coex && colonyType(farm); farm.foe = !farm.coex && farm.a.some(a => isCapped(a) && a.t != farm.t)},

// Gets the vial stuff from the nipples.
getVial = farm => farm.nips.find(n => n.item.k == 'vial'),

// Tells an ant to exit a vial.
// Perform a phase 3 nipWalk, while repeatedly checking if it reached phase 5.
exitVial = (ant, farm = getFarm(ant), nipData = getVial(farm), exitInterval = setInterval(X => {
  // Repeatedly check the nipWalk moved the ant to phase 5 and then deNip() it.
  if (ant.nipPh == 5) {
    deNip(ant, nipData, farm);
    stopInterval(exitInterval);
  }
}, microDelay)) => antNipWalk(ant, nipData, -35, 3),

// Handles ant walking into an item attached to a nip, to a certain destination.
antNipWalk = (ant, nipData, dest, basePhase = 0, animLoop = setInterval(X => {
  assign(ant, {
    nipPh: 1 + basePhase, // Flag that walk is happening.
    walk: 1,
    nipTs: getTime(),
    x: ant.x + antGetStep(ant) / 2
  });
  // The following cannot be assigned above, because they depend on ant being mutated one bit at a time.
  ant.y = (ant.x < 20 ? 28 : ant.x > 32 ? 38 : 32 + 6 * (abs(ant.x - 20) / 24)) - antOffsetY(ant);
  ant.r = ant.x < 20 || ant.x > 32 ? 0 : ant.scale * getAngle({x: 20, y: 32}, {x: 32, y: 38}) / 2; // Actual angle nerfed to half because it looked too intense.
  // Check if destination reached.
  if (abs(ant.x - dest) < antOffsetX(ant)) {
    ant.nipPh = 2 + basePhase; // Flag ant is ready for next phase.
    del(antGetStill(ant), 'nipTs'); // Note: antGetStill() slipped in here to avoid setting walk=0 in this same block of code.
    stopInterval(animLoop);
  }
  else ant.scale = getSign(dest > ant.x); // Reverse for next loop if applicable.
  // If the nip item was removed we need to kill this loop (createNipArrows() will handle rescuing the ant), otherwise we can run antUpdate() safely.
  !getFarm(ant).nips.includes(nipData) ? stopInterval(animLoop) : antUpdate(ant);
}, frameTick)) => 1,

// Provides the vial animation activity. Makes ants walk into the vial and then randomly do random things.
vialActivity = (ant, nipData, farm = getFarm(ant), rand = randomInt(6)) => {
  !ant.nipPh && antNipWalk(ant, nipData, 40 + randomInt(170)); // Ant has not begun their vial walk yet.
  ant.nipPh === 1 && getTime() - ant.nipTs > longDelay && antNipWalk(ant, nipData, 40 + randomInt(170)); // Ant was stuck in nipPh 1.
  if (ant.nipPh == 2) {
    if (ant.carry) {
      ant.carry && carryUndraw(ant, {x: antHeadPoint(ant, 6 + antOffsetX(ant)).x, y: 36, el: getEl('a-' + nipIds[nipData.nip])});
      del(getCarry(farm, ant.carry), 'moveTo');
      del(ant, 'carry');
    }
    if (!randomInt(3)) {
      if (rand > 1) {
        // Location change.
        ant.r = 0;
        ant.nipPh = 0; // Blocks other animations.
        antNipWalk(ant, nipData, 40 + randomInt(170));
      }
      else if (rand) ant.pose == 'side' ? ant.scale *= -1 : ant.r = oppositeAngle(ant.r);
      else {
        // Pose change.
        if (ant.pose == 'side') {
          ant.pose = 'prone';
          antProneCorrection(ant);
          ant.r += randomInt(20) - 10;
          ant.y = 36 - 2 * antOffsetY(ant);
        }
        else assign(ant, {pose: 'side', scale: getSign(ant.r < deg180), r: 0, y: 36 - antOffsetY(ant)}); // To a side pose.
      }
      antUpdate(ant);
    }
  }
},

// Starts a vial animation loop if it isn't running already.  Also activates an antNipWalk() into the vial when first run.
vialLoop = nipData => vialInterval ||= setInterval((hasAnts = 0) => {
  _.farms.forEach(farm => {
    nipData = getVial(farm);
    nipData?.item.a.forEach(a => {hasAnts = 1; isAdult(a) && currentFarm(farm) && vialActivity(a, nipData)});
  });
  if (!hasAnts) vialInterval = stopInterval(vialInterval);
}, pauseDelay + randomInt(shortDelay)),

// Handles a phase 5 tube walk to insert an ant into a farm.
deNip = (ant, nipData, farm, nip = nipData.nip, tun = farm.tuns.find(t => t.nip == nip), isLeftSide = nip % 2 > 0) => {
  checkExpatQueen(ant, farm);
  // Move ant into the farm.
  // Note: some of what is done here may be redundant with what happened in phase 2 in tubeWalker(), but I believe that it has to be done again here for the sake of vials.
  ant.x = isLeftSide ? -35 : 995;
  antTransfer(farm, ant, nipData.item, farm, {
    thot: pickRandom(["That was a long walk!", "I've travelled to another world", "I'm a neighbor", "Moving in!"]),
    nipPh: 0, nipTs: 0, f: farm.id, y: tun ? (isLeftSide ? tun.y1 : tun.y2) : antGroundLevel(ant), scale: 1
  });
  carryTransfer(ant, 0, nipData.item, farm, nipData.item, farm, {f: farm.id}, undefined, 0);
  setColonyAndFoe(farm);
  ant.q = [{act: 'nip', nip: nip, rev: 1}]; // Create a new queue with the reverse nip walk action.
  ant.carry?.q2?.forEach(q => antFinnaVia(ant, q.act, {...q})); // Queue up any carry.q2 tasks that were supplied.
  // Activate.
  antAction(ant);
},

// Provides the tube walking process for ants moving between farms.
/**
 * This process is broken up into phases for each ant.
 * nipPh=0 - Ant has not begun their tube walk yet. [ant stored with first farm's nipItem]
 * nipPh=1 - Ant is currently nipWalking away from the farm.
 * nipPh=2 - Ant has completed nipWalk and reached midway.
 * nipPh=3 - Ant has been moved to the other half of the tube but has not begun their tube walk there. [ant stored with second farm's nipItem]
 * nipPh=4 - Ant is currently nipWalking towards their new farm.
 * nipPh=5 - Ant has completed nipWalk and reached their new farm.
 * nipPh=0 (again) - Ant is no longer part of this process. [ant stored directly with farm]
 */
tubeWalker = (farm, nipData, ant, nipItem = nipData.item, otherFarm = getFarm(nipData.f),
  otherData = otherFarm?.nips.find(n => n.id == nipData.id), otherNipEl = getEl('a-' + nipIds[otherData.nip])) => {
  ant.pose = 'side';
  if (ant.nipPh === 1 || ant.nipPh == 4) antUpdate(antGetStill(ant)); // We need to be picky about when to call antUpdate() here to avoid issues with carried items and other glitches.
  if (!ant.nipPh || ant.nipPh === 1 && getTime() - ant.nipTs > longDelay) antNipWalk(ant, nipData, 600); // Phase 0. (Also restart anything stuck on phase 1)
  else if (ant.nipPh == 2) {// Phase 2. Move ant to other half of tube.
    // Note: checkExpatQueen() and the "F: otherFarm.id" may seem redundant with deNip() later on but they need to be done here too to avoid problems!
    checkExpatQueen(ant, otherFarm);
    carryTransfer(ant, farm, nipItem, otherFarm, nipItem, otherData.item, {nipPh: 3, f: otherFarm.id}, otherNipEl, otherData.nip);
    antTransfer(otherFarm, ant, nipItem, otherData.item, {nipPh: 3, f: otherFarm.id}, otherNipEl);
  }
  else if (ant.nipPh == 3 || ant.nipPh == 4 && getTime() - ant.nipTs > longDelay) antNipWalk(ant, nipData, -35, 3); // Phase 3.
  else if (ant.nipPh == 5) deNip(ant, nipData, farm); // Phase 5.
},

// Starts a tube animation loop if it isn't running already.
tubeLoop = X => tubeInterval ||= setInterval((hasAnts = 0) => {
  _.farms.forEach(farm => farm.nips.forEach(nipData => nipData.item.k == 'tube' && nipData.item.a.forEach(a => {hasAnts = 1; isAdult(a) && tubeWalker(farm, nipData, a)})));
  if (!hasAnts) tubeInterval = stopInterval(tubeInterval);
}, microDelay),

// Ant actions come in a namespaced package so that the action names can be compared to strings.
// Also includes things that the ants "do" to support actions.
act = {

  // Ant is stunned while it chooses what to do next.
  idle: ant => {
    // Queue default action.
    ant.q.length < 2 && antFinna(ant, acts[ant.area.n][0]);
    (ant.q[0]?.act == 'idle' || ant.q[1] ? antNext : antAction)(antGetStill(ant), randomInt(shortDelay) + (ant.q[0].min || 0)); // Note: sometimes idle is a "phantom" action with no corresponding queue item, so this handles that.
    save();
  },

  // Ant explores the ground level of the ant farm (default activity).
  pace: (ant, faceX = antFaceX(ant), action = ant.q[0], nextAction = ant.q[1], xOffset = antOffsetX(ant),
    rand = randomInt(5000), collision = antCollision(ant), ant2 = collision?.a) => {
    antSetWalk(ant);
    ant.pose = 'side';
    antArea(ant, 'top');
    // Move ant.
    antMoveSurface(ant, nextAction?.tx ? abs(nextAction.tx - faceX) : 3);
    action.for && action.for--;
    if (collision && !antsWillAvoid(ant, ant2)) {
      if (ant2.carry?.Q == ant.id) return antActionStill(ant, randomInt(pauseDelay)); // Queen pauses for a hand-off.
      else if (ant.carry?.Q == ant2.id || antFight(ant, ant2)) {
        // Pop off irrelevant actions that are in the way.
        while (ant.q[0] && !['fight', 'srv'].includes(ant.q[0].act)) ant.q.shift();
        return antActionStill(ant); // Progress to the 'srv' or 'fight' action.
      }
    }
    // Recalculate faceX because ant moved.
    faceX = ant.x + ant.scale * xOffset;
    // Check if the ant is set to reach a certain target and hand it off to another action.
    // Note: This code assumes .tx is never set to 0.
    if (!action.for && nextAction && (!nextAction.tx || abs(nextAction.tx - faceX) < xOffset)) antNextStill(ant, randomInt(microDelay));
    else if ((ant.scale < 0 && faceX <= xOffset) || (ant.scale > 0 && faceX >= 960 - xOffset) || !nextAction && !rand || (nextAction?.tx && (nextAction.tx - faceX) * ant.scale < 0)) {// Edge of farm (pause + flip), random, or heading the wrong way on a tx target.
      // Detect flip-flop: tx target is so close it falls inside the body on both orientations.
      // Count consecutive wrong-way flips; only reset once the ant has walked clear of the contested
      // zone (one step further than antOffsetX(ant) past where the flip streak began).
      if (nextAction?.tx && (nextAction.tx - faceX) * ant.scale < 0) {
        if (!action.flp) action.flpX = faceX; // Mark where this flip streak started.
        if ((action.flp = (action.flp || 0) + 1) > 3) {
          del(action, 'flp', 'flpX');
          antInstaQ(ant, {act: 'pace', for: randomInt(99)}, 0); // Walk to a fresh position before retrying.
        }
      }
      else if (!action.flp || abs(faceX - action.flpX) > xOffset) del(action, 'flp', 'flpX'); // Not flipping, and clear of the contested zone, reset.
      // Flip direction (with brief pause). Also covers the at-edge-of-farm case.
      antActionStill(ant, randomInt(microDelay) + (action.flp ? randomInt(pauseDelay) : 0));
      ant.scale *= -1; // <-- Yes, this has to be here after antAction() to set up the next loopback, rather than do it right away.  Looks better.
      ant.r = antHillAngle(ant); // <-- And yes, thanks to setting the scale here we gotta do this too on a flip'n'pause or it looks silly.
      ant.carry && antUpdate(ant); // <-- Ugh yeah and that too, or whatever it's carrying lags behind upon a direction flip.
    }
    else rand < 5 ? antActionStill(ant, randomInt(pauseDelay)) : antAction(ant); // Pause or continue.
    // Apply corpse proximity penalty.
    antCorpseProximity(ant);
  },

  // Ant needs to go to an area before executing the desired act.  See antFinnaVia() for how this is currently used.
  via: (ant, action = ant.q[0], queue = []) => {
    if (!action?.n || ant.area.n != action.n && action.n !== 1) {
      if (action.n == 'bg') {
        ant.area.t && queue.push({act: 'climb'});
        queue.push({act: 'crawl'});
      }
      else if (action.n == 'bot') {
        ant.area.n == 'bg' && queue.push({act: 'uncrawl'});
      }
      else {
        // Default 'top' area.
        ant.area.t && queue.push({act: 'climb'});
        ant.area.n == 'bg' && queue.push({act: 'uncrawl'});
      }
    }
    queue.push(assign(action, {act: action.via}));
    antInstaQ(ant, queue);
    antNext(ant);
  },

  // Start or continue digging.
  dig: (ant, farm = getFarm(ant), currentDig = getById(farm.dig, ant.digT) || pickRandom(farm.dig), action = ant.q[0], tun = getTun(farm, action.id), antType = types[ant.t],
    digAmt = antType.v * .2, nudger, temp, dir,
    entNudge = (ant, tun) => nudger = setInterval(X => {
      ant.x += getSign(antFaceX(ant) < tun.x1) * random();
      ant.y = antGroundLevel(ant) + 2;
      ant.r = antHillAngle(ant) + tun.prog / 9 + randomInt(5);
      antUpdate(ant);
    }, num200),
    // Con nudge replicates a lot of logic from the dive() function's rotWalk setup, and rotWalk() itself.  It was decided that refactoring them together would not be enough benefit.
    conNudge = (ant, tun, nextTun = isRotationTunnel(tun) && ant.digT != tun.id && getTun(farm, ant.digT), bump = randomInt(4) - 2, step = antGetTunnelStep(ant),
      finalAngle = (nextTun ? tunExitAngle(nextTun, getTunSub(farm, tun)) : normalize180(tunAverageAngle(farm.tuns.filter(t => t.dun && t.co.includes(tun.id)), tun))) + randomInt(60) - 30,
      frontDist = (tun.h / 2) * (tun.prog / 100),
      frontRad = degToRad(ant.scale < 0 ? deg180 - ant.r : ant.r),
      dest = nextTun ? getConnectionPoint(tun, nextTun) : {x: tun.x1 + cos(frontRad) * frontDist, y: tun.y1 + sin(frontRad) * frontDist},
      destX = dest.x + bump, destY = dest.y + bump,
      headPoint = antHeadPoint(ant),
      nearDest = getHypot(destX - headPoint.x, destY - headPoint.y) < antOffsetX(ant),
      travelAngle = normalize180(getAngle(headPoint, {x: destX, y: destY})),
      ang = nearDest ? normalize180(ant.r) : (ant.scale < 0 ? mirrorAngle(travelAngle) : travelAngle),
      distComp = calcDistComponents(headPoint.x, headPoint.y, destX, destY),
      dist = round(getHypot(destX - headPoint.x, destY - headPoint.y) / getHypot(distComp.x * step, distComp.y * step)),
      td = dist,
      sX = (destX - headPoint.x) / dist, sY = (destY - headPoint.y) / dist,
      phaseCutoff = nearDest ? 0 : .6 // Skip phase 1 entirely when nearDest.
    ) => {
      nudger = setInterval(X => {
        let progress = 1 - dist / td;
        if (--dist > 0) {
          antSetWalk(ant);
          ant.r = progress < phaseCutoff ? lerpAngle(normalize180(ant.r), ang, easeOutQuad(progress / phaseCutoff)) : // Phase 1 (far): face travel direction.
            lerpAngle(ang, ant.scale < 0 ? mirrorAngle(finalAngle) : finalAngle, easeInQuad((progress - phaseCutoff) / (1 - phaseCutoff))); // Phase 2 (near): swing to final angle.
          ant.x += sX;
          ant.y += sY;
        }
        else (antGetStill(ant), stopInterval(nudger));
        if (cos(degToRad(ant.r)) < 0) ant.pose = 'prone'; // Enforce prone pose in a legs-up scenario.
        antUpdate(ant);
      }, frameTick);
    }, ent) => {
    if (farm.dun || isDrone(ant)) antNext(ant); // No digging required.
    else if (ant.digD && tun) {
      antRemAnimUpdate(ant); // Reset animations.
      setTimeout(X => antUpdateClasses(ant, {dig: 1, jit: 1}), randomInt(num1000)); // Random delay added so ants aren't synch'd on page load.
      temp = getTun(farm, action.path[0]);
      tun.rwip = !isRotationTunnel(tun) && temp.x1 == tun.x2 && temp.y1 == tun.y2; // Mark tunnels that are being built backwards, based on which end the ant actually entered from.
      // Digging movement and animations.
      if (!farmIsDeveloping(farm) && farmHasQueen(farm)) digAmt *= 1.5; // Ants dig faster if there is a Queen and farm is undeveloped.
      if (isQueen(ant)) digAmt *= 3; // Queens only dig when there are no workers, but do it much faster.
      if (!isRotationTunnel(tun)) {
        digAmt *= (tun.t == 'cav' ? .1 : .3); // Long tunnels are dug slow, with cav chambers the slowest of all.
        if (tun.prog < tunPercent(tun, 8)) {
          // Ant would have been blocked from entering tunnel by the dive action, so continue to act like it's digging an entrance or con.
          tun.co.includes(last(action.path)) ?
            entNudge(ant, getTun(farm, last(action.path))) :
            conNudge(ant, farm.tuns.find(t => tun.co.includes(t.id) && t.t == 'con' && t.dun && t.x1 == (tun.rwip ? tun.x2 : tun.x1)));
        }
        else {
          // Default nudger; just brings the ant closer to the edge of the dig area every 2 seconds if needed.
          nudger = setInterval(X => {
            temp = findTunPos(ant, farm, [tun]);
            dir = getSign(!tun.rwip);
            // Note: Small ants in cavs on the next line are fudged to get a little closer to the frontline because it looks better.
            temp?.tun?.id == tun.id && dir * (temp.pc + dir * tunPercent(tun, (antGetSize(ant) == 's' && tun.t == 'cav' ? 0 : antOffsetX(ant)) + antGetTunnelStep(ant))) < dir * (tun.rwip ? 100 - tun.prog : tun.prog) && antMoveTunnel(ant);
            antUpdate(ant);
          }, num2000);
        }
      }
      else (tun.t == 'ent' ? entNudge : conNudge)(ant, tun);
      // Everything from now on happens after a significant delay.
      // This makes the digging slow, and prevents an exploit where reloading skips the wait-time in digging.
      setTimeout(X => {
        // Incremement progress based on the size of the tunnel.
        tun.t == 'ent' && tun.co.forEach(t => t.prog = tunPercent(t, tunPixels(tun, tun.prog / 2))); // For entrances also increment the connected tunnels like they've been dug a little too, or it takes too long.
        tun.t == 'cav' && (tun.prog < tunPercent(tun, 15) || tun.prog > tunPercent(tun, 85)) && (tun.prog += digAmt); // For the first and last 15px of cavities, double the build progress, because this part looks goofy.
        tun.prog = min(100, tun.prog + digAmt);
        currentFarm(farm) && tunProgDraw(tun);
        if (tun.t == 'tun' || tun.t == 'cav') {
          // Pick an adjacent hill and increase its height slightly.
          // To know it is adjacent; the hill should have the same index as the current tunnel system, or one higher.
          temp = farm.hills[farm.tuns.findIndex(t => t.id == last(action.path)) + randomInt(1)]; // Hill.
          temp.h = min((temp.r - temp.l) / 4, temp.h + .005); // Cap hill heights at a quarter their width.
          setTimeout(X => currentFarm(farm) && hillProgDraw(temp), standardDelay);
        }
        // Track how long ant has been digging.
        ant.digD++;
        // Digging depletes ant's stats.
        antStats(ant, {fd: -.005, dr: -.003, hp: -.01});
        // Remove digging behaviour here, it'll be reapplied if a loopback via antAction() occurs.
        stopInterval(nudger);
        antRemAnimUpdate(ant);
        // The ant will stop digging if...
        // There was no tunnel found to dig, or the current tunnel piece is finished.
        // On a RANDOM chance when one of the following conditions is met: Dig duration is high, or queue exists.
        // Or the ant is low on hp.
        // Or there are at least 3 ants working on the same tunnel.
        if (tun.prog == 100 || ((ant.digD > 5 || ant.q[1]) && !randomInt(5)) || ant.hp < 20 || farm.a.filter(a => a.digD && a.digT == ant.digT).length > 3) {
          if (tun.prog == 100 && !tun.dun) {
            // Remove this tunnel piece from the dig list.
            farm.dig = farm.dig.filter(d => d.id != tun.id);
            del(ant, 'digT');
            if (tun.t == 'ent') {
              msg(`Ants have dug a tunnel entrance in "${farm.n}"`);
              score(1);
            }
            else if (tun.t == 'tun') {
              msg(`A connector tunnel has been completed in "${farm.n}"`);
              score(2);
            }
            else if (tun.t == 'cav') {
              msg(`A new chamber cavity has been finished in "${farm.n}"`);
              score(5);
            }
            tun.dun = 1; // Mark as 'dun' so we don't rerun this block of code, and so there is a nice way to test for finished tunnels.
            // Perhaps they should automatically 'grow' into place on a slow timer or something, if ONE OF THE adjacent tunnels in their 'co' property is completed.
          }
          // Dig end.
          waypointsUpdate(farm);
          ant.area.n == 'bot' && antInstaQ(ant, {act: 'climb'});
          del(ant, 'digD');
          ant.area.t && antChangeTunDir(ant, tun);
          antNext(ant);
        }
        else antAction(ant);
      }, standardDelay - randomInt(pauseDelay));
    }
    else {
      // Setup.
      ant.digD = 1;
      // Pick the tunnel the ant will dig, preferring the last tunnel it was digging, otherwise choose one that another ant was digging.
      // If none was picked, or there is only one to choose from plus random chance, find where ant could dig.
      if (!currentDig || farm.dig.length < 2 && !randomInt(25)) {
        // Pick a random entrance and find an incomplete tunnel that it leads to.
        ent = pickRandom(farm.tuns.filter(t => t.t == 'ent' && t.dun));
        if ((temp = ent && randomInt(9) && findPath(farm, ent, {dun: 1, t: 'ent'}, 1, 1, ent.id)) && temp.length) {// Inverted match.
          tun = getTun(farm, last(temp));
          // Store the path to get to a dig job, and pass it along to the dive action, so all ants use the same trail to get there otherwise they will enter the dig tunnel from the wrong end later.
          currentDig = {id: tun.id, path: [ent.id, ...temp].reverse().slice(1)};
          // Reject jobs that are: duplicate jobs, too close to a morgue, or a "down tun" being dug from the bottom end.
          getById(farm.dig, currentDig.id) || getTun(farm, currentDig.id).co.some(t =>
            getTun(farm, t).morgue || getTun(farm, t).co.some(nt => getTun(farm, nt).morgue) || (tun.dt && getTun(farm, currentDig.path[0]).lvl > tun.lvl)
          ) ? currentDig = 0 : farm.dig.push(currentDig);
        }
        else {
          // Dig a new entrance.
          if (tun = pickRandom(farm.tuns.filter(t => t.t == 'ent' && !t.dun))) farm.dig.push(currentDig = {tx: tun.x1, id: tun.id, path: []});
          else if (farm.tuns.every(t => t.dun)) farm.dun = 1; // Nothing more to do.
        }
      }
      if (currentDig) {
        tun = getTun(farm, currentDig.id);
        currentDig.pc = tun.rwip ? 100 - tun.prog : tun.prog;
        ant.digT = tun.id;
        antFinnaVia(ant, 'dive', {tun: currentDig.id, pc: currentDig.pc, path: [...currentDig.path]/* START-DEV */, reason: 'setup'/* END-DEV */}); // Can't use makeDiveStub() because it allows bot->bot dives, we always want from surface.
        antFinna(ant, 'dig', currentDig);
      }
      save();
      antNext(ant);
    }
  },

  // Climb sets up a dive path to the surface.
  climb: (ant, farm = getFarm(ant), climbQ = [], tunPos) => {
    if (ant.area.t) {// Sometimes climb is in an ant's queue erroneously :/
      let tun = getTun(farm, ant.area.t), path = findPath(farm, tun, {dun: 1, t: 'ent'}, 1);
      // Create a custom queue.
      if (!path && tun.t == 'ent' && !tun.dun) {
        antArea(ant, 'top');
        path = [];
      }
      if (path) {
        ant.area.t && path.length && climbQ.push(makeDiveStub({id: last(path)/* START-DEV */, stub: 'climb' /* END-DEV */}));
        climbQ.push({act: 'pace', for: 9 + randomInt(99)});
        // Prepend the climb queue to the main queue.
        antInstaQ(ant, climbQ);
      }
    }
    antNext(ant);
  },

  // Burrowing action.
  dive: (ant, farm = getFarm(ant),
      action = ant.q[0],
      tun = getTun(farm, action.id),
      nextAction = ant.q[1],
      nextTun = nextAction?.act == 'dive' && getTun(farm, nextAction.id),
      wp = wayPoints[farm.id][getWaypointIndex(farm, ant.pose == 'side' ? antFootPoint(ant) : ant, action.wp)]
        || wayPoints[farm.id][getWaypointIndex(farm, antHeadPoint(ant), action.wp)],
      previousTun = getTun(farm, action.pt), step = antGetTunnelStep(ant), executeAction = 1,
      nextTunAngle = tun && nextTun ? tunExitAngle(nextTun, getTunSub(farm, tun)) : 0,
      badAngle = ant.scale * (nextTun?.r - 90) > 0,
      data = [], dest, temp1, temp2, temp3
  ) => {
    if (tun) {
      // This is a fully expanded dive queue; determine destinations.
      if (isRotationTunnel(tun) ? nextTun && nextTun.prog < tunPercent(nextTun, 8) || !tun.dun : tun.prog < tunPercent(tun, 8)) return antNext(ant); // Protect against entering underbuilt tunnels.
      if (tun.t == 'ent') {
        if (nextTun) {// If there is a nextTun it must mean that ant.area.n=='top', by virtue of other code knowing not to queue a dive into an entrance with no nextTun.
          if (tun.co.length > 1) badAngle = 1; // Reduce risk of ants trying to side-walk down the wrong tunnel from a two-way entrance. Same issue as con's "Figure out where the ant will wind up" below, except handled in a lazy way.
          // Entering from surface; get the entrance point of a tunnel.
          temp1 = calcDistComponents(nextTun.x1, nextTun.y1, nextTun.x2, nextTun.y2); // Distance components.
          temp2 = min(6, temp1.d * (nextTun.prog / 100)); // Actual distance.
          temp3 = (nextTun.h / 2 - antOffsetY(ant)) * (badAngle ? 0 : ant.scale); // Offset.
          dest = {x: (nextTun.rwip ? nextTun.x2 : nextTun.x1) + temp1.x * temp2 - temp1.y * temp3, y: (nextTun.rwip ? nextTun.y2 : nextTun.y1) + temp1.y * temp2 + temp1.x * temp3}; // Don't use getConnectionPoint() here - it's not as good.
        }
        else {
          // Ant is about to surface; predict how it should end up.
          !action.pt && antToProneWithCorrection(ant, tun); // Can't remember what this is for, maybe digging?
          data = cloneData(ant); // Set data variable to a fake ant so we can test it out.
          data.scale = wp && ant.pose == 'side' ? getTunSide(getTun(farm, action.pt), wayPoints[farm.id][getWaypointIndex(farm, antFootPoint(ant), wp)]) : randomSign();
          data.x = (data.scale > 0 ? max : min)(ant.x, tun.x1) + 7 * data.scale;
          data.y = antGroundLevel(data);
          dest = data;
          nextTunAngle = antHillAngle(data);
          if (data.scale < 0) nextTunAngle = oppositeAngle(nextTunAngle);
          action.sc = data.scale;
        }
        // Flag a rotWalk.
        executeAction = 2;
      }
      else if (tun.t == 'con' || tun.t == 'jun') {
        if (ant.pose == 'prone') {
          // Just rotWalk to the next tunnel.
          dest = getConnectionPoint(tun, nextTun, farm);
          if (nextTun.t == 'cav') dest.y += randomInt(8) - 4; // Randomize it a bit for cavities.
          // Flag a rotWalk.
          executeAction = 2;
        }
        else if (nextTun) {
          // Figure out where the ant will wind up if it continues in side pose.
          temp2 = getAntWaypointDirection(ant, farm, wp); // Precalculate this as it is too hefty to do in the do-loop.
          do {
            wp &&= getNextWaypoint(farm, wp, temp2);
            temp1 = wp && getTun(farm, getWaypointTunnel(farm, wp, tun));
          } while (wp && (!temp1 || temp1.id == tun.id || temp1.id == action.pt || temp1.t == 'jun')); // Seek until the first reportable tun that is non-current non-previous non-jun is found.
          // Check if next tunnel is not the one ant is heading to, or any other action's tunnel after that.
          // Note: This assumes there isn't some OTHER kind of act wedged in between expanded future dive actions.
          if (temp1 && !ant.q.some(a => a?.act == 'dive' && a.id == temp1.id)) {
            // Ant is creeping toward wrong tunnel - switch to prone to make a proper turn, and loopback to this function.
            antToProneWithCorrection(ant, tun);
            return antActionStill(ant);
          }
          // NOTE: At this point the execution should fall through to the "if (executeAction > 1) {" part of the code.
        }
        else return antNextStill(ant); // Side pose, no nextTun: ant is already at the destination con.
        // Check for an unusual "starting dive in the wrong con" scenario.  This situation was observed once near an entrance, and an extra condition for setting badAngle was added above to minimise the chances.
        // But this may potentially also occur if two tuns begin almost parallel with each other and the random direction prone walking algorithm permits ant to cross the waypoint-less threshold into the wrong one.
        // Update: Now due to added complexity this code block can execute to handle other situations too.
        temp1 = findTunPos(ant, farm, [nextTun, tun, ...(nextTun?.co || []), ...tun.co]); // Seems like a good idea to keep this test exactly consistent with the one in tunWalk().
        if (temp1 && tun.id != temp1.tun.id && nextTun?.id != temp1.tun.id) {
          temp2 = getTun(farm, ant.area.t);
          if (temp1.tun.c == tun.id) {// This is a shortcircuited check for a 'jun'.
            // Resolved into a sibling junction based on getTunPosition.
            // Only retarget if it leads directly to nextTun otherwise keep heading for the original con.
            if (temp1.tun.co.includes(nextTun?.id)) {
              /* START-DEV */
              action.oldId = action.id;
              action.retargetReason = 'tunPos';
              /* END-DEV */
              action.id = temp1.tun.c; // Retarget OR skip early return.
            }
          }
          else if (temp2?.c == tun.id) {// This is a shortcircuited check for a 'jun'.
            // Resolved into a sibling junction based on ant.area.
            // Only retarget if it leads directly to nextTun otherwise keep heading for the original con.
            if (temp2.co.includes(nextTun?.id)) {
              /* START-DEV */
              action.oldId = action.id;
              action.retargetReason = 'antArea';
              /* END-DEV */
              action.id = temp2.c; // Retarget OR skip early return.
            }
          }
          else {
            if (temp1.tun.co.includes(tun.id)) {
              // Wait... the con we want to be in connects to this tun.  Let's prone walk to the con we thought we'd be in and pick this dive path up again.
              antToProneWithCorrection(ant, tun);
              antInstaQ(ant, {act: 'dive', id: getTunSub(farm, temp1.tun).id/* START-DEV */, oldId: action.id, retargetReason: 'toCon'/* END-DEV */}, 0);
            }
            else {
              // Somethings wrong.  The ant wandered into the wrong tunnel on a previous iteration, but our tunnel walking functions didn't handle this exact situation properly and redirected ant backwards,
              // and now the queue expects that we're up to a certain 'con' piece (we probably are not) and that may be because that con is the site of a current dig operation.
              // Note: This situation might not arise very often, and this may be an improper way of handling the case anyway.
              /* START-DEV */
              action.oldId = action.id;
              action.retargetReason = 'other';
              /* END-DEV */
              action.id = temp1.tun?.id; // Update the action to where the ant actually is and immediately do another pass.
            }
            return antActionStill(ant);
          }
        }
        if (dest && getHypot(ant.x - dest.x, ant.y - dest.y) > 80) {
          // An ant is attempting to do a rotWalk but it is so far away from the tunnel that it is suspicious.
          // @WORKAROUND
          /* START-DEV */
          console.error(ant.id, "rotWalk setup too far! tun:", tun.id, "antArea:", ant.area.t, "tunPos:", temp1.tun.id,
            `ant:(${ant.x.toFixed(0)},${ant.y.toFixed(0)})`, `dest:(${dest.x.toFixed(0)},${dest.y.toFixed(0)})`, "distance:", getDistance(ant, dest).toFixed(0),
            "ant", JSON.stringify(ant), "action", JSON.stringify(action), 'tuns', JSON.stringify(farm.tuns)
          );
          /* END-DEV */
          ant.q = [];
          return antActionStill(ant);
        }
      }
      if (nextTun) {
        if (!tun.co.includes(nextTun.id)) {
          // Next tunnel isn't actually connected directly to this one. So we'll insta queue a dive from here to there.
          tun.id != nextTun.id && antInstaQ(ant, {act: 'dive', tun: nextTun.id/* START-DEV */, reason: 'linkUp'/* END-DEV */}); // Also protect from redirecting when next tun is this tun, which can happen.
          return antNextStill(ant);
        }
        nextAction.pt = nextAction.id == tun.id ? action.pt : tun.id; // Notify the next action of the previous tunnel under normal conditions.
      }
      if (executeAction > 1) {
        // Rot Walk execution.
        // Work out step (step size) and dist (num steps / frames).
        temp1 = calcDistComponents(ant.x, ant.y, dest.x, dest.y);
        // Important: While there are distance calculations on this next line the final value actually represents "Number of frames" don't get this twisted!
        action.dist = round(getHypot(dest.x - ant.x, dest.y - ant.y) / getHypot(temp1.x * step, temp1.y * step)); // Note: There is a getDistance() usage candidate here, but we aren't currently including that function in production.
        // Switch to prone when entering tunnel from surface at a badAngle.
        badAngle && setTimeout(X => {ant.pose = 'prone'}, action.dist / frameTick * 2);
        if (tun.t == 'ent') action.dist *= .8; // Speed up entry transitions.
        assign(action, {
          r: normalize180(ant.r), // Initial angle.
          td: action.dist, // Initial total distance.
          ang: normalize180(getAngle(ant, dest)), // Travel angle.  Orient to connection point.
          rot: normalize180(nextTunAngle), // Final angle.  Orient to tunnel.
          // Step sizes.
          sX: (dest.x - ant.x) / action.dist,
          sY: (dest.y - ant.y) / action.dist,
          // Override 'dive' with the relevant walking action and execute.
          act: 'rotWalk'
        });
        // If rot (final angle) is nearly straight ahead but ang (travel angle) would require turning sharply away, the ant has likely passed the connection point.
        temp1 = normalize180(action.ang - action.r); // Degrees ant must turn to face ang.
        temp2 = normalize180(action.rot - action.r); // Degrees ant must turn to face rot.
        if (abs(temp2) < 15 && abs(temp1) > 90) action.ang = action.rot; // rot is roughly ahead, ang is sharply behind - skip phase 1.
        if (tun.t == 'jun') {
          // Hack; ants turning in a jun can't turn too much to nextTunAngle or they "slide" into place. Let's soften their exit angle.
          temp1 = normalize180(action.rot - action.ang);
          action.rot = normalize180(action.ang + sign(temp1) * min(abs(temp1) / 2, 30)); // Half the diff, capped at 30deg.
        }
        if (ant.scale < 0) {
          action.ang = normalize180(mirrorAngle(action.ang));
          action.rot = normalize180(mirrorAngle(action.rot));
        }
        antArea(ant, 'bot', tun.id);
        antAction(ant);
      }
      else {
        // Tun Walk execution.
        if (!tun.dun && ant.digT != tun.id && nextAction.act != 'dive') {
          // Non-dun tun destination without matching digT prop - the ant has no business being sent here.  Abandon entire queue.
          // @WORKAROUND
          /* START-DEV */
          console.log(ant.id, "destination is incomplete tunnel and ant is not digging there", JSON.stringify(ant), JSON.stringify(tun), JSON.stringify(farm.dig));
          /* END-DEV */
          ant.q = [];
          return antActionStill(ant);
        }
        // Work out whether the ant is meant to be walking in reverse (towards the 0% point of the tunnel).
        if (nextTun) {
          temp3 = getTunSub(farm, nextTun);
          action.rev = tun.x1 == temp3.x1 && tun.y1 == temp3.y1; // If there's a nextTun use its connection to this tunnel to judge whether we're doing a reverse walk.
        }
        else if (previousTun) {
          // No next tun, but if there's a prevTun use its connection to this tunnel to judge whether we're doing a reverse walk.
          temp1 = getTunSub(farm, previousTun);
          action.rev = tun.x2 == temp1.x2 && tun.y2 == temp1.y2;
        }
        else if ('pc' in action && (temp1 = findTunPos(ant, farm, [tun, ...tun.co])) && temp1.tun) {
          // We're probably going to another spot within the exact same tunnel, so judge whether we're doing a reverse walk based on the relative position of the ant to the supplied target percentage.
          action.rev = temp1.tun.id == tun.id ? temp1.pc > action.pc : squareDistance(ant.x - tun.x1, ant.y - tun.y1) > squareDistance(ant.x - tun.x2, ant.y - tun.y2);
        }
        // Work out a default target percentage if one isn't supplied.
        if (typeof action.pc != 'number') action.pc = action.rev ? 0 : 100;
        // Track the current position (in percentage) of the ant.
        action.dist = action.rev ? 100 : 0; // This is wrong if the ant starts inside the target tunnel but it will be corrected after one step in tunWalk.
        // If we're not in a rotational tunnel (even the pt that we ignored earlier), then perform a side-correction in case there's a direction mismatch.
        !isRotationTunnel(tun) && ant.pose == 'side' && antDir(ant, tun) == action.rev && antSideCorrection(ant, tun, wp);
        // Store the waypoint.
        action.wp = wp;
        // Override 'dive' with the relevant walking action and execute.
        action.act = 'tunWalk';
        antArea(ant, 'bot', tun.id);
        antAction(ant);
      }
    }
    else {
      // Setup.
      temp2 = getTun(farm, ant.area.t);
      // Start by double-checking if the tunnel the ant thinks it is in is actually the tunnel it seems like it is in.
      if (temp2 && (temp1 = findTunPos(ant, farm, [temp2, ...temp2.co])) && temp1.tun?.id != temp2.id) antArea(ant, 'bot', temp1.tun.id);
      (temp2 = getTun(farm, ant.area.t))?.t == 'jun' && antArea(ant, 'bot', temp2.c); // Cheat jun starting tuns by saying ant is in the con instead.
      // No dive queue - select tunnels and create queue.
      if (tun = action.tun ? getTun(farm, action.tun) : pickRandom(farm.tuns.filter(t => t.t == 'cav' && t.dun && !t.morgue))) {
        // Calculate a temp path in reverse for consideration in assembling queue data.
        temp1 = action.path ?? findPath(farm, tun, ant.area.n == 'top' ? {dun: 1, t: 'ent'} : {id: ant.area.t}, 1);
        if (ant.area.n == 'top' && (temp1 || tun.t == 'ent')) {
          // On the top level, need to pace to the tunnel entrance first.
          dest = tun.t == 'ent' ? tun : getTun(farm, temp1.pop()); // Get the entrance tun.
          data.push({act: 'pace'});
          data.push({act: 'dive', tx: dest.x1, id: dest.id/* START-DEV */, reason: 'ent'/* END-DEV */});
        }
        if (dest?.id != tun.id) {// Skip this block if the above block already delivered the ant all the way to its actual target.
          if ((temp3 = ant.area.t && getTun(farm, ant.area.t)) && ( // Ant is already positioned in a tunnel.
            !temp1 // No path to target could be calculated (target tun must be in an unconnected tunnel system).
            || !temp1.length && (temp3.id != tun.id) // Empty path given or calculated, but target tun is not ant's positioned tun.
            || temp1.length && (temp3.id != last(temp1) || getTun(farm, last(temp1)).t == 'ent') // Path given or calculated, but start tun is not ant's positioned tun or it is an entrance.
          )) {
            // Need to climb out of the current tunnel system and do a fresh retry.
            data.push({act: 'climb'});
            data.push({...action, tun: tun.id});
          }
          else {
            temp1?.reverse().forEach(tunId => data.push({act: 'dive', id: tunId/* START-DEV */, reason: 'path'/* END-DEV */}));
            // Rebuild the current action into the final destination action.
            action.id ||= tun.id;
            action.pc ||= !isRotationTunnel(tun) && min(tun.prog, 20 + randomInt(60));
            data.push(action);
          }
        }
        // Add the queue data to the front of the finna queue for instant execution.
        antInstaQ(ant, data);
      }
      // Execute queue.
      antNext(ant);
    }
  },

  // Rotational walk for tunnel entrances and tunnel 'con' pieces.
  rotWalk: (ant, farm = getFarm(ant), action = ant.q[0], tun = getTun(farm, action.id), nextAction = ant.q[1],
    nextTun = nextAction?.act == 'dive' && getTun(farm, nextAction.id), phaseCutoff = .6, progress = 1 - action.dist / action.td) => {
    ant.walk = ant.jit = 1; // Add a class to CSS 'jitter' the ant, because rotWalks are awkwardly "smooth" compared to other ant walking.
    if (--action.dist > 0) {
      // One step of rotation.
      ant.r = progress < phaseCutoff ? lerpAngle(action.r, action.ang, easeOutQuad(progress / phaseCutoff)) : // Phase 1: Orient to point.
        lerpAngle(action.ang, action.rot, easeInQuad((progress - phaseCutoff) / (1 - phaseCutoff))); // Phase 2: Orient to final angle.
      ant.x += action.sX;
      ant.y += action.sY;
      antAction(ant, frameTick + randomInt(frameTick / 2)); // Extra random frame delay added to prevent animation looking too "smooth".
    }
    else {
      // Rotation complete.
      antRemAnimUpdate(ant);
      if (!nextTun && tun?.t == 'ent') antNextSurface(assign(ant, {scale: action.sc || 1})); // Special case for ants that have just surfaced.
      else {
        ant.pose == 'prone' && antProneCorrection(ant);
        antNext(ant);
      }
    }
    // Apply corpse proximity penalty.
    antCorpseProximity(ant);
  },

  // Burrowing walk-along action.
  tunWalk: (ant, farm = getFarm(ant), action = ant.q[0], tun = getTun(farm, action.id), nextAction = ant.q[1],
      nextTun = nextAction?.act == 'dive' && getTun(farm, nextAction.id),
      wp = wayPoints[farm.id][getWaypointIndex(farm, ant.pose == 'side' ? antFootPoint(ant) : ant, action.wp)]
        || wayPoints[farm.id][getWaypointIndex(farm, antHeadPoint(ant), action.wp)], // Same param as in dive()!
      wpSet, wpTargetLen,
      temp1, temp2, temp3 // Reuse temp vars as various values and bits of data are juggled here, and this saves declaring a whole bunch.
    ) => {
    antSetWalk(ant);
    // Move along in tunnel.
    if (ant.pose == 'side') {
      // Note: We don't ever check collisions in side pose, this is intentional.
      if (wp) {
        /* START-DEV */
        devHighlightWaypoint(farm, wp, 'black', 200);
        /* END-DEV */
        temp1 = getAntWaypointDirection(ant, farm, wp);
        wpSet = [wp];
        if (temp1) {
          // Get the nearest waypoints to align the ant to.  This algorithm seeks backwards and forwards from the current central waypoint,
          // as opposed to considering the rear and front footpoints, which fail to register when the ant is rotating around a corner.
          while (wpSet[0] && wpSet.length < 2 && (temp3 = getNextWaypoint(farm, wpSet[0], -temp1))) wpSet.unshift(temp3); // Behind
          wpTargetLen = wpSet.length + 3; // Precalculate this value as length changes on the next line.
          while (wpSet.length < wpTargetLen && (temp3 = getNextWaypoint(farm, last(wpSet), temp1))) wpSet.push(temp3); // Ahead
          /* START-DEV */
          wpSet.forEach(wpoint => {
            if (wpoint != wp) {
              devHighlightWaypoint(farm, wpoint, '#333', 200);
            }
          });
          /* END-DEV */
          // Determine ant's new angle.
          temp1 = getWaypointAngle(wpSet); // Desired angle.
          if (ant.scale < 0) temp1 = mirrorAngle(temp1);
          temp2 = normalize180(temp1 - ant.r); // Diff.
          // Test for hard turns - Note: this is rarer since the addition of 'jun' tunnels that soften such waypoint angles.
          if (temp2 > 120) {// Note: This cutoff of 120 can probably go as low as ~90 (to abort on softer angles) and as high as ~160 (if giving up on corners it should attempt).
            // Encountered a waypoint set containing a potential hook turn.  We'd rather not follow the waypoints here, so just use prone pose.
            antToProneWithCorrection(ant, tun, action.rev);
            action.ns = 1; // Mark this action as "no switch" to prevent random pose switching. (no need for getTime() on this one because it is in prone pose)
          }
          else {
            // Update the ant's rotation, but cap it as a certain amount of degrees per step.
            ant.r = normalize360(ant.r + clamp(temp2, -40, 30)); // Higher allowance for back-tilts.
            // Nudge ant closer to wp if needed but counter-nudge for ants doing turns.
            abs(temp2) > 15 ? antNudgeUp(ant) : antNudgeToWP(ant, wp);
            // If an ant's body is closer to the waypoint than it's foot, it is possibly out-of-bounds, do a big nudge "up".
            squareDistanceCoords(antFootPoint(ant), wp) > squareDistanceCoords(ant, wp) && antNudgeUp(ant);
          }
          // Tilt ant back if its head is out of the tunnel.
          temp1 = 0;
          while (!findTunPos(antHeadPoint(ant), farm, [tun, ...tun.co]) && temp1++ < 36) {
            ant.r = normalize360(ant.r -5);
          }
        }
      }
      if (!wp) {
        // Lost waypoint.
        antToProneWithCorrection(ant, tun, action.rev);
        action.ns = 1; // Mark this action as "no switch" to prevent random pose switching. (no need for getTime() on this one because it is in prone pose)
      }
      // For safety we will drop the 'ns' flag on side posed ants after 30 seconds, which may be preventing the ant from getting out of a jam.
      if (action.ns > 1 && getTime() - action.ns > standardDelay) action.ns = 0;
    }
    else {
      // Prone walk roughly towards the destination with collision corrections.
      if (!randomInt(4)) ant.r = normalize360(ant.r + randomSign()); // Add a little random wobble to the angle.
      if (temp3 = antCollision(ant)) {
        // Ant is going to collide with another ant.
        temp2 = temp3.a;
        if (antsWillAvoid(ant, temp2)) {
          // Note: We also give a hall pass to low hp ants as they need to hurry through their queue.
          if (ant.pose == 'prone' && temp2.pose == 'prone' && tun.t == 'cav' && ant.hp > 9) {
            if (antCheckAvoidance(antGetStill(ant), temp2)) {// Note: antGetStill() slipped in here so the ant doesn't treadmill in place when halted by collision.
              // Avoid this ant.
              temp1 = calcDistComponents(temp2.x, temp2.y, ant.x, ant.y);
              ant.r = normalize360(ant.r - temp3.d * 2 * (!randomInt(9) ? -9 : 1));
              ant.x += temp1.x / 2;
              ant.y += temp1.y / 3;
            }
            // Track ant avoidance duration so we can stop doing it if it gets too insane.
            antTrackAvoidance(ant, temp2);
          }
        }
        else if (temp2.carry?.Q == ant.id) {
          // We are a queen awaiting service from the collision ant.
          if (ant.pose == 'prone' && temp2.pose == 'prone' && tun.t == 'cav') ant.r = normalize360(ant.r - temp3.d); // Turn toward.
          ant.frz = 1; // Let's attempt to pause a moment.
        }
        else if (ant.carry?.Q == temp2.id || antFight(ant, temp2)) {
          while (ant.q[0] && !['fight', 'srv'].includes(ant.q[0].act)) ant.q.shift();
          return antActionStill(ant);
        }
      }
      // Partial correction for prone ants that have a weird trajectory.
      temp1 = normalize180(tun.r - (action.rev && deg180) - ant.r);
      if (tun.t == 'tun' && abs(temp1) > 5) ant.r = normalize360(ant.r + sign(temp1) * 3);
      if (tun.t == 'cav' && abs(temp1) > 60) ant.r = normalize360(ant.r + sign(temp1) * 5);
      wp && inTargetProximity(ant, wp, antOffsetY(ant)) && antNudgeToMid(ant, tun); // Ant way too close to waypoint, push it away a little.
      // Determine if we're on a collision course with a waypoint and then align the ant with the waypoint angle by 2 degrees to minimise the collision.
      if (antWaypointCollision(farm, ant, 7 + (tun.t == 'cav' && antOffsetX(ant)))) {
        temp3 ? (!randomInt(9) ? antInstaQ(ant, {}, 0) : antNudgeToMid(ant, tun)) : // Ant is dealing with an ant collision as well, give it some hesitation or at least get away from walls.
          // Angle correction in response to waypoint collision:
          ant.r = normalize360(
            ant.r + (
              nextTun?.t == 'con' ? normalize180(angleFromDelta(nextTun.x1 - ant.x, nextTun.y1 - ant.y) - ant.r) / 4 : // If next tun is a 'con', angle a quarter turn towards the center of the con.
              tun.t == 'con' && nextTun ? normalize180(getAngle(ant, getConnectionPoint(tun, nextTun, farm)) - ant.r) / 4 : // If current tun is a 'con', angle a quarter turn to the next overlap point.
              sign([0, deg180].map(a => normalize180(tun.r + a - ant.r)).sort((a, b) => abs(a) - abs(b))[0]) * (tun.t == 'cav' ? 5 : 2) // Otherwise try to nudge towards the current tun's angle in general direction of travel.
            )
          );
      }
    }
    // Store the current wp to make the next wp fetch more efficient.
    action.wp = wp;
    if (nextTun) nextAction.wp = wp;
    // Check for nearby enemies or co-targets (even without collision).
    if ((temp1 = farm.foe && farm.a.find(a => tun.id == a.area.t && isCapped(a) && !a.inf && !antsWillAvoid(ant, a) && inTargetProximity(ant, a, 30))) && (ant.carry?.Q == temp1.id || antFight(ant, temp1))) {
      // Progress to srv/fight action.
      while (ant.q[0] && !['fight', 'srv'].includes(ant.q[0].act)) ant.q.shift();
      return antActionStill(ant);
    }
    if (action.pos) {
      // Position encourager feature.  Coaxes ant to walk towards the side of the tunnel it is supposed to be on, but there is no guarantee it'll get there.
      // NOTE: This only works for 'cav' tunnels which are roughly horizontal, that isn't checked here, it is assumed the calling code will only use this feature for cavs.
      // NOTE: Doesn't work too well if ant is already near the area it is supposed to go to; best to circle back via another cav or use 'tunOrient' to march straight to a target.
      if (ant.pose == 'prone') {
        temp2 = wp && getTunSide(tun, wp); // Determine tunnel side: < 0 is good for 'd', > 0 is good for 'u'.
        temp3 = action.pos == 'u' ? temp2 > 0 : temp2 < 0; // Whether ant is on the correct side of the tunnel for its intended position.
        if (temp3 && antWaypointRange(ant, wp, .8)) {// .8 mult so it has a chance to take another couple steps to angle itself.
          ant.r = ant.r > 90 ? deg180 : 0; // Awkward snap.
          antToSideWithCorrection(ant, tun, wp); // Ant is in landing range, so land it.
        }
        else {
          temp1 = normalize180((
            temp3 && antWaypointRange(ant, wp, 2) ? // The 2 multiplier is mostly useless because the wp doesn't even register at that distance for most ant sizes.
              (ant.r > 90 ? deg180 : 0) : // VERY close to landing range, prob too steep. Without fetching another WP from further away this is unlikely to be enough convincingly align the ant with the surface but it might be just enough to show intention.
              (action.pos == 'd' ? deg270 : 90) // Ant is too far away from tunnel surface and needs to be angled there.
          ) - ant.r);
          // Correct the angle up to 9deg within target angle, 2deg at a time.
          if (abs(temp1) > 15) ant.r = normalize360(ant.r + getSign(temp1 < 0) * 2);
        }
      }
      else {
        temp1 = getTunSide(tun, ant);
        if (action.pos == 'u' && temp1 > 0 || action.pos == 'd' && temp1 < 0) action.ns = getTime(); // Already correct position, flag "no switch" to prevent random pose switching.
        else {
          // Wrong side of the tunnel, switch to prone.
          antToProneWithCorrection(ant, tun);
          action.ns = action.pos == 'm'; // Disable random switching for 'm' position.  (no need to use getTime here as it is in prone pose)
        }
      }
    }
    // Tun end adjuster, for smoother transitions.
    temp1 = tunPercent(tun, 42); // Percentage representing 42px of the tunnel taking the current dig progress into account.
    if (ant.pose == 'prone' && (action.rev ? action.dist < temp1 : action.dist > tun.prog - temp1)) {
      // Near end of tunnel, but not right at the end. Direct towards next con.
      antNudgeToMid(ant, tun);
    }
    // Random ant pose switching feature.
    // Ensure we're not at the end of the tunnel, near the beginning (prone -> side only), or have flagged the no-switch.
    else if (!action.ns && !isRotationTunnel(tun) && !randomInt(ant.pose == 'prone' ? 100 : num800) && antWaypointRange(ant, wp) &&
        (ant.pose == 'prone' || tun.t != 'con') && // Avoid switching into prone if this is a con - looks stupid.
        (ant.pose == 'side' || !(action.rev ? action.dist > tun.prog - tunPercent(tun, 20) : action.dist < tunPercent(tun, 20)))) {
      action.ns = getTime(); // Don't randomly switch again in this tunnel.
      ant.pose == 'side' ? antToProneWithCorrection(ant, tun) : antToSideWithCorrection(ant, tun, wp);
    }
    // Walk along tunnel.
    antMoveTunnel(ant);
    // Now check where the ant actually is.  If the check fails and we're working on an underbuilt tunnel, let's try to register in the previous tunnel.
    temp3 = findTunPos(ant, farm, [nextTun, tun, ...(nextTun?.co || []), ...tun.co]); // Seems like a good idea to keep this test exactly consistent with the one in dive().
    // Suggestion: If doing findTunPos() on every frame is too expensive for performance, be aware that getWaypointTunnel() caches the result and it might be a better system to upgrade that functionality for use here?
    if (!temp3) {
      temp2 = 0; // Prevent endless/long loop.  Will be detected below.
      while (!temp3 && temp2++ < 9) {
        !randomInt(9) ? antToProneWithCorrection(ant, tun) : antNudgeToMid(ant, tun); // Shuffle the ant back into the tunnel with a random chance to switch side->prone.
        temp3 = findTunPos(ant, farm, [tun]);
      }
      if (!temp3) {
        // Still out-of-bounds after 9 nudges, let's give it a shove towards the closest waypoint and circle back later.
        antNudgeToClosestWp(ant, farm);
        return antNextStill(ant, pauseDelay); // We cannot allow the remaining code to execute as it relies on ant being in a tun.
      }
    }
    // Re-resolve any 'jun' tunnel result before the skipped-tunnel check. Also performs a queue substitution if this jun supplements a queued con/ent.
    if (temp3?.tun?.t == 'jun' && nextAction?.act == 'dive' && nextTun?.id == temp3.tun.c && (nextTun?.t != 'ent' || ant.q[2]?.act == 'dive')) {
      nextAction.id = temp3.tun.id;
      nextTun = getTun(farm, nextAction.id);
    }
    // Check skipped tunnels.
    if (temp3 && temp3.tun?.id != tun.id) {
      // Ant is in a different tunnel than the one it is supposed to be in.
      // This could be normal in which case antNext() will continue the journey, but there are some cases to check first.
      if (nextTun && temp3.tun.id != nextTun?.id) {
        // Ant's current actual position is not in the nextTun in the queue.  This code will investigate the problem.
        antArea(ant, 'bot', temp3.tun.id);
        // Check if a tunnel was skipped over (it happens), and we should be further along in the queue.
        // Note: We are ignoring any non-dive actions that are wedged in between dive actions that have an id. At time of writing that situation does not occur.
        temp1 = ant.q.findIndex(a => a.act == 'dive' && a.id == temp3.tun.id) - 1;
        /* START-DEV */temp1.skipTo = 1;/* END-DEV */
        if (temp1 > 0) ant.q.splice(0, temp1);
        else if (temp3.tun.co.find(id => tun.co.includes(id)) == nextTun.id) {
          // Ant has wandered into an adjacent tunnel at a juncture, switch to prone to complete an awkward course correction on the next pass.
          antToProneWithCorrection(ant, tun);
        }
        else {
          antToProneWithCorrection(ant, tun);
          // Severe course correction.  Ant is lost, so set up a new path to the original destination (the last dive action in the queue).
          temp1 = ant.q.slice(1).findIndex(a => a.act != 'dive') + 1; // Calculate the index of the final dive action.
          temp2 = ant.q[temp1]; // Store the final action itself because we're about to delete it.
          ant.q.splice(0, temp1); // Remove the dive queue, but keep anything after the final dive. Keeps the final dive so antNext doesn't skip the next action.
          /* START-DEV */temp2.stub = 'severe'/* END-DEV */
          antInstaQ(ant, makeDiveStub(temp2));
        }
      }
      // Execute queue.
      antNextStill(ant);
    }
    else if (isRotationTunnel(tun)) {
      if (ant.pose == 'prone') action.act = 'dive'; // Correct prone ants that find their way into this code block (they might be trying to dig this tun).
      // Side pose walking can take an ant along the waypoints through a rotational tunnel, so the ant needs to just keep going.
      antAction(ant); // Special case for rotation tunnels.  Just loopback to this action without doing further checks.
    }
    // Note: Rotational tunnels give false positives for direction mismatches - but this is naturally handled by the flow of these if-statements.
    else if (temp3.tun.id == tun.id && antDir(ant, tun) == action.rev && !(action.rev ? action.dist < temp1 : action.dist > tun.prog - temp1)) { // IMPORTANT: temp1 here should still be 42px as a percentage as defined above!!!
      // Wrong way!  Ant needs to be flipped around safely.
      antChangeTunDir(ant, tun, wp);
      action.act = 'dive';
      antActionStill(ant, randomInt(pauseDelay));
    }
    else if (!ant.frz && (temp2 = getSign(!action.rev)) && temp2 * (action.pc - (temp3.pc + temp2 * tunPercent(tun, antOffsetX(ant)))) < 0) {// Face reached goal (or overshot).
      antNextStill(ant); // Ant reached action.pc
    }
    else {
      // Not there yet - loop back to this function.
      action.dist = temp3.pc;
      randomInt(num200) && !ant.frz ? antAction(ant) : // Normal loopback.
        antActionStill(ant, frameTick + randomInt(pauseDelay)); // Loopback with brief pause.
      ant.frz > 0 ? ant.frz-- : del(ant, 'frz'); // Decrement or cleanup the freeze flag which is used by tunOrient to force the pauseDelay to trigger on an ant here.
    }
    // Apply corpse proximity penalty.
    antCorpseProximity(ant);
  },

  // Prone walks an ant to exactly a target ant/egg.  It won't work for arbitrary target coordinates unless they use the same surface offset that ants do!
  // Note: action.target (required) is any object/shim with x/y coords, and action.ant (if set) is just the id of an ant if temporary freeze of an ant target is desired.
  // Important: This assumes the ant is already in the same cavity as the target, so nothing too funky happens.
  tunOrient: (ant, action = ant.q[0], tun = getTun(getFarm(ant), ant.area.t), margin = antOffsetX(ant) + (action.margin || 6), dr) => {
    // Track time spent doing orient action to reduce breakdancing ants bug when target is in an odd orientation.
    action.orient ||= 0;
    ant.pose = 'prone'; antProneCorrection(ant); // Can't use antToProneWithCorrection() correction here because the nudger is a fudger.
    dr = normalize180(getAngle(ant, action.target) - ant.r); // Rotation delta must be calculated after the antProneCorrection above.
    if (dr > 165) ant.r = oppositeAngle(ant.r); // Quick flip if way off.
    else if (getHypot(action.target.x - ant.x, action.target.y - ant.y) < margin) ant.r = getAngle(ant, action.target); // Snap when too close.
    else ant.r += sign(dr) * clamp(abs(dr), 0, max(1, 15 - action.orient / 2)); // More gradual version.
    if (action.orient++ < tun.w * 4 && !inTargetProximity(ant, action.target, margin)) {// Important: Neither the ant or the target are adjusted for dive coordinates here!
      // Freezes the target if it is an ant (for a non-guaranteed amount of time up to 4 seconds).  Chance of target escaping from current tunnel is negligible.
      // Note: Currently only implemented for ants doing a 'tunWalk' using the pause mechanism there.
      if (action.ant) getAnt(getFarm(ant), action.ant).frz = 2;
      // Get closer.
      antSetWalk(ant);
      antMoveTunnel(ant);
      antAction(ant);
    }
    else antNextStill(ant);
  },

  // Slip an ant to the floor of a tunnel.
  // This does not use cavFloor() as the ant might be in another type of tunnel and not aligned with a cavity.  Also using waypoints would be too involved.
  tunSlip: (ant, tunPos = findTunPos(ant, getFarm(ant), [ant.area.t]), r = tunPos?.tun.r) => {
    ant.pose = 'pick'; // Note: We never reset the pose back to what it was before, that can change later if needed perhaps by passing a param in the action.
    if (tunPos?.tun) {// Ant still "in" the tunnel.
      // Move downwards.
      ant.y += 1; // This occurs slower than the 'slip' action because everything in tunnels is slower.
      ant.r = lerpAngle(ant.r, abs(normalize180(r - ant.r)) < abs(normalize180(oppositeAngle(r) - ant.r)) ? r : oppositeAngle(r), .1);
      antAction(ant);
    }
    else {
      // Hit past the edge of the tunnel. Note: We don't readjust it back into the tunnel here, that can be added later if needed.
      ant.scale = randomSign();
      antNext(ant);
    }
  },

  // Slip off the bg scenery/glass.
  slip: (ant, target = antGroundLevel(ant)) => {
    ant.pose = 'pick';
    if (target - ant.y > 1.2) {
      ant.y += 2;
      ant.r += sign(-ant.r) * 2;
      antActionStill(ant);
    }
    else {
      // Target reached.
      ant.q = [{}]; // Clear the queue because the ant now has a concussion and it's complicated to consider which queue items are still valid.
      antNextSurface(ant);
    }
  },

  // Land an ant near the surface onto the surface.
  land: (ant, target = antGroundLevel(ant)) => {
    antSetWalk(ant);
    if (target - ant.y > antOffsetY(ant)) {
      ant.y += antGetStep(ant);
      ant.r += sign(deg180 - ant.r) * 2; // We know ant is heading downwards (~90deg) now adjust orient towards horizontal.
      antActionStill(ant);
    }
    else antNextSurface(ant);
  },

  // Uncrawl action.
  uncrawl: ant => {
    antInstaQ(ant, [{act: 'crawl', top: 1}, {act: 'pace'}]);
    antNext(ant);
  },

  // Prone walk on the scenery/bg inside the farm.
  crawl: (ant, action = ant.q[0], nextAction = ant.q[1], near = antBgNear(ant), diff, targetAngle, clearance = antGroundLevel(ant) - 20) => {
    if (ant.area.n == 'top' && getFarm(ant).tuns.some(t => t.t == 'ent' && abs(ant.x - t.x1) < 20)) {
      // Too close to tunnel entrance, this can cause ant to crawl straight into hillsides which looks questionable.
      antInstaQ(ant, [{act: 'pace', for: 5 + randomInt(10)}, action]); // Pace and requeue.
      return antNext(ant);
    }
    antArea(ant, 'bg');
    if (!ant.area.d && (ant.x < 30 && ant.scale < 0 || ant.x > 930 && ant.scale > 0)) ant.scale *= -1; // Ant is about to walk into the edge of the farm, let's flip it first.
    ant.pose = 'prone';
    antProneCorrection(ant);
    if (!action || (!action.x && ant.y < clearance && !randomInt(standardDelay))) antActionSlip(ant); // Slip off.
    else if (!action.x && near && near[0] == 90 && (!action.for || action.for < 1) && (nextAction && !acts.bg.includes(nextAction.act) || action.top || ant.area.d > standardDelay && !randomInt(3))) {
      // At the bottom boundary, land the ant.
      antInstaQ(ant, {act: 'land'});
      antNext(ant);
    }
    else if (!action.x && !action.for && nextAction && acts.bg.includes(nextAction.act) || action.x && inTargetProximity(ant, action, antOffsetX(ant)) || action.y > clearance || action.y < 315)
      antNextStill(ant); // Ant has crawled for long enough, or reached the destination, or destination unreachable, move on to the next action.
    else {
      if (ant.area.d < 49 && near && near[0] == 90) ant.r = normalize360(ant.r + randomInt(5) * getSign(90 + ant.r > deg180)); // Ant is starting the crawl; ignore the "near" collision and orient it slightly upwards.
      else if (near) {
        // Redirect ant from boundary.
        diff = normalize180(ant.r - near[0]);
        ant.r = abs(diff) < 10 && !randomInt(num200) ? oppositeAngle(ant.r) : normalize360(ant.r + getSign(diff > 0) * 9); // Occasionally just flip the ant on shallow angles to prevent stuck-in-corner forever situation.
      }
      else if (ant.area.d > 99 && action.x) {
        // We want this ant to head to a particular spot.
        targetAngle = getAngle(ant, action);
        diff = normalize180(targetAngle - ant.r);
        ant.r = normalize360(abs(diff) < 3 ? targetAngle : ant.r + sign(diff) * ((abs(diff) > 90 && inTargetProximity(ant, action, 20)) ? 10 : 2));
      }
      else if (!randomInt(shortDelay)) ant.r = normalize360(ant.r + randomInt(20) - 10); // Random direction bump.
      else if (action.top && ant.y < clearance) {// Ensure ant is well above surface level before enforcing the following rules.
        // Prevent ant walking upwards.
        if (abs(normalize180(ant.r - deg270)) < 90) ant.r = oppositeAngle(ant.r);
        else {
          // Turn ant in a generally downward direction.
          diff = normalize180(90 - ant.r);
          if (abs(diff) > 30) ant.r = normalize360(ant.r + getSign(diff > 0) * 5);
        }
      }
      // Curb "forever crawl" situations without being too forceful about it.
      if (nextAction && ant.area.d > longDelay && !randomInt(shortDelay)) {
        action.top = 1;
      }
      // Track time spent.
      action.for && action.for--;
      // Continue crawl.
      antMoveDefault(ant, antAction, 1, .5, 2);
      // Apply corpse proximity penalty.
      antCorpseProximity(ant);
    }
  },

  // Ant stops and regenerates hp and mood.
  rest: (ant, farm = getFarm(ant), action = ant.q[0]) => {
    // Ant needs to find a spot away from other ants, food, and water.
    if (farm.a.find(a => inTargetProximity(a, ant, 9)) || ant.area.n == 'top' && farm.items.some(i => ['food', 'drink'].includes(i.t) && abs(ant.x - i.x) < 30) || ant.area.n == 'bg' && ant.y > antGroundLevel(ant) - 20) {
      if (ant.q.length < 9 && randomInt(9)) {// Only try again if the queue isn't getting too long, also random chance to abort because of two-ant race condition.
        ant.area.n == 'bot' ?
          // Attempt a dive to the same tunnel they're already in, or random chance to pick a random tunnel.
          antFinna(ant, 'dive', {tun: randomInt(9) && ant.area.t/* START-DEV */, reason: 'rest'/* END-DEV */}) :
          // For top and bg we just need to move a little and try again.
          antInstaQ(ant, {act: acts[ant.area.n][0], for: randomInt(9)});
        antFinna(ant, 'rest');
      }
      antNext(ant);
    }
    else {
      antThot(ant, ['😴', '🥱', '💤', '🛌', 'Nice spot for a rest', "Just relaxin'", "Time for a break!"]);
      // After wait time, increment ant's stats, and check whether to wake up.
      setTimeout(X => {
        antStats(ant, {hp: .8, md: .1});
        // Decide whether to continue resting or wake up based on factors.
        ant.dr < 9 || ant.fd < 9 || // Ant's other stats are very low, wake it up so it can deal with those.
          ant.hp > 99 || ant.hp > 90 && !randomInt(9) || ant.hp > 20 && !randomInt(90) || // Higher chance to wake up the more hp it has.
          farm.a.some(a => a.q[0]?.act == 'fight' && a.q[0].ant == ant.id) // Ant is being attacked in its sleep, wake it up!
          ? antNext(ant) : antAction(ant);
      }, standardDelay);
    }
    antCorpseProximity(ant);
  },

  // Ant eat action.
  eat: (ant, farm = getFarm(ant), action = ant.q[0], isFlesh = action.t == 'flesh', food = getById(isFlesh ? farm.a : farm.items, action.id), ate, actionProps) => {
    if (action.id && food) {
      // Ant has reached the target food.
      antUpdateClasses(ant, {dig: 1});
      setTimeout(X => {
        if (isFlesh && isDead(food)) {// Check food still exists at this point in case it was removed/eaten.
          playerHint(farm, ["Your ants are turning to cannibalism!", "The ants are resorting to eating other ants!"]);
          if (!food.eaten) {
            // Mark this ant's corpse as being for eatin, and increment the fed stat for achievement.
            food.eaten = 1;
            _.sac++;
          }
          // Increment how much of the ant was eaten and then decide whether to remove it entirely or just remove a body part.
          (food.eaten += 20) > 99 ? antDelete(food) : food.eaten > 40 && food.rm.push(pickRandom(['rmlegs', 'rmhead', 'rmrear'].filter(rm => !food.rm.includes(rm))));
          ate = 1;
        }
        else if (food = farm.items.find(i => i.id == action.id && i.sz > 0)) {// Check food still exists at this point in case it was removed/eaten.
          food.sz -= .4;
          !randomInt(5) && antThot(ant, items[food.k].sweet ?
            ["Breadcrumb jackpot!", "Sugar high!", "Someone touched my crumb", "New crumb dropped!"] :
            ["Is this edible?", "Mmm… mystery flavor", "Meat sweats… achieved", "Smells dead - tastes worse"]);
          ate = 1;
        }
        if (ate) {
          !action.Q && antStats(ant, {fd: isFlesh ? 60 : action.pref ? 12 : 3, md: action.pref ? 4 : 0, hp: 1});
          ant.dig = 0;
          if (!action.pref && !randomInt(3)) {
            playerHint(farm, ["Some of your ants are complaining about the food.", "The food does not meet the needs of some ants."]);
            antThot(ant, ["I can't find any food I like", "This isn't my kind of food!", "Ewww, gross food!"]);
          }
          (ant.fd < 80 && !action.Q && ant.q.length < 2 && !randomInt(1) ? antAction : antNext)(ant); // Whether to go again or move on.
        }
        else {
          // Cancel.
          ant.dig = 0;
          antNext(ant);
        }
      }, longDelay / 2 + randomInt(standardDelay));
    }
    else {
      if (ant.fd < 90 || action.Q) {
        // No target selected yet.
        let foods = farm.items.filter(i => i.t == 'food' && i.sz > 0),
          antType = types[ant.t],
          pref = 1,
          isPreference = (antType, food, foodItem = items[food.k]) => !antType.d || antType.d < 2 && foodItem.sweet || antType.d > 1 && foodItem.meat,
          deadAnts = farm.a.filter(a => isDead(a) && !a.rot), // Find dead ants that are not rotten yet.
          chosenFood = shuffle(foods).find(f => isPreference(antType, f)) || pickRandom(foods);
        if (!chosenFood || !isPreference(antType, chosenFood)) {
          // Either there is no food, or the food is not in the ant's dietary requirements.
          if (antType.d > 1 && ant.fd < 50 && deadAnts.length) {
            chosenFood = pickRandom(deadAnts);
            antThot(ant, ["I can survive on ant flesh", "I'm going to eat " + chosenFood.n, "I will devour my nemesis!"]);
          }
          else if (!chosenFood && ant.fd < 50) {
            // No food available, and ant's food stat is dropping.
            antThot(ant, ["Why is there no food?", "Someone is trying to starve us!", "Where is the lovely buffet?"]);
            // Warn the user about this situation, unless it is the case where meat eaters have a potential enemy/dead ant food source.
            types[farm.t].d < 2 || !farm.foe && !farm.a.some(isDead) && playerHint(farm, ["There is no food available for your ants.", "Your ants need something to eat!", "The ants are getting hungry."]);
            return antNext(ant); // Nothing can be done about this.
          }
          else pref = 0; // There is food, but not ideal.
        }
        if (chosenFood) {
          // Building `actionProps` instead of using `...chosenFood` directly prevents excess data being stored in the ant's action.
          actionProps = {id: chosenFood.id, k: chosenFood.k, t: chosenFood.t != 'food' ? 'flesh' : chosenFood.t, pref: pref, Q: action.Q};
          // Now calculate where to go.
          if (chosenFood.t == 'food' || chosenFood.area.n == 'top') {
            goToLocation(ant, {n: 'top'});
            antFinna(ant, 'eat', {...actionProps, tx: chosenFood.t == 'food' ? 25 + parseInt(chosenFood.x) + randomSign(23) * randomInt(chosenFood.sz) / 100 : chosenFood.x});
          }
          else {
            let tunPos = findTunPos(chosenFood, farm, [chosenFood.area.t]);
            if (tunPos) {
              goToLocation(ant, {n: 'bot', tun: tunPos.tun.id, pc: tunPos.pc, pos: 'd'});
              antFinna(ant, 'eat', actionProps);
            }
          }
          action.Q && antFinna(ant, 'get', {...actionProps, id: chosenFood.id + ant.id});
        }
      }
      antNext(ant);
    }
  },

  // Ant drink action.
  drink: (ant, farm = getFarm(ant), action = ant.q[0], drink = farm.items.find(i => i.t == 'drink' && i.sz > 0), actionProps) => {
    if (action.id && drink) {
      // Ant has reached the target drink.
      setTimeout(X => {
        if (drink = farm.items.find(i => i.id == action.id && i.sz > 0)) {// Got to recheck here incase the drink got removed/exhausted.
          drink.sz = max(drink.sz - .1, 0);
          !action.Q && antStats(ant, {dr: 12, md: .5, hp: .5});
          (ant.dr < 80 && !action.Q && ant.q.length < 2 && !randomInt(1) ? antAction : antNext)(ant); // Whether to go again or move on.
        }
        else antNext(ant);
      }, standardDelay + randomInt(standardDelay));
    }
    else {
      if ((ant.dr < 90 || action.Q) && drink) {
        // Building `actionProps` instead of using `...drink` directly prevents excess data being stored in the ant's action.
        actionProps = {id: drink.id, k: drink.k, t: drink.t, Q: action.Q};
        goToLocation(ant, {n: 'top'});
        antFinna(ant, 'drink', {...actionProps, tx: parseInt(drink.x) + 2 + randomInt(46)});
        action.Q && antFinna(ant, 'get', {...actionProps, id: drink.id + ant.id});
      }
      else if (ant.dr < 50) {
        // No drink available, and ant's drink stat is dropping.
        antThot(ant, ["There is nothing to drink here!", "Somebody bring me some water!", "Where is the drinking fountain?"]);
        playerHint(farm, ["There are no drinks in the farm for your ants.", "Your ants are going to get thirsty!"]);
      }
      antNext(ant);
    }
  },

  // Ant picks up a bit of food or drink for the queen, or an infant or a dead ant, this assumes the ant is already in a location where they can do a pick-up.
  get: (ant, farm = getFarm(ant), action = ant.q[0], carryItem = getCarry(farm, action)) => {
    if (carryItem && !farm.a.some(a => a.carry?.id == action.id) && !(isAdult(carryItem) && isCapped(carryItem))) {// Ensure carryItem exists and is not being carried by someone else. Additional check to prevent pickup of infants that have matured.
      ant.q = [{}]; // Clear the ant's queue, they have only one mission right now.  We have to put a dummy {} action in so the antNext() below doesn't hose anything queued in this function.
      // Note: No proximity check for food/drink items; that is the responsibility of 'eat' and 'drink' actions.  Those check whether it exists, and moving the item changes the id number.
      if (carryItem.x && !inTargetProximity(ant, carryItem, antOffsetX(ant) + 12)) {// Very permissive margin due to targetting troubles.
        // Too far.
        ant.area.t && ant.area.t == carryItem?.area?.t ?
          antFinna(ant, 'tunOrient', {target: {x: carryItem.x, y: carryItem.y}, margin: 6}) : antGoToAnt(ant, carryItem); // Don't store the whole carryItem in queue data, because that's asking for troubles.
        antFinna(ant, 'get', action);
        return antAction(ant);
      }
      if (carryItem.lvl) carryItem.lvl = 0; // Picked up items with a lvl prop should lose their level.
      action.f = ant.f;
      ant.carry = action;
      ant.run = .7;
      carryDraw(ant);
      // Special case where ant is going to serve a queen.  It needs to hand control back to the 'srv' action.
      action.Q && antFinna(ant, 'srv', action);
      // Queue up the items that this action was told to queue up once the carry item was fetched.
      action.q?.forEach(q => antFinnaVia(ant, q.act, {...q}));
      isEggOrInf(carryItem) && checkPkgSupport(farm);
    }
    antNext(ant, pauseDelay);
  },

  // Ant goes on a mission to feed the queen.
  srv: (ant, farm = getFarm(ant), action = ant.q[0], queen = getAnt(farm, action.Q)) => {
    if (ant.carry) {
      if (queen && isCapped(queen)) {
        // Has ant really reached the queen's head?
        if (!inTargetProximity(ant, antHeadPoint(queen), antOffsetX(ant) + 6)) {// Very permissive margin due to targetting troubles (also 6px is the size of small carried items).
          // Ant too far from queen's face.  This code can produce some odd ant behaviours, but it is fun to watch.
          ant.q = []; // Clear the ant's queue, they have only one mission right now.
          ant.area.t && ant.area.t == queen.area.t && getTun(farm, ant.area.t)?.t == 'cav' ?
            antFinna(ant, 'tunOrient', {target: antHeadPoint(queen), ant: queen.id}) : antGoToAnt(ant, antHeadPoint(queen));
          antFinna(ant, 'srv', action);
          return antAction(ant);
        }
        // Reached the queen.
        // Update stats based on what the queen is probably being given.
        // The 'md' boost is a bit higher than in 'eat' and 'drink' actions because queen has servants.
        action.t == 'drink' ? antStats(queen, {dr: 12, md: 2, hp: .5}) : antStats(queen, {fd: action.t == 'flesh' ? 60 : action.pref ? 12 : 3, md: action.pref ? 6 : 2, hp: 1});
        // Worker ant is happier.
        antStats(ant, {md: 9});
        // Animate the exchange.
        [queen, ant].forEach(a => {
          antUpdateClasses(a, {dig: 1});
          setTimeout(X => antUpdateClasses(a, {dig: 0}), pauseDelay);
        });
      }
      // Delete this regardless of whether the queen was fed, otherwise ant could carry forever.
      carryUndraw(ant);
      del(ant, 'carry', 'run');
      // Pause here for a bit (slightly longer than the animation above).
      antNext(ant, pauseDelay + randomInt(shortDelay));
    }
    else {
      // Setup.  Pick a queen with low stats and fulfill her most desperate needs.
      if (!antUniqueActs(ant).includes('get') && (queen = farm.a.filter(a => isQueen(a) && isCapped(a)).sort((a, b) => (a.fd + a.dr) - (b.fd + b.dr))[0])) antFinnaVia(ant, queen.fd < queen.dr ? 'eat' : 'drink', {Q: queen.id}); // Go to the appropriate item.
      antNext(ant);
    }
  },

  // Queen's special rest function - queen goes to her favourite spot first.  Also initiates egg-laying.
  kip: (ant, farm = getFarm(ant), nests = [...new Set(farm.a.filter(a => a.nest).map(a => a.nest))], antCount = farm.a.length) => {
    // Try pick a nest if there's a suitable one and/or send to the nest.
    if (getTun(farm, ant.nest)?.morgue) ant.nest = 0;
    (ant.nest ||= pickRandom(specialTunCandidates(farm, [t => !t.morgue, t => !t.nip, t => t.co.filter(co => getTun(farm, co).dun).length < 2, t => !nests.includes(t.id)]))?.id)
      && goToLocation(ant, makeDiveStub({tun: ant.nest, pc: 20 + randomInt(60), pos: 'd'/* START-DEV */, stub: 'kip' /* END-DEV */}));
    antFinna(ant, 'rest');
    // Queue egg laying if no eggs in the nest, not overpopulated, and random chance passed with respect to various factors.
    // Note: The 'lay' action will protect from laying if something went wrong in the queue and she's not in a cav, and actually has a high chance of requeueing another dive/lay cycle.
    antCount < 40 ?
      ant.hp > 40 && farmIsDeveloping(farm) && !farm.a.some(a => isEggOrInf(a) && a.Q == ant.id) && ant.lay > 100 && !randomInt(9) && antFinnaUnique(ant, 'lay')
      : (playerHint(farm, ["Queen won't lay eggs due to overpopulation."]), ant.lay = 0);
    // Note: free ant spawning stops at 25 ants, ant vials disallow use at 30, and laying stops at 40.  This seems like a decent progression allowance.
    antNextStill(ant);
  },

  // Queen lays eggs.
  lay: (ant, farm = getFarm(ant), action = ant.q[0], lvl = action.lvl || 0, laid = action.laid || 0, tunPos = findTunPos(ant, farm, [ant.area.t]),
    tun = tunPos?.tun, antLvlCount = farm.a.filter(e => e.lvl == lvl && e.area.t == tun?.id).length,
    pkgSize = tun && tunPercent(tun, 5), thePose = ant.pose, floorCoord = tun && cavFloor(tun, tunPos.pc)) => {
    ant.lc = 1; // Mark this ant as having a "lay cycle".
    antLvlCount > 6 - lvl * 2 && (antLvlCount > 8 - lvl * 2 || !randomInt(4)) && lvl++; // Go up a level when there are lots of eggs on the current level.
    if (ant.hp < 40) {
      // Queen weak, requeue after a kip.  Requeue should trigger near the bottom of this function.
      antFinnaUnique(ant, 'kip');
    }
    else if (tunPos && tun.t == 'cav' && !tun.nip && !tun.morgue) {// Layable tunnel and position.
      if (tunPos.pc < 20 || tunPos.pc > 80 || farm.a.some(e => isEggOrInf(e) && e.area.t == tun.id && e.lvl == lvl && abs(e.pc - tunPos.pc) < pkgSize) // Check there is nothing occupying current space
        || (farm.a.some(e => isEggOrInf(e) && e.area.t == tun.id && e.lvl == lvl) && !farm.a.some(e => isEggOrInf(e) && e.area.t == tun.id && e.lvl == lvl && abs(e.pc - tunPos.pc) < pkgSize * 1.4)) // Check it is right next to an existing one or there is no other one
        || lvl && farm.a.filter(e => isEggOrInf(e) && e.area.t == tun.id && e.lvl == lvl - 1 && abs(e.pc - tunPos.pc) < pkgSize).length < 2) {// Check there are two supporting eggs to stack an egg on.
        // Can't lay here, walk a bit and try again.
        antFinna(ant, 'dive', {tun: tun.id, pc: tunPos.pc + randomInt(pkgSize) * (tunPos.pc < 20 ? 1 : tunPos.pc > 80 ? -1 : randomSign()), pos: 'd'/* START-DEV */, reason: 'lay'/* END-DEV */});
      }
      else {
        // Animate.
        antUpdateClasses(ant, {pose: 'pick', jit: 1});
        setTimeout(X => {
          ant.pose = thePose;
          antRemAnimUpdate(ant);
          // Lay an egg.
          antUpdate(assign(createAnt(farm, floorCoord.x, floorCoord.y, randomInt(deg180), 'cap', randomInt(6) ? 'W' : 'D', ant.t), {
            Q: ant.id, // Mark the egg's mother.
            f: farm.id,
            egg: 1,
            area: ant.area,
            pc: tunPos.pc,
            lvl: lvl,
            prog: 0
          }), undefined, 1); // Instant display update.
          antStats(ant, {hp: -9, fd: 4, dr: 4, md: 4}); // Increase chance of queen being forced to sleep between eggs.  Queens self-feed during this time.
          msg(ant.n + (laid < 2 ? ' laid an egg!' : ` laid ${laid} eggs!`));
        }, pauseDelay);
        laid++;
      }
    }
    // Note: the random chances on the following lines are experimental values, because I suspect it needs to be surprisingly high to not happen too often.
    if ((laid < 6 || randomInt(99)) && laid < 26 && lvl < 4) {
      // Lay more eggs.
      randomInt(9) ?
        goToLocation(ant, makeDiveStub({tun: ant.nest, pc: 20 + randomInt(60), pos: 'd'/* START-DEV */, stub: 'layAgain'/* END-DEV */})) :
        antFinnaVia(ant, 'dive', {pos: 'd', n: 'bot'/* START-DEV */, reason: 'layElsewhere'/* END-DEV */});
      antFinna(ant, 'lay', {laid: laid, lvl: lvl});
    }
    else {
      ant.lay = 0; // Reset lay wait progress after each lay session is complete.
      del(ant, 'lc');
      setTimeout(X => {
        score(1);
        msg(ant.n + ` done laid a brood of ${laid} eggs!`);
      }, shortDelay);
    }
    antNext(ant, shortDelay + randomInt(standardDelay));
  },

  // Ant carries an egg, infant, or a dead ant to another location.
  // Note: Anything queuing this function should add 'pkg: 1' into the action data for the sake of the other actions that will be executed down the line.
  carry: (ant, farm = getFarm(ant), action = ant.q[0], pkg = getCarry(farm, action), nipData = pkg && farm.nips.find(n => n.nip == pkg.moveTo)) => {
    if (pkg && !farm.a.some(a => a.id != ant.id && a.carry?.id == action.id)) {
      if (isDead(pkg)) {
        if (!getTun(farm, pkg?.area.t)?.morgue) {// Extra guard added here to prevent pickup if the dead ant is already in the morgue.
          antGoToAnt(ant, pkg);
          let morgueTun = farm.tuns.find(t => t.morgue);
          antFinna(ant, 'get', {...action, q: [{act: 'dive', tun: morgueTun.id, pc: (morgueTun.rwip ? 10 : 70) + randomInt(20), pos: 'd', n: 'bot'/* START-DEV */, reason: 'carryDeadDrop'/* END-DEV */}, {...action, act: 'drop', n: 'bot'}]});
        }
      }
      else if (isEggOrInf(pkg)) {// This check explicitly instead of just an 'else' because it is possible that pkg did not resolve to an ant-object (egg perished or egg/inf already moved out of farm).
        if (pkg.moveTo)
          nipData ? antFinna(ant, 'get', {...action, f: farm.id, q: [{act: 'nip', nip: nipData.nip}], q2: [{act: 'pace', for: randomInt(999)}, {...action, act: 'drop'}]}) : del(pkg, 'moveTo');
        else {
          antFinnaVia(ant, 'dive', {tun: pkg.area.t, pc: pkg.pc, pos: 'd'/* START-DEV */, reason: 'carryGet'/* END-DEV */});
          antFinna(ant, 'get', {...action, q: [{act: 'dive', tun: getAnt(farm, pkg.Q)?.nest, pos: 'd', n: 'bot'/* START-DEV */, reason: 'carryDrop'/* END-DEV */}, {...action, act: 'drop', n: 'bot'}]});
        }
      }
    }
    antNext(ant);
  },

  // Drop a carried item.  Carefully though.
  drop: (ant, farm = getFarm(ant), action = ant.q[0], pkg = getCarry(farm, ant.carry), tunPos = findTunPos(ant, farm, [ant.area.t]), tun = tunPos?.tun, newSpot,
    headPoint = antHeadPoint(ant, 6 + antOffsetX(ant)), spotFinder = (lvl = 0, pkgSize = tunPercent(tun, 5), levelPkgs, aPkg, offset, pc) => {
      for (; lvl < 4; lvl++) {
        levelPkgs = farm.a.filter(e => isEggOrInf(e) && e.area.t == tun.id && e.lvl === lvl).sort((a, b) => a.pc - b.pc);
        for (aPkg of levelPkgs.length ? levelPkgs : [{pc: tunPos.pc}]) {
          for (offset of [-pkgSize, pkgSize]) {
            pc = aPkg.pc + offset;
            if (pc > 20 && pc < 80 && !farm.a.some(e => isEggOrInf(e) && e.area.t == tun.id && e.lvl === lvl && abs(pc - e.pc) < pkgSize * .99) && // The .99 is because of float precision weirdness.
              (!lvl || farm.a.filter(e => isEggOrInf(e) && e.area.t == tun.id && e.lvl === lvl - 1).filter(e => abs(pc - e.pc) < pkgSize).length > 1) &&
              (!levelPkgs.length || levelPkgs.some(e => abs(pc - e.pc) <= pkgSize))) return {pc, lvl};
          }
        }
      }
    }, temp) => {
    if (pkg) {
      // Set the x/y of the package first.  (These values will be overridden for egg/inf pkgs in tunnels by the code below)
      pkg.x = clamp(headPoint.x, 1, 959);
      temp = findTunPos(headPoint, farm, [tun, ...(tun?.co || [])]) ?? findTunPos(ant, farm); // Fallback to full ant pos search if head poking out of tunnel or something.
      pkg.y = tun?.t == 'cav' ? cavFloor(tun, temp?.pc ?? 50).y : ant.area.n == 'top' ? antGroundLevel(headPoint) : headPoint.y;
      // Pkgs dropped in tunnels need a lot more special handling so they are displayed next to each other nicely.
      if (tun?.t == 'cav' && isEggOrInf(pkg)) {
        // spotFinder() is different from how the queen picks a spot to lay, as she uses a slow trial-and-error approach, whereas spotFinder() works out a good spot to drop.
        if (newSpot = spotFinder()) {
          // Found a spot.
          if (abs(tunPos.pc - newSpot.pc) > tunPercent(tun, antOffsetX(ant))) {
            // Too far away!
            ant.q = []; // Clear the ant's queue so it can focus on the current mission.
            antFinna(ant, 'dive', {tun: tun.id, pc: newSpot.pc, pos: 'd'/* START-DEV */, reason: 'spotFinder'/* END-DEV */});
            antFinna(ant, 'drop', action);
            return antAction(ant);
          }
          else assign(pkg, {...newSpot, area: {n: 'bot', t: tun.id}});
        }
        else {
          // No spots.  Egg will be dropped here anyway, but we'll tell the queen her nest sucks.  This may cause ants to keep moving nest, fun!
          if (temp = getAnt(farm, pkg.Q)) temp.nest = 0;
          assign(pkg, {pc: tunPos.pc, lvl: 0, area: {n: 'bot', t: tun.id}});
        }
        (({x, y}) => assign(pkg, {x, y}))(cavFloor(getTun(getFarm(pkg), pkg.area.t), pkg.pc)); // Pkg is in a tunnel (assumed by context), update the x/y coords from the tunnel.
      }
      // Note: If it's not in a tun I suppose they'll just leave it where it is.  Add more code here if that looks silly!
      carryUndraw(ant, pkg);
      del(pkg, 'moveTo');
    }
    del(ant, 'carry', 'run');
    antNext(ant);
  },

  // Ant goes on a mission to care for an egg or infant.
  care: (ant, farm = getFarm(ant), action = ant.q[0], pkg = getAnt(farm, action.id)) => {
    if (pkg) {
      action.prox ||= 0; // Hack to get around a proximity bug when the ant cannot get close enough for one reason or another.
      if (inTargetProximity(antHeadPoint(ant), pkg, antOffsetY(ant) * 2 + action.prox)) {
        // At the target.
        pkg.egg ? antStats(pkg, {hp: 9}) : antStats(pkg, {hp: 5 + randomInt(6), fd: 5, dr: 6, md: 5});
        antUpdateClasses(ant, {dig: 1});
        setTimeout(X => antUpdateClasses(ant, {dig: 0}), shortDelay);
        return antNext(ant, shortDelay + randomInt(shortDelay));
      }
      else {
        // Too far.
        if (ant.area.t && ant.area.t == pkg.area.t && (getTun(farm, ant.area.t)?.t == 'cav' || !randomInt(9))) {
          action.prox += .1;
          antInstaQ(ant, [{act: 'tunOrient', target: pkg}, {act: 'care', ...action}]);
        }
        else {
          // Not even in the right area... ?
          pkg.area.t ? goToLocation(ant, makeDiveStub({tun: pkg.area.t, pc: pkg.pc, pos: 'd'/* START-DEV */, stub: 'careGoto' /* END-DEV */})) : antGoToAnt(ant, pkg);
          antFinna(ant, 'care', action);
        }
      }
    }
    antNext(ant);
  },

  // Ant nips off to a nip.
  nip: (ant, farm = getFarm(ant), action = ant.q[0], id = action.id, nip = action.nip, idOrNip = id || nip, tun = id ? getTun(farm, action.tun) : farm.tuns.find(t => t.nip == nip),
    nipData = farm.nips.find(n => n.nip == idOrNip), nipItem = nipData?.item, isTop = idOrNip > 2, isLeftSide = idOrNip % 2 > 0, antX = ant.x, dist) => {
    if (action.rev) {
      // Entering farm from a nip area.
      if (isLeftSide ? antX < 20 : antX > 940) {
        antSetWalk(ant);
        if (isTop) {
          antArea(ant, 'top');
          ant.scale = getSign(isLeftSide);
          antMoveSurface(ant); // Top area.
        }
        else {
          // Tunnel
          antArea(ant, 'bot', tun.id);
          antToProneWithCorrection(ant, tun);
          dist = calcDistComponents(tun.x1, tun.y1, tun.x2, tun.y2);
          ant.r = angleFromDelta(isLeftSide ? dist.x : -dist.x, isLeftSide ? dist.y : -dist.y);
          antMoveTunnel(ant);
        }
        antAction(ant);
      }
      else antNextStill(ant); // All done.
    }
    else if (id && nipItem) {
      if (nipItem.a.some(a => a.t != ant.t)) return antNextStill(ant); // There's an enemy ant in the vial/tube, let's not do this.
      // Exiting farm into a nip area.
      if (isLeftSide ? antX > -35 : antX < 995) {
        antSetWalk(ant);
        if (isTop) {
          // Top area.
          ant.scale = getSign(!isLeftSide);
          antMoveSurface(ant);
        }
        else {
          // Tunnel.
          // Can't use antToProneWithCorrection() because the nudger is a fudger.
          ant.pose = 'prone'; antProneCorrection(ant); // It's a copout to be in prone pose, but I'm not going through the whole waypoint saga here.
          ant.r = getAngle(ant, isLeftSide ? {x: -35, y: tun.y1} : {x: 995, y: tun.y2}); // Ant hasn't reached the tunPoint yet, so force the angle.
          antMoveTunnel(ant);
        }
        antAction(ant);
      }
      else {
        // Done! Move ant into "nip item space".
        antArea(ant, 'nip'); // This is just to invalidate any existing area.n the ant has, because the director function on a delay will try to do things to this ant if they're in a valid farm area.
        antTransfer(farm, ant, farm, nipItem, {x: -35, y: 28 - antOffsetY({...ant, x: -35}), q: [], digT: 0}, getEl('a-' + nipIds[id])); // Invalidate q and digT to prevent any problems down the line.
        carryTransfer(ant, farm, undefined, farm, farm, nipItem, {q: []}, getEl('a-' + nipIds[id]), nipData.nip);
        setColonyAndFoe(farm);
        // Set the 'moveTo' flag immediately on any dependant eggs or infants that should be moved to wherever the queen went.
        // Note: the director function does this anyway in case this workflow skipped an egg/ant that was not in the dataset at this time.
        // If tubes/vials are disconnected/reconnected during the time it takes to resolve 'moveTo' tasks, or the queen moves through a subsequent tube, some shenanigans may occur.
        // In such cases the player might be deliberately trying to cause the queen to abandon her dependants?  They're likely to still mature into adults, so not a big deal.
        if (isQueen(ant)) {del(ant, 'nest'); farm.a.filter(a => a.Q == ant.id).forEach(b => b.moveTo = id)};
        save();
        nipItem.k == 'vial' ? vialActivity(ant, nipData) || vialLoop() : tubeWalker(farm, nipData, ant) || tubeLoop();
      }
    }
    else {
      // Setup.
      if (nipItem && nip) {
        if (!ant.carry || isEggOrInf(getCarry(farm, ant.carry))) {
          isTop ? goToLocation(ant, {n: 'top'}) : goToLocation(ant, {n: 'bot', tun: tun.id, pc: 100 * !isLeftSide + getSign(isLeftSide) * tunPercent(tun, 25 - randomInt(20))});
          antFinna(ant, 'nip', {id: nip, tun: tun?.id, tx: isLeftSide ? 1 : 959}); // note: tx and tun are only used in their own respective areas.
        }
      }
      else if (ant.carry) antFinnaVia(ant, 'drop', {...ant.carry}); // Ant was carrying something to a nip, but nip is not there.
      antNext(ant);
    }
  },

  // Prepare ant for antDeath().
  die: (ant, action = ant.q[0]) => {
    if (ant.hp <= 0) {// Otherwise something fortuitous happened since the 'die' action was queued.
      if (ant.nipPh) antFinna(ant, 'die', action); // This is no time to die. Requeue this action.
      else {
        if (ant.carry) {
          // Ant is carrying something, do an insta-drop.
          carryUndraw(ant);
          del(ant, 'carry', 'run');
        }
        if (ant.area.n == 'top') ant.y = antGroundLevel(ant, 0); // Ant is at the top, need to adjust it to ground level.
        if (ant.area.n == 'bg') antInstaQ(ant, [{act: 'slip'}, action]); // Ant is on the bg, let's have it drop off first.  Can't use antActionSlip() here because it will forget to die.
        else if (ant.area.t && ant.pose == 'prone' && !ant.slip) antInstaQ(ant, [{act: 'tunSlip'}, action]);
        else return antDeath(ant, action.r);
      }
    }
    antNext(ant);
  },

  // Fight.
  // Ant is "ant" in it's own loop, and it is the "ant2" for one or more other ants.
  fight: (ant, farm = getFarm(ant), ant2 = getAnt(farm, ant.q[0].ant),
    cancelFight = !ant2 || isDead(ant2) || !antUniqueActs(ant2).includes('fight') || ant.area.n != ant2.area.n || farm.coex || !inTargetProximity(ant, ant2, 30),
    endFight = X => antRemAnimUpdate(ant) || checkFightSong()) => {
    // Fight in prone pose.  Note: antGetStill() slipped in here to avoid setting walk=0 in this block of code.
    if (antGetStill(ant).pose == 'side') ant.area.t ? antToProneWithCorrection(ant, getTun(farm, ant.area.t)) : (ant.pose = 'prone', antProneCorrection(ant));
    // Make ant point at foe.  Don't worry about animating this rotation.
    if (!cancelFight) ant.r = getAngle(ant, ant2);
    // Weak ant might slip off the bg if the fight is there.  Or cancelFight is set.
    if (cancelFight || ant.hp < 10 && ant.area.n == 'bg' && !randomInt(3)) {
      // Quit fighting.
      endFight();
      cancelFight ? antNext(ant) : antActionSlip(ant);
    }
    else if (ant.hp <= 0) {
      endFight();
      ant.wig = 1;
      antFinna(ant, 'die', {r: 'fight'});
      setTimeout(X => {ant.wig = 0; antNext(ant)}, standardDelay);
    }
    else if (!inTargetProximity(ant, ant2, antOffsetX(ant) + antOffsetX(ant2))) {
      // Get closer to foe.
      antTakeProneStep(ant);
      antAction(ant);
    }
    else {
      !fightSong && currentFarm(farm) && playFightSong(); // Play fight music if not already playing.
      ant.fight = ant.dig = ant.jit = 1;
      ant.thotD = ant.thotD < 7 ? 7 : ant.thotD + 1; // Change thoughts faster.
      // Ant strength is determined by a combo of factors.
      // Decrease foe ant's hp by the strength.
      ant2.hp -= clamp(ant.hp / 100, .5, .8) // Base strength is health, but doesn't drop below 50 or go above 80 to keep it fairer.
        * (antGetSize(ant) == 's' ? .8 : (['l', 'x'].includes(antGetSize(ant)) ? 1.2 : 1))  // Adjust strength by size.
        * (types[ant.t].b ? 1.3 : 1) // Biters have extra oomph.
        * types[ant.t].v // Adjust strength by speed.
        * (isDrone(ant) ? 3 : isQueen(ant) ? 5 : 1) // Drones and Queens fair much better.
        + max(1 / ant.md, .2); // Low mood can add slightly to aggression.
      // Wait 5-15 seconds for another blow, this randomness makes the fight less predictable.
      antAction(ant, shortDelay + randomInt(shortDelay * 2));
    }
  },

}, // End of "acts".

// Requests ant goes to any tunnel id or x-coord on the surface denoted by 'location'.
// location object properties:
// - n   : area name ('top', 'bot', 'bg').
// - tx  : (top) optional x position. [this doesn't really work, as pace gets its tx from the NEXT action]
// - x,y : (bg) optional coordinates.
// - tun : (bot) optional tunnel id.
// - pc  : (bot+t) optional percent along tunnel (0–100).
// - pos : (bot+t) optional final tunnel placement: 'u' (up), 'd' (down), 'm' (mid).
// Note: Sometimes it just makes more sense to call antFinnaVia manually to bypass the behaviour here.
goToLocation = (ant, location) => antFinnaVia(ant, location.n == 'bg' ? 'crawl' : location.n == 'top' ? 'pace' : 'dive', location),

// Requests an ant to walk to where another ant was at the time of the request.  Nothing is guaranteed.
// Should silently fail when 'ant' is missing.
antGoToAnt = (ant, destAnt, location = {n: destAnt.area.n}) => {
  if (location.n == 'bg') {
    location.x = destAnt.x;
    location.y = destAnt.y;
  }
  if (location.tun = destAnt.area.t) location.pc = findTunPos(destAnt, getFarm(destAnt), [destAnt.area.t])?.pc; // Note: assignment in condition on purpose.
  /* START-DEV */location.caller = getCallerName();/* END-DEV */
  goToLocation(ant, location);
  // Since 'tx' only works on the NEXT action, when goToLocation goes to 'top' we'll have to add in another action for the tx.  Going with "pace" so if destAnt relocated it'll get on with chasing them.
  location.n == 'top' && antFinna(ant, 'pace', {tx: clamp(destAnt.x, 1, 959)});
},

// Rates the farm as to whether it is styling.
// Returns 0 on fail, and a positive integer with the score on pass.  Never demand players to score more than a 2 to get full benefits.
farmFlairScore = farm => clamp(farm.items.filter(i => i.t == 'scenery').length + (farm.decals?.length || 0) / 2 + (farm.card ? .5 : 0) - 1, 0, 2),

// Applies ant stat adjustments.
antStats = (ant, stats) => keys(stats).forEach(key => ant[key] = clamp(ant[key] + stats[key], 0, 100)),

// Attempts to restore some ant stats based on the substrate fill.
fillRefectory = (ant, fillMap = {
  'gel': {fd: .011, dr: .021},
  'beer': {fd: .005, dr: .01, hp: -.005, md: .03},
  'ooze': {fd: .005, dr: .01, hp: .3, md: -.02},
  'product': {fd: .011, dr: .021, hp: .01, md: .01},
  'lube': {fd: .01, dr: .02},
  'slime': {fd: .011, dr: .021, hp: .011}
}) => antStats(ant, fillMap[getFarm(ant).fill] || {}),

// Determines if the farm has any queens.
farmHasQueen = farm => farm.a.some(a => isQueen(a) && isCapped(a)),

// Determines if an egg or infant can upgrade to the next phase.
// Note: The time calculations in this function do not speed up by using the superspeed feature.
canUpgrade = (pkg, day = 1) => pkg.area.t && pkg.hp > 90 && !randomInt(pkg.dur > 8640 * (1 + day) ? 50 : num500) && pkg.dur > 8640 * day,

// Checks all eggs/infants and corrects any unsupported ones by dropping the lvl.
checkPkgSupport = (farm, lvl) => {
  for (lvl = 1; lvl < 4; lvl++) {
    farm.a.forEach(pkg => {
      if (isEggOrInf(pkg) && pkg.lvl == lvl && farm.a.filter(e => isEggOrInf(e) && e.area.t && e.area.t == pkg.area.t && e.lvl == lvl - 1 && abs(pkg.pc - e.pc) < tunPercent(getTun(farm, pkg.area.t), 5)).length < 2) {
        pkg.lvl--;
        antUpdate(pkg);
      }
    });
  }
},

// Directs farms by running checks every 30 seconds.
// Adds deliberate tasks to the ants' finna queues so the action loops aren't responsible for checking everything.
// Also updates ants stats, autosaves, updates food & drink display, checks achievements, updates ant thoughts.
director = (temp1, temp2) => {
  _.farms.forEach(farm => {
    timeLog(farm); // Update duration.
    setTimeout(X => farm.a.forEach(ant => {
      if (ant.egg) {
        // Decrease egg stats.
        antStats(ant, {hp: -.2}); // We don't care about other stats for eggs.
        timeLog(ant); // Update duration.
        if (ant.hp <= 0) {
          // Note: Ideally there'd be a dead-egg state/graphic for a while instead of just deleting it, but this will do for now.
          antDeath(ant); // Remove dead egg.
          msg(`An egg in "${farm.n}" perished due to neglect.`, 'err');
          setTimeout(X => checkPkgSupport(farm), 1);
        }
        else if (ant.hp > 50 && lockoutExpired() && (ant.prog += .2) > 100 && !randomInt(9) && !getAnt(getFarm(ant), ant.Q)?.lc) {
          // Egg can upgrade into an infant.
          del(ant, 'egg');
          antUpdate(assign(ant, {
            scale: randomSign(),
            dur: 0,
            ts: getTimeSec(),
            thot: pickRandom(["🧩🔒⏳", "🙂💡🚫", "🐢✨🚗", "🎎💁🍛"]),
            thotD: 1,
            inf: 1,
            pose: 'prone',
            prog: 0
          }));
          msg(`An egg in "${farm.n}" hatched into larval <em>${types[ant.t].n} Ant ${casteLabel(ant)}</em> ${ant.n}!`);
        }
        // Fix eggs that dodged the 'moveTo' workflow by being in the wrong place at the wrong time.
        if (farm.a.find(a => a.id == ant.Q && isCapped(a))) del(ant, 'moveTo'); // Clear moveTo flag if queen present.
        else if (!ant.moveTo && (temp1 = isAntsQueenInConnectedItem(ant, farm, 1))) ant.moveTo = temp1; // Add a moveTo flag if queen is found in connected vial/farm.
        // Readjust y-value if sitting on surface due to hill heights growing.
        if (ant.area.n == 'top') {
          ant.y = antGroundLevel(ant);
        }
      }
      else {
        // NOT EGGS...
        timeLog(ant); // Update duration.
        // Fix NaN bugs that might be happening.
        isNaN(ant.x + ant.y + ant.r) && antFixNaN(ant);
        // Update corpse or handle living ant.
        isDead(ant) ? updateCorpseState(ant, farm) : setTimeout(X => {// Perform a chunk of this without overloading the main thread with heaps of these at once.
          // Decrement stats.
          antStats(ant, {fd: -.05, dr: -.1, md: -.05, hp: -.1});
          !ant.area?.t && antStats(ant, {md: farmFlairScore(farm) / 20}); // Boost mood stat based on presence of scenery (when not in tunnels).
          // Decrement hp stats based on other stats.
          antStats(ant, ant.fd <= 0 || ant.dr <= 0 ? {hp: -9, md: -2} : ant.fd < 9 || ant.dr < 9 ? {hp: -.05, md: -.05} : {hp: ant.md < 9 ? -.05 : -.01});
          // Detect hunger/thirst deaths.
          if (ant.hp <= 0 && !ant.fight) {
            if (ant.fd <= 0) antFinnaUnique(ant, 'die', {r: 'hunger', n: 1});
            else if (ant.dr <= 0) antFinnaUnique(ant, 'die', {r: 'thirst', n: 1});
            // Note: 'fight' and 'other' deaths should be handled elsewhere.
          }
          // Cap ant's mood at the maximum its ant type can have.
          ant.md = min(ant.md, types[ant.t].m || 100);
          if (!ant.inf) {
            // None of these forced actions should apply to infants.
            // Ant tries to nourish from fill material if they are in a tunnel.
            ant.area.t && fillRefectory(ant);
            // Check if ant is fighting.
            if (ant.fight) {
              // Summon reinforcement ant.
              temp1 = pickRandom(farm.a.filter(a => isCapped(a) && isAdult(a) && !a.fight && (isWorker(a) || !randomInt(4))));
              temp1 && !randomInt(2) && antGoToAnt(temp1, ant);
            }
            // Curb major problems.
            ant.dr < 9 && antFinnaUnique(ant, 'drink');
            ant.fd < 9 && antFinnaUnique(ant, 'eat');
            ant.hp < 9 && antFinnaUnique(ant, 'rest', {n: 1}); // n:1 means "do it anywhere" since antFinnaUnique() passes through to antFinnaVia().
            // Keep ants with low food/drink stats climbing to the surface so they're more likely to do something about it.
            ant.area.t && (ant.dr < 30 || ant.fd < 30) && !randomInt(2) && antFinnaUnique(ant, 'climb');
            if (ant.q.length < 9 && antUniqueActs(ant).every(a => ['crawl', 'pace', 'dive', 'tunWalk', 'rotWalk'].includes(a))) {
              // Ant is "defaulting".
              setTimeout(X => {// This is a random timeout because it looks super sus if several ants make a decision at the same time.
                if (temp1 = acts[ant.area.n]) {
                  if (isWorker(ant) && !randomInt(3) && (!farmIsDeveloping(farm) || farmHasQueen(farm)) && farm.a.filter(a => a.digD).length < 3) antFinnaVia(ant, 'dig'); // Curb slack workers problem.
                  else if (!randomInt(5)) antFinnaVia(ant, pickRandom(temp1.filter((task, i) => i > 0 && !{Q: ['dig', 'rest'], D: ['dig']}[ant.caste]?.includes(task))), {n: ant.area.n}); // Randomly pick a non-default action.
                  else if (!randomInt(5)/* START-DEV */&& temp1.includes('dive')/* END-DEV */) antFinnaUnique(ant, 'dive'); // Increase chance of ants diving.
                  else if (!randomInt(5)/* START-DEV */&& temp1.includes('crawl')/* END-DEV */) antFinnaUnique(ant, 'crawl'); // Increase chance of ants crawling.
                }
              }, randomInt(shortDelay * 2));
              // Hints for player.
              ant.md < 25 && !farmHasQueen(farm) && playerHint(farm, ['Comrade, the workers are restless. They have no queen.', 'The absence of a queen is going to become a problem.']);
              ant.md < 20 && !farmFlairScore(farm) && playerHint(farm, ['Some of your ants are complaining about the lack of scenery and decor.', "This farm doesn't have flair, the ants would like some decorations."]);
            }
            // Randomly go to vial or tube.
            farm.nips.length && !farm.foe && !ant.lc
              && !randomInt((farm.dun ? 90 : farmIsDeveloping(farm) ? 120 : deg180) - (farm.items.some(i => i.t == 'food' && i.sz > 0) ? 0 : 30) - (farm.items.some(i => i.t == 'drink' && i.sz > 0) ? 0 : 40))
              && antFinnaUnique(ant, 'nip', {nip: pickRandom(farm.nips).nip});
          }
        }, 1);
        setTimeout(X => {// Delay a chunk so the director function doesn't intefere with the displayed farm too much.
          // WARNING! Because this chunk of code is delayed since farm.a was iterated, there is a chance the ant object provided here is NO LONGER in the farm.a data set!  If bugs arise, consider if this is the reason!
          if (ant.inf) {
            temp1 = getObjEl(ant)?.classList;
            temp2 = ['a1', 'a2', 'a3'];
            if (ant.hp > 50 && lockoutExpired() && (ant.prog += .2) > 100 && !randomInt(9) && !farm.a.some(a => a.carry?.id == ant.id)) {
              // Infant upgrader.
              ant.prog = 0;
              if (++ant.inf > 4) {
                ant.pose = 'prone';
                del(ant, 'inf', 'moveTo', 'Q', 'pc', 'lvl', 'prog');
                temp1?.remove(...temp2);
                antAction(ant);
                isDrone(ant) && _.man++;
                msg(`${ant.n} in "${farm.n}" is now an adult <em>${types[ant.t].n} Ant ${casteLabel(ant)}</em>!`);
                score(1);
                checkPkgSupport(farm);
              }
              ant.inf == 2 && msg(`Larva ${ant.n} in "${farm.n}" has puped!`);
            }
            else temp1?.[pickRandom(['add', 'remove'])](pickRandom(temp2)); // Provides randomised animations - HOWEVER these are so subtle I'm not sure this was worth it.
            if (!randomInt(9)) ant.r += randomInt(8) - 4 - normalize180(ant.r * 2) * .02; // Random rotation bump, but bias towards horizontal.
            if ((temp1 = getTun(farm, ant.area.t)) && temp1.t == 'cav' && (temp2 = cavFloor(temp1, findTunPos(ant, farm, [temp1])?.pc))) ant.y += (temp2.y - ant.y) * .2; // Move infant towards the floor of the cav.
            antUpdate(ant);
            // Fix infants that dodged the 'moveTo' workflow by being in the wrong place at the wrong time.
            if (farm.a.find(a => a.id == ant.Q && isCapped(a))) del(ant, 'moveTo'); // Clear moveTo flag if queen came back.
            else if (!ant.moveTo && (temp1 = isAntsQueenInConnectedItem(ant, farm, 1))) ant.moveTo = temp1; // Add a moveTo flag if queen is found in connected vial/farm.
            // Readjust y-value if sitting on surface due to hill heights growing.
            if (ant.area.n == 'top') {
              ant.y = antGroundLevel(ant);
            }
          }
          else if (isQueen(ant)) {
            // Extra handling for Queens.
            if (!farmIsDeveloping(farm) && farm.a.filter(a => isServant(ant, a)).length < 2 && !randomInt(3)) antFinnaUnique(ant, 'dig'); // A queen without workers may dig a nest to start a colony.
            if (!isQueenAwaiting(ant) && (ant.fd < 90 || ant.dr < 90))
              antFinnaUnique(pickRandom(farm.a.filter(a => isServant(ant, a) && !a.carry && a.q.length < 9 && a.hp > 50 && !hasCarryTasks(a))), 'srv'); // Reduces the possibility of a queen having to eat or drink by herself.
            if (ant.hp < 95 && ant.q.length < 2 || ant.hp < 80) antFinnaUnique(ant, 'kip');
            // Being a queen takes an extra toll.
            antStats(ant, {fd: -.05, dr: -.05, hp: -.1, md: -.05});
            // Queen's presence boosts moodiest ant's MD.
            if (temp1 = farm.a.filter(a => a.caste != 'Q').reduce((min, a) => !min || a.md < min.md ? a : min, 0)) antStats(temp1, {md: .3});
            randomInt(2) && farm.a.filter(a => isServant(ant, a)).length < 3 && ant.q.length < 20 && care4kids(farm, ant); // Farm with not enough workers?  Queen maybe performs an extra care task per cycle.
            if (ant.hp > 50 && lockoutExpired()) ant.lay = (ant.lay || 0) + 100 / ((8000 * Math.ceil(farm.a.length / 30) - (farm.fill == 'lube' ? num2000 : 0) - (farm.a.length < 9 ? num2000 : 0)) / 2);
            if (ant.lc && !antUniqueActs(ant).includes('lay')) antFinnaUnique(ant, 'lay'); // Re-add lay action if q was dumped.
          }
          else if (isDrone(ant)) {
            // Being an adult drone takes an extra toll.
            antStats(ant, {fd: -.02, dr: -.02, hp: -.02, md: -.02});
            // Cap drone's HP lower and lower over time, making it harder to stay alive.
            ant.maxhp = ant.maxhp ? clamp(ant.maxhp - .01, 1, 99) : 99;
            ant.hp = min(ant.hp, ant.maxhp);
            // Keep drones coming back to the surface so they can fly away.
            ant.area.t && !randomInt(2) && antFinnaUnique(ant, 'climb');
            // Sometimes esc property remains on a drone that missed the escape attempt.  Must be removed so it can try again later.
            !getEl('lid').classList.contains('off') && del(ant, 'esc');
          }
          // If ant didn't drop, it needs to be requeued.
          if (ant.carry && !hasCarryTasks(ant)) ant.carry.q ? ant.carry[ant.carry.f && ant.f != ant.carry.f ? 'q2' : 'q'].forEach(q => antFinnaUnique(ant, q.act, {...q})) : ant.carry.Q ? antFinna(ant, 'srv', {...ant.carry}) : ant.q.push({...ant.carry});
        }, num500);
        // Update the ant's thoughts, but limit it to changing every 10th loop (~5 minutes) so as not to override thoughts, particularly those set within other functions, too soon.
        ant.thotD > 9 ? antThot(ant) : ant.thotD++;
      }
      if (ant.q.length > num200) ant.q = [{}]; // @WORKAROUND (Note: there is a tighter check in dev.js) (We put an empty {} idle action in just in case so that an antNext doesn't hose anything that comes afterwards)
    }, 0));
    setTimeout(X => {// Delay these extra bits to not perform everything all at the same time.
      // Look for dead ants, eggs, or infants that need moving.
      trySetCarryTask(farm);
      // Look for infants and eggs and see which one needs to be cared for next.
      care4kids(farm);
      // Extra care call if there are infants or eggs with hp dipping.
      farm.a.some(ant => isEggOrInf(ant) && ant.hp < 49) && care4kids(farm);
      // Unmorgue the morgue if no need for a morgue.
      (temp1 = farm.tuns.find(t => t.morgue)) && !farm.a.some(isDead) && del(temp1, 'morgue');
      // Reload if user idle (lastActivity over 30s ago) and loadTime over 6 hours ago.
      // This prevents a bug that crashes the tab if left open overnight.
      if (getTime() - lastActivity > 30000 && getTime() - loadTime > 21600000) {
        save();
        location.reload();
      }
      // Update jun tuns' progress automatically so they don't have to be dug.
      farm.dun || farm.tuns.forEach(t => {
        if (t.t == 'jun' && !t.dun && getTun(farm, t.c).dun && t.co.some(id => getTun(farm, id).dun) && t.co.every(id => getTun(farm, id).prog > 35)) {
          t.prog = clamp(t.prog + 2, 20, 100);
          t.dun = t.prog == 100;
          currentFarm(farm) && tunProgDraw(t);
        }
      });
    }, num2000);
  });
  checkFightSong(); // Check if fight song didn't turn off.
  updateFoodAndDrink();
  save();
  checkAchievements(1); // Check if game is almost in a winning state.
},

// Checks if an achievement has been reached.
// Note: Some achievements only check the currently focused farm, that's fine it makes more sense that way.
checkAchievements = (countWins, count = 0,
    // Define three-level achievement funtions, these return the current count of whatever we're counting.
    multiAch = {
      blood: X => max(...values(F.a.filter(isCapped).reduce((acc, ant) => (acc[ant.t] = (acc[ant.t] || 0) + 1, acc), {}))),
      sac: X => _.sac,
      scene: X => keys(_.scene).length,
      arty: X => _.arty,
      man: X => _.man,
    },
    // Define one-level achievement functions, these return true or false if the condition is currently met or not.
    singleAch = {
      fac: X => _.farms.filter(farmIsDeveloping).length > 3,
      tri: X => new Set(_.farms.filter(farmIsRunning).map(f => f.fill)).size > 2,
      sweep: X => F.sweep,
      kweens: X => F.a.filter(a => isQueen(a) && isCapped(a) && (a.t == F.t || F.coex)).length > 1,
      heir: X => farmIsDeveloping(F) && !F.cap && F.a.some(isEggOrInf),
      drag: X => _.dq && !_.farms.some(farm => farm.nips.some(nip => nip.item.k == 'tube' && nip.item.a.some(isQueen))), // Extra check to ensure tubes don't contain queen, because that's confusing if this fires early.
      hb: X => F.death.other > 9,
      day: X => _.farms.filter(f => f.dur > 86400).length > 1,
      weak: X => F.dur > 604800 && (F.a.length < 10 || Object.values(F.death).reduce((sum, v) => sum + v, 0) > 5 || !F.a.some(isQueen)), // Over 7d & either: fewer than 10 ants, over 5 deaths, or no queen.
      mom: X => _.win,
    },
    achKey
  ) => {
  if (countWins) {
    // Checks if game is almost in a winning state.
    for (achKey in multiAch) if (!_.ach[achKey] || _.ach[achKey].l != 3) count++;
    for (achKey in singleAch) if (!_.ach[achKey]) count++;
    if (count === 1) drop('mom');
    else if (!count && !_.dmb && !denyPopup()) popup('win');
  }
  else {
    for (achKey in multiAch)
      if (!_.ach[achKey] || _.ach[achKey].l < 3) {
        _.ach[achKey] = _.ach[achKey] || {l: 0, v: 0};
        let newCount = min(9, multiAch[achKey]()), newLvl = min(3, floor(newCount / 3));
        if (newCount > _.ach[achKey].v) {
          _.ach[achKey].v = newCount;
          if (newLvl > _.ach[achKey].l) {
            _.ach[achKey].l = newLvl;
            queueAch(achKey);
          }
        }
      }
    for (achKey in singleAch)
      if (!_.ach[achKey] && singleAch[achKey]()) {
        _.ach[achKey] = 1;
         queueAch(achKey);
      }
  }
  // Display first pending achievement.
  if (_.achQ.length && !denyPopup() && !achPopupPending) {
    preloadImage(_.achQ[0].l ? 'medal' + _.achQ[0].l : 'trophy');
    achPopupPending = 1;
    popup('ach', 0, shortDelay);
  };
},

// Queues an achievement.
queueAch = (achKey, lvl = _.ach[achKey].l || 0, newAch = {a: achKey, l: lvl, b: !lvl || lvl == 3 ? 20 : 10}) => {
  !_.achQ.some(e => e.a == newAch.a && e.l === newAch.l && e.b == newAch.b) && _.achQ.push(newAch);
  save();
},

// Updates the display of food and drinks so they reflect the current size.
// Note: Only works on current farm.
updateFoodAndDrink = temp => {
  // Food items have to be regularly updated to reflect being eaten and hill heights, as well as being deleted when exhausted.
  F.items = F.items.filter(i => i.t != 'food' || (
      temp = getEl(i.id), i.sz > 0 ?
        (temp.innerHTML = foodCode(i), temp.style.bottom = getHillHeight(parseInt(i.x) + 25) + 'px', temp.style.transform = `rotate(${antHillAngle({x: i.x, scale: 1, f: F.id}, 9)}deg)`) :
        (deleteDataAndEl(i, 'items', F), 0)
    )
  );
  // Update drink height.
  if (temp = F.items.find(i => i.t == 'drink')) {
    getEl(temp.id).style.bottom = getDrinkHillHeight(temp.x);
    query(`#${temp.id} .drink > *`).style.height = min(46, temp.sz / 2) + 'px';
  }
},

// Checks if an ant is an expat queen for the sake of the "Dragged Queen" achievement.
checkExpatQueen = (a, farm) => isQueen(a) && a.f != farm.id && (_.dq = 1),

// Checks and... displays messages.
displayMessage = X => {
  if (messages.length) {
    if (hasFocus() && queryAll('.msg').length < 9) {
      showMsgs = 1;
      let message = messages.shift(), msgDiv = getEl('messages');
      msgDiv.innerHTML += html(p(message.msg), {'data-ts': getTime(), class: 'msg ' + message.t});
      msgDiv.lastChild.classList.add('vis');
      message.t != 'bonus' && messageLog.push(message);
      messageLog.length > 10 && messageLog.shift();
    }
    setTimeout(displayMessage, 4000);
  }
  else showMsgs = 0;
  // Keep the messages scrolling.
  scroller ||= setInterval((lastmsgEl = getEl('messages').firstChild, msgEl = getEl('messages')) => {
    if (hasFocus() && lastmsgEl && getTime() - parseInt(lastmsgEl.dataset.ts) > 12000) {
      msgEl.firstChild.classList.add('rm');
      setTimeout(X => {msgEl.firstChild && msgEl.removeChild(msgEl.firstChild); !showMsgs && displayMessage()}, num500);
      if (!messages.length) scroller = stopInterval(scroller);
    }
  }, num2000);
},

// Adds a message to the array.
msg = (txt, type = 'status') => messages.push({msg: txt, t: type}) && !showMsgs && displayMessage(),

// Displays random messages, with message flood protection.
randomMsg = (msgs, isJoke, i = 0, randMsg) => {
  if (messages.length || !hasFocus())
    // There are already messages waiting in the queue, or the player is not watching, wait a bit and try again.
    // Except if it's a joke, just give that a miss.
    !isJoke && setTimeout(X => randomMsg(msgs), num2000);
  else if (msgs)
    // Make 3 attempts to choose a unique message.
    for (; i++ < 3;) {
      randMsg = pickRandom(msgs);
      // Check if the message is not in the last chosen messages.
      if (!randomMsgs.includes(randMsg.join(';'))) {
        // Call msg() with the random message
        for (let [,rm] of randMsg.entries()) msg(rm);
        // Add the message to the last chosen messages array.
        randomMsgs.push(randMsg.join(';'));
        // Keep the last chosen messages array limited to 10 elements.
        randomMsgs.length > 10 && randomMsgs.shift();
        // Break as a message has been successfully chosen.
        break;
      }
    }
    // No unique message found after 3 attempts - do nothing further.
},

// Randomly shows a joke message.
joker = (i = totalFarmCount() - 1, lastmsgEl = getEl('messages').firstChild) => {
  !lastmsgEl && randomMsg(jokes[i < 5 ? max(0, i) : 0], 1);
  setTimeout(joker, randomInt(longDelay) + longDelay);
},

// Outputs a warning msg, but only if one from the same set hasn't been shown recently, and only if it's for the current farm.
playerHint = (farm, msgs) => {
  while (warnings[0] && warnings[0][1] < getTime() - longDelay) warnings.shift();
  if (hasFocus() && !warnings.some(w => w[0] == farm.id + msgs.join(';'))) {
    if (currentFarm(farm)) {
      msg(pickRandom(msgs), 'warn');
      warnings.push([farm.id + msgs.join(';'), getTime()]);
    }
    else {
      playerHint(F, [`"${farm.n}" (${getFarmDesc(farm)}) needs attention!`]);
      setTimeout(X => playerHint(farm, msgs), shortDelay);
    }
  }
},

// Handles the common audio playing functionality between ambience() and ambienceOverride().
playAmbientAudio = (audioFile, volInc, delay, audio = getEl('audio')) => {
  stopInterval(volumeUp);
  audio.volume = 0;
  audio.src = `audio/${audioFile}.opus`;
  audio.play();
  // Fade in to prevent jarring start.
  volumeUp = setInterval(X => {audio.volume < _.vol / 100 ? audio.volume = min(audio.volume + volInc, 1) : stopInterval(volumeUp)}, delay);
  return audio;
},

// Starts playing bg audio.  This is a click-event handler, because browsers don't like playing audio without user interaction first.
ambience = e => {
  userClicked = 1;
  playAmbientAudio(_.au || 'wind', .01, num500);
  document.removeEventListener('click', ambience);
},

// Override the bg audio.  This code assumes it is being run in response to user interaction and does not check that.
// Calling code is responsible for resuming normal ambience() when done with this.
ambienceOverride = audioFile => playAmbientAudio(audioFile, .1, 5),

// Starts the fight song (if required).
playFightSong = X => {
  if (userClicked && !fightVolume) {
    fightSong = new Audio('audio/fight.opus');
    fightSong.volume = .001; // Don't start at zero so as to block successive calls to this func.
    fightSong.loop = 1;
    // Fade in, but try to keep the volume of fight song 10% lower than global volume so it is hardly audible at lowest volume setting.
    fightVolume = setInterval(X => {fightSong.volume + .1 < _.vol / 100 ? fightSong.volume = min(fightSong.volume + .01, 1) : fightVolume = stopInterval(fightVolume)}, 5);
    fightSong.play();
    randomMsg([['Two rival ants are fighting!'], ['Ants are having a fight!'], ['An ant is fighting an enemy!'], ['A fight has broken out!'], ['One of your ants is battling a foe!']]);
  }
},

// Stops the fight song (if required).
checkFightSong = X => {
  if (fightSong && F.a.every(ant => !ant.fight)) {
    stopInterval(fightVolume);
    fightVolume = setInterval(X => {fightSong.volume > 0 ? fightSong.volume = max(0, fightSong.volume - .01) : (fightSong.pause(), fightSong = 0, fightVolume = stopInterval(fightVolume))}, frameTick);
  }
},

// Plays a sound effect.
playSound = (snd, v = 1) => {
  if (userClicked) {
    let audio = new Audio(`audio/${snd}.opus`);
    audio.volume = min(1, (_.vol / 100) * v);
    audio.play();
  }
}; // <--- Note the semi-colon here: end of main 'let' statement.


//
// Global utilities & function library (referenced dynamically).
//

// Restarts game.
// Note: Short name because it is a global function expression that must not have a name mangled by terser.
Q = X => {quitting = 1; localStorage.removeItem('_'); location.reload()};


//***************//
// Load the app. //
//***************//
window.addEventListener('load', antFarmSocial);

