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

// Leave this following line in!
/* [JS-SHRINK] */
// Leave that above line in!

// Main Globals
_ = 0, // app data
F = 0, // current farm alias
elCache = {}, // Element cache.
wayPoints = {}, // Tunnel waypoints
scroller = 0, // scroller interval
spawner = 0, // spawner interval
showMsgs = 0, // showMsgs flag
throbber = 0, // throbber interval
warper = 0, // warper interval
warpDirector = 0, // warpDirector interval
volumeUp = 0, // volumeUp interval
magnifier = 0, // magnifier interval
magInterval = 0, // another magnifier interval
carInterval = 0, // carousel interval
bagScroll = 0, // bag scroll position
userClicked = 0, // user clicked state indicator
spilled = 0, // spilled farm state indicator
vialInterval = 0, // vial animation interval
tubeInterval = 0, // tube animation interval
switcher = 0, // switcher flag

// These variables exist purely to support the developer panel.
dev = 0, // developer mode indicator
stopAnts = 0, // stop ants state indicator
dirInterval = 0, // director interval
stopMsgs = 0, // stopMsgs flag

// Common integers.
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

// Aliases for things that are in the form "something.something".  The first part isn't aliased because JS-SHRINK does that.
B = document.body,
PI = Math.PI, min = Math.min, max = Math.max, random = Math.random, floor = Math.floor, abs = Math.abs, sign = Math.sign,
sqrt = Math.sqrt, pow = Math.pow, round = Math.round, atan2 = Math.atan2, hypot = Math.hypot, sin = Math.sin, cos = Math.cos,
keys = Object.keys, values = Object.values, assign = Object.assign, entries = Object.entries,

// Convenience functions.
query = document.querySelector.bind(document),
queryAll = document.querySelectorAll.bind(document),
getEl = document.getElementById.bind(document),
getTime = Date.now,
getTimeSec = X => floor(getTime() / num1000),
appendHTML = (el, html) => el.insertAdjacentHTML('beforeend', html),
randomInt = mx => floor(random() * mx),
pickRandom = arr => arr[randomInt(arr.length)],
randomSign = (mag = 1) => pickRandom([-mag, mag]),
last = arr => arr.at(-1),
stopInterval = intvl => intvl && clearInterval(intvl),
cloneData = data => JSON.parse(JSON.stringify(data)),
getSign = val => val ? 1 : -1,
shuffle = arr => arr.sort(X => random() - .5),
clamp = (n, mn, mx) => min(max(n, mn), mx),
del = (obj, ...keys) => keys.forEach(k => delete obj[k]),
getById = (arr, id) => arr.find(i => i.id == id),

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
// Gets the angle beteen two precalculated delta values.
angleFromDelta = (dx, dy, offset = 0) => normalize360(radToDeg(atan2(dy, dx)) + offset),
// Gets the angle between two objects that have x/y props.
getAngle = (a, b, offset, r = angleFromDelta(b.x - a.x, b.y - a.y, offset)) => r || deg360,
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

// Mark load time, to fix a bug where reloading speeds up tunnel building.
loadTime = getTime(),

// Loads the app.
antFarmSocial = X => {
  // Adapt viewport to client's display.
  appendHTML(document.getElementsByTagName('head')[0], `<meta name="viewport" content="width=1180, height=1100, initial-scale=${min(screen.width / 1180, screen.height / 1100)}, user-scalable=no">`);
  // Fetch stored data.
  load();
  // Set correct background.
  setBg();
  // Add an event handler for the bag link.
  getEl('a-bag').addEventListener('click', X => popup('bag', 0, 0));
  // Add an event handler for the magnifying glass link.
  getEl('a-tg').addEventListener('click', toggleGlass);
  // Handle the score/stats popup button.
  getEl('score').addEventListener('click', X => popup('stats', 0, 0));
  // Add an event handler for the carousel link.
  getEl('a-car').addEventListener('click', toggleCarousel);
  // Create the free ant array, also clears any existing free ants stored in the data.
  _.a = [];
  // Check if loaded farms exist and set default if needed.
  !_.farms.length ? addFarm() : switchFarm(_.F);
  // Start ant activity.
  _.farms.forEach(farm => {
    updateWaypoints(farm); // Calculate waypoints.
    farm.a.forEach(ant => {
      ant.state == 'free' && antCap(ant, objGetEl(ant)); // Fix ants that didn't cop a cap before the last save().
      antAction(ant);
    });
  });
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
  dirInterval = setInterval(director, standardDelay);
  // Start ambient audio.
  document.addEventListener('click', ambience);
  // Activate message log button.
  setupMsgLog();
  // Set up the switch control panel.
  setupSwitcher();
},

// Retrieves all data from local storage.
// Note: Start at half volume so you can listen to a podcast while playing.
load = X => _ = JSON.parse(localStorage.getItem('_') || '{"score":0,"farms":[],"bag":[],"ach":{},"achQ":{},vol":50,"bg":"","grad":0,"sac":0,"arty":0,"scene":{},"man":0}'),

// Saves all data to local storage.
save = X => {checkAchievements(); getTime() - loadTime > standardDelay && localStorage.setItem('_', JSON.stringify(_))},

// Creates a templated element from reusable HTML snippets.
getTemplate = (tpl, template = document.createElement('template')) => {
  template.innerHTML = tpl;
  return template.content.firstChild;
},

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
    B.classList.contains('glass') && getEl('a-tg').click();
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
    a.carry && carryDraw(a.carry, a);
  });
  // Redraw nipped ants.
  F.nips.forEach(n => n.item.a.forEach(a => {
    antDraw(a, getEl('a-' + nipIds[n.nip]));
    a.carry && carryDraw(a.carry, a);
  }));
  let kit = getEl('kit');
  kit.dataset.id = farmId;
  // Shake handler.
  getEl('glass').addEventListener('click', X => {
    !B.classList.contains('glass') && (
      kit.classList.add('shake'),
      setTimeout(X => kit.classList.remove('shake'), num500),
      !randomInt(10) && values(F.a).some(ant => ant.state != 'free') && randomMsg(tapMsg)
    );
  });
  kit.offsetWidth; // This is a hack to "trigger layout" reflow - do not remove.
  swipeDir && kit.classList.remove(swipeDir > 0 ? 'swipeR' : 'swipeL');
  // Activate or update the switcher if needed.
  updateSwitcher();
},

// Fills the farm with filler and spawn free ants.
startFarm = isNew => {
  // Fill farm.
  getEl('farm').dataset.fill = F.fill;
  // New farm setup.
  if (isNew) {
    F.ts = getTimeSec();
    // Create a new farm.
    calcFarm();
    // New farm message.
    !_.score && !spilled && randomMsg(newFarm);
  }
  // Draw tunnels.
  F.tuns.forEach(drawTun);
  if (F.mTuns) {
    // Draw mTuns sculptures.
    F.mTuns.forEach(drawTun);
    mTunsBg();
  }
  // Draw hills.
  F.hills.forEach(drawHill);
  // Draw card.
  if (F.card) getEl('card').style.background = `url(img/${F.card}.webp)`;
  // Draw anomaly.
  F.hair ?
    appendHTML(getEl('fill'), `<img id="Fh" src="img/hair.webp" style="position:absolute;bottom:${F.hair[0]}px;left:${F.hair[1]}px;transform:rotate(${F.hair[2]}deg);opacity:.6">`) :
      getEl('Fh') && getEl('Fh').remove();
  // Draw items.
  addItems();
  addDecals();
  addNipItems();
  // Re-add eggs into the farm.
  F.e.forEach(eggDraw);
  // Add lid function.
  if (F.items.length || F.card) addLidFunc();
  // Re-enable spawner if it got turned off by something.
  !spawner && setTimeout(X => {spawner = 1; spawnAnt()}, num1000);
},

// Precalculates the tunnel system layout of the current ant farm.
calcFarm = (numEntrances = 2 + randomInt(4), tries = 0, hills = [-50, 1010], sublevels = [0, 120, 240, 380, 495], adjustedTun = 0, adjustLeft = !randomInt(4),
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
        if (max(tun.y1 + tun.h / 2, tun.y2 + tun.h / 2) > surface) tun.y1 -= tun.h/2;
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
    dev && DL(line, line.score / 100);
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
    console.warn("reconnecting tun", unconnected);
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
  appendHTML(B, `<div id="spill" data-fill="${F.fill || 'dirt'}"><div class="hill"><div class="specks"></div></div></div>`);
  dumpFarm();
  setTimeout(X => {score(10, 1); msg('Here, have a bonus.')}, standardDelay / 2);
  setTimeout(X => msg("Refreshing in 3… 2… 1…", 'warn'), standardDelay * .8);
  setTimeout(X => location.reload(), standardDelay);
  getEl('a-bag').remove();
  getEl('kit').remove();
},

// Builds a joining tunnel.
// These are the code names of the tunnel pieces:
// 'ent' - Surface level tunnel entrances.
// 'tun' - Joining tunnels which are referred to as "connections" in the UI (the long skinny ones).
// 'cav' - Chamber cavities (the thick horizontal ones).
// 'con' - A transition junction connecting tuns and cavs to each other - not obvious they're there.
buildATun = (lines, joinLines, tun1, func = 'BL',
    funcs = {
      // Chooses one of the best available lines to implement as a joining tunnel.
      BL: (objects, maxObj = objects.reduce((maxObj, obj) => (obj.score > maxObj.score && obj.score !== 0 ? obj : maxObj), {score: 0})) => maxObj.score && maxObj,
      // Chooses a random line (favouring the "better" scored lines) to implement as a joining tunnel.
      RL: (objects, rand = randomInt(objects.reduce((sum, obj) => sum + obj.score, 0)), obj) => {for (obj of objects) {rand -= obj.score; if (rand <= 0) return obj}},
    },
    choice = funcs[func](lines.map(ln =>
      (ln.x1 == tun1.x1 && ln.y1 == tun1.y1) ? {...ln, X1: ln.x1, Y1: ln.y1, X2: ln.x2, Y2: ln.y2} :
      (ln.x2 == tun1.x1 && ln.y2 == tun1.y1) ? {...ln, X1: ln.x2, Y1: ln.y2, X2: ln.x1, Y2: ln.y1} :
      (ln.x1 == tun1.x2 && ln.y1 == tun1.y2) ? {...ln, X1: ln.x1, Y1: ln.y1, X2: ln.x2, Y2: ln.y2} :
      (ln.x2 == tun1.x2 && ln.y2 == tun1.y2) ? {...ln, X1: ln.x2, Y1: ln.y2, X2: ln.x1, Y2: ln.y1} :
      null).filter(Boolean).filter(tunLn => !joinLines.some(ln => doLinesIntersect(tunLn, ln, 2))))
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
      botConn = conn1.y1 > conn2.y1 ? conn1 : conn2,
      // Add the joining tunnel.
      // It would be better to create 3 or 4 tunnels in an s-shape with offset 'con' pieces along the way. But this works for now.
      tunnel = {
        t: 'tun',
        id: 'tun-' + joinLines.length,
        lvl: (topConn.lvl + botConn.lvl) / 2,
        h: 14,
        w: hypot(botConn.x2 - topConn.x1, botConn.y2 - topConn.y1),
        r: angleFromDelta(botConn.x2 - topConn.x1, botConn.y2 - topConn.y1, 90),
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
findPath = (farm, tun, targetAttrs, path = [], invertMatch = 0, path100 = 0, firstTunId = 0, tid, result) => {
  // If the current tunnel matches all target attributes, return the path.
  if (keys(targetAttrs).every(attr => invertMatch ? tun[attr] != targetAttrs[attr] : tun[attr] == targetAttrs[attr])) return path;
  if (!path100 || tun.prog == 100 || !firstTunId)
    // Recursively search for the path. (Shuffle the next tunnels to introduce randomness.)
    for (tid of shuffle(tun.co.filter(tid => !path.includes(tid) && tid != firstTunId)))
      if (result = findPath(farm, getTun(farm, tid), targetAttrs, [...path, tid], invertMatch, path100, firstTunId || tun.id)) return result;
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
lineFinder = (lines, tunId, thisLevel, xK, yK, tunX, tunY, score1, score2) => {
  F.tuns.filter(t => t.lvl < thisLevel && t[xK] < tunX).forEach(t => _lineFinderHelper(lines, tunId, t.id, t[xK], t[yK], tunX, tunY, score1));
  F.tuns.filter(t => t.lvl < thisLevel && t[xK] >= tunX).forEach(t => _lineFinderHelper(lines, tunId, t.id, tunX, tunY, t[xK], t[yK], score2));
},

// Does the heavy lifting for lineFinder().
_lineFinderHelper = (lines, tId1, tId2, x1, y1, x2, y2, score, line = {tids: [tId1, tId2], x1: x1, y1: y1, x2: x2, y2: y2, d: abs(x2 - x1), l: calculateDistance(x1, y1, x2, y2), score: score}) => {
  if (F.tuns.filter(ot => ot.t != 'ent' && tId2 != ot.id).every(ot => !doLinesIntersect(ot, line, 20))) {
    line.r = angleFromDelta(x2 - x1, y2 - y1);
    x1 > 5 && x2 > 5 && x1 < 955 && x2 < 955 && lines.push(line);
  }
},

// Checks if two lines (actually rectangles) intersect along their length.
doLinesIntersect = (line1, line2, thickness, ignoreEnds = 30, returnIntersectionPoint = 0) => {
  let {x1: x1_1, y1: y1_1, x2: x2_1, y2: y2_1} = line1,
    {x1: x1_2, y1: y1_2, x2: x2_2, y2: y2_2} = line2,
    pointAlongLine = (x1, y1, x2, y2, distance, ratio = distance / calculateDistance(x1, y1, x2, y2)) => ({x: x1 + ratio * (x2 - x1), y: y1 + ratio * (y2 - y1)}),
    {x: adjustedX1_2, y: adjustedY1_2} = pointAlongLine(x1_2, y1_2, x2_2, y2_2, ignoreEnds),
    {x: adjustedX2_2, y: adjustedY2_2} = pointAlongLine(x2_2, y2_2, x1_2, y1_2, ignoreEnds),
    getDirection = (x1, y1, x2, y2, x3, y3) => ((x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)),
    d1 = getDirection(adjustedX1_2, adjustedY1_2, adjustedX2_2, adjustedY2_2, x1_1, y1_1),
    d2 = getDirection(adjustedX1_2, adjustedY1_2, adjustedX2_2, adjustedY2_2, x2_1, y2_1),
    d3 = getDirection(x1_1, y1_1, x2_1, y2_1, adjustedX1_2, adjustedY1_2),
    d4 = getDirection(x1_1, y1_1, x2_1, y2_1, adjustedX2_2, adjustedY2_2),
    intersect = ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0)),
    expandLineToStrip = (x1, y1, x2, y2, thickness, dist = calcDistComponents(x1, y1, x2, y2), offsetX = (thickness / 2) * dist.y, offsetY = (thickness / 2) * dist.x) =>
      [{x: x1 - offsetX, y: y1 + offsetY }, {x: x1 + offsetX, y: y1 - offsetY}, {x: x2 + offsetX, y: y2 - offsetY}, {x: x2 - offsetX, y: y2 + offsetY}],
    rectanglesIntersect = (rect1, rect2) => !(
      max(rect1[0].x, rect1[1].x, rect1[2].x, rect1[3].x) < min(rect2[0].x, rect2[1].x, rect2[2].x, rect2[3].x) ||
      min(rect1[0].x, rect1[1].x, rect1[2].x, rect1[3].x) > max(rect2[0].x, rect2[1].x, rect2[2].x, rect2[3].x) ||
      max(rect1[0].y, rect1[1].y, rect1[2].y, rect1[3].y) < min(rect2[0].y, rect2[1].y, rect2[2].y, rect2[3].y) ||
      min(rect1[0].y, rect1[1].y, rect1[2].y, rect1[3].y) > max(rect2[0].y, rect2[1].y, rect2[2].y, rect2[3].y)
    ),
    denominator = ((x1_1 - x2_1) * (y1_2 - y2_2) - (y1_1 - y2_1) * (x1_2 - x2_2));
  return returnIntersectionPoint && intersect && denominator != 0 ? {
      x: ((x1_1 * y2_1 - y1_1 * x2_1) * (x1_2 - x2_2) - (x1_1 - x2_1) * (x1_2 * y2_2 - y1_2 * x2_2)) / denominator,
      y: ((x1_1 * y2_1 - y1_1 * x2_1) * (y1_2 - y2_2) - (y1_1 - y2_1) * (x1_2 * y2_2 - y1_2 * x2_2)) / denominator
    } : intersect || rectanglesIntersect(expandLineToStrip(x1_1, y1_1, x2_1, y2_1, thickness), expandLineToStrip(adjustedX1_2, adjustedY1_2, adjustedX2_2, adjustedY2_2, thickness));
},

// Gets tun object from tun ID.
getTun = (farm, id) => id && getById(farm.tuns, id),

// Renders a tunnel.
drawTun = tun => {
  appendHTML(getEl('tunnels'),
    `<div id="${tun.id}" class="tp ${tun.t}" style="left:${tun.x1}px;top:${tun.y1}px;height:${tun.h}px;width:${tun.w}px;transform:rotate(${tun.t == 'tun' ? tun.r - 90 : tun.r}deg);border-radius:${tun.br}${(isRotationTunnel(tun) ? `;margin-left:-${tun.w / 2}px` : '') + `;margin-top:-${tun.h / 2}px`}"><div class="prog"></div></div>`
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
  let {x1: x1, y1: y1, x2: x2, y2: y2, t: t, prog: prog, w: w, h: h, r: r} = tun, // <-- Important: Don't optimise the destructuring for brevity as the minifier will ruin it!
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
  if (t == 'tun') r -= 90;
  if (t == 'con' || t == 'ent') x1 -= w / 2;
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
      if (t == 'tun') x1 += w - w;
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
  return points.map((p, rad = degToRad(r), dx = p.x - pivotX, dy = p.y - pivotY) => ({x: cos(rad) * dx - sin(rad) * dy + pivotX, y: sin(rad) * dx + cos(rad) * dy + pivotY}));
},

// Removes points that are inside other shape's perimeters or out-of-bounds.
filterWaypoints = (segments, inShape = (point, perimeterPoints, y = point.y, n = perimeterPoints.length, inside = 0, i = 0, j = n - 1) => {
    for (; i < n; j = i++) {
      let xi = perimeterPoints[i].x, yi = perimeterPoints[i].y, yj = perimeterPoints[j].y;
      if ((yi > y) !== (yj > y) && point.x < ((perimeterPoints[j].x - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }) => {
  segments.forEach((points, index, i) => {
    points.forEach(p => {
      for (i = 0; i < segments.length; i++)
        if (i !== index && inShape(p, segments[i]) || p.y < 2 || p.x < 0 || p.x > 960) {
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
  while (remaining.length > 0) {
    let segment = [], current = remaining.shift(), nearestIndex, nearestDist, d;
    segment.push(current);
    while (remaining.length > 0) {
      nearestIndex = -1;
      nearestDist = Infinity;
      for (i = 0; i < remaining.length; i++) {
        d = calculateDistance(current.x, current.y, remaining[i].x, remaining[i].y);
        if (d < nearestDist) {
          nearestDist = d;
          nearestIndex = i;
        }
      }
      if (nearestDist > 12) break; // The max distance between points to consider.
      current = remaining.splice(nearestIndex, 1)[0];
      segment.push(current);
    }
    segments.push(segment.length > 2 ? segment.map((p, i, arr, sumX = 0, sumY = 0, count = 0, maxNeighborDist = 0, neighbor, d, pt) => {
      if (p.y < 50) return p; // Skip smoothing for low-y points
      for (j = i - radius; j <= i + radius; j++) {
        if (neighbor = arr[(j + arr.length) % arr.length]) {
          d = calculateDistance(p.x, p.y, neighbor.x, neighbor.y);
          if (d > maxNeighborDist) maxNeighborDist = d;
        }
      }
      if (maxNeighborDist > 12) return p;
      for (j = i - radius; j <= i + radius; j++)
        if (j >= 0 && j < arr.length) {
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
  while (segments.length > 0) {
    let current = segments.shift(), changed = 1, i;
    while (changed) {
      changed = 0;
      for (i = 0; i < segments.length; i++) {
        let seg = segments[i], firstCurrent = current[0], lastCurrent = current[current.length - 1], firstOther = seg[0], lastOther = seg[seg.length - 1];
        // 12 is the join threshold.
        if (calculateDistance(lastCurrent.x, lastCurrent.y, firstOther.x, firstOther.y) <= 12) {
          current = current.concat(seg);
          changed = 1;
        }
        else if (calculateDistance(lastCurrent.x, lastCurrent.y, lastOther.x, lastOther.y) <= 12) {
          current = current.concat(seg.slice().reverse());
          changed = 1;
        }
        else if (calculateDistance(firstCurrent.x, firstCurrent.y, lastOther.x, lastOther.y) <= 12) {
          current = seg.concat(current);
          changed = 1;
        }
        else if (calculateDistance(firstCurrent.x, firstCurrent.y, firstOther.x, firstOther.y) <= 12) {
          current = seg.slice().reverse().concat(current);
          changed = 1;
        }
        if (changed) {
          segments.splice(i, 1);
          break;
        }
      }
    }
    stitched.push(current);
  }
  return stitched.flat();
},

// Renders hills.
drawHill = hill => {
  appendHTML(getEl('hills'), `<div id="hill-${hill.id}" class="hill" style="left:${hill.l}px;width:${hill.r - hill.l}px"><div class="specks"></div></div>`);
  hillProgDraw(hill);
},

// Updates hill height.
hillProgDraw = hill => getEl('hill-' + hill.id).style.height = hill.h + 'px',

// Corrects background position of farm sculptures.
mTunsBg = X => queryAll('.prog').forEach(el => {let tp = el.closest('.tp'); el.style.backgroundPosition = tp.style.left + ' ' + tp.style.top}),

// Set up the msgLog panel.
setupMsgLog = (msgLogEl = getEl('msglog'), msgLogDn = getEl('msglog-dn'), msgLogTxt = getEl('msglog-txt')) => {
  msgLogDn.addEventListener('click', X => {
    if (msgLogEl.classList.contains('dn')) {
      msgLogEl.classList.remove('dn');
      msgLogDn.innerText = '▼';
    }
    else {
      msgLogTxt.innerHTML = '<div class="msg mlhd"><p>Message Log</p></div>';
      messageLog.forEach(ml => msgLogTxt.innerHTML += `<div class="msg ${ml.t}">${ml.msg}</div>`);
      msgLogEl.classList.add('dn');
      msgLogDn.innerText = '▲';
    }
  });
},

// Set up the switch control panel.
setupSwitcher = (switchEl = getEl('switch'), switchUp = getEl('switch-up')) => {
  switchUp.addEventListener('click', X => {
    if (switchEl.classList.contains('up')) {
      switchEl.classList.remove('up');
      switchUp.innerText = '▲';
    }
    else {
      switchEl.classList.add('up');
      switchUp.innerText = '▼';
    }
  });
  getEl('switch-control').addEventListener('click', switchFunc);
},

// Supports the switcher functionality.
switchFunc = (e, farmId = e.target.closest('.switch-f')?.dataset.id) => farmId && F.id != farmId && switchFarm(farmId),

// Updates the farm switch control panel.
updateSwitcher = X => {
  if (_.farms.length > 1) getEl('switch').classList.add('vis');
  getEl('switch-control').innerHTML = '';
  _.farms.forEach(f => getEl('switch-control').appendChild(getTemplate(`<div class="switch-f${currentFarm(f) ? ' cur' : ''}" data-id="${f.id}"><div class="sw-t">${f.mTuns ? '<img src="img/sculpt.webp">': getFarmThumbnail(f)}</div></div>`)));
  setTimeout(X => switcher = 1, num1000);
  // Prevent soft-lock due to crucible functionality. (Checked here because this func is somewhat of a multi-farm overwatcher)
  _.farms.length && _.farms.every(f => f.mTuns) && !_.bag.some(obj => obj.k == 'antFarm') && setTimeout(X => drop('antFarm'), shortDelay);
},

// Retrieves the HTML for a farm's thumbnail.
// Note: the 'ab' and 'fl' classes are there in anticipation of future divs that match the same position/dimensions, but that can be changed if that is to never be implemented.
getFarmThumbnail = (f, farm = 1, base = 1) => (farm ?
  `<div class="thumb" data-col="${f.col}" data-fill="${f.fill}"><div class="crd ab" style="${f.card ? `background-image:url(img/${f.card}.webp)` : ''}"></div>
  <div class="fll fl"></div><div class="gl"></div><div class="de"></div><div class="ld"></div><div class="n1"></div><div class="n2"></div><div class="n3"></div><div class="n4"></div></div>` : '')
  + (base ? `<div class="Bthumb" data-col="${f.plate}"><div class="Bl"></div><div class="Bn">${f.n}</div><div class="Br"></div><div class="Bt"></div></div>` : ''),

// Calculates the y-position of the drink feeder.
getDrinkHillHeight = (x, xPos = parseInt(x)) => (getHillHeight(xPos + 25) + min(getHillHeight(xPos), getHillHeight(xPos + 50))) / 2 + 'px',

// Re-adds placed items when switching to farm or loading page.
addItems = X =>
  F.items.forEach(item => {
    let styles = [`left:${item.x}`], isFood = item.t == 'food', isDrink = item.t == 'drink';
    (isFood || isDrink) && styles.push(`bottom:${isFood ? getHillHeight(parseInt(item.x) + 25) + 'px' : getDrinkHillHeight(item.x)}`);
    isFood && styles.push(`transform:rotate(${antHillAngle({x: item.x, scale: 1, f: F.id}) - 90}deg)`);
    appendHTML(getEl(isDrink ? 'food' : item.t), `<div id="${item.id}" style="${styles.join(';')}" class="${items[item.k].t}" data-fx="${items[item.col]?.fx}">${isFood || isDrink ? foodCode(item) : sceneImg(item)}</div>`);
  }) || updateFoodAndDrink(F),

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
  window.addEventListener('resize', tubeFollowLinkPosition);
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
appendDecalImg = (decalsEl, decal, temp = ' temp') => appendHTML(decalsEl, `<div id="${decal.id}" style="left:${decal.x};top:${decal.y};transform:rotate(${decal.r}deg)" class="${items[decal.k].t} ${decal.k + temp}"><img src="img/${decal.k}.webp"></div>`),

// Provides the HTML code for a food or beverage item.
foodCode = item => `<div class="${item.t} ${item.k} sz-${min(4, floor(item.sz / 20))}"><div></div></div>`,

// Calls SVG() to get the SVG code based on a scene item's attributes.
sceneImg = item => SVG(item.k, items[item.col].col, items[item.col].fx == 'm' ? '#fff' : '#000', items[item.col].fx == 'm' ? '.6' : '.25'),

// Get img/svg tag for a bag/drop item.
bagImg = (bagItem, item = items[bagItem.k]) => ['scenery', 'decor'].includes(item.t) ? sceneImg(bagItem) :
  ['paintm', 'paint'].includes(item.t) ? sceneImg({k: item.fx == 'm' ? 'paintm' : 'paint', col: bagItem.k }) :
  item.t == 'ants' ? sceneImg({k: 'ants', col: item.col || bagItem.col }) :
  `<img src="img/${item.t == 'hat' ? 'hat' : bagItem.k}.${item.ext || 'webp'}">`,

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
  queryAll('.carry').forEach(c => c.remove());
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
    decor() {typeHandlers.scenery()},// Uses same logic as scenery.
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
      for (; j < 20;) setTimeout(X => spawnAnt(0), j++ * shortDelay);
      setTimeout(X => {
        fx.classList.add('fog2');
        setTimeout(X => fx.classList.remove('fog', 'fog2'), 4500);
      }, 19 * shortDelay);
    },
    bus(countFarms = _.farms.filter(f => f.a.length).length) {//  @TODO test this
        //let i = last(_.farms.filter(f => f.a.length)),
        // @TODO this is not supposed to allow dystopia when you have just 1 or more than 4 farms - but it does.
        //locKeys = (i == 3) ? ['dystopia'] : keys(locs).filter(lk => (i === 1 || i > 4) ? lk != 'dystopia' : lk),
        locKeys = (countFarms == 4) ? ['dystopia'] : keys(locs).filter(lk => (countFarms === 1 || countFarms > 4) ? lk != 'dystopia' : lk),
        loc = pickRandom(locKeys);
        _.bg = loc + (randomInt(locs[loc].c) + 1);
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
    crucible() {pourCrucible(); score(20, 1)},
  },
  handler = keyHandlers[itemKey] || typeHandlers[itemType]
) => {
  xPop();
  handler && handler();
  doQuip && randomMsg(items[itemKey].quip);
  doDel && !items[itemKey].keep && deleteBagItem(i);
},

// Adds stickers into the farm.
// This function is awfully similar to placeItem(), but just different enough to be annoying to refactor together :(
// Note: Once the sticker is chosen it can't be cancelled, other than reloading the page.  I think that makes sense though, because once you peel a sticker... well, you're rather stuck.
placeDecal = (i, decals = getEl('decals'), decal = assign(_.bag[i], { id: 'i' + getTime() }), decalsRect = decals.getBoundingClientRect(), touchStartX = 0, touchStartY = 0) => {
  getEl('olay').classList.add('vis');
  appendDecalImg(decals, decal);
  let obj = getEl(decal.id), imgWidth = obj.offsetWidth, imgHeight = obj.offsetHeight,
  moveObject = e => {
    obj.style.left = `${clamp((e.clientX ?? (e.touches && e.touches[0].clientX)) - decalsRect.left - imgWidth / 2, 0, decals.offsetWidth - imgWidth)}px`;
    obj.style.top  = `${clamp((e.clientY ?? (e.touches && e.touches[0].clientY)) - decalsRect.top - imgHeight / 2, 0, decals.offsetHeight - imgHeight)}px`;
  },
  fixPosition = X => {
    obj.classList.remove('temp');
    decal.x = obj.style.left;
    decal.y = obj.style.top;
    F.decals.push(decal);
    decal.k == 'coexist' && (F.coex = 1);
    deleteBagItem(i);
    getEl('olay').classList.remove('vis');
    save();
    B.removeEventListener('mousemove', moveObject);
    B.removeEventListener('mousedown', onMouseDown);
    B.removeEventListener('touchmove', moveObject);
    B.removeEventListener('touchstart', onTouchStart);
    B.removeEventListener('touchend', onTouchEnd);
  },
  onMouseDown = (e, rect = obj.getBoundingClientRect()) => e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom && fixPosition(),
  onTouchStart = (e, t = e.touches[0]) => {touchStartX = t.clientX; touchStartY = t.clientY},
  onTouchEnd = (e, t = e.changedTouches[0]) => abs(t.clientX - touchStartX) < 5 && abs(t.clientY - touchStartY) < 5 && onMouseDown(t);
  obj.style.left = `${(decals.offsetWidth - imgWidth) / 2}px`;
  obj.style.top = `${(decals.offsetHeight - imgHeight) / 2}px`;
  B.addEventListener('mousemove', moveObject);
  B.addEventListener('mousedown', onMouseDown);
  B.addEventListener('touchmove', moveObject, {passive: 0});
  B.addEventListener('touchstart', onTouchStart, {passive: 1});
  B.addEventListener('touchend', onTouchEnd, {passive: 1});
},

// Adds items into the farm.
placeItem = (i, type, item = assign(_.bag[i], { id: 'i' + getTime(), t: type }), el = getEl(type == 'drink' ? 'food' : type), elRect = el.getBoundingClientRect(), touchStartX = 0, touchStartY = 0) => {
  switcher = 0;
  getEl('olay').classList.add('vis');
  setTimeout(X => getEl('lid').classList.add('off'), num500);
  appendHTML(el, `<div id="${item.id}" class="${items[item.k].t} temp up">${type == 'scenery' ? sceneImg(item) : foodCode(item)}</div>`);
  let obj = getEl(item.id), itemWidth = obj.offsetWidth,
  moveObject = (e, xPos = clamp((e.clientX ?? (e.touches && e.touches[0].clientX)) - elRect.left - itemWidth / 2, 0, el.offsetWidth - itemWidth)) => {
    obj.style.left = xPos + 'px';
    if (type == 'food') {
      obj.style.bottom = getHillHeight(xPos + itemWidth / 2) + 'px';
      obj.style.transform = `rotate(${antHillAngle({ x: xPos + itemWidth / 2, scale: 1, f: F.id }) - 90}deg)`;
    }
    if (type == 'drink') obj.style.bottom = getDrinkHillHeight(xPos);
  },
  fixPosition = X => {
    obj.classList.remove('temp');
    item.x = obj.style.left;
    F.items.push(item);
    if (!items[item.k].keep) deleteBagItem(i);
    setTimeout(() => getEl('lid').classList.remove('off'), num500);
    getEl('olay').classList.remove('vis');
    addLidFunc();
    switcher = 1;
    if (type == 'scenery') _.scene[item.id] = 1;
    save();
    B.removeEventListener('mousemove', moveObject);
    B.removeEventListener('mousedown', onMouseDown);
    B.removeEventListener('touchmove', moveObject);
    B.removeEventListener('touchstart', onTouchStart);
    B.removeEventListener('touchend', onTouchEnd);
  },
  onMouseDown = (e, rect = obj.getBoundingClientRect()) => e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom && fixPosition(),
  onTouchStart = (e, t = e.touches[0]) => {touchStartX = t.clientX; touchStartY = t.clientY},
  onTouchEnd = (e, t = e.changedTouches[0]) => abs(t.clientX - touchStartX) < 5 && abs(t.clientY - touchStartY) < 5 && onMouseDown(t);
  setTimeout(X => obj.classList.remove('up'), num1000);
  obj.style.left = `${(el.offsetWidth - itemWidth) / 2}px`;
  B.addEventListener('mousemove', moveObject);
  B.addEventListener('mousedown', onMouseDown);
  B.addEventListener('touchmove', moveObject, {passive: 0});
  B.addEventListener('touchstart', onTouchStart, {passive: 1});
  B.addEventListener('touchend', onTouchEnd, {passive: 1});
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
        updateSwitcher();
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

// Fetches a list of usable nips the farm has, optionally restricted to available nips.
getNips = (avail = 0, f = F, nips = nipIds.slice(-2)) => (f.tuns.forEach(t => t.nip && t.prog == 100 && nips.push(nipIds[t.nip])), nips.filter(n => !avail || !f.nips.some(nip => nip.nip == n))),

// Enables the nipple selection UI mode.  Calling workflow is responsible for checking getNips(1) works.
nippleSelection = (callback, nips = getNips(1), nippleClick = e => {
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
    getEl(n).classList.add('sel');
    getEl(n).addEventListener('click', nippleClick);
  });
  msg('Select a nipple.', 'warn');
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
// @TODO handle eggs, food/drink and anything else we didn't think of at the time this function was written. carried items!
pourCrucible = (audio = ambienceOverride('sizz1'), fx = getEl('fx'), hills = getEl('hills'), pourEl = getTemplate('<div id="pour"></div>')) => {
  queryAll('.toob .vis').forEach(fl => fl.classList.remove('vis'));
  switcher = 0;
  spawner = 0; // Disable free ants coming in.
  setTimeout(X => {
    getEl('lid').classList.add('off');
    hills.before(pourEl);
    setTimeout(X => {
      queryAll('.ant.free').forEach(a => a.remove());
      _.a = [];
      pourEl.classList.add('vis');
      hills.innerHTML += '<div id="mHill"><div class="hill"></div></div>';
      let mHillEl = getEl('mHill'), mTunsEl = getEl('tunnels').cloneNode(1), child;
      mTunsEl.id = 'mTuns';
      for (child of mTunsEl.children) child.id = 'm' + child.id;
      getEl('tunnels').after(mTunsEl);
      F.mTuns = F.tuns.map(tun => ({...tun, cap: tun.prog, prog: 0, id: 'm' + tun.id}));
      F.mTuns.forEach(tunProgDraw);
      mTunsEl.classList.add('vis');
      setTimeout(X => {
        fx.classList.add('smoke');
        playSound('sizz2', .8);
        mHillEl.classList.add('vis');
        F.a.filter(a => a.area.n == 'bg' || a.area.n == 'top').forEach(a => {
          a.area.n == 'bg' && randomInt(2) && antSlip(ant, antEl);
          a.classList.add('burn');
          setTimeout(X => {
            playSound('sizz2', .3);
            a.area.n == 'bg' && randomInt(2) && antSlip(ant, antEl);
            antDeath(a, 'other');
          }, num1000 + randomInt(num2000));
        });
        queryAll('#scenery > div').forEach(el => {
          el.classList.add('burn');
          setTimeout(X => el.classList.add('fade'), num1000 + randomInt(num2000));
        });
        getEl('card').classList.add('burn');
        playSound('sizz2', .6);
        setTimeout(X => {
          playSound('sizz2', .3);
          getEl('card').classList.add('fade');
          F.mTuns.filter(tun => tun.t == 'ent').forEach(pourTun);
          queryAll('.frame').forEach(el => el.classList.add('burn'));
        }, num1000);
        setTimeout(X => {
          mTunsEl.style.overflow = 'visible';
          pourEl.classList.remove('vis');
          mHillEl.classList.remove('vis');
          setTimeout(X => {
            playSound('sizz2', .3);
            audio.pause();
            pourEl.remove();
            setTimeout(X => {
              ['a', 'tuns', 'hills', 'items'].forEach(key => F[key] = []);
              F.card = 0;
              F.fill = F.col = F.plate = query('#kit #wrapper').dataset.col = query('#kit #base').dataset.col = 'metal';
              mTunsBg();
              save();
              setTimeout(X => mTunsEl.classList.add('fade'), 10000);
              setTimeout(X => {
                fx.classList.add(['fog2']);
                setTimeout(X => fx.classList.remove('smoke', 'fog2'), num2000 * 2);
                ambience();
                updateSwitcher(); // Will re-enable switcher.
              }, 20000);
            }, num2000);
          }, num2000);
        }, num2000 * 3);
      }, num2000);
    }, num500);
  }, num500);
},

// Draws progress of a tunnel pour.
pourTun = tun => {
  tun.pour = 1;
  tun.prog += 2;
  tunProgDraw(tun);
  F.a.filter(a => a.area.t == tun.id).forEach(a => {
    a.classList.add('burn');
    playSound('sizz2', .3);
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

// A collection of namespaced modal functions which all work in a similar way.
modal = {

  // Templates the inventory bag popup.
  bag: el => {
    B.classList.add('bag');
    el.innerHTML = '<div id="bag-items"></div><div id="bag-caption">'
      + (_.bag.length > 9 ? `<div class="sort-caption vis"><h4>Sort</h4><a data-s="0" class="sel-${!_.bs}">Date</a> | <a data-s="1" class="sel-${_.bs === 1}">Auto</a> | <a data-s="2" class="sel-${_.bs > 1}">Name</a></div>` : '')
      + '</div>';
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
            el.innerHTML = '🚮️ <span class="err">Confirm farm dump</span>';
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
              ts.forEach(at => keys(castes).forEach(c => (cnt = bagItem.a.filter(a => a.caste == c && a.t == at).length) && cnts.push(`<span class="num">${cnt}</span> ${types[at].n} Ant ${castes[c] + (cnt === 1 ? '' : 's')}`)));
              customDesc = `Your reused ant vial containing:<br>${cnts.length > 1 ? cnts.slice(0, -1).join(', ') + ', and ' + last(cnts) : cnts[0]}.`;
              cta = `Release ${bagItem.a.length} ant${bagItem.a.length === 1 ? '' : 's'}`;
            }
          }
          else cta = `Release ${types[item.ant].n} Ant Queen${item.W ? ` and ${item.W} Workers` : ''}`;
          fillCheck();
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
      },
      handler = keyHandlers[itemKey] || typeHandlers[itemType];
      handler && handler();
      // Block most items for metal sculpture farms, except ones that circumvent a soft-lock.
      if (F.mTuns && !['box', 'mom', 'antFarm'].includes(bagItem.k)) {
        cta = 'Farm annihilated';
        disable = 1;
      }
      appendHTML(getEl('bag-items'), `<div id="${bagItem.k}-${i}" class="bag-item ${bagItem.k} ${items[bagItem.k].t}" ${bagItem.r ? `style="transform:rotate(${bagItem.r}deg)"` : ''}>${bagImg(bagItem)}</div>`);
      appendHTML(getEl('bag-caption'),
        `<div id="${bagItem.k}-${i}-caption" class="${bagItem.k}-caption"><h3>${items[bagItem.k].n}</h3>` +
        `<h4>level ${items[bagItem.k].lvl} ${items[bagItem.k].t || 'item'}${items[bagItem.k].t != 'ants' && bagItem.col ? ` in ${items[bagItem.col].n}` : ''}</h4><p>${customDesc || items[bagItem.k].desc}</p><button id="b-${i}" data-i="${i}" ${disable && 'disabled'}>${cta}</button>` +
        (!items[bagItem.k].keep && _.bag.some(bi => bi.k == 'trash') ? `<div class="bag-d"><span id="d-${i}" data-i="${i}" class="d"><img src="img/trash.webp"></span></div></div>` : '')
      );
      // Create confirmation to dump an item from the inventory.
      if (dumpItem = getEl('d-' + i)) {
        dumpItem.addEventListener('click', (e, dumpEl = e.target.closest('.d')) => {
          dumpEl.innerHTML = '<span class="wait">⌛</span>';
          dumpEl.classList.add('waiting');
          setTimeout(X => {
            dumpEl.innerHTML = '🚮️ <span class="err">Confirm item dump</span>';
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
        if (!active) { // Note: 'active' was calculated earlier because at this point the above 2 lines deactivated it.
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
      `<div id="drop-top"><h3>Congratulations! You've found:</h3><h2>${items[bagItem.k].n}</h2></div>
      <div id="drop-img" class="${items[bagItem.k].t} ${bagItem.k}" ${bagItem.r ? `style="transform:rotate(${bagItem.r}deg)"` : ''}>
        ${bagImg(bagItem)}
      </div>
      <div id="drop-caption">
        <h4>level ${items[bagItem.k].lvl} ${items[bagItem.k].t || 'item'}${items[bagItem.k].t != 'ants' && bagItem.col ? ` in ${items[bagItem.col].n}` : ''}</h4>
        <p>${items[bagItem.k].desc}</p>
        <button onClick="${xPop.name}()">${pickRandom(dropOK)}</button>
      </div>`;
    playSound('drop', .3);
  },

  // Templates the ach popup.
  ach: el => {
    if (_.achQ[0]) {
      let achQItem = _.achQ[0], lvl = achQItem.l, a = achQItem.a, achItem = ach[a];
      el.innerHTML =
        `<div id="ach-top"><h3>Congratulations! You've achieved:</h3><h2>${achItem.n}</h2></div>
        <div id="ach-img" class="ach-${a} ach-l${lvl}">
          <img src="img/${lvl ? 'medal' + lvl : 'trophy'}.webp">
          <span class="ach-ico">${achItem.ico}</span>
        </div>
        <div id="ach-caption">
          <h4>${_.ach[a].v || ' '} ${achItem.sub || ''}</h4>
          <p>${achItem.desc}<br> </p>
          <button onClick="${xPop.name}()">${pickRandom(achOK)}</button>
        </div>`;
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
    else xPop();
  },

  // Templates the win popup.
  win: el => {
    el.innerHTML =
    `<div id="drop-top"><h3>Congratulations! You've found:</h3><h2>Dave Matthews Band</h2></div>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/MNgJBIx-hK8?si=zPAJ6x6f-opQqOjF" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    <div id="drop-caption">
      <h4>winning level celebratory merriment</h4>
      <p>This is the highest honor available<br> </p>
      <button>${pickRandom(dropOK)}</button>
    </div>`;
    query('#drop-top button').addEventListener('click', e => {
      xPop();
      msg("I'd like to thank Penn Jillette for creating that podcast");
    });
    _.dmb = 1;
    save();
  },

  // Templates the farm rename popup.
  plate: (el, k) => {
    el.innerHTML =
    `<div id="plate-form">
      <input id="plate-text" type="text" maxlength="19" placeholder="<type name here>">
      <button>Rename ant farm</button>
    </div>`;
    query('#plate-form button').addEventListener('click', (e, newName) => {
      if (newName = getEl('plate-text').value.toUpperCase()) {
        // Rename the farm.
        F.n = newName;
        F.plate = 'green'; // Hahaha
        deleteBagItem(k);
        xPop();
        score(1);
        /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(newName) && score(2); // bonus for using emojis
        updateFrame();
        updateSwitcher();
      }
    });
  },

  // Templates the paint popup.
  paint: (el, k, paintKey = _.bag[k].k, paintItem = items[paintKey], opts = {}) => {
    if (F.col != paintKey) opts.farm = `<div class="select-img af">${getFarmThumbnail(F, 1, 0)}</div><h3>Ant farm</h3>(${items[F.col].n})`;
    if (F.plate != paintKey) opts.plate = `<div class="select-img np">${getFarmThumbnail(F, 0, 1)}</div><h3>Name plate</h3>(${items[F.plate].n})`;
    F.items.filter(it => it.col && it.col != paintKey).forEach(it => opts[it.id] = `<div class="select-img ${items[it.k].t}">${bagImg(it)}</div><h3>${items[it.k].n}</h3>(${items[it.col].n})`);
    el.innerHTML = selectForm(k, 'paint', opts, 'Paint with ' + paintItem.n, 'Paint item', `data-col="${paintKey}"`);
  },

  // Templates the hat popup.
  hat: (el, k, opts = {}) => {
    F.a.forEach(a => {
      if (livesInFarm(a) && (a.t == F.t || F.coex)) {
        let thumb = getEl(a.id).cloneNode(1);
        thumb.removeAttribute('id');
        opts[a.id] = `<div class="select-img"><div class="ant-thumb">${thumb.outerHTML}</div></div><h3>${a.n}</h3>${casteIcon(a)} ${types[a.t].n} Ant (${casteLabel(a)})`
      }
    });
    el.innerHTML = selectForm(k, 'hat', opts, 'Choose your ant', 'Enhat');
  },

  // Templates the tube popup.
  tube: (el, k, opts = {}) => {
    _.farms.forEach(f => {F.id != f.id && getNips(1, f) && (opts[f.id] = `<div id="f-${f.id}" class="select-img af">${getFarmThumbnail(f)}</div><h3>${f.n}</h3>${getFarmDesc(f)}`)});
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
      opts[(c.x || 1) + '-' + c.k.join(',')] = `<div class="select-img ebay-img x-${c.x || c.k.length}">${Array(c.x || 1).fill().map(X => c.k.map(k => bagImg({k: k})).join('')).join('')}</div><h3>${c.n}</h3>${c.d || ''}`
    });
    el.innerHTML = selectForm(k, 'ebay', opts, 'eBay offers', pickRandom(['Accept offer', 'This is how eBay works', 'Sell the farm']));
  },

  // Templates the fengshui popup.
  feng: (el, k, out = `<h2>Drag the chi and let each farm find its place</h2><div id="feng-list"><ul>`) => {
    _.farms.forEach(f => {
      out += `<li class="feng-item" draggable="true" data-id="${f.id}"><div id="f-${f.id}" class="select-img af">${getFarmThumbnail(f)}</div><h3>${f.n}</h3>${getFarmDesc(f)}<i class="g-dots">••<br>••<br>••</i></li>`
    });
    el.innerHTML = out + `</ul><button>Harmonize</button></div>`;
    let farmList = query('#feng-list ul'), draggedItem = 0;
    farmList.addEventListener('dragstart', e => {
      let item = e.target.closest('.feng-item');
      if (item) {
        draggedItem = item;
        item.classList.add('drag');
        e.dataTransfer.effectAllowed = 'move';
      }
    });
    farmList.addEventListener('dragend', e => {
      draggedItem && draggedItem.classList.remove('drag');
      draggedItem = 0;
    });
    farmList.addEventListener('dragover', e => {
      e.preventDefault();
      let targetItem = e.target.closest('.feng-item'), listItems = Array.from(farmList.children);
      if (targetItem && targetItem != draggedItem) listItems.indexOf(draggedItem) < listItems.indexOf(targetItem) ? targetItem.after(draggedItem) : targetItem.before(draggedItem);
    });
    farmList.addEventListener('drop', e => {
      e.preventDefault();
      draggedItem.classList.remove('drag');
      draggedItem = 0;
    });
    query('#feng button').addEventListener('click', (e, order = [...queryAll('#feng-list li')].map(li => li.dataset.id)) => {
      // Feng shuave.
      _.farms.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
      updateSwitcher();
      xPop();
    });
  },

  // Templates the ant rename popup.
  ren: (el, arg) => {
    el.innerHTML =
    `<div id="hat-form">
      <input id="hat-text" type="text" maxlength="19" placeholder="<type name here>">
      <button>Rename ant</button>
    </div>`;
    query('#hat-form button').addEventListener('click', (e, ant = getAnt(F, arg.a), newName = getEl('hat-text').value.toUpperCase()) => {
      msg([`${ant.n} is now called ${newName}.`], 'warn');
      ant.n = newName;
      ant.h = 1; // Hat.
      deleteBagItem(arg.k);
      xPop();
      score(1);
    });
  },

  // Templates antfax popup.
  antfax: (el, k, pro = _.bag[k].k != 'antfax', antType = types[_[pro ? 'faxp' : 'fax'] || (pro ? 'H' : 'N')], out = '<div>', i = 0) => {
    for (; i++ < 6;) out += '<div class="rbind"><div class="rhole"></div><div class="ringb"></div></div>';
    out += `</div><img src="img/antfax${pro ? 'pro' : ''}.webp"><span class="tm">TM</span><div class="faxtop"><h3>The</h3><h2>`;
    for (i = 0; i < 3;) out += `<div id="faxh2-${i++}">${antType.n.toUpperCase()}${antType.n.length > 10 ? '' : ' ANT'}</div>`;
    out += `</h2><p class="faxintro">${antType.t}</p></div><div class="faxPager">`;
    keys(types).forEach(key => !types[key].p == !pro && (out += `<a class="faxlnk faxlnk-${key}" data-key="${key}">${types[key].n.toUpperCase()}${pro ? '' : ' ANT'}</a>`));
    out += `<a class="faxlnk-cl" onClick="${xPop.name}(${k})">X</a></div><div class="faxcols"><div class="faxl"><div class="faxsz"><div class="faxbx">`;
    antType.s == 's' ? (out += "<h4>Small package!</h4><p>You'll need a keen eye to spot these critters, and their babies are tiny little specks!</p>") :
      antType.s == 'm' ? (out += "<h4>Size: normal</h4><p>Rather unremarkably, these ants are best described as being the size of ants.</p>") :
      (out += "<h4>A huge one</h4><p>These ants barely fit in their own nest.  You'd think they would dig their tunnels wider?</p>");
    out += `</div></div><div class="faxdi"><div class="faxbx">`;
    !antType.d ? (out += "<h4>Adaptive diet</h4><p>A little from column A, a little from column B.  It pays to not be too fussy!</p>") :
      antType.d < 2 ? (out += "<h4>Sweet tooth</h4><p>These ants have quite a taste for sugary foods and baked goods such as pastries and cakes.</p>") :
      (out += "<h4>Meat lover</h4><p>As carnivorous monsters they enjoy cheeseburgers and pepperoni pizza. May become cannibals when opportune!</p>");
    out += `</div></div><div class="faxmd"><div class="faxbx">`;
    !antType.m || antType.m > 75 ? (out += "<h4>Well-mannered</h4><p>These little guys are emotionally resilient with elastic hearts that will quickly learn to love again.</p>") :
      antType.m > 50 ? (out += "<h4>Average mood</h4><p>Keeping ants happy is always important for their health and fitness, but these guys aren't too bad.</p>") :
      (out += "<h4>Tough customers</h4><p>A moody type that will never be completely happy.  Be careful because a dropping mood will slow them down and affect their health!</p>");
    out += '</div></div></div><div class="faxr"><div class="faxsp"><div class="faxbx">';
    antType.v > 1.1 ? (out += "<h4>¡Ándale! ¡Ándale!</h4><p>A bunch of speedsters here!  This helps them greatly when it comes time to build and defend nests.</p>") :
      antType.v > .7 ? (out += "<h4>At a medium pace</h4><p>Neither fast nor slow, their speed is affected by their mood, health, a queen, or the need to complete an urgent task.</p>") :
      (out += "<h4>Slowpokes!</h4><p>Ants like these are really good value for money because they give you more time to enjoy their fun little antics.</p>");
    out += `</div></div><div class="faxbi"><div class="faxbx">`;
    antType.b ? (out += "<h4>Ow! Chomp!</h4><p>Delivers a toxic venomous bite that will leave victims with intense pain, swelling, hallucinations, and paralysis… for 5 minutes.</p>") :
      (out += "<h4>All bark</h4><p>Don't worry, it won't bite you, but it is said that sometimes its words can wound you deeply.  That nibble you felt is just affection.</p>");
      out += `</div></div><div class="faxpr"><div class="faxbx">`;
    pro ? (out += "<h4>VIP club</h4><p>These ants will not come looking for you, and are just a little bit harder to farm.  They must be ordered online from Sweden.</p>") :
      (out += "<h4>Garden variety</h4><p>A very common ant that will seek out online ant farms on the daily.  Abundantly available and they'll give themselves over for free.</p>");
    el.innerHTML = out + '</div></div></div></div></div></div>';
    queryAll('.faxlnk').forEach(lnk => lnk.addEventListener('click', e => {_[pro ? 'faxp' : 'fax'] = e.target.dataset['key']; popup('antfax', k, 0)}));
  },

  // Templates the stats modal.
  stats: (el, k, scores = '', awards = '', a, lvl) => {
    // Scores output.
    _.farms.forEach((f, i, A, h = floor((getTimeSec() - f.ts) / 3600), m = floor((getTimeSec() - f.ts) / 60) - h * 60,
      getTunCount = t => f.tuns.filter(t => t.t == t && t.prog == 100).length,
      getCasteCount = caste => printCount(f.a.filter(a => livesInFarm(a) && a.caste == caste && (a.t == f.t || f.coex)).length, castes[caste]),
      getStatLabelMarkup = label => `<div class="stat"><b>${label ? label + ' . . .' : ''} </b>`) => {
      if (!f.mTuns) {// Don't show sculptures.
        scores += `<div class="F-stats" style="outline: 2px dashed ${items[f.col].col}">
        <div class="F-id">#${i + 1}</div>
        <div class="F-n"><span style="border-bottom: 2px dashed ${items[f.plate].col}">${f.n}</span></div>
        ${getStatLabelMarkup('Colony') + getFarmDesc(f)}</div>
        ${getStatLabelMarkup('Running') + printCount(h, 'hour')} ${printCount(m, 'min')}</div>
        ${getStatLabelMarkup('Ant count') + getCasteCount('W')}, ${getCasteCount('D')}, </div>
        ${getStatLabelMarkup() + getCasteCount('Q')}, ${printCount(f.a.filter(a => !f.coex && livesInFarm(a) && a.t != f.t).length, 'Foe')}.</div>
        ${getStatLabelMarkup('Deaths')}<em>Hunger</em> <span class="num">${f.stats.death.hunger}</span>, <em>Thirst</em> <span class="num">${f.stats.death.thirst}</span>,</div>
        ${getStatLabelMarkup()}<em>Fights</em> <span class="num">${f.stats.death.fight}</span>, <em>Other</em> <span class="num">${f.stats.death.other}</span>.</div>
        ${getStatLabelMarkup('Tunnels') + printCount(getTunCount('ent'), 'entrance')}, with</div>
        ${getStatLabelMarkup() + printCount(getTunCount('cav'), 'chamber')}, and</div>
        ${getStatLabelMarkup() + printCount(getTunCount('tun'), 'connection')}. (<span class="num">${f.tuns.filter(t => t.prog > 0 && t.prog < 100).length}</span> WIP)</div>
        </div>`;
      }
    });
    // Awards output.
    for (a in ach) {
      lvl = ach[a].lvls ? _.ach[a] && _.ach[a].l : _.ach[a] || 0;
      if (lvl || _.score >= ach[a].lvl) {
        awards += `<div class="ach ach-${a} ach-lvl-${lvl}"><span class="icon">${ach[a].ico}</span><div class="caption"><h3>${ach[a].n}</h3><p>${ach[a].desc}</p></div>`;
        if (ach[a].lvls) {
          awards += `<div class="lvl-wrap"><div class="levels">`;
          [3, 6, 9].forEach(l => {awards += `<span class="medal${3 * _.ach[a].l >= l ? ' got' : ''}"><span class="l-${l}">${l}</span></span>`});
          awards += `</div><p class="sub">Progress: ${_.ach[a].v || 0} ${ach[a].sub}</p></div>`;
        }
        awards += `</div>`;
      }
    }
    // Main structure.
    el.innerHTML =
    `<div id="scores-scroll">
      <div id="scores-wrapper">
        <h2><span>Official Score Card</span></h2>
        <div id="scoreHead">Total score: ${_.score} (inc. bonuses)<span class="date">${new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span></div>
        <div id="scores" class="stats">${scores}</div>
      </div>
    </div>
    <div id="awards-wrapper">
      <h2><span>・✦ = Feathers in your hat = ✦・</span></h2>
      <div id="awards" class="stats">${awards || '<p class="no-ach">It looks like you have achieved very little.</p>'}</div>
    </div>
    <div id="share" class="stats">
      <h3>Share to social media
      <svg height=20 viewBox="0 0 24 24" width=20><path fill=#fff d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg>
      </h3>
      <img src="img/social.webp" height="32">
      <p>It's easy, just take a photo of your screen and use your phone's in-built sharing options.</p>
    </div>
    <div id="resetButton"><button>↩️ Restart game</button></div>
    <div id="volume">🔊<input type="range" min="1" max="100" value="${_.vol}" id="vol"></div>
    <div id="credit"><span>THIS IS A DEV VERSION OF AFS AND SHOULD NOT BE DEPLOYED!</span><a target="_blank" href="https://github.com/antfarmsocial/AntFarmSocial">Github ↗️</a></div>`;
    // Note: Do NOT modify the 'credit' div wording without changing the Gulpfile too.
    getEl('vol').addEventListener('click', X => {_.vol = getEl('vol').value; getEl('audio').volume = _.vol / 100});
    getEl("resetButton").addEventListener('click', (e, el = e.target) => {
      // Restarts app.
      el.innerHTML = '<span class="wait">⌛</span>';
      el.classList.add('confirm');
      el.disabled = 1;
      setTimeout(X => {
        el.innerHTML = '🛑 <span class="err">Confirm game restart</span>';
        el.onclick = Q;
        el.disabled = 0;
      }, num1000);
    });
  },

},

// Templates a select form popup.
selectForm = (k, select, opts, heading, buttonTxt, formAttr = '') => `<h2>${heading}</h2><div id="${select}-form" class="select-form"><form ${formAttr}>
    ${!keys(opts).length ? '<div class="no-opts">No options available</div>' : entries(opts).map(([key, val]) => `<label><input type="radio" name="${select}" value="${key}">${val}</label>`).join('')}
    </form><button ${keys(opts).length ? '' : 'disabled'} onClick="${xSelect.name}(${k}, '${select}')">${buttonTxt}</button>
  </div>`,

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
      xPop();
      score(1);
    }
    else if (select == 'hat') {popup('ren', {k: k, a: val}, 0)}
    else if (select == 'tube') {
      xPop();
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
      xPop();
    }
  }
},

// Opens the modal dialog.
popup = (modalId, param = 0, delay = num500) => setTimeout(X => {
  !delay && getEl('modal') && xPop(); // If caller sets delay to 0, it implies they want to close/override any existing popup.  That's just how it is.
  if (B.classList.contains('pik') || getEl('olay').classList.contains('vis') ||(getEl('modal') && getEl('modal').classList.contains('vis')))
    // Can't show modal yet.
    setTimeout(X => popup(modalId, param, delay), num2000);
  else {
    appendHTML(getEl('afs'),
      `<div id="modal" class="modal"><div id="modal-close" onClick="${xPop.name}()"></div><div id="modal-content"><div id="${modalId}"></div></div></div>`);
    modal[modalId](getEl(modalId), param);
    getEl('modal')?.classList.add('vis');
  }
}, delay),

// Closes (x) a modal dialog popup.
xPop = X => {
  getEl('modal')?.remove();
  updateMenuButtons(); // In case a modal changed which buttons should be shown.
  B.classList.remove('bag');
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

// Checks if a farm is running (has ants living in it).
farmIsRunning = farm => farm.a.some(livesInFarm),

// Checks if a farm is developing (has at least 2 completed cavity chambers).
farmIsDeveloping = farm => farm.tuns.filter(t => t.t == 'cav' && t.prog == 100).length > 1,

// Checks if an ant is a queen.
isQueen = ant => ant.caste == 'Q',

// Checks if an ant is a drone.
isDrone = ant => ant.caste == 'D',

// Checks if an ant is a worker.
isWorker = ant => ant.caste == 'W',

// Prints a numeric count of terms with basic pluralisation.
printCount = (cnt, term) => `<span class="num">${cnt || 0}</span> ${term}` + (cnt === 1 ? '' : 's'),

// Gets the text description of a farm colony.
getFarmDesc = f => `${f.coex ? 'Multispecie' : f.t ? types[f.t].n + (types[f.t].n.length > 10 ? '' : ' ant') : 'No ant'}s in ${f.fill || 'the air'}`,

// Spawns a "free" ant that roams the screen.
spawnAnt = (autoLoop = 1, randomEdge = randomInt(4), x, y, r, wHeight = window.innerHeight, wWidth = window.innerWidth) => {
  if (spawner) {
    if (F.fill && (document.hasFocus() || _.a.length < 3)) {// check focus & ant length to prevent flooding when user in another tab.
      randomEdge > 2 ? (x = randomInt(wWidth), y = wHeight + 25, r = 0) : // Bottom edge
      randomEdge > 1 ? (x = wWidth + 25, y = randomInt(wHeight), r = deg270) : // Right edge
      !randomEdge ? (x = -25, y = randomInt(wHeight), r = 90) : // Left edge
        (x = randomInt(wWidth), y = -25, r = deg180) // Top edge
      // Create ant and screenWalk it.
      screenWalk(assign(createAnt(_, x, y, r), {run: 1.2})); // Free ants move faster.
    }
    // Spawn fewer ants the more you have.  Make it a bit random.
    setTimeout(X => autoLoop && spawnAnt(), F.a.length * shortDelay + randomInt(standardDelay));
  }
},

// Creates an ant, stores it in data, and attaches a DOM representation of it.
createAnt = (data = F, x, y, r, state = 'free', caste = !randomInt(F.fill == 'lube' ? 12 : 24) ? 'Q' : 'W', type = pickRandom(keys(types).filter(t => !types[t].p)), id = newAntId(type, caste), ant = {
  id: id,
  n: id, // Name
  t: type,
  x: x,
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
  q: [], // Action Queue,
  thot: pickRandom(["I feel like I'm being watched", "Somebody is watching me!"]),
  thotD: 8,
  rm: [], // Body part removal
}) => data.a.push(ant) && (ant.state == 'free' ? freeAntDraw : antDraw)(ant) || ant,

// Clones a capped ant.
clone = (c, donor = F.a.find(a => isWorker(a) && a.state == 'cap'), fx = getEl('fx')) => {
  switcher = 0;
  playSound('zap');
  fx.classList.add('flashit');
  for (let i = 0; i < c;) setTimeout((id = newAntId(donor.t, donor.caste), xPos = 435 + i * 40) =>
    antDraw(F.a[F.a.push(assign(cloneData(donor), {
      id: id,
      x: xPos, y: antGroundLevel({t: donor.t, x: xPos}),
      q: [{act: 'idle'}],
      r: 90,
      thot: pickRandom(["Who am I?", "What just happened?", "Is that me?", "I am reborn!"]),
    })) - 1]) || antAction(getAnt(F, id)),
    i++ * num500 + num500
  );
  setTimeout(X => {fx.classList.remove('flashit'); switcher = 1; save()}, c * num500 + num500);
  randomMsg(items['clonekit'].quip);
},

// Gets the ant's size, adjusted for infancy and caste.
// Goal IIRC: Return ant's size as configured, except Queen's are 2 sizes larger (if possible), Drones are one size larger,
// Infant at larvae stage are small unless the ant type's default is small then they're "baby" size, and infant larval drones are one size larger than the infants.
anGetSize = (ant, sz = types[ant.t].s, sizes = ['b', 's', 'm', 'l', 'x'], i = sizes.indexOf(sz)) =>
  ant.inf === 1 ? (sz == 's' ? 'b' : 's') : sizes[min(i + (isDrone(ant) ? 1 : isQueen(ant) ? (ant.t == 'T' ? 1 : 2) : 0), 4)],

// Draws a free ant.
freeAntDraw = ant => {
  antDraw(ant, getEl('game'));
  // Add picking.
  let antEl = objGetEl(ant);
  ['mousedown', 'touchstart'].forEach(ev => antEl.addEventListener(ev, pickAnt));
  ['mouseover', 'touchstart'].forEach(ev => antEl.addEventListener(ev, spotAnt));
},

// Draws an existing ant into the currently displayed farm, or another container.
// Note: This function cannot protect against ant being drawn into wrong farm or non-existent container as this func is used for various purposes, calling code is responsible.
antDraw = (ant, cont = getEl('farm')) => antUpdate(ant, cont.appendChild(assign(getTemplate(antTemplate), {id: ant.id}))),

// Gets DOM element from the cache or from query (and store in cache if its part of the current farm).
objGetEl = (obj, cachedEl = elCache[obj.id]) => cachedEl?.isConnected && cachedEl || obj.f == F.id && (elCache[obj.id] = getEl(obj.id)) || getEl(obj.id),

// Updates the antEl's classes.
antUpdateClasses = (ant, antEl = objGetEl(ant)) => antEl && (antEl.className = [
    'ant', ant.caste, ant.t, ant.state, ant.pose, anGetSize(ant), ant.inf && 'inf' + ant.inf, // String values.
    ...['walk', 'jit', 'dig', 'wig', 'h', 'fall', 'fight', 'mag', 'alate', 'flare'].filter(f => ant[f]), // Boolean values.
    ...ant.rm // Body part removal.
  ].join(' ')),

// Handles the event where an ant is being picked up.
pickAnt = (e, antEl = e.currentTarget, ant = getFreeAnt(antEl)) => {
  e.preventDefault();
  if (antEl.classList.contains('pick')) antEl.dispatchEvent(loseAnt);
  else {
    // Handle wing leafing.
    if (ant.alate) {
      let left = parseInt(antEl.style.left), top = parseInt(antEl.style.top);
      ['wing-l', 'wing-r'].forEach(wing => {
        appendHTML(getEl('game'), `<div id="${ant.id + wing}" style="transform:rotate(${ant.r}deg);left:${left}px;top:${top}px;width:${antEl.clientWidth}px;height:${antEl.clientHeight}px;" class="leaf alate ${anGetSize(ant)}">
          <div style="transform:${getComputedStyle(query(`#${ant.id} .body`)).transform}" class="body"><div class="wings"><div class="wing ${wing}"></div></div></div></div>`);
        let leaf = getEl(ant.id + wing), dir = getSign(wing != 'wing-l'), wLeft = left, wRotation = ant.r, wTop = top, leafInterval = setInterval(X => {
          if (abs(left - wLeft) < 99) leaf.style.left = (wLeft += dir) + 'px';
          leaf.style.transform = `rotate(${wRotation += dir}deg)`;
          leaf.style.top = (wTop += .7) + 'px';
          wTop > window.innerHeight + 99 && (leaf.remove() || stopInterval(leafInterval));
        }, frameTick);
      });
    }
    del(ant, 'alate');
    // Update ant.
    assign(getFreeAnt(e.currentTarget), {pose: 'pick', walk: 0, scale: getSign(randomInt(1)), r: randomInt(30) - 10});
    antUpdate(ant);
    // Handle ant biting.
    setTimeout(X => antBite(ant), num200);
    // Add drag and drop.
    ['mousemove', 'touchmove'].forEach(ev => document.addEventListener(ev, dragAnt, {passive: 0}));
    ['mouseup', 'touchend', 'click'].forEach(ev => document.addEventListener(ev, dropAnt));
    B.classList.add('pik');
  }
},

// Forces the loss of an ant being picked up.
loseAnt = new MouseEvent('mouseup', {bubbles: 1, cancelable: 1}),

// Handles each step of the dragging of an ant.
dragAnt = (e, antEl = eventAntEl(e)) => {
  e.preventDefault();
  if (!antEl || !antEl.classList.contains('pick') || !randomInt(num2000)) query('.pick')?.dispatchEvent(loseAnt);
  else {
    let touch = e.type == 'mousemove' ? e : e.touches[0], rect = antEl.getBoundingClientRect(),
      elX = rect.left + rect.width / 2, elY = rect.top + rect.height / 2,
      dx = touch.clientX - elX, dy = touch.clientY - elY, dist = hypot(dx, dy), clampDist = min(dist, 9);
    (abs(parseInt(antEl.style.left) - touch.clientX) > 25 || abs(parseInt(antEl.style.top) - touch.clientY) > 25) && antEl.dispatchEvent(loseAnt);
    antEl.style.left = elX + (dx / dist) * clampDist + 'px';
    antEl.style.top = elY + (dy / dist) * clampDist + 'px';
  }
},

// Handles the event of dropping an ant that was picked up.
dropAnt = (e, antEl = eventAntEl(e), ant = getFreeAnt(antEl), dropzoneRect = getEl('dropzone').getBoundingClientRect()) => {
  if (ant && e.target.closest('.pick')) {
    B.classList.remove('pik');
    ['mousemove', 'touchmove'].forEach(ev => document.removeEventListener(ev, dragAnt)),
    ['mouseup', 'touchend', 'click'].forEach(ev => document.removeEventListener(ev, dropAnt)),
    ant.x = parseInt(antEl.style.left);
    ant.y = parseInt(antEl.style.top);
    !_.bit && ant.x >= dropzoneRect.left && ant.x <= dropzoneRect.right && ant.y <= dropzoneRect.bottom ? dropAntInFarm(ant, _) : freeAntRun(ant); // Drop in farm or run away.
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
  ['mouseover', 'touchstart'].forEach(ev => e.currentTarget.removeEventListener(ev, spotAnt));
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
    B.classList.remove('pik');
  }
},

// Activates the ant bit throbber effect.
doThrob = X => {
  if (_.bit) {
    // Add redThrobber immediately.
    B.classList.add('bit');
    getEl('throb').classList.add('vis');
    // After 5s add bite effect for 5m
    // The timers are global and cancellable in-case they take medicine.
    // Reloading will restart the 5 minute counter as punishment.
    setTimeout(X => {
      B.classList.add('throb');
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
  B.classList.remove('throb', 'bit');
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
score = (inc, isBonus = 0, win = _.win ? '<span class="win">🏆</span> ' : '', scoreEl = getEl('score'), bonusEl = getEl('bonus')) => {
  _.score += parseInt(inc);
  if (inc) {
    if (isBonus) {
      // Bonus handling.
      scoreEl.classList.add('bon');
      setTimeout(X => {
        appendHTML(bonusEl, `<div style="font-size:1.4em;">+${inc}</div>bonus`);
        bonusEl.classList.add('vis');
      }, num800);
      setTimeout(X => {
        scoreEl.innerHTML = `<span>${win}${_.score}</span>`;
        scoreEl.classList.remove('bon');
        setTimeout(X =>{bonusEl.classList.remove('vis'); bonusEl.innerHTML = ''}, 2610);
      }, num800 * 3);
    }
    else _.score === 1 ? randomMsg(firstPoint) : _.score == 2 ? randomMsg(secondPoint) : scoreDrop(random());
    inc > 1 && scoreDrop(0); // Force a drop when they scored more than 1 point at once.
    save();
  }
  if (!inc || !isBonus) scoreEl.innerHTML = `<span>${win}${_.score}</span>`;
  scoreEl.dataset.neg = _.score < 0;
  scoreEl.classList.add('vis');
},

// Drops an item either according to the random value passed in (0=guaranteed) or when some conditions are met.
scoreDrop = (rand, dropItem, scoreCompare = _.score > 149 ? .3 : _.score > 9 ? .4 : .5) => {
  if (rand < scoreCompare) {
    // Random drops.
    let itemKeys = keys(items).filter(key =>
      items[key].lvl < (_.farms.length < 2 ? 50 : _.farms.length < 3 ? 100 : _.score) && !items[key].nodrop && (!items[key].max || _.bag.filter(item => item.k == key).length < items[key].max));
    if (itemKeys.length > 0) {
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
      .reduce((lowestItem, currentItem) => (!lowestItem || items[currentItem].lvl < items[lowestItem].lvl ? currentItem : lowestItem), null);
  }
  else if (random() < scoreCompare) {
    let i = last(_.farms.filter(farmIsRunning));
    setTimeout(X => randomMsg(kudos[i < 4 ? i : i == 4 ? 1 : 0]), num1000);
  }
  dropItem && drop(dropItem);
},

// Provides the caste label text for an ant.
casteLabel = ant => castes[ant.caste],

// Provides the caste icon emoji for an ant.
casteIcon = ant => isWorker(ant) ? '🛠️' : isDrone(ant) ? '♂️' : '👑',

// Provides ant's thoughts, though thot can be set at opportune times elsewhere.
antThought = (ant, farm = getFarm(ant), uniqueActs = antUniqueActs(ant), rand = randomInt(3), thot, thotFuncs = [
    // Thots are ordered from high priority to low priority, only the first valid one is used.  "rand" is used to avoid some thoughts ALWAYS blocking others.
    x => ant.inf && ["😘🎮", "✏❓🎨", "🌵📥🍗🍖", "💥👍💥", "🔥🔥👅", "👀👑🌍", "👃💩", "🎨🎾", "🔵🌊", "💪🎀", "👄👄", "💪⚡🐭", "🐛🔜"],
    x => !randomInt(9) && ["Need. More. Crumbs.", "Who moved my dirt?!", "Don't step on me!", "Lost. Again.", "Why is dirt so heavy?", "Ant gym = life", "Who farted in the nest?", "I should be queen", "I licked it, it's mine",
      "My back hurts", "Big foot incoming!", "Too many legs, not enough rest", "Keep calm, carry sugar", "I miss leaf duty", "Where's my antenna charger?", "Smells like danger", "Who named us “ants”?",
      "Why so crumb-y today?", "Dirt in my mandibles", "Smells like home", "Antflix and chill?", "The floor is crumb!", "Dig. Eat. Repeat.", "Antsplain it to me", "Worker of the month (me).", "Mondays… again",
      "What's my purpose?", "I saw a spider!", "Ant-nxiety rising", "Look at me!", "Don't look at me!"],
    X => uniqueActs[0] == 'rest' && ["Zzzzzz…", "I'm sleeping", "Having a nap"],
    X => ant.hp < 20 && [ant.hp < 5 ? "I'm dying" : ant.hp < 10 ? "I feel sick" : "I need a break"],
    X => ant.md < 20 && ["I ain't happy", "I'm having a mood", "I am so annoyed"],
    X => ant.t != farm.t && !farm.coex && ["Oops, wrong colony", "I'm so screwed", "I shouldn't be here"],
    X => !rand && !farmHasQueen(farm) && ["We could really use a Queen", "I wish there was a Queen", "There should be a Queen!"],
    X => !rand && isWorker(ant) && farmHasQueen(farm) && ["Queen's watching… act busy", "Just following orders", "I hear the queen gossiping"],
    X => !rand && isQueen(ant) && ["Who ate my larvae?!", "Carrying? I'm supervising", "It's good to be queen"],
    X => !rand && farm.a.length > 12 && ["Tunnel traffic again", "Our colony is pretty big", "I have so many friends"],
    X => uniqueActs.includes('dig') && ['Off to work…', 'Busy, busy!', 'Got to dig', 'Is this tunnel crooked?', "I'm basically a builder"],
    X => uniqueActs[0] == 'crawl' &&
      (ant.md < 50 && !farmFlairScore(farm) ? ["Not much to see up here", "The scenery is bland", "Could use some scenery"] : // Negative bg scenery feedback.
      farmFlairScore(farm) > 1 && rand ? ["Enjoying the scenery", "Nice stuff up here"] : // Positive bg scenery feedback.
        ["I don't mind the view", "What's up here?"]), // Generic crawl thoughts
    X => uniqueActs[0] == 'pace' &&
      (farmIsDeveloping(farm) && rand ? ["Exploring the surface", "Checking out the area", "Doing a security sweep"] : // Young farm pace thoughts.
        ["Scoping out the farm", "Surveying the ground", "Hey! I'm walking here"]), // Generic pace thoughts
    X => ['dive', 'tunWalk', 'rotWalk'].includes(uniqueActs[0]) &&
      (F.dun ? ["This nest is sweet", "I love my home", "Our colony is great", "Why so many tunnels?"] : // Farm development completed dive thoughts.
      farmIsDeveloping(farm) && rand ? ["Exploring tunnels", "Mapping the nest", "Learning the tunnels"] : // Young farm dive thoughts.
        ["Planning chambers", "Assessing dig sites"]), // Incomplete farm dive thoughts
    X => ["Hmm, what to do?", "What shall I do?"], // Last resort for a thot.
  ]) => (ant.thotD = 0) || pickRandom(thotFuncs.find(f => (thot = f())) && thot),

// Gets a unique list of acts that are in an ant's queue.
antUniqueActs = ant => [...new Set(ant.q.map(a => a.act))],

// Finds an ant to magnify.
antMagnify = (middleAnt, minDistance = 28, lgRect = getEl('lg').getBoundingClientRect(), centerX = (lgRect.x + lgRect.right) / 2, centerY = (lgRect.y + lgRect.bottom) / 2) => {
  F.a.filter(livesInFarm).forEach(ant => {
    let antEl = objGetEl(ant);
    if (antEl) {
      let antBounds = antEl.getBoundingClientRect(),
        distance = calculateDistance(antBounds.x + antBounds.width / 2, antBounds.y + antBounds.height / 2, centerX, centerY);
      if (distance < minDistance) {
        minDistance = distance;
        middleAnt = ant;
      }
    }
  });
  F.a.forEach(a => a != middleAnt && (a.mag = a.flare = 0, antUpdate(a)));
  getEl('l-inf').classList.remove('vis');
  if (middleAnt) {
    middleAnt.mag ||= 1;
    antUpdate(middleAnt);
    getEl('l-head').innerHTML = middleAnt.n;
    query('#l-t .txt').innerHTML = types[middleAnt.t].n + ' ant';
    query('#l-c .txt').innerHTML = casteLabel(middleAnt);
    query('#l-c .emo').innerHTML = casteIcon(middleAnt);
    let formatTime = (ts, h = floor((getTimeSec() - ts) / 3600), m = floor((getTimeSec() - ts) / 60) - (h * 60)) => `<span class="num">${h}</span> h <span class="num">${m}</span> m`;
    query('#l-d .txt').innerHTML = formatTime(middleAnt.ts);
    query('#l-a .txt').innerHTML = middleAnt.hp ? `"<em>${middleAnt.thot}</em>"` : formatTime(middleAnt.death);
    ['rot', 'decay', 'fd', 'dr', 'md', 'hp'].forEach(stat => {
      let bar = query(`#l-${stat} .bar`);
      bar.style.width = `${middleAnt[stat] / 2}px`;
      bar.classList.toggle('hi', middleAnt[stat] > 50);
      bar.classList.toggle('lo', middleAnt[stat] < 20);
      getEl(`l-${stat}`).setAttribute('title', `${stat.toUpperCase()}: ${parseInt(middleAnt[stat])}%`);
    });
    query('#l-md .emo').innerHTML = !middleAnt.hp ? '💀' : middleAnt.md > 50 ? '😃' : middleAnt.md > 20 ? '😐' : middleAnt.md > 10 ? '☹️' : '😡';
    query('#l-hp .emo').innerHTML = middleAnt.hp ? '♥️' : '💔';
    query('#l-a .emo').innerHTML = middleAnt.hp ? '💡' : '☠️';
    getEl('l-inf').dataset.state = middleAnt.state;
    getEl('l-inf').classList.add('vis');
    magInterval ||= setInterval(X => {
      if (++middleAnt.mag > 20) {
        middleAnt.flare = 1;
        antUpdate(middleAnt);
        if (middleAnt.hp-- <= 0) magInterval = stopInterval(magInterval);
      }
    }, num1000);
  }
  else magInterval = stopInterval(magInterval);
},

// Handles dragging the magnifying glass around the farm.
dragGlass = (e, wrapperRect = getEl('wrapper').getBoundingClientRect()) => {
  getEl('l-wrap').style.transform =
    `translate(${clamp((e.clientX || e.touches?.[0].clientX) - 55 - wrapperRect.x, -8, wrapperRect.width - 85)}px, ${clamp((e.clientY || e.touches?.[0].clientY) - 90 - wrapperRect.y, -33, wrapperRect.height - 68)}px)`;
  antMagnify();
},

// Adds dragging functionality to the magnifying glass.
glassAddDrag = e => ['mousemove', 'touchmove'].forEach(e => document.addEventListener(e, dragGlass)),

// Removes dragging from the magnifying glass.
glassRemDrag = e => ['mousemove', 'touchmove'].forEach(e => document.removeEventListener(e, dragGlass)),

// Toggles the display of the magnifying glass.
toggleGlass = (e, lWrap = getEl('l-wrap')) => {
  if (B.classList.contains('glass')) {
    B.classList.remove('glass');
    ['mousedown', 'touchstart'].forEach(e => lWrap.removeEventListener(e, glassAddDrag)),
    ['mouseup', 'touchend'].forEach(e => document.removeEventListener(e, glassRemDrag)),
    stopInterval(magnifier);
    // Remove magnification when turning off.
    F.a.forEach(a => {a.mag = a.flare = 0; antUpdate(a); magInterval = stopInterval(magInterval)});
    getEl('l-inf').classList.remove('vis');
  }
  else {
    B.classList.add('glass');
    ['mousedown', 'touchstart'].forEach(e => lWrap.addEventListener(e, glassAddDrag)),
    ['mouseup', 'touchend'].forEach(e => document.addEventListener(e, glassRemDrag)),
    magnifier = setInterval(antMagnify, 40);
    antMagnify(); // Immediately magnify the ant when turning on
  }
},

// Toggles the carousel functionality.
toggleCarousel = (e, olay = getEl('olay')) => {
  if (B.classList.contains('car')) {
    // Turn off carousel.
    olay.removeEventListener('click', toggleCarousel);
    olay.classList.remove('vis');
    stopInterval(carInterval);
    B.classList.remove('car');
  }
  else if (_.farms.length > 1) {
    if (switcher) {
      // Turn on carousel.
      olay.classList.add('vis');
      olay.addEventListener('click', toggleCarousel);
      carInterval = setInterval(carousel, standardDelay);
      B.classList.add('car');
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
screenWalk = (ant, frameDelay = 0) =>
  ant.x < -40 || ant.x > window.innerWidth + 40 || ant.y < -40 || ant.y > window.innerHeight + 40 ? antDelete(ant) :
    antUpdate(ant) || setTimeout(X => spawner && ant.pose != 'pick' && antMoveDefault(ant, screenWalk), frameDelay),

// Determines if an ant is both captive and passive.
antPassive = ant => livesInFarm(ant) && getFarm(ant).coex,

// Determines if ants should not avoid each other (used when walking in prone pose).
antsCoTarget = (ant, ant2, recip = 0) =>
  ant.carry && ant.carry.Q == ant2.id || // Check if this is an ant serving a queen situation.
  !recip && antsCoTarget(ant2, ant, 1), // Check with roles-reversed.

// Handles random direction prone walking, with collision handling for both modes this is used in.
antMoveDefault = (ant, callback, allowPause = 0, speedMult = 1, rotMult = 1, rand = random(), collision = antCollision(ant)) => {
  ant.walk = 1;
  if (collision) {
    let ant2 = collision.ant;
    if (ant.state == ant2.state && ant.area.n == ant2.area.n && !antsCoTarget(ant, ant2)) {
      if (ant.state == 'free' || ant2.t == ant.t || antPassive(ant)) {
        // Avoid this ant.
        let dist = calcDistComponents(ant2.x, ant2.y, ant.x, ant.y), near = ant.area.n == 'bg' && antBgNear(ant, 1);
        // Extra checks here avoid adjusting the ant into the boundary.
        if (!near) ant.r = normalize360(ant.r - collision.dir * randomInt(20));
        if (!near || dist.x > 0 && near[0] != 90 || dist.x < 0 && near[0] != deg270) ant.x += dist.x;
        if (!near || dist.y > 0 && !near[0] || dist.y < 0 && near[0] != deg180) ant.y += dist.y;
      }
      else antFight(ant, ant2); // Fight!
    }
  }
  else if (rand < .2 && !ant.redir) ant.r = normalize360(ant.r + pickRandom([-2, -1, 1, 2]) * rotMult); // Randomly select an angle for direction change.
  let angleInRadians = degToRad(ant.r - 90), mult = antGetStep(ant) * speedMult
  ant.x += cos(angleInRadians) * mult;
  ant.y += sin(angleInRadians) * mult;
  callback(ant, allowPause && rand < .001 ? (ant.walk = 0, frameTick + randomInt(pauseDelay)) : frameTick); //@todo apply this pausing technique to pace and tunWalk too?
},

// Tests if ant is about to cross a boundary in the bg area and reports which boundary (0 - top, 90 - right, 180 - bottom, 270 - left).
antBgNear = (ant, ignoreAngle = 0, antY = antGetY(ant), offsetX = antOffsetX(ant) * 2) =>
  [[0, antY < -185], [90, ant.x > 960 - offsetX], [deg180, antY > -offsetX], [deg270, ant.x < offsetX]].find(b => b[1] && (ignoreAngle || (abs(normalize180(ant.r - b[0])) < 90))),

// Moves ant to the middle of #F.
antFall = (ant, target, antEl = objGetEl(ant), move = 1.2) => {
  ant.y < target && (ant.y += 1);
  ant.x += ant.x < 450 ? move : ant.x > 490 ? -move : 0;
  if (round(ant.r) < 90) ant.r += 1.2;
  antUpdate(ant, antEl);
  ant.y < target && setTimeout(X => antFall(ant, target, antEl, max(0, move - .02)), frameTick / 2) || antCap(ant, antEl);
},

// Captures an ant into the farm.
antCap = (ant, antEl) => {
  antEl.removeEventListener('mousedown', pickAnt);
  antEl.removeEventListener('touchstart', pickAnt)
  if (ant.state != 'cap') getFarm(ant).stats.cap++;
  ant.state = 'cap';
  ant.ts = getTimeSec();
  setColonyAndFoe(getFarm(ant));
  score(isQueen(ant) ? 3 : 1);
  ant.thot = pickRandom(["Don't touch me!", "Am I kidnapped?", "WTF is going on?", "I'm confused!"]);
  antSurface(ant);
},

// Sets up a fight between two ants.
antFight = (ant, ant2) => !ant.carry && !ant2.carry && antReplaceQ(ant, {act: 'fight', ant: ant2.id}) && ant2.state != 'fight' && antReplaceQ(ant2, {act: 'fight', ant: ant.id}),

// Handles the rotation display of an ant.
antRotate = (ant, antEl) => antEl.style.transform = `scaleX(${ant.scale}) rotate(${ant.r}deg)`,

// Resets an ant to sit properly on the surface level and executes the next item in the queue.
// Note: For newly captured ants this is how the ant's queue is "activated".
// Note: This calls antNext() and should be considered an alternative to calling antNext() in some situations.
antSurface = (ant, scale = getSign(ant.r < deg180), r = normalize360(ant.r)) => {
  antArea(ant, 'top');
  antNext(assign(ant, {r: 90, y: antGroundLevel(ant), scale: scale, pose: 'side', fall: 0, walk: 0, run: 0}));
},

// Gets the ant element that was the target of an event attached to the document (whereas events on the antEl use e.currentTarget instead).
eventAntEl = e => e.target.closest('.ant'),

// Gets a free ant object given the ant element or some object with an id.
getFreeAnt = antEl => getById(_.a, antEl?.id),

// Gets an object by ID.
getAnt = (farm, id) => getById(farm.a, id),

// Searches farms to find a farm ant object given the ant DOM element, or some object with an id, or even just an id.
findAnt = (input, f, a) => {for (f of _.farms) for (a of f.a) if (a.id == input.id || a.id == input) return a},

// Removes an object (must have .id) from a data set in the array at the subscript property, and remove the corresponding DOM element including its cache. Done in a timer, so it doesn't mess up any loops that call this.
deleteDataAndEl = (obj, key = 'a', dataSet = getFarm(obj) || _, id = obj.id, el = getEl(id)) => setTimeout(X => {dataSet[key] = dataSet[key]?.filter(d => d.id != id); el && (el.remove() || del(elCache, id))}, 0),

// Deletes an ant element.
antDelete = ant => deleteDataAndEl(ant),

// Updates the antEl to reflect the state of the object, if possible.
antUpdate = (ant, antEl = objGetEl(ant)) => {

  if (isNaN(ant.x) || isNaN(ant.y) || isNaN(ant.r))
    console.warn("ant is nanned", ant);

  if (antEl && antEl.isConnected) {
    antUpdateClasses(ant, antEl);
    antEl.style.left = ant.x + 'px';
    antEl.style.top = ant.y + 'px';
    antRotate(ant, antEl);
  }
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
    appendHTML(cont, `<div id=${egg.id}></div>`);
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
carryDraw = (carry, ant, cEl = query(`#${ant.id} .c`)) => {
  if (carry.f == F.id) {
    if (carryIsEggOrAnt(carry)) {
      // This assumes the object was already drawn prior to this function running.
      let carryEl = getEl(carry.id);
      carryEl.remove();
      del(elCache, carry.id);
      cEl.appendChild(carryEl);
    }
    else appendHTML(cEl, `<div id=${carry.id} class="carry C${carry.t} ${carry.k}"></div>`);
  }
},

// Undraws a carried item, or moves it from the ant element into the farm container.
carryUndraw = (carry, cont = getFarm(carry), carryEl = getEl(carry)) => {
  if (carryEl && carryEl.isConnected) {
    carryEl.remove();
    carryIsEggOrAnt(carry) && cont.appendChild(carryEl);
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
antOffsetX = (ant, map = {b: 4, s: 6, m: 9, l: 11, x: 11}) => map[anGetSize(ant)],

// Gets the Y offset of "where" an ant is at based on its size.
// Note: because of tunnel widths it would be a bad idea to ever return >=7 from here.
antOffsetY = (ant, map = {b: 1, s: 2, m: 4, l: 5, x: 6}) => map[anGetSize(ant)],

// Gets the Waypoint offset for an ant based on its size.
antOffsetWP = (ant, map = {b: 1, s: 2, m: 3, l: 5, x: 5}) => map[anGetSize(ant)],

// Computes the X value we'll use for some decision making.
antGetX = ant => ant.x + antOffsetX(ant) * ant.scale,

// Computes the Y value we'll use for some decision making - adjusted so that 0 is surface level.
antGetY = ant => antDiveY(ant) - antOffsetY(ant),

// Computes the ant's Y value for a lot of underground related calculations.
antDiveY = ant => ant.y - surface,

// Gets a more accurate x/y coordinate of where the ant's head is with respect to its rotation.
antHeadPoint = (ant, offset = antOffsetX(ant), rad = degToRad((ant.r - 90) * ant.scale)) => ({x: ant.x + cos(rad) * offset, y: ant.y + sin(rad) * offset}),

// Figures out the distance from the surface an ant on a hill would be.
// Note: the divisor for h caps the height, and the outer power sets the steepness of the hill for fine-tuning.
getHillNudge = (l, r, h, x, c = (l + r) / 2, w = (r - l) / 2, xNorm = (x - c) / w) => x < l || x > r ? 0 : h / 2.6 * sqrt(1 - pow(pow(xNorm, 2), .6)),

// Gets the height of a hill at an x-position.
getHillHeight = (x, farm = F, hill = farm.hills.find(h => h.l < x && h.r > x)) => hill ? getHillNudge(hill.l, hill.r, min(50, hill.h), x) : 0,

// Figures out the ant's "ground" level.
antGroundLevel = ant => surface - antOffsetY(ant) - getHillHeight(ant.x, getFarm(ant)),

// Figures out the angle an ant would be due to the sides of hills being steep.
// Note: the actual angle has been divided as the ant would lean unnaturally.
antHillAngle = (ant, hill = getFarm(ant).hills.find(h => h.l < ant.x && h.r > ant.x), l = hill && hill.l, r = hill && hill.r, c = (l + r) / 2, w = (r - l) / 2) =>
  !hill ? 90 : 90 + (radToDeg(Math.atan(-min(50, hill.h) / 3 * ((ant.x - c) / (w * w)) / sqrt(1 - pow((ant.x - c) / w, 2)))) * -ant.scale / 3),

// Adds to finna queue.
antFinna = (ant, act, args) => ant && act && ant.q.push(assign({act: act}, !args ? {} : typeof args != 'object' ? {tx: args} : args)),

// Adds to finna queue, but checks if ant needs to transition via the surface level first by either uncrawling or climbing.
// Only use this for actions that can be triggered from the top area (see acts.top), even if they won't go via the top.
// If ant is allowed to short-cut without going to the top first then use the n argument to set the destination's area.
// See goToLocation() for a more robust method of moving ants between areas.
antFinnaViaTop = (ant, act, args) => {
  if (!args?.n || ant.area.n != args.n) {
    ant.area.t && antFinna(ant, 'climb');
    ant.area.n == 'bg' && antFinna(ant, 'uncrawl');
  }
  antFinna(ant, act, args);
},

// Chooses a random action for the ant to perform based on where it is.
antFinnaRandom = (ant, nonDefault, deny = {Q: ['dig', 'rest'], D: ['dig']}) =>
  antFinna(ant, pickRandom(keys(acts[ant.area.n]).filter((key, i) => acts[ant.area.n][key] && (!nonDefault || i > 0) && !deny[ant.caste]?.includes(key)))),

// Prepends a custom queue or queue item to finna queue.
antInstaQ = (ant, queueItems, keepFirst = 1) => ant.q = [...keepFirst ? [ant.q.shift()] : [], ...(Array.isArray(queueItems) ? queueItems : [queueItems]), ...ant.q],

// Replaces queue.
antReplaceQ = (ant, queueItems) => ant.q = antInstaQ({q: []}, queueItems, 0),

// Delegates an ant action.  Importantly; calls an antUpdate() so that anything that calls antAction doesn't have to first do an antUpdate().
// Done in a timer to prevent exceeding callstack and handle framerate speed by default.
antAction = (ant, timeout = frameTick, action = ant.q[0]?.act || 'idle') => antUpdate(ant) || !stopAnts && (livesInFarm(ant) || action == 'die') && setTimeout(X => act[action](ant), timeout),

// Does next action in finna queue.
// Most notably this calls antAction() and is often the logical alternative to calling antAction() directly.
antNext = (ant, timeout) => {ant.q.shift(); antAction(ant, timeout); if (ant.thotD) ant.thot = antThought(ant)},

// Adds a tracker to quickly determine where ant is. Includes a duration used in some areas, or a tunnel ID for the bottom.
antArea = (ant, area, tun) => ant.area.n == area && ant.area.t == tun ? ant.area.d++ : ant.area = {n: area, d: 0, t: tun},

// Calculates the size of an ant step with impediments and lethargy.
antGetStep = ant => ant.scale * (
  types[ant.t].v
  - (ant.hp < 10 ? .12 : ant.hp < 20 ? .06 : ant.hp < 40 ? .03 : 0)
  - (ant.md < 10 ? .24 : ant.md < 20 ? .12 : ant.md < 40 ? .06 : 0)
  - (ant.q.length < 2 ? .2 : 0)
  - (isQueen(ant) ? .4 : 0)
) * (ant.run || 1), // ant.run is independent of and cumulative to other speed multipliers and can be 0/1/undefined for normal speed, <1 for slow, or >1 for fast.

// Calculates the step size in a tunnel.
antGetTunnelStep = ant => abs(antGetStep(ant)) / 2,

// Ant takes one step along the surface.
antMoveSurface = ant => {
  ant.x += antGetStep(ant);
  ant.y = antGroundLevel(ant);
  ant.r = antHillAngle(ant);
},

// Gets the next spot to step to in the tunnel.
antMoveTunnel = (ant, step = antGetTunnelStep(ant), ang = degToRad((ant.scale < 0 ? flipAngle(ant.r) : ant.r) - 90)) => {
  ant.x += cos(ang) * step;
  ant.y += sin(ang) * step;
},

// Works out the ant step size on 2-axis when travelling at an angle between two points.
getPointToPointStep = (x1, y1, x2, y2, step, dist = calcDistComponents(x1, y1, x2, y2)) => ({x: dist.x * step, y: dist.y * step}),

// Get the entrance point of a tunnel.
getEntrancePoint = (tun, margin = 0, pos = 0, distance = 6, distComp = calcDistComponents(tun.x1, tun.y1, tun.x2, tun.y2),
  actualDistance = min(distance, distComp.d * (tun.prog / 100)), offset = (tun.h / 2 - margin) * -pos) =>
  ({x: tun.x1 + distComp.x * actualDistance - distComp.y * offset, y: tun.y1 + distComp.y * actualDistance + distComp.x * offset}),

// Find where con overlaps with nextTun along nextTun's middle line.
getConnectionPoint = (con, nextTun, dist = calcDistComponents(nextTun.x1, nextTun.y1, nextTun.x2, nextTun.y2), offset = 1 + con.w / 2,
  [x0, y0, s] = con.x1 == nextTun.x1 && con.y1 == nextTun.y1 ? [nextTun.x1, nextTun.y1, offset] : [nextTun.x2, nextTun.y2, -offset]) =>
  ({x: x0 + dist.x * s, y: y0 + dist.y * s}),

// Gets the index of the closest waypoint to an ant or a previous waypoint.
getWaypointIndex = (farm, obj, wps = wayPoints[farm.id], threshold = 10, exact = wps?.indexOf(obj)) =>
  exact < 0 ? wps.reduce((best, wp, i, a, d = calculateDistance(obj.x, obj.y - (obj.r ? surface : 0), wp.x, wp.y)) => (d < best.d && d < threshold) ? {d, i} : best, {d: Infinity, i: -1}).i : exact,

// Gets the next waypoint relative to the current one.
getNextWaypoint = (farm, curr, dir = 1, currIndex = getWaypointIndex(farm, curr), nextIndex = currIndex + dir) =>
  nextIndex >= 0 && nextIndex < wayPoints[farm.id].length && calculateDistance(curr.x, curr.y, wayPoints[farm.id][nextIndex].x, wayPoints[farm.id][nextIndex].y) < 8 ? wayPoints[farm.id][nextIndex] : 0,

// Gets the waypoint direction vector for the ant.
getAntWaypointDirection = (farm, ant, fakeAnt = {x: ant.x, y: ant.y, scale: ant.scale, r: ant.r}) =>
  antMoveTunnel(fakeAnt, 8) || getSign(getWaypointIndex(farm, fakeAnt) > getWaypointIndex(farm, ant)),

// Gets average angle of a set of waypoints.
getWaypointAngle = (points, sumX = 0, sumY = 0, i = 0) => {
  for (; i < points.length - 1;) {
    let p1 = points[i], p2 = points[++i], a = atan2(p1.y - p2.y, p2.x - p1.x);
    sumX += cos(a);
    sumY += sin(a);
  }
  return normalize360(90 - angleFromDelta(sumX, sumY));
},

// Determines if ant will collide with a waypoint in front of it.
antWaypointCollision = (farm, ant, wp, angle) => {
  for (wp of wayPoints[farm.id]) {
    if (calculateDistance(ant.x, antDiveY(ant), wp.x, wp.y) < 30) {
      angle = angleFromDelta(wp.x - ant.x, wp.y - antDiveY(ant), 90 - ant.r);
      if (angle < 10 || angle > 350) return 1; // Waypoint is within the forward "cone" tolerance.
    }
  }
},

// Calculates if two specific ants are in proximity.
antsInProximity = (ant1, ant2, prox) => ant1.id != ant2.id && calculateDistance(ant1.x, ant1.y, ant2.x, ant2.y) < prox,

// Finds an ant that is within proximity of supplied ant.
//@TODO this is only used once so far, and it is used as a .some not a .find.
antProximity = (ant, farm, prox = 20) => farm.a.find(a => antsInProximity(a, ant, prox)),

// Determines if ant will collide with any others.  Optionally pass in an ant array to only check that group of ants.
antCollision = (ant, ants = ant.f ? getFarm(ant).a : _.a, a, angle) => {
  for (a of ants.filter(other => !ant.area && !other.area || ant.area.n == other.area.n)) {
    if (antsInProximity(a, ant, 25)) {
      angle = antToAntAngle(ant, a);
      return angle < 30 || angle > flipAngle(30) ? {ant: a, dir: getSign(angle < deg180)} : 0;
    }
  }
},

// Determines if an ant in a tunnel is nearby an enemy ant.
antTunFoeNear = (ant, tun, farm, a) => {
  if (farm.foe)
    for (a of farm.a.filter(other => ant.t != other.t && (tun.id == other.area.id || tun.co.includes(other.area.n))))
      if (antsInProximity(a, ant, 60)) return {ant: a, ang: antToAntAngle(ant, a), dir: getSign(antToAntAngle(ant, a) > deg180)};
},

// Determines the angle of one ant to another.
antToAntAngle = (ant, ant2) => normalize180(getAngle(ant, ant2, -ant.r - 90)),

// Determines if ant is in proximity of any placed items.
//@TODO this is only used once so far, and it is used as a .some not a .find.
antItemProximity = (ant, farm, prox = 20) => farm.items.find(i => calculateDistance(ant.x, ant.y, i.x, i.y + i.h / 2) < i.w / 2 + prox),

// Inverts an ant's angle if it has a negative scale.
antProneCorrection = ant => {
  if (ant.scale < 0) {
    ant.scale = 1;
    ant.r = flipAngle(ant.r);
  }
},

// Determines the side of a tunnel a point is at.  Not reliable if point is in the middle of the tunnel.
tunGetSide = (tun, point) => getSign((tun.x2 - tun.x1) * (point.y - tun.y1) - (tun.y2 - tun.y1) * (point.x - tun.x1) < 0),

// Corrects an ant's orientation based on which side of a tunnel it is on.
// Important: wp is frequently passed in and not calculated here - an easy thing to forget when debugging!
antSideCorrection = (ant, tun, wp = wayPoints[ant.f][getWaypointIndex(getFarm(ant), ant)], action = ant.q[0]) => {
  // Note: You'd think we'd use tun.r to snap the ant to the exact angle, but no, that's just as troublesome.
  if (ant.scale != tunGetSide(tun, wp || {x: ant.x, y: antDiveY(ant)}) * getSign(action.rev)) {
    ant.scale *= -1;
    ant.r = mirrorAngle(ant.r);
    if (antDir(ant, tun) == action.rev) ant.r = oppositeAngle(ant.r);
  }
},

// Returns true if ant is facing forward along the tunnel, false if backward.
antDir = (ant, tun, antAngle = degToRad(ant.r - 90)) => (cos(antAngle) * ant.scale * (tun.x2 - tun.x1) + sin(antAngle) * (tun.y2 - tun.y1)) > 0,

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
antNudgeToWP = (ant, wp, nudge, dx = wp.x - ant.x, dy = wp.y - antDiveY(ant), dist = hypot(dx, dy), diff = dist - antOffsetWP(ant), step = sign(diff) * min(abs(diff), nudge * (diff < 0 ? 2 : 1))) => {
  if (dist) {
    ant.x += (dx / dist) * step;
    ant.y += (dy / dist) * step;
  }
},

// Nudges an ant to middle of tunnel, changes to prone pose, and performs correction.
antToProneWithCorrection = (ant, tun) => {antNudgeToMid(ant, tun, antOffsetWP(ant)); ant.pose = 'prone'; antProneCorrection(ant)},

// Nudges an ant to waypoint along tunnel, changes to side pose, and performs correction.
antToSideWithCorrection = (ant, tun, wp) => {antNudgeToWP(ant, wp, 2); ant.pose = 'side'; antSideCorrection(ant, tun, wp)},

// Determines if an ant is within range of a waypoint to make landings, etc...
antWaypointRange = (ant, wp, mult = 1) => wp && calculateDistance(wp.x, wp.y, ant.x, antDiveY(ant)) < antOffsetX(ant) * mult, // Note: antOffsetX() just happens to be a nice amount.

// Determines whether a tunnel is of a centered rotation type.
isRotationTunnel = tun => tun.t == 'con' || tun.t == 'ent',

// Determines which tun we should consider the ant to be in and roughly at what percent along.  Optionally pass a tun in to limit searches to that one and directly connected tuns.
antGetTunPosition = (ant, ignoreTun = 0, limitTun = 0, desire = 0, margin = 2,
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
      let hw = tun.w / 2 + margin, hh = tun.h / 2 + margin, rad = degToRad(tun.r - (tun.t == 'cav' ? 0 : 90)), cosA = cos(rad), sinA = sin(rad);
      // Check if ant is inside the rotated rectangle.
      if (pointInQuad({x: ant.x, y: antDiveY(ant)}, [{x: -hw, y: -hh}, {x: hw,  y: -hh}, {x: hw,  y: hh}, {x: -hw, y: hh}].map(c => ({x: (tun.x1 + tun.x2) / 2 + c.x * cosA - c.y * sinA, y: (tun.y1 + tun.y2) / 2 + c.x * sinA + c.y * cosA})))) {
        let dxLine = tun.x2 - tun.x1, dyLine = tun.y2 - tun.y1;
        return {tun, pc: clamp(((ant.x - tun.x1) * dxLine + (antDiveY(ant) - tun.y1) * dyLine) / (dxLine * dxLine + dyLine * dyLine), 0, 1) * 100};
      }
    }
  }
  // If at this point in the function and didn't find a tun and limitTun was passed in, try again without limitTun or desire.
  return limitTun ? antGetTunPosition(ant, ignoreTun) : 0;
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

// This is a test function and has no been confirmed to work
// Potential problems: doesn't account for tun.r orientation of different types of tunnels.
// not refactored yet.
tunFloor = (tun, pc, yOffset = 0) => {
  const r = degToRad(tun.r);
  const midX = tun.x1 + (tun.x2 - tun.x1) * (pc / 100);
  const midY = tun.y1 + (tun.y2 - tun.y1) * (pc / 100);
  const floorDir = cos(r) >= 0 ? 1 : -1; // choose which side is "down" in world coords
  return {
    x: midX - sin(r) * (tun.h / 2) * floorDir,
    y: midY + cos(r) * (tun.h / 2) * floorDir - yOffset
  };
},

// Slips an ant off the bg area.
antSlip = ant => antReplaceQ(ant, {act: 'slip'}) && antAction(ant),

// Handles an ant's end of life transition.
antDeath = (ant, cause, farm = getFarm(assign(ant, {
    cause: cause,
    state: 'dead',
    death: getTimeSec(), // Use this to decompose the ant.
    rot: 0,
    decay: 0,
    eaten: 0,
    walk: 0,
    jit: 0,
    dig: 0,
  }))) => {
  farm.stats.death[cause]++;
  msg(ant.n + ` died in "${farm.n}" ${deathCauses[cause]}.`, 'err');
  setColonyAndFoe(farm);
  if (cause == 'fight' && farm.a.length === 1 && isQueen(farm.a[0])) farm.sweep = 1;
  save();
},

// Returns a random worker, or failing that - a queen.  Must be in OK health.
getWorkerOrQueen = farm => pickRandom(farm.a.filter(a => isWorker(a) && livesInFarm(a) && a.hp > 50) || farm.a.filter(a => isQueen(a) && livesInFarm(a) && a.hp > 50)),

// Determines what, if anything, needs to be carried by a random worker.
trySetCarryTask = (farm, morgue = farm.tuns.find(t => t.morgue), morgueCandidates = farm.tuns.filter(t => t.t == 'cav' && !t.nip && t.co.length < 2 && t.prog == 100),
  carrierAnt = getWorkerOrQueen(farm),
  deadAnt = farm.a.find(a => a.state == 'dead' && !getTun(antGetTunPosition(a)?.tun)?.morgue), infant = farm.a.find(a => a.moveTo), egg = farm.e.filter(e => {
    let queen = farm.a.find(a => a.id == e.Q && livesInFarm(a));
    return queen && queen.nest && e.tun != queen.nest || e.moveTo; // No need to check if egg is in morgue because queen will move her nest soon if that's the case.
  }).sort((a, b) => b.lvl - a.lvl)[0]) => {

  // Recalculate where the morgue should be.
  if (!morgue || !morgueCandidates.includes(morgue)) {
    // Pick a new morgue.
    if (morgue) morgue.morgue = 0;
    if (!morgueCandidates) morgueCandidates = farm.tuns.filter(t => t.t == 'cav' && t.prog == 100); // Loosen requirements.
    if (morgueCandidates) {
      morgue = pickRandom(morgueCandidates);
      morgue && (morgue.morgue = 1);
    }
  }
  if (carrierAnt && !antUniqueActs(carrierAnt).some(act => ['carry', 'srv'].includes(act))) {
    // Move a dead ant not in the current morgue.
    if (deadAnt && morgue) antFinna(carrierAnt, 'carry', {t: 'dead', id: deadAnt.id}); // A dead ant needs to be moved!
    // Move the egg with the highest lvl that is not in its queen's nest.
    else if (infant) antFinna(carrierAnt, 'carry', {t: 'inf', id: infant.id}); // An infant needs to be moved!
    else if (egg) antFinna(carrierAnt, 'carry', {t: 'egg', id: egg.id}); // An egg needs to be moved!
  }
  else {
    // We found no ant to perform the carry task.  Last chance: If there's a worker in a vial, call them back out so there's a shot at giving them the task on the next pass.
    // Note: queen is never called back?  If we want her called back then update getWorkerOrQueen with respect to the data storage and state check to support selecting nip ants.
    carrierAnt = getVial(farm)?.item.a.find(a => isWorker(a)) && exitVial(carrierAnt);
  }
},

// Sends an ant to care for an egg or larvae.
care4kids = (farm, carerAnt = getWorkerOrQueen(farm),
    target = pickRandom([farm.e.sort((a, b) => a.hp - b.hp)[0], farm.a.filter(a => a.inf).sort((a, b) => a.hp - b.hp)[0]].filter(Boolean)), // Randomly pick either a low hp egg or infant.
    isInf = target?.inf) => {
  if (target) {
    isInf ? antGoToAnt(carerAnt, target) : goToLocation(carerAnt, makeDiveStub({tun: target.tun, pc: target.pc, pos: 'dn'}));
    antFinna(carerAnt, 'care', {t: isInf ? 'inf' : 'egg', id: target.id});
  }
},

// Sets the colony and foe values for the current farm.
setColonyAndFoe = farm => {farm.t = !farm.coex && colonyType(farm); farm.foe = !farm.coex && farm.a.some(a => livesInFarm(a) && a.t != farm.t)},

// Gets the vial stuff from the nipples.
getVial = farm => farm.nips.find(n => n.item.k == 'vial'),

// Tells an ant to exit a vial.
exitVial = (ant, farm = getFarm(ant), nipData = getVial(farm)) => {
  // Perform a phase 3 nipWalk.
  antNipWalk(ant, -25, 3);
  // Repeatedly check the nipWalk moved the ant to phase 5 and then deNip() it.
  let exitInterval = setInterval(X => {
    if (ant.nipPh == 5) {
      deNip(ant, nipData, farm);
      stopInterval(exitInterval);
    }
  }, microDelay);
},

// Handles ant walking into an item attached to a nip, to a certain destination.
antNipWalk = (ant, dest, basePhase = 0, animLoop = setInterval(X => {
  assign(ant, {
    nipPh: 1 + basePhase, // Flag that walk is happening.
    walk: 1,
    scale: getSign(dest > ant.x),
    r: ant.x < 20 || ant.x > 32 ? 90 : 90 + ant.scale * getAngle({x: 20, y: 32}, {x: 32, y: 38}) * .5, // Actual angle nerfed to half because it looked too intense.
    x: ant.x + antGetStep(ant) / 2,
    y: (ant.x < 20 ? 28 : ant.x > 32 ? 38 : 32 + 6 * (abs(ant.x - 20) / 24)) - antOffsetY(ant),
    nipTs: getTime()
  });
  if (abs(ant.x - dest) < antOffsetX(ant)) {
    ant.walk = 0;
    ant.nipPh = 2 + basePhase; // Flag ant is ready for next phase.
    del(ant, 'nipTs');
    stopInterval(animLoop);
  }
  antUpdate(ant);
}, frameTick)) => 1,

// Provides the vial animation activity. Makes ants walk into the vial and then randomly do random things.
// Curiously this code has no need to know which vial or farm the ant is in.
vialActivity = ant => {
  !ant.nipPh && antNipWalk(ant, 40 + randomInt(170)); // Ant has not begun their vial walk yet.
  ant.nipPh === 1 && getTime() - ant.nipTs > longDelay && antNipWalk(ant, 40 + randomInt(170)); // Ant was stuck in nipPh 1.
  del(ant, 'carry');
  if (!randomInt(3)) {
    let rand = randomInt(6);
    if (ant.nipPh > 1) {
      if (rand > 1) {
        // Location change.
        ant.r = 90;
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
        else {
          ant.pose = 'side';
          ant.scale = getSign(ant.r < deg180);
          ant.r = 90;
          ant.y = 36 - antOffsetY(ant);
        }
      }
      antUpdate(ant);
    }
  }
},

// Starts a vial animation loop if it isn't running already.  Also activates an antNipWalk() into the vial when first run.
vialLoop = X => vialInterval ||= setInterval((hasAnts = 0) => {
  _.farms.forEach(farm => getVial(farm)?.item.a.forEach(a => {hasAnts = 1; !a.inf && vialActivity(a)}));
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
  if (!ant.nipPh || ant.nipPh === 1 && getTime() - ant.nipTs > longDelay) antNipWalk(ant, 600); // Phase 0.
  else if (ant.nipPh == 2) {
    // Phase 2.
    // Move ant to other half of tube.
    transferObject(otherFarm, 'a', ant, nipItem, otherData.item, {nipPh: 3}, otherNipEl);
  }
  else if (ant.nipPh == 3 || ant.nipPh == 4 && getTime() - ant.nipTs > longDelay) antNipWalk(ant, -25, 3); // Phase 3.
  else if (ant.nipPh == 5) deNip(ant, nipData, farm); // Phase 5.
},

// Starts a tube animation loop if it isn't running already.
tubeLoop = X => tubeInterval ||= setInterval((hasAnts = 0) => {
  _.farms.forEach(farm => farm.nips.forEach(nipData => nipData.item.k == 'tube' && nipData.item.a.forEach(a => {hasAnts = 1; !a.inf && tubeWalker(farm, nipData, a)})));
  if (!hasAnts) tubeInterval = stopInterval(tubeInterval);
}, microDelay),

// Ant actions come in a namespaced package so that the action names can be compared to strings.
// Also includes things that the ants "do" to support actions.
act = {

  // Ant is stunned while it chooses what to do next.
  idle: ant => {
    // Queue default action.
    ant.q.length < 2 && antFinna(ant, keys(acts[ant.area.n])[0]);
    (ant.q[0].act == 'idle' || ant.q[1] ? antNext : antAction)(ant, randomInt(shortDelay)); // Note: sometimes idle is a "phantom" action with no corresponding queue item, so this handles that.
    save();
  },

  // Ant explores the ground level of the ant farm (default activity).
  // @TODO handle bumping into foreign ants / fighting / corpses. --- normally ants just pass each other but if farm.foe is truthy it is possible they are an enemy.
  pace: (ant, antX = antGetX(ant), action = ant.q[0], nextAction = ant.q[1], xOffset = antOffsetX(ant), rand = antX < xOffset || antX > 960 - xOffset ? 0 : random()) => {
    ant.walk = 1;
    ant.pose = 'side';
    antArea(ant, 'top');
    // Main loop.
    // Check if the ant is set to reach a certain target and hand it off to another action.
    // Note: This code assumes .tx is never set to 0.
    if (!action.for && nextAction && (!nextAction.tx || abs(nextAction.tx - antX) < antOffsetX(ant))) {
      ant.walk = 0;
      antNext(ant, randomInt(microDelay));
    }
    else {
      // Move ant.
      action.for && action.for--;
      antMoveSurface(ant);
      if (!nextAction && rand < .0002 || nextAction?.tx && (nextAction.tx - (antX + ant.scale * antOffsetX(ant))) * ant.scale < 0) {// Random or heading the wrong way.
        // Flip direction (with brief pause).
        ant.walk = 0;
        antAction(ant, randomInt(microDelay));
        ant.scale *= -1; // <-- Yes, this has to be here after antAction() to set up the next loopback, rather than do it right away.  Looks better.
      }
      else if (rand < .001) {
        // Pause.
        ant.walk = 0;
        antAction(ant, randomInt(pauseDelay));
      }
      else antAction(ant);
    }
  },

  // Start or continue digging.
  dig: (ant, farm = getFarm(ant), currentDig = getById(farm.dig, ant.digT) || pickRandom(farm.dig), action = ant.q[0], tun = getTun(farm, action.id), antType = types[ant.t],
    digAmt = antType.v * .2, nudger,
    entNudge = (ant, tun) => nudger = setInterval(X => {
      // This could be improved by having the ant dip into the tunnel when it is deep enough ?
      ant.x += getSign(antGetX(ant) < tun.x1) * random();
      ant.y = antGroundLevel(ant) + 2;
      ant.r = antHillAngle(ant) + tun.prog / 9 + randomInt(5);
      antUpdate(ant);
    }, num200),
    conNudge = (ant, tun, sumX = 0, sumY = 0, rad, finalAngle) => {
      // Turn ant towards a random point that is roughly facing away from the already-dug tunnels.
      farm.tuns.filter(t => t.prog == 100 && t.co.includes(tun.id)).map(ct => getAngle(tun, (ct.x1 == tun.x && ct.y1 == tun.y) ? {x: ct.x2, y: ct.y2} : {x: ct.x1, y: ct.y1})).forEach(a => {
        rad = degToRad(a - 90);
        sumX -= cos(rad);
        sumY -= sin(rad);
      });
      finalAngle = min(normalize180(angleFromDelta(sumX, sumY) + randomInt(90) - ant.r), randomInt(15));
      nudger = setInterval(X => {
        let distComp = calcDistComponents(ant.x, antDiveY(ant), tun.x1, tun.y1);
        if (distComp.d > .2) {
          ant.x += distComp.x * .2;
          ant.y += distComp.y * .2;
          antUpdate(ant);
        }
        else {
          ant.r += finalAngle;
          stopInterval(nudger);
        }
        antUpdate(ant);
      }, frameTick);
    }) => {
    if (farm.dun || isDrone(ant)) antNext(ant); // No digging required.
    else if (ant.digD && tun) {
      ant.digT = tun.id;
      ant.walk = 0;
      setTimeout(X => {ant.dig = ant.jit = 1; antUpdate(ant)}, randomInt(num1000)); // Random delay added so ants aren't synch'd on page load.
      tun.rwip = !isRotationTunnel(tun) && farm.tuns.some(t => t.prog == 100 && t.x1 == tun.x2 && t.y2 == tun.y2); // Mark tunnels that are being build backwards.
      // Digging movement and animations.
      if (!farmIsDeveloping(farm) && farmHasQueen(farm)) digAmt *= 1.5; // Ants dig faster if there is a Queen and farm is undeveloped.
      if (isQueen(ant)) digAmt *= 3; // Queens only dig when there are no workers, but do it much faster.
      if (!isRotationTunnel(tun)) {
        digAmt *= (tun.t == 'cav' ? .1 : .3); // Long tunnels are dug slow, with cav chambers the slowest of all.
        if (tun.prog < tunPercent(tun, 8)) {
          // Ant would have been blocked from entering tunnel by the dive action, so continue to act like it's digging an entrance or con.
          tun.co.includes(action.ent) ? entNudge(ant, getTun(farm, action.ent)) : conNudge(ant, farm.tuns.find(t => tun.co.includes(t.id) && t.t == 'con' && t.prog == 100));
        }
        else {
          // Default nudger; just brings the ant closer to the edge of the dig area every 2 seconds if needed.
          nudger = setInterval(X => {
            let antTunPos = antGetTunPosition(ant, 0, tun);
            if (antTunPos && antTunPos.pc + antOffsetY(ant) < (tun.rwip ? 100 - tun.prog : tun.prog)) antMoveTunnel(ant);
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
        tun.prog = min(100, tun.prog + digAmt);
        tun.t == 'ent' && tun.co.forEach(t => t.prog = tunPercent(t, tunPixels(tun, tun.prog / 2))); // For entrances also increment the connected tunnels like they've been dug a little too, or it takes too long.
        currentFarm(farm) && tunProgDraw(tun);
        if (tun.t == 'tun' || tun.t == 'cav') {
          // Pick an adjacent hill and increase its height slightly.
          // To know it is adjacent; the hill should have the same index as the current tunnel system, or one higher.
          let hill = farm.hills[farm.tuns.findIndex(t => t.id == action.ent) + randomInt(1)];
          hill.h += .005;
          setTimeout(X => currentFarm(farm) && hillProgDraw(hill), standardDelay);
        }
        // Track how long ant has been digging.
        ant.digD++;
        // Digging depletes ant's stats.
        antStats(ant, {fd: -.005, dr: -.003, hp: -.01});
        // Remove digging behaviour here, it'll be reapplied if a loopback via antAction() occurs.
        stopInterval(nudger);
        ant.jit = ant.dig = 0;
        // The ant will stop digging if...
        // There was no tunnel found to dig, or the current tunnel piece is finished.
        // On a RANDOM chance when one of the following conditions is met: Dig duration is high, or queue exists.
        // Or there are at least 3 ants working on the same tunnel.
        if (tun.prog == 100 || ((ant.digD > 5 || ant.q[1]) && !randomInt(5)) || farm.a.filter(a => a.digD && a.digT == ant.digT) > 3) {
          if (tun.prog == 100) {
            // Remove this tunnel piece from the dig list.
            farm.dig = farm.dig.filter(d => d.id != tun.id);
            del(ant, 'digT');
            if (tun.t == 'ent') {
              playerHint(farm, [`Ants have dug a tunnel entrance in "${farm.n}"`]);
              score(1);
            }
            else if (tun.t == 'tun') {
              playerHint(farm, [`A connection tunnel has been completed in "${farm.n}"`]);
              score(2);
            }
            else if (tun.t == 'cav') {
              playerHint(farm, [`A new chamber cavity has been finished in "${farm.n}"`]);
              score(5);
            }
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
      // Pick the tunnel the ant will dig, preferring the last tunnel it was digging, otherwise choose one another ant was digging.
      // If none was picked, or there is only one to choose from plus random chance, find where ant could dig.
      if (!currentDig || farm.dig.length < 2 && !randomInt(25)) {
        // Pick a random entrance and find an unstarted tunnel that it leads to.
        let ent = pickRandom(farm.tuns.filter(t => t.t == 'ent' && t.prog == 100)); // Inverted match.
        if (path = ent && randomInt(9) && findPath(farm, ent, {prog: 100, t: 'ent'}, [], 1, 1)) farm.dig.push(currentDig = path.length ? {n: 'bot', id: last(path), ent: ent.id} : {n: 'top', tx: ent.x1, id: ent.id, ent: ent.id});
        else {
          // Dig a new entrance.
          let ent = pickRandom(farm.tuns.filter(t => t.t == 'ent' && t.prog < 100));
          if (ent) farm.dig.push(currentDig = {n: 'top', tx: ent.x1, id: ent.id, ent: ent.id});
          else if (!farm.tuns.some(t => t.prog < 100)) farm.dun = 1; // Nothing more to do.
        }
      }
      if (currentDig) {
        let tun = getTun(farm, currentDig.id);
        currentDig.pc = tun.prog;
        goToLocation(ant, makeDiveStub(currentDig));
        antFinna(ant, 'dig', currentDig);
      }
      save();
      antNext(ant);
    }
  },

  // Climb sets up a dive path to the surface.
  climb: (ant, farm = getFarm(ant), climbQ = []) => {
    if (ant.area.t) {// Sometimes climb is in an ant's queue erroneously :/
      let tun = getTun(farm, ant.area.t), path = findPath(farm, tun, {t: 'ent'}, [], 0, 1);
      // Create a custom queue.
      if (!path && tun.t == 'con' && tun.prog <= 15) { // Sometimes the ant is wrongly pinpointed to be in an unbuilt con from which the path finder fails.
        let tunPos = antGetTunPosition(ant, ant.area.t);
        antArea(ant, 'bot', tunPos.tun.id);
        path = findPath(farm, tunPos.tun, {t: 'ent'}, [], 0, 1);
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
      nextTun = nextAction?.act == 'dive' && getTun(farm, nextAction.id), wp = wayPoints[farm.id] && wayPoints[farm.id][getWaypointIndex(farm, ant)], tunPos,
      executeAction = 1, nextTunAngle = nextTun ? nextTun.r : 0, fakeAnt = cloneData(ant),
      badAngle = (ant.scale * (nextTun?.r - deg180)) > 90
  ) => {
    if (action.id && tun) {// Sometimes tun is invalid, haven't looked into it.
      // This is a fully expanded dive queue; determine destinations.
      if (!isRotationTunnel(tun) && tun.prog < tunPercent(tun, 8) || isRotationTunnel(tun) && (nextTun?.prog < tunPercent(nextTun, 8) || tun.prog < 100)) return antNext(ant); // Protect against entering underbuilt tunnels.
      if (tun.t == 'ent') {
        if (ant.area.n == 'top') action.dest = getEntrancePoint(nextTun, antOffsetY(ant), badAngle ? 0 : -ant.scale); // Entering from surface.
        else {
          // Ant is about to surface; predict how it should end up.
          !action.pt && antToProneWithCorrection(ant, tun, action.rev);
          fakeAnt.scale = ant.pose == 'prone' ? randomSign() : tunGetSide(getTun(farm, action.pt), getWaypointIndex(farm, ant)) * -1;
          fakeAnt.x = (fakeAnt.scale > 0 ? max : min)(ant.x, tun.x1) + 7 * fakeAnt.scale;
          fakeAnt.y = antGroundLevel(fakeAnt);
          action.dest = {x: fakeAnt.x, y: antDiveY(fakeAnt)};
          nextTunAngle = antHillAngle(fakeAnt);
          if (fakeAnt.scale < 0) nextTunAngle = normalize360(nextTunAngle + deg180);
          action.sc = fakeAnt.scale;
        }
        // Flag a rotWalk.
        executeAction = 2;
      }
      else if (tun.t == 'con') {
        if (ant.pose == 'prone') {
          // Just rotWalk to the next tunnel.
          action.dest = getConnectionPoint(tun, nextTun);
          if (nextTun.t == 'cav') action.dest.y += randomInt(8) - 4; // Randomize it a bit for cavities.
          // Flag a rotWalk.
          executeAction = 2;
        }
        else if (nextTun) {
          // Figure out where the ant will wind up if it continues in side pose.
          do {
            wp &&= getNextWaypoint(farm, wp, getAntWaypointDirection(farm, ant));
            tunPos = wp && antGetTunPosition({x: wp.x, y: wp.y + surface, f: farm.id}, 0, tun);
          } while (tunPos && (tunPos.tun.id == tun.id || tunPos.tun.id == action.pt));
          if (tunPos?.tun.id != nextTun.id) {
            // Ant is creeping toward wrong tunnel - switch to prone to make a proper turn, and loopback to this function.
            antToProneWithCorrection(ant, tun, action.rev);
            return antAction(ant);
          }
          // NOTE: At this point the execution should fall through to the "if (executeAction > 1) {" part of the code.
        }
      }
      if (nextTun) nextAction.pt = tun.id; // Notify the next action of the previous tunnel.
      if (executeAction > 1) {
        // Rot Walk execution.
        // Work out step (step size) and dist (num steps / frames).
        action.step = getPointToPointStep(ant.x, ant.y, action.dest.x, action.dest.y, antGetTunnelStep(ant));
        action.dist = round(hypot(action.dest.x - ant.x, action.dest.y - (action.r ? ant.y : antGetY(ant))) / hypot(action.step.x, action.step.y));
        // Switch to prone when entering tunnel from surface at a badAngle.
        badAngle && setTimeout(X => {ant.pose = 'prone'}, action.dist / 2 * frameTick);
        if (nextTun?.t == 'cav') nextTunAngle += 90; // Cav chambers use a different coordinate system :/
        if (ant.area.n == 'top') ant.r = 90; // Normalize angle of surface level ants to prevent over-rotation.
        if (tun.t == 'ent') action.dist *= .8; // Speed up entry transitions.
        if (tun.x1 == nextTun?.x2 && tun.y1 == nextTun?.y2) nextTunAngle = oppositeAngle(nextTunAngle); // Correct for going the other way through tunnels.
        assign(action, {
          r: normalize180(ant.r), // Initial angle.
          td: action.dist, // Initial total distance.
          ang: normalize180(angleFromDelta(action.dest.x - ant.x, action.dest.y - ant.y + surface, 90)), // Travel angle.  Orient to connection point.
          rot: normalize180(nextTunAngle), // Final angle.  Orient to tunnel.
          // Step sizes.
          sX: (action.dest.x - ant.x) / action.dist,
          sY: (action.dest.y - ant.y + surface) / action.dist,
          // Override 'dive' with the relevant walking action and execute.
          act: 'rotWalk'
        });
        if (ant.scale < 0) {
          action.ang = normalize180(flipAngle(action.ang));
          action.rot = normalize180(flipAngle(action.rot));
        }
        antArea(ant, 'bot', tun.id);
        antAction(ant);
      }
      else {
        // Tun Walk execution.
        action.pc = action.pc || 100;
        if (nextTun) action.rev = tun.x1 == nextTun.x1 && tun.y1 == nextTun.y1; // Tun is connected backwards.
        else action.rev = antGetTunPosition(ant, action.pt, tun).pc > action.pc; // This is the final tunnel, use a secondary method to determine the 'rev' flag.
        action.dest = action.rev ? 100 - action.pc : action.pc;
        action.dist = action.rev ? 100 : 0;
        if (!isRotationTunnel(tun) && antDir(ant, tun) == action.rev) ant.pose == 'side' ? antSideCorrection(ant, tun) : (ant.r = oppositeAngle(ant.r));
        // Override 'dive' with the relevant walking action and execute.
        action.act = 'tunWalk';
        antArea(ant, 'bot', tun.id);
        antAction(ant);
      }
    }
    else {
      // No dive queue - select tunnels and create queue.
      let targetTun = action.tun ? getTun(farm, action.tun) : pickRandom(farm.tuns.filter(t => t.t == 'cav' && t.prog == 100)), actionQueue = [];
      if (targetTun) {
        let path = findPath(farm, targetTun, ant.area.n == 'top' ? {t: 'ent'} : {id: ant.area.t}, [], 0, 1);
        if (ant.area.n == 'top') {
          let ent = targetTun.t == 'ent' ? targetTun : getTun(farm, path.pop());
          actionQueue.push({act: 'pace'});
          actionQueue.push({act: 'dive', tx: ent.x1, id: ent.id});
        }
        if (ant.area.t && !path) {
          // Different tunnel system.
          actionQueue.push({act: 'climb'});
          actionQueue.push({act: 'dive', tun: targetTun.id});
        }
        else {
          path.reverse().forEach(tunId => actionQueue.push({act: 'dive', id: tunId}));
          // Rebuild the current action into the final destination action.
          action.id ||= targetTun.id;
          action.pc ||= !isRotationTunnel(targetTun) && min(targetTun.prog, 20 + randomInt(60));
          actionQueue.push(action);
        }
        antInstaQ(ant, actionQueue);
      }
      // Execute queue.
      antNext(ant);
    }
  },

  // Rotational walk for tunnel entrances and tunnel 'con' pieces.
  rotWalk: (ant, farm = getFarm(ant), action = ant.q[0], tun = getTun(farm, action.id), nextAction = ant.q[1],
    nextTun = nextAction?.act == 'dive' && getTun(farm, nextAction.id), phaseCutoff = .6) => {
    ant.walk = ant.jit = 1; // Add a class to CSS 'jitter' the ant, because rotWalks are awkwardly "smooth" compared to other ant walking.
    if (--action.dist > 0) {
      // One step of rotation.
      let progress = 1 - action.dist / action.td; // Whether it's before or after the cutoff to phase 2.
      ant.r = progress < phaseCutoff ? lerpAngle(action.r, action.ang, easeOutQuad(progress / phaseCutoff)) : // Phase 1: Orient to point.
        lerpAngle(action.ang, action.rot, easeInQuad((progress - phaseCutoff) / (1 - phaseCutoff))); // Phase 2: Orient to final angle.
      ant.x += action.sX;
      ant.y += action.sY;
      antAction(ant, frameTick + randomInt(frameTick / 2)); // Extra random frame delay added to prevent animation looking too "smooth".
    }
    else {
      // Rotation complete.
      ant.jit = ant.walk = 0;
      if (!nextTun && tun.t == 'ent') antSurface(ant, action.sc); // Special case for ants that have just surfaced.
      else {
        ant.pose == 'prone' && antProneCorrection(ant);
        antNext(ant);
      }
    }
  },

  // Burrowing walk-along action.
  // @TODO handle encountering ant corpse.
  tunWalk: (ant, farm = getFarm(ant), action = ant.q[0], tun = getTun(farm, action.id), nextAction = ant.q[1],
      nextTun = nextAction?.act == 'dive' && getTun(farm, nextAction.id),
      tunTailPercent = (30 / tun.w * (tun.prog / 100)) * 100,
      atTunEnd = action.rev ? action.dist < tunTailPercent : action.dist > (tun.prog - tunTailPercent),
      nudge = antGetTunnelStep(ant) / 4, collision = antCollision(ant),
      wp = wayPoints[farm.id] && wayPoints[farm.id][getWaypointIndex(farm, ant)], wpSet = [wp], wpCandidate, wpCollision) => {
    ant.walk = 1;
    // Move along in tunnel.
    if (ant.pose == 'side') {
      if (wp) {
        let wpDir = getAntWaypointDirection(farm, ant);
        // Nudge ant closer to wp if needed.
        antNudgeToWP(ant, wp, nudge);
        // Get the nearest waypoints to align the ant to.
        while (wpSet[0] && wpSet.length < 3 && (wpCandidate = getNextWaypoint(farm, wpSet[0], -wpDir))) wpSet.unshift(wpCandidate);
        let wpTargetLen = wpSet.length + 3;
        while (wpSet.length < wpTargetLen && (wpCandidate = getNextWaypoint(farm, last(wpSet), wpDir))) wpSet.push(wpCandidate);
        // Determine ant's new angle.
        let newAngle = getWaypointAngle(wpSet);
        if (ant.scale < 0) newAngle = mirrorAngle(newAngle);
        let angleDiff = normalize180(newAngle - ant.r);
        // Update the ant's rotation, but cap it at 5 degrees per frame, and snap if over 99 deg.
        ant.r = abs(angleDiff) > 99 ? oppositeAngle(newAngle) : normalize360(ant.r + clamp(angleDiff, -5, 5));
      }
      if (!wp || !last(wpSet)) {
        // Lost waypoint.
        antToProneWithCorrection(ant, tun, action.rev);
        action.ns = 1; // Mark this action as "no switch" to prevent random pose switching.
      }
    }
    else if (!atTunEnd) {
      // Prone walk roughly towards the destination with collision corrections.
      if (!randomInt(5)) ant.r = normalize360(ant.r + randomSign()); // Add a little random wobble to the angle.
      if (collision) {
        // Ant is going to collide with another ant.
        let ant2 = collision.ant;
        if (ant.state == ant2.state && ant.area.n == ant2.area.n && !antsCoTarget(ant, ant2)) {
          if ((ant2.t == ant.t || antPassive(ant)) && ant.pose == 'prone' && ant2.pose == 'prone') {
            if (tun.t == 'cav' && !ant.avoid || ant.avoid < 49) {
              // Avoid this ant.
              let dist = calcDistComponents(ant2.x, antDiveY(ant2), ant.x, antDiveY(ant));
              normalize360(ant.r - collision.dir * 6);
              ant.x += dist.x;
              ant.y += dist.y;
              // Track ant avoidance duration so we can stop doing it if it gets too insane.
              ant.avoid ||= 0;
              ant.avoid++;
              setTimeout(X => del(ant, 'avoid'), 5000);
            }
            // No other situations are handled in terms of collision avoidance, because it would be too annoying.
          }
          else if (ant2.t != ant.t && !farm.coex) antFight(ant, ant2); // Fight!
        }
      }
      // Partial correction for prone ants in a 'tun' that have a weird trajectory.
      if (tun.t == 'tun') {
        let angleD = normalize180(ant.r - tun.r), angleDiff = abs(angleD) < 90 ? angleD : normalize180(oppositeAngle(angleD));
        if (abs(angleDiff) > 3) ant.r = normalize180(ant.r - sign(angleDiff));
      }
      // Determine if we're on a collision course with a waypoint and turn ant towards tunnel centreline by 2 degrees.
      // Don't check this at tunnel ends, but there is a secondary alignment method for that area at the end of this function, as well as the antTunPos contingency check.
      if ((wpCollision = antWaypointCollision(farm, ant))) {
        if (collision && !randomInt(3)) antInstaQ(ant, {act: 'idle'}, 0); // Ant is dealing with an ant collision as well, give it some hesitation.
        else ant.r = normalize360(ant.r + sign([0, deg180].map(a => normalize180(tun.r - (tun.t == 'cav' ? 90 : 0) + a - ant.r)).sort((a, b) => abs(a) - abs(b))[0]) * 2);
        // Check if ant is stuck on the midline at the end of a tunnel.
        let antR = normalize360(ant.r - 90);
        if ((abs(antR) < 3 || abs(antR - deg180) < 3) && (calculateDistance(ant.x, antDiveY(ant), tun.x1, tun.y1) < 3 || calculateDistance(ant.x, antDiveY(ant), tun.x2, tun.y2) < 3)) {
          ant.r = oppositeAngle(ant.r);
          console.warn("ant got stuck on midline at end of tunnel");
        }
      }
    }
    // When there is no collision emergency check for more things.
    if (!wpCollision && !collision) {
      let nearbyFoe = antTunFoeNear(ant, tun, farm);
      if (nearbyFoe) antFight(ant, nearbyFoe.a); // Ant is near an enemy ant.
      else if (action.pos) {
        // Position encourager feature.  Coaxes ant to walk towards the side of the tunnel it is supposed to be on, but there is no guarantee it'll get there.
        // NOTE: This only works for 'cav' tunnels which are roughly horizontal, that isn't checked here, it is assumed the calling code will only use this feature for cavs.
        if (ant.pose == 'prone') {
          if (antWaypointRange(ant, wp)) antToSideWithCorrection(ant, tun, wp); // Ant is in landing range, so land it.
          else if (antWaypointRange(ant, wp, 2)) {
            // Ant is getting close to landing range, but is probably coming in too steep.
            // Straighten up to 90 or 275, 15deg at a time.
            if (ant.r < deg180) {
              // Goal is ~90.
              if (ant.r < 75) ant.r += 2;
              if (ant.r > 105) ant.r -= 2;
            }
            else {
              // Goal is ~275.
              if (ant.r < 260) ant.r += 2;
              if (ant.r > 290) ant.r -= 2;
            }
            ant.y += action.pos == 'u' ? 2 : -2; // Bump ant even closer.
          }
          else {
            // Ant is too far away from tunnel wall and needs to be angled there.
            let closeDest = abs(action.dist - action.dest) < 20; // Determine if ant is very close to the destination.
            if (action.pos == 'u') {
              if (ant.r < deg180) if (ant.r > 50 || closeDest && ant.r > 15) ant.r -= 9; // Limits are 45 and 10.
              else if (ant.r < 310 || closeDest && ant.r < 345) ant.r += 9; // Limits are 315 and 350.
            }
            if (action.pos == 'd') {
              if (ant.r < deg180) if (ant.r < 130 || closeDest && ant.r < 165) ant.r += 9; // Limits are 135 and 170.
              else if (ant.r > 235 || closeDest && ant.r > 195) ant.r -= 9; // Limits are 230 and 190.
            }
          }
        }
        else {
          let side = tunGetSide(tun, {x: ant.x, y: antDiveY(ant)});
          if (action.pos == 'u' && side < 0 || action.pos == 'd' && side > 0) action.ns = 1; // Already correct position, flag "no switch" to prevent random pose switching.
          else {
            // Wrong side of the tunnel, switch to prone.
            antToProneWithCorrection(ant, tun, action.rev);
            action.ns = action.pos == 'm'; // Disable random switching for 'm' position.
          }
        }
      }
      // Random ant pose switching feature.
      if (!action.ns) {
        if (!isRotationTunnel(tun) && antWaypointRange(ant, wp) && !randomInt(ant.pose == 'prone' ? num200 : num500)) {
          action.ns = 1; // Don't randomly switch again in this tunnel.
          if (ant.pose == 'prone') antToSideWithCorrection(ant, tun, wp);
          else antToProneWithCorrection(ant, tun, action.rev);
        }
        else if (atTunEnd) action.ns = 1; // Ant is near the end of this tunnel, disable the random switcher.
      }
    }
    // Walk along tunnel.
    antMoveTunnel(ant);
    // Now check where the ant actually is.
    let antTunPos = antGetTunPosition(ant, action.pt, tun, nextTun?.t);
    if (!antTunPos && tun.prog < 15) antTunPos = {tun: farm.tuns.find(t => t.co.includes(tun.id) && t.prog == 100)}; // If we're working on an underbuilt tunnel, let's just say we're in the previous tunnel.
    while (!antTunPos) {
      // Ant is detected to be not in a tunnel at this point. That's a bug and would ideally be fixed. For now, shuffle the ant back into the tunnel.
      antToProneWithCorrection(ant, tun, action.rev);
      antTunPos = antGetTunPosition(ant, action.pt, tun);
      // This could get it out of a pickle.
      if (isRotationTunnel(tun)) {
        ant.walk = 0;
        action.act = 'dive';
        return antAction(ant);
      }
      if (!randomInt(19)) ant.r = normalize360(ant.r + 9); // Random chance to bump the ant's rotation, that might help sometimes.
    }
    if (antTunPos.tun.id != tun.id) {
      // Ant is in a different tunnel than the one it is supposed to be in.
      // This could be normal in which case antNext() will continue the journey, but there are some cases to check first.
      if (antTunPos.tun.id != nextTun?.id) {
        // Ant's current actual position is not in the nextTun in the queue.  This code will investigate the problem.
        antArea(ant, 'bot', antTunPos.tun.id);
        // Check if a tunnel was skipped over (it happens).
        let subsequentAction = ant.q[2], subsequentTun = subsequentAction?.act == 'dive' && getTun(farm, subsequentAction.id);
        if (ant.pose == 'side' && subsequentTun?.id && antTunPos.tun.id == subsequentTun.id) ant.q.shift(); // Ant has probably shimmied past a 'con' so it didn't register, it can skip an action.
        else if (antTunPos.tun.co.find(id => tun.co.includes(id)) == nextTun.id) {
          // Ant has wandered into an adjacent tunnel at a juncture, switch to prone to complete an awkward course correction on the next pass.
          ant.pose = 'prone';
          antProneCorrection(ant);
        }
        else {
          // Consider where the ant's head might be.
          antTunPos = antGetTunPosition(assign(cloneData(ant), antHeadPoint(ant)), 0, tun);
          if (antTunPos && [nextTun.id, subsequentTun.id].includes(antTunPos.tun.id)) {
            // Ant's head is actually in an upcoming tun, so they're not really off course and looping back to antAction or antNext might be OK.
            // But does this situation ever arise?
            console.warn("Made a decision to not course-correct based on position of ant's head coordinates.");
          }
          else {
            // Severe course correction.  Ant is lost, so set up a new path to the original destination (the last dive action in the queue).
            let finalActionIndex = max(0, ant.q.map(a => a.act).lastIndexOf('dive')), finalAction = ant.q[finalActionIndex];
            ant.q.splice(0, finalActionIndex + 1); // Remove the dive queue, but keep anything after the final dive.
            antInstaQ(ant, makeDiveStub(finalAction), 0);
            return antAction(ant);
          }
        }
      }
      // Execute queue.
      // Note: Don't allow antNext() into non-rotational tunnels that ant is not roughly aligned with or ant can glitch out on a subsequent pass because its rotation makes antDir() in the 'dive' action wrong.
      !isRotationTunnel(nextTun) && abs(ant.r - nextTun.r - (nextTun.t == 'cav' ? 90 : 0)) > 45 ? antAction(ant) : antNext(ant);
    }
    else if (isRotationTunnel(tun)) antAction(ant); // Special case for rotation tunnels.  Just loopback to this action without doing further checks.
    else if (antDir(ant, tun) == action.rev) {
      // Wrong way!  Ant needs to be flipped around safely.
      antChangeTunDir(ant, tun);
      ant.walk = 0;
      action.act = 'dive';
      antAction(ant, randomInt(pauseDelay));
    }
    else if ((antTunPos.pc - tunPercent(tun, antOffsetX(ant)) * getSign(action.rev) - action.dest) * getSign(action.rev) < 0) {
      // Ant reached action.dest
      ant.walk = 0;
      antNext(ant);
    }
    else {
      // Not there yet - loop back to this function.
      action.dist = antTunPos.pc;
      if (randomInt(num200)) antAction(ant); // Normal loopback.
      else {
        // Loopback with brief pause.
        ant.walk = 0;
        antAction(ant, frameTick + randomInt(pauseDelay));
      }
    }
  },

  // Prone walks an ant to exactly a target.
  // target can be another ant's head, or midpoint, or it can be an x/y coordinate.
  //getAntHeadPoint() and antToAntAngle()
  // If pickup/dropoffs look stupid, we could create something that if ant is prone in mid of a cavity they can briefly use moveAntDefault()
  // to orient themselves to a target, that would be useful in fights too.   Needs a lot of waypoint checking though!
  tunOrient: (ant, farm = getFarm(ant), action = ant.q[0], tun = getTun(farm, action.id)) => {
    // we can use tunWalk to take one step towards the target and come back to this.
    antNext(ant);
  },

  // Slip off the bg scenery/glass.
  slip: (ant, target = antGroundLevel(ant)) => {
    ant.pose = 'pick';
    if (target - ant.y > 1.2) {
      ant.y += 1.2;
      if (ant.r < 90) ant.r += 1.2;
      antAction(ant, frameTick / 2);
    }
    else {
      // Target reached.
      ant.q = []; // Clear the queue because the ant now has a concussion and it's complicated to consider which queue items are still valid.
      antSurface(ant);
    }
  },

  // Slip to the floor of a cavity.
  tunSlip: (ant, farm = getFarm(ant), action = ant.q[0], tun = getTun(farm, ant.area.t)) => {
    ant.pose = 'pick';

    // Don't use cavFloor!  Unless it would work??  maybe!   Perhaps it can be re-adapted...
    // Update: we have a new func called tunFloor() but it is expected to have problems!   Might not work in con/ent at all?  We'll have to use antGetTunPos and request 'cav' and 'tun' types preferentially?  or recall them ignoring 'con' and 'ent'
    //      otherwise we just skip the slipping perhaps?
    // What we really need here is a loop that moves the ant down by 1.2px until they hit a bottom waypoint??
    // @TODO!!!
    if (1 /* has not hit the floor*/) {

      // ant should rotate to match tun.r or 180-tun.r whichever is closer!  //mirrorAngle ? --> similar to 'land:' function

      antAction(ant, frameTick / 2);
    }
    if (0/*has hit the floor*/) {
      // Mark the ant as slipped is requested to by the caller (for death reasons).
      if (action.mark) ant.slip = 1;

      // call antNext()
    }

    antNext(ant);
  },

  // Land an ant near the surface onto the surface.
  land: (ant, target = antGroundLevel(ant)) => {
    if (target - ant.y > 1) {
      ant.y += 1;
      ant.r += ant.r > deg180 && ant.r < 255 ? 15 : ant.r > 105 ? -15 : 0; // We know ant is heading downwards (~180deg) now adjust orient towards horizontal.
      antAction(ant);
    }
    else antSurface(ant);
  },

  // Uncrawl action.
  uncrawl: ant => {
    antInstaQ(ant, [{act: 'crawl', top: 1}, {act: 'pace'}]);
    antNext(ant);
  },

  // Prone walk on the scenery/bg inside the farm.
  crawl: (ant, action = ant.q[0], nextAction = ant.q[1], near = antBgNear(ant), diff, targetAngle) => {
    antArea(ant, 'bg');
    if (!ant.area.d && (ant.x < 30 && ant.scale < 0 || ant.x > 930 && ant.scale > 0)) ant.scale *= -1; // Ant is about to walk into the edge of the farm, let's flip it first.
    ant.pose = 'prone';
    antProneCorrection(ant);
    if (!action || (!action.x && ant.y < -460 && !randomInt(standardDelay))) antSlip(ant); // Slip off.
    else if (!action.x && near && near[0] == deg180 && (!action.for || action.for < 1) && (nextAction && !acts['bg'][nextAction.act] || action.top || ant.area.d > standardDelay && !randomInt(3))) {
      // At the bottom boundary, land the ant.
      antInstaQ(ant, {act: 'land'});
      antNext(ant);
    }
    else if (!action.x && !action.for && nextAction && acts['bg'][nextAction.act] || action.x && calculateDistance(ant.x, ant.y, action.x, action.y) < antOffsetX(ant)) {
      // Ant has crawled for long enough or reached the destination, move on to the next action.
      ant.walk = 0;
      antNext(ant);
    }
    else {
      if (ant.area.d < 49 && near && near[0] == deg180) ant.r = normalize360(ant.r + randomInt(5) * getSign(ant.r > deg180)); // Ant is starting the crawl; ignore the "near" collision and orient it slightly upwards.
      else if (near) {
        // Redirect ant from boundary.
        diff = normalize180(ant.r - near[0]);
        ant.r = abs(diff) < 10 && !randomInt(num200) ? oppositeAngle(ant.r) : normalize360(ant.r + getSign(diff > 0) * 9); // Occasionally just flip the ant on shallow angles to prevent stuck-in-corner forever situation.
      }
      else if (ant.area.d > 99 && action.x) {
        // We want this ant to head to a particular spot.
        targetAngle = getAngle(ant, action) + 90;
        diff = normalize180(targetAngle - ant.r);
        ant.r = normalize360(abs(diff) < 3 ? targetAngle : ant.r + sign(diff) * ((abs(diff) > 90 && calculateDistance(ant.x, ant.y, action.x, action.y) < 20) ? 10 : 2));
      }
      else if (!randomInt(shortDelay)) ant.r = normalize360(ant.r + randomInt(20) - 10); // Random direction bump.
      else if (action.top && ant.x < antGroundLevel(ant) - 20) {// Ensure ant is well above surface level before enforcing the following rules.
        // Prevent ant walking upwards. (Reoriented normalization so upward maps to 0..160)
        if (normalize360(ant.r + 80) < 160) ant.r += deg180;
        else {
          // Turn ant in a generally downward direction.
          diff = normalize180(deg180 - ant.r);
          if (abs(diff) > 30) ant.r = normalize360(ant.r + (diff < 0 ? -5 : 5));
        }
      }
      // Track time spent.
      action.for && action.for--;
      // Continue crawl.
      antMoveDefault(ant, antAction, 1, .5, 2);
    }
  },

  // Ant stops and regenerates hp and mood.
  rest: (ant, farm = getFarm(ant)) => {
    // Ant needs to find a spot away from other ants, food, and water.
    if (antProximity(ant, farm) || antItemProximity(ant, farm)) {
      if (ant.area.n == 'bot') {
        antFinna(ant, 'dive', {tun: randomInt(9) && ant.area.t});
        antFinna(ant, 'rest');
      }
      else antInstaQ(ant, {act: keys(acts[ant.area.n])[0], for: 5}, 0); // For top and bg we just need to move a little and try again.
      antAction(ant);
    }
    else {
      // After wait time, increment ant's stats, and check whether to wake up.
      setTimeout(X => {
        antStats(ant, {hp: .3, md: .15});
        ant.hp > 10 && !randomInt(120) || ant.hp > 90 && !randomInt(60) || ant.hp > 99 ? antNext(ant) : antAction(ant);
      }, shortDelay);
    }
  },

  // Ant eat action.
  eat: (ant, farm = getFarm(ant), action = ant.q[0], anim, isFlesh = action.t == 'flesh', food = getById(isFlesh ? farm.a : farm.items, action.id)) => {
    if (action.id && food) {
      // Ant has reached the target food.
      anim = setInterval(X => ant.dig = ant.dig ? 0 : !randomInt(3), num500 + randomInt(num500)); // Randomly toggle dig style on and off.
      antUpdateClasses(ant);
      setTimeout(X => {
        if (food) {// Check food still exists at this point before going through with calculations.
          if (isFlesh) {
            playerHint(farm, ["Your ants are turning to cannibalism.", "The ants are resorting to eating their enemies!"]);
            if (!food.eaten) {
              // Mark this ant's corpse as being for eatin, and increment the fed stat for achievement.
              food.eaten = 1;
              _.sac++;
            }
            // Increment how much of the ant was eaten and then decide whether to remove it entirely or just remove a body part.
            (food.eaten += 20) > 99 ? antDelete(food) : food.eaten > 40 && food.rm.push(pickRandom(['rmlegs', 'rmhead', 'rmrear'].filter(rm => !food.rm.includes(rm))));
          }
          else {
            food.sz -= .5;
            let foodItem = items[food.k];
            if (!randomInt(5)) {
              ant.thot = foodItem.sweet ? pickRandom(["Breadcrumb jackpot!", "Sugar high!", "Someone touched my crumb", "New crumb dropped!"]):
              pickRandom["Is this edible?", "Mmm… mystery flavor", "Meat sweats… achieved", "Smells dead - tastes worse"];
            }
          }
          !action.Q && antStats(ant, {fd: isFlesh ? 60 : action.pref ? 10 : 3, md: action.pref ? 5 : 0, hp: 1});
          stopInterval(anim);
          ant.dig = 0;
          if (!action.pref && !randomInt(3)) {
            playerHint(farm, ["Some of your ants are complaining about the food.", "The food does not meet the needs of some ants."]);
            ant.thot = pickRandom(["I can't find any food I like", "This isn't my kind of food!", "Ewww, gross food!"]);
          }
          (ant.fd < 80 && !action.Q && ant.q.length < 2 && !randomInt(1) ? antAction : antNext)(ant); // Whether to go again or move on.
        }
        else {
          // Cancel.
          stopInterval(anim);
          ant.dig = 0;
          antNext(ant);
        }
      }, standardDelay + randomInt(longDelay));
    }
    else {
      if (ant.fd < 90 || action.Q) {
        // No target selected yet.
        let foods = farm.items.filter(i => i.t == 'food'),
          antType = types[ant.t],
          pref = 1,
          isPreference = (antType, food, foodItem = items[food.k]) => !antType.d || antType.d < 2 && foodItem.sweet || antType.d > 1 && foodItem.meat,
          prefer = shuffle(foods).find(f => isPreference(antType, f)) || pickRandom(foods);
        if (!prefer || !isPreference(antType, prefer)) {
          // Either there is no food, or the food is not in the ant's dietary requirements.
          let deadAnts = farm.a.find(a => a.state == 'dead' && !ant.rot && a.t != ant.t); // Find dead enemy ants that are not rotten yet.
          if (antType.d > 1 && ant.fd < 50 && deadAnts) {
            prefer = pickRandom(deadAnts);
            ant.thot = pickRandom(["I can survive on ant flesh", "I'm going to eat Bob", "I will devour my nemesis!"]);
          }
          else if (!prefer && ant.fd < 50) {
            // No food available, and ant's food stat is dropping.
            ant.thot = pickRandom(["Why is there no food?", "Someone is trying to starve us!", "Where is the lovely buffet?"]);
            playerHint(farm, ["There is no food available for your ants.", "Your ants need something to eat!"]);
            return antNext(ant); // Nothing can be done about this.
          }
          else pref = 0; // There is food, but not ideal.
        }
        if (prefer) {
          // Now calculate where to go.
          if (prefer.t == 'food' || prefer.area.n == 'top') {
            antFinnaViaTop(ant, 'eat', {
              n: 'top',
              id: prefer.id,
              t: prefer.t != 'food' ? 'flesh' : prefer.t,
              pref: pref,
              Q: action.Q,
              tx: prefer.t == 'food' ? 25 + parseInt(prefer.x) + randomSign(23) * randomInt(prefer.sz) / 100 : prefer.x + randomSign() * randomInt(antOffsetX(prefer)) //@TODO I think this is wrong, ant stands too far away from food, and drink uses offsetX but so does pace target matching :/
            });
          }
          else {
            let tunPos = antGetTunPosition(prefer);
            if (tunPos) {
              goToLocation(ant, {n: 'bot', tun: tunPos.tun.id, pc: tunPos.pc, pos: 'dn'});
              antFinna(ant, 'eat', {id: prefer.id, t: 'flesh', pref: pref, Q: action.Q, tx: prefer.x + (tunPos.pc < 20 ? 1 : tunPos.pc > 80 ? -1 : randomSign()) * randomInt(antOffsetX(prefer))});
            }
          }
          action.Q && antFinna(ant, 'get', {...prefer, Q: action.Q, pref: pref, id: prefer.id + ant.id});
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
        if (drink = farm.items.find(i => i.id == action.id && i.sz > 0)) { // Got to recheck here incase the drink got removed.
          drink.sz -= .2;
          !action.Q && antStats(ant, {dr: 9, md: 2, hp: .5});
          (ant.dr < 80 && !action.Q && ant.q.length < 2 && !randomInt(1) ? antAction : antNext)(ant); // Whether to go again or move on.
        }
        else antNext(ant);
      }, standardDelay + randomInt(standardDelay));
    }
    else {
      if ((ant.dr < 90 || action.Q) && drink) {
        antFinnaViaTop(ant, 'drink', {n: 'top', id: drink.id, Q: action.Q, tx: parseInt(drink.x) + 2 + randomInt(46)});
        action.Q && antFinna(ant, 'get', {...drink, Q: action.Q, id: drink.id + ant.id});
      }
      else if (ant.dr < 50) {
        // No drink available, and ant's drink stat is dropping.
        ant.thot = pickRandom(["There is nothing to drink here!", "Somebody bring me some water!", "Where is the drinking fountain?"]);
        playerHint(farm, ["There are no drinks in the farm for your ants.", "Your ants are going to get thirsty!"]);
      }
      antNext(ant);
    }
  },

  // Ant picks up a bit of food or drink for the queen, or an infant or a dead ant, this assumes the ant is already in a location where they can do a pick-up.
  get: (ant, farm = getFarm(ant.f), action = ant.q[0]) => {
    action.f = ant.f;
    ant.carry = action;
    action.t == 'egg' && del(getEgg(farm, action.id), 'tun'); // Remove tun prop for carried eggs.
    carryDraw(action, ant);
    if (action.Q) {
      // Feed a queen.
      antGoToAnt(ant, getAnt(farm, action.Q));
      antFinnaViaTop(ant, 'srv', action);
    }
    else action.q.forEach(q => ant.q.push(ant, q)); // Must be an egg, inf, or dead ant.
    antUpdate(ant); // Update ant immediately so they can visually 'grab' the object.
    ant.run = .6;
    antNext(ant, pauseDelay);
  },

  // Ant goes on a mission to feed the queen.
  srv: (ant, farm = getFarm(ant), action = ant.q[0], queen = getAnt(farm, action.Q)) => {
    if (action.Q) {
      // Q selected; confirm queen is alive.
      if (queen && livesInFarm(queen)) {
        // Has ant really reached the queen?
        if (!antsInProximity(ant, queen, antOffsetX(ant))) {
          // Ant too far from queen.
          antGoToAnt(ant, queen);
          antFinnaViaTop(ant, 'srv', action);
          return antNext(ant);
        }
        // @TODO Ant will now drop off their load near the queen - if this is not good enough create a function using getAntHeadPoint() and antToAntAngle() to get them closer.
        // Reached the queen.
        if (ant.carry) {
          antInstaQ(queen, {act: 'freeze', freeze: 2}); // Freeze the queen for a 2 count (~10 seconds).
          // Update stats based on what the queen is probably being given.
          let item = getById(farm.items, action.id);
          !item || item.t == 'food' ? antStats(queen, {fd: !item ? 60 : action.pref ? 10 : 3, md: action.pref ? 9 : 4, hp: 1}) : // !item suggests it was an ant corpse.
            antStats(queen, {dr: 9, md: 4, hp: .5}); // The remaining possibility is that it is a drink.
          // Worker ant is happier.
          antStats(ant, {md: 9});
        }
        // Animate the exchange.
        [queen, ant].forEach(a => {
          a.dig = 1;
          antUpdate(a);
          setTimeout(X => {a.dig = 0; antUpdate(a)}, pauseDelay);
        });
      }
      // Pause here for a bit.
      carryUndraw(ant.carry, ant);
      del(ant, 'carry'); // Delete this regardless of whether the queen was fed, otherwise ant could carry forever.
      antNext(ant, pauseDelay + randomInt(shortDelay));
    }
    else {
      // No queen selected yet.
      if (!antUniqueActs(ant).some(act => ['srv', 'get'].includes(act)) && (queen = pickRandom(farm.a.filter(a => isQueen(a) && livesInFarm(a))))) antFinnaViaTop(ant, queen.fd < queen.dr ? 'eat' : 'drink', {Q: queen.id}); // Go to the appropriate item.
      antNext(ant);
    }
  },

  // Queen's special rest function - queen goes to her favourite spot first.  Also initiates egg-laying.
  kip: (ant, farm = getFarm(ant), nests = [...new Set(farm.a.filter(a => a.nest).map(a => a.nest))]) => {
    // Try pick a nest if there's a suitable one and/or send to the nest.
    (ant.nest ||= pickRandom(farm.tuns.filter(t => t.t == 'cav' && t.prog == 100 && !t.nip && !t.morgue && t.co.length < 2 && !nests.includes(t.id)))?.id)
      && goToLocation(ant, makeDiveStub({tun: ant.nest, pc: 20 + randomInt(60), pos: 'dn'}));
    antFinna(ant, 'rest');
    // Queue egg laying if no eggs in the nest, and random chance passed with respect to various factors.
    !farm.e.length && !random(num1000 * Math.ceil(farm.a.length / 30) - (farm.fill == 'lube' ? deg360 : 0) - (farm.a.some(a => isDrone(a) && livesInFarm(a)) || farm.a.length < 9 ? num500 : 0)) && antFinna(ant, 'lay');
    antNext(ant);
  },

  // Queen lays eggs.
  lay: (ant, farm = getFarm(ant), action = ant.q[0], lvl = action.lvl || 0, laid = action.laid || 0, tunPos = antGetTunPosition(ant), eggLvlCount = farm.e.filter(e => e.lvl == lvl && e.tun == tunPos.tun).length,
    tun = tunPos?.tun, eggSize = tunPercent(tun, 5), egg = {
      id: ant.id + getTime(),
      Q: ant.id,
      t: ant.t,
      f: ant.f,
      caste: randomInt(6) ? 'W' : 'D',
      ts: getTimeSec(),
      tun: tunPos?.tun,
      pc: tunPos?.pc,
      r: randomInt(deg180),
      hp: 99,
      scale: randomSign()
    }) => {
    if (tunPos && tun.t == 'cav' && !tun.nip && !tun.morgue && ant.pose == 'side' && antsInProximity(ant, cavFloor(tun, tunPos.pc), 2 * antOffsetY(ant))) { // Layable tunnel and position.
      if (tunPos.pc < 20 || tunPos.pc > 80 || farm.e.some(e => e.tun == tun.id && e.lvl == lvl && abs(e.pc - tunPos.pc) < eggSize) // Check there is no egg occupying current space
        || (farm.e.some(e => e.tun == tun.id && e.lvl == lvl) && !farm.e.some(e => e.tun == tun.id && e.lvl == lvl && abs(e.pc - tunPos.pc) < eggSize * 1.4)) // Check it is right next to an existing egg or there is no other egg
        || lvl && farm.e.filter(e => e.tun == tun.id && e.lvl == lvl - 1 && abs(e.pc - tunPos.pc) < eggSize).length < 2) { // Check there are two supporting eggs to stack an egg on.
        // Can't lay here, walk a bit and try again.
        antFinna(ant, 'dive', {tun: tun.id, pc: tunPos.pc + randomInt(eggSize) * (tunPos.pc < 20 ? 1 : tunPos.pc > 80 ? -1 : randomSign()), pos: 'dn'});
        randomInt(num500) && antFinna(ant, 'lay', {laid: laid, lvl: lvl}); // There's also a random small chance (about once every 4 hours) that she'll give up laying here altogether to avoid permanent deadlock.
      }
      else {
        while ((eggLvlCount > 6 - (lvl * 2) || randomInt(4)) && eggLvlCount < 16 - (lvl * 2)) lvl++; // Go up a level when there are lots of eggs on the current level.
        egg.lvl = lvl;
        // Animate.
        ant.pose = 'pick';
        ant.jit = 1;
        antUpdate(ant);
        setTimeout(X => {
          ant.pose = 'side';
          ant.jit = 0;
          antUpdate(ant);
          // Lay an egg.
          farm.e.push(egg);
          eggDraw(egg);
          antStats(ant, {hp: -20, fd: 2, dr: 2, md: 2}); // Increase chance of queen being forced to sleep between eggs.  Queens self-feed during this time.
          (laid < 8 || randomInt(8)) && laid < 26 && lvl < 4 && antFinna(ant, 'lay', {laid: ++laid, lvl: lvl}); // If eggs aren't stacked too high, loopback to laying.
        }, pauseDelay);
      }
    }
    if (laid < 10 && farmIsDeveloping(farm) && !antUniqueActs(ant).includes('lay') && randomInt(2)) {
      // Queen did not lay eggs or not enough eggs, and the logic above did not queue up any more laying.  Take a high chance to remind her to pop a few more out, even elsewhere.
      antFinnaViaTop(ant, 'dive', {pos: 'dn'});
      antFinna(ant, 'lay', {laid: laid});
    }
    antNext(ant, shortDelay + randomInt(standardDelay));
  },

  // Ant carries an egg, infant, or a dead ant to another location.
  carry: (ant, farm = getFarm(ant), action = ant.q[0], package = (action.t == 'egg' ? getEgg : getAnt)(farm, action.id), nipData = package && getById(farm.nips, package.moveTo)) => {
    if (package && antsInProximity(antHeadPoint(ant), package, antOffsetX(ant)) && !farm.a.some(a => a.carry == action.id)) {
      if (action.t == 'dead') {
        antGoToAnt(ant, package);
        antFinna(ant, 'get', assign(action, {q: [{act: 'dive', tun: farm.tuns.find(t => t.morgue)}, {...{action}, act: 'drop'}]})); // @TODO we might want to make sure it goes to the far end of the tunnel!
      }
      else if (package.moveTo) {
        nipData ? antFinna(ant, 'get', assign(action, {q: [{act: 'nip', nip: nipData.nip}, {...{action}, act: 'drop'}]})) : del(package, 'moveTo'); // Pass in a nip action or remove stale flag.
      }
      else {
        antFinnaViaTop(ant, 'dive', {tun: package.id, pc: package.pc, pos: 'dn'});
        antFinna(ant, 'get', assign(action, {q: [{act: 'dive', tun: getById(farm.a, package.Q).nest}, {...{action}, act: 'drop'}]}));
      }
    }
    antNext(ant);
  },

  // Drop a carried item.  Carefully though.
  drop: (ant, farm = getFarm(ant), action = ant.q[0], isEgg = action.t == 'egg', package = (isEgg ? getEgg : getAnt)(farm, action.id), tunPos = antGetTunPosition(ant), tun = tunPos?.tun) => {
    if (tun) {
      if (isEgg) antUpdate(assign(package, {tun: tun.id, pc: action.pc, ...cavFloor(tun, action.pc)}));
      else {
        let eggSize = tunPercent(tun, 5),
          spotFinder = (lvl = 0, levelEggs, egg, offset, pc) => {
            for (; lvl < 4; lvl++) {
              levelEggs = farm.e.filter(e => e.tun == tun.id && e.lvl === lvl).sort((a, b) => a.pc - b.pc);
              for (egg of levelEggs) {
                for (offset of [-eggSize, eggSize]) {
                  pc = egg.pc + offset;
                  if (pc > 20 && pc < 80 && !farm.e.some(e => e.tun == tun.id && abs(pc - e.pc) < eggSize) &&
                    (!lvl || farm.e.filter(e => e.tun == tun.id && e.lvl === lvl - 1).filter(e => abs(pc - e.pc) < eggSize).length > 1) &&
                    (!levelEggs.length || levelEggs.some(e => abs(pc - e.pc) < eggSize))) return {pc, lvl};
                }
              }
            }
          },
          // spotFinder() is different from how the queen picks a spot to lay, as she uses a slow trial-and-error approach, whereas spotFinder() works out a good spot to drop.
          newSpot = spotFinder();
          if (newSpot) {
            // Found a spot.
            if (abs(tunPos.pc - newSpot) > tunPercent(tun, antOffsetX(ant))) {
              // Too far away!
              antFinna(ant, 'dive', {tun: tun.id, pc: newSpot.pc, pos: 'dn'});
              antFinna(ant, 'drop', action);
              return antNext(ant);
            }
            else eggUpdate(farm, assign(package, {tun: tun.id, pc: newSpot.pc, lvl: newSpot.lvl}));
          }
          else {
            // No spots.  Egg will be dropped here anyway, but we'll tell the queen her nest sucks.  This may cause ants to keep moving nest, fun!
            getAnt(farm, package.Q).nest = 0;
            eggUpdate(farm, assign(package, {tun: tun.id, pc: tunPos.pc, lvl: 0}));
          }
      }
    }
    // Note: If it's not in a tun I suppose they'll just leave it where it is.  Add more code here if that looks silly!
    carryUndraw(ant.carry);
    del(package, 'moveTo');
    del(ant, 'carry', 'run');
    antNext(ant);
  },

  // Ant goes on a mission to care for an egg or infant.
  care: (ant, farm = getFarm(ant), action = ant.q[0], isEgg = action.t == 'egg', package = (isEgg ? getEgg : getAnt)(farm, action.id)) => {
    if (package && antsInProximity(antHeadPoint(ant), package, antOffsetX(ant))) {
      // At the target.
      isEgg ? package.hp += 2 : antStats(package, {hp: 2, fd: 2, dr: 2, md: 2});
      ant.dig = 1;
      antUpdate(ant);
      setTimeout(X => ant.dig = 0 || antUpdate(ant), shortDelay);
      return antNext(ant, shortDelay + randomInt(shortDelay));
    }
    else if (ant.q.length < 2) care4kids(farm, ant); // Try again if ant has nothing to do.
    antNext(ant);
  },

  // Ant nips off to a nip.
  nip: (ant, farm = getFarm(ant), action = ant.q[0], id = action.id, nip = action.nip, idOrNip = id || nip, tun = id ? getTun(farm, action.tun) : farm.tuns.find(t => t.nip == nip),
    nipData = farm.nips.find(n => n.nip == idOrNip), nipItem = nipData?.item, isTop = idOrNip > 2, isLeftSide = idOrNip % 2 > 0, antX = antGetX(ant), rev = action.rev, isCurFarm = currentFarm(farm)) => {
    if (nipItem && rev) {
      // Entering farm from a nip area.
      if (isLeftSide ? antX < 20 : antX > 940) {
        ant.walk = 1;
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
      else {
        // All done.
        ant.walk = 0;
        antNext(ant);
      }
    }
    else if (nipItem && id && !nipItem.a.some(a => a.t != ant.t)) {
      // Exiting farm into a nip area.
      if (isLeftSide ? antX > -25 : antX < 985) {
        ant.walk = 1;
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
      else if (ant.carry) antFinna(ant, 'drop', ant.carry); // Ant was carrying something to a nip, but it is not there.
      antNext(ant);
    }
  },

  // Freeze an ant for x-number of 5 second periods.
  freeze: (ant, action = ant.q[0]) => {
    ant.walk = ant.dig = ant.jit = 0;
    action.freeze ||= 1;
    if (!--action.freeze) {
      del(ant, 'freeze');
      antNext(ant, shortDelay);
    }
    else antAction(ant, shortDelay);
  },

  // Dying is an ant action that goes for several hours while the corpse remains in the farm.
  // @TODO ant should become more "hazardous" the more it rots - depletes ants hp when within proximity.
  die: (ant, farm = getFarm(ant), action = ant.q[0], tun = getTun(farm, ant.area.t)) => {




    if (ant.area.n == 'bg') antInstaQ(ant, {act: 'slip'}) && antNext(ant); // Ant is on the bg, let's have it drop off first.  Can't use antSlip() here because it will forget to die.
    else if (ant.area.t && ant.pose == 'prone' && !ant.slip) antInstaQ(ant, {act: 'tunSlip', mark: 1}) && antNext(ant);
    else {
      if (ant.state != 'dead') antDeath(ant, ant.q[0].r);
      else {
        // Decompose loop
        let deathTime = getTime() - ant.death, twoHours = 7200000;
        if (deathTime > twoHours) {// Wait time before corpse gets nasty.
          if (deathTime < twoHours * 3) ant.rot++; // Slightly make the ant more fuzzy (1%).
          else if (deathTime < twoHours * 4) ant.decay++; // Shrink the ant 2% at a time.
          else return antDelete(ant); // Totally rotted - undraw the ant and delete the ant from the array.
        }
      }
      ant.q = [ant.q[0]]; // Remove remainder of queue.
      antAction(ant, 144000); // 2.4 minutes
    }
  },

  // Fight is not a real ant action but works in a similar way.  Each ant is
  // "ant" in it's own loop, and it is the "ant2" for one or more other ants.
  fight: (ant, farm = getFarm(ant), ant2 = getAnt(farm, ant.q[0].ant), cancelFight = !ant2 || ant2.state == 'dead' || ant.area.n != ant2.area.n || !antsInProximity(ant, ant2, 64) || farm.coex) => {
    // ant2's ID is an arg in the finna queue.
    if (ant.pose == 'side') ant.area.n == 'bot' ? antToProneWithCorrection(ant, tun) : (ant.pose = 'prone'); // Fight in prone pose?
    // Weak ant might slip off the bg if the fight is there.
    if (ant.hp < 10 && ant.area.n == 'bg' && !randomInt(3)) {
      // Quit fighting for now.
      ant.fight = ant.jit = ant.dig = 0;
      antSlip(ant);
    }
    else if (cancelFight) {
      // Cancel fight.
      ant.fight = ant.jit = ant.dig = 0;
      antNext(ant);
    }
    else if (ant.hp <= 0) {
      ant.wig = 1;
      antFinna(ant, 'die', {r: 'fight'});
      setTimeout(X => {ant.fight = ant.wig = 0; antNext(ant)}, standardDelay);
    }
    else {
      ant.fight = 1;
      // Ant strength is determined by a combo of factors.

      // Decrease foe ant's hp by the strength.
      ant2.hp -= clamp(ant.hp / 100, 0.5, 0.8) // Base strength is health, but doesn't drop below 50 or go above 80 to keep it fairer.
        * (anGetSize(ant) == 's' ? .8 : (anGetSize(ant) == 'l' ? 1.2 : 1))  // Adjust strength by size.
        * (ant.b ? 1.3 : 1) // Biters have extra oomph.
        * types[ant.t].v // Adjust strength by speed.
        * (isDrone(ant) ? 3 : isQueen(ant) ? 5 : 1) // Drones and Queens fair much better.
        + max(1 / ant.md, .2); // Low mood can add slightly to aggression.


      // Ants may circle each other on the background.
      if (!randomInt(6) && ant.area.n == 'bg') {
        let near = antBgNear(ant),
          antAngle = antToAntAngle(ant, ant2);
        if (!near && !ant.circling) {
          ant.walk = ant2.walk = ant2.circling = 1;
          let turnAngle = flipAngle(getSign(antAngle < deg180) * 15),
            circling = setInterval(X => {ant.r = normalize360(ant.r + turnAngle); antUpdate(ant); ant2.r = normalize360(ant2.r + turnAngle); antUpdate(ant2)}, frameTick);
          setTimeout(X => {stopInterval(circling); ant.walk = ant2.walk = 0; ant2.circling = 0}, shortDelay);
        }
        // Turn towards foe.
        setTimeout(X => {ant.r = normalize360(ant.r + getSign(antAngle > deg180) * (antAngle > 15 ? 15 : antAngle)); antUpdate(ant)}, shortDelay + frameTick);
      }

      let distance = calculateDistance(ant.x, ant.y, ant2.x, ant2.y);
      let antX = antGetX(ant);
      if (distance < 5) {
        // Step backwards by 2.
        // @TODO will depend on whether they're top or bot side, and whether there is room behind them.
        // @TODO need a function to determine how much room is behind an ant.
        // Don't forget to use crawl class.
        let spaceBehind = 0;
        if (ant.area.n == 'top') spaceBehind = ant.scale ? antX - 10 : 950 - antX;
        else if (ant.area.n == 'bot') {
          //???????
          // @TODO not handled properly, if they're 10+ away from any tun x1/y1 or x2/y2 coordinate, there is 2 space??
          // Do fights take place on a single plane here???  What pose are the ants in ?
          spaceBehind = 0
        }
        else if (ant.area.n == 'bg' && antX > 10 && antX < 950 && antY > -195 && antY < 12) {
          spaceBehind = 2;
        }
      }
      if (distance > 10) {
        // Step forwards by 2.
        // @TODO will depend on whether they're top or bot side,
      }

      // @TODO ants should still frequently move backwards and forwards to simulate attacking.

      // @TODO - the ants should move slightly towards the attacked/weaker ant if there's room so they're not in the same spot the whole time.
      // This may mean a nearby ant that is also in the fight may be further away, it will need to move towards the foe on it's turn as well.
      // If it's too far from the foe, it should revert back to pacing/burrowing but towards the foe, instead of attacking.

      // Wait 10-15 seconds for another blow, this randomness makes the fight less predictable.
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
// Note: For actions that can be triggered directly from the surface level, using antFinnaVia in a one-liner is preferable.
goToLocation = (ant, location) => antFinnaViaTop(ant, location.n == 'bg' ? 'crawl' : location.n == 'top' ? 'pace' : 'dive', location),

// Requests an ant to walk to where another ant was at the time of the request.  Nothing is guaranteed.
// Should silently fail when 'ant' is missing.
antGoToAnt = (ant, destAnt, location = {n: destAnt.area.n}) => {
  if (location.n == 'bg') {
    location.x = destAnt.x;
    location.y = destAnt.y;
  }
  if (location.tun = destAnt.area.t) location.pc = antGetTunPosition(destAnt)?.pc; // Note: assignment in condition on purpose.
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
canUpgrade = (package, day = 1) => package.tun && package.hp > 90 && !randomInt(getTimeSec() - package.ts > 8640 * (1 + day) ? 50 : num500) && getTimeSec() - package.ts > 8640 * day,

// Directs farms by running checks every 30 seconds.
// Adds deliberate tasks to the ants' finna queues so the action loops aren't responsible for checking everything.
// Also updates ants stats, autosaves, updates food & drink display, checks achievements, updates ant thoughts.
director = X => {
  _.farms.forEach(farm => {
    setTimeout(X => farm.a.filter(livesInFarm).forEach(ant => {
      setTimeout(X => { // Perform a chunk of this without overloading the main thread with heaps of these at once.
        // Decrement stats.
        antStats(ant, {fd: -.05, dr: -.1, md: -.05, hp: -.1});
        !ant.area.t && antStats(ant, {md: farmFlairScore(farm) / 20}); // Boost mood stat based on presence of scenery (when not in tunnels).
        // Decrement hp stats based on other stats.
        antStats(ant, ant.fd <= 0 || ant.dr <= 0 ? {hp: -1, md: -.5} : ant.fd < 10 || ant.dr < 10 ? {hp: -.05, md: -.05} : {hp: ant.md < 10 ? -.05 : -.01});
        ant.hp <= 0 && antFinna(ant, 'die', {r: ant.fd <= 0 ? 'hunger' : ant.dr <= 0 ? 'thirst' : ant.q[0].act == 'fight' ? 'fight' : 'other'});
        // Ant tries to nourish from fill material if they are in a tunnel.
        ant.area.t && fillRefectory(ant);
        // Cap ant's mood at the maximum its ant type can have.
        ant.md = min(ant.md, types[ant.t].m || 100);
        // In a fight, random chance to pick another random ant to help out, available workers will always help, other types of ant are less likely to join.
        ant.state == 'fight' && !randomInt(2) && antGoToAnt(pickRandom(farm.a.filter(a => livesInFarm(a) && a.state != 'fight' && (isWorker(a) || !randomInt(4)))), ant);
        if (ant.q.length < 9) {
          // Curb major problems.
          if (ant.dr < 10) antFinnaViaTop(ant, 'drink');
          else if (ant.fd < 10) antFinnaViaTop(ant, 'eat');
          else if (ant.hp < 10) antFinna(ant, 'rest');
          else if (antUniqueActs(ant).every(a => ['crawl', 'pace', 'dive', 'tunWalk', 'rotWalk', 'idle'].includes(a))) {
            // Ant is "defaulting"; give them something better to do.
            if (isWorker(ant) && !randomInt(3) && !farmIsDeveloping(farm) && farmHasQueen(farm) && farm.a.filter(a => a.digD).length < 3) antFinnaViaTop(ant, 'dig'); // Curb slack workers problem.
            else if (!randomInt(5)) antFinnaRandom(ant, 1); // Randomly pick a non-default action.
            else if (!randomInt(5)) antFinnaViaTop(ant, 'dive'); // Increase chance of ants diving.
            else if (!randomInt(9)) antFinnaViaTop(ant, 'crawl'); // Increase chance of ants crawling.
            // Hints for player.
            ant.md < 25 && !farmHasQueen(farm) && playerHint(farm, ['Comrade, the workers are restless. They have no queen.', 'The absence of a queen is going to become a problem.']);
            ant.md < 20 && !farmFlairScore(farm) && playerHint(farm, ['Some of your ants are complaining about the lack of scenery and decor.', "This farm doesn't have flair, the ants would like some decorations."]);
            // Randomly go to vial.
            let randomNip = pickRandom(farm.nips);
            if (randomNip && !farm.foe && !randomInt((farm.dun ? 90 : farmIsDeveloping(farm) ? 120 : deg180) - (farm.items.some(i => i.t == 'food' && i.sz > 0) ? 0 : 30) - (farm.items.some(i => i.t == 'drink' && i.sz > 0) ? 0 : 40))
              && !farm.a.some(a => antUniqueActs(a).includes('nip')) && antFinna(ant, 'nip', {nip: randomNip.nip}));
          }
        }

      }, 1);
      setTimeout(X => { // Delay a chunk so the director function doesn't intefere with the displayed farm too much.
        if (ant.inf && canUpgrade(ant, ant.inf)) {
          // Infant upgrader.
          let infantClasses = objGetEl(ant).classList, infantAnims = ['a1', 'a2', 'a3'];
          if (++ant.inf > 4) {
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
          if (!farmIsDeveloping(farm) && !farm.a.filter(a => isWorker(a)).length && ant.q.length < 2 && randomInt(3) < 1) antFinna(ant, 'dig'); // A queen without workers may dig a nest to start a colony.
          else if (ant.fd < 90 || ant.dr < 90) antFinna(pickRandom(farm.a.filter(a => isWorker(a) && a.q.length < 9 && !antUniqueActs(ant).includes('srv'))), 'srv', {get: ant.fd < ant.dr ? 'fd' : 'dr'}); // Reduces the possibility of a queen having to eat or drink by herself.
          else if (ant.hp < 95 && ant.q.length < 2 || ant.hp < 80) antFinna(ant, 'kip');
          // Being a queen takes an extra toll.
          antStats(ant, {fd: -.05, dr: -.1, hp: -.02, md: -.05});
          // Queen's presence boosts moodiest ant's MD.
          let sadAnt = farm.a.filter(a => a.caste != 'Q').reduce((min, a) => a.md < min.md ? a : min, 0);
          if (sadAnt) sadAnt.md += .3;
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
      ant.thotD > 9 ? (ant.thot = antThought(ant)) : ant.thotD++;
    }, 0));
    setTimeout(X => { // Delay these extra bits to not perform everything all at the same time.
      updateFoodAndDrink(farm);
      farm.e.forEach(e => {
        // Decrease egg stats.
        e.hp -= .3;
        if (e.hp <= 0) eggDelete(e); // Remove dead egg.
        else if (canUpgrade(e)) {
          // Egg can upgrade.
          let floorCoord = cavFloor(getTun(tun), e.pc), infant = assign(createAnt(farm, floorCoord.x, floorCoord.y, e.r, 'inf', e.caste, e.t), {
            Q: e.Q, // Mark the infant's mother.
            scale: randomSign(),
            f: farm.id,
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
      if (farm.a.some(a => a.state == 'dead') || farm.e.length) trySetCarryTask(farm);
      // Look for infants and eggs and see which one needs to be cared for next.
      if (farm.a.some(a => a.inf) || farm.e.length) care4kids(farm);
    }, num2000);
  });
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
      progeny: X => farmIsDeveloping(F) && !F.stats.cap,
      drag: X => _.dq,
      hb: X => F.stats.death.other > 9,
      day: X => (getTimeSec() - F.ts) > 86400,
      weak: X => (getTimeSec() - F.ts) > 604800,
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
  _.achQ && popup('ach', 0, shortDelay);
},

// Queues an achievement.
queueAch = (achKey, lvl = _.ach[achKey].l || 0, newAch = {a: achKey, l: lvl, b: !lvl || lvl == 3 ? 20 : 10}) => {
  !_.achQ.some(e => e.a == newAch.a && e.l === newAch.l && e.b == newAch.b) && _.achQ.push(newAch);
  save();
},

// Updates the display of food and drinks so they reflect the current size.
updateFoodAndDrink = farm => {
  // Food items have to be regularly updated to reflect being eaten and hill heights, as well as being deleted when exhausted.
  farm.items = farm.items.filter(i => (i.t != 'food') || (i.sz > 0 ? (currentFarm(farm) && (getEl(i.id).innerHTML = foodCode(i)), 1) : (getEl(i.id)?.remove(), 0)));
  // Update drink height.  This only affects the currently displayed farm.
  let drinkItem = farm.items.find(i => i.t == 'drink');
  if (currentFarm(farm) && drinkItem) query(`#${drinkItem.id} .drink > *`).style.height = min(46, drinkItem.sz / 2) + 'px';
},

// Checks if an ant is an expat queen for the sake of the "Dragged Queen" achievement.
checkExpatQueen = (a, farm) => {isQueen(a) && a.f != farm.id && (_.dq = 1)},

// Checks and... displays messages.
displayMessage = X => {
  if (messages.length) {
    showMsgs = 1;
    let message = messages.shift(), msgDiv = getEl('messages');
    msgDiv.innerHTML += `<div data-ts="${getTime()}" class="msg ${message.t}"><p>${message.msg}</p></div>`;
    msgDiv.lastChild.classList.add('vis');
    message.t != 'bonus' && messageLog.push(message);
    messageLog.length > 10 && messageLog.shift();
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
scrollMessages = (lastmsgEl = getEl('messages').firstChild) => lastmsgEl && getTime() - parseInt(lastmsgEl.dataset.ts) > 12000 && removeMessage(),

// Adds a message to the array.
msg = (txt, type = 'status') => !stopMsgs && messages.push({msg: txt, t: type}) && !showMsgs && displayMessage(),

// Displays random messages, with message flood protection.
randomMsg = (msgs, isJoke = 0, i = 0, randMsg) => {
  if (messages.length || !document.hasFocus())
    // There are already messages waiting in the queue, or the player is not watching, wait a bit and try again.
    // Except if it's a joke, just give that a miss.
    !stopMsgs && !isJoke && setTimeout(X => randomMsg(msgs), num2000);
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
joker = (i = last(_.farms.filter(farmIsRunning))) => {// @todo this needs to be tested (whether joke type gets changed based on number of farms).
  randomMsg(jokes[i < 5 ? max(0, i) : 0], 1);
  !stopMsgs && setTimeout(joker, randomInt(longDelay) + longDelay);
},

// Outputs a warning msg, but only if one from the same set hasn't been shown recently, and only if it's for the current farm.
playerHint = (farm, msgs) => {
  while (warnings[0] && warnings[0][1] < getTime() - longDelay) warnings.shift();
  if (!warnings.some(w => w[0] == msgs.join(';'))) {
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

// Handles the common audio playing functionality between ambience and ambienceOverride.
bgAudioPlay = (audioFile, volInc, delay, audio = getEl('audio')) => {
  stopInterval(volumeUp);
  audio.volume = 0;
  getEl('audioSrc').src = `audio/${audioFile}.opus`;
  audio.load();
  audio.play();
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
ambienceOverride = audioFile => bgAudioPlay(audioFile, 5, 3),

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
Q = X => {localStorage.removeItem('_'); location.reload()};


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

