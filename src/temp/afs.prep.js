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
elCache = [], // Element cache.
wayPoints = {}, // Tunnel waypoints
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
glassDragInterval, // Glass drag interval.
glassDragX, // Glass drag x-position.
glassDragY, // Glass drag y-position.
quitting, // Quitting game flag.
pickedAntEl, // Picked ant.
pouring,

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
deg540 = 540,
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
sqrt = Math.sqrt, pow = Math.pow, round = Math.round, atan2 = Math.atan2, hypot = Math.hypot, sin = Math.sin, cos = Math.cos,
keys = Object.keys, values = Object.values, assign = Object.assign, entries = Object.entries,

// Convenience functions.
query = document.querySelector.bind(document),
queryAll = document.querySelectorAll.bind(document),
getEl = document.getElementById.bind(document),
hasFocus = X => document.hasFocus(),
getTime = Date.now,
getTimeSec = (ts = getTime()) => floor(ts / num1000),
appendHTML = (el, html) => el.insertAdjacentHTML('beforeend', html),
randomInt = mx => floor(random() * (mx + 1)),
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
normalize180 = a => ((a + deg540) % deg360) - deg180,
// Normalizes an angle.
normalize360 = a => (a + deg360) % deg360,
// Gets the opposite of an angle.
oppositeAngle = a => normalize360(a + deg180),
// Gets the mirror of an angle.
mirrorAngle = a => normalize360(deg180 - a),
// Gets the flip of an angle.
flipAngle = a => normalize360(deg360 - a),
// Gets the angle between two precalculated delta values.
angleFromDelta = (dx, dy, offset = 0) => normalize360(radToDeg(atan2(dy, dx)) + offset),
// Gets the angle between two objects that have x/y props.
getAngle = (a, b, r = angleFromDelta(b.x - a.x, b.y - a.y)) => r || deg360,
// Linearly interpolates between two angles along the shortest path.
lerpAngle = (a, b, t) => a + normalize180(b - a) * t,
// Provides quadratic easing in: starts slow and accelerates.
easeInQuad = t => t * t,
// Provides quadratic easing out: starts fast and slows toward the end.
easeOutQuad = t => 1 - easeInQuad(1 - t),
// Calculates distance with components.
calcDistComponents = (x1, y1, x2, y2, dx = x2 - x1, dy = y2 - y1, dist = sqrt(dx * dx + dy * dy)) => ({d: dist, x: dist ? dx / dist : 0, y: dist ? dy / dist : 0}),
// Performs a simple distance calculation.
calculateDistance = (x1, y1, x2, y2) => calcDistComponents(x1, y1, x2, y2).d,

// Mark load time, used for various purposes.
loadTime = getTime(),

// Loads the app.
antFarmSocial = X => {
  // Adapt viewport to client's display.
  appendHTML(document.getElementsByTagName('head')[0], `<meta name=viewport content="width=1180, height=1100, initial-scale=${min(screen.width / 1180, screen.height / 1100)}, user-scalable=no">`);
  // Fetch stored data.
  load();
  // Set correct background.
  setBg();
  // Add an event handler for the bag link.
  getEl('a-bag').addEventListener('click', X => popup('bag', 0, 0));
  // Add an event handler for the magnifying glass link.
  getEl('a-tg').addEventListener('click', toggleGlass);
  // Add an event handler for the carousel link.
  getEl('a-car').addEventListener('click', toggleCarousel);
  // Handle the score/stats popup button.
  getEl('score').addEventListener('click', X => popup('stats', 0, 0));
  // Add an event handler for the stow link.
  getEl('stow').addEventListener('click', stow);
  // Create the free ant array, also clears any existing free ants stored in the data.
  _.a = [];
  // Fix unfinished sculptures. Must be run before switchFarm().
  _.farms.filter(farm => farm.mTuns && !farm.sculpt).forEach(farmSetSculpture);
  // Check if loaded farms exist and set default if needed.
  !_.farms.length ? addFarm() : switchFarm(_.F);
  // Start farm activity. Must be run after switchFarm().
  _.farms.forEach(farm => {
    if (!farm.sculpt) {
      updateWaypoints(farm); // Calculate waypoints.
      farm.a.forEach(a =>
        a.state == 'free' && antCap(a, objGetEl(a)) // Fix ants that didn't cop a cap before the last save().
        || antAction(a)
      );
      getVial(farm)?.item.a.forEach(a => a.nipPh > 2 && exitVial(a)); // Fix ants trying to leave a vial.
    }
  });
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
  // Start ambient audio.
  document.addEventListener('click', ambience);
  // Activate message log button.
  setupMsgLog();
  // Set up the switch control panel.
  setupSwitcher();
},

// Retrieves all data from local storage.
// Note: Start at half volume so you can listen to a podcast while playing.
load = X => _ = JSON.parse(localStorage.getItem('_') || '{"score":0,"farms":[],"bag":[],"ach":{},"achQ":[],"vol":50,"bg":"","grad":0,"sac":0,"arty":0,"scene":{},"man":0}'),

// Saves all data to local storage.
// Will not allow saving within 30s of loading the page due to suspected exploit.
// Note: This func does not filter zero/default values, round floats, or compress/smol-string/minson data before saving, all worth considering for future updates if data size becomes an issue.
save = X => {checkAchievements(); getTime() - loadTime > standardDelay && !quitting && localStorage.setItem('_', JSON.stringify(_))},

// Logs a time duration field on an object for calculating running times, as well as a timestamp for when the time duration field was last updated.
// Must be called on app load and then at regular intervals such as 30 seconds.  Developer must default fields on objects to dur=0 and ts=getTimeSec() upon creation.
timeLog = (obj, dur = 'dur', ts = 'ts', now = getTimeSec()) => {
  obj[dur] += now - max(getTimeSec(loadTime), obj[ts]); // Time duration field.
  obj[ts] = now; // Timestamp field.
},

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

// Gets a farm by id or an object with a .f property which is the farm id.
// Note: This function must fail silently when fid is invalid because it is often used without checking that first.
getFarm = fid => getById(_.farms, fid?.f || fid),

// Determines if a farm object is of the currently displayed farm.
currentFarm = farm => farm.id == F.id,

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
  // Resume by recreating farm.
  F.fill && startFarm();
  // Redraw capped ants.
  F.a.forEach(a => {
    a.mag = a.flare = 0; // Remove mag styles.
    antDraw(a);
    carryDraw(a.carry, a);
  });
  // Redraw nipped ants.
  F.nips.forEach(n => n.item.a.forEach(a => {
    antDraw(a, getEl('a-' + nipIds[n.nip]));
    carryDraw(a.carry, a);
  }));
  let kit = getEl('kit');
  kit.dataset.id = farmId;
  // Shake handler.
  getEl('glass').addEventListener('click', X => {
    !bodyClasses.contains('glass') && (
      kit.classList.add('shake'),
      setTimeout(X => kit.classList.remove('shake'), num500),
      !randomInt(10) && farmIsRunning(F) && randomMsg(tapMsg)
    );
  });
  kit.offsetWidth; // This is a hack to "trigger layout" reflow - do not remove.
  swipeDir && kit.classList.remove(swipeDir > 0 ? 'swipeR' : 'swipeL');
  // Activate or update the switcher if needed.
  updateSwitcher();
  // Handle fight music.
  fightSongCheckAndStop();
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
    // New farm message.
    !_.score && !spilled && randomMsg(newFarm);
  }
  // Draw tunnels.
  F.tuns.forEach(drawTun);
  if (F.sculpt) {
    // Draw mTuns sculptures.
    F.mTuns.forEach(drawTun);
    mTunsBg();
    getEl('kit').classList.add('sculpt');
    getEl('wrapper').innerHTML += tag(2, F.n);
  }
  // Draw hills.
  F.hills.forEach(drawHill);
  // Draw card.
  if (F.card) getEl('card').style.background = `url(img/${F.card}.webp)`;
  // Draw anomaly.
  F.hair ?
    appendHTML(getEl('fill'), img('hair', {id: 'Fh', style: `position:absolute;bottom:${F.hair[0]}px;left:${F.hair[1]}px;transform:rotate(${F.hair[2]}deg);opacity:.6`})) :
    getEl('Fh')?.remove();
  // Draw items.
  addItems();
  addDecals();
  addNipItems();
  // Re-add eggs into the farm.
  F.e.forEach(eggDraw);
  // Add lid function.
  if (F.items.length || F.card || F.a.some(deadInFarm)) addLidFunc();
  // Re-enable spawner if it got turned off by something.
  !spawner && !F.sculpt && setTimeout(X => {spawner = 1; spawnAnt()}, num1000);
},

// Precalculates the tunnel system layout of the current ant farm.
calcFarm = (numEntrances = 2 + randomInt(4), tries = 0, hills = [-50, 1010], sublevels = [0, 120, 240, 380, 495], adjustedTun = 0, adjustLeft = !randomInt(4),
  adjustRight = !randomInt(4), entX, xCollector = [], cavLines = [], lines = [], joinLines = [], sublvl = 1, i = 0, stubEntIndex = -1) => {
  // Ants do not randomly pick tunnel surface entrances, the program does.
  // It also places the adjacent hills in position, but set at zero height, so they can grow as the tunnels are dug.
  while (keys(F.tuns).length < numEntrances && 100> tries++) {
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
      remainingWhiteSpace, randomSpace, tun, cavHalfHeight, yOffset, prevTun, line;
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
          y1: sublevels[sublvl] + randomInt(56) - 30,
          prog: 0,
        },
        cavHalfHeight = tun.h / 2;
      left += tun.w;
      // Calculate x2/y2.
      calcTailPoint(tun);
      // Bump down if too close to the cav above.
      F.tuns.some(t => t.lvl == tun.lvl - 1 && t.h / 2 + max(t.y1, t.y2) + 6 > min(tun.y1, tun.y2) - cavHalfHeight) && (tun.y1 += 15) && calcTailPoint(tun);
      // Pull the cavity upward if it is too far below the bottom.
      if (sublvl == 4) {
        let distanceToBottom = max(surface - tun.y1 - (tun.h / 2), surface - tun.y2 - (tun.h / 2));
        if (distanceToBottom < 0) tun.y1 += distanceToBottom;
        if (max(tun.y1 + tun.h / 2, tun.y2 + tun.h / 2)> surface) tun.y1 -= tun.h / 2;
      }
      // Pull cavities to the tube nip if required.
      if (sublvl == 3) {
        if (adjustLeft && !cavNum) {
          tun.x1 = -5;
          yOffset = tun.y1 - 332;
          tun.y1 -= yOffset;
          tun.nip = 1; // Nip left.
          adjustedTun = tun;
        }
        if (adjustRight && cavNum == cavCount - 1) {
          tun.x1 = 965 - tun.w;
          yOffset = tun.y2 - 332;
          tun.y1 -= yOffset;
          tun.nip = 2; // Nip right.
          adjustedTun = tun;
        }
      }
      // Re-calculate x2/y2.
      calcTailPoint(tun);
      // Find joining lines.
      lineFinder(lines, tun.id, tun.lvl, 'x2', 'y2', tun.x1, tun.y1, 0, -40);
      lineFinder(lines, tun.id, tun.lvl, 'x1', 'y1', tun.x2, tun.y2, -40, 0);
      lineFinder(lines, tun.id, tun.lvl, 'x1', 'y1', tun.x1, tun.y1, 0, -40);
      lineFinder(lines, tun.id, tun.lvl, 'x2', 'y2', tun.x2, tun.y2, -40, 0);
      // Store the top and bottom of the cav as obstructions.
      cavLines.push({x1: tun.x1, y1: tun.y1 - cavHalfHeight, x2: tun.x2, y2: tun.y2 - cavHalfHeight});
      cavLines.push({x1: tun.x1, y1: tun.y1 + cavHalfHeight, x2: tun.x2, y2: tun.y2 + cavHalfHeight});
      // Add the sideways line.
      if (rowCavs.length) {
        prevTun = last(rowCavs);
        line = {tids: [tun.id, prevTun.id], x1: prevTun.x2, y1: prevTun.y2, x2: tun.x1, y2: tun.y1, l: calculateDistance(prevTun.x2, prevTun.y2, tun.x1, tun.y1)};
        line.r = angleFromDelta(line.x2 - line.x1, line.y2 - line.y1);
        line.score = line.l < 50 ? 100 : 100 - (xCollector.filter(val => val.x > line.x1 && val.x < line.x2).length * 10) - (line.r % 90 < 23 || line.r % 90> 67 ? 20 : 0);
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
    line.score = ((!line.y1 || !line.y2) && F.tuns.filter(tun => tun.lvl === 1).reduce((acc, tun) => (tun.x1 >= line.x1 && tun.x1 <= line.x2) || (tun.x2>= line.x1 && tun.x2 <= line.x2), 0)) || cavLines.some(ln => doLinesIntersect(line, ln, 6)) ?
    0 : line.l < 50 ? 100 : 100 + line.score - (xCollector.filter(val => val.x > line.x1 && val.x < line.x2).length * 20) - (line.r % 90 < 23 || line.r % 90> 67 ? 20 : 0);
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
      F.tuns.splice(stubEntIndex, 1);
    }
  } while (stubEntIndex != -1);
  // Keep only the accessible tunnels.
  F.tuns = F.tuns.filter(tun => findPath(F, tun, {t: 'ent'}));
  // In the rare cases where:
  // - No tuns left after filtering
  // - Adjusted tun is gone
  // - Adjusted tun has no path to the entrance
  // - There are fewer than 5 chamber cavities with paths to an entrance
  // It is a bad design. Used to do clearVars() and dumpFarm(1), but it's more fun to add
  // this feature where the user is blamed for a spill (and trigger it randomly too).
  if (!randomInt(50) || !F.tuns.length || !adjustedTun || !findPath(F, adjustedTun, {t: 'ent'}) || F.tuns.filter(tun => tun.t == 'cav' && findPath(F, tun, {t: 'ent'})).length < 5)
    return spill();
  // Store hills.
  for (i = 0; i < hills.length; i += 2) F.hills.push({id: i / 2, l: hills[i], r: hills[i + 1], h: 0});
},

// Handles the generation of random border radius values.
borderRadius = (min, range) => Array.from({length: 6}, X => `${min + randomInt(range)}px`).reduce((acc, val, i) => acc + (i == 4 ? ' / ' : ' ') + val),

// Handles a farm creation bug that is easily fixable with a reload.
spill = X => {
  // Blame the player and don't give them the fill item back so it looks like a feature.
  switcher = 0;
  spilled = 1;
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
      0).filter(Boolean).filter(tunLn => !joinLines.some(ln => doLinesIntersect(tunLn, ln, 2))))
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
      // Figure out the top and bottom one.
      topConn = conn1.y1 < conn2.y1 ? conn1 : conn2,
      botConn = conn1.y1> conn2.y1 ? conn1 : conn2,
      // Add the joining tunnel.
      // It would be better to create 3 or 4 tunnels in an s-shape with offset 'con' pieces along the way. But this works for now.
      tunnel = {
        t: 'tun',
        id: 'tun-' + joinLines.length,
        lvl: (topConn.lvl + botConn.lvl) / 2,
        h: 14,
        w: hypot(botConn.x2 - topConn.x1, botConn.y2 - topConn.y1),
        r: angleFromDelta(botConn.x2 - topConn.x1, botConn.y2 - topConn.y1),
        br: borderRadius(5, 2),
        co: [conn1.id, conn2.id],
        x1: topConn.x1,
        y1: topConn.y1,
        x2: botConn.x2,
        y2: botConn.y2,
        prog: 0,
      };
    // Create inter-connection data.
    conn1.co.push(tunnel.id);
    conn2.co.push(tunnel.id);
    //
    dev && DL({x1: conn1.x1, y1: conn1.y1, x2: conn2.x2, y2: conn2.y2});
    F.tuns.push(tunnel);
  }
},

// Finds paths for traversing tunnel systems and determines if and how tunnel pieces connect.
// When calculating paths for ant to actually walk on, pathDun should probably be 1, meaning that the tunnels in the path have to be completed.
// This is different when testing proposed future tunnels for whether yet-to-be-built tunnels would actually connect them properly to an entrance.
// To understand usage; best to study how this function is used in the various cases where it is employed.  Sometimes used in reverse!
findPath = (farm, tun, targetAttrs, path = [], invertMatch = 0, pathDun = 0, firstTunId = 0, tid, result) => {
  // If the current tunnel matches all target attributes, return the path.
  if (keys(targetAttrs).every(attr => invertMatch ? tun[attr] != targetAttrs[attr] : tun[attr] == targetAttrs[attr])) return path;
  if (!pathDun || tun.dun || !firstTunId)
    // Recursively search for the path. (Shuffle the next tunnels to introduce randomness.)
    for (tid of shuffle(tun.co.filter(tid => !path.includes(tid) && tid != firstTunId)))
      if (result = findPath(farm, getTun(farm, tid), targetAttrs, [...path, tid], invertMatch, pathDun, firstTunId || tun.id)) return result;
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
lineFinder = (lines, tunId, thisLevel, xK, yK, tunX, tunY, score1, score2, t,
  findLine = (tId2, x1, y1, x2, y2, score, line = {tids: [tunId, tId2], x1: x1, y1: y1, x2: x2, y2: y2, d: abs(x2 - x1), l: calculateDistance(x1, y1, x2, y2), score}) => {
    if (F.tuns.filter(ot => ot.t != 'ent' && tId2 != ot.id).every(ot => !doLinesIntersect(ot, line, 20))) {
      line.r = angleFromDelta(x2 - x1, y2 - y1);
      x1 > 5 && x2 > 5 && x1 < 955 && x2 < 955 && lines.push(line);
    }
  }) => {
  for (t of F.tuns) if (t.lvl < thisLevel) t[xK] < tunX ? findLine(t.id, t[xK], t[yK], tunX, tunY, score1) : findLine(t.id, tunX, tunY, t[xK], t[yK], score2);
},

// Checks if two lines (actually rectangles) intersect along their length.
doLinesIntersect = (line1, line2, thickness, ignoreEnds = 30, returnIntersectionPoint = 0) => {
  let {x1: x1_1, y1: y1_1, x2: x2_1, y2: y2_1} = line1,
    {x1: x1_2, y1: y1_2, x2: x2_2, y2: y2_2} = line2,
    pointAlongLine = (x1, y1, x2, y2, distance, ratio = distance / calculateDistance(x1, y1, x2, y2)) => ({x: x1 + ratio * (x2 - x1), y: y1 + ratio * (y2 - y1)}),
    adjusted1 = pointAlongLine(x1_2, y1_2, x2_2, y2_2, ignoreEnds),
    adjusted2 = pointAlongLine(x2_2, y2_2, x1_2, y1_2, ignoreEnds),
    getDirection = (x1, y1, x2, y2, x3, y3) => ((x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)),
    d1 = getDirection(adjusted1.x, adjusted1.y, adjusted2.x, adjusted2.y, x1_1, y1_1),
    d2 = getDirection(adjusted1.x, adjusted1.y, adjusted2.x, adjusted2.y, x2_1, y2_1),
    d3 = getDirection(x1_1, y1_1, x2_1, y2_1, adjusted1.x, adjusted1.y),
    d4 = getDirection(x1_1, y1_1, x2_1, y2_1, adjusted2.x, adjusted2.y),
    intersect = ((d1 > 0 && d2 < 0) || (d1 < 0 && d2> 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4> 0)),
    expandLineToStrip = (x1, y1, x2, y2, thickness, dist = calcDistComponents(x1, y1, x2, y2), offsetX = (thickness / 2) * dist.y, offsetY = (thickness / 2) * dist.x) =>
      [{x: x1 - offsetX, y: y1 + offsetY }, {x: x1 + offsetX, y: y1 - offsetY}, {x: x2 + offsetX, y: y2 - offsetY}, {x: x2 - offsetX, y: y2 + offsetY}],
    rectanglesIntersect = (rect1, rect2) => !(
      max(rect1[0].x, rect1[1].x, rect1[2].x, rect1[3].x) < min(rect2[0].x, rect2[1].x, rect2[2].x, rect2[3].x) ||
      min(rect1[0].x, rect1[1].x, rect1[2].x, rect1[3].x)> max(rect2[0].x, rect2[1].x, rect2[2].x, rect2[3].x) ||
      max(rect1[0].y, rect1[1].y, rect1[2].y, rect1[3].y) < min(rect2[0].y, rect2[1].y, rect2[2].y, rect2[3].y) ||
      min(rect1[0].y, rect1[1].y, rect1[2].y, rect1[3].y)> max(rect2[0].y, rect2[1].y, rect2[2].y, rect2[3].y)
    ),
    denominator = ((x1_1 - x2_1) * (y1_2 - y2_2) - (y1_1 - y2_1) * (x1_2 - x2_2));
  return returnIntersectionPoint && intersect && denominator != 0 ? {
      x: ((x1_1 * y2_1 - y1_1 * x2_1) * (x1_2 - x2_2) - (x1_1 - x2_1) * (x1_2 * y2_2 - y1_2 * x2_2)) / denominator,
      y: ((x1_1 * y2_1 - y1_1 * x2_1) * (y1_2 - y2_2) - (y1_1 - y2_1) * (x1_2 * y2_2 - y1_2 * x2_2)) / denominator
    } : intersect || rectanglesIntersect(expandLineToStrip(x1_1, y1_1, x2_1, y2_1, thickness), expandLineToStrip(adjusted1.x, adjusted1.y, adjusted2.x, adjusted2.y, thickness));
},

// Gets tun object from tun ID.
getTun = (farm, id) => id && getById(farm.tuns, id),

// Renders a tunnel.
drawTun = tun => {
  appendHTML(
    getEl('tunnels'),
    html(divc('prog'), {id: tun.id, class: 'tp ' + tun.t, style: `left:${tun.x1}px;top:${tun.y1}px;height:${tun.h}px;width:${tun.w}px;transform:rotate(${tun.r}deg);border-radius:${tun.br}` + ((isRotationTunnel(tun) ? `;margin-left:-${tun.w / 2}px` : '') + `;margin-top:-${tun.h / 2}px`)})
  );
  tunProgDraw(tun);
},

// Updates tunnel progress.
// Note: calling function is responsible for making sure the relevant farm is currently displayed.
tunProgDraw = (tun, progEl = query(`#${tun.id} .prog`), tunEl = getEl(tun.id)) => {
  if (progEl) {
    tun.rwip && progEl.classList.add('rwip');
    switch (tun.t) {
      case 'ent':
        progEl.style.top = tun.prog / 100 * 15 - 15 + 'px';
        break;
      case 'con':
        progEl.style.height = progEl.style.width = tun.h * tun.prog / 100 + 'px';
        tunEl.style.marginTop = tunEl.style.marginLeft = -tun.h * tun.prog / 200 + 'px';
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

// Updates the wayPoints global.
updateWaypoints = farm => {wayPoints[farm.id] = reorderAndSmoothWaypoints(filterWaypoints(farm.tuns.filter(t => t.prog > 0).map(t => calculateWaypoints(t))))},

// Calculates waypoints for the perimeter of the tunnel area.
calculateWaypoints = (tun, step = 5, pivotX = tun.x1, pivotY = tun.y1, wipBr = {x: 7, y: 7}, points = [], i) => {
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
        points.push({x: cx + rx * cos(rad), y: cy + ry * sin(rad)});
      }
      return points;
    };
  // Corrections.
  y1 -= h / 2;
  if (t == 'con' || t == 'ent') x1 -= w / 2;
  if (t == 'cav') pivotY = (y1 + y2) / 2;
  // Arc trimming.
  if (totalVert> h) {
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
      if (t == 'con') {
        h = w;
        x1 = x1 - w / 2;
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
  return points.map((p, index, arr, rad = degToRad(r), dx = p.x - pivotX, dy = p.y - pivotY) => ({x: cos(rad) * dx - sin(rad) * dy + pivotX, y: sin(rad) * dx + cos(rad) * dy + pivotY}));
},

// Removes points that are inside other shape's perimeters or out-of-bounds.
filterWaypoints = (segments, inShape = (point, perimeterPoints, y = point.y, n = perimeterPoints.length, inside = 0, i = 0, j = n - 1) => {
    for (; i < n; j = i++) {
      let xi = perimeterPoints[i].x, yi = perimeterPoints[i].y, yj = perimeterPoints[j].y;
      if ((yi> y) !== (yj > y) && point.x < ((perimeterPoints[j].x - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }) => {
  segments.forEach((points, index, i) => {
    points.forEach(p => {
      for (i = 0; i < segments.length; i++)
        if (i !== index && inShape(p, segments[i]) || p.y < 2 || p.x < 0 || p.x> 960) {
          p.r = 1;
          break;
        }
    });
  });
  return stitchWaypointSegments(segments.map(points => filterCloseWaypoints(points.filter(p => !p.r))).filter(segment => segment.length > 2));
},

// Cleans up the waypoints.
reorderAndSmoothWaypoints = (points, radius = 2, factor = .2, remaining = [...points], segments = [], i, j) => {
  remaining.sort((a, b) => a.y - b.y);
  while (remaining.length) {
    let segment = [], current = remaining.shift(), nearestIndex, nearestDist, d;
    segment.push(current);
    while (remaining.length) {
      nearestIndex = -1;
      nearestDist = Infinity;
      for (i = 0; i < remaining.length; i++) {
        d = calculateDistance(current.x, current.y, remaining[i].x, remaining[i].y);
        if (d < nearestDist) {
          nearestDist = d;
          nearestIndex = i;
        }
      }
      if (nearestDist> 12) break; // The max distance between points to consider.
      current = remaining.splice(nearestIndex, 1)[0];
      segment.push(current);
    }
    segments.push(segment.length > 2 ? segment.map((p, i, arr, sumX = 0, sumY = 0, count = 0, maxNeighborDist = 0, neighbor, d, pt) => {
      if (p.y < 50) return p; // Skip smoothing for low-y points
      for (j = i - radius; j <= i + radius; j++) {
        if (neighbor = arr[(j + arr.length) % arr.length]) {
          d = calculateDistance(p.x, p.y, neighbor.x, neighbor.y);
          if (d> maxNeighborDist) maxNeighborDist = d;
        }
      }
      if (maxNeighborDist > 12) return p;
      for (j = i - radius; j <= i + radius; j++)
        if (j>= 0 && j < arr.length) {
          pt = arr[j];
          sumX += pt.x;
          sumY += pt.y;
          count++;
        }
      return count ? {x: p.x + (sumX / count - p.x) * factor, y: p.y + (sumY / count - p.y) * factor} : p;
    }) : segment);
  }
  return stitchWaypointSegments(segments.filter(segment => segment.length > 5));
},

// Filters out waypoints that are too close to each other.
filterCloseWaypoints = (points, result = [], i, p) => {
  for (i = 0; i < points.length; i++) {
    p = points[i];
    if (!result.some(q => hypot(p.x - q.x, p.y - q.y) < 2)) result.push(p);
  }
  return result;
},

// Stitches together segments of waypoints in an intelligent way to preserve as much continuity as possible.
stitchWaypointSegments = (segments, stitched = []) => {
  while (segments.length) {
    let current = segments.shift(), i, c;
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
          if (calculateDistance(c[0].x, c[0].y, c[1].x, c[1].y) < 12) {
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
  // The waypoints also store their own index.
  return stitched.flat().map((wp, i) => ({...wp, i}));
},

// Renders hills.
drawHill = hill => {
  appendHTML(getEl('hills'), html(divc('specks'), {id: 'hill-' + hill.id, class: 'hill', style: `left:${hill.l}px;width:${hill.r - hill.l}px`}));
  hillProgDraw(hill);
},

// Updates hill height.
hillProgDraw = hill => getEl('hill-' + hill.id).style.height = /*(hill.h > 3 ? hill.h : 0)*/hill.h + 'px', /// Hills need to be over 3px for hill to show otherwise there are visual artifacts in the browser.

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

// Set up the switch control panel.
setupSwitcher = (switchEl = getEl('switch'), switchUp = getEl('switch-up')) => {
  switchUp.addEventListener('click', (e, isUp = switchEl.classList.toggle('up')) => switchUp.innerText = isUp ? '▼' : '▲');
  getEl('switch-control').addEventListener('click', switchFunc);
},

// Supports the switcher functionality.
switchFunc = (e, farmId = e.target.closest('.switch-f')?.dataset.id) => farmId && F.id != farmId && switcher && switchFarm(farmId),

// Updates the farm switch control panel.
updateSwitcher = X => {
  if (_.farms.length > 1) getEl('switch').classList.add('vis');
  getEl('switch-control').innerHTML = '';
  _.farms.forEach(f => getEl('switch-control').appendChild(getTemplate(html(html(f.sculpt ? img('sculpt') : getFarmThumbnail(f), {class: 'sw-t'}), {class: 'switch-f' + (currentFarm(f) ? ' cur' : ''), 'data-id': f.id}))));
  setTimeout(X => switcher = 1, num1000); // Re-enable switcher.
  // Prevent soft-lock due to crucible functionality. (Checked here because this func is somewhat of a multi-farm overwatcher)
  _.farms.length && _.farms.every(f => f.sculpt) && !_.bag.some(obj => obj.k == 'antFarm') && setTimeout(X => drop('antFarm'), shortDelay);
  /* START-DEV */
  dev && devNotifySwitch(); // Tell the dev script that a switch happened.
  /* END-DEV */
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
    appendHTML(getEl(isFood ? 'food' : item.t), html(isFood ? foodCode(item) : sceneImg(item), {id: item.id, style: 'left:' + item.x, class: items[item.k].t, 'data-fx': items[item.col]?.fx}));
  }) || updateFoodAndDrink(),

// Re-adds placed stickers when switching to farm or loading page.
addDecals = X => F.decals.forEach(decal => appendDecalImg(getEl('decals'), decal, '')),

// Re-adds the nip items if needed.
addNipItems = X => {
  F.nips.forEach(n => {
    let nipItem = n.item, nipId = nipIds[n.nip], isVial = nipItem.k == 'vial', itemEl = isVial ? getEl('vial') : getEl('t-' + nipId);
    getEl(nipId).classList.add('off', 'hide');
    itemEl.classList.add(nipId, 'on', 'vis');
    getEl('a-' + nipId).classList.add('on', !isVial && 'fade');
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
bagImg = (bagItem, item = items[bagItem.k]) => ['scenery', 'decor'].includes(item.t) ? sceneImg(bagItem) :
  ['paintm', 'paint'].includes(item.t) ? sceneImg({k: item.fx == 'm' ? 'paintm' : 'paint', col: bagItem.k }) :
  item.t == 'ants' ? sceneImg({k: 'ants', col: item.col || bagItem.col }) :
  img(item.t == 'hat' ? 'hat' : bagItem.k, {}, item.ext),

// Dumps the current farm, and optionally restart.
dumpFarm = restart => {
  // Stow scenery items in bag.
  if (F.card) {
    _.bag.push({k: F.card});
    F.card = getEl('card').style.background = '';
  }
  // Remove scenery and decor items, and place into bag.
  F.items.forEach(item => item.t != 'food' && item.t != 'drink' && _.bag.push(item));
  F.items = [];
  getEl('scenery').innerHTML = '';
  getEl('food').innerHTML = '';
  if (!restart) F.fill = '';
  F.a.forEach(antDelete);
  F.e.forEach(eggDelete);
  // Reset farm to defaults.
  del(assign(F, cloneData(farmDefault)), 'dun', 'hair');
  // Undraw tunnels and hills.
  // Save these changes.
  save();
  if (!spilled) {
    getEl('tunnels').innerHTML = '';
    getEl('hills').innerHTML = '';
    // This should handle the rest...
    startFarm(restart);
  }
  updateSwitcher();
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
      doDel = 0; // Don't delete because it will dump the item before the setTimeout below can check it.
      if (itemKey == 'vial') {
        setTimeout(X => {
          nippleSelection((nip, vialEl = getEl('vial'), nipId = nipIds[nip]) => {
            emptyVial.a = [];
            emptyVial.e = [];
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
                  del(ant, 'nipPh', 'vial');
                  checkExpatQueen(ant, F);
                  dropAntInFarm(ant);
                }, num500 * a);
              }
              emptyVial.a = [];
            }
            else {
              for (let a = 0; a <= (items[itemKey].W || 0); a++) {
                setTimeout(X => {
                  dropAntInFarm(assign(createAnt(_, window.innerWidth / 2 + randomInt(num200) - 100, -30, randomInt(30), 'free', a ? 'W' : 'Q', items[itemKey].ant), {
                    scale: getSign(randomInt(1)),
                    pose: 'pick',
                    alate: 0,
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
          }, num500);
        }, num500);
      }
    },
    paint() {doDel = 0; popup('paint', i)}, // Don't del as we aren't marking every paint with "keep: 1", the popup workflow will do it.
    hat() {doDel = 0; popup('hat', i)}, // Don't del as we aren't marking every hat with "keep: 1", the popup workflow will do it.
  },
  keyHandlers = {
    plate() {popup('plate', i)},
    tube() {popup('tube', i)},
    feng() {popup('feng', i)},
    antfax() {popup('antfax', i)},
    antfaxpro() {keyHandlers.antfax()},
    antyvenom,
    cologne(fx = getEl('fx')) {
      playSound('spray', .7);
      fx.classList.add('fog');
      for (; j < 20;) setTimeout(X => {spawnAnt(0); spawnAnt(0); spawnAnt(0)}, j++ * shortDelay);
      setTimeout(X => {
        fx.classList.add('fog2');
        setTimeout(X => fx.classList.remove('fog', 'fog2'), 4500);
      }, 19 * shortDelay);
    },
    bus(countFarms = _.farms.filter(farmIsRunning).length, loc = pickRandom(countFarms == 4 ? ['dystopia'] : keys(locs).filter(lk => countFarms < 3 || countFarms> 4 ? lk != 'dystopia' : lk)), newBg = loc + (randomInt(locs[loc].c - 1) + 1)) {
      if (newBg == _.bg) return keyHandlers.bus(); // Note: this could potentially recurse infinitely causing stack problems, but the odds are low enough to be negligible.
      _.bg = newBg;
      _.au = locs[loc].a;
      ambience();
      setBg();
    },
    backdrop() {_.grad = (_.grad + 1) % 8; _.bg = ''; setBg()},
    clonekit() {clone(3)},
    speedo() {_.ss = Date.now() + (3 * longDelay) + randomInt(longDelay); doWarp(); randomMsg(items['speedo'].quip)},
    ebay() {popup('ebay', i)},
    antFarm() {addFarm(); score(20, 1)},
    mom() {msg('<b>Win.</b>', 'err'); _.win = 1; score(100, 1)},
    crucible() {pourCrucible()},
    sculpt() {_.farms.push(item.f); switchFarm(item.f.id)},
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
  onDown = (e, rect = obj.getBoundingClientRect()) => e.clientX >= rect.left && e.clientX <= rect.right && e.clientY>= rect.top && e.clientY <= rect.bottom && commit()) => {
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
  let obj = getEl(decal.id), imgWidth = obj.offsetWidth, imgHeight = obj.offsetHeight,
    cleanup = pointerPlace(obj, decals,
      (e, rect) => {
        obj.style.left = `${clamp(e.clientX - rect.left - imgWidth / 2, 0, decals.offsetWidth - imgWidth)}px`;
        obj.style.top = `${clamp(e.clientY - rect.top  - imgHeight / 2, 0, decals.offsetHeight - imgHeight)}px`;
      },
      X => {
        obj.classList.remove('temp');
        decal.x = obj.style.left;
        decal.y = obj.style.top;
        F.decals.push(decal);
        decal.k == 'coexist' && (F.coex = 1);
        deleteBagItem(i);
        getEl('olay').classList.remove('vis');
        save();
        cleanup();
      }
    );
  obj.style.left = `${(decals.offsetWidth - imgWidth) / 2}px`;
  obj.style.top = `${(decals.offsetHeight - imgHeight) / 2}px`;
},

// Adds items into the farm.
placeItem = (i, type, item = assign(cloneData(_.bag[i]), {id: _.bag[i].id || 'i' + getTime(), t: type}), el = getEl(type == 'drink' ? 'food' : type)) => {
  switcher = 0;
  getEl('olay').classList.add('vis');
  setTimeout(X => getEl('lid').classList.add('off'), num500);
  appendHTML(el, html(type == 'scenery' ? sceneImg(item) : foodCode(item), {id: item.id, class: items[item.k].t + ' temp up'}));
  let obj = getEl(item.id), itemWidth = obj.offsetWidth,
    cleanup = pointerPlace(obj, el,
      (e, rect) => {
        let xPos = clamp(e.clientX - rect.left - itemWidth / 2, 0, el.offsetWidth - itemWidth);
        obj.style.left = xPos + 'px';
        if (type == 'food') {
          obj.style.bottom = getHillHeight(xPos + itemWidth / 2) + 'px';
          obj.style.transform = `rotate(${antHillAngle({x: xPos + itemWidth / 2, scale: 1, f: F.id})}deg)`;
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
  setTimeout(X => obj.classList.remove('up'), num1000);
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
  }, num800);
},

// Puts lid functionality on the lid.
addLidFunc = (lid = getEl('lid')) => {
  lid.addEventListener('click', createArrows);
  lid.classList.add('use');
},

// Provides the common initialisation workflow for createArrows() and createNipArrows().
createArrowsInit = (pull, olay = getEl('olay')) => {
  olay.classList.add('vis');
  pull.replaceWith(pull.cloneNode(0));
  olay.addEventListener('click', removeArrows);
  window.addEventListener('resize', removeArrows);
  return getEl('pull');
},

// Shows arrows when lid lifted.
createArrows = (e, pull = createArrowsInit(getEl('pull')), card = getEl('card'), items = [...(F.card ? [card] : []), ...queryAll('#scenery > *, #food > *')], ) => {
  getEl('lid').classList.add('off');
  randomMsg(lidLift);
  setTimeout(X => {
    items.forEach((item) => {
      let Fitem = getById(F.items, item.id), itemRect = item.getBoundingClientRect(), arrow = document.createElement('div'), itemWidth = itemRect.width, topMap = {card: 100, scenery: 140, drink: 220, food: 220};
      arrow.classList.add('arrow');
      pull.appendChild(arrow);
      arrow.style.width = itemWidth + 'px';
      arrow.style.left = `${(itemRect.left + itemWidth / 2) - pull.getBoundingClientRect().left - itemWidth / 2}px`;
      arrow.style.top = `${topMap[item.id] ?? topMap[Fitem.t] ?? 180}px`;
      arrow.addEventListener('click', X => {
        arrow.classList.add('hide');
        if (item == card) {
          F.card && _.bag.push({k: F.card});
          F.card = 0;
          card.style.bottom = '80vh';
        }
        else if (item) {
          if (Fitem.t != 'food' && Fitem.t != 'drink') {
            _.bag.push(Fitem);
            _.bag = _.bag.filter(bi => bi);
          }
          F.items = F.items.filter(i => i.id != item.id);
          item.classList.add('up');
          setTimeout(X => item.remove(), num1000);
        }
        save();
        updateSwitcher(); // So card image is updated in the thumbnails.
      });
    });
    // Allow plucking dead ants from surface.
    F.a.filter(a => deadInFarm(a) && !a.area.t).forEach(a => {
      let arrow = document.createElement('div'), antEl = getEl(a.id), itemRect = antEl.getBoundingClientRect();
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
nipEl = getEl(nipId), nipRect = nipEl.getBoundingClientRect(), nantEl = getEl('a-' + nipId), otherFarm = getFarm(nipData.f)) => {
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
        // Chuck the ants into the other farm somewhere.
        nipItem.a.forEach(a => {
          a.x = 20 + randomInt(940);
          a.y = antGroundLevel(a);
          otherFarm.a.push(a);
          checkExpatQueen(a, otherFarm);
          _CHECK_DUPE_ID();///
        });
        nipItem.a = [];
        otherFarm.nips = otherFarm.nips.filter(n => n.id != nipData.id);
        // Note: tubeLoop() is responsible for stopping tubeInterval if no longer needed.
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

/// temp function to check for duplicate ids in farm ants - for debugging purposes only
_CHECK_DUPE_ID = X => {
  const seen = new Map();

  F.a.forEach((item, index) => {
    if (seen.has(item.id)) {
      console.warn(
        `Duplicate id found: "${item.id}" at indexes ${seen.get(item.id)} and ${index}`
      );
    } else {
      seen.set(item.id, index);
    }
  });
  return 1;
},

// Fetches a list of usable nips the farm has, optionally restricted to available nips.
getNips = (avail = 0, f = F, nips = nipIds.slice(-2)) => (f.tuns.forEach(t => t.nip && t.dun && nips.push(nipIds[t.nip])), nips.filter(n => !avail || !f.nips.some(nip => nipIds[nip.nip] == n))),

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
        playSound('sizz2', .8);
        mHillEl.classList.add('vis');
        F.a.filter(a => a.area.n == 'bg' || a.area.n == 'top').forEach(a => {
          if (!a) {
            console.warn("no ant!", JSON.stringify(F.a));
            /////whyyyy
            return;
          }
          a.area.n == 'bg' && randomInt(2) && antSlip(a);
          a.classList.add('burn');
          setTimeout(X => {
            playSound('sizz2', .3);
            a.area.n == 'bg' && randomInt(2) && antSlip(a);
            antDeath(a, 'other');
          }, num1000 + randomInt(num2000));
        });
        F.e.filter(e => e.y <= surface).forEach(e => {
          e.classList.add('burn');
          setTimeout(X => eggDelete(e), randomInt(num2000));
        });
        queryAll('#scenery > div, #food > div').forEach(el => {
          el.classList.add('burn');
          setTimeout(X => el.classList.add('fade'), num1000 + randomInt(num2000));
        });
        getEl('card').classList.add('burn');
        playSound('sizz2', .6);
        setTimeout(X => {
          playSound('sizz2', .3);
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
            playSound('sizz2', .3);
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
                fx.classList.add(['fog2']);
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
  farm.mTuns.forEach(t => t.prog = 100);
  farm.fill = farm.col = farm.plate = 'metal';
  let {id, n, mTuns} = farm;
  farm = assign(farm, farmDefault, {id, n, mTuns, sculpt: 1});
},

// Draws progress of a tunnel pour.
pourTun = tun => {
  tun.pour = 1;
  tun.prog += 2;
  if (tun.t == 'con') tun.prog = 100;
  tunProgDraw(tun);
  if (tun.t == 'ent') query(`#${tun.id} .prog`).style.top = tun.prog / 100 * 30 - 30 + 'px'; // Ent needs to be special cased.
  F.a.filter(a => a.area.t == tun.id).forEach(a => {
    a.classList.add('burn');
    playSound('sizz2', .3);
    setTimeout(X => antDeath(a, 'other'), num1000 + randomInt(num2000));
  });
  F.e.filter(e => e.tun == tun.id).forEach(e => {
    e.classList.add('burn');
    setTimeout(X => eggDelete(e), randomInt(num2000));
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
      let cta = 'Use item', disable = 0, customDesc, itemKey = bagItem.k, item = items[itemKey], itemType = item.t, dumpItem,
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
              bagItem.a.forEach(a => !ts.includes(a.t) && ts.push(a.t));
              ts.forEach(at => keys(castes).forEach(c => (cnt = bagItem.a.filter(a => a.caste == c && a.t == at).length) && cnts.push(printInt(cnt) + ` ${types[at].n} Ant ${castes[c] + (cnt === 1 ? '' : 's')}`)));
              customDesc = `Your reused ant vial containing:<br>${cnts.length > 1 ? cnts.slice(0, -1).join(', ') + ', and ' + last(cnts) : cnts[0]}.`;
              cta = `Release ${bagItem.a.length} ant${bagItem.a.length === 1 ? '' : 's'}`;
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
        clonekit() {!F.a.some(a => isWorker(a) && a.state == 'cap') && (cta = 'No eligible donor found', disable = 1)},
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
  },

  // Templates the win popup.
  win: el => {
    el.innerHTML =
      html(tag(3, "Congratulations! You've found:") + tag(2, 'Dave Matthews Band'), {id: 'drop-top'}) +
      `<iframe width=560 height=315 src=https://www.youtube.com/embed/MNgJBIx-hK8?si=zPAJ6x6f-opQqOjF frameborder=0 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"referrerpolicy=strict-origin-when-cross-origin allowfullscreen></iframe>` +
      html(
        tag(4, 'winning level celebratory merriment') +
        p('This is the highest honor available<br>') +
        tag('button', pickRandom(dropOK)),
        {id: 'drop-caption'}
      );
    query('#drop-top button').addEventListener('click', e => {
      closePopup();
      msg("I'd like to thank Penn Jillette for creating that podcast");
    });
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
      if (livesInFarm(a) && (a.t == F.t || F.coex)) {
        let thumb = getEl(a.id).cloneNode(1);
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
      itemKey = pickRandom(keys(items).filter(k => items[k].t == 'paint' && items[k].lvl < lot[1] && items[k].lvl>= temp1));
      candidates.push({k: [itemKey], n: lot[0] + `x ${items[itemKey].n} Paint`, x: lot[0], d: pickRandom(['Brand new', 'Unopened', 'Positive feedback'])});
      temp1 = lot[1];
    });
    // Hat.
    itemKey = pickRandom(keys(items).filter(k => items[k].t == 'hat'));
    candidates.push({k: [itemKey], n: `8x ${items[itemKey].n}`, x: 8, d: 'Condition: slightly used'});
    // Science.
    temp1 =  ['cologne', 'antyvenom', 'clonekit', 'speedo'], itemKey = pickRandom(temp1);
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
      opts[(c.x || 1) + '-' + c.k.join(',')] = html(repeat(c.x || 1, k => bagImg({k: k})), {class: `select-img ebay-img x-${c.x || c.k.length}`}) + tag(3, c.n) + (c.d || '');
    });
    el.innerHTML = selectForm(k, 'ebay', opts, 'eBay offers', pickRandom(['Accept offer', 'This is how eBay works', 'Sell the farm']));
  },

  // Templates the fengshui popup.
  feng: (el, k) => {
    el.innerHTML = tag(2, 'Drag the chi and let each farm find its place') +
      html(tag('ul', mapJoin(_.farms, f =>
        html(html(f.sculpt ? img('sculpt') : getFarmThumbnail(f), {id: `f-${f.id}`, class: 'select-img af'}) + tag(3, f.n) + getFarmDesc(f) + tag('i', '••<br>••<br>••', {class: 'g-dots'}), {class: 'feng-item', draggable: 'true', 'data-id': f.id}, 'li')
      )) + tag('button', 'Harmonize'), {id: 'feng-list'});
    let farmList = query('#feng-list ul'), draggedItem = 0,
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
  antfax: (el, k, pro = _.bag[k].k != 'antfax', fax = txt => 'fax' + txt, antType = types[_[pro ? fax('p') : fax()] || (pro ? 'H' : 'N')],
    content = {
      l: {// Left column.
        // Size.
        'sz': {
            s: ["Small package!", "You'll need a keen eye to spot these critters, and their babies are tiny little specks!"],
            m: ["Size: normal", "Rather unremarkably, these ants are best described as being the size of ants."],
            l: ["A huge one", "These ants barely fit in their own nest. You'd think they would dig their tunnels wider?"]
          }[antType.s],
        // Diet.
        'di': !antType.d ? ['Adaptive diet', 'A little from column A, a little from column B. It pays to not be too fussy!'] :
          antType.d < 2 ? ['Sweet tooth', 'These ants have quite a taste for sugary foods and baked goods such as pastries and cakes.'] :
          ['Meat lover', 'As carnivorous monsters they enjoy cheeseburgers and pepperoni pizza. May become cannibals when desperate!'],
        // Mood.
        'md': !antType.m || antType.m> 75 ? ['Well-mannered', 'These little guys are emotionally resilient with elastic hearts that will quickly learn to love again.'] :
          antType.m > 50 ? ['Average mood', "Keeping ants happy is always important for their health and fitness, but these guys aren't too bad."] :
          ['Tough customers', 'A moody type that will never be completely happy. Be careful because a dropping mood will slow them down and affect their health!'],
      },
      r: {// Right column.
        // Speed.
        'sp': antType.v > 1.1 ? ['¡Ándale! ¡Ándale!', 'A bunch of speedsters here! This helps them greatly when it comes time to build and defend nests.'] :
          antType.v > .7 ? ['At a medium pace', 'Neither fast nor slow, their speed is affected by their mood, health, a queen, or the need to complete an urgent task.'] :
          ['Slowpokes!', 'Ants like these are really good value for money because they give you more time to enjoy their fun little antics.'],
        // Bite.
        'bi': antType.b ? ['Ow! Chomp!', 'Delivers a toxic venomous bite that will leave victims with intense pain, swelling, hallucinations, and paralysis… for 5 minutes.'] :
          ['All bark', "Don't worry, it won't bite you, but it is said that sometimes its words can wound you deeply. That nibble you felt is just affection."],
        // Pro.
        'pr': pro ? ['VIP club', 'These ants will not come looking for you, and are just a little bit harder to farm. They must be ordered online from Sweden.'] :
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
      getCasteCount = caste => printCount(f.a.filter(a => livesInFarm(a) && a.caste == caste && (a.t == f.t || f.coex)).length, castes[caste]),
      getStatMarkup = (label, stat) => html(tag('b', label ? label + ' . . . ' : '') + stat, {class: 'stat'})) => {
      if (!f.mTuns) {// Don't show sculptures.
        scores += html(
          html(`#${i + 1}`, {class: 'F-id'}) +
          html(span(f.n, {style: 'border-bottom: 2px dashed ' + items[f.plate].col}), {class: 'F-n'}) +
          getStatMarkup('Colony', getFarmDesc(f)) +
          getStatMarkup('Running', formatTime(f.dur)) +
          getStatMarkup('Ant count', getCasteCount('W') + `, ${getCasteCount('D')},`) +
          getStatMarkup(0, getCasteCount('Q') + `, and ${printCount(f.a.filter(a => !f.coex && livesInFarm(a) && a.t != f.t).length, 'Foe')}.`) +
          getStatMarkup('Deaths', tag('em', 'Hunger') + ` ${printInt(f.stats.death.hunger)}, ${tag('em', 'Thirst')} ${printInt(f.stats.death.thirst)},`) +
          getStatMarkup(0, tag('em', 'Fights') + ` ${printInt(f.stats.death.fight)}, ${tag('em', 'Sickness')} ${printInt(f.stats.death.sick)},`) +
          getStatMarkup(0, `and ${tag('em', 'Other')} ${printInt(f.stats.death.other)}.`) +
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
        tag(3, `Share to social media <svg height=20 viewBox="0 0 24 24"width=20><path fill=#fff d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg>`) +
        img('social', {height: 32}) +
        p("It's easy, just take a photo of your screen and use your phone's in-built sharing options."),
        {id: 'share', class: 'stats'}
      ) +
      html(tag('button', '↩️ Restart game'), {id: 'reset'}) +
      // Note: Volume min is 4 to avoid complete silence which can make the browser tab sleep.
      html('🔊' + html('', {id: 'vol', type: 'range', min: 4, max: 100, value: _.vol}, 'input', 1), {id: 'volume'}) +
      html(
        // Note: Do NOT modify the following all-caps wording without changing the Gulpfile too.
        span('v1.0.0') + tag('a', 'Github ↗️', {target: '_blank', href: 'https://github.com/antfarmsocial/AntFarmSocial'}), {id: 'credit'}
      );
    getEl('vol').addEventListener('click', X => {_.vol = getEl('vol').value; getEl('audio').volume = _.vol / 100; if (fightSong) fightSong.volume = _.vol / 100});
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
              nippleSelection((nip2, nip2Id = nipIds[nip2], tubeEl2 = getEl('t-' + nip2Id), newNip = {nip: nip2, id: key, f: farmId, item: assign(_.bag[k], {a: [], e: []})}) => {
                F.nips.push(newNip);
                tubeEl2.dataset.id = farmId;
                tubeEl2.classList.add('vis');
                setTimeout(X => tubeEl2.classList.add('on') || getEl('a-' + nip2Id).classList.add('on'), num800);
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
      }, num1000);
      closePopup();
    }
  }
},

// Opens the modal dialog.
popup = (modalId, param = 0, delay = num500) => setTimeout(X => {
  !delay && getEl('modal') && closePopup(); // If caller sets delay to 0, it implies they want to close/override any existing popup.  That's just how it is.
  if (bodyClasses.contains('pik') || getEl('olay').classList.contains('vis') || getEl('modal')?.classList.contains('vis') || pouring)
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
colonyType = (f, tc = {}, X = f.a.forEach(ant => {livesInFarm(ant) && (tc[ant.t] = (tc[ant.t] || 0) + 1)})) => !keys(tc).length ? '' : entries(tc).sort((a, b) => b[1] - a[1])[0][0],

// Checks an ant is not 'dead'.  Also can't be 'free' or 'nip' etc... must be 'cap' which suggests it is in a farm somewhere.
livesInFarm = ant => ant.state == 'cap',

// Checks an ant is 'dead'.  Also can't be 'free' or 'nip' etc... must be 'dead' which suggests it is in a farm somewhere.
deadInFarm = ant => ant.state == 'dead',

// Checks if a farm is running (has ants living in it).
farmIsRunning = farm => farm.a.some(livesInFarm),

// Checks if a farm is developing (has at least 2 completed cavity chambers).
farmIsDeveloping = farm => farm.tuns.filter(t => t.t == 'cav' && t.dun).length > 1,

// Determines if an act is a carry-related task.
isCarryTask = act => ['carry', 'get', 'srv'].includes(act),

// Checks if an ant has carry tasks.
hasCarryTasks = ant => antUniqueActs(ant).some(isCarryTask),

// Checks if a queen ant is awaiting service (carry, get, srv).
isQueenAwaiting = queen => getFarm(queen).a.some(a => a.q.some(q => isCarryTask(q.act) && q.Q == queen.id)),

// Checks if an ant is a queen.
isQueen = ant => ant.caste == 'Q',

// Checks if an ant is a drone.
isDrone = ant => ant.caste == 'D',

// Checks if an ant is a worker.
isWorker = ant => ant.caste == 'W',

// Prints an integer with markup, but caps to 4 digits so as to not screw up UI.
printInt = number => (number = Number(number) || 0, span(number > 9999 ? 'many' : number, {class: 'num'})),

// Prints a numeric count of terms with basic pluralisation.
printCount = (cnt, term) => printInt(cnt || 0) + ' ' + term + (cnt === 1 ? '' : 's'),

// Gets the text description of a farm colony.
getFarmDesc = f => `${f.coex ? 'Multispecie' : f.t ? types[f.t].n + (types[f.t].n.length > 10 ? '' : ' ant') : 'No ant'}s in ${f.fill || 'the air'}`,

// Spawns a "free" ant that roams the screen.
spawnAnt = (autoLoop = 1, randomEdge = randomInt(3), x, y, r, wHeight = window.innerHeight, wWidth = window.innerWidth) => {
  if (spawner && F.a.length < 25) {
    if (F.fill && (hasFocus() || _.a.length < 3)) {// check focus & ant length to prevent flooding when user in another tab.
      randomEdge> 2 ? (x = randomInt(wWidth), y = wHeight + 25, r = deg270) : // Bottom edge
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

// Creates an ant, stores it in data, and attaches a DOM representation of it.
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
  alate: caste == 'Q',
  fd: 80 + randomInt(20), // Food Satisfaction
  dr: 80 + randomInt(20), // Drink Satisfaction
  hp: 80 + randomInt(20), // Health Points
  md: (types[type].m || 100) - randomInt(20), // Mood
  area: {n: 0, d: 0, t: 0},
  q: [], // Action Queue.
  thot: pickRandom(["I feel like I'm being watched", "Somebody is watching me!"]),
  thotD: 8,
  rm: [], // Body part removal.
}) => data.a.push(ant) &&  _CHECK_DUPE_ID() && (ant.state == 'free' ? freeAntDraw : antDraw)(ant) || ant, /// <---- temp code in here

// Clones a capped ant.
clone = (c, donor = F.a.find(a => isWorker(a) && a.state == 'cap'), fx = getEl('fx')) => {
  switcher = 0;
  playSound('zap');
  fx.classList.add('flashit');
  for (let i = 0; i < c;) setTimeout((id = newAntId(donor.t, donor.caste), xPos = 400 + i * 40) =>
    antDraw(F.a[F.a.push(assign(cloneData(donor), {
      id: id,
      n: id,
      x: xPos, y: antGroundLevel({f: donor.f, t: donor.t, x: xPos}),
      q: [{act: 'idle'}],
      r: antHillAngle({scale: 1, t: donor.t, x: xPos}),
      scale: 1,
      thot: pickRandom(["Who am I?", "What just happened?", "Is that me?", "I am reborn!"]),
      dur: 0,
      ts: getTimeSec(),
      h: 0,
    })) - 1]) || antAction(getAnt(F, id)), i++ * num500 + num500
  );
  setTimeout(X => {fx.classList.remove('flashit'); switcher = 1; save()}, c * num500 + num500);
  randomMsg(items['clonekit'].quip);
},

// Gets the ant's size, adjusted for infancy and caste.
// Goal IIRC: Return ant's size as configured, except Queen's are 2 sizes larger (if possible), Drones are one size larger,
// Infant at larvae stage are small unless the ant type's default is small then they're "baby" size, and infant larval drones are one size larger than the infants.
antGetSize = (ant, sz = types[ant.t].s, sizes = ['b', 's', 'm', 'l', 'x'], i = sizes.indexOf(sz)) =>
  ant['inf'] === 1 ? (sz == 's' ? 'b' : 's') : sizes[min(i + (isDrone(ant) ? 1 : isQueen(ant) ? (ant.t == 'T' ? 1 : 2) : 0), 4)],

// Draws a free ant.
freeAntDraw = ant => {
  antDraw(ant, getEl('game'));
  // Add picking.
  let antEl = objGetEl(ant);
  antEl.addEventListener('pointerdown', pickAnt);
  ['pointerenter', 'pointerdown'].forEach(ev => antEl.addEventListener(ev, spotAnt));
},

// Draws an existing ant into the currently displayed farm, or another container.
// Note: This function cannot protect against ant being drawn into wrong farm or non-existent container as this func is used for various purposes, calling code is responsible.
antDraw = (ant, cont = getEl('farm')) => antUpdate(ant, cont.appendChild(assign(getTemplate(antTemplate), {id: ant.id}))),

// Gets DOM element from the cache or from query (and store in cache if its part of the current farm).
objGetEl = (obj, cachedEl = elCache[obj.id]) => cachedEl?.isConnected && cachedEl || obj.f == F.id && (elCache[obj.id] = getEl(obj.id)) || getEl(obj.id),

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
            {id: ant.id + wing, style: `transform:rotate(${ant.r}deg);left:${left}px;top:${top}px;width:${antEl.clientWidth}px;height:${antEl.clientHeight}px;`, class: 'leaf alate ' + antGetSize(ant)}
          )
        );
        let leaf = getEl(ant.id + wing), dir = getSign(wing != 'wing-l'), wLeft = left, wRotation = ant.r, wTop = top, leafInterval = setInterval(X => {
          if (abs(left - wLeft) < 99) leaf.style.left = (wLeft += dir) + 'px';
          leaf.style.transform = `rotate(${wRotation += dir}deg)`;
          leaf.style.top = (wTop += .7) + 'px';
          wTop> window.innerHeight + 99 && (leaf.remove() || stopInterval(leafInterval));
        }, frameTick);
      });
    }
    del(ant, 'alate');
    // Update ant.
    assign(ant, {pose: 'pick', walk: 0, scale: getSign(randomInt(1)), r: randomInt(30) - 99});
    antUpdate(ant);
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
      dx = clientX - elX, dy = clientY - elY, dist = hypot(dx, dy), clampDist = min(dist, 30);
    (abs(parseInt(pickedAntEl.style.left) - clientX) > 25 || abs(parseInt(pickedAntEl.style.top) - clientY) > 25) && pickedAntEl.dispatchEvent(loseAnt);
    pickedAntEl.style.left = elX + (dx / dist) * clampDist + 'px';
    pickedAntEl.style.top = elY + (dy / dist) * clampDist + 'px';
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

// Moves an ant into the farm via a falling animation.
// Note: Any functions calling this should probably book-end their process with switcher=0/switcher=1.
dropAntInFarm = (ant, oldDataset, antFarmRect = getEl('farm').getBoundingClientRect()) => {
  ant.x -= antFarmRect.left;
  ant.y -= antFarmRect.top;
  transferObject(F, 'a', ant, oldDataset, F, {f: F.id, fall: 1});
  antFall(ant, antGroundLevel(ant));
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
antBite = (ant, force) => {
  if (force || (_.score > 9 && types[ant.t].b && !randomInt(20))) {
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
      bodyClasses.add('throb');
      stopInterval(throbber);
      throbber = setInterval(antyvenom, longDelay);
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
  if (Date.now() > _.ss) {
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
      getEl('game').classList.add('ss');
      setTimeout(X => getEl('game').classList.remove('ss'), shortDelay/2);
      getEl('ss').classList.remove('vis');
    }, num1000);
  }
},

// Increments score.
// Can be used to decrement score (inc=-1) or enable score display (inc=0), and to set bonuses (which don't trigger drops).
score = (inc, isBonus = 0, win = _.win ? span('🏆', {class: 'win'}) : '', scoreEl = getEl('score'), bonusEl = getEl('bonus')) => {
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
    inc > 1 && scoreDrop(0); // Force a drop when they scored more than 1 point at once.
    save();
  }
  if (!inc || !isBonus) scoreEl.innerHTML = span(win + _.score);
  scoreEl.dataset.neg = _.score < 0;
  scoreEl.classList.add('vis');
},

// Drops an item either according to the random value passed in (0=guaranteed) or when some conditions are met.
scoreDrop = (rand, dropItem, scoreCompare = _.score> 149 ? .3 : _.score > 9 ? .4 : .5, i,
  itemKeys = keys(items).filter(key => items[key].lvl < min(_.score, _.farms.length < 2 ? 50 : _.farms.length < 3 ? 100 : num2000) && !items[key].nodrop && (!items[key].max || _.bag.filter(item => item.k == key).length < items[key].max))
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
    i = _.farms.filter(farmIsRunning).length - 1;
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
      X => ant['inf'] && ["😘🎮", "✏❓🎨", "🌵📥🍗🍖", "💥👍💥", "🔥🔥👅", "👀👑🌍", "👃💩", "🎨🎾", "🔵🌊", "💪🎀", "👄👄", "💪⚡🐭", "🐛🔜"],
      X => ant.fight && ["Why I oughta!", "Put em up! Put em up!", "Tough guy eh?", "Is that all you've got?", "You're going down!", "Take that!", "Come on then!", "En garde!", "Have at you!",
        "You'll regret that!", "I'm gonna mess you up!", "For my family!", "You're going to pay!", "Don't mess with me!", "This is personal!", "Say your prayers!", "Feel my wrath!",
        "You asked for it!", "I'm unstoppable!", "For the colony!", "Ant power!"],
      X => !randomInt(9) && ["Need. More. Crumbs.", "Who moved my dirt?!", "Don't step on me!", "Lost. Again.", "Why is dirt so heavy?", "Ant gym = life", "Who farted in the nest?", "I should be queen", "I licked it, it's mine",
        "My back hurts", "Big foot incoming!", "Too many legs, not enough rest", "Keep calm, carry sugar", "I miss leaf duty", "Where's my antenna charger?", "Smells like danger", "Who named us “ants”?",
        "Why so crumb-y today?", "Dirt in my mandibles", "Smells like home", "Antflix and chill?", "The floor is crumb!", "Dig. Eat. Repeat.", "Antsplain it to me", "Worker of the month (me).", "Mondays… again",
        "What's my purpose?", "I saw a spider!", "Ant-nxiety rising", "Look at me!", "Don't look at me!"],
      X => uniqueActs[0] == 'rest' && ["Zzzzzz…", "I'm sleeping", "Having a nap"],
      X => ant.hp < 20 && [ant.hp < 2 ? "I'm dying" : ant.hp < 9 ? "I feel sick" : "I need a break"],
      X => ant.md < 20 && ["I ain't happy", "I'm having a mood", "I am so annoyed"],
      X => ant.t != farm.t && !farm.coex && ["Oops, wrong colony", "I'm so screwed", "I shouldn't be here"],
      X => !randomInt(3) && ant.md < 40 && !farmHasQueen(farm) && ["We could really use a Queen", "I wish there was a Queen", "There should be a Queen!"],
      X => !randomInt(3) && isWorker(ant) && farmHasQueen(farm) && ["Queen's watching… act busy", "Just following orders", "I hear the queen gossiping"],
      X => !randomInt(3) && isQueen(ant) && ["Who ate my larvae?!", "Carrying? I'm supervising", "It's good to be queen"],
      X => !randomInt(3) && farm.a.length > 12 && ["Tunnel traffic again", "Our colony is pretty big", "I have so many friends"],
      X => uniqueActs.includes('dig') && ['Off to work…', 'Busy, busy!', 'Got to dig', 'Is this tunnel crooked?', "I'm basically a builder"],
      X => uniqueActs[0] == 'crawl' &&
        (ant.md < 50 && !farmFlairScore(farm) ? ["Not much to see up here", "The scenery is bland", "Could use some scenery"] : // Negative bg scenery feedback.
        farmFlairScore(farm)> 1 && randomInt(3) ? ["Enjoying the scenery", "Nice stuff up here"] : // Positive bg scenery feedback.
          ["I don't mind the view", "What's up here?"]), // Generic crawl thoughts
      X => uniqueActs[0] == 'pace' &&
        (farmIsDeveloping(farm) && randomInt(3) ? ["Exploring the surface", "Checking out the area", "Doing a security sweep"] : // Young farm pace thoughts.
          ["Scoping out the farm", "Surveying the ground", "Hey! I'm walking here"]), // Generic pace thoughts
      X => ['dive', 'tunWalk', 'rotWalk'].includes(uniqueActs[0]) &&
        (farm.dun ? ["This nest is sweet", "I love my home", "Our colony is great", "Why so many tunnels?"] : // Farm development completed dive thoughts.
        farmIsDeveloping(farm) && randomInt(3) ? ["Exploring tunnels", "Mapping the nest", "Learning the tunnels"] : // Young farm dive thoughts.
          ["Planning chambers", "Assessing dig sites"]), // Incomplete farm dive thoughts
      X => ["Hmm, what to do?", "What shall I do?"], // Last resort for a thot.
    ].find(f => (thot = f())) && thot);
    ant.thotD = 0; // See director() func for where this is incremented and reaching a max value triggers a call to this func.
  }
},

// Gets a unique list of acts that are in an ant's queue.
antUniqueActs = ant => [...new Set(ant.q.map(a => a?.act))],

// Finds an ant to magnify.
antMagnify = (middleAnt, a, dist, minDistance = 28, lgRect = getEl('lg').getBoundingClientRect(), isAlive, bar,
  centerX = ((lgRect.x + lgRect.right) / 2) - wrapperRect.x - 50, centerY = ((lgRect.y + lgRect.bottom) / 2) - wrapperRect.y - 210 + surface) => {
  for (a of F.a) {
    dist = calculateDistance(a.x, a.y, centerX, centerY);
    if (dist < minDistance) {
      minDistance = dist;
      middleAnt = a;
    }
  }
  if (prevMagAnt && prevMagAnt.id != middleAnt?.id) {
    antUpdateClasses(prevMagAnt, {mag: 0, flare: 0});
    prevMagAnt = 0;
  }
  if (middleAnt) {
    isAlive = livesInFarm(middleAnt);
    middleAnt.mag ||= 1; // Set to 1 if not already set to some higher value.
    antUpdate(middleAnt);
    getEl('l-head').innerHTML = middleAnt.n;
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
    query('#l-md .emo').innerHTML = middleAnt.md> 50 ? '😃' : middleAnt.md > 20 ? '😐' : middleAnt.md > 10 ? '☹️' : '😡';
    query('#l-hp .emo').innerHTML = isAlive ? '♥️' : '💔';
    query('#l-a .emo').innerHTML = isAlive ? '💡' : '☠️';
    if (!isAlive) query('#l-re .txt').innerHTML = 'Died ' + deathCauses[middleAnt.cause];
    query('#l-hp .txt').innerHTML = middleAnt.eaten > 1 ? `~${printInt(middleAnt.eaten - 1)}% eaten` : '';
    getEl('l-a').setAttribute('title', isAlive ? 'THOT' : 'DEATH');
    getEl('l-inf').dataset.state = middleAnt.state;
    getEl('l-inf').classList.add('vis');
    magInterval ||= setInterval(X => {
      if (!middleAnt?.mag) magInterval = stopInterval(magInterval);
      else if (isAlive && ++middleAnt.mag > 20) {
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
dragGlass = e => {glassDragX = e.clientX; glassDragY = e.clientY},

// Adds dragging functionality to the magnifying glass.
glassAddDrag = e => document.addEventListener('pointermove', dragGlass),

// Removes dragging from the magnifying glass.
glassRemDrag = e => document.removeEventListener('pointermove', dragGlass),

// Toggles the display of the magnifying glass.
toggleGlass = (e, lWrap = getEl('l-wrap')) => {
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
  else {
    wrapperRect = getEl('wrapper').getBoundingClientRect();
    bodyClasses.add('glass');
    lWrap.addEventListener('pointerdown', glassAddDrag);
    document.addEventListener('pointerup', glassRemDrag);
    magnifier = setInterval(antMagnify, 200);
    glassDragInterval = setInterval(X => {
      getEl('l-wrap').style.transform =
        `translate3d(${clamp(glassDragX - 55 - wrapperRect.x, -8, wrapperRect.width - 85)}px, ${clamp(glassDragY - 90 - wrapperRect.y, -33, wrapperRect.height - 68)}px,0)`;
    }, 30);
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
  _.bag.push(dropItem) && popup('drop', dropItem);
},

// Walks a free ant around the screen, and mainly checks if the ant has walked past the edge.
// In addition to initiating a screenwalk, this is used as the continue callback in antMoveDefault() which sets frameDelay to the frame tick or pause value.
screenWalk = (ant, frameDelay = 0) =>
  ant.x < -40 || ant.x> window.innerWidth + 40 || ant.y < -40 || ant.y> window.innerHeight + 40 ? antDelete(ant) :
    antUpdate(ant) || setTimeout(X => spawner && ant.pose != 'pick' && antMoveDefault(ant, screenWalk), frameDelay),

// Determines if two ants are peaceful towards each other.
antsPassive = (ant, ant2) => ant2.t == ant.t || getFarm(ant)?.coex,

// Determines if ants should not avoid each other (used when walking in prone pose).
antsCoTarget = (ant, ant2, recip = 0) =>
  ant.carry && ant.carry.Q == ant2.id || // Check if this is an ant serving a queen situation.
  !recip && antsCoTarget(ant2, ant, 1), // Check with roles-reversed

// Tracks ant avoidance.
antTrackAvoidance = ant => {
  ant.avoid ||= 0;
  ant.avoid++;
  setTimeout(X => del(ant, 'avoid'), num2000);
  antUpdate(antGetStill(ant)); // Note: antGetStill() slipped into this code to prevent treadmill while in avoidance.
},

// Checks ant avoidance tracker.
antCheckAvoidance = ant => !ant.avoid || ant.avoid < 29,

// Handles random direction prone walking, with collision handling for both modes this is used in.
antMoveDefault = (ant, callback, allowPause = 0, speedMult = 1, rotMult = 1, rand = random(), collision = antCollision(ant), ant2 = collision?.ant, dist, near) => {
  antSetWalk(ant);
  if (collision) {
    if (ant.state == 'free' || antsPassive(ant, ant2)) {// Too much trouble to handle collisions near the boundary.
      if (!(near = ant.area.n == 'bg' && antBgNear(ant, 1)) && antCheckAvoidance(antGetStill(ant))) {
        dist = calcDistComponents(ant2.x, ant2.y, ant.x, ant.y);
        ant.r = normalize360(ant.r + collision.dir * randomInt(20));
        ant.x += dist.x;
        ant.y += dist.y;
        // Track ant avoidance duration so we can stop doing it if it gets too insane.
        antTrackAvoidance(ant);
      }
    }
    else antFight(ant, ant2); // Fight!
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
antBgNear = (ant, ignoreAngle = 0, margin = antOffsetX(ant) * 2) =>
  [[deg270, ant.y < 322], [0, ant.x> 960 - margin], [90, ant.y > antGroundLevel(ant, 0) - margin], [deg180, ant.x < margin]].find(b => b[1] && (ignoreAngle || (abs(normalize180(ant.r - b[0])) < 90))),

// Moves ant to the middle of #F.
antFall = (ant, target, antEl = objGetEl(ant), move = 1.2) => {
  ant.y < target && (ant.y += 1);
  ant.x += ant.x < 450 ? move : ant.x> 490 ? -move : 0;
  if (round(ant.r) < 0) ant.r += 1.2;
  antUpdate(ant, antEl);
  ant.y < target && setTimeout(X => antFall(ant, target, antEl, max(0, move - .02)), frameTick / 2) || antCap(ant, antEl);
},

// Captures an ant into the farm.
antCap = (ant, antEl) => {
  antEl.removeEventListener('pointerdown', pickAnt);
  if (ant.state != 'cap') getFarm(ant).stats['cap']++;
  ant.state = 'cap';
  ant.dur = 0;
  ant.ts = getTimeSec();
  setColonyAndFoe(getFarm(ant));
  score(isQueen(ant) ? 3 : 1);
  antThot(ant, ["Don't touch me!", "Am I kidnapped?", "WTF is going on?", "I'm confused!"]);
  antSurface(ant);
},

// Sets up a fight between two ants.
antFight = (ant, ant2) => !ant.carry && !ant2.carry && antInstaQ(ant, {act: 'fight', ant: ant2.id}) && !ant2.fight && antInstaQ(ant2, {act: 'fight', ant: ant.id}),

// Resets an ant to sit properly on the surface level and executes the next item in the queue.
// Note: For newly captured ants this is how the ant's queue is "activated".
// Note: This calls antNext() and should be considered an alternative to calling antNext() in some situations.
antSurface = ant => {
  antArea(ant, 'top');
  antNext(assign(ant, {r: antHillAngle(ant), y: antGroundLevel(ant), scale: ant.scale * getSign(ant.r < 90), pose: 'side', fall: 0, walk: 0, run: 0}));
},

// Gets a free ant object given the ant element or some object with an id.
getFreeAnt = antEl => getAnt(_, antEl?.id),

// Gets an ant object by ID.
getAnt = (farm, id) => getById(farm.a, id),

// Removes an object (must have .id) from a data set in the array at the subscript property, and remove the corresponding DOM element including its cache. Done in a timer, so it doesn't mess up any loops that call this.
deleteDataAndEl = (obj, key = 'a', dataSet = getFarm(obj) || _, id = obj.id, el = getEl(id)) => setTimeout(X => {dataSet[key] = dataSet[key]?.filter(d => d.id != id); el && (el.remove() || del(elCache, id))}, 0),

// Deletes an ant element.
// Important! This is NOT just a handy alias, by having only one param it allows deleting ants via ".forEach(antDelete)" without overwriting the default params in deleteDataAndEl().
antDelete = ant => deleteDataAndEl(ant),

// Updates the antEl to reflect the state of the object, if possible.
antUpdate = (ant, antEl = objGetEl(ant)) => {

  if (isNaN(ant.x) || isNaN(ant.y) || isNaN(ant.r)) console.warn("ant is nanned", ant);

  requestAnimationFrame(() => {
    if (antEl?.isConnected) {
      antEl.className = [
        'ant', ant.caste, ant.t, ant.state, ant.pose, antGetSize(ant), ant['inf'] && 'inf' + ant['inf'], // String values.
        ...['walk', 'jit', 'dig', 'wig', 'h', 'fall', 'fight', 'mag', 'alate', 'flare', 'rot', 'rot1', 'rot2', 'decay', 'decay1'].filter(f => ant[f]), // Boolean values.
        ...ant.rm // Body part removal.
      ].join(' ');
      antEl.style.left = ant.x + 'px';
      antEl.style.top = ant.y + 'px';
      antEl.style.transform = `scaleX(${ant.scale}) rotate(${ant.r + 90}deg)`; // +90 because the ant was built facing north instead of east in CSS.
    }
  });
},

// Gets an egg.
getEgg = (farm, id) => getById(farm.e, id),

// Removes an egg from data and visually remove, either because it hatched or died.
eggDelete = egg => deleteDataAndEl(egg, 'e'),

// Updates the display of an egg element.
eggUpdate = (egg, eggEl = objGetEl(egg)) => {
  if (eggEl && eggEl.isConnected) {
    egg.tun && assign(egg, cavFloor(getTun(egg.tun), egg.pc)); // Egg is in a tunnel, update the x/y coords from the tunnel.
    eggEl.className = 'egg lvl' + egg.lvl;
    eggEl.style.left = egg.x + 'px';
    eggEl.style.top = egg.y + 'px';
    eggEl.style.transform = `scaleX(${egg.scale}) rotate(${egg.r}deg)`
  }
},

// Draws an egg.
eggDraw = (egg, cont = getEl('farm')) => {
  if (egg.f == F.id) {
    appendHTML(cont, html('', {id: egg.id}));
    eggUpdate(egg);
  }
},

// Gets a carried item.
getCarry = (farm, carry) => carry.t == 'egg' ? getEgg(farm, carry.id) : ['inf', 'dead'].includes(carry.t) ? getAnt(farm, carry.id) : carry,

// Gets the key of the data array where a carried item would be stored in a dataset.
carryKey = carry => carry.t == 'egg' ? 'e' : ['inf', 'dead'].includes(carry.t) ? 'a' : 'c',

// Determines if a carry object is either an egg or ant (and therefore they should exist before/after they are being carried).
carryIsEggOrAnt = carry => carryKey(carry) != 'c',

// Draws a carried item, or moves it from the farm container to the ant element.
carryDraw = (carry, ant, cEl = query(`#${ant.id} .c`), carryEl) => {
  if (carry?.f == F.id) {
    if (carryIsEggOrAnt(carry)) {
      // This assumes the object was already drawn prior to this function running.
      carryEl = getEl(carry.id);
      carryEl.remove();
      del(elCache, carry.id);
      cEl.appendChild(carryEl);
    }
    else appendHTML(cEl, divc(`carry C${carry.t} ` + carry.k, {id: carry.id}));
  }
},

// Undraws a carried item, or moves it from the ant element into the farm container.
carryUndraw = (carry, carryEl = getEl(carry?.id)) => {
  if (carryEl && carryEl.isConnected) {
    carryEl.remove();
    carryIsEggOrAnt(carry) && getFarm(carry).appendChild(carryEl);
  }
},
// @TODO how does drop a carry in a nip work?  hint: it doesn't yet.

// Transfers an object from one data set to another and removes/draws the DOM elements as well.
transferObject = (farm, key, obj, oldSet, newSet, newVals, newCont) => {// Note: newCont defaults to #farm container if undefined.
  newSet[key].push(assign(obj.id ? obj : getById(oldSet[key], obj), newVals));
  deleteDataAndEl(obj, key, oldSet);
  currentFarm(farm) && (key == 'a' ? antDraw : eggDraw)(obj, newCont);
},

// Gets the X offset of "where" an ant is at based on its size.
antOffsetX = (ant, map = {b: 4, s: 6, m: 9, l: 11, x: 11}) => map[antGetSize(ant)],

// Gets the Y offset of "where" an ant is at based on its size.
// Note: because of tunnel widths it would be a bad idea to ever return >=7 from here.
antOffsetY = (ant, map = {b: 1, s: 2, m: 4, l: 5, x: 6}) => map[antGetSize(ant)],

// Computes the X value we'll use for some decision making.
// Note: This is not as thorough as antHeadPoint() which may be more suitable if a proper rotational coordinate is required.
antFaceX = ant => ant.x + antOffsetX(ant) * ant.scale,

// Computes the ant's Y value for a lot of underground related calculations.
antDiveY = ant => ant.y - surface,

// Gets a more accurate x/y coordinate of where the ant's head is with respect to its rotation.
// Note: When ant is known to be facing roughly east or west in side-position it may be sufficient to just use antFaceX() instead.
antHeadPoint = (ant, offset = antOffsetX(ant), rad = degToRad(ant.r * ant.scale)) => ({x: ant.x + cos(rad) * offset, y: ant.y + sin(rad) * offset}),

// Gets a more accurate x/y coordinate of where the ant's feet are with respect to its rotation.
// This is just antHeadPoint() with different default params.
// Note: Intended for finding closest waypoint of a rotated ant, where ant.y + antOffsetY(ant) is insufficient.
antFootPoint = (ant, offset = antOffsetY(ant), rad = degToRad(ant.r * ant.scale + 90)) => antHeadPoint(ant, offset, rad),

// Computes the vertical offset (y) of the upper half of a horizontally stretched ellipse for a given position (x).
// Note: the divisor for h caps the height, and the steepness of the hill for fine-tuning can be changed by turning the last part into sqrt(1 - pow(pow(xNorm, 2), 1)) and tweaking the 1.
getHillNudge = (l, r, h, x, c = (l + r) / 2, w = (r - l) / 2, xNorm = (x - c) / w) => x < l || x> r ? 0 : h / 2 * sqrt(1 - pow(xNorm, 2)),

// Gets the height of a hill at an x-position.
getHillHeight = (x, farm = F, hill = farm.hills.find(h => h.l < x && h.r> x), h = min(50, hill?.h)) => hill ? getHillNudge(hill.l, hill.r, h, x) - h * .13 : 0, // The "- h *.13" because our hills are positioned at 63% not 50%.

// Figures out the ant's "ground" level.
antGroundLevel = (ant, applyAntOffset = 1) => surface - (applyAntOffset && antOffsetY(ant)) - getHillHeight(ant.x, getFarm(ant)),

// Figures out the angle an ant would be due to the sides of hills being steep.
// Note: The actual angle has been divided as the ant would lean unnaturally by trying to follow the curve too accurately.
antHillAngle = (ant, offset = ant.scale * antOffsetX(ant)) => radToDeg(Math.atan((getHillHeight(ant.x + offset) - getHillHeight(ant.x - offset)) / (2 * offset))) * -ant.scale / 2,

// Adds to finna queue.
antFinna = (ant, act, args = {}) => ant?.q.push(assign(args, {act: act})),

// Adds a via action to finna queue which will have to transition to the appropriate area to do them first.
// Use the 'n' argument to specify the area name, will assume 'top' by default, can also pass in a 1 to execute anywhere (intended for the 'rest' action).
// See goToLocation() for a more robust method of moving ants to a specific location.
antFinnaVia = (ant, act, args = {}) => antFinna(ant, 'via', assign(args, {via: act})),

// Adds to finna queue only if the 'act' does not already exist there.  Uses antFinnaVia() for safety so do be careful that is the desired behaviour.
antFinnaUnique = (ant, act, args) => !ant?.q.some(q => q.act == act) && antFinnaVia(ant, act, args),

// Prepends a custom queue or queue item to finna queue.
antInstaQ = (ant, queueItems, keepFirst = 1) => ant.q = [...keepFirst ? [ant.q.shift()] : [], ...(Array.isArray(queueItems) ? queueItems : [queueItems]), ...ant.q],

// Delegates an ant action.  Importantly; calls an antUpdate() so that anything that calls antAction doesn't have to first do an antUpdate().
// Done in a timer to prevent exceeding callstack and handle framerate speed by default.
antAction = (ant, timeout = frameTick, action = ant.q[0]?.act || 'idle') => antUpdate(ant) || /* START-DEV */!stopAnts &&/* END-DEV */ (livesInFarm(ant) || action == 'die') && setTimeout(X => act[action](ant), timeout),

// Does next action in finna queue.
// Most notably this calls antAction() and is often the logical alternative to calling antAction() directly.
antNext = (ant, timeout) => {ant.q.shift(); antAction(ant, timeout); antThot(ant)},

// Combines antGetStill() and antAction(). Use instead of antAction() to unset walk prop before executing the next loop of the action.
antActionStill = (ant, timeout) => antAction(antGetStill(ant), timeout),

// Combines antGetStill() and antNext(). Use instead of antNext() to unset walk prop before executing the next action.
antNextStill = (ant, timeout) => antNext(antGetStill(ant), timeout),

// Adds a tracker to quickly determine where ant is. Includes a duration used in some areas, or a tunnel ID for the bottom.
antArea = (ant, area, tun) => {
  ant.area.n == area && ant.area.t == tun ? ant.area.d++ : ant.area = {n: area, d: 0, t: tun};
  ['dead', 'inf'].includes(ant.carry?.t) && antArea(getAnt(getFarm(ant), ant.carry.id), area, tun); // Update dead ants and infants it is carrying.
},

// Calculates the size of an ant step with impediments and lethargy.
antGetStep = ant => ant.scale * (
  types[ant.t].v
  - (ant.hp < 10 ? .12 : ant.hp < 20 ? .06 : ant.hp < 40 ? .03 : 0)
  - (ant.md < 10 ? .24 : ant.md < 20 ? .12 : ant.md < 40 ? .06 : 0)
  - (ant.q.length < 2 ? .2 : 0)
  - (isQueen(ant) ? .4 : 0)
) * (ant.run || 1), // ant.run is independent of and cumulative to other speed multipliers and can be 0/1/undefined for normal speed, <1 for slow, or>1 for fast.

// Calculates the step size in a tunnel.
// An absolute value is returned because we don't care about negative scale.
antGetTunnelStep = ant => abs(antGetStep(ant)) / 2,

// Makes an ant take one step along the surface.
antMoveSurface = ant => {
  ant.x += antGetStep(ant);
  ant.y = antGroundLevel(ant);
  ant.r = antHillAngle(ant);
},

// Gets the next spot to step to in the tunnel.
antMoveTunnel = (ant, step = antGetTunnelStep(ant), ang = degToRad((ant.scale < 0 ? mirrorAngle(ant.r) : ant.r))) => {
  ant.x += cos(ang) * step;
  ant.y += sin(ang) * step;
},

// Get the entrance point of a tunnel.
getEntrancePoint = (tun, margin = 0, pos = 0, distance = 6, distComp = calcDistComponents(tun.x1, tun.y1, tun.x2, tun.y2),
  actualDistance = min(distance, distComp.d * (tun.prog / 100)), offset = (tun.h / 2 - margin) * -pos) =>
  ({x: tun.x1 + distComp.x * actualDistance - distComp.y * offset, y: tun.y1 + distComp.y * actualDistance + distComp.x * offset}),

// Find where con overlaps with nextTun along nextTun's middle line.
getConnectionPoint = (con, nextTun, dist = calcDistComponents(nextTun.x1, nextTun.y1, nextTun.x2, nextTun.y2), offset = 1 + con.w / 2,
  [x0, y0, s] = con.x1 == nextTun.x1 && con.y1 == nextTun.y1 ? [nextTun.x1, nextTun.y1, offset] : [nextTun.x2, nextTun.y2, -offset]) =>
  ({x: x0 + dist.x * s, y: y0 + dist.y * s}),

// Gets the index of the closest waypoint to an ant or a previous waypoint.  If ant is detected, will adjust to antFootPoint() [when there is a .q] and antDiveY() [when there is a .t].
// Note: We could improve performance by passing a nearby known waypoint index from which to begin search (in both directions), once results start getting worse we know to stop.
getWaypointIndex = (farm, obj, coord = obj.q ? antFootPoint(obj) : obj, wps = wayPoints[farm.id], threshold = 10, exact = wps?.indexOf(coord)) =>
  exact < 0 ? wps.reduce((best, wp, i, a, d = calculateDistance(coord.x, obj.t ? antDiveY(coord) : coord.y, wp.x, wp.y)) => (d < best.d && d < threshold) ? {d, i} : best, {d: Infinity, i: -1}).i : exact,

// Gets the next waypoint relative to the current one.  Returns 0 if there is a problem such as the found wp being too far away.
getNextWaypoint = (farm, curr, dir = 1, wps = wayPoints[farm.id], nextIndex = curr.i + dir) =>
  dir && nextIndex >= 0 && nextIndex < wps.length && calculateDistance(curr.x, curr.y, wps[nextIndex].x, wps[nextIndex].y) < 8 ? wps[nextIndex] : 0,

// Gets the indices of the rear and front waypoints for an ant.  Returns null if either is not found.
// Note: This has to search the entire waypoint set (twice!) which is not ideal!!!  We could optimise performance by tracking ant's previous wp results to limit search segment?
getAntWpIndices = (ant, farm = getFarm(ant), antShim = {r: ant.r, scale: ant.scale, t: ant.t},
  r = getWaypointIndex(farm, assign(antFootPoint(assign(antHeadPoint(ant, -antOffsetX(ant)), antShim)), antShim)),
  f = getWaypointIndex(farm, assign(antFootPoint(assign(antHeadPoint(ant), antShim)), antShim))
) => r < 0 || f < 0 ? null : {r, f},

// Gets the waypoint direction vector for the ant.
getAntWaypointDirection = (ant, ind = getAntWpIndices(ant)) => ind && getSign(ind.r < ind.f),

// Gets the waypoint set for an ant.
getAntWaypoints = (ant, ind = getAntWpIndices(ant), wps = wayPoints[getFarm(ant).id]) => ind ? ind.r < ind.f ? wps.slice(ind.r, ind.f + 1) : wps.slice(ind.f, ind.r + 1).reverse() : [],

// Gets average angle of a set of waypoints.  Returns null if not enough waypoints found.
getWaypointAngle = (ant, points = getAntWaypoints(ant), sumX = 0, sumY = 0, i = 0) => {
  for (; i < points.length - 1;) {
    let p1 = points[i], p2 = points[++i], a = atan2(p2.y - p1.y, p2.x - p1.x);
    sumX += cos(a);
    sumY += sin(a);
  }
  return points.length> 1 ? normalize360(angleFromDelta(sumX, sumY)) : null;
},

// Determines if ant will collide with a waypoint in front of it.
antWaypointCollision = (farm, ant, wp, angle) => {
  for (wp of wayPoints[farm.id]) {
    if (calculateDistance(ant.x, antDiveY(ant), wp.x, wp.y) < 30) {
      angle = angleFromDelta(wp.x - ant.x, wp.y - antDiveY(ant), ant.r);
      return angle < 10 || angle> 350; // Waypoint is within the forward "cone" tolerance.
    }
  }
},

// Calculates if an ant and target (such as another ant) are in proximity.
// Note: Also checks the target is not the ant itself so that .find() and .filter() operations of ant sets do not need to specify this.
antInTargetProximity = (ant, target, prox) => ant.id != target.id && calculateDistance(ant.x, ant.y, target.x, target.y) < prox,

// Determines if ant will collide with any others.  Optionally pass in an ant array to only check that group of ants.
antCollision = (ant, cone = 30, a, angle) => {
  for (a of ant.f ? getFarm(ant)?.a : _.a) {
    if (!deadInFarm(a) && (!ant.area && !a.area || ant.area.n == a.area.n) && !antsCoTarget(ant, a) && antInTargetProximity(a, ant, 30)) {
      angle = antToTargetAngle(ant, a);
      if (angle < cone || angle> mirrorAngle(cone)) return {ant: a, dir: sign(angle)};
    }
  }
},

// Determines if an ant is near a rotten corpse and applies hp penalties.
antCorpseProximity = (ant, farm = getFarm(ant), nearestCorpse = farm.a.find(a => a.rot && antInTargetProximity(a, ant, 20))) => {
  if (nearestCorpse && ant.area.t == nearestCorpse.area.t) {
    antStats(ant, {hp: (nearestCorpse.decay - nearestCorpse.rot) / num1000}); // Penalty increases as rot increases, but decreases as decay increases.
    playerHint(farm, ["Ants are getting sick from rotting corpses."]);
    if (ant.hp <= 0) {
      ant.wig = 1;
      setTimeout(X => {ant.q = [{act: 'die', r: 'sick'}]; ant.wig = 0; antNext(ant)}, num2000);
    }
  }
},

// Determines the angle of an ant to a target such as another ant.
antToTargetAngle = (ant, target) => normalize180(getAngle(ant, target)),

// Inverts an ant's angle if it has a negative scale.
antProneCorrection = ant => {
  if (ant.scale < 0) {
    ant.scale = 1;
    ant.r = mirrorAngle(ant.r);
  }
},

// Determines the side of a tunnel a point is at.  Not reliable if point is in the middle of the tunnel.
tunGetSide = (tun, point) => getSign((tun.x2 - tun.x1) * (point.y - tun.y1) - (tun.y2 - tun.y1) * (point.x - tun.x1) < 0),

// Corrects an ant's orientation based on which side of a tunnel it is on.
// Important: wp is frequently passed in and not calculated here - an easy thing to forget when debugging!
antSideCorrection = (ant, tun, wp = wayPoints[ant.f][getWaypointIndex(getFarm(ant), ant)], action = ant.q[0]) => {
  if (ant.scale != tunGetSide(tun, wp || {x: ant.x, y: antDiveY(ant)}) * getSign(action.rev)) {
    ant.scale *= -1;
    ant.r = mirrorAngle(ant.r);
    if (antDir(ant, tun) == action.rev) ant.r = oppositeAngle(ant.r);
  }
},

// Returns true if ant is facing forward along the tunnel, false if backward.
antDir = (ant, tun, antAngle = degToRad(ant.r)) => (cos(antAngle) * ant.scale * (tun.x2 - tun.x1) + sin(antAngle) * (tun.y2 - tun.y1)) > 0,

// Nudges an ant toward the middle line of a tunnel.
antNudgeToMid = (ant, tun, nudge, dist = calcDistComponents(tun.x1, tun.y1, tun.x2, tun.y2), t = clamp((ant.x - tun.x1) * dist.x + (antDiveY(ant) - tun.y1) * dist.y, 0, dist.d),
  dx = tun.x1 + dist.x * t - ant.x, dy = tun.y1 + dist.y * t - antDiveY(ant), d = hypot(dx, dy), move = min(nudge, d)
  ) => {
  if (d > 2) {
    ant.x += (dx / d) * move;
    ant.y += (dy / d) * move;
  }
},

// Nudges an ant toward the supplied waypoint.
antNudgeToWP = (ant, wp, nudge = antGetTunnelStep(ant) / 4, dx = wp.x - ant.x, dy = wp.y - antDiveY(ant),
  dist = hypot(dx, dy), diff = dist - antOffsetY(ant), step = sign(diff) * min(abs(diff), nudge * (diff < 0 ? 2 : 1))) => {
  if (dist) {
    ant.x += (dx / dist) * step;
    ant.y += (dy / dist) * step;
  }
},

// Nudges an ant to middle of tunnel, changes to prone pose, and performs correction.
antToProneWithCorrection = (ant, tun) => {antNudgeToMid(ant, tun, antOffsetY(ant) / 2); ant.pose = 'prone'; antProneCorrection(ant)},

// Nudges an ant to waypoint along tunnel, changes to side pose, and performs correction.
antToSideWithCorrection = (ant, tun, wp) => {antNudgeToWP(ant, wp, antOffsetY(ant) / 2); ant.pose = 'side'; antSideCorrection(ant, tun, wp)},

// Determines if an ant is within range of a waypoint to make landings, etc...
antWaypointRange = (ant, wp, mult = 1) => wp && calculateDistance(wp.x, wp.y, ant.x, antDiveY(ant)) < antOffsetX(ant) * mult, // Note: antOffsetX() just happens to be a nice amount.

// Determines whether a tunnel is of a centered rotation type.
isRotationTunnel = tun => tun.t == 'con' || tun.t == 'ent',

// Determines which tun we should consider the ant to be in and roughly at what percent along.  Optionally pass a tun in to limit searches to that one and directly connected tuns.
getTunPosition = (ant, ignoreTun = 0, limitTun = 0, desire = 0, margin = 2,
  // Helper to check if a point is inside a convex quadrilateral.
  pointInQuad = (p, quad, i = 0, a, b) => {
    for (; i < 4;) {
      a = quad[i], b = quad[(++i) % 4];
      if ((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x) < 0) return 0;
    }
    return 1;
  }, type, tun) => {
  for (type of [...(desire ? [desire] : []), ...['ent', 'con', 'cav', 'tun'].filter(t => t != desire)]) {// 'Desire' moves the expected next tunnel type to the front of the types array.
    for (tun of getFarm(ant).tuns.filter(t => (!limitTun || limitTun.id == t.id || limitTun.co.includes(t.id)) && t.t == type && t.id != ignoreTun && t.prog >= tunPercent(t, 8))) {
      let hw = tun.w / 2 + margin, hh = tun.h / 2 + margin, rad = degToRad(tun.r), cosA = cos(rad), sinA = sin(rad);
      // Check if ant is inside the rotated rectangle.
      if (pointInQuad({x: ant.x, y: antDiveY(ant)}, [{x: -hw, y: -hh}, {x: hw,  y: -hh}, {x: hw,  y: hh}, {x: -hw, y: hh}].map(c => ({x: (tun.x1 + tun.x2) / 2 + c.x * cosA - c.y * sinA, y: (tun.y1 + tun.y2) / 2 + c.x * sinA + c.y * cosA})))) {
        let dxLine = tun.x2 - tun.x1, dyLine = tun.y2 - tun.y1;
        return {tun, pc: clamp(((ant.x - tun.x1) * dxLine + (antDiveY(ant) - tun.y1) * dyLine) / (dxLine * dxLine + dyLine * dyLine), 0, 1) * 100};
      }
    }
  }
  // If at this point in the function and didn't find a tun and ignoreTun or limitTun was passed in, try again without any restrictions.
  return ignoreTun || limitTun ? getTunPosition(ant) : 0;
},

// Determines which tunnel a waypoint is in, and stores the value with the waypoint for future reference, as well as returning it.
getWpTunnel = (farm, wp, tunHint, tunPos) => {
  if (!wp.t && (tunPos = getTunPosition({x: wp.x, y: wp.y + surface, f: farm.id}, 0, tunHint))) {
    wp.t = tunPos?.tun.id;
  }
  return wp.t;
},

// Safely flips an ant's direction when in a tunnel.
antChangeTunDir = (ant, tun) => {
  !randomInt(9) && (ant.pose = 'prone'); // Switching to prone first here is more reliable, and sometimes a side ant gets stuck flipping in a loop, this could resolve the issue?
  if (ant.pose == 'side') {
    ant.scale *= -1;
    antSideCorrection(ant, tun);
  }
  else {
    ant.r = oppositeAngle(ant.r);
    antProneCorrection(ant);
  }
},

// Reformats action data into a valid dive stub that can be used with queue functions.
makeDiveStub = obj => ({act: 'dive', n: 'bot', tun: obj.id || obj.tun, pc: obj.pc, pos: obj.pos}),

// Converts a pixel length into the percentage of the tunnel that is represents.
tunPercent = (tun, px) => px / tun.w * 100,

// Converts a percentage length into pixels of the tunnel that is represents.
tunPixels = (tun, percent) => percent / 100 * tun.w,

// Gets the coordinates of the cavity floor.
cavFloor = (tun, pc, yOffset = 0, r = degToRad(tun.r)) =>
  ({x: (tun.x1 + (tun.x2 - tun.x1) * (pc / 100)) - sin(r) * (tun.h / 2), y: (tun.y1 + (tun.y2 - tun.y1) * (pc / 100)) + cos(r) * (tun.h / 2) - yOffset}),

// Slips an ant off the bg area.
// It is generally OK to call this function directly (note: it will clear the ant's finna queue).
antSlip = ant => {ant.q = [{act: 'slip'}]; antNext(ant)},

// Handles an ant's end of life transition.
// Call this function for instant death, but it is often better to queue a 'die' action which will prepare the ant nicely first.
antDeath = (ant, cause, farm = getFarm(assign(ant, {
    cause: cause,
    state: 'dead',
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
    q: [],
  }))) => {
  farm.stats.death[cause]++;
  msg(ant.n + ` died in "${farm.n}" ${deathCauses[cause]}.`, 'err');
  setColonyAndFoe(farm);
  if (cause == 'fight' && farm.a.length === 1 && isQueen(farm.a[0])) farm.sweep = 1;
  antUpdate(ant);
  save();
  addLidFunc(); // Allow plucking dead ants.
},

// Updates the decomposition state of a corpse and handles ant removal.
updateCorpseState = (ant, twoHours = 7200) => {
  timeLog(ant, 'tsd', 'dts'); // Update time-since-death duration.
  if (ant.tsd > twoHours) {// Wait time before corpse gets nasty.
    if (ant.tsd < twoHours * 3) ant.rot = ((ant.tsd - twoHours) / (twoHours * 2)) * 100; // Rotting phase (2h to 6h).
    else if (ant.tsd < twoHours * 4) {
      // Decaying / shrinking phase (6h to 8h).
      ant.rot = 100;
      ant.decay = ((ant.tsd - twoHours * 3) / twoHours) * 100;
    }
    else antDelete(ant); // Fully decomposed.
  }
  // Extra properties are added for the sake of CSS classes/styles. (note 'rot' and 'decay' also have styles)
  antUpdateClasses(ant, {rot1: ant.rot> 20, rot2: ant.rot > 80, decay1: ant.decay > 60});
},

// Returns a random worker, or failing that - a queen.  Must be in OK health and not carrying.
getWorkerOrQueen = farm => pickRandom(farm.a.filter(a => !a.carry && (isWorker(a) && livesInFarm(a) && a.hp > 50) || farm.a.filter(a => isQueen(a) && livesInFarm(a) && a.hp > 50))),

// Determines what, if anything, needs to be carried by a random worker.
trySetCarryTask = (farm, morgue = farm.tuns.find(t => t.morgue), morgueCandidates = farm.tuns.filter(t => t.t == 'cav' && !t.nip && t.co.filter(co => getTun(farm, co).dun).length < 2 && t.dun),
  carrierAnt = getWorkerOrQueen(farm), queen, itemToMove,
  deadAnt = farm.a.find(a => deadInFarm(a) && !getTun(getTunPosition(a)?.tun)?.morgue), infant = farm.a.find(a => a.moveTo), egg = farm.e.filter(e =>
    queen = farm.a.find(a => a.id == e.Q && livesInFarm(a)) && queen.nest && e.tun != queen.nest || e.moveTo // No need to check if egg is in morgue because queen will move her nest soon if that's the case.  'moveTo' was set if queen left farm.
  ).sort((a, b) => b.lvl - a.lvl)[0]) => {

  // Recalculate where the morgue should be.
  if (!morgue || !morgueCandidates.includes(morgue)) {
    // Pick a new morgue.
    if (morgue) morgue.morgue = 0; // Unmorgue existing morgue.
    if (morgueCandidates || (morgueCandidates = farm.tuns.filter(t => t.t == 'cav' && t.dun))) {// Loosen morgue requirements if needed.
      if (morgue = pickRandom(morgueCandidates)) morgue.morgue = 1;
    }
  }

  if (carrierAnt && !hasCarryTasks(carrierAnt)) {
    // Find the first item that is available to move and not already assigned.
    if (itemToMove = [[deadAnt, 'dead', morgue], [infant, 'inf', 1], [egg, 'egg', 1]].find(([variable, type, param]) =>
      variable && param && farm.a.every(a => a.carry?.t != type || a.carry.id != variable.id)
    )) antFinna(carrierAnt, 'carry', {t: itemToMove[1], id: itemToMove[0].id});
    /*
    // If the id of the deadAnt, infant, or egg has already been assigned to another ant, zero it.
    [[deadAnt, 'dead'], [infant, 'inf'], [egg, 'egg']].forEach(([variable, type]) => {
      if (variable && farm.a.some(a => a.carry?.t == type && a.carry.id == variable.id)) variable = 0;
    });
    // Move a dead ant not in the current morgue.
    if (deadAnt && morgue) antFinna(carrierAnt, 'carry', {t: 'dead', id: deadAnt.id}); // A dead ant needs to be moved!
    // Move the egg with the highest lvl that is not in its queen's nest.
    else if (infant) antFinna(carrierAnt, 'carry', {t: 'inf', id: infant.id}); // An infant needs to be moved!
    else if (egg) antFinna(carrierAnt, 'carry', {t: 'egg', id: egg.id}); // An egg needs to be moved!
    */
  }
  else {
    // We found no ant to perform the carry task.  Last chance: If there's a worker in a vial, call them back out so there's a shot at giving them the task on the next pass.
    // Note: queen is never called back?  If we want her called back then update getWorkerOrQueen with respect to the data storage and state check to support selecting nip ants.
    if (carrierAnt = getVial(farm)?.item.a.find(isWorker)) exitVial(carrierAnt);
  }
},

// Sends an ant to care for an egg or larvae.
care4kids = (farm, carerAnt = getWorkerOrQueen(farm),
    target = pickRandom([farm.e.sort((a, b) => a.hp - b.hp)[0], farm.a.filter(a => a['inf']).sort((a, b) => a.hp - b.hp)[0]].filter(Boolean)), // Randomly pick either a low hp egg or infant.
    isInf = target?.inf) => {
  // Ensure target exists and that no ant is already caring for an egg/infant.
  if (target && !farm.a.some(a => antUniqueActs(a).includes('care'))) {
    isInf ? antGoToAnt(carerAnt, target) : goToLocation(carerAnt, makeDiveStub({tun: target.tun, pc: target.pc, pos: 'dn'}));
    antFinna(carerAnt, 'care', {t: isInf ? 'inf' : 'egg', id: target.id});
  }
},

// Sets the colony and foe values for the current farm.
setColonyAndFoe = farm => {farm.t = !farm.coex && colonyType(farm); farm.foe = !farm.coex && farm.a.some(a => livesInFarm(a) && a.t != farm.t)},

// Gets the vial stuff from the nipples.
getVial = farm => farm.nips.find(n => n.item.k == 'vial'),

// Tells an ant to exit a vial.
// Perform a phase 3 nipWalk, while repeatedly checking if it reached phase 5.
exitVial = (ant, farm = getFarm(ant), exitInterval = setInterval(X => {
    // Repeatedly check the nipWalk moved the ant to phase 5 and then deNip() it.
    if (ant.nipPh == 5) {
      deNip(ant, getVial(farm), farm);
      stopInterval(exitInterval);
    }
  }, microDelay)) => antNipWalk(ant, -25, 3),

// Handles ant walking into an item attached to a nip, to a certain destination.
antNipWalk = (ant, dest, basePhase = 0, animLoop = setInterval(X => {
  assign(ant, {
    nipPh: 1 + basePhase, // Flag that walk is happening.
    walk: 1,
    scale: getSign(dest > ant.x),
    r: ant.x < 20 || ant.x> 32 ? 90 : 90 + ant.scale * getAngle({x: 20, y: 32}, {x: 32, y: 38}) * .5, // Actual angle nerfed to half because it looked too intense.
    x: ant.x + antGetStep(ant) / 2,
    y: (ant.x < 20 ? 28 : ant.x> 32 ? 38 : 32 + 6 * (abs(ant.x - 20) / 24)) - antOffsetY(ant),
    nipTs: getTime()
  });
  if (abs(ant.x - dest) < antOffsetX(ant)) {
    ant.nipPh = 2 + basePhase; // Flag ant is ready for next phase.
    del(antGetStill(ant), 'nipTs'); // Note: antGetStill() slipped in here to avoid setting walk=0 in this same block of code.
    stopInterval(animLoop);
  }
  antUpdate(ant);
}, frameTick)) => 1,

// Provides the vial animation activity. Makes ants walk into the vial and then randomly do random things.
// Curiously this code has no need to know which vial or farm the ant is in.
vialActivity = (ant, rand = randomInt(6)) => {
  !ant.nipPh && antNipWalk(ant, 40 + randomInt(170)); // Ant has not begun their vial walk yet.
  ant.nipPh === 1 && getTime() - ant.nipTs > longDelay && antNipWalk(ant, 40 + randomInt(170)); // Ant was stuck in nipPh 1.
  del(ant, 'carry');
  if (!randomInt(3)) {
    if (ant.nipPh > 1) {
      if (rand > 1) {
        // Location change.
        ant.r = 0;
        ant.nipPh = 0; // Blocks other animations.
        antNipWalk(ant, 40 + randomInt(170));
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
vialLoop = X => vialInterval ||= setInterval((hasAnts = 0) => {
  _.farms.forEach(farm => getVial(farm)?.item.a.forEach(a => {hasAnts = 1; !a['inf'] && currentFarm(farm) && vialActivity(a)}));
  if (!hasAnts) vialInterval = stopInterval(vialInterval);
}, pauseDelay + randomInt(shortDelay)),

// Handles a phase 5 tube walk to insert an ant into a farm.
deNip = (ant, nipData, farm) => {
  checkExpatQueen(ant, farm);
  // Move ant into the farm.
  transferObject(farm, 'a', ant, nipData.item, farm, {
    thot: pickRandom(["That was a long walk!", "I've travelled to another world", "I'm a neighbor", "Moving in!"]),
    nipPh: 0, state: 'cap', f: farm.id, x: nipData.nip % 2 > 0 ? -25 : 985, y: antGroundLevel(ant), scale: 1
  });
  setColonyAndFoe(farm);
  antFinna(ant, 'nip', {nip: nipData.nip, rev: 1});
  // Activate.
  antAction(ant);
},

// Provides the tube walking process for ants moving between farms.
/**
 * This process is broken up into phases for each ant.
 * nipPh=0 - Ant has not begun their tube walk yet. [ant stored with nipItem]
 * nipPh=1 - Ant is currently nipWalking away from the farm.
 * nipPh=2 - Ant has completed nipWalk and reached midway.
 * nipPh=3 - Ant has been moved to the other half of the tube but has not begun their tube walk there.
 * nipPh=4 - Ant is currently nipWalking towards their new farm.
 * nipPh=5 - Ant has completed nipWalk and reached their new farm.
 * nipPh=0 (again) - Ant is no longer part of this process. [ant stored with farm]
 */
tubeWalker = (farm, nipData, ant, nipItem = nipData.item, otherFarm = getFarm(nipData.f),
  otherData = otherFarm?.nips.find(n => n.id == nipData.id), otherNipEl = getEl('a-' + nipIds[otherData.nip])) => {
  antUpdate(antGetStill(ant));
  if (!ant.nipPh || ant.nipPh === 1 && getTime() - ant.nipTs > longDelay) antNipWalk(ant, 600); // Phase 0.
  else if (ant.nipPh == 2) transferObject(otherFarm, 'a', ant, nipItem, otherData.item, {nipPh: 3}, otherNipEl); // Phase 2. Move ant to other half of tube.
  else if (ant.nipPh == 3 || ant.nipPh == 4 && getTime() - ant.nipTs > longDelay) antNipWalk(ant, -25, 3); // Phase 3.
  else if (ant.nipPh == 5) deNip(ant, nipData, farm); // Phase 5.
},

// Starts a tube animation loop if it isn't running already.
tubeLoop = X => tubeInterval ||= setInterval((hasAnts = 0) => {
  _.farms.forEach(farm => farm.nips.forEach(nipData => nipData.item.k == 'tube' && nipData.item.a.forEach(a => {hasAnts = 1; !a['inf'] && tubeWalker(farm, nipData, a)})));
  if (!hasAnts) tubeInterval = stopInterval(tubeInterval);
}, microDelay),

// Ant actions come in a namespaced package so that the action names can be compared to strings.
// Also includes things that the ants "do" to support actions.
act = {

  // Ant is stunned while it chooses what to do next.
  idle: ant => {
    // Queue default action.
    ant.q.length < 2 && antFinna(ant, acts[ant.area.n][0]);
    (ant.q[0]?.act == 'idle' || ant.q[1] ? antNext : antAction)(ant, randomInt(shortDelay)); // Note: sometimes idle is a "phantom" action with no corresponding queue item, so this handles that.
    save();
  },

  // Ant explores the ground level of the ant farm (default activity).
  pace: (ant, antX = antFaceX(ant), action = ant.q[0], nextAction = ant.q[1], xOffset = antOffsetX(ant), rand = ant.scale < 0 && antX < xOffset || ant.scale> 0 && antX > 960 - xOffset ? 0 : random(),
    collision = antCollision(ant), ant2 = collision?.ant) => {
    antSetWalk(ant);
    ant.pose = 'side';
    antArea(ant, 'top');
    if (collision && !antsPassive(ant, ant2)) antFight(ant, ant2); // Fight, or check if a drop target is nearby.
    // Main loop.
    // Check if the ant is set to reach a certain target and hand it off to another action.
    // Note: This code assumes .tx is never set to 0.
    if (!action.for && nextAction && (!nextAction.tx || abs(nextAction.tx - antX) < xOffset)) antNextStill(ant, randomInt(microDelay));
    else {
      // Move ant.
      action.for && action.for--;
      antMoveSurface(ant);
      if (!rand || !nextAction && rand < .0002 || nextAction?.tx && (nextAction.tx - (antX + ant.scale * xOffset)) * ant.scale < 0) {// Random or heading the wrong way.
        // Flip direction (with brief pause).
        antActionStill(ant, randomInt(microDelay));
        ant.scale *= -1; // <-- Yes, this has to be here after antAction() to set up the next loopback, rather than do it right away.  Looks better.
        ant.r = antHillAngle(ant); // <-- And yes, thanks to setting the scale here we gotta do this too on a flip'n'pause or it looks silly.
      }
      else if (rand < .001) antActionStill(ant, randomInt(pauseDelay)) // Pause.
      else antAction(ant);
      // Apply corpse proximity penalty.
      antCorpseProximity(ant);
    }
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
        queue.push({act: 'dive'}); // Note: dive automatically does a 'pace' to the entrance.
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
    digAmt = antType.v * .2, nudger, path,
    entNudge = (ant, tun) => nudger = setInterval(X => {
      ant.x += getSign(antFaceX(ant) < tun.x1) * random();
      ant.y = antGroundLevel(ant) + 2;
      ant.r = antHillAngle(ant) + tun.prog / 9 + randomInt(5);
      antUpdate(ant);
    }, num200),
    conNudge = (ant, tun, sumX = 0, sumY = 0, rad, finalAngle) => {
      // Turn ant towards a random point that is roughly facing away from the already-dug tunnels.
      farm.tuns.filter(t => t.dun && t.co.includes(tun.id)).map(ct => getAngle(tun, (ct.x1 == tun.x && ct.y1 == tun.y) ? {x: ct.x2, y: ct.y2} : {x: ct.x1, y: ct.y1})).forEach(a => {
        rad = degToRad(a);
        sumX -= cos(rad);
        sumY -= sin(rad);
      });
      finalAngle = normalize180(angleFromDelta(sumX, sumY) + randomInt(60) - 30) + 45;
      nudger = setInterval(X => {
        let distComp = calcDistComponents(ant.x, antDiveY(ant), tun.x1, tun.y1);
        if (distComp.d > .2) {
          ant.x += distComp.x * .2;
          ant.y += distComp.y * .2;
          antUpdate(ant);
        }
        else {
          ant.r += getSign(normalize180(finalAngle - ant.r));
          stopInterval(nudger);
        }
        antUpdate(ant);
      }, frameTick);
    }) => {
    if (farm.dun || isDrone(ant)) antNext(ant); // No digging required.
    else if (ant.digD && tun) {
      ant.digT = tun.id;
      antRemAnimUpdate(ant); // Reset animations.
      setTimeout(X => antUpdateClasses(ant, {dig: 1, jit: 1}), randomInt(num1000)); // Random delay added so ants aren't synch'd on page load.
      tun.rwip = !isRotationTunnel(tun) && farm.tuns.some(t => t.dun && t.x1 == tun.x2 && t.y2 == tun.y2); // Mark tunnels that are being built backwards.
      // Digging movement and animations.
      if (!farmIsDeveloping(farm) && farmHasQueen(farm)) digAmt *= 1.5; // Ants dig faster if there is a Queen and farm is undeveloped.
      if (isQueen(ant)) digAmt *= 3; // Queens only dig when there are no workers, but do it much faster.
      if (!isRotationTunnel(tun)) {
        digAmt *= (tun.t == 'cav' ? .1 : .3); // Long tunnels are dug slow, with cav chambers the slowest of all.
        if (tun.prog < tunPercent(tun, 8)) {
          // Ant would have been blocked from entering tunnel by the dive action, so continue to act like it's digging an entrance or con.
          tun.co.includes(action.ent) ? entNudge(ant, getTun(farm, action.ent)) : conNudge(ant, farm.tuns.find(t => tun.co.includes(t.id) && t.t == 'con' && t.dun));
        }
        else {
          // Default nudger; just brings the ant closer to the edge of the dig area every 2 seconds if needed.
          nudger = setInterval(X => {
            let antTunPos = getTunPosition(ant, 0, tun);
            if (antTunPos && antTunPos.pc + antOffsetX(ant) < (tun.rwip ? 100 - tun.prog : tun.prog)) antMoveTunnel(ant);
            antUpdate(ant);
          }, num2000);
        }
      }
      else if (tun.t == 'ent') entNudge(ant, tun); // Entrance tunnel.
      else conNudge(ant, tun); // Con tunnel.
      // Everything from now on happens after a significant delay.
      // This makes the digging slow, and prevents an exploit where reloading skips the wait-time in digging.
      setTimeout(X => {
        // Incremement progress based on the size of the tunnel.
        tun.t == 'ent' && tun.co.forEach(t => t.prog = tunPercent(t, tunPixels(tun, tun.prog / 2))); // For entrances also increment the connected tunnels like they've been dug a little too, or it takes too long.
        tun.t == 'cav' && (tun.prog < tunPercent(tun, 15) || tun.prog> tunPercent(tun, 85)) && (tun.prog += digAmt); // For the first and last 15px of cavities, double the build progress, because this part looks goofy.
        tun.prog = min(100, tun.prog + digAmt);
        currentFarm(farm) && tunProgDraw(tun);
        if (tun.t == 'tun' || tun.t == 'cav') {
          // Pick an adjacent hill and increase its height slightly.
          // To know it is adjacent; the hill should have the same index as the current tunnel system, or one higher.
          let hill = farm.hills[farm.tuns.findIndex(t => t.id == action.ent) + randomInt(1)];
          hill.h = min((hill.r - hill.l) / 4, hill.h + .005); // Cap hill heights at a quarter their width.
          setTimeout(X => currentFarm(farm) && hillProgDraw(hill), standardDelay);
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
        if (tun.prog == 100 || ((ant.digD > 5 || ant.q[1]) && !randomInt(5)) || ant.hp < 20 || farm.a.filter(a => a.digD && a.digT == ant.digT) > 3) {
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
          }
          // Dig end.
          updateWaypoints(farm);
          ant.area.n == 'bot' && antInstaQ(ant, {act: 'climb'});
          del(ant, 'digD');
          ant.area.t && antChangeTunDir(ant, tun);
          antNext(ant);
        }
        else antAction(ant);
      }, standardDelay);
    }
    else {
      // Setup.
      ant.digD = 1;
      // Pick the tunnel the ant will dig, preferring the last tunnel it was digging, otherwise choose one that another ant was digging.
      // If none was picked, or there is only one to choose from plus random chance, find where ant could dig.
      if (!currentDig || farm.dig.length < 2 && !randomInt(25)) {
        // Pick a random entrance and find an unstarted tunnel that it leads to.
        tun = pickRandom(farm.tuns.filter(t => t.t == 'ent' && t.dun));
        if (path = tun && randomInt(9) && findPath(farm, tun, {dun: 1, t: 'ent'}, [], 1, 1, tun.id)) {// Inverted match.
          currentDig = path.length ? {n: 'bot', id: last(path), ent: tun.id} : {n: 'top', tx: tun.x1, id: tun.id, ent: tun.id};
          // Detect duplicate dig jobs before storing data.
          getById(farm.dig, currentDig.id) ? currentDig = 0 : farm.dig.push(currentDig);
        }
        else {
          // Dig a new entrance.
          tun = pickRandom(farm.tuns.filter(t => t.t == 'ent' && !t.dun));
          if (tun) farm.dig.push(currentDig = {n: 'top', tx: tun.x1, id: tun.id, ent: tun.id});
          else if (farm.tuns.every(t => t.dun)) farm.dun = 1; // Nothing more to do.
        }
      }
      if (currentDig) {
        tun = getTun(farm, currentDig.id);
        currentDig.pc = tun.rwip ? 100 - tun.prog : tun.prog;
        goToLocation(ant, makeDiveStub(currentDig));
        antFinna(ant, 'dig', currentDig);
      }
      save();
      antNext(ant);
    }
  },

  // Climb sets up a dive path to the surface.
  climb: (ant, farm = getFarm(ant), climbQ = [], tunPos) => {
    if (ant.area.t) {// Sometimes climb is in an ant's queue erroneously :/
      let tun = getTun(farm, ant.area.t), path = findPath(farm, tun, {dun: 1, t: 'ent'}, [], 0, 1);
      // Create a custom queue.
      if (!path && tun.t == 'con' && tun.prog <= 15) {// Sometimes the ant is wrongly pinpointed to be in an unbuilt con from which the path finder fails.
        tunPos = getTunPosition(ant, ant.area.t);
        antArea(ant, 'bot', tunPos.tun.id);
        path = findPath(farm, tunPos.tun, {dun: 1, t: 'ent'}, [], 0, 1);
      }
      ant.area.t && climbQ.push(makeDiveStub({id: last(path)}));
      climbQ.push({act: 'pace', for: 9 + randomInt(99)});
      // Prepend the climb queue to the main queue.
      antInstaQ(ant, climbQ);
    }
    antNext(ant);
  },

  // Burrowing action.
  dive: (ant, farm = getFarm(ant),
      action = ant.q[0],
      tun = getTun(farm, action.id),
      nextAction = ant.q[1],
      nextTun = nextAction?.act == 'dive' && getTun(farm, nextAction.id),
      wp = wayPoints[farm.id][getWaypointIndex(farm, ant)],
      previousTun = getTun(farm, action.pt), step = antGetTunnelStep(ant), executeAction = 1, nextTunAngle = nextTun?.r || 0,
      badAngle = ant.scale * (nextTun?.r - 90)> 0,
      data = [], dest, dir, temp
  ) => {
    if (tun) {
      // This is a fully expanded dive queue; determine destinations.
      if (!isRotationTunnel(tun) && tun.prog < tunPercent(tun, 8) || isRotationTunnel(tun) && nextTun && (nextTun.prog < tunPercent(nextTun, 8) || !tun.dun)) return antNext(ant); // Protect against entering underbuilt tunnels.
      if (tun.t == 'ent') {
        if (ant.area.n == 'top') dest = getEntrancePoint(nextTun, antOffsetY(ant), badAngle ? 0 : -ant.scale); // Entering from surface.
        else {
          // Ant is about to surface; predict how it should end up.
          //
          // Note: This code feels clumsy. It creates a "fake ant" so we can change its properties and pump it through ant functions to predict where the real ant will end up after the climb,
          // and then uses that to set a fake "nextTunAngle" for the dive action and a scale for the 'rotWalk' surface correction.
          // Plus we wound up switching to using a random ant scale, the original tried to be cleverer with tunGetSide() and getWaypointIndex() to pick the more natural direction in side pose.
          // Now the ants can back flip out of tunnels, which looks silly, but maybe that's OK.
          !action.pt && antToProneWithCorrection(ant, tun, action.rev); // Can't remember what this is for, maybe digging?
          data = cloneData(ant); // Set data variable to a fake ant so we can test it out.
          data.scale = randomSign();///
          data.scale = ant.pose == 'prone' ? randomSign() : tunGetSide(getTun(farm, action.pt), getWaypointIndex(farm, ant)) * -1;
          data.x = (data.scale> 0 ? max : min)(ant.x, tun.x1) + 7 * data.scale;
          data.y = antGroundLevel(data);
          dest = {x: data.x, y: antDiveY(data)};
          nextTunAngle = antHillAngle(data);
          if (data.scale < 0) nextTunAngle = oppositeAngle(nextTunAngle);
          action.sc = data.scale;
        }
        // Flag a rotWalk.
        executeAction = 2;
      }
      else if (tun.t == 'con') {
        if (ant.pose == 'prone') {
          // Just rotWalk to the next tunnel.
          dest = getConnectionPoint(tun, nextTun);
          if (nextTun.t == 'cav') dest.y += randomInt(8) - 4; // Randomize it a bit for cavities.
          // Flag a rotWalk.
          executeAction = 2;
        }
        else if (nextTun) {
          // Figure out where the ant will wind up if it continues in side pose.
          dir = getAntWaypointDirection(ant); // Precalculate this as it is too hefty to do in the do-loop.
          console.log("# Initial dir:", dir);
          do {
            console.log("Get next waypoint to:",JSON.stringify( wp),dir);
            wp &&= getNextWaypoint(farm, wp, dir);
            temp = wp && getWpTunnel(farm, wp, tun);
          } while (temp && (temp == tun.id || temp == action.pt));
          // Check if next tunnel is not the one ant is heading to, or any other action's tunnel after that.
          // Note: This assumes there isn't some OTHER kind of act wedged in between expanded future dive actions.
          if (ant.q.some(action => action?.act == 'dive' && action.id == temp)) {
            console.log("Ant is heading towards:", temp, "instead of:", nextTun.id);
            // Ant is creeping toward wrong tunnel - switch to prone to make a proper turn, and loopback to this function.
            antToProneWithCorrection(ant, tun, action.rev);
            return antActionStill(ant);
          }
          // NOTE: At this point the execution should fall through to the "if (executeAction > 1) {" part of the code.
        }
      }
      if (nextTun) nextAction.pt = tun.id; // Notify the next action of the previous tunnel.
      if (executeAction > 1) {
        // Rot Walk execution.
        // Work out step (step size) and dist (num steps / frames).
        temp = calcDistComponents(ant.x, ant.y, dest.x, dest.y);
        action.dist = round(hypot(dest.x - ant.x, dest.y - (action.r ? ant.y : antDiveY(ant))) / hypot(temp.x * step, temp.y * step));
        // Switch to prone when entering tunnel from surface at a badAngle.
        badAngle && setTimeout(X => {ant.pose = 'prone'}, action.dist / frameTick * 2);
        if (tun.t == 'ent') action.dist *= .8; // Speed up entry transitions.
        if (tun.x1 == nextTun?.x2 && tun.y1 == nextTun?.y2) nextTunAngle = oppositeAngle(nextTunAngle); // Correct for going the other way through tunnels.
        assign(action, {
          r: normalize180(ant.r), // Initial angle.
          td: action.dist, // Initial total distance.
          ang: normalize180(angleFromDelta(dest.x - ant.x, dest.y - antDiveY(ant))), // Travel angle.  Orient to connection point.
          rot: normalize180(nextTunAngle), // Final angle.  Orient to tunnel.
          // Step sizes.
          sX: (dest.x - ant.x) / action.dist,
          sY: (dest.y - antDiveY(ant)) / action.dist,
          // Override 'dive' with the relevant walking action and execute.
          act: 'rotWalk'
        });
        if (ant.scale < 0) {
          action.ang = normalize180(mirrorAngle(action.ang));
          action.rot = normalize180(mirrorAngle(action.rot));
        }
        antArea(ant, 'bot', tun.id);
        antAction(ant);
      }
      else {
        // Tun Walk execution.
        // Work out whether the ant is meant to be walking in reverse (towards the 0% point of the tunnel).
        if (nextTun) action.rev = tun.x1 == nextTun.x1 && tun.y1 == nextTun.y1; // If there's a nextTun use it's connection to this tunnel to judge whether we're doing a reverse walk.
        else if (previousTun) action.rev = tun.x2 == previousTun.x2 && tun.y2 == previousTun.y2; // No next tun, but if there's a prevTun use it's connection to this tunnel to judge whether we're doing a reverse walk.
        else if ('pc' in action) {
          // We're probably going to another spot within the exact same tunnel, so judge whether we're doing a reverse walk based on the relative position of the ant to the supplied target percentage.
          temp = getTunPosition(ant, action.pt, tun);
          action.rev = temp.tun.id == tun.id ? temp.pc> action.pc : calculateDistance(ant.x, antDiveY(ant), tun.x1, tun.y1) > calculateDistance(ant.x, antDiveY(ant), tun.x2, tun.y2);
        }
        // Work out a default target percentage if one isn't supplied.
        if (typeof action.pc != 'number') action.pc = action.rev ? 0 : 100;
        // Track the current position (in percentage) of the ant.
        action.dist = action.rev ? 100 : 0; // This is wrong if the ant starts inside the target tunnel but it will be corrected after one step in tunWalk.
        if (!isRotationTunnel(tun) && antDir(ant, tun) == action.rev) ant.pose == 'side' ? antSideCorrection(ant, tun, wp) : (ant.r = oppositeAngle(ant.r));
        // Override 'dive' with the relevant walking action and execute.
        action.act = 'tunWalk';
        antArea(ant, 'bot', tun.id);
        antAction(ant);
      }
    }
    else {
      // No dive queue - select tunnels and create queue.
      tun = action.tun ? getTun(farm, action.tun) : pickRandom(farm.tuns.filter(t => t.t == 'cav' && t.dun && !t.morgue));
      if (tun) {
        // Calculate a temp path in reverse for consideration in assembling queue data.
        temp = findPath(farm, tun, ant.area.n == 'top' ? {dun: 1, t: 'ent'} : {id: ant.area.t}, [], 0, 1);
        if (ant.area.n == 'top') {
          // On the top level, need to pace to the tunnel entrance first.
          dest = tun.t == 'ent' ? tun : getTun(farm, temp.pop()); // Get the entrance tun.
          data.push({act: 'pace'});
          data.push({act: 'dive', tx: dest.x1, id: dest.id});
        }
        if (ant.area.t && !temp) {
          // Different tunnel system, need to climb out of the current system.
          data.push({act: 'climb'});
          data.push({act: 'dive', tun: tun.id});
        }
        else {
          temp?.reverse().forEach(tunId => data.push({act: 'dive', id: tunId}));
          // Rebuild the current action into the final destination action.
          action.id ||= tun.id;
          action.pc ||= !isRotationTunnel(tun) && min(tun.prog, 20 + randomInt(60));
          data.push(action);
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
      if (!nextTun && tun.t == 'ent') antSurface(ant, action.sc); // Special case for ants that have just surfaced.
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
      wp = wayPoints[farm.id][getWaypointIndex(farm, ant)],
      temp1, temp2, temp3 // Reuse temp vars as various values and bits of data are juggled here, and this saves declaring a whole bunch.
    ) => {
    antSetWalk(ant);
    // Move along in tunnel.
    if (ant.pose == 'side') {
      // Determine the average angle of the nearest waypoints.
      temp1 = getWaypointAngle(ant);
      if (temp1 == null) {
        // Lost waypoints?
        antToProneWithCorrection(ant, tun, action.rev);
        action.ns = 1; // Mark this action as "no switch" to prevent random pose switching.
      }
      else {
        // Update the ant's rotation, but cap it at 5 degrees per frame, and snap if over 99 deg.
        temp2 = normalize180(temp1 - ant.r); // Angle diff.
        ant.r = abs(temp2) > 99 ? oppositeAngle(temp2) : normalize360(ant.r + clamp(temp2, -5, 5));
        // Nudge ant closer to wp if needed.
        antNudgeToWP(ant, wp);
      }
    }
    else {
      // Prone walk roughly towards the destination with collision corrections.
      if (!randomInt(4)) ant.r = normalize360(ant.r + randomSign()); // Add a little random wobble to the angle.
      if (temp3 = antCollision(ant, 4)) {
        // Ant is going to collide with another ant.
        temp2 = temp3.ant;
        if (antsPassive(ant, temp2)) {
          if (ant.pose == 'prone' && temp2.pose == 'prone' && tun.t == 'cav' && antCheckAvoidance(antGetStill(ant))) {// Note: antGetStill() slipped in here so the ant doesn't treadmill in place when halted by collision.
            // Avoid this ant.
            temp1 = calcDistComponents(temp2.x, antDiveY(temp2), ant.x, antDiveY(ant));
            ant.r = normalize360(ant.r + temp3.dir * 2);
            ant.x += temp1.x / 2;
            ant.y += temp1.y / 3;
            // Track ant avoidance duration so we can stop doing it if it gets too insane.
            antTrackAvoidance(ant);
          }
        }
        else antFight(ant, temp2); // Fight!
      }
      // Partial correction for prone ants that have a weird trajectory.
      temp1 = normalize180(tun.r - (action.rev && deg180) - ant.r);
      if (tun.t == 'tun' && abs(temp1) > 3) ant.r = normalize360(ant.r + sign(temp1) * 3);
      if (tun.t == 'cav' && abs(temp1) > 60) ant.r = normalize360(ant.r + sign(temp1) * 9);
      // Determine if we're on a collision course with a waypoint and then align the ant with the waypoint angle by 2 degrees to minimise the collision.
      if (antWaypointCollision(farm, ant)) {
        antProneCorrection(ant);
        temp3 && randomInt(3) ? antInstaQ(ant, {act: 'idle'}, 0) : // Ant is dealing with an ant collision as well, give it some hesitation.
          ant.r = normalize360(ant.r + sign([0, deg180].map(a => normalize180(tun.r + a - ant.r)).sort((a, b) => abs(a) - abs(b))[0]) * 2);
      }
    }
    // Check for nearby enemies (even without collision).
    if (temp1 = farm.foe && farm.a.find(a => ant.area.t == a.area.t && !antsPassive(ant, a) && antInTargetProximity(ant, a, 30))) antFight(ant, temp1); // Ant is near an enemy ant.
    if (action.pos) {
      console.log("position feature");
      // Position encourager feature.  Coaxes ant to walk towards the side of the tunnel it is supposed to be on, but there is no guarantee it'll get there.
      // NOTE: This only works for 'cav' tunnels which are roughly horizontal, that isn't checked here, it is assumed the calling code will only use this feature for cavs.
      if (ant.pose == 'prone') {
        if (antWaypointRange(ant, wp)) antToSideWithCorrection(ant, tun, wp); // Ant is in landing range, so land it.
        else if (antWaypointRange(ant, wp, 2)) {
          // Ant is getting close to landing range, but is probably coming in too steep.
          // Straighten up to with 9deg of 0 or 180, 2deg at a time.

          /*
          if (ant.r < deg180) {
            // Goal is ~90.
            if (ant.r < 75) ant.r += 2;
            if (ant.r> 105) ant.r -= 2;
          }
          else {
            // Goal is ~275.
            if (ant.r < 260) ant.r += 2;
            if (ant.r> 290) ant.r -= 2;
          }
          */
          temp1 = normalize180((ant.r < 90 ? 0 : deg180) - ant.r);
          if (abs(temp1)> 9) ant.r = normalize360(ant.r + (temp1 < 0 ? -2 : 2));
          ant.y += action.pos == 'u' ? 2 : -2; // Bump ant even closer.

        }
        else {
          // Ant is too far away from tunnel wall and needs to be angled there.
          /*
          let closeDest = abs(action.dist - action.pc) < 30; // Determine if ant is very close to the destination.
          if (action.pos == 'u') {
            if (ant.r < deg180) if (ant.r> 50 || closeDest && ant.r > 15) ant.r -= 9; // Limits are 45 and 10.
            else if (ant.r < 310 || closeDest && ant.r < 345) ant.r += 9; // Limits are 315 and 350.
          }
          if (action.pos == 'd') {
            if (ant.r < deg180) if (ant.r < 130 || closeDest && ant.r < 165) ant.r += 9; // Limits are 135 and 170.
            else if (ant.r> 235 || closeDest && ant.r > 195) ant.r -= 9; // Limits are 230 and 190.
          }
            */
          temp1 = normalize180((action.pos == 'u' ? 300 : action.pos == 'd' ? 60 : ant.r) - ant.r);
          abs(temp1) < (abs(action.dist - action.pc) < 30 ? 20 : 40) ? ant.r : normalize360(ant.r + (temp1 < 0 ? -9 : 9));

          /*
          frankly i don't understand what the code above is doing, it might be better to make it something like this:
          let target = (action.pos == 'u' ? 0 : 180); // always aim up or down
          let diff = normalize180(target - ant.r);
          if (abs(diff)> maxStep) diff = (diff < 0 ? -maxStep : maxStep);
          ant.r = normalize360(ant.r + diff);
          */
        }
      }
      else {
        temp1 = tunGetSide(tun, {x: ant.x, y: antDiveY(ant)});
        if (action.pos == 'u' && temp1 < 0 || action.pos == 'd' && temp1> 0) action.ns = 1; // Already correct position, flag "no switch" to prevent random pose switching.
        else {
          // Wrong side of the tunnel, switch to prone.
          antToProneWithCorrection(ant, tun, action.rev);
          action.ns = action.pos == 'm'; // Disable random switching for 'm' position.
        }
      }
    }
    // Random ant pose switching feature.
    temp1 = tun.prog / 100 * tunPercent(tun, 30); // Percentage representing 30px of the tunnel taking the current dig progress into account.
    // Ensure we're not at the end of the tunnel or have flagged the no-switch.
    if (!action.ns && !(action.rev ? action.dist < temp1 : action.dist> (tun.prog - temp1)) && !isRotationTunnel(tun) && antWaypointRange(ant, wp) && !randomInt(ant.pose == 'prone' ? num200 : num500)) {
      action.ns = 1; // Don't randomly switch again in this tunnel.
      ant.pose == 'prone' ? antToSideWithCorrection(ant, tun, wp) : antToProneWithCorrection(ant, tun, action.rev);
    }
    // Walk along tunnel.
    antMoveTunnel(ant);
    // Now check where the ant actually is.
    temp3 = getTunPosition(ant, action.pt, tun, nextTun?.t);
    // Note: If doing getTunPosition() on every frame is too expensive for performance, be aware that getWpTunnel() caches the result and it might be a better system to upgrade that functionality for use here?
    if (!temp3) {
      // If we're working on an underbuilt tunnel, let's just say we're in the previous tunnel.
      if (tun.prog < 15) temp3 = {tun: farm.tuns.find(t => t.co.includes(tun.id) && t.dun)};
      while (!temp3) {
        antToProneWithCorrection(ant, tun, action.rev); // Shuffle the ant back into the tunnel.
        temp3 = getTunPosition(ant); // Recalculate with no ignores/limits/desires.
      }
    }
    // Check skipped tunnels.
    if (temp3 && temp3.tun.id != tun.id) {// antTunPos MUST exist at this point.
      // Ant is in a different tunnel than the one it is supposed to be in.
      // This could be normal in which case antNext() will continue the journey, but there are some cases to check first.
      if (nextTun && temp3.tun.id != nextTun?.id) {
        // Ant's current actual position is not in the nextTun in the queue.  This code will investigate the problem.
        antArea(ant, 'bot', temp3.tun.id);
        // Check if a tunnel was skipped over (it happens), and we should be further along in the queue.
        // Note: We are ignoring any non-dive actions that are wedged in between dive actions that have an id.  Seems unlikely this would occur!
        temp1 = ant.q.findIndex(a => a.act == 'dive' && a.id == temp3.tun.id);
        if (temp1 > 0) ant.q.splice(0, temp1);
        else if (temp3.tun.co.find(id => tun.co.includes(id)) == nextTun.id)
          // Ant has wandered into an adjacent tunnel at a juncture, switch to prone to complete an awkward course correction on the next pass.
          antToProneWithCorrection(ant, tun);
        else {
          antToProneWithCorrection(ant, tun);
          // Severe course correction.  Ant is lost, so set up a new path to the original destination (the last dive action in the queue).
          temp1 = max(0, ant.q.findLastIndex(a => a.act == 'dive' && a.tun)); // Calculate the index of the final dive action.
          temp2 = ant.q[temp1]; // Store the final action itself because we're about to delete it.
          ant.q.splice(0, temp1 + 1); // Remove the dive queue, but keep anything after the final dive.
          antInstaQ(ant, makeDiveStub(temp2));
        }
      }
      // Execute queue.
      antNextStill(ant);
    }
    else if (isRotationTunnel(tun)) {
      // Side pose walking can take an ant along the waypoints through a rotational tunnel, so the ant needs to just keep going.
      antAction(ant); // Special case for rotation tunnels.  Just loopback to this action without doing further checks.
    }
    else if (antDir(ant, tun) == action.rev) {
      // Wrong way!  Ant needs to be flipped around safely.
      antChangeTunDir(ant, tun);
      action.act = 'dive';
      antActionStill(ant, randomInt(pauseDelay));
    }
    else if (abs(temp3.pc - action.pc) < tunPercent(tun, antOffsetX(ant)) && !ant.frz) {
      antNextStill(ant); // Ant reached action.pc
    }
    else {
      // Not there yet - loop back to this function.
      action.dist = temp3.pc;
      randomInt(num200) && !ant.frz ? antAction(ant) : // Normal loopback.
        antActionStill(ant, frameTick + randomInt(pauseDelay)); // Loopback with brief pause.
      ant.frz> 0 ? ant.frz-- : del(ant, 'frz'); // Decrement or cleanup the freeze flag which is used by tunOrient to force the pauseDelay to trigger on an ant here.
    }
    // Apply corpse proximity penalty.
    antCorpseProximity(ant);
  },

  // Prone walks an ant to exactly a target.
  // Note: action.target (required) is any object/shim with x/y coords, and action.ant (if set) is just the id of an ant if temporary freeze of an ant target is desired.
  // Important: This assumes the ant is already in the same cavity as the target, so nothing too funky happens.
  tunOrient: (ant, action = ant.q[0]) => {
    antToProneWithCorrection(ant, getTun(getFarm(ant), ant.area.t));
    ant.r = oppositeAngle(ant.r + antToTargetAngle(ant, action.target)); // Snap to orientation so as not to do a rotational walk that might take ant out-of-bounds.
    if (!antInTargetProximity(ant, action.target, antOffsetX(ant) + 2)) {
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

  // Slip off the bg scenery/glass.
  slip: (ant, target = antGroundLevel(ant)) => {
    ant.pose = 'pick';
    if (target - ant.y > 1.2) {
      ant.y += 1.2;
      if (ant.r < 0) ant.r += 1.2;
      antAction(ant);
    }
    else {
      // Target reached.
      ant.q = []; // Clear the queue because the ant now has a concussion and it's complicated to consider which queue items are still valid.
      antSurface(ant);
    }
  },

  // Slip an ant to the floor of a tunnel.
  // This does not use cavFloor() as the ant might be in another type of tunnel and not aligned with a cavity.  Also using waypoints would be too involved.
  tunSlip: ant => {
    ant.pose = 'pick'; // Note: We never reset the pose back to what it was before, that can change later if needed perhaps by passing a param in the action.
    if (getTunPosition(ant)) {// Ant still "in" the tunnel.
      // Move downwards. Note: We don't rotate the ant here to land on its feet, that can be added later if needed.
      ant.y += .7; // This occurs slower than the 'slip' action because everything in tunnels is slower.
      antAction(ant);
    }
    else {
      // Hit past the edge of the tunnel. Note: We don't readjust it back into the tunnel here, that can be added later if needed.
      // Leave the ant in a horizontal position with random flip & scale - if this proves unacceptable consider trying getWaypointAngle() of the 3 closest waypoints.
      ant.r = pickRandom[0, deg180];
      ant.scale = randomSign();
      antNext(ant);
    }
  },

  // Land an ant near the surface onto the surface.
  land: (ant, target = antGroundLevel(ant)) => {
    antSetWalk(ant);
    if (target - ant.y > antOffsetX(ant)) {
      ant.y += antGetStep(ant);
      ant.r += sign(deg180 - ant.r) * 2; // We know ant is heading downwards (~90deg) now adjust orient towards horizontal.
      antActionStill(ant);
    }
    else antSurface(antGetStill(ant));
  },

  // Uncrawl action.
  uncrawl: ant => {
    antInstaQ(ant, [{act: 'crawl', top: 1}, {act: 'pace'}]);
    antNext(ant);
  },

  // Prone walk on the scenery/bg inside the farm.
  crawl: (ant, action = ant.q[0], nextAction = ant.q[1], near = antBgNear(ant), diff, targetAngle, clearance = antGroundLevel(ant) - 20) => {
    antArea(ant, 'bg');
    if (!ant.area.d && (ant.x < 30 && ant.scale < 0 || ant.x> 930 && ant.scale > 0)) ant.scale *= -1; // Ant is about to walk into the edge of the farm, let's flip it first.
    ant.pose = 'prone';
    antProneCorrection(ant);
    if (!action || (!action.x && ant.y < clearance && !randomInt(num2000))) antSlip(ant); // Slip off.
    else if (!action.x && near && near[0] == 90 && (!action.for || action.for < 1) && (nextAction && !acts.bg.includes(nextAction.act) || action.top || ant.area.d> standardDelay && !randomInt(3))) {
      // At the bottom boundary, land the ant.
      antInstaQ(ant, {act: 'land'});
      antNext(ant);
    }
    else if (!action.x && !action.for && nextAction && acts.bg.includes(nextAction.act) || action.x && calculateDistance(ant.x, ant.y, action.x, action.y) < antOffsetX(ant))
      antNextStill(ant); // Ant has crawled for long enough or reached the destination, move on to the next action.
    else {
      if (ant.area.d < 49 && near && near[0] == 90) ant.r = normalize360(ant.r + randomInt(5) * getSign(90 + ant.r> deg180)); // Ant is starting the crawl; ignore the "near" collision and orient it slightly upwards.
      else if (near) {
        // Redirect ant from boundary.
        diff = normalize180(ant.r - near[0]);
        ant.r = abs(diff) < 10 && !randomInt(num200) ? oppositeAngle(ant.r) : normalize360(ant.r + getSign(diff> 0) * 9); // Occasionally just flip the ant on shallow angles to prevent stuck-in-corner forever situation.
      }
      else if (ant.area.d > 99 && action.x) {
        // We want this ant to head to a particular spot.
        targetAngle = getAngle(ant, action);
        diff = normalize180(targetAngle - ant.r);
        ant.r = normalize360(abs(diff) < 3 ? targetAngle : ant.r + sign(diff) * ((abs(diff)> 90 && calculateDistance(ant.x, ant.y, action.x, action.y) < 20) ? 10 : 2));
      }
      else if (!randomInt(shortDelay)) ant.r = normalize360(ant.r + randomInt(20) - 10); // Random direction bump.
      else if (action.top && ant.y < clearance) {// Ensure ant is well above surface level before enforcing the following rules.
        // Prevent ant walking upwards.
        if (abs(normalize180(ant.r - deg270)) < 90) ant.r = oppositeAngle(ant.r);
        else {
          // Turn ant in a generally downward direction.
          diff = normalize180(90 - ant.r);
          if (abs(diff)> 30) ant.r = normalize360(ant.r + (diff < 0 ? -5 : 5));
        }
      }
      // Track time spent.
      action.for && action.for--;
      // Continue crawl.
      antMoveDefault(ant, antActionStill, 1, .5, 2);
      // Apply corpse proximity penalty.
      antCorpseProximity(ant);
    }
  },

  // Ant stops and regenerates hp and mood.
  rest: (ant, farm = getFarm(ant)) => {
    // Ant needs to find a spot away from other ants, food, and water.
    if (farm.a.find(a => antInTargetProximity(a, ant, 30)) || ant.area.n == 'top' && farm.items.some(i => ['food', 'drink'].includes(i.t) && abs(ant.x - i.x) < 30)) {
      if (ant.area.n == 'bot') {
        if (ant.q.length < 9) {// Only try again if the queue isn't getting too long.
          // Attempt a dive to the same tunnel they're already in, or random chance to pick a random tunnel.
          antFinna(ant, 'dive', {tun: randomInt(9) && ant.area.t});
          antFinna(ant, 'rest');
        }
        antNext(ant);
      }
      else {
        antInstaQ(ant, {act: acts[ant.area.n][0], for: randomInt(9)}, 0); // For top and bg we just need to move a little and try again.
        antAction(ant);
      }
    }
    else {
      // After wait time, increment ant's stats, and check whether to wake up.
      setTimeout(X => {
        antStats(ant, {hp: .5, md: .1});
        // Ensure it is not a queen awaiting service, and then decide whether to continue resting or wake up based on the hp level.
        !(isQueen(ant) && isQueenAwaiting(ant)) && (ant.dr < 9 || ant.fd < 9 || ant.hp> 99 || ant.hp > 90 && !randomInt(9) || ant.hp > 20 && !randomInt(90)) ? antNext(ant) : antAction(ant);
      }, standardDelay);
    }
  },

  // Ant eat action.
  eat: (ant, farm = getFarm(ant), action = ant.q[0], isFlesh = action.t == 'flesh', food = getById(isFlesh ? farm.a : farm.items, action.id), ate) => {
    if (action.id && food) {
      // Ant has reached the target food.
      antUpdateClasses(ant, {dig: 1});
      setTimeout(X => {
        if (isFlesh && deadInFarm(food)) {// Check food still exists at this point in case it was removed/eaten.
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
          isPreference = (antType, food, foodItem = items[food.k]) => !antType.d || antType.d < 2 && foodItem.sweet || antType.d> 1 && foodItem.meat,
          deadAnts = farm.a.filter(a => deadInFarm(a) && !a.rot), // Find dead ants that are not rotten yet.
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
            types[farm.t].d < 2 || !farm.foe && !farm.a.some(deadInFarm) && playerHint(farm, ["There is no food available for your ants.", "Your ants need something to eat!", "The ants are getting hungry."]);
            return antNext(ant); // Nothing can be done about this.
          }
          else pref = 0; // There is food, but not ideal.
        }
        if (chosenFood) {
          // Now calculate where to go.
          let type = chosenFood.t != 'food' ? 'flesh' : chosenFood.t;
          if (chosenFood.t == 'food' || chosenFood.area.n == 'top') {
            goToLocation(ant, {n: 'top'});
            antFinna(ant, 'eat', {id: chosenFood.id, t: type, pref: pref, Q: action.Q, tx: chosenFood.t == 'food' ? 25 + parseInt(chosenFood.x) + randomSign(23) * randomInt(chosenFood.sz) / 100 : chosenFood.x});
          }
          else {
            let tunPos = getTunPosition(chosenFood);
            if (tunPos) {
              goToLocation(ant, {n: 'bot', tun: tunPos.tun.id, pc: tunPos.pc, pos: 'dn'});
              antFinna(ant, 'eat', {id: chosenFood.id, t: 'flesh', pref: pref, Q: action.Q});
            }
          }
          action.Q && antFinna(ant, 'get', {...chosenFood, id: chosenFood.id + ant.id, Q:action.Q, pref: pref});
        }
      }
      antNext(ant);
    }
  },

  // Ant drink action.
  drink: (ant, farm = getFarm(ant), action = ant.q[0], drink = farm.items.find(i => i.t == 'drink' && i.sz > 0)) => {
    if (action.id && drink) {
      // Ant has reached the target drink.
      setTimeout(X => {
        if (drink = farm.items.find(i => i.id == action.id && i.sz > 0)) {// Got to recheck here incase the drink got removed/exhausted.
          drink.sz -= .2;
          !action.Q && antStats(ant, {dr: 9, md: .5, hp: .5});
          (ant.dr < 80 && !action.Q && ant.q.length < 2 && !randomInt(1) ? antAction : antNext)(ant); // Whether to go again or move on.
        }
        else antNext(ant);
      }, standardDelay + randomInt(standardDelay));
    }
    else {
      if ((ant.dr < 90 || action.Q) && drink) {
        goToLocation(ant, {n: 'top'});
        antFinna(ant, 'drink', {id: drink.id, Q: action.Q, tx: parseInt(drink.x) + 2 + randomInt(46)});
        action.Q && antFinna(ant, 'get', {...drink, id: drink.id + ant.id, Q: action.Q});
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
  //@tODO use the logic from 'srv' to get closer.
  get: (ant, farm = getFarm(ant), action = ant.q[0], queen = action.Q && getAnt(farm, action.Q)) => {
    action.f = ant.f;
    ant.carry = action;
    action.t == 'egg' && del(getEgg(farm, action.id), 'tun'); // Remove tun prop for carried eggs.
    carryDraw(action, ant);
    if (queen) {
      // Feed a queen.
      antGoToAnt(ant, assign(antHeadPoint(queen), {f: queen.f, area: queen.area}))
      antFinna(ant, 'srv', action);
    }
    else action.q.forEach(q => ant.q.push(ant, q)); // Must be an egg, inf, or dead ant.
    antUpdate(ant); // Update ant immediately so they can visually 'grab' the object.
    ant.run = .6;
    antNext(ant, pauseDelay);
  },

  // Ant goes on a mission to feed the queen.
  srv: (ant, farm = getFarm(ant), action = ant.q[0], queen = getAnt(farm, action.Q)) => {
    if (queen) {
      // Q selected; confirm queen is alive.
      if (livesInFarm(queen)) {
        // Has ant really reached the queen's head?
        if (!antInTargetProximity(ant, antHeadPoint(queen), antOffsetX(ant) + 2)) {
          // Ant too far from queen's face.
          ant.area.t == queen.area.t && getTun(farm, ant.area.t)?.t == 'cav' ?
            antInstaQ(ant, {act: 'tunOrient', target: antHeadPoint(queen), ant: queen.id}) : antGoToAnt(ant, assign(antHeadPoint(queen), {area: queen.area, f: queen.f}));
          antFinna(ant, 'srv', action);
          return antNext(ant);
        }
        // Reached the queen.
        if (ant.carry) {
          // Update stats based on what the queen is probably being given.
          // The 'md' boost is a bit higher than in 'eat' and 'drink' actions because queen has servants.
          action.t == 'drink' ? antStats(queen, {dr: 9, md: 2, hp: .5}) : antStats(queen, {fd: action.t == 'flesh' ? 60 : action.pref ? 12 : 3, md: action.pref ? 6 : 2, hp: 1});
          // Worker ant is happier.
          antStats(ant, {md: 9});
        }
        // Animate the exchange.
        [queen, ant].forEach(a => {
          antUpdateClasses(a, {dig: 1});
          setTimeout(X => antUpdateClasses(a, {dig: 0}), pauseDelay);
        });
      }
      // Delete this regardless of whether the queen was fed, otherwise ant could carry forever.
      carryUndraw(ant.carry);
      del(ant, 'carry');
      // Pause here for a bit (slightly longer than the animation above).
      antNext(ant, pauseDelay + randomInt(shortDelay));
    }
    else {
      // No queen selected yet.  Pick the one with the lowest stats.
      if (!antUniqueActs(ant).includes('get') && (queen = farm.a.filter(a => isQueen(a) && livesInFarm(a)).sort((a, b) => (a.fd + a.dr) - (b.fd + b.dr))[0])) antFinnaVia(ant, queen.fd < queen.dr ? 'eat' : 'drink', {Q: queen.id}); // Go to the appropriate item.
      antNext(ant);
    }
  },

  // Queen's special rest function - queen goes to her favourite spot first.  Also initiates egg-laying.
  kip: (ant, farm = getFarm(ant), nests = [...new Set(farm.a.filter(a => a.nest).map(a => a.nest))], antCount = farm.a.length) => {
    // Try pick a nest if there's a suitable one and/or send to the nest.
    if (getTun(farm, ant.nest)?.morgue) ant.nest = 0;
    (ant.nest ||= pickRandom(farm.tuns.filter(t => t.t == 'cav' && t.dun && !t.nip && !t.morgue && t.co.length < 2 && !nests.includes(t.id)))?.id)
      && goToLocation(ant, makeDiveStub({tun: ant.nest, pc: 20 + randomInt(60), pos: 'dn'}));
    antFinna(ant, 'rest');
    // Queue egg laying if no eggs in the nest, not overpopulated, and random chance passed with respect to various factors.
    // Note: The 'lay' action will protect from laying if something went wrong in the queue and she's not in a cav, and actually has a high chance of requeueing another dive/lay cycle.
    ant.hp> 40 && !farm.e.length && antCount < 40 && !random(num1000 * Math.ceil(antCount / 30) - (farm.fill == 'lube' ? deg360 : 0) - (farm.a.some(a => isDrone(a) && livesInFarm(a)) || antCount < 9 ? deg360 : 0)) && antFinna(ant, 'lay');
    antCount> 39 && playerHint(farm, ["Queen won't lay eggs due to overpopulation."]);
    // Note: free ant spawning stops at 25 ants, ant vials disallow use at 30, and laying stops at 40.  This seems like a decent progression allowance.
    antNext(ant);
  },

  // Queen lays eggs.
  lay: (ant, farm = getFarm(ant), action = ant.q[0], lvl = action.lvl || 0, laid = action.laid || 0, tunPos = getTunPosition(ant), eggLvlCount = farm.e.filter(e => e.lvl == lvl && e.tun == tunPos.tun).length,
    tun = tunPos?.tun, eggSize = tunPercent(tun, 5), egg = {
      id: ant.id + getTime(),
      Q: ant.id,
      t: ant.t,
      f: ant.f,
      caste: randomInt(6) ? 'W' : 'D',
      dur: 0,
      ts: getTimeSec(),
      tun: tunPos?.tun,
      pc: tunPos?.pc,
      r: randomInt(deg180),
      hp: 99,
      scale: randomSign()
    }) => {
    if (ant.hp < 50) {
      antFinna(ant, 'kip');
      antFinna(ant, 'lay');
    }
    if (tunPos && tun.t == 'cav' && !tun.nip && !tun.morgue && ant.pose == 'side' && antInTargetProximity(ant, cavFloor(tun, tunPos.pc), 2 * antOffsetY(ant))) {// Layable tunnel and position.
      if (tunPos.pc < 20 || tunPos.pc> 80 || farm.e.some(e => e.tun == tun.id && e.lvl == lvl && abs(e.pc - tunPos.pc) < eggSize) // Check there is no egg occupying current space
        || (farm.e.some(e => e.tun == tun.id && e.lvl == lvl) && !farm.e.some(e => e.tun == tun.id && e.lvl == lvl && abs(e.pc - tunPos.pc) < eggSize * 1.4)) // Check it is right next to an existing egg or there is no other egg
        || lvl && farm.e.filter(e => e.tun == tun.id && e.lvl == lvl - 1 && abs(e.pc - tunPos.pc) < eggSize).length < 2) {// Check there are two supporting eggs to stack an egg on.
        // Can't lay here, walk a bit and try again.
        antFinna(ant, 'dive', {tun: tun.id, pc: tunPos.pc + randomInt(eggSize) * (tunPos.pc < 20 ? 1 : tunPos.pc> 80 ? -1 : randomSign()), pos: 'dn'});
        randomInt(num500) && antFinna(ant, 'lay', {laid: laid, lvl: lvl}); // There's also a random small chance (about once every 4 hours) that she'll give up laying here altogether to avoid permanent deadlock.
      }
      else {
        while ((eggLvlCount > 6 - (lvl * 2) || randomInt(4)) && eggLvlCount < 16 - (lvl * 2)) lvl++; // Go up a level when there are lots of eggs on the current level.
        egg.lvl = lvl;
        // Animate.
        antUpdateClasses(ant, {pose: 'pick', jit: 1});
        setTimeout(X => {
          ant.pose = 'side'; // Note: Don't need antToSideWithCorrection() here because this is just resetting to 'pose' from 'pick', and NOT from 'prone' pose.
          antRemAnimUpdate(ant);
          // Lay an egg.
          farm.e.push(egg);
          eggDraw(egg);
          antStats(ant, {hp: -9, fd: 2, dr: 2, md: 2}); // Increase chance of queen being forced to sleep between eggs.  Queens self-feed during this time.
          (laid < 8 || randomInt(8)) && laid < 26 && lvl < 4 && antFinna(ant, 'lay', {laid: ++laid, lvl: lvl}); // If eggs aren't stacked too high, loopback to laying.
        }, pauseDelay);
      }
    }
    if (laid < 10 && farmIsDeveloping(farm) && !antUniqueActs(ant).includes('lay') && randomInt(2)) {
      // Queen did not lay eggs or not enough eggs, and the logic above did not queue up any more laying.  Take a high chance to remind her to pop a few more out, even elsewhere.
      antFinnaVia(ant, 'dive', {pos: 'dn', n: 'bot'});
      antFinna(ant, 'lay', {laid: laid});
    }
    antNext(ant, shortDelay + randomInt(standardDelay));
  },

  // Ant carries an egg, infant, or a dead ant to another location.
  carry: (ant, farm = getFarm(ant), action = ant.q[0], pkg = (action.t == 'egg' ? getEgg : getAnt)(farm, action.id), nipData = pkg && getById(farm.nips, pkg.moveTo)) => {
    if (pkg && antInTargetProximity(antHeadPoint(ant), pkg, antOffsetX(ant)) && !farm.a.some(a => a.id != ant.id && a.carry == action.id)) {
      if (action.t == 'dead') {
        antGoToAnt(ant, pkg);
        let morgueTun = farm.tuns.find(t => t.morgue),
          morguePos = morgueTun.rwip ? 95 - randomInt(15) : 80 + randomInt(15);
        antFinna(ant, 'get', assign(action, {q: [{act: 'dive', tun: morgueTun, pc: morguePos}, {...{action}, act: 'drop'}]}));
      }
      else if (pkg.moveTo)
        nipData ? antFinna(ant, 'get', assign(action, {q: [{act: 'nip', nip: nipData.nip}, {...{action}, act: 'drop'}]})) : del(pkg, 'moveTo'); // Pass in a nip action or remove stale flag.
      else {
        antFinnaVia(ant, 'dive', {tun: pkg.id, pc: pkg.pc, pos: 'dn'});
        antFinna(ant, 'get', assign(action, {q: [{act: 'dive', tun: getById(farm.a, pkg.Q).nest}, {...{action}, act: 'drop'}]}));
      }
    }
    antNext(ant);
  },

  // Drop a carried item.  Carefully though.
  drop: (ant, farm = getFarm(ant), action = ant.q[0], isEgg = action.t == 'egg', pkg = (isEgg ? getEgg : getAnt)(farm, action.id), tunPos = getTunPosition(ant), tun = tunPos?.tun) => {
    if (tun) {
      if (isEgg) antUpdate(assign(pkg, {tun: tun.id, pc: action.pc, ...cavFloor(tun, action.pc)}));
      else {
        let eggSize = tunPercent(tun, 5),
          spotFinder = (lvl = 0, levelEggs, egg, offset, pc) => {
            for (; lvl < 4; lvl++) {
              levelEggs = farm.e.filter(e => e.tun == tun.id && e.lvl === lvl).sort((a, b) => a.pc - b.pc);
              for (egg of levelEggs) {
                for (offset of [-eggSize, eggSize]) {
                  pc = egg.pc + offset;
                  if (pc > 20 && pc < 80 && !farm.e.some(e => e.tun == tun.id && abs(pc - e.pc) < eggSize) &&
                    (!lvl || farm.e.filter(e => e.tun == tun.id && e.lvl === lvl - 1).filter(e => abs(pc - e.pc) < eggSize).length> 1) &&
                    (!levelEggs.length || levelEggs.some(e => abs(pc - e.pc) < eggSize))) return {pc, lvl};
                }
              }
            }
          },
          // spotFinder() is different from how the queen picks a spot to lay, as she uses a slow trial-and-error approach, whereas spotFinder() works out a good spot to drop.
          newSpot = spotFinder();
          if (newSpot) {
            // Found a spot.
            if (abs(tunPos.pc - newSpot)> tunPercent(tun, antOffsetX(ant))) {
              // Too far away!
              antFinna(ant, 'dive', {tun: tun.id, pc: newSpot.pc, pos: 'dn'});
              antFinna(ant, 'drop', action);
              return antNext(ant);
            }
            else eggUpdate(farm, assign(pkg, {tun: tun.id, pc: newSpot.pc, lvl: newSpot.lvl}));
          }
          else {
            // No spots.  Egg will be dropped here anyway, but we'll tell the queen her nest sucks.  This may cause ants to keep moving nest, fun!
            getAnt(farm, pkg.Q).nest = 0;
            eggUpdate(farm, assign(pkg, {tun: tun.id, pc: tunPos.pc, lvl: 0}));
          }
      }
    }
    // Note: If it's not in a tun I suppose they'll just leave it where it is.  Add more code here if that looks silly!
    carryUndraw(ant.carry);
    del(pkg, 'moveTo');
    del(ant, 'carry', 'run');
    antNext(ant);
  },

  // Ant goes on a mission to care for an egg or infant.
  care: (ant, farm = getFarm(ant), action = ant.q[0], isEgg = action.t == 'egg', pkg = (isEgg ? getEgg : getAnt)(farm, action.id)) => {
    if (pkg && antInTargetProximity(antHeadPoint(ant), pkg, antOffsetX(ant))) {
      // At the target.
      isEgg ? pkg.hp += 2 : antStats(pkg, {hp: 2, fd: 2, dr: 2, md: 2});
      antUpdateClasses(ant, {dig: 1});
      setTimeout(X => antUpdateClasses(ant, {dig: 0}), shortDelay);
      return antNext(ant, shortDelay + randomInt(shortDelay));
    }
    else if (ant.q.length < 2) care4kids(farm, ant); // Try again if ant has nothing to do.
    antNext(ant);
  },

  // Ant nips off to a nip.
  nip: (ant, farm = getFarm(ant), action = ant.q[0], id = action.id, nip = action.nip, idOrNip = id || nip, tun = id ? getTun(farm, action.tun) : farm.tuns.find(t => t.nip == nip),
    nipData = farm.nips.find(n => n.nip == idOrNip), nipItem = nipData?.item, isTop = idOrNip > 2, isLeftSide = idOrNip % 2 > 0, antX = antFaceX(ant), rev = action.rev) => {
    if (nipItem && rev) {
      // Entering farm from a nip area.
      if (isLeftSide ? antX < 20 : antX> 940) {
        antSetWalk(ant);
        if (ant.carry) {
          antUpdate(ant); // Correct x/y pos of carried items.
          // Walk to a random spot and drop.
          antFinna(ant, isTop ? 'pace' : 'dive', {for: randomInt(num500)});
          antFinna(ant, 'drop', ant.carry);
        }
        if (isTop) {
          ant.scale = getSign(isLeftSide);
          antMoveSurface(ant); // Top area.
        }
        else {
          // Tunnel
          antToProneWithCorrection(ant, tun);
          // This actually calculates a tunPoint 20px from the end.
          let tunPoint = isLeftSide ? {x: tun.x1, y: tun.y1} : {x: tun.x2, y: tun.y2},
            dist = calcDistComponents(tun.x1, tun.y1, tun.x2, tun.y2),
            offset = getSign(isLeftSide) * 20;
          ant.r = getAngle(ant, {x: tunPoint.x + dist.x * offset, y: tunPoint.y + dist.y * offset});
          antMoveTunnel(ant);
        }
        antAction(ant);
      }
      else antNextStill(ant); // All done.
    }
    else if (nipItem && id && !nipItem.a.some(a => a.t != ant.t)) {
      // Exiting farm into a nip area.
      if (isLeftSide ? antX > -25 : antX < 985) {
        antSetWalk(ant);
        if (isTop) antMoveSurface(ant); // Top area.
        else {
          // Tunnel
          antToProneWithCorrection(ant, tun); // It's a copout, but I'm not going through the whole waypoint saga here.
          ant.r = getAngle(ant, isLeftSide ? {x: tun.x1, y: tun.y1} : {x: tun.x2, y: tun.y2}); // Ant hasn't reached the tunPoint yet, so force the angle.
          antMoveTunnel(ant);
        }
        antAction(ant);
      }
      else {
        // Done! Move ant into "nip item space".
        let nipEl = getEl('a-' + nipIds[id]);
        transferObject(farm, 'a', ant, farm, nipItem, {x: -25, y: 28 - antOffsetY(ant), state: nipItem.k, f: farm.id, q: []}, nipEl);
        setColonyAndFoe(farm);
        if (isQueen(ant)) {del(ant, 'nest'); [...farm.e.filter(e => e.Q == ant.id), ...farm.a.filter(a => a.Q == ant.id)].forEach(b => b.moveTo = id)};
        save();
        nipItem.k == 'vial' ? vialActivity(ant) || vialLoop() : tubeWalker(farm, nipData, ant) || tubeLoop();
      }
    }
    else {
      // Setup.
      if (nipItem && nip) {
        if (!ant.carry || !['food', 'drink', 'ant'].includes(getCarry(farm, ant.carry).t)) {
          isTop ? goToLocation(ant, {n: 'top'}) : goToLocation(ant, {n: 'bot', tun: tun.id, pc: 100 * !isLeftSide + getSign(isLeftSide) * tunPercent(tun, 25 - randomInt(20))});
          antFinna(ant, 'nip', {id: nip, tun: tun?.id, tx: isLeftSide ? 1 : 959}); // note: tx and tun are only used in their own respective areas.
        }
      }
      else if (ant.carry) antFinna(ant, 'drop', ant.carry); // Ant was carrying something to a nip, but nip is not there.
      antNext(ant);
    }
  },

  // Prepare ant for antDeath().
  die: (ant, action = ant.q[0]) => {
    if (ant.carry || ant.nipPh) {
      // This is no time to die. Requeue this action.
      antFinna('die', action);
      antNext(ant);
    }
    else {
      if (ant.area.n == 'top') ant.y = antGroundLevel(ant, 0); // Ant is at the top, need to adjust it to ground level.
      if (ant.area.n == 'bg') antInstaQ(ant, [{act: 'slip'}, action]) && antNext(ant); // Ant is on the bg, let's have it drop off first.  Can't use antSlip() here because it will forget to die.
      else if (ant.area.t && ant.pose == 'prone' && !ant.slip) antInstaQ(ant, [{act: 'tunSlip'}, action]) && antNext(ant);
      else antDeath(ant, action.r);
    }
  },

  // Fight.
  // Ant is "ant" in it's own loop, and it is the "ant2" for one or more other ants.
  fight: (ant, farm = getFarm(ant), ant2 = getAnt(farm, ant.q[0].ant),
    cancelFight = !ant2 || deadInFarm(ant2) || !antUniqueActs(ant2).includes('fight') || ant.area.n != ant2.area.n || !antInTargetProximity(ant, ant2, 64) || farm.coex,
    endFight = X => antRemAnimUpdate(ant) && fightSongCheckAndStop()) => {
    // Fight in prone pose.  Note: antGetStill() slipped in here to avoid setting walk=0 in this block of code.
    if (antGetStill(ant).pose == 'side') ant.area.t ? antToProneWithCorrection(ant, getTun(farm, ant.area.t)) : (ant.pose = 'prone', antProneCorrection(ant));
    // Make ant point at foe.  Don't worry about animating this rotation.
    if (!cancelFight) ant.r = normalize360(antToTargetAngle(ant, ant2));
    // Weak ant might slip off the bg if the fight is there.  Or cancelFight is set.
    if (cancelFight || ant.hp < 10 && ant.area.n == 'bg' && !randomInt(3)) {
      // Quit fighting.
      endFight();
      cancelFight ? antNext(ant) : antSlip(ant);
    }
    else if (ant.hp <= 0) {
      endFight();
      ant.wig = 1;
      antFinna(ant, 'die', {r: 'fight'});
      setTimeout(X => {ant.wig = 0; antNext(ant)}, standardDelay);
    }
    else if (!antInTargetProximity(ant, ant2, antOffsetX(ant) + antOffsetX(ant2))) {
      // Get closer to foe.
      antTakeProneStep(ant);
      antAction(ant);
    }
    else {
      !fightSong && currentFarm(farm) && fightSongPlay(); // Play fight music if not already playing.
      ant.fight = ant.dig = ant.jit = 1;
      ant.thotD = ant.thotD < 7 ? 7 : ant.thotD + 1; // Change thoughts faster.
      // Ant strength is determined by a combo of factors.
      // Decrease foe ant's hp by the strength.
      ant2.hp -= clamp(ant.hp / 100, .5, .8) // Base strength is health, but doesn't drop below 50 or go above 80 to keep it fairer.
        * (antGetSize(ant) == 's' ? .8 : (['l', 'x'].includes(antGetSize(ant)) ? 1.2 : 1))  // Adjust strength by size.
        * (ant.b ? 1.3 : 1) // Biters have extra oomph.
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
goToLocation = (ant, location) => antFinnaVia(ant, location.n == 'bg' ? 'crawl' : location.n == 'top' ? 'pace' : 'dive', location),

// Requests an ant to walk to where another ant was at the time of the request.  Nothing is guaranteed.
// Should silently fail when 'ant' is missing.
antGoToAnt = (ant, destAnt, location = {n: destAnt.area.n}) => {
  if (location.n == 'bg') {
    location.x = destAnt.x;
    location.y = destAnt.y;
  }
  if (location.tun = destAnt.area.t) location.pc = getTunPosition(destAnt)?.pc; // Note: assignment in condition on purpose.
  goToLocation(ant, location);
  location.n == 'top' && antFinna(ant, 'pace', {tx: destAnt.x});
},

// Rates the current farm as to whether it is styling.
// Returns 0 on fail, and a positive integer with the score on pass.  Never demand players to score more than a 2 to get full benefits.
farmFlairScore = farm => max(0, farm.items.filter(i => i.t == 'scenery').length + farm.decals.length / 2 + (farm.card ? .5 : 0) - 1),

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

// Determines if the current farm has any queens.
farmHasQueen = farm => farm.a.some(a => isQueen(a) && livesInFarm(a)),

// Determines if an egg or infant can upgrade to the next phase.
canUpgrade = (pkg, day = 1) => pkg.tun && pkg.hp > 90 && !randomInt(pkg.dur > 8640 * (1 + day) ? 50 : num500) && pkg.dur > 8640 * day,

// Directs farms by running checks every 30 seconds.
// Adds deliberate tasks to the ants' finna queues so the action loops aren't responsible for checking everything.
// Also updates ants stats, autosaves, updates food & drink display, checks achievements, updates ant thoughts.
director = X => {
  _.farms.forEach(farm => {
    timeLog(farm); // Update duration.
    setTimeout(X => farm.a.forEach(ant => {
      timeLog(ant); // Update duration.
      // Update corpse or handle living ant.
      deadInFarm(ant) ? updateCorpseState(ant) : setTimeout(X => {// Perform a chunk of this without overloading the main thread with heaps of these at once.
        // Decrement stats.
        antStats(ant, {fd: -.05, dr: -.1, md: -.05, hp: -.1});
        !ant.area.t && antStats(ant, {md: farmFlairScore(farm) / 20}); // Boost mood stat based on presence of scenery (when not in tunnels).
        // Decrement hp stats based on other stats.
        antStats(ant, ant.fd <= 0 || ant.dr <= 0 ? {hp: -9, md: -2} : ant.fd < 9 || ant.dr < 9 ? {hp: -.05, md: -.05} : {hp: ant.md < 9 ? -.05 : -.01});
        // Detect hunger/thirst deaths.
        if (ant.hp <= 0 && !ant.fight) {
          if (ant.fd <= 0) antFinna(ant, 'die', {r: 'hunger'});
          else if (ant.dr <= 0) antFinna(ant, 'die', {r: 'thirst'});
          // Note: 'fight' and 'other' deaths should be handled elsewhere.
        }
        // Ant tries to nourish from fill material if they are in a tunnel.
        ant.area.t && fillRefectory(ant);
        // Cap ant's mood at the maximum its ant type can have.
        ant.md = min(ant.md, types[ant.t].m || 100);
        //
        if (ant.fight) {
          let reinforcementAnt = pickRandom(farm.a.filter(a => livesInFarm(a) && !a.fight && (isWorker(a) || !randomInt(4))));
          reinforcementAnt && !randomInt(2) && antGoToAnt(reinforcementAnt, ant);
        }
        // Curb major problems.
        ant.dr < 9 && antFinnaUnique(ant, 'drink');
        ant.fd < 9 && antFinnaUnique(ant, 'eat');
        ant.hp < 9 && antFinnaUnique(ant, 'rest', {n: 1}); // n:1 means "do it anywhere" since antFinnaUnique() passes through to antFinnaVia().
        if (antUniqueActs(ant).every(a => ['crawl', 'pace', 'dive', 'tunWalk', 'rotWalk'].includes(a))) {
          // Ant is "defaulting".
          setTimeout(X => {// This is a random timeout because it looks super sus if several ants make a decision at the same time.
            if (isWorker(ant) && !randomInt(3) && (!farmIsDeveloping(farm) || farmHasQueen(farm)) && farm.a.filter(a => a.digD).length < 3) antFinnaVia(ant, 'dig'); // Curb slack workers problem.
            else if (!randomInt(5)) antFinnaVia(ant, pickRandom(acts[ant.area.n].filter((task, i) => i > 0 && !{Q: ['dig', 'rest'], D: ['dig']}[ant.caste]?.includes(task))), {n: ant.area.n}); // Randomly pick a non-default action.
            else if (!randomInt(5)) antFinnaUnique(ant, 'dive'); // Increase chance of ants diving.
            else if (!randomInt(5)) antFinnaUnique(ant, 'crawl'); // Increase chance of ants crawling.
          }, randomInt(shortDelay * 2));
          // Hints for player.
          ant.md < 25 && !farmHasQueen(farm) && playerHint(farm, ['Comrade, the workers are restless. They have no queen.', 'The absence of a queen is going to become a problem.']);
          ant.md < 20 && !farmFlairScore(farm) && playerHint(farm, ['Some of your ants are complaining about the lack of scenery and decor.', "This farm doesn't have flair, the ants would like some decorations."]);
          // Randomly go to vial.
          let randomNip = pickRandom(farm.nips);
          if (randomNip && !farm.foe && !randomInt((farm.dun ? 90 : farmIsDeveloping(farm) ? 120 : deg180) - (farm.items.some(i => i.t == 'food' && i.sz > 0) ? 0 : 30) - (farm.items.some(i => i.t == 'drink' && i.sz > 0) ? 0 : 40))
            && antFinnaUnique(ant, 'nip', {nip: randomNip.nip}));
        }
      }, 1);
      setTimeout(X => {// Delay a chunk so the director function doesn't intefere with the displayed farm too much.
        if (ant['inf'] && canUpgrade(ant, ant['inf'])) {
          // Infant upgrader.
          let infantClasses = objGetEl(ant).classList, infantAnims = ['a1', 'a2', 'a3'];
          if (++ant['inf'] > 4) {
            del(ant, 'inf', 'moveTo');
            ant.state = 'cap';
            !randomInt(9) && (ant.scale *= -1);
            infantClasses.remove(...infantAnims);
            antAction(ant);
            isDrone(ant) && _.man++;
          }
          else infantClasses[pickRandom(['add', 'remove'])](pickRandom(infantAnims));
          antUpdate(ant);
        }
        else if (isQueen(ant)) {
          // Extra handling for Queens.
          if (!farmIsDeveloping(farm) && !farm.a.filter(a => isWorker(a)).length && ant.q.length < 2 && !randomInt(3)) antFinnaUnique(ant, 'dig'); // A queen without workers may dig a nest to start a colony.
          else if (!isQueenAwaiting(ant) && ant.fd < 90 || ant.dr < 90)
            antFinnaUnique(pickRandom(farm.a.filter(a => isWorker(a) && !a.carry && a.q.length < 9 && !hasCarryTasks(a))), 'srv'); // Reduces the possibility of a queen having to eat or drink by herself.
          else if (ant.hp < 95 && ant.q.length < 2 || ant.hp < 80) antFinna(ant, 'kip');
          // Being a queen takes an extra toll.
          antStats(ant, {fd: -.05, dr: -.05, hp: -.1, md: -.05});
          // Queen's presence boosts moodiest ant's MD.
          let sadAnt = farm.a.filter(a => a.caste != 'Q').reduce((min, a) => a.md < min.md ? a : min, 0);
          if (sadAnt) antStats(sadAnt, {md: .3});
          randomInt(2) && farm.a.filter(a => isWorker(a)).length < 3 && care4kids(farm, ant); // Farm with not enough workers?  Queen maybe performs an extra care task per cycle.
        }
        else if (isDrone(ant)) {
          // Being a drone takes an extra toll.
          antStats(ant, {fd: -.02, dr: -.02, hp: -.02, md: -.02});
          // Cap drone's HP lower and lower over time, making it harder to stay alive.
          ant.maxhp = ant.maxhp ? clamp(ant.maxhp - .01, 1, 99) : 99;
          ant.hp = min(ant.hp, ant.maxhp);
        }
      }, num500);
      // Update the ant's thoughts, but limit it to changing every 10th loop (~5 minutes) so as not to override thoughts, particularly those set within other functions, too soon.
      ant.thotD> 9 ? antThot(ant) : ant.thotD++;
    }, 0));
    setTimeout(X => {// Delay these extra bits to not perform everything all at the same time.
      farm.e.forEach(e => {
        // Decrease egg stats.
        e.hp -= .3;
        timeLog(e); // Update duration.
        if (e.hp <= 0) eggDelete(e); // Remove dead egg.
        else if (canUpgrade(e)) {
          // Egg can upgrade.
          // @TODO look into eggs and infants and make sure they have a ".area" property that gets properly updated!
          let floorCoord = cavFloor(getTun(farm, e.area.t), e.pc), infant = assign(createAnt(farm, floorCoord.x, floorCoord.y, e.r, 'inf', e.caste, e.t), {
            Q: e.Q, // Mark the infant's mother.
            scale: randomSign(),
            f: farm.id,
            dur: 0,
            ts: getTimeSec(),
            thot: pickRandom(["🧩🔒⏳", "🙂💡🚫", "🐢✨🚗", "🎎💁🍛"]),
            thotD: 1,
            inf: 1,
          });
          eggDelete(e);
          currentFarm(farm) && antDraw(infant);
        }
      });
      // Look for dead ants or eggs and see if any need to be carried somewhere.
      if (farm.a.some(deadInFarm) || farm.e.length) trySetCarryTask(farm);
      // Look for infants and eggs and see which one needs to be cared for next.
      if (farm.a.some(a => a['inf']) || farm.e.length) care4kids(farm);
    }, num2000);
  });
  updateFoodAndDrink();
  save();
  checkAchievements(1); // Check if game is almost in a winning state.
},

// Checks if an achievement has been reached.
// Note: Some achievements only check the currently focused farm, that's fine it makes more sense that way.
checkAchievements = (countWins, count = 0,
    // Define three-level achievement funtions, these return the current count of whatever we're counting.
    multiAch = {
      blood: X => max(...values(F.a.filter(livesInFarm).reduce((acc, ant) => (acc[ant.t] = (acc[ant.t] || 0) + 1, acc), {}))),
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
      kweens: X => F.a.filter(a => isQueen(a) && livesInFarm(a) && (a.t == F.t || F.coex)).length > 1,
      progeny: X => farmIsDeveloping(F) && !F.stats['cap'],
      drag: X => _.dq,
      hb: X => F.stats.death.other > 9,
      day: X => F.dur > 86400,
      weak: X => F.dur > 604800,
      mom: X => _.win,
    },
    achKey
  ) => {
  if (countWins) {
    // Checks if game is almost in a winning state.
    for (achKey in multiAch) if (!_.ach[achKey] || _.ach[achKey].l != 3) count++;
    for (achKey in singleAch) if (!_.ach[achKey]) count++;
    if (count === 1) drop('mom');
    else if (!count && !_.dmb) popup('win');
  }
  else {
    for (achKey in multiAch)
      if (!_.ach[achKey] || _.ach[achKey].l < 3) {
        _.ach[achKey] = _.ach[achKey] || {l: 0, v: 0};
        let newCount = min(9, multiAch[achKey]()), newLvl = min(3, floor(newCount / 3));
        if (newCount> _.ach[achKey].v) {
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
  _.achQ.length && popup('ach', 0, shortDelay);
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
        (temp.innerHTML = foodCode(i), temp.style.bottom = getHillHeight(parseInt(i.x) + 25) + 'px', temp.style.transform = `rotate(${antHillAngle({x: i.x, scale: 1, f: F.id})}deg)`) :
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
    if (hasFocus()) {
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
  scroller ||= setInterval(scrollMessages, num2000);
},

// Removes the oldest message.
removeMessage = (msgEl = getEl('messages')) => {
  msgEl.firstChild.classList.add('rm');
  setTimeout(X => {msgEl.firstChild && msgEl.removeChild(msgEl.firstChild); !showMsgs && displayMessage()}, num500);
  if (!messages.length) scroller = stopInterval(scroller);
},

// Keeps the messages scrolling.
scrollMessages = (lastmsgEl = getEl('messages').firstChild) => hasFocus() && lastmsgEl && getTime() - parseInt(lastmsgEl.dataset.ts) > 12000 && removeMessage(),

// Adds a message to the array.
msg = (txt, type = 'status') => messages.push({msg: txt, t: type}) && !showMsgs && displayMessage(),

// Displays random messages, with message flood protection.
randomMsg = (msgs, isJoke = 0, i = 0, randMsg) => {
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
        randomMsgs.length> 10 && randomMsgs.shift();
        // Break as a message has been successfully chosen.
        break;
      }
    }
    // No unique message found after 3 attempts - do nothing further.
},

// Randomly shows a joke message.
joker = (i = _.farms.filter(farmIsRunning).length - 1) => {
  randomMsg(jokes[i < 5 ? max(0, i) : 0], 1);
  setTimeout(joker, randomInt(longDelay) + longDelay);
},

// Outputs a warning msg, but only if one from the same set hasn't been shown recently, and only if it's for the current farm.
playerHint = (farm, msgs) => {
  while (warnings[0] && warnings[0][1] < getTime() - longDelay) warnings.shift();
  if (hasFocus() && !warnings.some(w => w[0] == msgs.join(';'))) {
    if (currentFarm(farm)) {
      msg(pickRandom(msgs), 'warn');
      warnings.push([msgs.join(';'), getTime()]);
    }
    else {
      playerHint(F, [`"${farm.n}" (${getFarmDesc(farm)}) needs attention!`]);
      setTimeout(X => playerHint(farm, msgs), shortDelay);
    }
  }
},

// Handles the common audio playing functionality between ambience() and ambienceOverride().
bgAudioPlay = (audioFile, volInc, delay, audio = getEl('audio')) => {
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
  bgAudioPlay(_.au || 'wind', .01, num500);
  document.removeEventListener('click', ambience);
},

// Override the bg audio.  This code assumes it is being run in response to user interaction and does not check that.
// Calling code is responsible for resuming normal ambience() when done with this.
ambienceOverride = audioFile => bgAudioPlay(audioFile, .1, 5),

// Starts the fight song (if required).
fightSongPlay = X => {
  if (userClicked && !fightVolume) {
    fightSong = new Audio('audio/fight.opus');
    fightSong.volume = .001; // Don't start at zero so as to block successive calls to this func.
    fightSong.loop = 1;
    // Fade in, but try to keep the volume of fight song 10% lower than global volume so it is hardly audible at lowest volume setting.
    fightVolume = setInterval(X => {fightSong.volume + .1 < _.vol / 100 ? fightSong.volume = min(fightSong.volume + .01, 1) : stopInterval(fightVolume)}, 5);
    fightSong.play();
    randomMsg([['Two rival ants are fighting!'], ['Ants are having a fight!'], ['An ant is fighting an enemy!'], ['A fight has broken out!'], ['One of your ants is battling a foe!']]);
  }
},

// Stops the fight song (if required).
fightSongCheckAndStop = X => {
  if (fightSong && F.a.every(ant => !ant.fight)) {
    stopInterval(fightVolume);
    fightVolume = setInterval(X => {fightSong.volume > 0 ? fightSong.volume = max(0, fightSong.volume - .01) : (fightSong.pause(), fightSong = 0, stopInterval(fightVolume))}, frameTick);
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


///////////////////
// Load the app. //
///////////////////
window.addEventListener('load', antFarmSocial);

///////////////////
// Fix ants pos. //
///////////////////
window.addEventListener('focus', X => {
  F.a.forEach(antUpdate);
  F.nips.forEach(n => n.item.a.forEach(antUpdate));
});

///////////////////
// Resize trigs. //
///////////////////
window.addEventListener('resize', X => {
  getEl('wrapper').getBoundingClientRect(); // For the magnifier.
  tubeFollowLinkPosition(); // For the tube follow links.
});

///////////////////
// Save on exit. //
///////////////////
window.addEventListener('pagehide', save);

///////////////////
// Save predict. //
///////////////////
document.addEventListener('mousemove', e => {
  !e.clientY && save();
});


//@TODO anywhere that subtracts like - (something ? blah : 0)  can be - (something && blah)
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
    t: 'hydration',
    max: 1,
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
    sweet: 1,
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
    t: 'hydration',
    max: 1,
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
    desc: "I'm bulls hit proof.  Nothing to lose.<br>Fire-A-Way! Fire-A-Way!",
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
    nodrop: 1
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
    desc: `It's pronounced <em>chimera</em>.<br>But, go on…`,
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
  sculpt: {
    n: 'Metal Sculpture',
    desc: "",
    t: 'sculpt',
    lvl: 333,
    nodrop: 1
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
    ["How do you determine the gender of an ant?", "If it sinks: girl ant.", "If it floats…"],

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
    ["In Israel, researchers have studied the Tapinoma israele.","These ants are known for their highly efficient recruitment behavior.","When they discover a food source, they quickly recruit other members of their colony", "using chemical trails to lead them directly to the food.","What makes Tapinoma israele particularly interesting is their speed and coordination","with which they mobilize their colony compared to other ant species."," ","This has implications for the study of collective intelligence and swarm behavior","areas that are of great interest in fields like computer science and robotics.","Israeli researchers are exploring how ant foraging can inspire algorithms","for solving problems like optimizing routes in networks or coordinating robot swarms."],
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
    ['Do ants ponder the "ant-ropy" of their universe…', "…and their place within it?"],
    ["Is an ant that looks for knowledge on the meaning of life…", '…a true "ant-swer seeker"?'],
    ["If ants had a concept of ethics…", '…would they follow an "ant-ics" code?'],
    ["Do ants ever wonder if their tiny actions create…", '…"ant-icipated" consequences in the grand scheme of life?'],
    ["Can an ant ever escape its predetermined role…", '…or is it bound by "ant-tuition"?'],
    ["If an ant questions the nature of reality…", '…is it engaging in "ant-ology"?'],
    ['Is there an ultimate "ant-cestor"…', "…that all ants revere as the origin of their species?"],
    ["Do ants believe in the concept of free will…", '…or do they accept their "ant-omated" existence?'],
    ["If an ant philosopher wrote about love…", '…would it call it "ant-icipation"?'],
    ["Do ants have their own version of…", '…the "ant-theist" argument for the existence of a higher power?'],
    ["If an ant achieves great things…", '…does it ponder if it has fulfilled its "dest-anty"?'],
    ["When ants gather to discuss the mysteries of the universe…", '…do they hold an "ant-cient" symposium?'],
    ["Can an ant's search for knowledge…", '…be considered an "ant-ellectual" journey?'],
    ["If an ant believes in multiple lives…", '…does it wonder about its "ant-carnation"?'],
    ["Is an ant's journey through life…", '…guided by "ant-uition" or random chance?'],
    ["If ants had their own version of existential dread…", '…would they call it "ant-nihilation"?'],
    ["When an ant faces a moral dilemma…", '…does it seek advice from an "ant-agonist"?'],
    ["Ants are a microcosm of life in general and the co-dependency of all."],
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
    desc: "Feed rival ants to starved meat eaters.",
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
    desc: "A single queen wipes out an entire colony.",
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
    desc: "Keep a farm going for at least a day.",
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
      sick: 0,
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

// Actions that can be enqueued randomly.
// The first item in each list is the default action. There should always be a corresponding function in act[action].
acts = {
  'bg': ['crawl', 'uncrawl', 'rest'],
  'top': ['pace', 'dive', 'dig', 'crawl', 'rest', 'eat', 'drink'],
  'bot': ['dive', 'climb', 'rest'],
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
  html( // #kit
    html( // #wrapper
      mapJoin(nipIds.slice(1), nip => divc('nants ' + nip, {id: 'a-' + nip})) +
      html(
        html('', {id: 'card'}) +
        mapJoin(['scenery', 'food', 'hills'], id => divc('above', {id})) +
        html(divc('specks'), {id: 'fill', class: 'fill'}) +
        divc('fill', {id: 'tunnels'}),
        {id: 'farm', 'data-fill': 'none'}
      ) +
      html(
        divc('frost') +
        repeat(2, X => html(divc('ahole') + divc('ahole') + divc('ahole'), {class: 'ahole-set'})),
        {id: 'glass'}
      ) +
      html('', {id: 'decals'}) +
      html(
        html(html('', {id: 'lg'}) + html('', {id: 'lh'}), {id: 'loupe'}) +
        html(
          html('', {id: 'l-head'}) +
          html(
            html(span('', {class: 'txt'}) + span('🐜', {class: 'emo'}), {id: 'l-t', title: 'TYPE'}) +
            html(span('', {class: 'txt'}) + span('', {class: 'emo'}), {id: 'l-c', title: 'CASTE'}) +
            html(span('', {class: 'txt'}) + span('⌛', {class: 'emo'}), {id: 'l-d', title: 'TENURE'}) +
            html(span('', {class: 'txt'}) + span('', {class: 'emo'}), {id: 'l-a'}),
            {id: 'l-l'}
          ) +
          html(
            html(span('☣️', {class: 'emo'}) + span('', {class: 'bar'}), {id: 'l-rot'}) +
            html(span('🥀', {class: 'emo'}) + span('', {class: 'bar'}), {id: 'l-decay'}) +
            html(span('🍔', {class: 'emo'}) + span('', {class: 'bar'}), {id: 'l-fd'}) +
            html(span('🥤', {class: 'emo'}) + span('', {class: 'bar'}), {id: 'l-dr'}) +
            html(span('', {class: 'emo'}) + span('', {class: 'bar'}), {id: 'l-md'}) +
            html(span('💀', {class: 'emo'}) + span('', {class: 'txt'}), {id: 'l-re', title: 'DIED'}) +
            html(span('', {class: 'emo'}) + span('', {class: 'bar'}) + span('', {class: 'txt'}), {id: 'l-hp'}),
            {id: 'l-r'}
          ),
          {id: 'l-inf'}
        ),
        {id: 'l-wrap'}
      ) +
      divc('frame frame-l') +
      divc('frame frame-r') +
      divc('glow', {id: 'dropzone'}) +
      html(divc('hole frame') + divc('frame frame-t'), {id: 'lid'}) +
      divc('frame frame-b') +
      mapJoin(nipIds.slice(1), nip => html(divc('nipcap frame'), {id: nip, class: 'nip frame'})) +
      mapJoin(nipIds.slice(1), nip => html(html(html('') + html(span(repeat(3, X => span('►'))))), {id: 't-' + nip, class: 'toob ' + nip})),
      {id: 'wrapper', class: 'farm', 'data-col': 'green'}
    ) +
    html(
      html(divc('plate plate-l') + html(tag(1, 'ANT FARM SOCIAL', {id: 'n'})) + divc('plate plate-r'), {id: 'sign', class: 'plate'}) + html(divc('trim-inner'), {class: 'trim plate'}),
      {id: 'base', class: 'frame', 'data-col': 'green'}
    ),
    {id: 'kit'}
  ),

// HTML for ant.
antTemplate =
  html( // .ant
    divc('spot') +
    html( // .body
      html( // .body-mag
        html( // .body-wrap
          html(
            // Left legs
            repeat(3, X => html(divc('foot'), {class: 'leg'})),
            {class: 'legs legs-l'}
          ) +
          // Head
          html(
            divc('antenna') +
            divc('antenna') +
            divc('hat') +
            divc('c'),
            {class: 'head'}
          ) +
          // Torso & Rear
          divc('torso') +
          divc('rear') +
          // Right legs
          html(
            repeat(3, X => html(divc('foot'), {class: 'leg'})),
            {class: 'legs legs-r'}
          ) +
          // Wings
          html(
            divc('wing wing-l') +
            divc('wing wing-r'),
            {class: 'wings'}
          ),
          {class: 'body-wrap'}
        ),
        {class: 'body-mag'}
      ),
      {class: 'body'}
    ),
    {id: 'ant', class: 'ant'}
  ),

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

