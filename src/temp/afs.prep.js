/* AUTO GENERATED FILE - DO NOT MODIFY */
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
g = "length", yb = "sort", i = "forEach", X = "find", nc = "width", yd = "height", Yh = "a-bag", s = "addEventListener", G = "click", L = "bag", Zh = "a-tg", U = "score", Xb = "stats", $h = "a-car", P = "farms", da = "state", Zd = "free", _h = "createElement", B = "innerHTML", Ne = "firstChild", n = "push", t = "col", hg = "green", Za = "plate", Fj = "switch-up", ig = "findIndex", d = "classList", zb = "contains", $d = "glass", m = "add", ai = "swipeL", bi = "swipeR", o = "remove", zd = "game", Ad = "appendChild", oa = "fill", Oe = "flare", _ = "carry", Aa = "nips", Na = "item", Bd = "a-", K = "nip", ra = "dataset", D = "some", _c = "offsetWidth", Cd = "farm", v = "tuns", Yb = "mTuns", oc = "hills", V = "card", r = "style", Pe = "background", aa = "items", M = "ent", e = "lvl", u = "prog", pc = "reduce", pa = "cav", k = "filter", Zb = "warn", Dd = "splice", Hc = " ", $b = "con", p = "tun", Y = "includes", jg = "tunnels", w = "", H = "top", Fa = "px", Ic = "shift", _d = "slice", ad = "closest", ea = "left", qc = "dn", kg = "innerText", ae = "up", ci = "switch-control", _b = "target", z = "vis", Qe = "antFarm", Ua = "food", Ga = "drink", y = "scale", Ab = "join", be = "decals", rc = "vial", Bb = "off", lg = "hide", sc = "on", mg = "fade", Gj = "#vial .vs div", di = ".toob > span", Hj = "parentElement", ei = "resize", hb = "getBoundingClientRect", Re = "innerWidth", Oa = "m", qb = "scenery", tc = "decor", Da = "paint", ib = "ants", sa = "hat", ac = "filler", Se = "lube", ng = "sanitation", ce = "nutrition", og = "hydration", Te = "sticker", uc = "lid", Jc = "bottom", fi = "collected", I = "pose", Kc = "pick", $a = "nipPh", Ue = "alate", bc = "tube", bd = "antfax", gi = "antyvenom", pg = "fog2", hi = "dystopia", Ve = "clonekit", We = "speedo", Z = "quip", Ed = "ebay", cd = "mom", dd = "olay", ii = "offsetHeight", _a = "clientX", cc = "touches", rb = "clientY", Ob = "coex", qa = "removeEventListener", Lc = "mousemove", ed = "mousedown", fd = "touchmove", vc = "touchstart", gd = "touchend", Xe = "right", Ij = "changedTouches", Fd = "passive", de = "transform", ji = "cloneNode", qg = "pull", C = "act", dc = "indexOf", ki = "className", jb = "bg", Jj = "backgroundImage", Pb = "cap", ee = "sizz2", q = "area", Ye = "burn", Gd = "other", hd = "a", sb = "s", fe = "disabled", Kj = "confirm", Lj = "Farm has attached items", id = "nodrop", Cb = "caste", ge = "car", Mj = "bag-items", j = "desc", Nj = '<span class=wait>⌛</span>', Oj = "waiting", Hd = "currentTarget", Qb = "drop", Ze = "toUpperCase", Pj = ".feng-item", $e = "drag", rg = "preventDefault", wc = "death", sg = "hunger", tg = "thirst", Ba = "fight", Qj = "numeric", he = "volume", _e = "modal", ug = "pik", Rj = "wrapper", li = "innerHeight", Pa = "prone", Sj = "flashit", ie = "idle", Ea = "inf", Tj = "mouseover", vg = "isConnected", fa = "walk", $ = "dig", mi = "dispatchEvent", af = "mouseup", wg = "throb", je = "ss", Mc = "rest", jd = "crawl", xc = "pace", ia = "dive", xg = "tunWalk", yg = "rotWalk", zg = "l-inf", Db = "side", kd = "egg", yc = "dead", bf = "climb", Eb = "bot", Id = "morgue", ld = "moveTo", Nc = "nest", md = "srv", cf = "nipTs", kb = "dest", Fb = "dist", df = "avoid", Jd = "eat", ni = "flesh", zc = "get", Oc = "freeze", Pc = "lay", oi = "circling", pi = "messages", Uj = "science gizmo", Vj = "Enter HEYSCOOPS at checkout!", Wj = "I don't think you're ready for this.", Xj = "Can you dig it? (Yes)", Yj = "educational fun", Zj = "You got one.", $j = "You got another.", _j = "You got it.", qi = "185 ants walk into a bar…", ef = "I like my women like I like my ants:", Ag = "I like my men like I like my ant colonies:", ak = "I like my women like I like my ant farms:", bk = "…no matter how small…",h = setTimeout, ta = document, Ha = setInterval, Va = parseInt, ab = Math, Gb = window, ff = Array, Bg = Object, Cg = console, ri = localStorage, ck = navigator,
// Leave that above line in!

// Main Globals
b = 0, // app data
a = 0, // current farm alias
Kd = {}, // Element cache.
tb = {}, // Tunnel waypoints
gf = 0, // scroller interval
nd = 0, // spawner interval
ke = 0, // showMsgs flag
hf = 0, // throbber interval
le = 0, // warper interval
jf = 0, // warpDirector interval
kf = 0, // volumeUp interval
Dg = 0, // magnifier interval
Qc = 0, // another magnifier interval
Eg = 0, // carousel interval
Fg = 0, // bag scroll position
Gg = 0, // user clicked state indicator
lf = 0, // spilled farm state indicator
mf = 0, // vial animation interval
nf = 0, // tube animation interval
bb = 0, // switcher flag

// These variables exist purely to support the developer panel.
Hg = 0, // developer mode indicator
si = 0, // stop ants state indicator
ti = 0, // director interval
of = 0, // stopMsgs flag

// Common integers.
ec = 200,
R = 500,
Ac = 800,
ja = 1000,
Ig = 1500,
ua = 2000,
ui = 540,
fc = 360,
Ld = 270,
S = 180,
gc = 510,

// Animation/event timing globals.
Ia = 20, // 50 fps
od = R,
Hb = ua,
W = 5000, // 5 seconds
la = 30000, // 30 seconds
cb = 300000, // 5 minutes

// Message handling globals.
Md = [],
me = [],
ne = [],
Nd = [],

// Aliases for things that are in the form "something.something".  The first part isn't aliased because JS-SHRINK does that.
E = ta.body,
Jg = ab.PI, ba = ab.min, Qa = ab.max, Bc = ab.random, hc = ab.floor, N = ab.abs, oe = ab.sign,
pf = ab.sqrt, qf = ab.pow, rf = ab.round, Kg = ab.atan2, Rc = ab.hypot, lb = ab.sin, db = ab.cos,
ma = Bg.keys, Lg = Bg.values, ca = Bg.assign, Mg = Bg.entries,

// Convenience functions.
ga = ta.querySelector.bind(ta),
Ra = ta.querySelectorAll.bind(ta),
c = ta.getElementById.bind(ta),
Ja = Date.now,
mb = a => hc(Ja() / ja),
Wa = (a, b) => a.insertAdjacentHTML('beforeend', b),
f = a => hc(Bc() * a),
x = a => a[f(a[g])],
Cc = (a = 1) => x([-a, a]),
Dc = a => a.at(-1),
ha = a => a && clearInterval(a),
pd = a => JSON.parse(JSON.stringify(a)),
va = a => a ? 1 : -1,
pe = a => a[yb](a => Bc() - .5),
Ib = (a, b, c) => ba(Qa(a, b), c),
Ca = (a, ...b) => b[i](b => delete a[b]),
eb = (a, b) => a[X](a => a.id == b),

// Converts radians to degrees.
Ng = a => a * (S / Jg),
// Converts degrees to radians.
ub = a => a * (Jg / S),
// Normalizes an angle to be between -180 and 180 degrees.
Ka = a => ((a + ui) % fc) - S,
// Normalizes an angle.
ka = a => (a + fc) % fc,
// Gets the opposite of an angle.
ic = a => ka(a + S),
// Gets the mirror of an angle.
Og = a => ka(S - a),
// Gets the flip of an angle.
qd = a => ka(fc - a),
// Gets the angle beteen two precalculated delta values.
Ec = (a, b, c = 0) => ka(Ng(Kg(b, a)) + c),
// Gets the angle between two objects that have x/y props.
rd = (a, b, c, d = Ec(b.x - a.x, b.y - a.y, c)) => d || fc,
// Linearly interpolates between two angles along the shortest path.
Pg = (a, b, c) => a + Ka(b - a) * c,
// Provides quadratic easing in: starts slow and accelerates.
Qg = a => a * a,
// Provides quadratic easing out: starts fast and slows toward the end.
vi = a => 1 - Qg(1 - a),
// Calculates distance with components.
Rb = (d, e, f, g, b = f - d, c = g - e, a = pf(b * b + c * c)) => ({d: a, x: a ? b / a : 0, y: a ? c / a : 0}),
// Performs a simple distance calculation.
wa = (a, b, c, d) => Rb(a, b, c, d).d,

// Mark load time, to fix a bug where reloading speeds up tunnel building.
wi = Ja(),

// Loads the app.
xi = a => {
  // Adapt viewport to client's display.
  Wa(ta.getElementsByTagName('head')[0], `<meta name=viewport content="width=1180, height=1100, initial-scale=${ba(screen[nc] / 1180, screen[yd] / 1100)}, user-scalable=no">`);
  // Fetch stored data.
  yi();
  // Set correct background.
  yf();
  // Add an event handler for the bag link.
  c(Yh)[s](G, a => La(L, 0, 0));
  // Add an event handler for the magnifying glass link.
  c(Zh)[s](G, Xi);
  // Handle the score/stats popup button.
  c(U)[s](G, a => La(Xb, 0, 0));
  // Add an event handler for the carousel link.
  c($h)[s](G, Jf);
  // Create the free ant array, also clears any existing free ants stored in the data.
  b.a = [];
  // Check if loaded farms exist and set default if needed.
  !b[P][g] ? Rg() : Sc(b.F);
  // Start ant activity.
  b[P][i](a => {
    Wg(a); // Calculate waypoints.
    a.a[i](a => {
      a[da] == Zd && zh(a, Fc(a)); // Fix ants that didn't cop a cap before the last save().
      O(a);
    });
  });
  Ph();
  Mh();
  // Show welcome message.
  h(a => Ta(tj), ua);
  // Start the joker message system.
  h(Uh, la * 5);
  // Update menu buttons and dirt.
  gh();
  // If there's already a score, update that one.
  b[U] && gb(0);
  // Handle the throbber overlay.
  nh();
  // Handle the speedo warp overlay.
  oh();
  // Call ant director immediately.
  dg();
  // Repeatedly call the director function to control ants.
  ti = Ha(dg, la);
  // Start ambient audio.
  ta[s](G, Le);
  // Activate message log button.
  Gi();
  // Set up the switch control panel.
  Hi();
},

// Retrieves all data from local storage.
// Note: Start at half volume so you can listen to a podcast while playing.
yi = a => b = JSON.parse(ri.getItem('_') || '{"score":0,"farms":[],"bag":[],"ach":{},"achQ":{},vol":50,"bg":"","grad":0,"sac":0,"arty":0,"scene":{},"man":0}'),

// Saves all data to local storage.
xa = a => {Rh(); Ja() - wi > la && ri.setItem('_', JSON.stringify(b))},

// Creates a templated element from reusable HTML snippets.
qe = (b, a = ta[_h]('template')) => {
  a[B] = b;
  return a.content[Ne];
},

// Gets a farm by id or an object with a .f property which is the farm id.
// Note: This function must fail silently when fid is invalid because it is often used without checking that first.
J = a => eb(b[P], a?.f || a),

// Determines if a farm object is of the currently displayed farm.
Sb = b => b.id == a.id,

// Adds a blank farm, and switches to it.
Rg = (a = 'f' + Ja()) => {
  b[P][n](
    ca({
      id: a,
      n: 'ANT FARM SOCIAL',
      [t]: hg,
      [Za]: hg,
    }, pd(Xh))
  );
  // Switch to this farm.
  Sc(a);
  // On the creation of second farm, reveal the switch panel.
  b[P][g] == 2 && h(a => c(Fj)[G](), ua);
},

// Switches currently displayed kit to a particular farm.
Sc = (e, f = c('kit'), g = a => b[P][ig](b => b.id == a)) => {
  bb = 0;
  Li();
  if (a && a.id != e) {
    nd = 0;
    b.a[i](Rd);
    Kd = []; // Clear ant cache.
    E[d][zb]($d) && c(Zh)[G]();
    let j = g(e) - g(a.id);
    f[d][m](j > 0 ? ai : bi);
    h(a => {f[o](); Sg(e, j)}, ja);
  }
  else Sg(e, 0);
},

// Draws a farm kit.
Sg = (g, e, j = qe(Dj)) => {
  a = J(g); // The F global holds a reference to the currently displayed farm.
  b.F = g;
  e && j[d][m](e > 0 ? bi : ai);
  c(zd)[Ad](j);
  // Show the correct name and color on the frame.
  Af();
  // Resume by recreating farm.
  a[oa] && sf();
  // Redraw capped ants.
  a.a[i](a => {
    a.mag = a[Oe] = 0; // Remove mag styles.
    Wc(a);
    a[_] && Tf(a[_], a);
  });
  // Redraw nipped ants.
  a[Aa][i](a => a[Na].a[i](b => {
    Wc(b, c(Bd + Nb[a[K]]));
    b[_] && Tf(b[_], b);
  }));
  let k = c('kit');
  k[ra].id = g;
  // Shake handler.
  c($d)[s](G, b => {
    !E[d][zb]($d) && (
      k[d][m]('shake'),
      h(a => k[d][o]('shake'), R),
      !f(10) && Lg(a.a)[D](a => a[da] != Zd) && Ta(wj)
    );
  });
  k[_c]; // This is a hack to "trigger layout" reflow - do not remove.
  e && k[d][o](e > 0 ? bi : ai);
  // Activate or update the switcher if needed.
  Tb();
},

// Fills the farm with filler and spawn free ants.
sf = d => {
  // Fill farm.
  c(Cd)[ra][oa] = a[oa];
  // New farm setup.
  if (d) {
    a.ts = mb();
    // Create a new farm.
    zi();
    // New farm message.
    !b[U] && !lf && Ta(uj);
  }
  // Draw tunnels.
  a[v][i](Vg);
  if (a[Yb]) {
    // Draw mTuns sculptures.
    a[Yb][i](Vg);
    Zg();
  }
  // Draw hills.
  a[oc][i](Fi);
  // Draw card.
  if (a[V]) c(V)[r][Pe] = `url(img/${a[V]}.webp)`;
  // Draw anomaly.
  a.hair ?
    Wa(c(oa), `<img id=Fh src=img/hair.webp style=position:absolute;bottom:${a.hair[0]}px;left:${a.hair[1]}px;transform:rotate(${a.hair[2]}deg);opacity:.6>`) :
      c('Fh') && c('Fh')[o]();
  // Draw items.
  _g();
  Ji();
  Ki();
  // Re-add eggs into the farm.
  a.e[i](Sf);
  // Add lid function.
  if (a[aa][g] || a[V]) xe();
  // Re-enable spawner if it got turned off by something.
  !nd && h(a => {nd = 1; Cf()}, ja);
},

// Precalculates the tunnel system layout of the current ant farm.
zi = (t = 2 + f(4), w = 0, c = [-50, 1010], y = [0, 120, 240, 380, 495], m = 0, q = !f(4),
  r = !f(4), d, o = [], s = [], b = [], p = [], h = 1, j = 0, l = -1) => {
  // Ants do not randomly pick tunnel surface entrances, the program does.
  // It also places the adjacent hills in position, but set at zero height, so they can grow as the tunnels are dug.
  while (ma(a[v])[g] < t && 100> w++) {
    d = 20 + f(920);
    if (a[v].every(a => N(d - a.x1) >= 100)) {
      a[v][n]({t: M, id: 'ent-' + d, [e]: 0, [u]: 0, w: 15, h: 15, x1: d, y1: 0, x2: d, y2: 0, r: 45, br: re(6, 2), co: []});
      c[n](d - 8);
      c[n](d + 8);
    }
  }
  a[v][yb]((a, b) => a.x1 - b.x1);
  // For the first and last cav in this row, randomly choose whether it will be adjusted over to butt against the edge of the farm.
  // If neither is chosen, then forcibly choose one or the other.
  // This will be needed later - but it's better to know this ahead of time.
  !q && !r && (f(1) ? q = 1 : r = 1);
  for (; h < 5; h++) {
    let A = 1 + f(4),
      G = [],
      H = ff(A + 1)[oa](20),
      I = 0,
      J = [],
      z = 0,
      E, L, i, B, F, C, x;
    // Precalculate cavity widths.
    for (; z++ < A;) G[n](60 + f(155));
    // Work out cavity spacing.
    E = 960 - G[pc]((a, b) => a + b, 0) - H[pc]((a, b) => a + b, 0);
    while (E > 0) {
      L = Qa(1, hc(f(E / A)));
      H[f(A + 1)] += L;
      E -= L;
    }
    for (z = 0; z < A; z++) {
      I += H[z];
      i = {
          t: pa,
          id: `cav-${h}-${z}`,
          [e]: h,
          w: G[z],
          h: 32 + f(24),
          r: rf(f(16) - 8),
          br: re(10, 22),
          co: [],
          x1: I,
          y1: y[h] + f(56) - 30,
          [u]: 0,
        },
        B = i.h / 2;
      I += i.w;
      // Calculate x2/y2.
      tf(i);
      // Bump down if too close to the cav above.
      a[v][D](a => a[e] == i[e] - 1 && a.h / 2 + Qa(a.y1, a.y2) + 6 > ba(i.y1, i.y2) - B) && (i.y1 += 15) && tf(i);
      // Pull the cavity upward if it is too far below the bottom.
      if (h == 4) {
        let a = Qa(gc - i.y1 - (i.h / 2), gc - i.y2 - (i.h / 2));
        if (a < 0) i.y1 += a;
        if (Qa(i.y1 + i.h / 2, i.y2 + i.h / 2)> gc) i.y1 -= i.h/2;
      }
      // Pull cavities to the tube nip if required.
      if (h == 3) {
        if (q && !z) {
          i.x1 = -5;
          F = i.y1 - 332;
          i.y1 -= F;
          i[K] = 1; // Nip left.
          m = i;
        }
        if (r && z == A - 1) {
          i.x1 = 965 - i.w;
          F = i.y2 - 332;
          i.y1 -= F;
          i[K] = 2; // Nip right.
          m = i;
        }
      }
      // Re-calculate x2/y2.
      tf(i);
      // Find joining lines.
      te(b, i.id, i[e], 'x2', 'y2', i.x1, i.y1, 0, -40);
      te(b, i.id, i[e], 'x1', 'y1', i.x2, i.y2, -40, 0);
      te(b, i.id, i[e], 'x1', 'y1', i.x1, i.y1, 0, -40);
      te(b, i.id, i[e], 'x2', 'y2', i.x2, i.y2, -40, 0);
      // Store the top and bottom of the cav as obstructions.
      s[n]({x1: i.x1, y1: i.y1 - B, x2: i.x2, y2: i.y2 - B});
      s[n]({x1: i.x1, y1: i.y1 + B, x2: i.x2, y2: i.y2 + B});
      // Add the sideways line.
      if (J[g]) {
        C = Dc(J);
        x = {tids: [i.id, C.id], x1: C.x2, y1: C.y2, x2: i.x1, y2: i.y1, l: wa(C.x2, C.y2, i.x1, i.y1)};
        x.r = Ec(x.x2 - x.x1, x.y2 - x.y1);
        x[U] = x.l < 50 ? 100 : 100 - (o[k](a => a.x > x.x1 && a.x < x.x2)[g] * 10) - (x.r % 90 < 23 || x.r % 90> 67 ? 20 : 0);
        b[n](x);
      }
      a[v][n](i);
      J[n](i);
      o[n](i.x1);
      o[n](i.x2);
    }
  }
  // Adjust the line scores.
  b[i](b => {
    b[U] = ((!b.y1 || !b.y2) && a[v][k](a => a[e] === 1)[pc]((c, a) => (a.x1 >= b.x1 && a.x1 <= b.x2) || (a.x2>= b.x1 && a.x2 <= b.x2), 0)) || s[D](a => uf(b, a, 6)) ?
    0 : b.l < 50 ? 100 : 100 + b[U] - (o[k](a => a.x > b.x1 && a.x < b.x2)[g] * 20) - (b.r % 90 < 23 || b.r % 90> 67 ? 20 : 0);
    Hg && DL(b, b[U] / 100);
  }),
  // Join them up.
  a[v][i](c => (!c.co[g] || !Jb(a, c, {t: M}) || !f(4)) && se(b, p, c));
  // Another pass to try and link up any inaccessible areas.
  a[v][k](a => a.t == pa)[i](c => !Jb(a, c, {t: M}) && se(b, p, c, 'RL'));
  // Give each entrance another shot to connect as well.
  a[v][k](a => a.t == M)[i](a => !a.co[g] && se(b, p, a, 'RL'));
  // Give 4 more shots at connecting tunnels.
  for (; j++ < 4;) {
    let i = a[v][k](b => b.t == pa && b.co[g] < 2 && !Jb(a, b, {t: M}))[yb]((a, b) => a[e] - b[e]),
      f = x(i[k](a => a[e] == i[0][e]));
    if (!f) break;
    Cg[Zb]("reconnecting tun", f);
    se(b, p, f, 'RL');
  }
  // Sort the hill boundaries from left to right to make this all easier.
  c[yb]((a, b) => a - b);
  // Remove tuns without connections.
  do {
    l = a[v][ig](a => a.t == M && !a.co[g]);
    if (l > -1) {
      // Adjust hills.
      c[Dd](2 * l + 1, 2);
      // Remove that tun.
      a[v][Dd](l, 1);
    }
  } while (l != -1);
  // Keep only the accessible tunnels.
  a[v] = a[v][k](b => Jb(a, b, {t: M}));
  // In the rare cases where:
  // - No tuns left after filtering
  // - Adjusted tun is gone
  // - Adjusted tun has no path to the entrance
  // - There are fewer than 5 chamber cavities with paths to an entrance
  // It is a bad design. Used to do clearVars() and dumpFarm(1), but it's more fun to add
  // this feature where the user is blamed for a spill (and trigger it randomly too).
  if (!f(50) || !a[v][g] || !m || !Jb(a, m, {t: M}) || a[v][k](b => b.t == pa && Jb(a, b, {t: M}))[g] < 5)
    return Ai();
  // Store hills.
  for (j = 0; j < c[g]; j += 2) a[oc][n]({id: j / 2, l: c[j], r: c[j + 1], h: 0});
},

// Handles the generation of random border radius values.
re = (a, b) => ff.from({[g]: 6}, c => `${a + f(b)}px`)[pc]((a, b, c) => a + (c == 4 ? ' / ' : Hc) + b),

// Handles a farm creation bug that is easily fixable with a reload.
Ai = b => {
  // Blame the player and don't give them the fill item back so it looks like a feature.
  bb = 0;
  lf = 1;
  xb(`Woops! You've spilled your ${a[oa] || Cd} out.  Bad luck.`, Zb);
  Wa(E, `<div id=spill data-fill="${a[oa] || 'dirt'}"><div class=hill><div class=specks></div></div></div>`);
  dh();
  h(a => {gb(10, 1); xb('Here, have a bonus.')}, la / 2);
  h(a => xb("Refreshing in 3… 2… 1…", Zb), la * .8);
  h(a => location.reload(), la);
  c(Yh)[o]();
  c('kit')[o]();
},

// Builds a joining tunnel.
// These are the code names of the tunnel pieces:
// 'ent' - Surface level tunnel entrances.
// 'tun' - Joining tunnels which are referred to as "connections" in the UI (the long skinny ones).
// 'cav' - Chamber cavities (the thick horizontal ones).
// 'con' - A transition junction connecting tuns and cavs to each other - not obvious they're there.
se = (d, h, c, i = 'BL',
    j = {
      // Chooses one of the best available lines to implement as a joining tunnel.
      BL: (b, a = b[pc]((b, a) => (a[U] > b[U] && a[U] !== 0 ? a : b), {[U]: 0})) => a[U] && a,
      // Chooses a random line (favouring the "better" scored lines) to implement as a joining tunnel.
      RL: (b, c = f(b[pc]((a, b) => a + b[U], 0)), a) => {for (a of b) {c -= a[U]; if (c <= 0) return a}},
    },
    b = j[i](d.map(a =>
      (a.x1 == c.x1 && a.y1 == c.y1) ? {...a, X1: a.x1, Y1: a.y1, X2: a.x2, Y2: a.y2} :
      (a.x2 == c.x1 && a.y2 == c.y1) ? {...a, X1: a.x2, Y1: a.y2, X2: a.x1, Y2: a.y1} :
      (a.x1 == c.x2 && a.y1 == c.y2) ? {...a, X1: a.x1, Y1: a.y1, X2: a.x2, Y2: a.y2} :
      (a.x2 == c.x2 && a.y2 == c.y2) ? {...a, X1: a.x2, Y1: a.y2, X2: a.x1, Y2: a.y1} :
      null)[k](Boolean)[k](a => !h[D](b => uf(a, b, 2))))
  ) => {
  if (b) {
    // Remove this line from future choices.
    d = d[k](a => a.x1 != b.x1 || a.y1 != b.y1 || a.x2 != b.x2 || a.y2 != b.y2);
    h[n](b);
    let q = na(a, b.tids[X](a => a != c.id)),
      // Create connection pieces on the ends of those tunnel pieces (unless it's an entrance, then we just use the entrance; or if there's already a connector there).
      s = a[v][X](a => a.t == $b && a.x1 == b.X1 && a.y1 == b.Y1),
      t = a[v][X](a => a.t == $b && a.x1 == b.X2 && a.y1 == b.Y2),
      f = c.t == M ? c : s ? s : Tg(c, b.X1, b.Y1),
      l = q.t == M ? q : t ? t : Tg(q, b.X2, b.Y2),
      // Figure out the top and bottom one.
      m = f.y1 < l.y1 ? f : l,
      o = f.y1> l.y1 ? f : l,
      // Add the joining tunnel.
      // It would be better to create 3 or 4 tunnels in an s-shape with offset 'con' pieces along the way. But this works for now.
      r = {
        t: p,
        id: 'tun-' + h[g],
        [e]: (m[e] + o[e]) / 2,
        h: 14,
        w: Rc(o.x2 - m.x1, o.y2 - m.y1),
        r: Ec(o.x2 - m.x1, o.y2 - m.y1, 90),
        br: re(5, 2),
        co: [f.id, l.id],
        x1: m.x1,
        y1: m.y1,
        x2: o.x2,
        y2: o.y2,
        [u]: 0,
      };
    // Create inter-connection data.
    f.co[n](r.id);
    l.co[n](r.id);
    //
    Hg && DL({x1: f.x1, y1: f.y1, x2: l.x2, y2: l.y2});
    a[v][n](r);
  }
},

// Finds paths for traversing tunnel systems and determines if and how tunnel pieces connect.
Jb = (f, a, b, c = [], g = 0, h = 0, d = 0, e, i) => {
  // If the current tunnel matches all target attributes, return the path.
  if (ma(b).every(c => g ? a[c] != b[c] : a[c] == b[c])) return c;
  if (!h || a[u] == 100 || !d)
    // Recursively search for the path. (Shuffle the next tunnels to introduce randomness.)
    for (e of pe(a.co[k](a => !c[Y](a) && a != d)))
      if (i = Jb(f, na(f, e), b, [...c, e], g, h, d || a.id)) return i;
},

// Creates a connection junction between chamber cavities and joining tunnels.
Tg = (b, d, f, c = {t: $b, id: 'con-' + a[v][g], [e]: b[e], w: 28, h: 28, r: 45, br: re(9, 4), co: [b.id], x1: d, y1: f, x2: d, y2: f, [u]: 0}) => {
  b.co[n](c.id);
  a[v][n](c);
  return c;
},

// Calculates the 2nd point in a tunnel piece.
tf = a => {
  a.x2 = a.x1 + a.w * db(ub(a.r));
  a.y2 = a.y1 + a.w * lb(ub(a.r));
},

// Finds how joining tunnels might connect the chamber cavities to each other and to entrances.
te = (d, f, g, b, h, c, j, l, m) => {
  a[v][k](a => a[e] < g && a[b] < c)[i](a => Ug(d, f, a.id, a[b], a[h], c, j, l));
  a[v][k](a => a[e] < g && a[b]>= c)[i](a => Ug(d, f, a.id, c, j, a[b], a[h], m));
},

// Does the heavy lifting for lineFinder().
Ug = (h, i, g, b, d, c, e, j, f = {tids: [i, g], x1: b, y1: d, x2: c, y2: e, d: N(c - b), l: wa(b, d, c, e), [U]: j}) => {
  if (a[v][k](a => a.t != M && g != a.id).every(a => !uf(a, f, 20))) {
    f.r = Ec(c - b, e - d);
    b > 5 && c > 5 && b < 955 && c < 955 && h[n](f);
  }
},

// Checks if two lines (actually rectangles) intersect along their length.
uf = (c, d, a, b = 30, e = 0) => {
  let {x1: f, y1: g, x2: h, y2: i} = c,
    {x1: j, y1: k, x2: l, y2: m} = d,
    t = (a, b, c, d, f, e = f / wa(a, b, c, d)) => ({x: a + e * (c - a), y: b + e * (d - b)}),
    {x: n, y: o} = t(j, k, l, m, b),
    {x: p, y: q} = t(l, m, j, k, b),
    r = (a, b, c, d, e, f) => ((e - a) * (d - b) - (f - b) * (c - a)),
    u = r(n, o, p, q, f, g),
    v = r(n, o, p, q, h, i),
    w = r(f, g, h, i, n, o),
    x = r(f, g, h, i, p, q),
    y = ((u > 0 && v < 0) || (u < 0 && v> 0)) && ((w > 0 && x < 0) || (w < 0 && x> 0)),
    z = (c, d, e, f, g, h = Rb(c, d, e, f), a = (g / 2) * h.y, b = (g / 2) * h.x) =>
      [{x: c - a, y: d + b }, {x: c + a, y: d - b}, {x: e + a, y: f - b}, {x: e - a, y: f + b}],
    A = (a, b) => !(
      Qa(a[0].x, a[1].x, a[2].x, a[3].x) < ba(b[0].x, b[1].x, b[2].x, b[3].x) ||
      ba(a[0].x, a[1].x, a[2].x, a[3].x)> Qa(b[0].x, b[1].x, b[2].x, b[3].x) ||
      Qa(a[0].y, a[1].y, a[2].y, a[3].y) < ba(b[0].y, b[1].y, b[2].y, b[3].y) ||
      ba(a[0].y, a[1].y, a[2].y, a[3].y)> Qa(b[0].y, b[1].y, b[2].y, b[3].y)
    ),
    s = ((f - h) * (k - m) - (g - i) * (j - l));
  return e && y && s != 0 ? {
      x: ((f * i - g * h) * (j - l) - (f - h) * (j * m - k * l)) / s,
      y: ((f * i - g * h) * (k - m) - (g - i) * (j * m - k * l)) / s
    } : y || A(z(f, g, h, i, a), z(n, o, p, q, a));
},

// Gets tun object from tun ID.
na = (b, a) => a && eb(b[v], a),

// Renders a tunnel.
Vg = a => {
  Wa(c(jg),
    `<div id=${a.id} class="tp ${a.t}"style="left:${a.x1}px;top:${a.y1}px;height:${a.h}px;width:${a.w}px;transform:rotate(${a.t == p ? a.r - 90 : a.r}deg);border-radius:${a.br}${(wb(a) ? `;margin-left:-${a.w / 2}px` : w) + `;margin-top:-${a.h / 2}px`}"><div class=prog></div></div>`
  );
  ue(a);
},

// Updates tunnel progress.
// Note: calling function is responsible for making sure the relevant farm is currently displayed.
ue = (a, b = ga(`#${a.id} .prog`), e = c(a.id)) => {
  if (b) {
    a.rwip && b[d][m]('rwip');
    switch (a.t) {
      case M:
        b[r][H] = a[u] / 100 * 15 - 15 + Fa;
        break;
      case $b:
        b[r][yd] = b[r][nc] = a.h * a[u] / 100 + Fa;
        e[r].marginTop = e[r].marginLeft = -a.h * a[u] / 200 + Fa;
        break;
      case p:
        b[r][nc] = a[u] + '%';
        break;
      case pa:
        b[r][nc] = a[u] + '%';
        b[d].toggle('wip', a[u] > 0 && a[u] < 100);
        break;
    }
  }
},

// Updates the wayPoints global.
Wg = a => {tb[a.id] = Di(Ci(a[v][k](a => a[u] > 0).map(a => Bi(a))))},

// Calculates waypoints for the perimeter of the tunnel area.
Bi = (d, c = 5, g = d.x1, e = d.y1, f = {x: 7, y: 7}, b = [], a) => {
  let {x1: i, y1: j, x2: y, y2: z, t: m, [u]: v, w: k, h: l, r: w} = d, // <-- Important: Don't optimise the destructuring for brevity as the minifier will ruin it!
    x = d.br.split('/').map(a => a.trim()),
    r = x[0].split(Hc).map(a => Va(a)),
    s = x[1].split(Hc).map(a => Va(a)),
    h = {tl: {x: r[0], y: s[0]}, tr: {x: r[1], y: s[1]}, br: {x: r[2], y: s[0]}, bl: {x: r[3], y: s[1]}},
    o = h.tl.y + h.bl.y, q = o - l,
    t = (d, e, f, g, h, i, j, c = [], a = h, b) => {
      for (; a <= i; a += j * 2) {
        b = ub(a);
        c[n]({x: d + f * db(b), y: e + g * lb(b)});
      }
      return c;
    };
  // Corrections.
  j -= l / 2;
  if (m == p) w -= 90;
  if (m == $b || m == M) i -= k / 2;
  if (m == pa) e = (j + z) / 2;
  // Arc trimming.
  if (o> l) {
    h.tl.y -= q / 2;
    h.bl.y -= q / 2;
  }
  o = h.tr.y + h.br.y;
  if (o > l) {
    q = o - l;
    h.tr.y -= q / 2;
    h.br.y -= q / 2;
  }
  // Partial tun corrections.
  if (v < 100) {
    k *= v / 100;
    if (d.rwip) {
      if (m == pa) i = y - k;
      if (m == p) i += k - k;
      h.tl = h.bl = f;
    }
    else {
      if (m == $b) {
        l = k;
        i = i - k / 2;
        h.tl = h.bl = f;
      }
      h.tr = h.br = f;
    }
  }
  // Assemble the points.
  b[n](...t(i + h.tl.x, j + h.tl.y, h.tl.x, h.tl.y, S, Ld, c)); // Top left
  for (a = i + h.tl.x; a <= i + k - h.tr.x; a += c) b[n]({x: a, y: j}); // Top line
  b[n](...t(i + k - h.tr.x, j + h.tr.y, h.tr.x, h.tr.y, Ld, fc, c)); // Top right
  for (a = j + h.tr.y; a <= j + l - h.br.y; a += c) b[n]({x: i + k, y: a}); // Right line
  b[n](...t(i + k - h.br.x, j + l - h.br.y, h.br.x, h.br.y, 0, 90, c)); // Bottom right
  for (a = i + h.bl.x; a <= i + k - h.br.x; a += c) b[n]({x: a, y: j + l}); // Bottom line
  b[n](...t(i + h.bl.x, j + l - h.bl.y, h.bl.x, h.bl.y, 90, S, c)); // Bottom left
  for (a = j + h.tl.y; a <= j + l - h.bl.y; a += c) b[n]({x: i, y: a}); // Left line
  // Adjust for rotation correctly.
  return b.map((b, a = ub(w), c = b.x - g, d = b.y - e) => ({x: db(a) * c - lb(a) * d + g, y: lb(a) * c + db(a) * d + e}));
},

// Removes points that are inside other shape's perimeters or out-of-bounds.
Ci = (a, b = (f, a, c = f.y, h = a[g], d = 0, b = 0, e = h - 1) => {
    for (; b < h; e = b++) {
      let i = a[b].x, g = a[b].y, j = a[e].y;
      if ((g> c) !== (j > c) && f.x < ((a[e].x - i) * (c - g)) / (j - g) + i) d = !d;
    }
    return d;
  }) => {
  a[i]((d, e, c) => {
    d[i](d => {
      for (c = 0; c < a[g]; c++)
        if (c !== e && b(d, a[c]) || d.y < 2 || d.x < 0 || d.x> 960) {
          d.r = 1;
          break;
        }
    });
  });
  return Xg(a.map(a => Ei(a[k](a => !a.r)))[k](a => a[g] > 2));
},

// Cleans up the waypoints.
Di = (h, d = 2, e = .2, b = [...h], f = [], c, a) => {
  b[yb]((a, b) => a.y - b.y);
  while (b[g] > 0) {
    let i = [], j = b[Ic](), l, k, m;
    i[n](j);
    while (b[g] > 0) {
      l = -1;
      k = Infinity;
      for (c = 0; c < b[g]; c++) {
        m = wa(j.x, j.y, b[c].x, b[c].y);
        if (m < k) {
          k = m;
          l = c;
        }
      }
      if (k> 12) break; // The max distance between points to consider.
      j = b[Dd](l, 1)[0];
      i[n](j);
    }
    f[n](i[g] > 2 ? i.map((b, f, c, m = 0, n = 0, h = 0, i = 0, j, k, l) => {
      if (b.y < 50) return b; // Skip smoothing for low-y points
      for (a = f - d; a <= f + d; a++) {
        if (j = c[(a + c[g]) % c[g]]) {
          k = wa(b.x, b.y, j.x, j.y);
          if (k> i) i = k;
        }
      }
      if (i > 12) return b;
      for (a = f - d; a <= f + d; a++)
        if (a>= 0 && a < c[g]) {
          l = c[a];
          m += l.x;
          n += l.y;
          h++;
        }
      return h ? {x: b.x + (m / h - b.x) * e, y: b.y + (n / h - b.y) * e} : b;
    }) : i);
  }
  return Xg(f[k](a => a[g] > 5));
},

// Filters out waypoints that are too close to each other.
Ei = (d, c = [], a, b) => {
  for (a = 0; a < d[g]; a++) {
    b = d[a];
    if (!c[D](a => Rc(b.x - a.x, b.y - a.y) < 2)) c[n](b);
  }
  return c;
},

// Stitches together segments of waypoints in an intelligent way to preserve as much continuity as possible.
Xg = (a, b = []) => {
  while (a[g] > 0) {
    let c = a[Ic](), d = 1, e;
    while (d) {
      d = 0;
      for (e = 0; e < a[g]; e++) {
        let f = a[e], h = c[0], i = c[c[g] - 1], j = f[0], k = f[f[g] - 1];
        // 12 is the join threshold.
        if (wa(i.x, i.y, j.x, j.y) <= 12) {
          c = c.concat(f);
          d = 1;
        }
        else if (wa(i.x, i.y, k.x, k.y) <= 12) {
          c = c.concat(f[_d]().reverse());
          d = 1;
        }
        else if (wa(h.x, h.y, k.x, k.y) <= 12) {
          c = f.concat(c);
          d = 1;
        }
        else if (wa(h.x, h.y, j.x, j.y) <= 12) {
          c = f[_d]().reverse().concat(c);
          d = 1;
        }
        if (d) {
          a[Dd](e, 1);
          break;
        }
      }
    }
    b[n](c);
  }
  return b.flat();
},

// Renders hills.
Fi = a => {
  Wa(c(oc), `<div id=hill-${a.id} class=hill style="left:${a.l}px;width:${a.r - a.l}px"><div class=specks></div></div>`);
  Yg(a);
},

// Updates hill height.
Yg = a => c('hill-' + a.id)[r][yd] = a.h + Fa,

// Corrects background position of farm sculptures.
Zg = a => Ra('.prog')[i](a => {let b = a[ad]('.tp'); a[r].backgroundPosition = b[r][ea] + Hc + b[r][H]}),

// Set up the msgLog panel.
Gi = (a = c('msglog'), b = c('msglog-dn'), e = c('msglog-txt')) => {
  b[s](G, c => {
    if (a[d][zb](qc)) {
      a[d][o](qc);
      b[kg] = '▼';
    }
    else {
      e[B] = '<div class="msg mlhd"><p>Message Log</p></div>';
      me[i](a => e[B] += `<div class="msg ${a.t}">${a.msg}</div>`);
      a[d][m](qc);
      b[kg] = '▲';
    }
  });
},

// Set up the switch control panel.
Hi = (a = c('switch'), b = c(Fj)) => {
  b[s](G, c => {
    if (a[d][zb](ae)) {
      a[d][o](ae);
      b[kg] = '▲';
    }
    else {
      a[d][m](ae);
      b[kg] = '▼';
    }
  });
  c(ci)[s](G, Ii);
},

// Supports the switcher functionality.
Ii = (c, b = c[_b][ad]('.switch-f')?.[ra].id) => b && a.id != b && Sc(b),

// Updates the farm switch control panel.
Tb = a => {
  if (b[P][g] > 1) c('switch')[d][m](z);
  c(ci)[B] = w;
  b[P][i](a => c(ci)[Ad](qe(`<div class="switch-f${Sb(a) ? ' cur' : w}"data-id=${a.id}><div class=sw-t>${a[Yb] ? '<img src=img/sculpt.webp>': Od(a)}</div></div>`)));
  h(a => bb = 1, ja);
  // Prevent soft-lock due to crucible functionality. (Checked here because this func is somewhat of a multi-farm overwatcher)
  b[P][g] && b[P].every(a => a[Yb]) && !b[L][D](a => a.k == Qe) && h(a => td(Qe), W);
},

// Retrieves the HTML for a farm's thumbnail.
// Note: the 'ab' and 'fl' classes are there in anticipation of future divs that match the same position/dimensions, but that can be changed if that is to never be implemented.
Od = (a, b = 1, c = 1) => (b ?
  `<div class=thumb data-col=${a[t]} data-fill=${a[oa]}><div class="crd ab"style="${a[V] ? `background-image:url(img/${a[V]}.webp)` : w}"></div><div class="fll fl"></div><div class=gl></div><div class=de></div><div class=ld></div><div class=n1></div><div class=n2></div><div class=n3></div><div class=n4></div></div>` : w)
  + (c ? `<div class=Bthumb data-col=${a[Za]}><div class=Bl></div><div class=Bn>${a.n}</div><div class=Br></div><div class=Bt></div></div>` : w),

// Calculates the y-position of the drink feeder.
$g = (b, a = Va(b)) => (ud(a + 25) + ba(ud(a), ud(a + 50))) / 2 + Fa,

// Re-adds placed items when switching to farm or loading page.
_g = b =>
  a[aa][i](b => {
    let e = [`left:${b.x}`], d = b.t == Ua, f = b.t == Ga;
    (d || f) && e[n](`bottom:${d ? ud(Va(b.x) + 25) + Fa : $g(b.x)}`);
    d && e[n](`transform:rotate(${Td({x: b.x, [y]: 1, f: a.id}) - 90}deg)`);
    Wa(c(f ? Ua : b.t), `<div id=${b.id} style=${e[Ab](';')} class=${l[b.k].t} data-fx=${l[b[t]]?.fx}>${d || f ? vf(b) : Pd(b)}</div>`);
  }) || Th(a),

// Re-adds placed stickers when switching to farm or loading page.
Ji = b => a[be][i](a => ch(c(be), a, w)),

// Re-adds the nip items if needed.
Ki = b => {
  a[Aa][i](a => {
    let g = a[Na], b = Nb[a[K]], f = g.k == rc, e = f ? c(rc) : c('t-' + b);
    c(b)[d][m](Bb, lg);
    e[d][m](b, sc, z);
    c(Bd + b)[d][m](sc, !f && mg);
    if (f) ga(Gj)[r][Pe] = l[g[t]][t];
    e[ra].id = a.f;
    e[s](G, b => wf(a, e));
  });
  ah();
},

// Hides the tube follow links.
Li = a => Ra(di)[i](a => a[d][o](z)),

// Updates the tube follow link functionality.
ah = a => {
  Ra(di)[i](a => {
    let b = a[Hj];
    a[s](G, c => {
      c.stopPropagation();
      bb ? Sc(b[ra].id) : Kf(a);
    }, {once: 1});
  });
  Gb[s](ei, bh);
  bh();
},

// Updates the tube follow link visual position.
bh = a => {
  h(a => {
    Ra(di)[i](a => {
      let b = a[Hj], c = b[hb]()[ea] + (['t-nip-tl', 't-nip-bl'][Y](b.id) ? 1060 : 0);
      a[r][ea] = ba(c + 480, Gb[Re] - 60) - c + Fa;
      a[d].toggle(z, b[d][zb](sc));
    });
  }, ua);
},

// Provides common markup for addDecals() and placeDecal() and appends it to the supplied container.
ch = (b, a, c = ' temp') => Wa(b, `<div id=${a.id} style=left:${a.x};top:${a.y};transform:rotate(${a.r}deg) class="${l[a.k].t} ${a.k + c}"><img src=img/${a.k}.webp></div>`),

// Provides the HTML code for a food or beverage item.
vf = a => `<div class="${a.t} ${a.k} sz-${ba(4, hc(a.sz / 20))}"><div></div></div>`,

// Calls SVG() to get the SVG code based on a scene item's attributes.
Pd = a => SVG(a.k, l[a[t]][t], l[a[t]].fx == Oa ? '#fff' : '#000', l[a[t]].fx == Oa ? '.6' : '.25'),

// Get img/svg tag for a bag/drop item.
ve = (b, a = l[b.k]) => [qb, tc][Y](a.t) ? Pd(b) :
  ['paintm', Da][Y](a.t) ? Pd({k: a.fx == Oa ? 'paintm' : Da, [t]: b.k }) :
  a.t == ib ? Pd({k: ib, [t]: a[t] || b[t] }) :
  `<img src="img/${a.t == sa ? sa : b.k}.${a.ext || 'webp'}">`,

// Dumps the current farm, and optionally restart.
dh = d => {
  // Stow scenery items in bag.
  if (a[V]) {
    b[L][n]({k: a[V]});
    a[V] = c(V)[r][Pe] = w;
  }
  // Remove scenery and decor items, and place into bag.
  a[aa][i](a => a.t != Ua && a.t != Ga && b[L][n](a));
  a[aa] = [];
  c(qb)[B] = w;
  c(Ua)[B] = w;
  if (!d) a[oa] = w;
  a.a[i](Rd);
  a.e[i](Qf);
  Ra('.carry')[i](a => a[o]());
  // Reset farm to defaults.
  Ca(ca(a, pd(Xh)), 'dun', 'hair');
  // Undraw tunnels and hills.
  // Save these changes.
  xa();
  if (!lf) {
    c(jg)[B] = w;
    c(oc)[B] = w;
    // This should handle the rest...
    sf(d);
  }
  Tb();
},

// "Uses" an inventory item.
eh = (e, u = 1, j = 1, p = b[L][e], i = p.k, C = l[i].t, q = 0,
  v = {
    [ac]() {
      if (!a[oa]) {
        a[oa] = i;
        a.hair = i == Se ? [20 + f(400), 20 + f(860), f(fc)] : 0;
        sf(1);
        u = b[U] > 0;
        Tb();
      }
    },
    [ng]: dh,
    gift() {for (; q++ < 3 + f(2);) sd(0)},
    [ce]() {p.sz = 100; we(e, Ua)},
    [og](b = a[aa][X](a => a.t == Ga)) {p.sz = 100; b ? Ni(b, e) : we(e, Ga)},
    [qb]() {j = 0; we(e, qb)}, // Don't del because placeItem() needs the item to remain in the bag, and will del the item when placed.
    [tc]() {v[qb]()},// Uses same logic as scenery.
    [Te]() {j = 0; Mi(e)}, // Don't del because placeDecal() needs the item to remain in the bag, and will del the item when placed.
    [V](f = c(uc)[d], e = c(V)[r]) {
      bb = 0;
      // Stow existing card in bag.
      a[V] && b[L][n]({k: a[V]});
      // Insert card with animation.
      a[V] = i;
      h(b => {
        f[m](Bb);
        h(b => {
          e[Jc] = '80vh';
          h(b => {
            e[Pe] = `url(img/${a[V]}.webp)`;
            e[Jc] = '50%';
            h(a => {
              f[o](Bb);
              xe();
              Tb(); // Will re-enable switcher.
            }, Ig);
          }, ja);
        }, R);
      }, R);
    },
    [ib](q = p.a, k = pd(p)) {
      j = 0; // Don't delete because it will dump the item before the setTimeout below can check it.
      if (i == rc) {
        h(b => {
          xf((f, b = c(rc), g = Nb[f]) => {
            k.a = [];
            k.e = [];
            a[Aa][n]({[K]: f, [Na]: k});
            b[d][m](g, z);
            ga(Gj)[r][Pe] = l[k[t]][t];
            jc(e);
            h(a => b[d][m](sc) || c(Bd + g)[d][m](sc), Ac);
            b[s](G, c => wf(Wd(a), b));
          });
        }, R);
      }
      else {
        bb = 0;
        h(j => {
          c(uc)[d][m](Bb);
          h(j => {
            if (i == fi) {
              for (let b = 0; b < q[g]; b++) {
                h(c => {
                  let d = ca(q[b], {x: Gb[Re] / 2 + f(ec) - 100, y: -30, [I]: Kc});
                  Ca(d, $a, rc);
                  eg(d, a);
                  Gf(d);
                }, R * b);
              }
              k.a = [];
            }
            else {
              for (let a = 0; a <= (l[i].W || 0); a++) {
                h(c => {
                  Gf(ca(Df(b, Gb[Re] / 2 + f(ec) - 100, -30, f(30), Zd, a ? 'W' : 'Q', l[i].ant), {
                    [y]: va(f(1)),
                    [I]: Kc,
                    [Ue]: 0,
                  }), b);
                }, R * a);
              }
            }
            // Stow an empty vial in the bag.
            k.k = rc;
            k[t] ||= l[i][t];
            b[L][n](k);
            jc(e);
            h(a => {
              c(uc)[d][o](Bb);
              xe();
              bb = 1;
            }, W * 2);
          }, R);
        }, R);
      }
    },
    [Da]() {j = 0; La(Da, e)}, // Don't del as we aren't marking every paint with "keep: 1", the popup workflow will do it.
    [sa]() {j = 0; La(sa, e)}, // Don't del as we aren't marking every hat with "keep: 1", the popup workflow will do it.
  },
  A = {
    [Za]() {La(Za, e)},
    [bc]() {La(bc, e)},
    feng() {La('feng', e)},
    [bd]() {La(bd, e)},
    antfaxpro() {A[bd]()},
    Hf,
    cologne(a = c('fx')) {
      pb('spray', .7);
      a[d][m]('fog');
      for (; q < 20;) h(a => Cf(0), q++ * W);
      h(b => {
        a[d][m](pg);
        h(b => a[d][o]('fog', pg), 4500);
      }, 19 * W);
    },
    bus(a = b[P][k](a => a.a[g])[g]) {//  @TODO test this
        //let i = last(_.farms.filter(f => f.a.length)),
        // @TODO this is not supposed to allow dystopia when you have just 1 or more than 4 farms - but it does.
        //locKeys = (i == 3) ? ['dystopia'] : keys(locs).filter(lk => (i === 1 || i > 4) ? lk != 'dystopia' : lk),
        locKeys = (a == 4) ? [hi] : ma(gg)[k](b => (a === 1 || a > 4) ? b != hi : b),
        loc = x(locKeys);
        b.bg = loc + (f(gg[loc].c) + 1);
        b.au = gg[loc].a;
        Le();
        yf();
    },
    backdrop() {b.grad = (b.grad + 1) % 8; b.bg = w; yf()},
    [Ve]() {Ti(3)},
    [We]() {b.ss = Date.now() + (3 * cb) + f(cb); oh(); Ta(l[We][Z])},
    [Ed]() {La(Ed, e)},
    [Qe]() {Rg(); gb(20, 1)},
    [cd]() {xb('<b>Win.</b>', 'err'); b.win = 1; gb(100, 1)},
    crucible() {Pi(); gb(20, 1)},
  },
  B = A[i] || v[C]
) => {
  fb();
  B && B();
  u && Ta(l[i][Z]);
  j && !l[i].keep && jc(e);
},

// Adds stickers into the farm.
// This function is awfully similar to placeItem(), but just different enough to be annoying to refactor together :(
// Note: Once the sticker is chosen it can't be cancelled, other than reloading the page.  I think that makes sense though, because once you peel a sticker... well, you're rather stuck.
Mi = (g, e = c(be), f = ca(b[L][g], { id: 'i' + Ja() }), h = e[hb](), i = 0, j = 0) => {
  c(dd)[d][m](z);
  ch(e, f);
  let b = c(f.id), l = b[_c], p = b[ii],
  k = a => {
    b[r][ea] = `${Ib((a[_a] ?? (a[cc] && a[cc][0][_a])) - h[ea] - l / 2, 0, e[_c] - l)}px`;
    b[r][H]  = `${Ib((a[rb] ?? (a[cc] && a[cc][0][rb])) - h[H] - p / 2, 0, e[ii] - p)}px`;
  },
  v = e => {
    b[d][o]('temp');
    f.x = b[r][ea];
    f.y = b[r][H];
    a[be][n](f);
    f.k == 'coexist' && (a[Ob] = 1);
    jc(g);
    c(dd)[d][o](z);
    xa();
    E[qa](Lc, k);
    E[qa](ed, q);
    E[qa](fd, k);
    E[qa](vc, t);
    E[qa](gd, u);
  },
  q = (a, c = b[hb]()) => a[_a] >= c[ea] && a[_a] <= c[Xe] && a[rb]>= c[H] && a[rb] <= c[Jc] && v(),
  t = (b, a = b[cc][0]) => {i = a[_a]; j = a[rb]},
  u = (b, a = b[Ij][0]) => N(a[_a] - i) < 5 && N(a[rb] - j) < 5 && q(a);
  b[r][ea] = `${(e[_c] - l) / 2}px`;
  b[r][H] = `${(e[ii] - p) / 2}px`;
  E[s](Lc, k);
  E[s](ed, q);
  E[s](fd, k, {[Fd]: 0});
  E[s](vc, t, {[Fd]: 1});
  E[s](gd, u, {[Fd]: 1});
},

// Adds items into the farm.
we = (i, f, e = ca(b[L][i], { id: 'i' + Ja(), t: f }), g = c(f == Ga ? Ua : f), p = g[hb](), j = 0, k = 0) => {
  bb = 0;
  c(dd)[d][m](z);
  h(a => c(uc)[d][m](Bb), R);
  Wa(g, `<div id=${e.id} class="${l[e.k].t} temp up">${f == qb ? Pd(e) : vf(e)}</div>`);
  let q = c(e.id), t = q[_c],
  u = (c, b = Ib((c[_a] ?? (c[cc] && c[cc][0][_a])) - p[ea] - t / 2, 0, g[_c] - t)) => {
    q[r][ea] = b + Fa;
    if (f == Ua) {
      q[r][Jc] = ud(b + t / 2) + Fa;
      q[r][de] = `rotate(${Td({ x: b + t / 2, [y]: 1, f: a.id }) - 90}deg)`;
    }
    if (f == Ga) q[r][Jc] = $g(b);
  },
  A = g => {
    q[d][o]('temp');
    e.x = q[r][ea];
    a[aa][n](e);
    if (!l[e.k].keep) jc(i);
    h(() => c(uc)[d][o](Bb), R);
    c(dd)[d][o](z);
    xe();
    bb = 1;
    if (f == qb) b.scene[e.id] = 1;
    xa();
    E[qa](Lc, u);
    E[qa](ed, v);
    E[qa](fd, u);
    E[qa](vc, w);
    E[qa](gd, x);
  },
  v = (a, b = q[hb]()) => a[_a] >= b[ea] && a[_a] <= b[Xe] && a[rb]>= b[H] && a[rb] <= b[Jc] && A(),
  w = (b, a = b[cc][0]) => {j = a[_a]; k = a[rb]},
  x = (b, a = b[Ij][0]) => N(a[_a] - j) < 5 && N(a[rb] - k) < 5 && v(a);
  h(a => q[d][o](ae), ja);
  q[r][ea] = `${(g[_c] - t) / 2}px`;
  E[s](Lc, u);
  E[s](ed, v);
  E[s](fd, u, {[Fd]: 0});
  E[s](vc, w, {[Fd]: 1});
  E[s](gd, x, {[Fd]: 1});
},

// Pulls existing drink feeder out of farm and switches to placeItem to insert new drink.
Ni = (b, f, e = c(b.id)) => {
  bb = 0;
  h(a => c(uc)[d][m](Bb), R);
  h(c => {
    e[d][m](ae);
    h(c => {
      a[aa] = a[aa][k](a => a.id != b.id);
      e[o]();
      we(f, Ga); // Will re-enable switcher.
    }, Ac);
  }, Ac);
},

// Puts lid functionality on the lid.
xe = (a = c(uc)) => {
  a[s](G, Oi);
  a[d][m]('use');
},

// Provides the common initialisation workflow for createArrows() and createNipArrows().
fh = (a, b = c(dd)) => {
  b[d][m](z);
  a.replaceWith(a[ji](0));
  b[s](G, Qd);
  Gb[s](ei, Qd);
  return c(qg);
},

// Shows arrows when lid lifted.
Oi = (j, e = fh(c(qg)), f = c(V), g = [...(a[V] ? [f] : []), ...Ra('#scenery > *, #food > *')], ) => {
  c(uc)[d][m](Bb);
  Ta(zj);
  h(c => {
    g[i]((c) => {
      let i = eb(a[aa], c.id), l = c[hb](), g = ta[_h]('div'), j = l[nc], p = {[V]: 100, [qb]: 140, [Ga]: 220, [Ua]: 220};
      g[d][m]('arrow');
      e[Ad](g);
      g[r][nc] = j + Fa;
      g[r][ea] = `${(l[ea] + j / 2) - e[hb]()[ea] - j / 2}px`;
      g[r][H] = `${p[c.id] ?? p[i.t] ?? 180}px`;
      g[s](G, e => {
        g[d][m](lg);
        if (c == f) {
          a[V] && b[L][n]({k: a[V]});
          a[V] = 0;
          f[r][Jc] = '80vh';
        }
        else if (c) {
          if (i.t != Ua && i.t != Ga) {
            b[L][n](i);
            b[L] = b[L][k](a => a);
          }
          a[aa] = a[aa][k](a => a.id != c.id);
          c[d][m](ae);
          h(a => c[o](), ja);
        }
        xa();
        Tb();
      });
    });
    e[d][m](z);
  }, R);
},

// Replaces lid and removes arrows.
Qd = (e, a = c(dd), b = c(qg)) => {
  h(a => {
    c(uc)[d][o](Bb);
    b[B] = w;
  }, ja);
  a[d][o](z);
  b[d][o](z);
  a[qa](G, Qd);
  Gb[qa](ei, Qd);
},

// Shows arrows when something attached to a nipple is clicked.
wf = (e, t, j = e[Na], u = fh(c(qg)), p = Nb[e[K]], l = ta[_h]('div'),
v = c(p), x = v[hb](), y = c(Bd + p), q = J(e.f)) => {
  l[d][m]('arrow', 'niparrow', p);
  u[Ad](l);
  l[r][ea] = `${x[ea] - u[hb]()[ea] + 10}px`;
  l[r][H] = `${x[H] - 80}px`;
  l[s](G, c => {
    if (a.a[D](a => a.q[0]?.[C] == K)) Kf(l); // An ant is trying to walk through the nip, deny this action.
    else {
      Qd();
      y[d][o](sc);
      t[d][o](sc);
      v[d][o](lg);
      h(a => {
        t[d][o](p);
        v[d][o](Bb);
        y[B] = w;
        t[d][o](z);
      }, Ac);
      if (j.k == bc) {
        // Chuck the ants into the other farm somewhere.
        j.a[i](a => {
          a.x = 20 + f(940);
          a.y = Lb(a);
          q.a[n](a);
          eg(a, q);
        });
        j.a = [];
        q[Aa] = q[Aa][k](a => a.id != e.id);
        // Note: tubeLoop() is responsible for stopping tubeInterval if no longer needed.
      }
      if (j.a[g]) j.k = fi;
      Ca(a[Aa], e[K]);
      a[Aa] = a[Aa][k](a => a[K] != e[K]);
      b[L][n](j);
      xa();
    }
  });
  u[d][m](z);
},

// Fetches a list of usable nips the farm has, optionally restricted to available nips.
ye = (d = 0, b = a, c = Nb[_d](-2)) => (b[v][i](a => a[K] && a[u] == 100 && c[n](Nb[a[K]])), c[k](a => !d || !b[Aa][D](b => b[K] == a))),

// Enables the nipple selection UI mode.  Calling workflow is responsible for checking getNips(1) works.
xf = (b, e = ye(1), a = e => {
    let f = e[_b][ad]('.nip').id;
    Ra('.nip')[i](b => {
      b[d][o]('sel');
      b[qa](G, a);
    });
    E[_c]; // force reflow
    c(f)[d][m](Bb);
    h(a => c(f)[d][m](lg), ua);
    b(Nb[dc](f));
  }) => {
  e[i](b => {
    c(b)[d][m]('sel');
    c(b)[s](G, a);
  });
  xb('Select a nipple.', Zb);
},

// Sets the body background to simulate player location.
yf = (a = c('afs')) => {
  a[ki] = w;
  if (b.bg) {
    a[d][m](jb);
    a[r][Jj] = `url(img/bg/${b.bg}.webp`;
  }
  else if (b.grad) {
    a[d][m]('gr' + b.grad);
    a[r][Jj] = w;
  }
},

// Pours liquid metal into farm.
// @TODO handle eggs, food/drink and anything else we didn't think of at the time this function was written. carried items!
Pi = (l = rj('sizz1'), g = c('fx'), j = c(oc), e = qe('<div id=pour></div>')) => {
  Ra('.toob .vis')[i](a => a[d][o](z));
  bb = 0;
  nd = 0; // Disable free ants coming in.
  h(n => {
    c(uc)[d][m](Bb);
    j.before(e);
    h(n => {
      Ra('.ant.free')[i](a => a[o]());
      b.a = [];
      e[d][m](z);
      j[B] += '<div id=mHill><div class=hill></div></div>';
      let w = c('mHill'), p = c(jg)[ji](1), s;
      p.id = Yb;
      for (s of p.children) s.id = Oa + s.id;
      c(jg).after(p);
      a[Yb] = a[v].map(a => ({...a, [Pb]: a[u], [u]: 0, id: Oa + a.id}));
      a[Yb][i](ue);
      p[d][m](z);
      h(b => {
        g[d][m]('smoke');
        pb(ee, .8);
        w[d][m](z);
        a.a[k](a => a[q].n == jb || a[q].n == H)[i](a => {
          a[q].n == jb && f(2) && Ie(ant, antEl);
          a[d][m](Ye);
          h(b => {
            pb(ee, .3);
            a[q].n == jb && f(2) && Ie(ant, antEl);
            bg(a, Gd);
          }, ja + f(ua));
        });
        Ra('#scenery > div')[i](a => {
          a[d][m](Ye);
          h(b => a[d][m](mg), ja + f(ua));
        });
        c(V)[d][m](Ye);
        pb(ee, .6);
        h(b => {
          pb(ee, .3);
          c(V)[d][m](mg);
          a[Yb][k](a => a.t == M)[i](zf);
          Ra('.frame')[i](a => a[d][m](Ye));
        }, ja);
        h(b => {
          p[r].overflow = 'visible';
          e[d][o](z);
          w[d][o](z);
          h(b => {
            pb(ee, .3);
            l.pause();
            e[o]();
            h(b => {
              [hd, v, oc, aa][i](b => a[b] = []);
              a[V] = 0;
              a[oa] = a[t] = a[Za] = ga('#kit #wrapper')[ra][t] = ga('#kit #base')[ra][t] = 'metal';
              Zg();
              xa();
              h(a => p[d][m](mg), 10000);
              h(a => {
                g[d][m]([pg]);
                h(a => g[d][o]('smoke', pg), ua * 2);
                Le();
                Tb(); // Will re-enable switcher.
              }, 20000);
            }, ua);
          }, ua);
        }, ua * 3);
      }, ua);
    }, R);
  }, R);
},

// Draws progress of a tunnel pour.
zf = b => {
  b.pour = 1;
  b[u] += 2;
  ue(b);
  a.a[k](a => a[q].t == b.id)[i](a => {
    a[d][m](Ye);
    pb(ee, .3);
    h(b => bg(a, Gd), ja + f(ua));
  });
  if (b[u] >= b[Pb]) b.co[i](c => {
    let d = eb(a[Yb], Oa + c);
    if (!d.pour) {
      if (!wb(d) && d.x2 == b.x2) ga('#' + d.id + ' .prog')[r].float = Xe;
      zf(d);
    }
  });
  else h(a => zf(b), 3);
},

// A collection of namespaced modal functions which all work in a similar way.
Qi = {

  // Templates the inventory bag popup.
  [L]: f => {
    E[d][m](L);
    f[B] = '<div id=bag-items></div><div id=bag-caption>'
      + (b[L][g] > 9 ? `<div class="sort-caption vis"><h4>Sort</h4><a data-s=0 class=sel-${!b.bs}>Date</a> | <a data-s=1 class="sel-${b.bs === 1}">Auto</a> | <a data-s=2 class="sel-${b.bs>1}">Name</a></div>` : w)
      + '</div>';
    Ra('.sort-caption a')[i](a => a[s](G, a => {b.bs = Va(a[_b][ra][sb]); La(L, 0, 0)}));
    for (let [r, q] of [...b[L].entries()][yb](b.bs > 1 ? (([, a], [, b]) => (l[a.k].n > l[b.k].n ? 1 : l[a.k].n < l[b.k].n ? -1 : 0)) : !b.bs ? a => 0 : ([, a], [, b]) => ma(l)[dc](a.k) - ma(l)[dc](b.k))) {
      let u = 'Use item', v = 0, F, A = q.k, x = l[A], H = x.t, I,
      J = (c, a = c[_b], b = a[ra].i) => {
        if (H == ng) {
          // This one needs a confirm workflow.
          a[fe] = 1;
          a[d][m](Kj);
          a.textContent = '⌛';
          a[qa](G, J);
          h(c => {
            a[B] = '🚮️ <span class=err>Confirm farm dump</span>';
            a.onclick = a => eh(b);
            a[fe] = 0;
          }, ja);
        }
        else eh(b); // Most items just hit up useItem() right away.
      },
      y = b => !a[oa] && (u = 'Ant farm has no fill', v = 1), // Several items need a generic fill check to block them from being put into empty farms.
      C = a => u = 'Insert ' + x.n,
      E = b => a[aa][g] > 9 && (u = 'Putting-stuff-in limit reached', v = 1),
      K = {
        [ac]() {a[oa] ? (u = 'Ant farm already filled', v = 1) : (u = 'Fill ant farm with ' + A)},
        [ng]() {a[oa] ? (u = 'Dump contents of ant farm') : (u = 'Ant farm already empty', v = 1); a[Aa][g] && (u = Lj, v = 1)},
        [ce]() {C(); a[aa][D](a => a.k == A) ? (u = `There is already some ${x.n} in the farm`, v = 1) : E(); y()},
        [og]() {C(); a[aa][D](a => a.t == Ga) ? (u = 'Refill feeder') : E(); y()},
        [qb]() {K[tc]()},
        [tc]() {C(); E(); y()},
        [V]() {C(); y()},
        [sa]() {a.a[g] ? (u = 'Enhat an ant') : (u = 'No ants to enhat', v = 1)},
        [Te]() {u = 'Peel backing paper, align adhesive decal, and smooth onto surface'},
        [ib]() {
          if (x[id]) {
            if (A == rc) {!ye(1) ? (u = 'No free nipple', v = 1) : Wd(a) ? (u = 'Farm already has a vial', v = 1) : u = 'Attach to farm'}
            else {
              let b = [], a = [], c;
              q.a[i](a => !b[Y](a.t) && b[n](a.t));
              b[i](b => ma(Me)[i](d => (c = q.a[k](a => a[Cb] == d && a.t == b)[g]) && a[n](`<span class=num>${c}</span> ${ya[b].n} Ant ${Me[d] + (c === 1 ? w : sb)}`)));
              F = `Your reused ant vial containing:<br>${a[g] > 1 ? a[_d](0, -1)[Ab](', ') + ', and ' + Dc(a) : a[0]}.`;
              u = `Release ${q.a[g]} ant${q.a[g] === 1 ? w : sb}`;
            }
          }
          else u = `Release ${ya[x.ant].n} Ant Queen${x.W ? ` and ${x.W} Workers` : w}`;
          y();
        },
        gift() {u = 'Unbox'},
      },
      M = {
        tg() {u = 'Item deployed'; v = 1},
        [ge]() {M.tg()},
        [bc]() {!b[P][D](b => b[oa] && b.id != a.id && ye(1, b)) && (u = 'No other farm to connect', v = 1); y()},
        [bd]() {u = 'View'},
        antfaxpro() {u = 'View'},
        [Ve]() {!a.a[D](a => Kb(a) && a[da] == Pb) && (u = 'No eligible donor found', v = 1)},
        [We]() {b.ss && (u = 'A second Speedo would tear a hole in space', v = 1)},
        [Ed]() {u = 'Sell ant farm'; a[oa] && (u = 'Farm has not been cleaned out', v = 1); b[P][g] < 2 && (u = 'This is your only farm', v = 1)},
        [cd]() {u = '🏆 WIN GAME 🏆'; if (b.win) (u = 'Game won', v = 1)},
        crucible() {u = 'Pour'; !Ub(a) && (u = 'Farm undeveloped', v = 1); a[Aa][g] && (u = Lj, v = 1)},
      },
      N = M[A] || K[H];
      N && N();
      // Block most items for metal sculpture farms, except ones that circumvent a soft-lock.
      if (a[Yb] && !['box', cd, Qe][Y](q.k)) {
        u = 'Farm annihilated';
        v = 1;
      }
      Wa(c(Mj), `<div id=${q.k}-${r} class="bag-item ${q.k} ${l[q.k].t}" ${q.r ? `style=transform:rotate(${q.r}deg)` : w}>${ve(q)}</div>`);
      Wa(c('bag-caption'),
        `<div id=${q.k}-${r}-caption class=${q.k}-caption><h3>${l[q.k].n}</h3>` +
        `<h4>level ${l[q.k][e]} ${l[q.k].t || Na}${l[q.k].t != ib && q[t] ? ` in ${l[q[t]].n}` : w}</h4><p>${F || l[q.k][j]}</p><button id=b-${r} data-i=${r} ${v && fe}>${u}</button>` +
        (!l[q.k].keep && b[L][D](a => a.k == 'trash') ? `<div class=bag-d><span id=d-${r} data-i=${r} class=d><img src=img/trash.webp></span></div></div>` : w)
      );
      // Create confirmation to dump an item from the inventory.
      if (I = c('d-' + r)) {
        I[s](G, (c, a = c[_b][ad]('.d')) => {
          a[B] = Nj;
          a[d][m](Oj);
          h(c => {
            a[B] = '🚮️ <span class=err>Confirm item dump</span>';
            a[d][m]('expand');
            a[s](G, c => {
              b[L][Dd](a[ra].i, 1);
              xa();
              // Reopen modal or the IDs are fucked.
              La(L, 0, 0);
            });
            a[d][o](Oj);
          }, ja);
        });
      }
      c(`${q.k}-${r}`)[s](G, (a, b = c(a[Hd].id + '-caption')[d], e = b[zb](z)) => {
        Ra('#bag-caption > div')[i](a => a[d][o](z));
        Ra('.bag-item')[i](a => a[d][o]('hover'));
        if (!e) { // Note: 'active' was calculated earlier because at this point the above 2 lines deactivated it.
          a[Hd][d][m]('hover');
          b[m](z);
        }
        else ga('#bag-caption .sort-caption')?.[d][m](z);
      });
      // Add click handler for the "use" button.
      c('b-' + r)[s](G, J);
    }
    // Remember scroll position for usability.
    let p = c(Mj);
    p.scrollLeft = Va(Fg);
    p[s]('scroll', a => {Fg = a[Hd].scrollLeft});
  },

  // Templates the item drop popup.
  [Qb]: (b, a) => {
    b[B] =
      `<div id=drop-top><h3>Congratulations! You've found:</h3><h2>${l[a.k].n}</h2></div><div id=drop-img class="${l[a.k].t} ${a.k}" ${a.r ? `style=transform:rotate(${a.r}deg)` : w}>${ve(a)}</div><div id=drop-caption><h4>level ${l[a.k][e]} ${l[a.k].t || Na}${l[a.k].t != ib && a[t] ? ` in ${l[a[t]].n}` : w}</h4><p>${l[a.k][j]}</p><button onClick=${fb.name}()>${x(Wh)}</button></div>`;
    pb(Qb, .3);
  },

  // Templates the ach popup.
  ach: a => {
    if (b.achQ[0]) {
      let f = b.achQ[0], d = f.l, c = f.a, e = mc[c];
      a[B] =
        `<div id=ach-top><h3>Congratulations! You've achieved:</h3><h2>${e.n}</h2></div><div id=ach-img class="ach-${c} ach-l${d}"><img src="img/${d ? 'medal' + d : 'trophy'}.webp"><span class=ach-ico>${e.ico}</span></div><div id=ach-caption><h4>${b.ach[c].v || ' '} ${e.sub || w}</h4><p>${e[j]}<br> </p><button onClick=${fb.name}()>${x(sj)}</button></div>`;
      pb('ach', .5);
      if (c != cd) {
        // Bonus.
        gb(f.b, 1);
        // Forced drops.
        sd(0);
        sd(0);
        sd(0);
      }
      b.achQ = b.achQ[k](a => a.a != c && a.l !== d);
      xa();
    }
    else fb();
  },

  // Templates the win popup.
  win: a => {
    a[B] =
    `<div id=drop-top><h3>Congratulations! You've found:</h3><h2>Dave Matthews Band</h2></div><iframe width=560 height=315 src=https://www.youtube.com/embed/MNgJBIx-hK8?si=zPAJ6x6f-opQqOjF frameborder=0 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"referrerpolicy=strict-origin-when-cross-origin allowfullscreen></iframe><div id=drop-caption><h4>winning level celebratory merriment</h4><p>This is the highest honor available<br> </p><button>${x(Wh)}</button></div>`;
    ga('#drop-top button')[s](G, a => {
      fb();
      xb("I'd like to thank Penn Jillette for creating that podcast");
    });
    b.dmb = 1;
    xa();
  },

  // Templates the farm rename popup.
  [Za]: (b, d) => {
    b[B] =
    `<div id=plate-form><input id=plate-text type=text maxlength=19 placeholder="<type name here>"><button>Rename ant farm</button></div>`;
    ga('#plate-form button')[s](G, (e, b) => {
      if (b = c('plate-text').value[Ze]()) {
        // Rename the farm.
        a.n = b;
        a[Za] = hg; // Hahaha
        jc(d);
        fb();
        gb(1);
        /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(b) && gb(2); // bonus for using emojis
        Af();
        Tb();
      }
    });
  },

  // Templates the paint popup.
  [Da]: (f, e, c = b[L][e].k, g = l[c], d = {}) => {
    if (a[t] != c) d[Cd] = `<div class="select-img af">${Od(a, 1, 0)}</div><h3>Ant farm</h3>(${l[a[t]].n})`;
    if (a[Za] != c) d[Za] = `<div class="select-img np">${Od(a, 0, 1)}</div><h3>Name plate</h3>(${l[a[Za]].n})`;
    a[aa][k](a => a[t] && a[t] != c)[i](a => d[a.id] = `<div class="select-img ${l[a.k].t}">${ve(a)}</div><h3>${l[a.k].n}</h3>(${l[a[t]].n})`);
    f[B] = ze(e, Da, d, 'Paint with ' + g.n, 'Paint item', `data-col="${c}"`);
  },

  // Templates the hat popup.
  [sa]: (d, e, b = {}) => {
    a.a[i](d => {
      if (za(d) && (d.t == a.t || a[Ob])) {
        let a = c(d.id)[ji](1);
        a.removeAttribute('id');
        b[d.id] = `<div class=select-img><div class=ant-thumb>${a.outerHTML}</div></div><h3>${d.n}</h3>${qh(d)} ${ya[d.t].n} Ant (${ph(d)})`
      }
    });
    d[B] = ze(e, sa, b, 'Choose your ant', 'Enhat');
  },

  // Templates the tube popup.
  [bc]: (d, e, c = {}) => {
    b[P][i](b => {a.id != b.id && ye(1, b) && (c[b.id] = `<div id=f-${b.id} class="select-img af">${Od(b)}</div><h3>${b.n}</h3>${Ae(b)}`)});
    d[B] = ze(e, bc, c, 'Choose a farm', 'Connect farms');
  },

  // Templates the ebay popup.
  [Ed]: (f, h, d = {}, b = [], c, a = 0) => {
    // Paints.
    [[4, 50], [3, 100], [2, ec]][i](d => {
      c = x(ma(l)[k](b => l[b].t == Da && l[b][e] < d[1] && l[b][e]>= a));
      b[n]({k: [c], n: d[0] + `x ${l[c].n} Paint`, x: d[0], d: x(['Brand new', 'Unopened', 'Positive feedback'])});
      a = d[1];
    });
    // Hat.
    c = x(ma(l)[k](a => l[a].t == sa));
    b[n]({k: [c], n: `8x ${l[c].n}`, x: 8, d: 'Condition: slightly used'});
    // Science.
    a =  ['cologne', gi, Ve, We], c = x(a);
    a = a[k](a => a != c); // Remove one.
    b[n]({k: a, n: `Science Lab`, d: a.map(a => l[a].n)[Ab](', ')});
    // Tubes.
    b[n]({k: [bc], n: `2x ${l[bc].n}`, x: 2, d: 'Free shipping!'});
    // Fillers.
    a = pe(ma(l)[k](a => l[a].t == ac && l[a][e] > 40))[_d](0, 2);
    b[n]({k: a, n: `Filler Twin-Pack`, d: a.map(a => l[a].n)[Ab](', ')});
    // Ants.
    a = x(ma(l)[k](a => l[a].t == ib && !l[a][id]));
    b[n]({k: [a], n: l[a].n, d: 'Seller rating: 98.5%'});
    // Nerd boxes.
    b[n]({k: ['box'], n: `3x ${l['box'].n}`, x: 3, d: 'Returns not accepted'});
    pe(b)[_d](0, 4)[i](a => {
      d[(a.x || 1) + '-' + a.k[Ab](',')] = `<div class="select-img ebay-img x-${a.x || a.k[g]}">${ff(a.x || 1)[oa]().map(b => a.k.map(a => ve({k: a}))[Ab](w))[Ab](w)}</div><h3>${a.n}</h3>${a.d || w}`
    });
    f[B] = ze(h, Ed, d, 'eBay offers', x(['Accept offer', 'This is how eBay works', 'Sell the farm']));
  },

  // Templates the fengshui popup.
  feng: (c, e, a = `<h2>Drag the chi and let each farm find its place</h2><div id=feng-list><ul>`) => {
    b[P][i](b => {
      a += `<li class=feng-item draggable=true data-id=${b.id}><div id=f-${b.id} class="select-img af">${Od(b)}</div><h3>${b.n}</h3>${Ae(b)}<i class=g-dots>••<br>••<br>••</i></li>`
    });
    c[B] = a + `</ul><button>Harmonize</button></div>`;
    let g = ga('#feng-list ul'), f = 0;
    g[s]('dragstart', a => {
      let b = a[_b][ad](Pj);
      if (b) {
        f = b;
        b[d][m]($e);
        a.dataTransfer.effectAllowed = 'move';
      }
    });
    g[s]('dragend', a => {
      f && f[d][o]($e);
      f = 0;
    });
    g[s]('dragover', a => {
      a[rg]();
      let b = a[_b][ad](Pj), c = ff.from(g.children);
      if (b && b != f) c[dc](f) < c[dc](b) ? b.after(f) : b.before(f);
    });
    g[s](Qb, a => {
      a[rg]();
      f[d][o]($e);
      f = 0;
    });
    ga('#feng button')[s](G, (c, a = [...Ra('#feng-list li')].map(a => a[ra].id)) => {
      // Feng shuave.
      b[P][yb]((b, c) => a[dc](b.id) - a[dc](c.id));
      Tb();
      fb();
    });
  },

  // Templates the ant rename popup.
  ren: (d, b) => {
    d[B] =
    `<div id=hat-form><input id=hat-text type=text maxlength=19 placeholder="<type name here>"><button>Rename ant</button></div>`;
    ga('#hat-form button')[s](G, (f, d = Vb(a, b.a), e = c('hat-text').value[Ze]()) => {
      xb([`${d.n} is now called ${e}.`], Zb);
      d.n = e;
      d.h = 1; // Hat.
      jc(b.k);
      fb();
      gb(1);
    });
  },

  // Templates antfax popup.
  [bd]: (h, f, d = b[L][f].k != bd, c = ya[b[d ? 'faxp' : 'fax'] || (d ? 'H' : 'N')], a = '<div>', e = 0) => {
    for (; e++ < 6;) a += '<div class=rbind><div class=rhole></div><div class=ringb></div></div>';
    a += `</div><img src="img/antfax${d ? 'pro' : w}.webp"><span class=tm>TM</span><div class=faxtop><h3>The</h3><h2>`;
    for (e = 0; e < 3;) a += `<div id=faxh2-${e++}>${c.n[Ze]()}${c.n[g] > 10 ? w : ' ANT'}</div>`;
    a += `</h2><p class=faxintro>${c.t}</p></div><div class=faxPager>`;
    ma(ya)[i](b => !ya[b].p == !d && (a += `<a class="faxlnk faxlnk-${b}"data-key=${b}>${ya[b].n[Ze]()}${d ? w : ' ANT'}</a>`));
    a += `<a class=faxlnk-cl onClick=${fb.name}(${f})>X</a></div><div class=faxcols><div class=faxl><div class=faxsz><div class=faxbx>`;
    c.s == sb ? (a += "<h4>Small package!</h4><p>You'll need a keen eye to spot these critters, and their babies are tiny little specks!</p>") :
      c.s == Oa ? (a += "<h4>Size: normal</h4><p>Rather unremarkably, these ants are best described as being the size of ants.</p>") :
      (a += "<h4>A huge one</h4><p>These ants barely fit in their own nest.  You'd think they would dig their tunnels wider?</p>");
    a += `</div></div><div class=faxdi><div class=faxbx>`;
    !c.d ? (a += "<h4>Adaptive diet</h4><p>A little from column A, a little from column B.  It pays to not be too fussy!</p>") :
      c.d < 2 ? (a += "<h4>Sweet tooth</h4><p>These ants have quite a taste for sugary foods and baked goods such as pastries and cakes.</p>") :
      (a += "<h4>Meat lover</h4><p>As carnivorous monsters they enjoy cheeseburgers and pepperoni pizza. May become cannibals when opportune!</p>");
    a += `</div></div><div class=faxmd><div class=faxbx>`;
    !c.m || c.m > 75 ? (a += "<h4>Well-mannered</h4><p>These little guys are emotionally resilient with elastic hearts that will quickly learn to love again.</p>") :
      c.m > 50 ? (a += "<h4>Average mood</h4><p>Keeping ants happy is always important for their health and fitness, but these guys aren't too bad.</p>") :
      (a += "<h4>Tough customers</h4><p>A moody type that will never be completely happy.  Be careful because a dropping mood will slow them down and affect their health!</p>");
    a += '</div></div></div><div class=faxr><div class=faxsp><div class=faxbx>';
    c.v > 1.1 ? (a += "<h4>¡Ándale! ¡Ándale!</h4><p>A bunch of speedsters here!  This helps them greatly when it comes time to build and defend nests.</p>") :
      c.v > .7 ? (a += "<h4>At a medium pace</h4><p>Neither fast nor slow, their speed is affected by their mood, health, a queen, or the need to complete an urgent task.</p>") :
      (a += "<h4>Slowpokes!</h4><p>Ants like these are really good value for money because they give you more time to enjoy their fun little antics.</p>");
    a += `</div></div><div class=faxbi><div class=faxbx>`;
    c.b ? (a += "<h4>Ow! Chomp!</h4><p>Delivers a toxic venomous bite that will leave victims with intense pain, swelling, hallucinations, and paralysis… for 5 minutes.</p>") :
      (a += "<h4>All bark</h4><p>Don't worry, it won't bite you, but it is said that sometimes its words can wound you deeply.  That nibble you felt is just affection.</p>");
      a += `</div></div><div class=faxpr><div class=faxbx>`;
    d ? (a += "<h4>VIP club</h4><p>These ants will not come looking for you, and are just a little bit harder to farm.  They must be ordered online from Sweden.</p>") :
      (a += "<h4>Garden variety</h4><p>A very common ant that will seek out online ant farms on the daily.  Abundantly available and they'll give themselves over for free.</p>");
    h[B] = a + '</div></div></div></div></div></div>';
    Ra('.faxlnk')[i](a => a[s](G, a => {b[d ? 'faxp' : 'fax'] = a[_b][ra]['key']; La(bd, f, 0)}));
  },

  // Templates the stats modal.
  [Xb]: (q, r, o = w, f = w, a, n) => {
    // Scores output.
    b[P][i]((a, f, i, e = hc((mb() - a.ts) / 3600), h = hc((mb() - a.ts) / 60) - e * 60,
      c = b => a[v][k](a => a.t == a && a[u] == 100)[g],
      d = b => Uc(a.a[k](c => za(c) && c[Cb] == b && (c.t == a.t || a[Ob]))[g], Me[b]),
      b = a => `<div class=stat><b>${a ? a + ' . . .' : w}</b>`) => {
      if (!a[Yb]) {// Don't show sculptures.
        o += `<div class=F-stats style="outline: 2px dashed ${l[a[t]][t]}"><div class=F-id>#${f + 1}</div><div class=F-n><span style="border-bottom: 2px dashed ${l[a[Za]][t]}">${a.n}</span></div>
        ${b('Colony') + Ae(a)}</div>
        ${b('Running') + Uc(e, 'hour')} ${Uc(h, 'min')}</div>
        ${b('Ant count') + d('W')}, ${d('D')},</div>
        ${b() + d('Q')}, ${Uc(a.a[k](b => !a[Ob] && za(b) && b.t != a.t)[g], 'Foe')}.</div>
        ${b('Deaths')}<em>Hunger</em> <span class=num>${a[Xb][wc][sg]}</span>, <em>Thirst</em> <span class=num>${a[Xb][wc][tg]}</span>,</div>
        ${b()}<em>Fights</em> <span class=num>${a[Xb][wc][Ba]}</span>, <em>Other</em> <span class=num>${a[Xb][wc][Gd]}</span>.</div>
        ${b('Tunnels') + Uc(c(M), 'entrance')}, with</div>
        ${b() + Uc(c(pa), 'chamber')}, and</div>
        ${b() + Uc(c(p), 'connection')}. (<span class=num>${a[v][k](a => a[u] > 0 && a[u] < 100)[g]}</span> WIP)</div></div>`;
      }
    });
    // Awards output.
    for (a in mc) {
      n = mc[a].lvls ? b.ach[a] && b.ach[a].l : b.ach[a] || 0;
      if (n || b[U] >= mc[a][e]) {
        f += `<div class="ach ach-${a} ach-lvl-${n}"><span class=icon>${mc[a].ico}</span><div class=caption><h3>${mc[a].n}</h3><p>${mc[a][j]}</p></div>`;
        if (mc[a].lvls) {
          f += `<div class=lvl-wrap><div class=levels>`;
          [3, 6, 9][i](c => {f += `<span class="medal${3 * b.ach[a].l>= c ? ' got' : w}"><span class=l-${c}>${c}</span></span>`});
          f += `</div><p class=sub>Progress: ${b.ach[a].v || 0} ${mc[a].sub}</p></div>`;
        }
        f += `</div>`;
      }
    }
    // Main structure.
    q[B] =
    `<div id=scores-scroll><div id=scores-wrapper><h2><span>Official Score Card</span></h2><div id=scoreHead>Total score: ${b[U]} (inc. bonuses)<span class=date>${new Date().toLocaleDateString('en-US', {weekday: 'long', year: Qj, month: 'long', day: Qj})}</span></div><div id=scores class=stats>${o}</div></div></div><div id=awards-wrapper><h2><span>・✦ = Feathers in your hat = ✦・</span></h2><div id=awards class=stats>${f || '<p class=no-ach>It looks like you have achieved very little.</p>'}</div></div><div id=share class=stats><h3>Share to social media
      <svg height=20 viewBox="0 0 24 24"width=20><path fill=#fff d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg></h3><img src=img/social.webp height=32><p>It's easy, just take a photo of your screen and use your phone's in-built sharing options.</p></div><div id=resetButton><button>↩️ Restart game</button></div><div id=volume>🔊<input type=range min=1 max=100 value=${b.vol} id=vol></div><div id=credit><span>v1.0.0</span><a target=_blank href=https://github.com/antfarmsocial/AntFarmSocial>Github ↗️</a></div>`;
    // Note: Do NOT modify the 'credit' div wording without changing the Gulpfile too.
    c('vol')[s](G, a => {b.vol = c('vol').value; c('audio')[he] = b.vol / 100});
    c("resetButton")[s](G, (b, a = b[_b]) => {
      // Restarts app.
      a[B] = Nj;
      a[d][m](Kj);
      a[fe] = 1;
      h(b => {
        a[B] = '🛑 <span class=err>Confirm game restart</span>';
        a.onclick = Q;
        a[fe] = 0;
      }, ja);
    });
  },

},

// Templates a select form popup.
ze = (c, a, b, d, e, f = w) => `<h2>${d}</h2><div id=${a}-form class=select-form><form ${f}>${!ma(b)[g] ? '<div class=no-opts>No options available</div>' : Mg(b).map(([b, c]) => `<label><input type=radio name=${a} value=${b}>${c}</label>`)[Ab](w)}</form><button ${ma(b)[g] ? w : fe} onClick="${Ri.name}(${c}, '${a}')">${e}</button></div>`,

// Closes (x) a select form popup and executes whatever code is needed for submitting that particular select form... :/  yeah...
Ri = (g, o, e = ga(`input[name=${o}]:checked`)?.value, f = b[L][g].k, j) => {
  // Get value.
  if (e) {
    if (o == Da) {
      if (e == Cd) a[t] = f;
      else if (e == Za) a[Za] = f;
      else {
        eb(a[aa], e)[t] = f;
        c(qb)[B] = w;
        _g();
      }
      Af();
      Tb();
      Ta(l[f][Z]);
      b.arty++;
      jc(g);
      fb();
      gb(1);
    }
    else if (o == sa) {La('ren', {k: g, a: e}, 0)}
    else if (o == bc) {
      fb();
      h(i => {
        xf((k, l = Nb[k], i = c('t-' + l)) => {
          j = a.id, f = 't' + Ja();
          a[Aa][n]({[K]: k, id: f, f: e, [Na]: ca(b[L][g], {a: []})});
          i[ra].id = e;
          i[d][m](z);
          h(a => i[d][m](sc), Ac);
          h(i => {
            Sc(e);
            h(e => {
              xf((i, k = Nb[i], e = c('t-' + k), l = {[K]: i, id: f, f: j, [Na]: ca(b[L][g], {a: [], e: []})}) => {
                a[Aa][n](l);
                e[ra].id = j;
                e[d][m](z);
                h(a => e[d][m](sc) || c(Bd + k)[d][m](sc), Ac);
                e[s](G, a => wf(l, e));
                ah();
                jc(g);
              });
            }, Ig);
          }, ua);
        });
      }, R);
    }
    else if (o == Ed) {
      j = a.id;
      Sc(b[P][X](a => j != a.id).id);
      h((a = e.split('-')) => {
        b[P] = b[P][k](a => j != a.id);
        Tb();
        if (a[0] > 1) for (let b = 0; b < a[0]; b++) td(a[1]);
        else a[1].split(',')[i](a => td(a));
        Ta([['A++++ fantastic seller.'], ['Thank you for an easy pleasant transaction.'], ['Fast shipping, good communication. Highly recommended!']]);
      }, ja);
      fb();
    }
  }
},

// Opens the modal dialog.
La = (a, e = 0, b = R) => h(f => {
  !b && c(_e) && fb(); // If caller sets delay to 0, it implies they want to close/override any existing popup.  That's just how it is.
  if (E[d][zb](ug) || c(dd)[d][zb](z) ||(c(_e) && c(_e)[d][zb](z)))
    // Can't show modal yet.
    h(c => La(a, e, b), ua);
  else {
    Wa(c('afs'),
      `<div id=modal class=modal><div id=modal-close onClick=${fb.name}()></div><div id=modal-content><div id=${a}></div></div></div>`);
    Qi[a](c(a), e);
    c(_e)?.[d][m](z);
  }
}, b),

// Closes (x) a modal dialog popup.
fb = a => {
  c(_e)?.[o]();
  gh(); // In case a modal changed which buttons should be shown.
  E[d][o](L);
},

// Shows the menu buttons when necessary.  Also handles the dirt bucket drop, but just go with it.
gh = a => {
  // Everyone gets a dirt bucket at first (or show the bag button right away).
  b[L][g] ? c(Yh)[d][m](z) : h(a => !b[L][g] && td('dirt'), W);
  // Handle glass and carousel.
  b[L][D](a => a.k == 'tg') && c(Zh)[d][m](z);
  b[L][D](a => a.k == ge) && c($h)[d][m](z);
},

// Removes a bag item by index.
jc = a => b[L][Dd](a, 1) && xa(),

// Updates the color and name of the current ant farm frame.
Af = (b = c('n'), d = c('base'), e = c(Rj)) => {
  b.textContent = a.n;
  d[ra][t] = b[ra][t] = a[Za];
  d[ra].fx = b[ra].fx = l[a[Za]].fx;
  e[ra][t] = a[t];
  e[ra].fx = l[a[t]].fx;
},

// Chooses a random id for an ant, ensuring uniqueness.
hh = (e, g, c = 9999, d = 0, a) => {
  do {
    if (d++ > 5) {c *= 10; d = 0}
    a = e + g + '-' + (f(c - ja) + ja);
  } while (b[P][D](b => b.a[D](b => b.id == a)));
  return a;
},

// Works out the most common ant type in a farm.
Si = (b, a = {}, c = b.a[i](b => {za(b) && (a[b.t] = (a[b.t] || 0) + 1)})) => !ma(a)[g] ? w : Mg(a)[yb]((a, b) => b[1] - a[1])[0][0],

// Checks an ant is not 'dead'.  Also can't be 'free' or 'nip' etc... must be 'cap' which suggests it is in a farm somewhere.
za = a => a[da] == Pb,

// Checks if a farm is running (has ants living in it).
Bf = a => a.a[D](za),

// Checks if a farm is developing (has at least 2 completed cavity chambers).
Ub = a => a[v][k](a => a.t == pa && a[u] == 100)[g] > 1,

// Checks if an ant is a queen.
Xa = a => a[Cb] == 'Q',

// Checks if an ant is a drone.
Tc = a => a[Cb] == 'D',

// Checks if an ant is a worker.
Kb = a => a[Cb] == 'W',

// Prints a numeric count of terms with basic pluralisation.
Uc = (a, b) => `<span class=num>${a || 0}</span> ${b}` + (a === 1 ? w : sb),

// Gets the text description of a farm colony.
Ae = a => `${a[Ob] ? 'Multispecie' : a.t ? ya[a.t].n + (ya[a.t].n[g] > 10 ? w : ' ant') : 'No ant'}s in ${a[oa] || 'the air'}`,

// Spawns a "free" ant that roams the screen.
Cf = (l = 1, i = f(4), c, d, e, j = Gb[li], k = Gb[Re]) => {
  if (nd) {
    if (a[oa] && (ta.hasFocus() || b.a[g] < 3)) {// check focus & ant length to prevent flooding when user in another tab.
      i> 2 ? (c = f(k), d = j + 25, e = 0) : // Bottom edge
      i > 1 ? (c = k + 25, d = f(j), e = Ld) : // Right edge
      !i ? (c = -25, d = f(j), e = 90) : // Left edge
        (c = f(k), d = -25, e = S) // Top edge
      // Create ant and screenWalk it.
      Lf(ca(Df(b, c, d, e), {run: 1.2})); // Free ants move faster.
    }
    // Spawn fewer ants the more you have.  Make it a bit random.
    h(a => l && Cf(), a.a[g] * W + f(la));
  }
},

// Creates an ant, stores it in data, and attaches a DOM representation of it.
Df = (g = a, h, i, j, l = Zd, c = !f(a[oa] == Se ? 12 : 24) ? 'Q' : 'W', d = x(ma(ya)[k](a => !ya[a].p)), e = hh(d, c), b = {
  id: e,
  n: e, // Name
  t: d,
  x: h,
  y: i,
  r: j, // Rotate
  [da]: l,
  [Cb]: c,
  [y]: 1,
  [I]: Pa,
  [Ue]: c == 'Q',
  fd: 80 + f(20), // Food Satisfaction
  dr: 80 + f(20), // Drink Satisfaction
  hp: 80 + f(20), // Health Points
  md: (ya[d].m || 100) - f(20), // Mood
  [q]: {n: 0, d: 0, t: 0},
  q: [], // Action Queue,
  thot: x(["I feel like I'm being watched", "Somebody is watching me!"]),
  thotD: 8,
  rm: [], // Body part removal
}) => g.a[n](b) && (b[da] == Zd ? Ui : Wc)(b) || b,

// Clones a capped ant.
Ti = (e, b = a.a[X](a => Kb(a) && a[da] == Pb), f = c('fx')) => {
  bb = 0;
  pb('zap');
  f[d][m](Sj);
  for (let c = 0; c < e;) h((d = hh(b.t, b[Cb]), e = 435 + c * 40) =>
    Wc(a.a[a.a[n](ca(pd(b), {
      id: d,
      x: e, y: Lb({t: b.t, x: e}),
      q: [{[C]: ie}],
      r: 90,
      thot: x(["Who am I?", "What just happened?", "Is that me?", "I am reborn!"]),
    })) - 1]) || O(Vb(a, d)),
    c++ * R + R
  );
  h(a => {f[d][o](Sj); bb = 1; xa()}, e * R + R);
  Ta(l[Ve][Z]);
},

// Gets the ant's size, adjusted for infancy and caste.
// Goal IIRC: Return ant's size as configured, except Queen's are 2 sizes larger (if possible), Drones are one size larger,
// Infant at larvae stage are small unless the ant type's default is small then they're "baby" size, and infant larval drones are one size larger than the infants.
Vc = (a, b = ya[a.t].s, c = ['b', sb, Oa, 'l', 'x'], d = c[dc](b)) =>
  a[Ea] === 1 ? (b == sb ? 'b' : sb) : c[ba(d + (Tc(a) ? 1 : Xa(a) ? (a.t == 'T' ? 1 : 2) : 0), 4)],

// Draws a free ant.
Ui = a => {
  Wc(a, c(zd));
  // Add picking.
  let b = Fc(a);
  [ed, vc][i](a => b[s](a, Ef));
  [Tj, vc][i](a => b[s](a, lh));
},

// Draws an existing ant into the currently displayed farm, or another container.
// Note: This function cannot protect against ant being drawn into wrong farm or non-existent container as this func is used for various purposes, calling code is responsible.
Wc = (a, b = c(Cd)) => T(a, b[Ad](ca(qe(Ej), {id: a.id}))),

// Gets DOM element from the cache or from query (and store in cache if its part of the current farm).
Fc = (b, d = Kd[b.id]) => d?.[vg] && d || b.f == a.id && (Kd[b.id] = c(b.id)) || c(b.id),

// Updates the antEl's classes.
ih = (a, b = Fc(a)) => b && (b[ki] = [
    'ant', a[Cb], a.t, a[da], a[I], Vc(a), a[Ea] && Ea + a[Ea], // String values.
    ...[fa, 'jit', $, 'wig', 'h', 'fall', Ba, 'mag', Ue, Oe][k](b => a[b]), // Boolean values.
    ...a.rm // Body part removal.
  ][Ab](Hc)),

// Handles the event where an ant is being picked up.
Ef = (e, b = e[Hd], a = Ce(b)) => {
  e[rg]();
  if (b[d][zb](Kc)) b[mi](Ff);
  else {
    // Handle wing leafing.
    if (a[Ue]) {
      let d = Va(b[r][ea]), f = Va(b[r][H]);
      ['wing-l', 'wing-r'][i](e => {
        Wa(c(zd), `<div id="${a.id + e}"style=transform:rotate(${a.r}deg);left:${d}px;top:${f}px;width:${b.clientWidth}px;height:${b.clientHeight}px; class="leaf alate ${Vc(a)}"><div style="transform:${getComputedStyle(ga(`#${a.id} .body`))[de]}"class=body><div class=wings><div class="wing ${e}"></div></div></div></div>`);
        let g = c(a.id + e), h = va(e != 'wing-l'), i = d, k = a.r, j = f, l = Ha(a => {
          if (N(d - i) < 99) g[r][ea] = (i += h) + Fa;
          g[r][de] = `rotate(${k += h}deg)`;
          g[r][H] = (j += .7) + Fa;
          j> Gb[li] + 99 && (g[o]() || ha(l));
        }, Ia);
      });
    }
    Ca(a, Ue);
    // Update ant.
    ca(Ce(e[Hd]), {[I]: Kc, [fa]: 0, [y]: va(f(1)), r: f(30) - 10});
    T(a);
    // Handle ant biting.
    h(b => Vi(a), ec);
    // Add drag and drop.
    [Lc, fd][i](a => ta[s](a, jh, {[Fd]: 0}));
    [af, gd, G][i](a => ta[s](a, kh));
    E[d][m](ug);
  }
},

// Forces the loss of an ant being picked up.
Ff = new MouseEvent(af, {bubbles: 1, cancelable: 1}),

// Handles each step of the dragging of an ant.
jh = (b, a = Ah(b)) => {
  b[rg]();
  if (!a || !a[d][zb](Kc) || !f(ua)) ga('.pick')?.[mi](Ff);
  else {
    let c = b.type == Lc ? b : b[cc][0], d = a[hb](),
      f = d[ea] + d[nc] / 2, g = d[H] + d[yd] / 2,
      h = c[_a] - f, i = c[rb] - g, e = Rc(h, i), j = ba(e, 9);
    (N(Va(a[r][ea]) - c[_a]) > 25 || N(Va(a[r][H]) - c[rb]) > 25) && a[mi](Ff);
    a[r][ea] = f + (h / e) * j + Fa;
    a[r][H] = g + (i / e) * j + Fa;
  }
},

// Handles the event of dropping an ant that was picked up.
kh = (g, e = Ah(g), a = Ce(e), f = c('dropzone')[hb]()) => {
  if (a && g[_b][ad]('.pick')) {
    E[d][o](ug);
    [Lc, fd][i](a => ta[qa](a, jh)),
    [af, gd, G][i](a => ta[qa](a, kh)),
    a.x = Va(e[r][ea]);
    a.y = Va(e[r][H]);
    !b.bit && a.x >= f[ea] && a.x <= f[Xe] && a.y <= f[Jc] ? Gf(a, b) : mh(a); // Drop in farm or run away.
  }
},

// Moves an ant into the farm via a falling animation.
// Note: Any functions calling this should probably book-end their process with switcher=0/switcher=1.
Gf = (b, e, d = c(Cd)[hb]()) => {
  b.x -= d[ea];
  b.y -= d[H];
  De(a, hd, b, e, a, {f: a.id, fall: 1});
  yh(b, Lb(b));
},

// Handles the mouseover event for spotting ants.
lh = (a, b = Ce(a[Hd])) => {
  [Tj, vc][i](b => a[Hd][qa](b, lh));
  Ta([[`You've spotted a wild ${ya[b.t].n + ' Ant' + (Xa(b) ? ' QUEEN!!' : w)}!`]]);
},

// Makes ant run away when dropped.
mh = a => !a.fall && Lf(ca(a, {[I]: Pa, r: f(fc), [y]: 1, run: 2})),

// Decides whether to do an ant bite and then does it.
// Note: The force param is for dev.js, infact that's why this code exists as its own function.
Vi = (a, c) => {
  if (c || (b[U] > 9 && ya[a.t].b && !f(20))) {
    b.bit = 1;
    Ta(vj);
    nh();
    // Ensure ant runs away.
    a && mh(a);
    pb('bite');
    E[d][o](ug);
  }
},

// Activates the ant bit throbber effect.
nh = a => {
  if (b.bit) {
    // Add redThrobber immediately.
    E[d][m]('bit');
    c(wg)[d][m](z);
    // After 5s add bite effect for 5m
    // The timers are global and cancellable in-case they take medicine.
    // Reloading will restart the 5 minute counter as punishment.
    h(a => {
      E[d][m](wg);
      ha(hf);
      hf = Ha(Hf, cb);
    }, W);
  }
  xa();
},

// Removes the ant bite and throbber.
Hf = a => {
  ha(hf);
  c(wg)[d][o](z);
  E[d][o](wg, 'bit');
  b.bit = 0;
},

// Supports the functionality for enabling superspeed.
oh = a => {
  ha(le);
  ha(jf);
  if (b.ss) {
    Ia = 5;
    od = 50,
    Hb = ec,
    W = ja;
    la = W * 6; // 6 seconds
    cb = la * 10; // 1 minute
    jf = Ha(dg, cb);
    pb('speed', .7);
    c(je)[d][m](z);
    c(zd)[d][m](je);
    h(a => c(zd)[d][o](je), la / 2);
    ha(le);
    le = Ha(Wi, la);
    // Also try clearing any existing bite sooner.
    b.bit && h(Hf, cb / 2);
    xa();
  }
},

// Supports the functionality for disabling superspeed.
Wi = a => {
  if (Date.now() > b.ss) {
    pb('fizzle', .7);
    Ia = 20;
    od = R,
    Hb = ua,
    W = 5000;
    la = W * 6; // 30 seconds
    cb = la * 10; // 5 minutes
    ha(le);
    ha(jf);
    b.ss = 0;
    xa();
    h(a => {
      c(zd)[d][m](je);
      h(a => c(zd)[d][o](je), W/2);
      c(je)[d][o](z);
    }, ja);
  }
},

// Increments score.
// Can be used to decrement score (inc=-1) or enable score display (inc=0), and to set bonuses (which don't trigger drops).
gb = (e, g = 0, i = b.win ? '<span class=win>🏆</span> ' : w, a = c(U), f = c('bonus')) => {
  b[U] += Va(e);
  if (e) {
    if (g) {
      // Bonus handling.
      a[d][m]('bon');
      h(a => {
        Wa(f, `<div style=font-size:1.4em;>+${e}</div>bonus`);
        f[d][m](z);
      }, Ac);
      h(c => {
        a[B] = `<span>${i}${b[U]}</span>`;
        a[d][o]('bon');
        h(a =>{f[d][o](z); f[B] = w}, 2610);
      }, Ac * 3);
    }
    else b[U] === 1 ? Ta(xj) : b[U] == 2 ? Ta(yj) : sd(Bc());
    e > 1 && sd(0); // Force a drop when they scored more than 1 point at once.
    xa();
  }
  if (!e || !g) a[B] = `<span>${i}${b[U]}</span>`;
  a[ra].neg = b[U] < 0;
  a[d][m](z);
},

// Drops an item either according to the random value passed in (0=guaranteed) or when some conditions are met.
sd = (d, a, c = b[U]> 149 ? .3 : b[U] > 9 ? .4 : .5) => {
  if (d < c) {
    // Random drops.
    let f = ma(l)[k](a =>
      l[a][e] < (b[P][g] < 2 ? 50 : b[P][g] < 3 ? 100 : b[U]) && !l[a][id] && (!l[a].max || b[L][k](b => b.k == a)[g] < l[a].max));
    if (f[g]> 0) {
      a = x(f);
      if (b[L][D](b => b.k == a)) a = x(f); // 2nd chance.
    }
  }
  else if (b[U] % 9 < 1 || b[U] == 5) {
    // Forced item drops: you get one of the lowest level items that you're
    // missing on every 9th point, and one extra one early in the game.
    // But you don't get it if your random drops gave you everything already.
    a = ma(l)
      [k](a => !b[L][D](b => b.k == a) && l[a][e] <= b[U] && !l[a][id])
      [pc]((a, b) => (!a || l[b][e] < l[a][e] ? b : a), null);
  }
  else if (Bc() < c) {
    let e = Dc(b[P][k](Bf));
    h(a => Ta(Aj[e < 4 ? e : e == 4 ? 1 : 0]), ja);
  }
  a && td(a);
},

// Provides the caste label text for an ant.
ph = a => Me[a[Cb]],

// Provides the caste icon emoji for an ant.
qh = a => Kb(a) ? '🛠️' : Tc(a) ? '♂️' : '👑',

// Provides ant's thoughts, though thot can be set at opportune times elsewhere.
rh = (b, c = J(b), e = Xc(b), d = f(3), h, i = [
    // Thots are ordered from high priority to low priority, only the first valid one is used.  "rand" is used to avoid some thoughts ALWAYS blocking others.
    a => b[Ea] && ["😘🎮", "✏❓🎨", "🌵📥🍗🍖", "💥👍💥", "🔥🔥👅", "👀👑🌍", "👃💩", "🎨🎾", "🔵🌊", "💪🎀", "👄👄", "💪⚡🐭", "🐛🔜"],
    a => !f(9) && ["Need. More. Crumbs.", "Who moved my dirt?!", "Don't step on me!", "Lost. Again.", "Why is dirt so heavy?", "Ant gym = life", "Who farted in the nest?", "I should be queen", "I licked it, it's mine",
      "My back hurts", "Big foot incoming!", "Too many legs, not enough rest", "Keep calm, carry sugar", "I miss leaf duty", "Where's my antenna charger?", "Smells like danger", "Who named us “ants”?",
      "Why so crumb-y today?", "Dirt in my mandibles", "Smells like home", "Antflix and chill?", "The floor is crumb!", "Dig. Eat. Repeat.", "Antsplain it to me", "Worker of the month (me).", "Mondays… again",
      "What's my purpose?", "I saw a spider!", "Ant-nxiety rising", "Look at me!", "Don't look at me!"],
    a => e[0] == Mc && ["Zzzzzz…", "I'm sleeping", "Having a nap"],
    a => b.hp < 20 && [b.hp < 5 ? "I'm dying" : b.hp < 10 ? "I feel sick" : "I need a break"],
    a => b.md < 20 && ["I ain't happy", "I'm having a mood", "I am so annoyed"],
    a => b.t != c.t && !c[Ob] && ["Oops, wrong colony", "I'm so screwed", "I shouldn't be here"],
    a => !d && !Yd(c) && ["We could really use a Queen", "I wish there was a Queen", "There should be a Queen!"],
    a => !d && Kb(b) && Yd(c) && ["Queen's watching… act busy", "Just following orders", "I hear the queen gossiping"],
    a => !d && Xa(b) && ["Who ate my larvae?!", "Carrying? I'm supervising", "It's good to be queen"],
    a => !d && c.a[g] > 12 && ["Tunnel traffic again", "Our colony is pretty big", "I have so many friends"],
    a => e[Y]($) && ['Off to work…', 'Busy, busy!', 'Got to dig', 'Is this tunnel crooked?', "I'm basically a builder"],
    a => e[0] == jd &&
      (b.md < 50 && !Ke(c) ? ["Not much to see up here", "The scenery is bland", "Could use some scenery"] : // Negative bg scenery feedback.
      Ke(c)> 1 && d ? ["Enjoying the scenery", "Nice stuff up here"] : // Positive bg scenery feedback.
        ["I don't mind the view", "What's up here?"]), // Generic crawl thoughts
    a => e[0] == xc &&
      (Ub(c) && d ? ["Exploring the surface", "Checking out the area", "Doing a security sweep"] : // Young farm pace thoughts.
        ["Scoping out the farm", "Surveying the ground", "Hey! I'm walking here"]), // Generic pace thoughts
    b => [ia, xg, yg][Y](e[0]) &&
      (a.dun ? ["This nest is sweet", "I love my home", "Our colony is great", "Why so many tunnels?"] : // Farm development completed dive thoughts.
      Ub(c) && d ? ["Exploring tunnels", "Mapping the nest", "Learning the tunnels"] : // Young farm dive thoughts.
        ["Planning chambers", "Assessing dig sites"]), // Incomplete farm dive thoughts
    a => ["Hmm, what to do?", "What shall I do?"], // Last resort for a thot.
  ]) => (b.thotD = 0) || x(i[X](a => (h = a())) && h),

// Gets a unique list of acts that are in an ant's queue.
Xc = a => [...new Set(a.q.map(a => a[C]))],

// Finds an ant to magnify.
If = (b, f = 28, e = c('lg')[hb](), g = (e.x + e[Xe]) / 2, h = (e.y + e[Jc]) / 2) => {
  a.a[k](za)[i](a => {
    let c = Fc(a);
    if (c) {
      let d = c[hb](),
        e = wa(d.x + d[nc] / 2, d.y + d[yd] / 2, g, h);
      if (e < f) {
        f = e;
        b = a;
      }
    }
  });
  a.a[i](a => a != b && (a.mag = a[Oe] = 0, T(a)));
  c(zg)[d][o](z);
  if (b) {
    b.mag ||= 1;
    T(b);
    c('l-head')[B] = b.n;
    ga('#l-t .txt')[B] = ya[b.t].n + ' ant';
    ga('#l-c .txt')[B] = ph(b);
    ga('#l-c .emo')[B] = qh(b);
    let a = (a, b = hc((mb() - a) / 3600), c = hc((mb() - a) / 60) - (b * 60)) => `<span class=num>${b}</span> h <span class=num>${c}</span> m`;
    ga('#l-d .txt')[B] = a(b.ts);
    ga('#l-a .txt')[B] = b.hp ? `"<em>${b.thot}</em>"` : a(b[wc]);
    ['rot', 'decay', 'fd', 'dr', 'md', 'hp'][i](a => {
      let e = ga(`#l-${a} .bar`);
      e[r][nc] = `${b[a] / 2}px`;
      e[d].toggle('hi', b[a] > 50);
      e[d].toggle('lo', b[a] < 20);
      c(`l-${a}`).setAttribute('title', `${a[Ze]()}: ${Va(b[a])}%`);
    });
    ga('#l-md .emo')[B] = !b.hp ? '💀' : b.md> 50 ? '😃' : b.md > 20 ? '😐' : b.md > 10 ? '☹️' : '😡';
    ga('#l-hp .emo')[B] = b.hp ? '♥️' : '💔';
    ga('#l-a .emo')[B] = b.hp ? '💡' : '☠️';
    c(zg)[ra][da] = b[da];
    c(zg)[d][m](z);
    Qc ||= Ha(a => {
      if (++b.mag > 20) {
        b[Oe] = 1;
        T(b);
        if (b.hp-- <= 0) Qc = ha(Qc);
      }
    }, ja);
  }
  else Qc = ha(Qc);
},

// Handles dragging the magnifying glass around the farm.
sh = (a, b = c(Rj)[hb]()) => {
  c('l-wrap')[r][de] =
    `translate(${Ib((a[_a] || a[cc]?.[0][_a]) - 55 - b.x, -8, b[nc] - 85)}px, ${Ib((a[rb] || a[cc]?.[0][rb]) - 90 - b.y, -33, b[yd] - 68)}px)`;
  If();
},

// Adds dragging functionality to the magnifying glass.
th = a => [Lc, fd][i](a => ta[s](a, sh)),

// Removes dragging from the magnifying glass.
uh = a => [Lc, fd][i](a => ta[qa](a, sh)),

// Toggles the display of the magnifying glass.
Xi = (e, b = c('l-wrap')) => {
  if (E[d][zb]($d)) {
    E[d][o]($d);
    [ed, vc][i](a => b[qa](a, th)),
    [af, gd][i](a => ta[qa](a, uh)),
    ha(Dg);
    // Remove magnification when turning off.
    a.a[i](a => {a.mag = a[Oe] = 0; T(a); Qc = ha(Qc)});
    c(zg)[d][o](z);
  }
  else {
    E[d][m]($d);
    [ed, vc][i](a => b[s](a, th)),
    [af, gd][i](a => ta[s](a, uh)),
    Dg = Ha(If, 40);
    If(); // Immediately magnify the ant when turning on
  }
},

// Toggles the carousel functionality.
Jf = (e, a = c(dd)) => {
  if (E[d][zb](ge)) {
    // Turn off carousel.
    a[qa](G, Jf);
    a[d][o](z);
    ha(Eg);
    E[d][o](ge);
  }
  else if (b[P][g] > 1) {
    if (bb) {
      // Turn on carousel.
      a[d][m](z);
      a[s](G, Jf);
      Eg = Ha(vh, la);
      E[d][m](ge);
      vh(); // Switch immediately for confirmation.
      ck.userAgent[dc]('Mac') > -1 && xb("Press Shift-CMD-F for full screen.", Zb);
      ck.userAgent[dc]('Win') > -1 && xb("Press F11 for full screen.", Zb);
    }
    else Kf(c($h));
  }
},

// Executes one carousel rotation.
vh = a => Sc(b[P][(b[P][ig](Sb) + 1) % b[P][g]].id),

// Adds deny class to an element for a short time.
Kf = a => {
  a[d][m]('deny');
  h(b => a[d][o]('deny'), W);
},

// Drops an item.
td = (a, c = l[a].t) => {
  a = {k: a}; // At this point the item becomes an object because it can take on other attributes.
  // Choose arbitrary colour - get a list of paints, but randomly cap the list at some level so low level paints are more common.
  [qb, tc][Y](c) && (a[t] = x(ma(l)[k](a => l[a].t == Da && l[a][e] < f(70) + 21)));
  c == Te && (a.r = f(40) - 20);
  b[L][n](a) && La(Qb, a);
},

// Walks a free ant around the screen, and mainly checks if the ant has walked past the edge.
Lf = (a, b = 0) =>
  a.x < -40 || a.x> Gb[Re] + 40 || a.y < -40 || a.y> Gb[li] + 40 ? Rd(a) :
    T(a) || h(b => nd && a[I] != Kc && xh(a, Lf), b),

// Determines if an ant is both captive and passive.
wh = a => za(a) && J(a)[Ob],

// Determines if ants should not avoid each other (used when walking in prone pose).
Mf = (a, b, c = 0) =>
  a[_] && a[_].Q == b.id || // Check if this is an ant serving a queen situation.
  !c && Mf(b, a, 1), // Check with roles-reversed.

// Handles random direction prone walking, with collision handling for both modes this is used in.
xh = (a, d, e = 0, g = 1, h = 1, c = Bc(), b = Gh(a)) => {
  a[fa] = 1;
  if (b) {
    let k = b.ant;
    if (a[da] == k[da] && a[q].n == k[q].n && !Mf(a, k)) {
      if (a[da] == Zd || k.t == a.t || wh(a)) {
        // Avoid this ant.
        let m = Rb(k.x, k.y, a.x, a.y), l = a[q].n == jb && Nf(a, 1);
        // Extra checks here avoid adjusting the ant into the boundary.
        if (!l) a.r = ka(a.r - b.dir * f(20));
        if (!l || m.x > 0 && l[0] != 90 || m.x < 0 && l[0] != Ld) a.x += m.x;
        if (!l || m.y> 0 && !l[0] || m.y < 0 && l[0] != S) a.y += m.y;
      }
      else Of(a, k); // Fight!
    }
  }
  else if (c < .2 && !a.redir) a.r = ka(a.r + x([-2, -1, 1, 2]) * h); // Randomly select an angle for direction change.
  let i = ub(a.r - 90), j = Fe(a) * g
  a.x += db(i) * j;
  a.y += lb(i) * j;
  d(a, e && c < .001 ? (a[fa] = 0, Ia + f(Hb)) : Ia); //@todo apply this pausing technique to pace and tunWalk too?
},

// Tests if ant is about to cross a boundary in the bg area and reports which boundary (0 - top, 90 - right, 180 - bottom, 270 - left).
Nf = (a, d = 0, c = Eh(a), b = Sa(a) * 2) =>
  [[0, c < -185], [90, a.x> 960 - b], [S, c > -b], [Ld, a.x < b]][X](b => b[1] && (d || (N(Ka(a.r - b[0])) < 90))),

// Moves ant to the middle of #F.
yh = (a, b, c = Fc(a), d = 1.2) => {
  a.y < b && (a.y += 1);
  a.x += a.x < 450 ? d : a.x> 490 ? -d : 0;
  if (rf(a.r) < 90) a.r += 1.2;
  T(a, c);
  a.y < b && h(e => yh(a, b, c, Qa(0, d - .02)), Ia / 2) || zh(a, c);
},

// Captures an ant into the farm.
zh = (a, b) => {
  b[qa](ed, Ef);
  b[qa](vc, Ef)
  if (a[da] != Pb) J(a)[Xb][Pb]++;
  a[da] = Pb;
  a.ts = mb();
  Je(J(a));
  gb(Xa(a) ? 3 : 1);
  a.thot = x(["Don't touch me!", "Am I kidnapped?", "WTF is going on?", "I'm confused!"]);
  Be(a);
},

// Sets up a fight between two ants.
Of = (b, a) => !b[_] && !a[_] && Vf(b, {[C]: Ba, ant: a.id}) && a[da] != Ba && Vf(a, {[C]: Ba, ant: b.id}),

// Handles the rotation display of an ant.
Yi = (a, b) => b[r][de] = `scaleX(${a[y]}) rotate(${a.r}deg)`,

// Resets an ant to sit properly on the surface level and executes the next item in the queue.
// Note: For newly captured ants this is how the ant's queue is "activated".
// Note: This calls antNext() and should be considered an alternative to calling antNext() in some situations.
Be = (a, b = va(a.r < S), c = ka(a.r)) => {
  Yc(a, H);
  A(ca(a, {r: 90, y: Lb(a), [y]: b, [I]: Db, fall: 0, [fa]: 0, run: 0}));
},

// Gets the ant element that was the target of an event attached to the document (whereas events on the antEl use e.currentTarget instead).
Ah = a => a[_b][ad]('.ant'),

// Gets a free ant object given the ant element or some object with an id.
Ce = a => eb(b.a, a?.id),

// Gets an object by ID.
Vb = (a, b) => eb(a.a, b),

// Searches farms to find a farm ant object given the ant DOM element, or some object with an id, or even just an id.
dk = (c, d, a) => {for (d of b[P]) for (a of d.a) if (a.id == c.id || a.id == c) return a},

// Removes an object (must have .id) from a data set in the array at the subscript property, and remove the corresponding DOM element including its cache. Done in a timer, so it doesn't mess up any loops that call this.
Pf = (d, e = hd, f = J(d) || b, a = d.id, g = c(a)) => h(b => {f[e] = f[e]?.[k](b => b.id != a); g && (g[o]() || Ca(Kd, a))}, 0),

// Deletes an ant element.
Rd = a => Pf(a),

// Updates the antEl to reflect the state of the object, if possible.
T = (a, b = Fc(a)) => {

  if (isNaN(a.x) || isNaN(a.y) || isNaN(a.r))
    Cg[Zb]("ant is nanned", a);

  if (b && b[vg]) {
    ih(a, b);
    b[r][ea] = a.x + Fa;
    b[r][H] = a.y + Fa;
    Yi(a, b);
  }
},

// Gets an egg.
Sd = (a, b) => eb(a.e, b),

// Removes an egg from data and visually remove, either because it hatched or died.
Qf = a => Pf(a, 'e'),

// Updates the display of an egg element.
Rf = (a, b = Fc(a)) => {
  if (b && b[vg]) {
    a[p] && ca(a, He(na(a[p]), a.pc)); // Egg is in a tunnel, update the x/y coords from the tunnel.
    b[ki] = 'egg lvl' + a[e];
    b[r][ea] = a.x + Fa;
    b[r][H] = a.y + Fa;
    b[r][de] = `scaleX(${a[y]}) rotate(${a.r}deg)`
  }
},

// Draws an egg.
Sf = (b, d = c(Cd)) => {
  if (b.f == a.id) {
    Wa(d, `<div id=${b.id}></div>`);
    Rf(b);
  }
},

// Gets a carried item.
Zi = (b, a) => a.t == kd ? Sd(b, a.id) : [Ea, yc][Y](a.t) ? Vb(b, a.id) : a,

// Gets the key of the data array where a carried item would be stored in a dataset.
$i = a => a.t == kd ? 'e' : [Ea, yc][Y](a.t) ? hd : 'c',

// Determines if a carry object is either an egg or ant (and therefore they should exist before/after they are being carried).
Bh = a => $i(a) != 'c',

// Draws a carried item, or moves it from the farm container to the ant element.
Tf = (b, e, d = ga(`#${e.id} .c`)) => {
  if (b.f == a.id) {
    if (Bh(b)) {
      // This assumes the object was already drawn prior to this function running.
      let a = c(b.id);
      a[o]();
      Ca(Kd, b.id);
      d[Ad](a);
    }
    else Wa(d, `<div id=${b.id} class="carry C${b.t} ${b.k}"></div>`);
  }
},

// Undraws a carried item, or moves it from the ant element into the farm container.
Ch = (b, d = J(b), a = c(b)) => {
  if (a && a[vg]) {
    a[o]();
    Bh(b) && d[Ad](a);
  }
},
// @TODO how does drop a carry in a nip work?  hint: it doesn't yet.

// Transfers an object from one data set to another and removes/draws the DOM elements as well.
De = (d, b, a, c, e, f, g) => {// Note: newCont defaults to #farm container if undefined.
  e[b][n](ca(a.id ? a : eb(c[b], a), f));
  Pf(a, b, c);
  Sb(d) && (b == hd ? Wc : Sf)(a, g);
},

// Gets the X offset of "where" an ant is at based on its size.
Sa = (a, b = {b: 4, s: 6, m: 9, l: 11, x: 11}) => b[Vc(a)],

// Gets the Y offset of "where" an ant is at based on its size.
// Note: because of tunnel widths it would be a bad idea to ever return >=7 from here.
kc = (a, b = {b: 1, s: 2, m: 4, l: 5, x: 6}) => b[Vc(a)],

// Gets the Waypoint offset for an ant based on its size.
Dh = (a, b = {b: 1, s: 2, m: 3, l: 5, x: 5}) => b[Vc(a)],

// Computes the X value we'll use for some decision making.
Ee = a => a.x + Sa(a) * a[y],

// Computes the Y value we'll use for some decision making - adjusted so that 0 is surface level.
Eh = a => Ma(a) - kc(a),

// Computes the ant's Y value for a lot of underground related calculations.
Ma = a => a.y - gc,

// Gets a more accurate x/y coordinate of where the ant's head is with respect to its rotation.
Uf = (a, b = Sa(a), c = ub((a.r - 90) * a[y])) => ({x: a.x + db(c) * b, y: a.y + lb(c) * b}),

// Figures out the distance from the surface an ant on a hill would be.
// Note: the divisor for h caps the height, and the outer power sets the steepness of the hill for fine-tuning.
_i = (a, b, d, c, e = (a + b) / 2, f = (b - a) / 2, g = (c - e) / f) => c < a || c> b ? 0 : d / 2.6 * pf(1 - qf(qf(g, 2), .6)),

// Gets the height of a hill at an x-position.
ud = (c, d = a, b = d[oc][X](a => a.l < c && a.r> c)) => b ? _i(b.l, b.r, ba(50, b.h), c) : 0,

// Figures out the ant's "ground" level.
Lb = a => gc - kc(a) - ud(a.x, J(a)),

// Figures out the angle an ant would be due to the sides of hills being steep.
// Note: the actual angle has been divided as the ant would lean unnaturally.
Td = (a, b = J(a)[oc][X](b => b.l < a.x && b.r> a.x), d = b && b.l, e = b && b.r, f = (d + e) / 2, c = (e - d) / 2) =>
  !b ? 90 : 90 + (Ng(ab.atan(-ba(50, b.h) / 3 * ((a.x - f) / (c * c)) / pf(1 - qf((a.x - f) / c, 2)))) * -a[y] / 3),

// Adds to finna queue.
F = (b, c, a) => b && c && b.q[n](ca({[C]: c}, !a ? {} : typeof a != 'object' ? {tx: a} : a)),

// Adds to finna queue, but checks if ant needs to transition via the surface level first by either uncrawling or climbing.
// Only use this for actions that can be triggered from the top area (see acts.top), even if they won't go via the top.
// If ant is allowed to short-cut without going to the top first then use the n argument to set the destination's area.
// See goToLocation() for a more robust method of moving ants between areas.
nb = (a, c, b) => {
  if (!b?.n || a[q].n != b.n) {
    a[q].t && F(a, bf);
    a[q].n == jb && F(a, 'uncrawl');
  }
  F(a, c, b);
},

// Chooses a random action for the ant to perform based on where it is.
aj = (a, b, c = {Q: [$, Mc], D: [$]}) =>
  F(a, x(ma(xd[a[q].n])[k]((d, e) => xd[a[q].n][d] && (!b || e > 0) && !c[a[Cb]]?.[Y](d)))),

// Prepends a custom queue or queue item to finna queue.
vb = (a, b, c = 1) => a.q = [...c ? [a.q[Ic]()] : [], ...(ff.isArray(b) ? b : [b]), ...a.q],

// Replaces queue.
Vf = (a, b) => a.q = vb({q: []}, b, 0),

// Delegates an ant action.  Importantly; calls an antUpdate() so that anything that calls antAction doesn't have to first do an antUpdate().
// Done in a timer to prevent exceeding callstack and handle framerate speed by default.
O = (a, c = Ia, b = a.q[0]?.[C] || ie) => T(a) || !si && (za(a) || b == 'die') && h(c => nj[b](a), c),

// Does next action in finna queue.
// Most notably this calls antAction() and is often the logical alternative to calling antAction() directly.
A = (a, b) => {a.q[Ic](); O(a, b); if (a.thotD) a.thot = rh(a)},

// Adds a tracker to quickly determine where ant is. Includes a duration used in some areas, or a tunnel ID for the bottom.
Yc = (a, b, c) => a[q].n == b && a[q].t == c ? a[q].d++ : a[q] = {n: b, d: 0, t: c},

// Calculates the size of an ant step with impediments and lethargy.
Fe = a => a[y] * (
  ya[a.t].v
  - (a.hp < 10 ? .12 : a.hp < 20 ? .06 : a.hp < 40 ? .03 : 0)
  - (a.md < 10 ? .24 : a.md < 20 ? .12 : a.md < 40 ? .06 : 0)
  - (a.q[g] < 2 ? .2 : 0)
  - (Xa(a) ? .4 : 0)
) * (a.run || 1), // ant.run is independent of and cumulative to other speed multipliers and can be 0/1/undefined for normal speed, <1 for slow, or>1 for fast.

// Calculates the step size in a tunnel.
Wf = a => N(Fe(a)) / 2,

// Ant takes one step along the surface.
Xf = a => {
  a.x += Fe(a);
  a.y = Lb(a);
  a.r = Td(a);
},

// Gets the next spot to step to in the tunnel.
Ud = (a, b = Wf(a), c = ub((a[y] < 0 ? qd(a.r) : a.r) - 90)) => {
  a.x += db(c) * b;
  a.y += lb(c) * b;
},

// Works out the ant step size on 2-axis when travelling at an angle between two points.
bj = (c, d, e, f, a, b = Rb(c, d, e, f)) => ({x: b.x * a, y: b.y * a}),

// Get the entrance point of a tunnel.
cj = (a, e = 0, f = 0, g = 6, b = Rb(a.x1, a.y1, a.x2, a.y2),
  c = ba(g, b.d * (a[u] / 100)), d = (a.h / 2 - e) * -f) =>
  ({x: a.x1 + b.x * c - b.y * d, y: a.y1 + b.y * c + b.x * d}),

// Find where con overlaps with nextTun along nextTun's middle line.
dj = (b, a, c = Rb(a.x1, a.y1, a.x2, a.y2), d = 1 + b.w / 2,
  [f, g, e] = b.x1 == a.x1 && b.y1 == a.y1 ? [a.x1, a.y1, d] : [a.x2, a.y2, -d]) =>
  ({x: f + c.x * e, y: g + c.y * e}),

// Gets the index of the closest waypoint to an ant or a previous waypoint.
Zc = (d, a, b = tb[d.id], e = 10, c = b?.[dc](a)) =>
  c < 0 ? b[pc]((c, d, f, g, b = wa(a.x, a.y - (a.r ? gc : 0), d.x, d.y)) => (b < c.d && b < e) ? {b, f} : c, {d: Infinity, i: -1}).i : c,

// Gets the next waypoint relative to the current one.
Yf = (a, c, d = 1, e = Zc(a, c), b = e + d) =>
  b >= 0 && b < tb[a.id][g] && wa(c.x, c.y, tb[a.id][b].x, tb[a.id][b].y) < 8 ? tb[a.id][b] : 0,

// Gets the waypoint direction vector for the ant.
Fh = (b, a, c = {x: a.x, y: a.y, [y]: a[y], r: a.r}) =>
  Ud(c, 8) || va(Zc(b, c) > Zc(b, a)),

// Gets average angle of a set of waypoints.
ej = (a, c = 0, d = 0, b = 0) => {
  for (; b < a[g] - 1;) {
    let e = a[b], f = a[++b], g = Kg(e.y - f.y, f.x - e.x);
    c += db(g);
    d += lb(g);
  }
  return ka(90 - Ec(c, d));
},

// Determines if ant will collide with a waypoint in front of it.
fj = (d, a, b, c) => {
  for (b of tb[d.id]) {
    if (wa(a.x, Ma(a), b.x, b.y) < 30) {
      c = Ec(b.x - a.x, b.y - Ma(a), 90 - a.r);
      if (c < 10 || c> 350) return 1; // Waypoint is within the forward "cone" tolerance.
    }
  }
},

// Calculates if two specific ants are in proximity.
Gc = (a, b, c) => a.id != b.id && wa(a.x, a.y, b.x, b.y) < c,

// Finds an ant that is within proximity of supplied ant.
//@TODO this is only used once so far, and it is used as a .some not a .find.
gj = (a, b, c = 20) => b.a[X](b => Gc(b, a, c)),

// Determines if ant will collide with any others.  Optionally pass in an ant array to only check that group of ants.
Gh = (a, e = a.f ? J(a).a : b.a, c, d) => {
  for (c of e[k](b => !a[q] && !b[q] || a[q].n == b[q].n)) {
    if (Gc(c, a, 25)) {
      d = Ge(a, c);
      return d < 30 || d> qd(30) ? {ant: c, dir: va(d < S)} : 0;
    }
  }
},

// Determines if an ant in a tunnel is nearby an enemy ant.
hj = (b, c, d, a) => {
  if (d.foe)
    for (a of d.a[k](a => b.t != a.t && (c.id == a[q].id || c.co[Y](a[q].n))))
      if (Gc(a, b, 60)) return {ant: a, ang: Ge(b, a), dir: va(Ge(b, a) > S)};
},

// Determines the angle of one ant to another.
Ge = (a, b) => Ka(rd(a, b, -a.r - 90)),

// Determines if ant is in proximity of any placed items.
//@TODO this is only used once so far, and it is used as a .some not a .find.
ij = (a, b, c = 20) => b[aa][X](b => wa(a.x, a.y, b.x, b.y + b.h / 2) < b.w / 2 + c),

// Inverts an ant's angle if it has a negative scale.
vd = a => {
  if (a[y] < 0) {
    a[y] = 1;
    a.r = qd(a.r);
  }
},

// Determines the side of a tunnel a point is at.  Not reliable if point is in the middle of the tunnel.
Zf = (a, b) => va((a.x2 - a.x1) * (b.y - a.y1) - (a.y2 - a.y1) * (b.x - a.x1) < 0),

// Corrects an ant's orientation based on which side of a tunnel it is on.
// Important: wp is frequently passed in and not calculated here - an easy thing to forget when debugging!
$f = (a, b, d = tb[a.f][Zc(J(a), a)], c = a.q[0]) => {
  // Note: You'd think we'd use tun.r to snap the ant to the exact angle, but no, that's just as troublesome.
  if (a[y] != Zf(b, d || {x: a.x, y: Ma(a)}) * va(c.rev)) {
    a[y] *= -1;
    a.r = Og(a.r);
    if (_f(a, b) == c.rev) a.r = ic(a.r);
  }
},

// Returns true if ant is facing forward along the tunnel, false if backward.
_f = (b, a, c = ub(b.r - 90)) => (db(c) * b[y] * (a.x2 - a.x1) + lb(c) * (a.y2 - a.y1)) > 0,

// Nudges an ant toward the middle line of a tunnel.
jj = (b, a, i, c = Rb(a.x1, a.y1, a.x2, a.y2), e = Ib((b.x - a.x1) * c.x + (Ma(b) - a.y1) * c.y, 0, c.d),
  f = a.x1 + c.x * e - b.x, g = a.y1 + c.y * e - Ma(b), d = Rc(f, g), h = ba(i, d)
  ) => {
  if (d > 2) {
    b.x += (f / d) * h;
    b.y += (g / d) * h;
  }
},

// Nudges an ant toward the supplied waypoint.
Hh = (a, d, h, e = d.x - a.x, f = d.y - Ma(a), b = Rc(e, f), c = b - Dh(a), g = oe(c) * ba(N(c), h * (c < 0 ? 2 : 1))) => {
  if (b) {
    a.x += (e / b) * g;
    a.y += (f / b) * g;
  }
},

// Nudges an ant to middle of tunnel, changes to prone pose, and performs correction.
lc = (a, b) => {jj(a, b, Dh(a)); a[I] = Pa; vd(a)},

// Nudges an ant to waypoint along tunnel, changes to side pose, and performs correction.
Ih = (a, c, b) => {Hh(a, b, 2); a[I] = Db; $f(a, c, b)},

// Determines if an ant is within range of a waypoint to make landings, etc...
ag = (a, b, c = 1) => b && wa(b.x, b.y, a.x, Ma(a)) < Sa(a) * c, // Note: antOffsetX() just happens to be a nice amount.

// Determines whether a tunnel is of a centered rotation type.
wb = a => a.t == $b || a.t == M,

// Determines which tun we should consider the ant to be in and roughly at what percent along.  Optionally pass a tun in to limit searches to that one and directly connected tuns.
ob = (b, e = 0, c = 0, d = 0, f = 2,
  // Helper to check if a point is inside a convex quadrilateral.
  h = (d, e, b = 0, a, c) => {
    for (; b < 4;) {
      a = e[b], c = e[(++b) % 4];
      if ((c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x) < 0) return 0;
    }
    return 1;
  }, g, a) => {
  for (g of [...(d ? [d] : []), ...[M, $b, pa, p][k](a => a != d)]) {// 'Desire' moves the expected next tunnel type to the front of the types array.
    for (a of J(b)[v][k](a => (!c || c.id == a.id || c.co[Y](a.id)) && a.t == g && a.id != e && a[u] >= Wb(a, 8))) {
      let i = a.w / 2 + f, j = a.h / 2 + f, k = ub(a.r - (a.t == pa ? 0 : 90)), l = db(k), m = lb(k);
      // Check if ant is inside the rotated rectangle.
      if (h({x: b.x, y: Ma(b)}, [{x: -i, y: -j}, {x: i,  y: -j}, {x: i,  y: j}, {x: -i, y: j}].map(b => ({x: (a.x1 + a.x2) / 2 + b.x * l - b.y * m, y: (a.y1 + a.y2) / 2 + b.x * m + b.y * l})))) {
        let n = a.x2 - a.x1, o = a.y2 - a.y1;
        return {a, pc: Ib(((b.x - a.x1) * n + (Ma(b) - a.y1) * o) / (n * n + o * o), 0, 1) * 100};
      }
    }
  }
  // If at this point in the function and didn't find a tun and limitTun was passed in, try again without limitTun or desire.
  return c ? ob(b, e) : 0;
},

// Safely flips an ant's direction when in a tunnel.
Jh = (a, b) => {
  !f(9) && (a[I] = Pa); // Switching to prone first here is more reliable, and sometimes a side ant gets stuck flipping in a loop, this could resolve the issue?
  if (a[I] == Db) {
    a[y] *= -1;
    $f(a, b);
  }
  else {
    a.r = ic(a.r);
    vd(a);
  }
},

// Reformats action data into a valid dive stub that can be used with queue functions.
Vd = a => ({[C]: ia, n: Eb, [p]: a.id || a[p], pc: a.pc, pos: a.pos}),

// Converts a pixel length into the percentage of the tunnel that is represents.
Wb = (a, b) => b / a.w * 100,

// Converts a percentage length into pixels of the tunnel that is represents.
kj = (a, b) => b / 100 * a.w,

// Gets the coordinates of the cavity floor.
He = (a, b, d = 0, c = ub(a.r)) =>
  ({x: (a.x1 + (a.x2 - a.x1) * (b / 100)) - lb(c) * (a.h / 2), y: (a.y1 + (a.y2 - a.y1) * (b / 100)) + db(c) * (a.h / 2) - d}),

// This is a test function and has no been confirmed to work
// Potential problems: doesn't account for tun.r orientation of different types of tunnels.
// not refactored yet.
ek = (a, b, c = 0) => {
  const d = ub(a.r);
  const f = a.x1 + (a.x2 - a.x1) * (b / 100);
  const g = a.y1 + (a.y2 - a.y1) * (b / 100);
  const e = db(d) >= 0 ? 1 : -1; // choose which side is "down" in world coords
  return {
    x: f - lb(d) * (a.h / 2) * e,
    y: g + db(d) * (a.h / 2) * e - c
  };
},

// Slips an ant off the bg area.
Ie = a => Vf(a, {[C]: 'slip'}) && O(a),

// Handles an ant's end of life transition.
bg = (c, b, a = J(ca(c, {
    cause: b,
    [da]: yc,
    [wc]: mb(), // Use this to decompose the ant.
    rot: 0,
    decay: 0,
    eaten: 0,
    [fa]: 0,
    jit: 0,
    [$]: 0,
  }))) => {
  a[Xb][wc][b]++;
  xb(c.n + ` died in "${a.n}" ${Cj[b]}.`, 'err');
  Je(a);
  if (b == Ba && a.a[g] === 1 && Xa(a.a[0])) a.sweep = 1;
  xa();
},

// Returns a random worker, or failing that - a queen.  Must be in OK health.
Kh = a => x(a.a[k](a => Kb(a) && za(a) && a.hp > 50) || a.a[k](a => Xa(a) && za(a) && a.hp > 50)),

// Determines what, if anything, needs to be carried by a random worker.
lj = (a, b = a[v][X](a => a[Id]), d = a[v][k](a => a.t == pa && !a[K] && a.co[g] < 2 && a[u] == 100),
  c = Kh(a),
  f = a.a[X](a => a[da] == yc && !na(ob(a)?.[p])?.[Id]), h = a.a[X](a => a[ld]), i = a.e[k](b => {
    let c = a.a[X](a => a.id == b.Q && za(a));
    return c && c[Nc] && b[p] != c[Nc] || b[ld]; // No need to check if egg is in morgue because queen will move her nest soon if that's the case.
  })[yb]((a, b) => b[e] - a[e])[0]) => {

  // Recalculate where the morgue should be.
  if (!b || !d[Y](b)) {
    // Pick a new morgue.
    if (b) b[Id] = 0;
    if (!d) d = a[v][k](a => a.t == pa && a[u] == 100); // Loosen requirements.
    if (d) {
      b = x(d);
      b && (b[Id] = 1);
    }
  }
  if (c && !Xc(c)[D](a => [_, md][Y](a))) {
    // Move a dead ant not in the current morgue.
    if (f && b) F(c, _, {t: yc, id: f.id}); // A dead ant needs to be moved!
    // Move the egg with the highest lvl that is not in its queen's nest.
    else if (h) F(c, _, {t: Ea, id: h.id}); // An infant needs to be moved!
    else if (i) F(c, _, {t: kd, id: i.id}); // An egg needs to be moved!
  }
  else {
    // We found no ant to perform the carry task.  Last chance: If there's a worker in a vial, call them back out so there's a shot at giving them the task on the next pass.
    // Note: queen is never called back?  If we want her called back then update getWorkerOrQueen with respect to the data storage and state check to support selecting nip ants.
    c = Wd(a)?.[Na].a[X](a => Kb(a)) && mj(c);
  }
},

// Sends an ant to care for an egg or larvae.
cg = (b, c = Kh(b),
    a = x([b.e[yb]((a, b) => a.hp - b.hp)[0], b.a[k](a => a[Ea])[yb]((a, b) => a.hp - b.hp)[0]][k](Boolean)), // Randomly pick either a low hp egg or infant.
    d = a?.[Ea]) => {
  if (a) {
    d ? Xd(c, a) : $c(c, Vd({[p]: a[p], pc: a.pc, pos: qc}));
    F(c, 'care', {t: d ? Ea : kd, id: a.id});
  }
},

// Sets the colony and foe values for the current farm.
Je = a => {a.t = !a[Ob] && Si(a); a.foe = !a[Ob] && a.a[D](b => za(b) && b.t != a.t)},

// Gets the vial stuff from the nipples.
Wd = a => a[Aa][X](a => a[Na].k == rc),

// Tells an ant to exit a vial.
mj = (a, b = J(a), c = Wd(b)) => {
  // Perform a phase 3 nipWalk.
  wd(a, -25, 3);
  // Repeatedly check the nipWalk moved the ant to phase 5 and then deNip() it.
  let d = Ha(e => {
    if (a[$a] == 5) {
      Nh(a, c, b);
      ha(d);
    }
  }, od);
},

// Handles ant walking into an item attached to a nip, to a certain destination.
wd = (a, b, c = 0, d = Ha(e => {
  ca(a, {
    [$a]: 1 + c, // Flag that walk is happening.
    [fa]: 1,
    [y]: va(b > a.x),
    r: a.x < 20 || a.x> 32 ? 90 : 90 + a[y] * rd({x: 20, y: 32}, {x: 32, y: 38}) * .5, // Actual angle nerfed to half because it looked too intense.
    x: a.x + Fe(a) / 2,
    y: (a.x < 20 ? 28 : a.x> 32 ? 38 : 32 + 6 * (N(a.x - 20) / 24)) - kc(a),
    [cf]: Ja()
  });
  if (N(a.x - b) < Sa(a)) {
    a[fa] = 0;
    a[$a] = 2 + c; // Flag ant is ready for next phase.
    Ca(a, cf);
    ha(d);
  }
  T(a);
}, Ia)) => 1,

// Provides the vial animation activity. Makes ants walk into the vial and then randomly do random things.
// Curiously this code has no need to know which vial or farm the ant is in.
Lh = a => {
  !a[$a] && wd(a, 40 + f(170)); // Ant has not begun their vial walk yet.
  a[$a] === 1 && Ja() - a[cf] > cb && wd(a, 40 + f(170)); // Ant was stuck in nipPh 1.
  Ca(a, _);
  if (!f(3)) {
    let b = f(6);
    if (a[$a] > 1) {
      if (b > 1) {
        // Location change.
        a.r = 90;
        a[$a] = 0; // Blocks other animations.
        wd(a, 40 + f(170));
      }
      else if (b) a[I] == Db ? a[y] *= -1 : a.r = ic(a.r);
      else {
        // Pose change.
        if (a[I] == Db) {
          a[I] = Pa;
          vd(a);
          a.r += f(20) - 10;
          a.y = 36 - 2 * kc(a);
        }
        else {
          a[I] = Db;
          a[y] = va(a.r < S);
          a.r = 90;
          a.y = 36 - kc(a);
        }
      }
      T(a);
    }
  }
},

// Starts a vial animation loop if it isn't running already.  Also activates an antNipWalk() into the vial when first run.
Mh = a => mf ||= Ha((a = 0) => {
  b[P][i](b => Wd(b)?.[Na].a[i](b => {a = 1; !b[Ea] && Lh(b)}));
  if (!a) mf = ha(mf);
}, Hb + f(W)),

// Handles a phase 5 tube walk to insert an ant into a farm.
Nh = (a, c, b) => {
  eg(a, b);
  // Move ant into the farm.
  De(b, hd, a, c[Na], b, {
    thot: x(["That was a long walk!", "I've travelled to another world", "I'm a neighbor", "Moving in!"]),
    [$a]: 0, [da]: Pb, f: b.id, x: c[K] % 2 > 0 ? -25 : 985, y: Lb(a), [y]: 1
  });
  Je(b);
  F(a, K, {[K]: c[K], rev: 1});
  // Activate.
  O(a);
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
Oh = (f, b, a, g = b[Na], d = J(b.f),
  e = d?.[Aa][X](a => a.id == b.id), h = c(Bd + Nb[e[K]])) => {
  if (!a[$a] || a[$a] === 1 && Ja() - a[cf] > cb) wd(a, 600); // Phase 0.
  else if (a[$a] == 2) {
    // Phase 2.
    // Move ant to other half of tube.
    De(d, hd, a, g, e[Na], {[$a]: 3}, h);
  }
  else if (a[$a] == 3 || a[$a] == 4 && Ja() - a[cf] > cb) wd(a, -25, 3); // Phase 3.
  else if (a[$a] == 5) Nh(a, b, f); // Phase 5.
},

// Starts a tube animation loop if it isn't running already.
Ph = a => nf ||= Ha((a = 0) => {
  b[P][i](b => b[Aa][i](c => c[Na].k == bc && c[Na].a[i](d => {a = 1; !d[Ea] && Oh(b, c, d)})));
  if (!a) nf = ha(nf);
}, od),

// Ant actions come in a namespaced package so that the action names can be compared to strings.
// Also includes things that the ants "do" to support actions.
nj = {

  // Ant is stunned while it chooses what to do next.
  [ie]: a => {
    // Queue default action.
    a.q[g] < 2 && F(a, ma(xd[a[q].n])[0]);
    (a.q[0][C] == ie || a.q[1] ? A : O)(a, f(W)); // Note: sometimes idle is a "phantom" action with no corresponding queue item, so this handles that.
    xa();
  },

  // Ant explores the ground level of the ant farm (default activity).
  // @TODO handle bumping into foreign ants / fighting / corpses. --- normally ants just pass each other but if farm.foe is truthy it is possible they are an enemy.
  [xc]: (a, c = Ee(a), d = a.q[0], b = a.q[1], e = Sa(a), g = c < e || c> 960 - e ? 0 : Bc()) => {
    a[fa] = 1;
    a[I] = Db;
    Yc(a, H);
    // Main loop.
    // Check if the ant is set to reach a certain target and hand it off to another action.
    // Note: This code assumes .tx is never set to 0.
    if (!d.for && b && (!b.tx || N(b.tx - c) < Sa(a))) {
      a[fa] = 0;
      A(a, f(od));
    }
    else {
      // Move ant.
      d.for && d.for--;
      Xf(a);
      if (!b && g < .0002 || b?.tx && (b.tx - (c + a[y] * Sa(a))) * a[y] < 0) {// Random or heading the wrong way.
        // Flip direction (with brief pause).
        a[fa] = 0;
        O(a, f(od));
        a[y] *= -1; // <-- Yes, this has to be here after antAction() to set up the next loopback, rather than do it right away.  Looks better.
      }
      else if (g < .001) {
        // Pause.
        a[fa] = 0;
        O(a, f(Hb));
      }
      else O(a);
    }
  },

  // Start or continue digging.
  [$]: (a, c = J(a), d = eb(c[$], a.digT) || x(c[$]), j = a.q[0], b = na(c, j.id), r = ya[a.t],
    l = r.v * .2, e,
    m = (a, b) => e = Ha(c => {
      // This could be improved by having the ant dip into the tunnel when it is deep enough ?
      a.x += va(Ee(a) < b.x1) * Bc();
      a.y = Lb(a) + 2;
      a.r = Td(a) + b[u] / 9 + f(5);
      T(a);
    }, ec),
    o = (a, b, g = 0, h = 0, d, j) => {
      // Turn ant towards a random point that is roughly facing away from the already-dug tunnels.
      c[v][k](a => a[u] == 100 && a.co[Y](b.id)).map(a => rd(b, (a.x1 == b.x && a.y1 == b.y) ? {x: a.x2, y: a.y2} : {x: a.x1, y: a.y1}))[i](a => {
        d = ub(a - 90);
        g -= db(d);
        h -= lb(d);
      });
      j = ba(Ka(Ec(g, h) + f(90) - a.r), f(15));
      e = Ha(c => {
        let d = Rb(a.x, Ma(a), b.x1, b.y1);
        if (d.d > .2) {
          a.x += d.x * .2;
          a.y += d.y * .2;
          T(a);
        }
        else {
          a.r += j;
          ha(e);
        }
        T(a);
      }, Ia);
    }) => {
    if (c.dun || Tc(a)) A(a); // No digging required.
    else if (a.digD && b) {
      a.digT = b.id;
      a[fa] = 0;
      h(b => {a[$] = a.jit = 1; T(a)}, f(ja)); // Random delay added so ants aren't synch'd on page load.
      b.rwip = !wb(b) && c[v][D](a => a[u] == 100 && a.x1 == b.x2 && a.y2 == b.y2); // Mark tunnels that are being build backwards.
      // Digging movement and animations.
      if (!Ub(c) && Yd(c)) l *= 1.5; // Ants dig faster if there is a Queen and farm is undeveloped.
      if (Xa(a)) l *= 3; // Queens only dig when there are no workers, but do it much faster.
      if (!wb(b)) {
        l *= (b.t == pa ? .1 : .3); // Long tunnels are dug slow, with cav chambers the slowest of all.
        if (b[u] < Wb(b, 8)) {
          // Ant would have been blocked from entering tunnel by the dive action, so continue to act like it's digging an entrance or con.
          b.co[Y](j[M]) ? m(a, na(c, j[M])) : o(a, c[v][X](a => b.co[Y](a.id) && a.t == $b && a[u] == 100));
        }
        else {
          // Default nudger; just brings the ant closer to the edge of the dig area every 2 seconds if needed.
          e = Ha(c => {
            let d = ob(a, 0, b);
            if (d && d.pc + kc(a) < (b.rwip ? 100 - b[u] : b[u])) Ud(a);
            T(a);
          }, ua);
        }
      }
      else if (b.t == M) m(a, b); // Entrance tunnel.
      else o(a, b); // Con tunnel.
      // Everything from now on happens after a significant delay.
      // This makes the digging slow, and prevents an exploit where reloading skips the wait-time in digging.
      h(d => {
        // Incremement progress based on the size of the tunnel.
        b[u] = ba(100, b[u] + l);
        b.t == M && b.co[i](a => a[u] = Wb(a, kj(b, b[u] / 2))); // For entrances also increment the connected tunnels like they've been dug a little too, or it takes too long.
        Sb(c) && ue(b);
        if (b.t == p || b.t == pa) {
          // Pick an adjacent hill and increase its height slightly.
          // To know it is adjacent; the hill should have the same index as the current tunnel system, or one higher.
          let a = c[oc][c[v][ig](a => a.id == j[M]) + f(1)];
          a.h += .005;
          h(b => Sb(c) && Yg(a), la);
        }
        // Track how long ant has been digging.
        a.digD++;
        // Digging depletes ant's stats.
        Ya(a, {fd: -.005, dr: -.003, hp: -.01});
        // Remove digging behaviour here, it'll be reapplied if a loopback via antAction() occurs.
        ha(e);
        a.jit = a[$] = 0;
        // The ant will stop digging if...
        // There was no tunnel found to dig, or the current tunnel piece is finished.
        // On a RANDOM chance when one of the following conditions is met: Dig duration is high, or queue exists.
        // Or there are at least 3 ants working on the same tunnel.
        if (b[u] == 100 || ((a.digD > 5 || a.q[1]) && !f(5)) || c.a[k](b => b.digD && b.digT == a.digT) > 3) {
          if (b[u] == 100) {
            // Remove this tunnel piece from the dig list.
            c[$] = c[$][k](a => a.id != b.id);
            Ca(a, 'digT');
            if (b.t == M) {
              Mb(c, [`Ants have dug a tunnel entrance in "${c.n}"`]);
              gb(1);
            }
            else if (b.t == p) {
              Mb(c, [`A connection tunnel has been completed in "${c.n}"`]);
              gb(2);
            }
            else if (b.t == pa) {
              Mb(c, [`A new chamber cavity has been finished in "${c.n}"`]);
              gb(5);
            }
          }
          // Dig end.
          Wg(c);
          a[q].n == Eb && vb(a, {[C]: bf});
          Ca(a, 'digD');
          a[q].t && Jh(a, b);
          A(a);
        }
        else O(a);
      }, la);
    }
    else {
      // Setup.
      a.digD = 1;
      // Pick the tunnel the ant will dig, preferring the last tunnel it was digging, otherwise choose one another ant was digging.
      // If none was picked, or there is only one to choose from plus random chance, find where ant could dig.
      if (!d || c[$][g] < 2 && !f(25)) {
        // Pick a random entrance and find an unstarted tunnel that it leads to.
        let h = x(c[v][k](a => a.t == M && a[u] == 100)); // Inverted match.
        if (path = h && f(9) && Jb(c, h, {[u]: 100, t: M}, [], 1, 1)) c[$][n](d = path[g] ? {n: Eb, id: Dc(path), [M]: h.id} : {n: H, tx: h.x1, id: h.id, [M]: h.id});
        else {
          // Dig a new entrance.
          let f = x(c[v][k](a => a.t == M && a[u] < 100));
          if (f) c[$][n](d = {n: H, tx: f.x1, id: f.id, [M]: f.id});
          else if (!c[v][D](a => a[u] < 100)) c.dun = 1; // Nothing more to do.
        }
      }
      if (d) {
        let f = na(c, d.id);
        d.pc = f[u];
        $c(a, Vd(d));
        F(a, $, d);
      }
      xa();
      A(a);
    }
  },

  // Climb sets up a dive path to the surface.
  [bf]: (a, b = J(a), c = []) => {
    if (a[q].t) {// Sometimes climb is in an ant's queue erroneously :/
      let d = na(b, a[q].t), e = Jb(b, d, {t: M}, [], 0, 1);
      // Create a custom queue.
      if (!e && d.t == $b && d[u] <= 15) { // Sometimes the ant is wrongly pinpointed to be in an unbuilt con from which the path finder fails.
        let f = ob(a, a[q].t);
        Yc(a, Eb, f[p].id);
        e = Jb(b, f[p], {t: M}, [], 0, 1);
      }
      a[q].t && c[n](Vd({id: Dc(e)}));
      c[n]({[C]: xc, for: 9 + f(99)});
      // Prepend the climb queue to the main queue.
      vb(a, c);
    }
    A(a);
  },

  // Burrowing action.
  [ia]: (b, e = J(b),
      a = b.q[0],
      c = na(e, a.id),
      o = b.q[1],
      d = o?.[C] == ia && na(e, o.id), l = tb[e.id] && tb[e.id][Zc(e, b)], m,
      r = 1, j = d ? d.r : 0, g = pd(b),
      s = (b[y] * (d?.r - S))> 90
  ) => {
    if (a.id && c) {// Sometimes tun is invalid, haven't looked into it.
      // This is a fully expanded dive queue; determine destinations.
      if (!wb(c) && c[u] < Wb(c, 8) || wb(c) && (d?.[u] < Wb(d, 8) || c[u] < 100)) return A(b); // Protect against entering underbuilt tunnels.
      if (c.t == M) {
        if (b[q].n == H) a[kb] = cj(d, kc(b), s ? 0 : -b[y]); // Entering from surface.
        else {
          // Ant is about to surface; predict how it should end up.
          !a.pt && lc(b, c, a.rev);
          g[y] = b[I] == Pa ? Cc() : Zf(na(e, a.pt), Zc(e, b)) * -1;
          g.x = (g[y]> 0 ? Qa : ba)(b.x, c.x1) + 7 * g[y];
          g.y = Lb(g);
          a[kb] = {x: g.x, y: Ma(g)};
          j = Td(g);
          if (g[y] < 0) j = ka(j + S);
          a.sc = g[y];
        }
        // Flag a rotWalk.
        r = 2;
      }
      else if (c.t == $b) {
        if (b[I] == Pa) {
          // Just rotWalk to the next tunnel.
          a[kb] = dj(c, d);
          if (d.t == pa) a[kb].y += f(8) - 4; // Randomize it a bit for cavities.
          // Flag a rotWalk.
          r = 2;
        }
        else if (d) {
          // Figure out where the ant will wind up if it continues in side pose.
          do {
            l &&= Yf(e, l, Fh(e, b));
            m = l && ob({x: l.x, y: l.y + gc, f: e.id}, 0, c);
          } while (m && (m[p].id == c.id || m[p].id == a.pt));
          if (m?.[p].id != d.id) {
            // Ant is creeping toward wrong tunnel - switch to prone to make a proper turn, and loopback to this function.
            lc(b, c, a.rev);
            return O(b);
          }
          // NOTE: At this point the execution should fall through to the "if (executeAction> 1) {" part of the code.
        }
      }
      if (d) o.pt = c.id; // Notify the next action of the previous tunnel.
      if (r > 1) {
        // Rot Walk execution.
        // Work out step (step size) and dist (num steps / frames).
        a.step = bj(b.x, b.y, a[kb].x, a[kb].y, Wf(b));
        a[Fb] = rf(Rc(a[kb].x - b.x, a[kb].y - (a.r ? b.y : Eh(b))) / Rc(a.step.x, a.step.y));
        // Switch to prone when entering tunnel from surface at a badAngle.
        s && h(a => {b[I] = Pa}, a[Fb] / 2 * Ia);
        if (d?.t == pa) j += 90; // Cav chambers use a different coordinate system :/
        if (b[q].n == H) b.r = 90; // Normalize angle of surface level ants to prevent over-rotation.
        if (c.t == M) a[Fb] *= .8; // Speed up entry transitions.
        if (c.x1 == d?.x2 && c.y1 == d?.y2) j = ic(j); // Correct for going the other way through tunnels.
        ca(a, {
          r: Ka(b.r), // Initial angle.
          td: a[Fb], // Initial total distance.
          ang: Ka(Ec(a[kb].x - b.x, a[kb].y - b.y + gc, 90)), // Travel angle.  Orient to connection point.
          rot: Ka(j), // Final angle.  Orient to tunnel.
          // Step sizes.
          sX: (a[kb].x - b.x) / a[Fb],
          sY: (a[kb].y - b.y + gc) / a[Fb],
          // Override 'dive' with the relevant walking action and execute.
          [C]: yg
        });
        if (b[y] < 0) {
          a.ang = Ka(qd(a.ang));
          a.rot = Ka(qd(a.rot));
        }
        Yc(b, Eb, c.id);
        O(b);
      }
      else {
        // Tun Walk execution.
        a.pc = a.pc || 100;
        if (d) a.rev = c.x1 == d.x1 && c.y1 == d.y1; // Tun is connected backwards.
        else a.rev = ob(b, a.pt, c).pc> a.pc; // This is the final tunnel, use a secondary method to determine the 'rev' flag.
        a[kb] = a.rev ? 100 - a.pc : a.pc;
        a[Fb] = a.rev ? 100 : 0;
        if (!wb(c) && _f(b, c) == a.rev) b[I] == Db ? $f(b, c) : (b.r = ic(b.r));
        // Override 'dive' with the relevant walking action and execute.
        a[C] = xg;
        Yc(b, Eb, c.id);
        O(b);
      }
    }
    else {
      // No dive queue - select tunnels and create queue.
      let h = a[p] ? na(e, a[p]) : x(e[v][k](a => a.t == pa && a[u] == 100)), t = [];
      if (h) {
        let k = Jb(e, h, b[q].n == H ? {t: M} : {id: b[q].t}, [], 0, 1);
        if (b[q].n == H) {
          let f = h.t == M ? h : na(e, k.pop());
          t[n]({[C]: xc});
          t[n]({[C]: ia, tx: f.x1, id: f.id});
        }
        if (b[q].t && !k) {
          // Different tunnel system.
          t[n]({[C]: bf});
          t[n]({[C]: ia, [p]: h.id});
        }
        else {
          k.reverse()[i](a => t[n]({[C]: ia, id: a}));
          // Rebuild the current action into the final destination action.
          a.id ||= h.id;
          a.pc ||= !wb(h) && ba(h[u], 20 + f(60));
          t[n](a);
        }
        vb(b, t);
      }
      // Execute queue.
      A(b);
    }
  },

  // Rotational walk for tunnel entrances and tunnel 'con' pieces.
  [yg]: (a, d = J(a), b = a.q[0], g = na(d, b.id), e = a.q[1],
    h = e?.[C] == ia && na(d, e.id), c = .6) => {
    a[fa] = a.jit = 1; // Add a class to CSS 'jitter' the ant, because rotWalks are awkwardly "smooth" compared to other ant walking.
    if (--b[Fb] > 0) {
      // One step of rotation.
      let i = 1 - b[Fb] / b.td; // Whether it's before or after the cutoff to phase 2.
      a.r = i < c ? Pg(b.r, b.ang, vi(i / c)) : // Phase 1: Orient to point.
        Pg(b.ang, b.rot, Qg((i - c) / (1 - c))); // Phase 2: Orient to final angle.
      a.x += b.sX;
      a.y += b.sY;
      O(a, Ia + f(Ia / 2)); // Extra random frame delay added to prevent animation looking too "smooth".
    }
    else {
      // Rotation complete.
      a.jit = a[fa] = 0;
      if (!h && g.t == M) Be(a, b.sc); // Special case for ants that have just surfaced.
      else {
        a[I] == Pa && vd(a);
        A(a);
      }
    }
  },

  // Burrowing walk-along action.
  // @TODO handle encountering ant corpse.
  [xg]: (a, d = J(a), c = a.q[0], b = na(d, c.id), m = a.q[1],
      j = m?.[C] == ia && na(d, m.id),
      o = (30 / b.w * (b[u] / 100)) * 100,
      r = c.rev ? c[Fb] < o : c[Fb]> (b[u] - o),
      t = Wf(a) / 4, k = Gh(a),
      i = tb[d.id] && tb[d.id][Zc(d, a)], e = [i], l, s) => {
    a[fa] = 1;
    // Move along in tunnel.
    if (a[I] == Db) {
      if (i) {
        let h = Fh(d, a);
        // Nudge ant closer to wp if needed.
        Hh(a, i, t);
        // Get the nearest waypoints to align the ant to.
        while (e[0] && e[g] < 3 && (l = Yf(d, e[0], -h))) e.unshift(l);
        let q = e[g] + 3;
        while (e[g] < q && (l = Yf(d, Dc(e), h))) e[n](l);
        // Determine ant's new angle.
        let f = ej(e);
        if (a[y] < 0) f = Og(f);
        let p = Ka(f - a.r);
        // Update the ant's rotation, but cap it at 5 degrees per frame, and snap if over 99 deg.
        a.r = N(p)> 99 ? ic(f) : ka(a.r + Ib(p, -5, 5));
      }
      if (!i || !Dc(e)) {
        // Lost waypoint.
        lc(a, b, c.rev);
        c.ns = 1; // Mark this action as "no switch" to prevent random pose switching.
      }
    }
    else if (!r) {
      // Prone walk roughly towards the destination with collision corrections.
      if (!f(5)) a.r = ka(a.r + Cc()); // Add a little random wobble to the angle.
      if (k) {
        // Ant is going to collide with another ant.
        let f = k.ant;
        if (a[da] == f[da] && a[q].n == f[q].n && !Mf(a, f)) {
          if ((f.t == a.t || wh(a)) && a[I] == Pa && f[I] == Pa) {
            if (b.t == pa && !a[df] || a[df] < 49) {
              // Avoid this ant.
              let g = Rb(f.x, Ma(f), a.x, Ma(a));
              ka(a.r - k.dir * 6);
              a.x += g.x;
              a.y += g.y;
              // Track ant avoidance duration so we can stop doing it if it gets too insane.
              a[df] ||= 0;
              a[df]++;
              h(b => Ca(a, df), 5000);
            }
            // No other situations are handled in terms of collision avoidance, because it would be too annoying.
          }
          else if (f.t != a.t && !d[Ob]) Of(a, f); // Fight!
        }
      }
      // Partial correction for prone ants in a 'tun' that have a weird trajectory.
      if (b.t == p) {
        let f = Ka(a.r - b.r), g = N(f) < 90 ? f : Ka(ic(f));
        if (N(g)> 3) a.r = Ka(a.r - oe(g));
      }
      // Determine if we're on a collision course with a waypoint and turn ant towards tunnel centreline by 2 degrees.
      // Don't check this at tunnel ends, but there is a secondary alignment method for that area at the end of this function, as well as the antTunPos contingency check.
      if ((s = fj(d, a))) {
        if (k && !f(3)) vb(a, {[C]: ie}, 0); // Ant is dealing with an ant collision as well, give it some hesitation.
        else a.r = ka(a.r + oe([0, S].map(c => Ka(b.r - (b.t == pa ? 90 : 0) + c - a.r))[yb]((a, b) => N(a) - N(b))[0]) * 2);
        // Check if ant is stuck on the midline at the end of a tunnel.
        let g = ka(a.r - 90);
        if ((N(g) < 3 || N(g - S) < 3) && (wa(a.x, Ma(a), b.x1, b.y1) < 3 || wa(a.x, Ma(a), b.x2, b.y2) < 3)) {
          a.r = ic(a.r);
          Cg[Zb]("ant got stuck on midline at end of tunnel");
        }
      }
    }
    // When there is no collision emergency check for more things.
    if (!s && !k) {
      let g = hj(a, b, d);
      if (g) Of(a, g.a); // Ant is near an enemy ant.
      else if (c.pos) {
        // Position encourager feature.  Coaxes ant to walk towards the side of the tunnel it is supposed to be on, but there is no guarantee it'll get there.
        // NOTE: This only works for 'cav' tunnels which are roughly horizontal, that isn't checked here, it is assumed the calling code will only use this feature for cavs.
        if (a[I] == Pa) {
          if (ag(a, i)) Ih(a, b, i); // Ant is in landing range, so land it.
          else if (ag(a, i, 2)) {
            // Ant is getting close to landing range, but is probably coming in too steep.
            // Straighten up to 90 or 275, 15deg at a time.
            if (a.r < S) {
              // Goal is ~90.
              if (a.r < 75) a.r += 2;
              if (a.r> 105) a.r -= 2;
            }
            else {
              // Goal is ~275.
              if (a.r < 260) a.r += 2;
              if (a.r> 290) a.r -= 2;
            }
            a.y += c.pos == 'u' ? 2 : -2; // Bump ant even closer.
          }
          else {
            // Ant is too far away from tunnel wall and needs to be angled there.
            let f = N(c[Fb] - c[kb]) < 20; // Determine if ant is very close to the destination.
            if (c.pos == 'u') {
              if (a.r < S) if (a.r> 50 || f && a.r > 15) a.r -= 9; // Limits are 45 and 10.
              else if (a.r < 310 || f && a.r < 345) a.r += 9; // Limits are 315 and 350.
            }
            if (c.pos == 'd') {
              if (a.r < S) if (a.r < 130 || f && a.r < 165) a.r += 9; // Limits are 135 and 170.
              else if (a.r> 235 || f && a.r > 195) a.r -= 9; // Limits are 230 and 190.
            }
          }
        }
        else {
          let f = Zf(b, {x: a.x, y: Ma(a)});
          if (c.pos == 'u' && f < 0 || c.pos == 'd' && f> 0) c.ns = 1; // Already correct position, flag "no switch" to prevent random pose switching.
          else {
            // Wrong side of the tunnel, switch to prone.
            lc(a, b, c.rev);
            c.ns = c.pos == Oa; // Disable random switching for 'm' position.
          }
        }
      }
      // Random ant pose switching feature.
      if (!c.ns) {
        if (!wb(b) && ag(a, i) && !f(a[I] == Pa ? ec : R)) {
          c.ns = 1; // Don't randomly switch again in this tunnel.
          if (a[I] == Pa) Ih(a, b, i);
          else lc(a, b, c.rev);
        }
        else if (r) c.ns = 1; // Ant is near the end of this tunnel, disable the random switcher.
      }
    }
    // Walk along tunnel.
    Ud(a);
    // Now check where the ant actually is.
    let w = ob(a, c.pt, b, j?.t);
    if (!w && b[u] < 15) w = {[p]: d[v][X](a => a.co[Y](b.id) && a[u] == 100)}; // If we're working on an underbuilt tunnel, let's just say we're in the previous tunnel.
    while (!w) {
      // Ant is detected to be not in a tunnel at this point. That's a bug and would ideally be fixed. For now, shuffle the ant back into the tunnel.
      lc(a, b, c.rev);
      w = ob(a, c.pt, b);
      // This could get it out of a pickle.
      if (wb(b)) {
        a[fa] = 0;
        c[C] = ia;
        return O(a);
      }
      if (!f(19)) a.r = ka(a.r + 9); // Random chance to bump the ant's rotation, that might help sometimes.
    }
    if (w[p].id != b.id) {
      // Ant is in a different tunnel than the one it is supposed to be in.
      // This could be normal in which case antNext() will continue the journey, but there are some cases to check first.
      if (w[p].id != j?.id) {
        // Ant's current actual position is not in the nextTun in the queue.  This code will investigate the problem.
        Yc(a, Eb, w[p].id);
        // Check if a tunnel was skipped over (it happens).
        let g = a.q[2], f = g?.[C] == ia && na(d, g.id);
        if (a[I] == Db && f?.id && w[p].id == f.id) a.q[Ic](); // Ant has probably shimmied past a 'con' so it didn't register, it can skip an action.
        else if (w[p].co[X](a => b.co[Y](a)) == j.id) {
          // Ant has wandered into an adjacent tunnel at a juncture, switch to prone to complete an awkward course correction on the next pass.
          a[I] = Pa;
          vd(a);
        }
        else {
          // Consider where the ant's head might be.
          w = ob(ca(pd(a), Uf(a)), 0, b);
          if (w && [j.id, f.id][Y](w[p].id)) {
            // Ant's head is actually in an upcoming tun, so they're not really off course and looping back to antAction or antNext might be OK.
            // But does this situation ever arise?
            Cg[Zb]("Made a decision to not course-correct based on position of ant's head coordinates.");
          }
          else {
            // Severe course correction.  Ant is lost, so set up a new path to the original destination (the last dive action in the queue).
            let h = Qa(0, a.q.map(a => a[C]).lastIndexOf(ia)), n = a.q[h];
            a.q[Dd](0, h + 1); // Remove the dive queue, but keep anything after the final dive.
            vb(a, Vd(n), 0);
            return O(a);
          }
        }
      }
      // Execute queue.
      // Note: Don't allow antNext() into non-rotational tunnels that ant is not roughly aligned with or ant can glitch out on a subsequent pass because its rotation makes antDir() in the 'dive' action wrong.
      !wb(j) && N(a.r - j.r - (j.t == pa ? 90 : 0)) > 45 ? O(a) : A(a);
    }
    else if (wb(b)) O(a); // Special case for rotation tunnels.  Just loopback to this action without doing further checks.
    else if (_f(a, b) == c.rev) {
      // Wrong way!  Ant needs to be flipped around safely.
      Jh(a, b);
      a[fa] = 0;
      c[C] = ia;
      O(a, f(Hb));
    }
    else if ((w.pc - Wb(b, Sa(a)) * va(c.rev) - c[kb]) * va(c.rev) < 0) {
      // Ant reached action.dest
      a[fa] = 0;
      A(a);
    }
    else {
      // Not there yet - loop back to this function.
      c[Fb] = w.pc;
      if (f(ec)) O(a); // Normal loopback.
      else {
        // Loopback with brief pause.
        a[fa] = 0;
        O(a, Ia + f(Hb));
      }
    }
  },

  // Prone walks an ant to exactly a target.
  // target can be another ant's head, or midpoint, or it can be an x/y coordinate.
  //getAntHeadPoint() and antToAntAngle()
  // If pickup/dropoffs look stupid, we could create something that if ant is prone in mid of a cavity they can briefly use moveAntDefault()
  // to orient themselves to a target, that would be useful in fights too.   Needs a lot of waypoint checking though!
  tunOrient: (a, b = J(a), c = a.q[0], d = na(b, c.id)) => {
    // we can use tunWalk to take one step towards the target and come back to this.
    A(a);
  },

  // Slip off the bg scenery/glass.
  slip: (a, b = Lb(a)) => {
    a[I] = Kc;
    if (b - a.y > 1.2) {
      a.y += 1.2;
      if (a.r < 90) a.r += 1.2;
      O(a, Ia / 2);
    }
    else {
      // Target reached.
      a.q = []; // Clear the queue because the ant now has a concussion and it's complicated to consider which queue items are still valid.
      Be(a);
    }
  },

  // Slip to the floor of a cavity.
  tunSlip: (a, b = J(a), c = a.q[0], d = na(b, a[q].t)) => {
    a[I] = Kc;

    // Don't use cavFloor!  Unless it would work??  maybe!   Perhaps it can be re-adapted...
    // Update: we have a new func called tunFloor() but it is expected to have problems!   Might not work in con/ent at all?  We'll have to use antGetTunPos and request 'cav' and 'tun' types preferentially?  or recall them ignoring 'con' and 'ent'
    //      otherwise we just skip the slipping perhaps?
    // What we really need here is a loop that moves the ant down by 1.2px until they hit a bottom waypoint??
    // @TODO!!!
    if (1 /* has not hit the floor*/) {

      // ant should rotate to match tun.r or 180-tun.r whichever is closer!  //mirrorAngle ? --> similar to 'land:' function

      O(a, Ia / 2);
    }
    if (0/*has hit the floor*/) {
      // Mark the ant as slipped is requested to by the caller (for death reasons).
      if (c.mark) a.slip = 1;

      // call antNext()
    }

    A(a);
  },

  // Land an ant near the surface onto the surface.
  land: (a, b = Lb(a)) => {
    if (b - a.y > 1) {
      a.y += 1;
      a.r += a.r > S && a.r < 255 ? 15 : a.r> 105 ? -15 : 0; // We know ant is heading downwards (~180deg) now adjust orient towards horizontal.
      O(a);
    }
    else Be(a);
  },

  // Uncrawl action.
  uncrawl: a => {
    vb(a, [{[C]: jd, [H]: 1}, {[C]: xc}]);
    A(a);
  },

  // Prone walk on the scenery/bg inside the farm.
  [jd]: (a, b = a.q[0], e = a.q[1], d = Nf(a), c, g) => {
    Yc(a, jb);
    if (!a[q].d && (a.x < 30 && a[y] < 0 || a.x> 930 && a[y] > 0)) a[y] *= -1; // Ant is about to walk into the edge of the farm, let's flip it first.
    a[I] = Pa;
    vd(a);
    if (!b || (!b.x && a.y < -460 && !f(la))) Ie(a); // Slip off.
    else if (!b.x && d && d[0] == S && (!b.for || b.for < 1) && (e && !xd[jb][e[C]] || b[H] || a[q].d> la && !f(3))) {
      // At the bottom boundary, land the ant.
      vb(a, {[C]: 'land'});
      A(a);
    }
    else if (!b.x && !b.for && e && xd[jb][e[C]] || b.x && wa(a.x, a.y, b.x, b.y) < Sa(a)) {
      // Ant has crawled for long enough or reached the destination, move on to the next action.
      a[fa] = 0;
      A(a);
    }
    else {
      if (a[q].d < 49 && d && d[0] == S) a.r = ka(a.r + f(5) * va(a.r> S)); // Ant is starting the crawl; ignore the "near" collision and orient it slightly upwards.
      else if (d) {
        // Redirect ant from boundary.
        c = Ka(a.r - d[0]);
        a.r = N(c) < 10 && !f(ec) ? ic(a.r) : ka(a.r + va(c> 0) * 9); // Occasionally just flip the ant on shallow angles to prevent stuck-in-corner forever situation.
      }
      else if (a[q].d > 99 && b.x) {
        // We want this ant to head to a particular spot.
        g = rd(a, b) + 90;
        c = Ka(g - a.r);
        a.r = ka(N(c) < 3 ? g : a.r + oe(c) * ((N(c)> 90 && wa(a.x, a.y, b.x, b.y) < 20) ? 10 : 2));
      }
      else if (!f(W)) a.r = ka(a.r + f(20) - 10); // Random direction bump.
      else if (b[H] && a.x < Lb(a) - 20) {// Ensure ant is well above surface level before enforcing the following rules.
        // Prevent ant walking upwards. (Reoriented normalization so upward maps to 0..160)
        if (ka(a.r + 80) < 160) a.r += S;
        else {
          // Turn ant in a generally downward direction.
          c = Ka(S - a.r);
          if (N(c)> 30) a.r = ka(a.r + (c < 0 ? -5 : 5));
        }
      }
      // Track time spent.
      b.for && b.for--;
      // Continue crawl.
      xh(a, O, 1, .5, 2);
    }
  },

  // Ant stops and regenerates hp and mood.
  [Mc]: (a, b = J(a)) => {
    // Ant needs to find a spot away from other ants, food, and water.
    if (gj(a, b) || ij(a, b)) {
      if (a[q].n == Eb) {
        F(a, ia, {[p]: f(9) && a[q].t});
        F(a, Mc);
      }
      else vb(a, {[C]: ma(xd[a[q].n])[0], for: 5}, 0); // For top and bg we just need to move a little and try again.
      O(a);
    }
    else {
      // After wait time, increment ant's stats, and check whether to wake up.
      h(b => {
        Ya(a, {hp: .3, md: .15});
        a.hp > 10 && !f(120) || a.hp > 90 && !f(60) || a.hp > 99 ? A(a) : O(a);
      }, W);
    }
  },

  // Ant eat action.
  [Jd]: (a, e = J(a), c = a.q[0], i, j = c.t == ni, d = eb(j ? e.a : e[aa], c.id)) => {
    if (c.id && d) {
      // Ant has reached the target food.
      i = Ha(b => a[$] = a[$] ? 0 : !f(3), R + f(R)); // Randomly toggle dig style on and off.
      ih(a);
      h(h => {
        if (d) {// Check food still exists at this point before going through with calculations.
          if (j) {
            Mb(e, ["Your ants are turning to cannibalism.", "The ants are resorting to eating their enemies!"]);
            if (!d.eaten) {
              // Mark this ant's corpse as being for eatin, and increment the fed stat for achievement.
              d.eaten = 1;
              b.sac++;
            }
            // Increment how much of the ant was eaten and then decide whether to remove it entirely or just remove a body part.
            (d.eaten += 20) > 99 ? Rd(d) : d.eaten > 40 && d.rm[n](x(['rmlegs', 'rmhead', 'rmrear'][k](a => !d.rm[Y](a))));
          }
          else {
            d.sz -= .5;
            let b = l[d.k];
            if (!f(5)) {
              a.thot = b.sweet ? x(["Breadcrumb jackpot!", "Sugar high!", "Someone touched my crumb", "New crumb dropped!"]):
              x["Is this edible?", "Mmm… mystery flavor", "Meat sweats… achieved", "Smells dead - tastes worse"];
            }
          }
          !c.Q && Ya(a, {fd: j ? 60 : c.pref ? 10 : 3, md: c.pref ? 5 : 0, hp: 1});
          ha(i);
          a[$] = 0;
          if (!c.pref && !f(3)) {
            Mb(e, ["Some of your ants are complaining about the food.", "The food does not meet the needs of some ants."]);
            a.thot = x(["I can't find any food I like", "This isn't my kind of food!", "Ewww, gross food!"]);
          }
          (a.fd < 80 && !c.Q && a.q[g] < 2 && !f(1) ? O : A)(a); // Whether to go again or move on.
        }
        else {
          // Cancel.
          ha(i);
          a[$] = 0;
          A(a);
        }
      }, la + f(cb));
    }
    else {
      if (a.fd < 90 || c.Q) {
        // No target selected yet.
        let m = e[aa][k](a => a.t == Ua),
          h = ya[a.t],
          g = 1,
          n = (a, c, b = l[c.k]) => !a.d || a.d < 2 && b.sweet || a.d> 1 && b.meat,
          b = pe(m)[X](a => n(h, a)) || x(m);
        if (!b || !n(h, b)) {
          // Either there is no food, or the food is not in the ant's dietary requirements.
          let f = e.a[X](b => b[da] == yc && !a.rot && b.t != a.t); // Find dead enemy ants that are not rotten yet.
          if (h.d > 1 && a.fd < 50 && f) {
            b = x(f);
            a.thot = x(["I can survive on ant flesh", "I'm going to eat Bob", "I will devour my nemesis!"]);
          }
          else if (!b && a.fd < 50) {
            // No food available, and ant's food stat is dropping.
            a.thot = x(["Why is there no food?", "Someone is trying to starve us!", "Where is the lovely buffet?"]);
            Mb(e, ["There is no food available for your ants.", "Your ants need something to eat!"]);
            return A(a); // Nothing can be done about this.
          }
          else g = 0; // There is food, but not ideal.
        }
        if (b) {
          // Now calculate where to go.
          if (b.t == Ua || b[q].n == H) {
            nb(a, Jd, {
              n: H,
              id: b.id,
              t: b.t != Ua ? ni : b.t,
              pref: g,
              Q: c.Q,
              tx: b.t == Ua ? 25 + Va(b.x) + Cc(23) * f(b.sz) / 100 : b.x + Cc() * f(Sa(b)) //@TODO I think this is wrong, ant stands too far away from food, and drink uses offsetX but so does pace target matching :/
            });
          }
          else {
            let k = ob(b);
            if (k) {
              $c(a, {n: Eb, [p]: k[p].id, pc: k.pc, pos: qc});
              F(a, Jd, {id: b.id, t: ni, pref: g, Q: c.Q, tx: b.x + (k.pc < 20 ? 1 : k.pc> 80 ? -1 : Cc()) * f(Sa(b))});
            }
          }
          c.Q && F(a, zc, {...b, Q: c.Q, pref: g, id: b.id + a.id});
        }
      }
      A(a);
    }
  },

  // Ant drink action.
  [Ga]: (a, d = J(a), b = a.q[0], c = d[aa][X](a => a.t == Ga && a.sz > 0)) => {
    if (b.id && c) {
      // Ant has reached the target drink.
      h(e => {
        if (c = d[aa][X](a => a.id == b.id && a.sz > 0)) { // Got to recheck here incase the drink got removed.
          c.sz -= .2;
          !b.Q && Ya(a, {dr: 9, md: 2, hp: .5});
          (a.dr < 80 && !b.Q && a.q[g] < 2 && !f(1) ? O : A)(a); // Whether to go again or move on.
        }
        else A(a);
      }, la + f(la));
    }
    else {
      if ((a.dr < 90 || b.Q) && c) {
        nb(a, Ga, {n: H, id: c.id, Q: b.Q, tx: Va(c.x) + 2 + f(46)});
        b.Q && F(a, zc, {...c, Q: b.Q, id: c.id + a.id});
      }
      else if (a.dr < 50) {
        // No drink available, and ant's drink stat is dropping.
        a.thot = x(["There is nothing to drink here!", "Somebody bring me some water!", "Where is the drinking fountain?"]);
        Mb(d, ["There are no drinks in the farm for your ants.", "Your ants are going to get thirsty!"]);
      }
      A(a);
    }
  },

  // Ant picks up a bit of food or drink for the queen, or an infant or a dead ant, this assumes the ant is already in a location where they can do a pick-up.
  [zc]: (a, c = J(a.f), b = a.q[0]) => {
    b.f = a.f;
    a[_] = b;
    b.t == kd && Ca(Sd(c, b.id), p); // Remove tun prop for carried eggs.
    Tf(b, a);
    if (b.Q) {
      // Feed a queen.
      Xd(a, Vb(c, b.Q));
      nb(a, md, b);
    }
    else b.q[i](b => a.q[n](a, b)); // Must be an egg, inf, or dead ant.
    T(a); // Update ant immediately so they can visually 'grab' the object.
    a.run = .6;
    A(a, Hb);
  },

  // Ant goes on a mission to feed the queen.
  [md]: (a, d = J(a), c = a.q[0], b = Vb(d, c.Q)) => {
    if (c.Q) {
      // Q selected; confirm queen is alive.
      if (b && za(b)) {
        // Has ant really reached the queen?
        if (!Gc(a, b, Sa(a))) {
          // Ant too far from queen.
          Xd(a, b);
          nb(a, md, c);
          return A(a);
        }
        // @TODO Ant will now drop off their load near the queen - if this is not good enough create a function using getAntHeadPoint() and antToAntAngle() to get them closer.
        // Reached the queen.
        if (a[_]) {
          vb(b, {[C]: Oc, [Oc]: 2}); // Freeze the queen for a 2 count (~10 seconds).
          // Update stats based on what the queen is probably being given.
          let e = eb(d[aa], c.id);
          !e || e.t == Ua ? Ya(b, {fd: !e ? 60 : c.pref ? 10 : 3, md: c.pref ? 9 : 4, hp: 1}) : // !item suggests it was an ant corpse.
            Ya(b, {dr: 9, md: 4, hp: .5}); // The remaining possibility is that it is a drink.
          // Worker ant is happier.
          Ya(a, {md: 9});
        }
        // Animate the exchange.
        [b, a][i](a => {
          a[$] = 1;
          T(a);
          h(b => {a[$] = 0; T(a)}, Hb);
        });
      }
      // Pause here for a bit.
      Ch(a[_], a);
      Ca(a, _); // Delete this regardless of whether the queen was fed, otherwise ant could carry forever.
      A(a, Hb + f(W));
    }
    else {
      // No queen selected yet.
      if (!Xc(a)[D](a => [md, zc][Y](a)) && (b = x(d.a[k](a => Xa(a) && za(a))))) nb(a, b.fd < b.dr ? Jd : Ga, {Q: b.id}); // Go to the appropriate item.
      A(a);
    }
  },

  // Queen's special rest function - queen goes to her favourite spot first.  Also initiates egg-laying.
  kip: (a, b = J(a), c = [...new Set(b.a[k](a => a[Nc]).map(a => a[Nc]))]) => {
    // Try pick a nest if there's a suitable one and/or send to the nest.
    (a[Nc] ||= x(b[v][k](a => a.t == pa && a[u] == 100 && !a[K] && !a[Id] && a.co[g] < 2 && !c[Y](a.id)))?.id)
      && $c(a, Vd({[p]: a[Nc], pc: 20 + f(60), pos: qc}));
    F(a, Mc);
    // Queue egg laying if no eggs in the nest, and random chance passed with respect to various factors.
    !b.e[g] && !Bc(ja * ab.ceil(b.a[g] / 30) - (b[oa] == Se ? fc : 0) - (b.a[D](a => Tc(a) && za(a)) || b.a[g] < 9 ? R : 0)) && F(a, Pc);
    A(a);
  },

  // Queen lays eggs.
  [Pc]: (a, i = J(a), o = a.q[0], c = o[e] || 0, j = o.laid || 0, b = ob(a), q = i.e[k](a => a[e] == c && a[p] == b[p])[g],
    d = b?.[p], l = Wb(d, 5), m = {
      id: a.id + Ja(),
      Q: a.id,
      t: a.t,
      f: a.f,
      [Cb]: f(6) ? 'W' : 'D',
      ts: mb(),
      [p]: b?.[p],
      pc: b?.pc,
      r: f(S),
      hp: 99,
      [y]: Cc()
    }) => {
    if (b && d.t == pa && !d[K] && !d[Id] && a[I] == Db && Gc(a, He(d, b.pc), 2 * kc(a))) { // Layable tunnel and position.
      if (b.pc < 20 || b.pc> 80 || i.e[D](a => a[p] == d.id && a[e] == c && N(a.pc - b.pc) < l) // Check there is no egg occupying current space
        || (i.e[D](a => a[p] == d.id && a[e] == c) && !i.e[D](a => a[p] == d.id && a[e] == c && N(a.pc - b.pc) < l * 1.4)) // Check it is right next to an existing egg or there is no other egg
        || c && i.e[k](a => a[p] == d.id && a[e] == c - 1 && N(a.pc - b.pc) < l)[g] < 2) { // Check there are two supporting eggs to stack an egg on.
        // Can't lay here, walk a bit and try again.
        F(a, ia, {[p]: d.id, pc: b.pc + f(l) * (b.pc < 20 ? 1 : b.pc> 80 ? -1 : Cc()), pos: qc});
        f(R) && F(a, Pc, {laid: j, [e]: c}); // There's also a random small chance (about once every 4 hours) that she'll give up laying here altogether to avoid permanent deadlock.
      }
      else {
        while ((q > 6 - (c * 2) || f(4)) && q < 16 - (c * 2)) c++; // Go up a level when there are lots of eggs on the current level.
        m[e] = c;
        // Animate.
        a[I] = Kc;
        a.jit = 1;
        T(a);
        h(b => {
          a[I] = Db;
          a.jit = 0;
          T(a);
          // Lay an egg.
          i.e[n](m);
          Sf(m);
          Ya(a, {hp: -20, fd: 2, dr: 2, md: 2}); // Increase chance of queen being forced to sleep between eggs.  Queens self-feed during this time.
          (j < 8 || f(8)) && j < 26 && c < 4 && F(a, Pc, {laid: ++j, [e]: c}); // If eggs aren't stacked too high, loopback to laying.
        }, Hb);
      }
    }
    if (j < 10 && Ub(i) && !Xc(a)[Y](Pc) && f(2)) {
      // Queen did not lay eggs or not enough eggs, and the logic above did not queue up any more laying.  Take a high chance to remind her to pop a few more out, even elsewhere.
      nb(a, ia, {pos: qc});
      F(a, Pc, {laid: j});
    }
    A(a, W + f(la));
  },

  // Ant carries an egg, infant, or a dead ant to another location.
  [_]: (a, d = J(a), b = a.q[0], c = (b.t == kd ? Sd : Vb)(d, b.id), e = c && eb(d[Aa], c[ld])) => {
    if (c && Gc(Uf(a), c, Sa(a)) && !d.a[D](a => a[_] == b.id)) {
      if (b.t == yc) {
        Xd(a, c);
        F(a, zc, ca(b, {q: [{[C]: ia, [p]: d[v][X](a => a[Id])}, {...{b}, [C]: Qb}]})); // @TODO we might want to make sure it goes to the far end of the tunnel!
      }
      else if (c[ld]) {
        e ? F(a, zc, ca(b, {q: [{[C]: K, [K]: e[K]}, {...{b}, [C]: Qb}]})) : Ca(c, ld); // Pass in a nip action or remove stale flag.
      }
      else {
        nb(a, ia, {[p]: c.id, pc: c.pc, pos: qc});
        F(a, zc, ca(b, {q: [{[C]: ia, [p]: eb(d.a, c.Q)[Nc]}, {...{b}, [C]: Qb}]}));
      }
    }
    A(a);
  },

  // Drop a carried item.  Carefully though.
  [Qb]: (b, c = J(b), d = b.q[0], i = d.t == kd, f = (i ? Sd : Vb)(c, d.id), h = ob(b), a = h?.[p]) => {
    if (a) {
      if (i) T(ca(f, {[p]: a.id, pc: d.pc, ...He(a, d.pc)}));
      else {
        let j = Wb(a, 5),
          m = (d = 0, f, h, i, b) => {
            for (; d < 4; d++) {
              f = c.e[k](b => b[p] == a.id && b[e] === d)[yb]((a, b) => a.pc - b.pc);
              for (h of f) {
                for (i of [-j, j]) {
                  b = h.pc + i;
                  if (b > 20 && b < 80 && !c.e[D](c => c[p] == a.id && N(b - c.pc) < j) &&
                    (!d || c.e[k](b => b[p] == a.id && b[e] === d - 1)[k](a => N(b - a.pc) < j)[g]> 1) &&
                    (!f[g] || f[D](a => N(b - a.pc) < j))) return {b, d};
                }
              }
            }
          },
          // spotFinder() is different from how the queen picks a spot to lay, as she uses a slow trial-and-error approach, whereas spotFinder() works out a good spot to drop.
          l = m();
          if (l) {
            // Found a spot.
            if (N(h.pc - l)> Wb(a, Sa(b))) {
              // Too far away!
              F(b, ia, {[p]: a.id, pc: l.pc, pos: qc});
              F(b, Qb, d);
              return A(b);
            }
            else Rf(c, ca(f, {[p]: a.id, pc: l.pc, [e]: l[e]}));
          }
          else {
            // No spots.  Egg will be dropped here anyway, but we'll tell the queen her nest sucks.  This may cause ants to keep moving nest, fun!
            Vb(c, f.Q)[Nc] = 0;
            Rf(c, ca(f, {[p]: a.id, pc: h.pc, [e]: 0}));
          }
      }
    }
    // Note: If it's not in a tun I suppose they'll just leave it where it is.  Add more code here if that looks silly!
    Ch(b[_]);
    Ca(f, ld);
    Ca(b, _, 'run');
    A(b);
  },

  // Ant goes on a mission to care for an egg or infant.
  care: (a, c = J(a), d = a.q[0], e = d.t == kd, b = (e ? Sd : Vb)(c, d.id)) => {
    if (b && Gc(Uf(a), b, Sa(a))) {
      // At the target.
      e ? b.hp += 2 : Ya(b, {hp: 2, fd: 2, dr: 2, md: 2});
      a[$] = 1;
      T(a);
      h(b => a[$] = 0 || T(a), W);
      return A(a, W + f(W));
    }
    else if (a.q[g] < 2) cg(c, a); // Try again if ant has nothing to do.
    A(a);
  },

  // Ant nips off to a nip.
  [K]: (a, d = J(a), j = a.q[0], h = j.id, l = j[K], o = h || l, b = h ? na(d, j[p]) : d[v][X](a => a[K] == l),
    q = d[Aa][X](a => a[K] == o), g = q?.[Na], m = o > 2, e = o % 2 > 0, n = Ee(a), r = j.rev, s = Sb(d)) => {
    if (g && r) {
      // Entering farm from a nip area.
      if (e ? n < 20 : n> 940) {
        a[fa] = 1;
        if (a[_]) {
          T(a); // Correct x/y pos of carried items.
          // Walk to a random spot and drop.
          F(a, m ? xc : ia, {for: f(R)});
          F(a, Qb, a[_]);
        }
        if (m) {
          a[y] = va(e);
          Xf(a); // Top area.
        }
        else {
          // Tunnel
          lc(a, b);
          // This actually calculates a tunPoint 20px from the end.
          let c = e ? {x: b.x1, y: b.y1} : {x: b.x2, y: b.y2},
            f = Rb(b.x1, b.y1, b.x2, b.y2),
            i = va(e) * 20;
          a.r = rd(a, {x: c.x + f.x * i, y: c.y + f.y * i});
          Ud(a);
        }
        O(a);
      }
      else {
        // All done.
        a[fa] = 0;
        A(a);
      }
    }
    else if (g && h && !g.a[D](b => b.t != a.t)) {
      // Exiting farm into a nip area.
      if (e ? n > -25 : n < 985) {
        a[fa] = 1;
        if (m) Xf(a); // Top area.
        else {
          // Tunnel
          lc(a, b); // It's a copout, but I'm not going through the whole waypoint saga here.
          a.r = rd(a, e ? {x: b.x1, y: b.y1} : {x: b.x2, y: b.y2}); // Ant hasn't reached the tunPoint yet, so force the angle.
          Ud(a);
        }
        O(a);
      }
      else {
        // Done! Move ant into "nip item space".
        let f = c(Bd + Nb[h]);
        De(d, hd, a, d, g, {x: -25, y: 28 - kc(a), [da]: g.k, f: d.id, q: []}, f);
        Je(d);
        if (Xa(a)) {Ca(a, Nc); [...d.e[k](b => b.Q == a.id), ...d.a[k](b => b.Q == a.id)][i](a => a[ld] = h)};
        xa();
        g.k == rc ? Lh(a) || Mh() : Oh(d, q, a) || Ph();
      }
    }
    else {
      // Setup.
      if (g && l) {
        if (!a[_] || ![Ua, Ga, 'ant'][Y](Zi(d, a[_]).t)) {
          m ? $c(a, {n: H}) : $c(a, {n: Eb, [p]: b.id, pc: 100 * !e + va(e) * Wb(b, 25 - f(20))});
          F(a, K, {id: l, [p]: b?.id, tx: e ? 1 : 959}); // note: tx and tun are only used in their own respective areas.
        }
      }
      else if (a[_]) F(a, Qb, a[_]); // Ant was carrying something to a nip, but it is not there.
      A(a);
    }
  },

  // Freeze an ant for x-number of 5 second periods.
  [Oc]: (a, b = a.q[0]) => {
    a[fa] = a[$] = a.jit = 0;
    b[Oc] ||= 1;
    if (!--b[Oc]) {
      Ca(a, Oc);
      A(a, W);
    }
    else O(a, W);
  },

  // Dying is an ant action that goes for several hours while the corpse remains in the farm.
  // @TODO ant should become more "hazardous" the more it rots - depletes ants hp when within proximity.
  die: (a, b = J(a), c = a.q[0], d = na(b, a[q].t)) => {




    if (a[q].n == jb) vb(a, {[C]: 'slip'}) && A(a); // Ant is on the bg, let's have it drop off first.  Can't use antSlip() here because it will forget to die.
    else if (a[q].t && a[I] == Pa && !a.slip) vb(a, {[C]: 'tunSlip', mark: 1}) && A(a);
    else {
      if (a[da] != yc) bg(a, a.q[0].r);
      else {
        // Decompose loop
        let e = Ja() - a[wc], f = 7200000;
        if (e > f) {// Wait time before corpse gets nasty.
          if (e < f * 3) a.rot++; // Slightly make the ant more fuzzy (1%).
          else if (e < f * 4) a.decay++; // Shrink the ant 2% at a time.
          else return Rd(a); // Totally rotted - undraw the ant and delete the ant from the array.
        }
      }
      a.q = [a.q[0]]; // Remove remainder of queue.
      O(a, 144000); // 2.4 minutes
    }
  },

  // Fight is not a real ant action but works in a similar way.  Each ant is
  // "ant" in it's own loop, and it is the "ant2" for one or more other ants.
  [Ba]: (a, c = J(a), b = Vb(c, a.q[0].ant), d = !b || b[da] == yc || a[q].n != b[q].n || !Gc(a, b, 64) || c[Ob]) => {
    // ant2's ID is an arg in the finna queue.
    if (a[I] == Db) a[q].n == Eb ? lc(a, tun) : (a[I] = Pa); // Fight in prone pose?
    // Weak ant might slip off the bg if the fight is there.
    if (a.hp < 10 && a[q].n == jb && !f(3)) {
      // Quit fighting for now.
      a[Ba] = a.jit = a[$] = 0;
      Ie(a);
    }
    else if (d) {
      // Cancel fight.
      a[Ba] = a.jit = a[$] = 0;
      A(a);
    }
    else if (a.hp <= 0) {
      a.wig = 1;
      F(a, 'die', {r: Ba});
      h(b => {a[Ba] = a.wig = 0; A(a)}, la);
    }
    else {
      a[Ba] = 1;
      // Ant strength is determined by a combo of factors.

      // Decrease foe ant's hp by the strength.
      b.hp -= Ib(a.hp / 100, 0.5, 0.8) // Base strength is health, but doesn't drop below 50 or go above 80 to keep it fairer.
        * (Vc(a) == sb ? .8 : (Vc(a) == 'l' ? 1.2 : 1))  // Adjust strength by size.
        * (a.b ? 1.3 : 1) // Biters have extra oomph.
        * ya[a.t].v // Adjust strength by speed.
        * (Tc(a) ? 3 : Xa(a) ? 5 : 1) // Drones and Queens fair much better.
        + Qa(1 / a.md, .2); // Low mood can add slightly to aggression.


      // Ants may circle each other on the background.
      if (!f(6) && a[q].n == jb) {
        let i = Nf(a),
          f = Ge(a, b);
        if (!i && !a[oi]) {
          a[fa] = b[fa] = b[oi] = 1;
          let j = qd(va(f < S) * 15),
            k = Ha(c => {a.r = ka(a.r + j); T(a); b.r = ka(b.r + j); T(b)}, Ia);
          h(c => {ha(k); a[fa] = b[fa] = 0; b[oi] = 0}, W);
        }
        // Turn towards foe.
        h(b => {a.r = ka(a.r + va(f > S) * (f > 15 ? 15 : f)); T(a)}, W + Ia);
      }

      let g = wa(a.x, a.y, b.x, b.y);
      let e = Ee(a);
      if (g < 5) {
        // Step backwards by 2.
        // @TODO will depend on whether they're top or bot side, and whether there is room behind them.
        // @TODO need a function to determine how much room is behind an ant.
        // Don't forget to use crawl class.
        let f = 0;
        if (a[q].n == H) f = a[y] ? e - 10 : 950 - e;
        else if (a[q].n == Eb) {
          //???????
          // @TODO not handled properly, if they're 10+ away from any tun x1/y1 or x2/y2 coordinate, there is 2 space??
          // Do fights take place on a single plane here???  What pose are the ants in ?
          f = 0
        }
        else if (a[q].n == jb && e> 10 && e < 950 && antY> -195 && antY < 12) {
          f = 2;
        }
      }
      if (g> 10) {
        // Step forwards by 2.
        // @TODO will depend on whether they're top or bot side,
      }

      // @TODO ants should still frequently move backwards and forwards to simulate attacking.

      // @TODO - the ants should move slightly towards the attacked/weaker ant if there's room so they're not in the same spot the whole time.
      // This may mean a nearby ant that is also in the fight may be further away, it will need to move towards the foe on it's turn as well.
      // If it's too far from the foe, it should revert back to pacing/burrowing but towards the foe, instead of attacking.

      // Wait 10-15 seconds for another blow, this randomness makes the fight less predictable.
      O(a, W + f(W * 2));
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
$c = (b, a) => nb(b, a.n == jb ? jd : a.n == H ? xc : ia, a),

// Requests an ant to walk to where another ant was at the time of the request.  Nothing is guaranteed.
// Should silently fail when 'ant' is missing.
Xd = (c, b, a = {n: b[q].n}) => {
  if (a.n == jb) {
    a.x = b.x;
    a.y = b.y;
  }
  if (a[p] = b[q].t) a.pc = ob(b)?.pc; // Note: assignment in condition on purpose.
  $c(c, a);
  a.n == H && F(c, xc, {tx: b.x});
},

// Rates the current farm as to whether it is styling.
// Returns 0 on fail, and a positive integer with the score on pass.  Never demand players to score more than a 2 to get full benefits.
Ke = a => Qa(0, a[aa][k](a => a.t == qb)[g] + a[be][g] / 2 + (a[V] ? .5 : 0) - 1),

// Applies ant stat adjustments.
Ya = (a, b) => ma(b)[i](c => a[c] = Ib(a[c] + b[c], 0, 100)),

// Attempts to restore some ant stats based on the substrate fill.
oj = (a, b = {
  'gel': {fd: .011, dr: .021},
  'beer': {fd: .005, dr: .01, hp: -.005, md: .03},
  'ooze': {fd: .005, dr: .01, hp: .3, md: -.02},
  'product': {fd: .011, dr: .021, hp: .01, md: .01},
  [Se]: {fd: .01, dr: .02},
  'slime': {fd: .011, dr: .021, hp: .011}
}) => Ya(a, b[J(a)[oa]] || {}),

// Determines if the current farm has any queens.
Yd = a => a.a[D](a => Xa(a) && za(a)),

// Determines if an egg or infant can upgrade to the next phase.
Qh = (a, b = 1) => a[p] && a.hp > 90 && !f(mb() - a.ts > 8640 * (1 + b) ? 50 : R) && mb() - a.ts > 8640 * b,

// Directs farms by running checks every 30 seconds.
// Adds deliberate tasks to the ants' finna queues so the action loops aren't responsible for checking everything.
// Also updates ants stats, autosaves, updates food & drink display, checks achievements, updates ant thoughts.
dg = a => {
  b[P][i](a => {
    h(c => a.a[k](za)[i](c => {
      h(b => { // Perform a chunk of this without overloading the main thread with heaps of these at once.
        // Decrement stats.
        Ya(c, {fd: -.05, dr: -.1, md: -.05, hp: -.1});
        !c[q].t && Ya(c, {md: Ke(a) / 20}); // Boost mood stat based on presence of scenery (when not in tunnels).
        // Decrement hp stats based on other stats.
        Ya(c, c.fd <= 0 || c.dr <= 0 ? {hp: -1, md: -.5} : c.fd < 10 || c.dr < 10 ? {hp: -.05, md: -.05} : {hp: c.md < 10 ? -.05 : -.01});
        c.hp <= 0 && F(c, 'die', {r: c.fd <= 0 ? sg : c.dr <= 0 ? tg : c.q[0][C] == Ba ? Ba : Gd});
        // Ant tries to nourish from fill material if they are in a tunnel.
        c[q].t && oj(c);
        // Cap ant's mood at the maximum its ant type can have.
        c.md = ba(c.md, ya[c.t].m || 100);
        // In a fight, random chance to pick another random ant to help out, available workers will always help, other types of ant are less likely to join.
        c[da] == Ba && !f(2) && Xd(x(a.a[k](a => za(a) && a[da] != Ba && (Kb(a) || !f(4)))), c);
        if (c.q[g] < 9) {
          // Curb major problems.
          if (c.dr < 10) nb(c, Ga);
          else if (c.fd < 10) nb(c, Jd);
          else if (c.hp < 10) F(c, Mc);
          else if (Xc(c).every(a => [jd, xc, ia, xg, yg, ie][Y](a))) {
            // Ant is "defaulting"; give them something better to do.
            if (Kb(c) && !f(3) && !Ub(a) && Yd(a) && a.a[k](a => a.digD)[g] < 3) nb(c, $); // Curb slack workers problem.
            else if (!f(5)) aj(c, 1); // Randomly pick a non-default action.
            else if (!f(5)) nb(c, ia); // Increase chance of ants diving.
            else if (!f(9)) nb(c, jd); // Increase chance of ants crawling.
            // Hints for player.
            c.md < 25 && !Yd(a) && Mb(a, ['Comrade, the workers are restless. They have no queen.', 'The absence of a queen is going to become a problem.']);
            c.md < 20 && !Ke(a) && Mb(a, ['Some of your ants are complaining about the lack of scenery and decor.', "This farm doesn't have flair, the ants would like some decorations."]);
            // Randomly go to vial.
            let d = x(a[Aa]);
            if (d && !a.foe && !f((a.dun ? 90 : Ub(a) ? 120 : S) - (a[aa][D](a => a.t == Ua && a.sz > 0) ? 0 : 30) - (a[aa][D](a => a.t == Ga && a.sz > 0) ? 0 : 40))
              && !a.a[D](a => Xc(a)[Y](K)) && F(c, K, {[K]: d[K]}));
          }
        }

      }, 1);
      h(e => { // Delay a chunk so the director function doesn't intefere with the displayed farm too much.
        if (c[Ea] && Qh(c, c[Ea])) {
          // Infant upgrader.
          let a = Fc(c)[d], g = ['a1', 'a2', 'a3'];
          if (++c[Ea] > 4) {
            Ca(c, Ea, ld);
            c[da] = Pb;
            !f(9) && (c[y] *= -1);
            a[o](...g);
            O(c);
            Tc(c) && b.man++;
          }
          else a[x([m, o])](x(g));
          T(c);
        }
        else if (Xa(c)) {
          // Extra handling for Queens.
          if (!Ub(a) && !a.a[k](a => Kb(a))[g] && c.q[g] < 2 && f(3) < 1) F(c, $); // A queen without workers may dig a nest to start a colony.
          else if (c.fd < 90 || c.dr < 90) F(x(a.a[k](a => Kb(a) && a.q[g] < 9 && !Xc(c)[Y](md))), md, {[zc]: c.fd < c.dr ? 'fd' : 'dr'}); // Reduces the possibility of a queen having to eat or drink by herself.
          else if (c.hp < 95 && c.q[g] < 2 || c.hp < 80) F(c, 'kip');
          // Being a queen takes an extra toll.
          Ya(c, {fd: -.05, dr: -.1, hp: -.02, md: -.05});
          // Queen's presence boosts moodiest ant's MD.
          let b = a.a[k](a => a[Cb] != 'Q')[pc]((a, b) => b.md < a.md ? b : a, 0);
          if (b) b.md += .3;
          f(2) && a.a[k](a => Kb(a))[g] < 3 && cg(a, c); // Farm with not enough workers?  Queen maybe performs an extra care task per cycle.
        }
        else if (Tc(c)) {
          // Being a drone takes an extra toll.
          Ya(c, {fd: -.02, dr: -.02, hp: -.02, md: -.02});
          // Cap drone's HP lower and lower over time, making it harder to stay alive.
          c.maxhp = c.maxhp ? Ib(c.maxhp - .01, 1, 99) : 99;
          c.hp = ba(c.hp, c.maxhp);
        }
      }, R);
      // Update the ant's thoughts, but limit it to changing every 10th loop (~5 minutes) so as not to override thoughts, particularly those set within other functions, too soon.
      c.thotD> 9 ? (c.thot = rh(c)) : c.thotD++;
    }, 0));
    h(b => { // Delay these extra bits to not perform everything all at the same time.
      Th(a);
      a.e[i](b => {
        // Decrease egg stats.
        b.hp -= .3;
        if (b.hp <= 0) Qf(b); // Remove dead egg.
        else if (Qh(b)) {
          // Egg can upgrade.
          let c = He(na(tun), b.pc), d = ca(Df(a, c.x, c.y, b.r, Ea, b[Cb], b.t), {
            Q: b.Q, // Mark the infant's mother.
            [y]: Cc(),
            f: a.id,
            ts: mb(),
            thot: x(["🧩🔒⏳", "🙂💡🚫", "🐢✨🚗", "🎎💁🍛"]),
            thotD: 1,
            [Ea]: 1,
          });
          Qf(b);
          Sb(a) && Wc(d);
        }
      });
      // Look for dead ants or eggs and see if any need to be carried somewhere.
      if (a.a[D](a => a[da] == yc) || a.e[g]) lj(a);
      // Look for infants and eggs and see which one needs to be cared for next.
      if (a.a[D](a => a[Ea]) || a.e[g]) cg(a);
    }, ua);
  });
  xa();
  Rh(1); // Check if game is almost in a winning state.
},

// Checks if an achievement has been reached.
// Note: Some achievements only check the currently focused farm, that's fine it makes more sense that way.
Rh = (h, d = 0,
    // Define three-level achievement funtions, these return the current count of whatever we're counting.
    e = {
      blood: b => Qa(...Lg(a.a[k](za)[pc]((a, b) => (a[b.t] = (a[b.t] || 0) + 1, a), {}))),
      sac: a => b.sac,
      scene: a => ma(b.scene)[g],
      arty: a => b.arty,
      man: a => b.man,
    },
    // Define one-level achievement functions, these return true or false if the condition is currently met or not.
    f = {
      fac: a => b[P][k](Ub)[g] > 3,
      tri: a => new Set(b[P][k](Bf).map(a => a[oa])).size > 2,
      sweep: b => a.sweep,
      kweens: b => a.a[k](b => Xa(b) && za(b) && (b.t == a.t || a[Ob]))[g] > 1,
      progeny: b => Ub(a) && !a[Xb][Pb],
      [$e]: a => b.dq,
      hb: b => a[Xb][wc][Gd] > 9,
      day: b => (mb() - a.ts) > 86400,
      weak: b => (mb() - a.ts) > 604800,
      [cd]: a => b.win,
    },
    c
  ) => {
  if (h) {
    // Checks if game is almost in a winning state.
    for (c in e) if (!b.ach[c] || b.ach[c].l != 3) d++;
    for (c in f) if (!b.ach[c]) d++;
    if (d === 1) td(cd);
    else if (!d && !b.dmb) La('win');
  }
  else {
    for (c in e)
      if (!b.ach[c] || b.ach[c].l < 3) {
        b.ach[c] = b.ach[c] || {l: 0, v: 0};
        let a = ba(9, e[c]()), g = ba(3, hc(a / 3));
        if (a> b.ach[c].v) {
          b.ach[c].v = a;
          if (g > b.ach[c].l) {
            b.ach[c].l = g;
            Sh(c);
          }
        }
      }
    for (c in f)
      if (!b.ach[c] && f[c]()) {
        b.ach[c] = 1;
         Sh(c);
      }
  }
  // Display first pending achievement.
  b.achQ && La('ach', 0, W);
},

// Queues an achievement.
Sh = (d, c = b.ach[d].l || 0, a = {a: d, l: c, b: !c || c == 3 ? 20 : 10}) => {
  !b.achQ[D](b => b.a == a.a && b.l === a.l && b.b == a.b) && b.achQ[n](a);
  xa();
},

// Updates the display of food and drinks so they reflect the current size.
Th = a => {
  // Food items have to be regularly updated to reflect being eaten and hill heights, as well as being deleted when exhausted.
  a[aa] = a[aa][k](b => (b.t != Ua) || (b.sz > 0 ? (Sb(a) && (c(b.id)[B] = vf(b)), 1) : (c(b.id)?.[o](), 0)));
  // Update drink height.  This only affects the currently displayed farm.
  let b = a[aa][X](a => a.t == Ga);
  if (Sb(a) && b) ga(`#${b.id} .drink > *`)[r][yd] = ba(46, b.sz / 2) + Fa;
},

// Checks if an ant is an expat queen for the sake of the "Dragged Queen" achievement.
eg = (a, c) => {Xa(a) && a.f != c.id && (b.dq = 1)},

// Checks and... displays messages.
fg = a => {
  if (Md[g]) {
    ke = 1;
    let b = Md[Ic](), e = c(pi);
    e[B] += `<div data-ts=${Ja()} class="msg ${b.t}"><p>${b.msg}</p></div>`;
    e.lastChild[d][m](z);
    b.t != 'bonus' && me[n](b);
    me[g] > 10 && me[Ic]();
    h(fg, 4000);
  }
  else ke = 0;
  gf ||= Ha(qj, ua);
},

// Removes the oldest message.
pj = (a = c(pi)) => {
  a[Ne][d][m]('rm');
  h(b => {a[Ne] && a.removeChild(a[Ne]); !ke && fg()}, R);
  if (!Md[g]) gf = ha(gf);
},

// Keeps the messages scrolling.
qj = (a = c(pi)[Ne]) => a && Ja() - Va(a[ra].ts) > 12000 && pj(),

// Adds a message to the array.
xb = (a, b = 'status') => !of && Md[n]({msg: a, t: b}) && !ke && fg(),

// Displays random messages, with message flood protection.
Ta = (b, c = 0, d = 0, a) => {
  if (Md[g] || !ta.hasFocus())
    // There are already messages waiting in the queue, or the player is not watching, wait a bit and try again.
    // Except if it's a joke, just give that a miss.
    !of && !c && h(a => Ta(b), ua);
  else if (b)
    // Make 3 attempts to choose a unique message.
    for (; d++ < 3;) {
      a = x(b);
      // Check if the message is not in the last chosen messages.
      if (!ne[Y](a[Ab](';'))) {
        // Call msg() with the random message
        for (let [,e] of a.entries()) xb(e);
        // Add the message to the last chosen messages array.
        ne[n](a[Ab](';'));
        // Keep the last chosen messages array limited to 10 elements.
        ne[g]> 10 && ne[Ic]();
        // Break as a message has been successfully chosen.
        break;
      }
    }
    // No unique message found after 3 attempts - do nothing further.
},

// Randomly shows a joke message.
Uh = (a = Dc(b[P][k](Bf))) => {// @todo this needs to be tested (whether joke type gets changed based on number of farms).
  Ta(Bj[a < 5 ? Qa(0, a) : 0], 1);
  !of && h(Uh, f(cb) + cb);
},

// Outputs a warning msg, but only if one from the same set hasn't been shown recently, and only if it's for the current farm.
Mb = (b, c) => {
  while (Nd[0] && Nd[0][1] < Ja() - cb) Nd[Ic]();
  if (!Nd[D](a => a[0] == c[Ab](';'))) {
    if (Sb(b)) {
      xb(x(c), Zb);
      Nd[n]([c[Ab](';'), Ja()]);
    }
    else {
      Mb(a, [`"${b.n}" (${Ae(b)}) needs attention!`]);
      h(a => Mb(b, c), W);
    }
  }
},

// Handles the common audio playing functionality between ambience and ambienceOverride.
Vh = (d, e, f, a = c('audio')) => {
  ha(kf);
  a[he] = 0;
  c('audioSrc').src = `audio/${d}.opus`;
  a.load();
  a.play();
  kf = Ha(c => {a[he] < b.vol / 100 ? a[he] = ba(a[he] + e, 1) : ha(kf)}, f);
  return a;
},

// Starts playing bg audio.  This is a click-event handler, because browsers don't like playing audio without user interaction first.
Le = a => {
  Gg = 1;
  Vh(b.au || 'wind', .01, R);
  ta[qa](G, Le);
},

// Override the bg audio.  This code assumes it is being run in response to user interaction and does not check that.
// Calling code is responsible for resuming normal ambience() when done with this.
rj = a => Vh(a, 5, 3),

// Plays a sound effect.
pb = (a, c = 1) => {
  if (Gg) {
    let d = new Audio(`audio/${a}.opus`);
    d[he] = ba(1, (b.vol / 100) * c);
    d.play();
  }
}; // <--- Note the semi-colon here: end of main 'let' statement.


//
// Global utilities & function library (referenced dynamically).
//

// Restarts game.
// Note: Short name because it is a global function expression that must not have a name mangled by terser.
Q = a => {ri.removeItem('_'); location.reload()};


///////////////////
// Load the app. //
///////////////////
Gb[s]('load', xi);

///////////////////
// Fix ants pos. //
///////////////////
Gb[s]('focus', b => {
  a.a[i](T);
  a[Aa][i](a => a[Na].a[i](T));
});

/*
 * Ant Farm Social
 * afsData.js (Configuration and content)
 *
 * This file contains or generates data structures containing configuration and content that would be obtrusive in the main file.
 *
 */

let ya = {  // Note: Don't use keys "D", "Q", or "W" for these - they are reserved CSS identifiers for drone/queen/worker!
  N: {
    n: 'Black',
    v: 1, // speed
    s: Oa, // size
    d: 2, // 2 = meat/protein preference.
    t: "A common basic ant that could not be more plain if it tried, which it won't."
  },
  T: {
    n: 'Tiny',
    v: .8, // speed
    s: sb, // size
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
    s: Oa, // size
    d: 1, // 1 = sugar/carb/sweet eater.
    m: 75, // maxmood
    t: "This type of ant gets really mad if you pick it up and throw it at someone's neck."
  },
  F: {
    n: 'Fire',
    v: .9, // speed
    b: 1, // This ant bites.
    s: sb, // size
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
    s: sb, // size
    d: 2, // 2 = meat/protein preference.
    p: 1, // pro-level (don't autospawn)
    t: "The spookiest of all the ants, these tiny critters are quite the spectre-cle."
  },
  P: {
    n: 'Pharaoh',
    v: .7, // speed
    b: 1, // This ant bites.
    s: Oa, // size
    d: 2, // 2 = meat/protein preference.
    p: 1, // pro-level (don't autospawn)
    t: "This type of ant will completely rely on a poor man to do everything for them."
  },
  M: {
    n: 'Chimera',
    v: .6, // speed
    s: sb, // size
    d: 0, // 0 - no food preference
    p: 1, // pro-level (don't autospawn)
    t: "This impossibly blue critter is slow, can adapt to different diets, and is illusory."
  },
  Z: {
    n: 'Sugar',
    v: .6, // speed
    s: Oa, // size
    d: 1, // 1 = sugar/carb/sweet eater.
    p: 1, // pro-level (don't autospawn)
    t: "An ant that has so much diabetes it can barely walk and always feels tingly."
  },
  K: {
    n: 'Carpenter',
    v: .6, // speed
    s: Oa, // size
    d: 1, // 1 = sugar/carb/sweet eater.
    p: 1, // pro-level (don't autospawn)
    t: "Fantastic at construction, but always slowed down from lugging a tool belt."
  },
  H: {
    n: 'Red Harvester',
    v: .7, // speed
    b: 1, // This ant bites.
    s: Oa, // size
    d: 1, // 1 = sugar/carb/sweet eater.
    p: 1, // pro-level (don't autospawn)
    t: "This type of ant reaps the benefits of the strange places it just fell into."
  },
},

Me = {Q: 'Queen', D: 'Drone', W: 'Worker'},

l = {

  // BASIC ITEMS
  dirt: {
    n: 'Dirt Bucket',
    [j]: "When you need to collect, bring a bucket!<br>For no reason in particular this one is full of dirt.",
    [e]: 0, // Default level.
    t: ac,
    max: 1,
    keep: 1,
    [Z]: [
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
    [j]: "You buy it.<br>You deal with it.",
    [e]: 0,
    max: 1,
    t: ng,
    keep: 1,
    [Z]: [
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
    [j]: "Want to know what your ants are up to?<br>Take a closer look.",
    [e]: 2,
    max: 1,
    keep: 1
  },
  [ge]: {
    n: 'Carousel',
    [j]: "Cycle through your farms automatically.<br>Like a screen saver but with ants.",
    [e]: 80,
    max: 1,
    keep: 1
  },

  // ANT MAINTENANCE ITEMS
  cola: {
    n: 'Cola',
    [j]: "You're like 99% parched here.<br>You could really use a cola.",
    [e]: 0,
    max: 1,
    t: og,
    dr: 10,
    fd: 2,
    health: 1,
    sweet: 1,
    keep: 1,
    [Z]: [
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
    [j]: "With artisan hands, it is crafted with care.<br>Each crumb a masterpiece, beyond compare.",
    [e]: 2,
    t: ce,
    fd: 10,
    max: 1,
    keep: 1,
    [Z]: [
      ['A culinary delight, Artesano bread, a heavenly sight.'],
      ['Texture divine, a tender embrace, symphony of flavor, a delicate grace.'],
      ['Crust golden-brown, a whispering crunch. Gateway to taste, a lovely munch.'],
      ['Savor each bite with gratitude and glee for artesano bread is so right for me.'],
    ]
  },
  danish: {
    n: 'Cheese Danish',
    [j]: "Nothing compares to a cheese danish.<br>This one has been stepped on though.",
    [e]: 5,
    t: ce,
    fd: 12,
    sweet: 1,
    max: 1,
    keep: 1,
    [Z]: [
      ['Let them eat crumbs!'],
      ["Happiness is a warm Cheese Danish."],
      ['Sweet cheese wrapped in dough,', 'A burst of warmth in each bite,', 'Mornings taste so right.'],
    ]
  },
  saltpork: {
    n: 'Salt Pork!',
    [j]: "I want some Salt Pork!<br>I need halp!!!",
    [e]: 5,
    t: ce,
    fd: 12,
    meat: 1,
    max: 1,
    keep: 1,
    [Z]: [
      ['You could have just used bacon.'],
      ['I never eat a pig, cos a pig is a cop.'],
      ['Get some pork on your fork.'],
    ]
  },
  asti: {
    n: 'Asti Spumante',
    [j]: "When you've got good taste it shows.<br>The celebration grows!",
    [e]: 5,
    max: 1,
    t: og,
    dr: 12,
    fd: 0,
    //md: -3,
    health: -1,
    keep: 1,
    [Z]: [
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
    [j]: "That's the only way I cook my wieners.<br>(An ALDI in-house brand)",
    [e]: 8,
    t: ce,
    fd: 12,
    meat: 1,
    max: 1,
    keep: 1,
    [Z]: [
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
    [j]: "Smother yourself with it and the ants come marching in.<br>This is actually a real product.",
    max: 3,
    t: 'pheremone',
    [e]: 12,
    [Z]: [
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
  [gi]: {
    n: 'Anty Venom',
    [j]: "A challenging tonic from a mystical northern land.<br>Not sure how to pronounce the brand, but it relieves pain, and definitely exists for a reason.",
    max: 6,
    [e]: 40,
    [Z]: [
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
  [Ve]: {
    n: 'Cloning Kit',
    [j]: "Clones one of your worker ants three times.<br> ",
    [e]: 25,
    max: 1,
    t: Uj,
    [Z]: [
      ["The best way to predict the future is to create it."],
      ['We have not only the ability, but', 'the responsibility to guide our own evolution.'],
      ['Cloning is the sincerest form of flattery.'],
      ["You were so preoccupied with whether or not you could,", "you didn't stop to think if you should."],
      ["Genetic power is the most awesome force the planet's ever seen,", "but you wield it like a kid who's found his dad's gun."],
    ]
  },
  [We]: {
    n: 'Speedo',
    [j]: "Warp time with this radio controller to speed up your farm.<br>(burns out after a few minutes)",
    [e]: 45,
    max: 1,
    t: Uj,
    [Z]: [
      ['Engage!'], ['Punch it!'], ["Let's light this candle!"], ['Taking the leap!'], ['Warp factor 9 now!'], ['Full burn'], ['Max thrust!'], ['Jumping ahead now!'],
    ]
  },

  // HATS
  spadoni: {
    n: 'Spa Doné Hat',
    [j]: "I don't think that's the right spelling.<br>But you can call it whatever you like.",
    t: sa,
    [e]: 30,
    max: 1
  },
  spy: {
    n: 'Spy Hat',
    [j]: "Sometimes ants need to go undercover.<br>And they usually use an alias.",
    t: sa,
    [e]: 40,
    max: 1
  },
  gangster: {
    n: 'Gangster Hat',
    [j]: "Johnny Salami and Tony the Baker got ones just like it.<br>Those aren't even their real names.",
    t: sa,
    [e]: 40,
    max: 1
  },
  gangster: {
    n: 'Jazz Hat',
    [j]: 'What do you call someone wearing a "Make Jazz Great Again" hat?<br>A Trumpet Supporter.',
    t: sa,
    [e]: 40,
    max: 1
  },
  landry: {
    n: 'Tom Landry Hat',
    [j]: "It's officially known as the Tom Landry hat.<br>But you can call it a Cowboy hat for all I care.",
    t: sa,
    [e]: 40,
    max: 1
  },
  rhi: {
    n: 'Rhianna Hat',
    [j]: "Ooh na na, what's my name?<br>Ooh na na, what's my name?",
    t: sa,
    [e]: 60,
    max: 1
  },
  bogart: {
    n: 'Humphrey Bogart Hat',
    [j]: "Of all the ant farms in all the towns in all the world…<br>She walks into mine.",
    t: sa,
    [e]: 60,
    max: 1
  },
  jt: {
    n: 'Justin Timberlake Hat',
    [j]: "What did you expect?<br>A Suit & Tie?",
    t: sa,
    [e]: 60,
    max: 1
  },
  sinatra: {
    n: 'Frank Sinatra Hat',
    [j]: "Something stupid:<br>The way you look tonight.",
    t: sa,
    [e]: 60,
    max: 1
  },
  cohen: {
    n: 'Leonard Cohen Hat',
    [j]: "You say I took the name in vain,<br>I don't even know the name.",
    t: sa,
    [e]: 60,
    max: 1
  },
  mj: {
    n: 'Michael Jackson Hat',
    [j]: "Who?<br>He!",
    t: sa,
    [e]: 80,
    max: 1
  },
  depp: {
    n: 'Johnny Depp Hat',
    [j]: "The Mad Hatter's very own<br> ",
    t: sa,
    [e]: 80,
    max: 1
  },
  pitt: {
    n: 'Brad Pitt Hat',
    [j]: "So you're Brad Pitt.<br>That don't impress me much.",
    t: sa,
    [e]: 80,
    max: 1
  },
  walt: {
    n: 'Walt Disney Hat',
    [j]: "Put it right on top of<br>the most magical place on Earth.",
    t: sa,
    [e]: 80,
    max: 1
  },

  // PAINTS
  [hg]: {
    n: "Juicy Green",
    [j]: 'Nothing says natural like a vibrant green.<br>So paint your plastics with this copper, arsenic, and cadmium blend.',
    t: Da,
    [e]: 20,
    [t]: '#64bc41',
    max: 3
  },
  red: {
    n: 'Reddy Rich',
    [j]: "You know what it is.<br>You Reddy?",
    t: Da,
    [e]: 30,
    [t]: '#d83030',
    max: 3
  },
  blue: {
    n: 'Bright Blue',
    [j]: "The shade of brilliant blue.<br>It's sure to catch every eye.",
    t: Da,
    [e]: 30,
    [t]: '#3fa1ec',
    max: 3
  },
  yellow: {
    n: 'Yellow',
    [j]: 'Look at this paint, look how it shines for you.<br>And it was called "Yellow".',
    t: Da,
    [e]: 40,
    [t]: '#ffca46',
    max: 3
  },
  orchid: {
    n: "Owens' Orchid",
    [j]: "It's the paint with<br>a helluva nice taint.",
    t: Da,
    max: 3,
    [e]: 50,
    [t]: '#9932CC'
  },
  orange: {
    n: "Orange Groove",
    [j]: "Marmalade, juice, or chicken.<br>This paint has a lot of… versatility.",
    t: Da,
    max: 3,
    [e]: 60,
    [t]: '#fb8500'
  },
  white: {
    n: "Titanium",
    [j]: "I'm bull**it proof.  Nothing to lose.<br>Fire-A-Way! Fire-A-Way!",
    t: Da,
    max: 3,
    [e]: 80,
    [t]: '#efefef'
  },
  pink: {
    n: "P!nk",
    [j]: "Out of paints that are most like a color type, this is one of the two in the pink.<br>So what?",
    t: Da,
    max: 3,
    [e]: 80,
    [t]: '#FF69B4'
  },
  black: {
    n: "Midnight",
    [j]: "It's not exactly midnight.<br>It's close to midnight.",
    t: Da,
    max: 3,
    [e]: 80,
    [t]: '#333333'
  },
  silver: {
    n: "Ardent Argent",
    [j]: "That is silver.<br> ",
    t: Da,
    max: 2,
    [e]: 100,
    [t]: '#dcdddf',
    fx: Oa, // metallic
    [Z]: [
      ["Don't cry for me."],
      ['Ardent Argent is an arduous agent.'],
      ['The silver spoon is the hardest to remove from the mouth.'],
      ["Oh there's that silver lining..."],
      ['A shiny new masterpiece'],
    ]
  },
  gold: {
    n: "Comedy Gold",
    [j]: "It's gold. It's gold.<br> ",
    t: Da,
    max: 2,
    [e]: 120,
    [t]: '#e6b510',
    fx: Oa, // metallic
    [Z]: [
      ['Solid gold...'],
      ['I got the Midas touch'],
      ["I ain't saying she's a gold digger..."],
      ["It's a gold-plated life"],
    ]
  },
  // Dummy item for crucible burnt farms.
  metal: {
    [id]: 1,
    fx: Oa
  },

  // ANT TUBES
  harv: {
    n: "The Red Queen",
    [j]: "There are worse lives to live.<br>Don't feel sorry for me.",
    t: ib,
    max: 1,
    [e]: 120,
    [t]: 'red',
    ant: 'H'
  },
  carp: {
    n: "The Carpenters",
    [j]: "Look what Mr Postman has delivered!<br>Oh yes, wait a minute.",
    t: ib,
    max: 1,
    [e]: 120,
    [t]: 'orange',
    ant: 'K',
    W: 5 // Gives 5 workers.
  },
  sug: {
    n: "Sugar Mama",
    [j]: "An older, more experienced, Queen.<br>She'll get things going for you.",
    t: ib,
    max: 1,
    [e]: 140,
    [t]: 'yellow',
    ant: 'Z'
  },
  chi: {
    n: "Lady Chimera",
    [j]: "It's pronounced <em>chimera</em>.<br>But, go on…",
    t: ib,
    max: 1,
    [e]: 140,
    [t]: 'blue',
    ant: 'M'
  },
  phar: {
    n: "Queen Of The Nile",
    [j]: "Mother of Pharaohs.<br>She'll light the darkness that threatens the land.",
    t: ib,
    max: 1,
    [e]: 160,
    [t]: 'orchid',
    ant: 'P'
  },
  ghst: {
    n: "The Ghost Crew",
    [j]: "I ain't afraid of no ghost.<br> ",
    t: ib,
    max: 1,
    [e]: 160,
    [t]: 'silver',
    ant: 'J',
    W: 7 // Gives 7 workers.
  },
  [rc]: {
    n: "Ant Collection Vial",
    [j]: "Ants love getting into these<br>and can survive in them forever.",
    [e]: 0,
    t: ib,
    [id]: 1
  },
  [fi]: {
    n: "Collected Ants",
    [j]: w,
    [e]: 0,
    t: ib,
    [id]: 1
  },

  // EXPANSION ITEMS
  [Za]: {
    n: 'Plate',
    [j]: "For the bottom, the flared base...<br>plate.",
    [e]: 10,
    max: 2,
    t: 'name plaque',
    [Z]: [
      ['Nice name!'],
      ['Why did you choose that?'],
      ['Interesting choice!'],
      ['OK well we did that.']
    ],
    keep: 1
  },
  [Qe]: {
    n: 'Ant Farm',
    [j]: "Set up a new Ant Farm.<br>100% SCIENTIFICALLY ACCURATE",
    [e]: 20,
    max: 2,
    t: 'expansion pack',
    [Z]: [
      ['Alright! Here is a new farm.'],
      ['New farm for you.'],
      ['Here is your unboxed ant farm.'],
      ['A clean slate.'],
      ["You just wanna be startin' something."],
      [Vj],
    ]
  },
  [bc]: {
    n: 'ToobWay™ Connector',
    [j]: "DO YOU KNOW DA WAY™<br>YOU DO NOT KNOW DA WAY™",
    [e]: 40,
    max: 2,
    t: 'expansion accessory',
    keep: 1,
  },
  sand: {
    n: 'Sand Bag',
    [j]: "The town provides free sand for flooding.<br>You could use this for ants or something.",
    [e]: 10,
    t: ac,
    max: 1,
    keep: 1,
    [Z]: [
      ['These are the days of our lives.'],
      ['Like sands through an ant farm glass…'],
      ['Enter the sand, man.'],
      ["It's course and rough and irritating."],
      ['And it gets everywhere.'],
    ]
  },
  gel: {
    n: 'NASA Gel',
    [j]: "Ant habitat gel that ants can get some food and water from too.<br>Not exactly natural for ants, but I wonder what else we could put ants into?",
    [e]: 20,
    t: ac,
    max: 2,
    [Z]: [
      [Wj],
      [Xj],
      ["That's one small step for an ant"]
      ["Failure is not an option"],
      ["Do the other things, not because they are easy, but because they are hard."],
      ["The dream of yesterday is the hope of today and the reality of tomorrow."],
    ]
  },
  beer: {
    n: 'Beer Jell-O',
    [j]: "Ant habitat jell-O that provides some food/water<br>and improves ant mood a lot.",
    [e]: 50,
    t: ac,
    max: 1,
    [Z]: [
      [Xj],
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
    [j]: 'Ant habitat product that provides some food/water,<br>as well as a little mood and health boost.',
    [e]: 60,
    t: ac,
    max: 1,
    [Z]: [
      ['For all ant types'],
      ['For flip, bounce, and hold'],
      ['Shape your style!'],
      ['Rock your style!'],
      ['Salon proven'],
    ]
  },
  [Se]: {
    n: 'Expired Bulk Personal Lubricant',
    [j]: 'Ant habitat filth that provides some food/water,<br>attracts queens, and encourages laying.',
    [e]: 69,
    t: ac,
    max: 1,
    [Z]: [
      [Wj],
      ['Lube glorious lube'],
      ['This fkn town…'],
      ['Keeps love going'],
      ['For a smooth ride'],
      ['Slip into pleasure'],
    ]
  },
  slime: {
    n: 'Slime',
    [j]: "Ant habitat slime that provides a decent amount of food/water, and some health.<br>* grape flavored",
    [e]: 76,
    t: ac,
    max: 1,
    [Z]: [
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
    [j]: "Ant habitat ooze that provides some food/water<br>and gives a lot of health but decreases mood.",
    [e]: 84,
    t: ac,
    max: 1,
    [Z]: [
      ['Get ready to ooze with excitement'],
      ["That's no ordinary ooze… it's the secret of our past!"],
      ["The mutagen is unstable. If we're not careful, it could mutate us even further!"],
      ["Dude, I still can't believe a little ooze made us totally awesome!"],
      ["The ooze is what made us… and it can make others like us!"],
    ]
  },
  feng: {
    n: 'Mystical Feng Shui Pack',
    [j]: "For ants who crave better energy flow. Includes suspiciously scented incense.<br>Reorder your farms to achieve inner ant-peace.",
    [e]: 168,
    t: 'farm-sorter',
    max: 1,
    keep: 1
  },

  // SCENERY ITEMS
  mountains: {
    n: 'Mountains',
    [j]: "Mountains rise tall like ant hills, their grandeur the landscape fulfills.<br>Ain't no mountain too high, for the ants or the sky. Both conquer with tiny, strong wills.",
    t: qb,
    [e]: 5,
    max: 2
  },
  liberty: {
    n: 'French Statue',
    [j]: "Your huddled colonies yearning to breathe free.<br>Yet captive they will remain.",
    t: tc,
    [e]: 10,
    max: 2
  },
  pyramids: {
    n: 'Pyramids',
    [j]: "The pyramids house kings of old, in chambers with tunnels untold.<br>Like ants in their nest, the Pharaohs find rest, in a labyrinth of treasure and gold.",
    t: qb,
    [e]: 30,
    max: 2
  },
  obelisk: {
    n: 'Obelisk',
    [j]: "You may tell one person about your ant farm.<br>(we don't talk about the tiny pyramid at the top)",
    t: tc,
    max: 1,
    [e]: 30
  },
  barn: {
    n: 'Barn',
    [j]: "Ants have sophisticated ways to store food.<br>A barn is not one of those ways.",
    t: tc,
    max: 2,
    [e]: 30
  },
  piff: {
    n: 'Piff',
    [j]: "Best show I've seen in ages.<br>(chairs were uncomfortable - one star)",
    t: tc,
    max: 1,
    [e]: 60
  },
  jesus: {
    n: 'Jesus',
    [j]: "The Ant Christ<br>Not to be confused with the other guy.",
    t: tc,
    max: 1,
    [e]: 70
  },

  // BACKGROUND CARD ITEMS
  clouds: {
    n: 'Cloudy Days',
    [j]: "Add some immersive realism to your farm<br>with this high-quality printed card.",
    t: V,
    max: 1,
    [e]: 20
  },
  canada: {
    n: 'Canada',
    [j]: "<br>It's somewhere above…",
    t: V,
    max: 1,
    [e]: 50
  },
  vegas: {
    n: 'Vegas',
    [j]: "<br>(note: ants may become preoccupied with parking and weather)",
    t: V,
    [e]: 60,
    max: 1
  },
  desert: {
    n: 'Desolation',
    [j]: "A printed card so realistic that you can feel the despair and hopelessness<br>just like if you really drove to Arizona.",
    t: V,
    max: 1,
    [e]: 60
  },
  space: {
    n: 'The Final Frontier',
    [j]: "I hear it's not as good as Star Trek: The Experience<br>I wanted to go to that. Who was in that, anyway?",
    t: V,
    max: 1,
    [e]: 80
  },

  // SPECIAL ITEMS
  [bd]: {
    n: 'ANT FAX',
    [j]: "THE ant fact organizer<br>of the nineties.",
    t: Yj,
    max: 1,
    [e]: 20,
    keep: 1
  },
  antfaxpro: {
    n: 'ANT FAX PRO',
    [j]: "Even more fun ant facts<br>for the brightest of learners.",
    t: Yj,
    max: 1,
    [e]: 120,
    keep: 1
  },
  box: {
    n: 'Nerd Box',
    [j]: "Whatever's in there might fill the empty void in your soul.<br>Just like the crate that housed the ark of the covenant.",
    t: 'gift',
    [e]: 17,
    max: 3,
    [Z]: [
      [Vj],
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
    [j]: "Mystical pass to a whole new backdrop, doubles as an unspoken confession of mid-life crisis…<br>…admits one man/child.",
    t: 'location swapper',
    max: 2,
    [e]: 25,
    [Z]: [
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
    [j]: "This backdrop has been scientifically proven to make your ex wish they hadn't dumped you.<br> ",
    t: 'location enhancer',
    max: 2,
    [e]: 75,
    [Z]: [
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
    [j]: "Liquid metal<br> ",
    t: 'bad idea',
    max: 2,
    [e]: 200,
    [Z]: [
      ["Tsssssssssssssss..."],
      ["Yeowwwww"],
      ["Aaaaaaargghhhhhh"],
    ]
  },
  [Ed]: {
    n: 'eBay',
    [j]: "A digital garage sale for old ant farms.<br>The highest bid will be a serving of disappointment.",
    t: 'app',
    max: 1,
    keep: 1,
    [e]: 200
  },
  coexist: {
    n: '☪︎☮︎é✡︎ì࿊✞',
    [j]: "Advocates that ants of different faiths and belief systems can live together peacefully.",
    t: Te,
    max: 1,
    [e]: 222
  },
  [cd]: {
    n: 'Mom',
    [j]: "Bucket to mop, you've done it all.<br>You cleaned up.",
    t: 'percent DAT UGLY BITCH',
    max: 1,
    keep: 1,
    [e]: 100,
    [id]: 1 // Don't randomly drop this item.
  },

},

// Button labels.
Wh = ['Yeah OK', 'Alrighty', 'Rightio', 'Huh', 'What', 'k', 'Mmm Hmm', 'Yup', 'Got it', 'OK whatever', 'Sweet', 'Thanks I guess'],
sj = ['Yes', 'I did', 'Cheers', 'Woohoo', 'Bam', 'Boom', 'Nice', 'Yay', 'Right?', 'There it is', 'Click this', 'Awesome'],

// Pools of random messages for specific occasions.
tj = [['Welcome to Ant Farm Social.', "We're preaching ants."],['Hey Johnny, do you wanna go to an Ant Farm Social?']],
uj = [['Here is your new Ant Farm. You need to get you some ants.', 'You may notice some free ants roaming your screen.']],
vj = [["You've been bit!", "You can't collect ants until you're better"], ["Ouch! You were bitten!", "You'll need to wait until this passes"]],
wj = [["They don't like that"], ['Stop that'], ["Tappa-Tappa-Tappa"], ['Shh! This is the listening side of the plexiglass'], ['This is supposed to be a quiet activity']],
xj = [['You scored your first point! 🏆'], ['🎉🎉🎉 1 point! 🎉🎉🎉'], ['You caught your first ant! 🐜'], ["Well done, there's your first one. 1️⃣"]],
yj = [['You scored your second point! You go you! 😉'], ['Two points!!! 🥇🥇'], ["Two's company!"], ['Oh the number one is not my favourite number.', "Because one means there's just me and there's no you."]],
zj = [['Check your openings for papers'], ["It's ALWAYS open"], ["It's like a sweathouse in there"], ["I lifted the lid, and now I have questions."], ["Lift the lid of curiosity"],
["Some secrets are best left untouched"], ["You might regret this"], ["Get back in your hole!"], ["The mystery beneath is revealed!"], ["Dealing with what's inside? That's the real challenge."],
["What are you looking in there for?"], ["Why do that?"], ["Hey put that back!"], ["Leave it on buddy"], ["What if they escape?"]],

Aj = [
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
    [Zj],
    ["One more for you."],
    [$j],
    ["You did it again."],
    ["Captured one more."],
    ["Another capture."],
    ["One more point."],
    ["You caught another."],
    ["Got another one."],
    ["You took another."],
    ["Another one caught."],
    ["Scored again."],
    [_j],
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
    [Zj],
    ["Great, another."],
    ["Another. Cool."],
    ["Oh, another."],
    [_j],
    ["Another. Nice."],
    ["One more. Yay."],
    ["You did it."],
    ["Another. Sure."],
    ["Oh look, another."],
    ["Yet another. Whatever."],
    ["Wow. Another."],
    [$j],
  ],
],

Bj = [
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
    [qi, "The bartender says 'We don't serve ants here.'", "The ants reply 'We just came for the ant-tastic drinks!'"],
    [qi, "The bartender says 'We don't serve ants in here!'", "One ant goes 'We're just looking for a tiny sip!'"],
    [qi, "The bartender says 'We don't serve ants.'", "One ant replies 'That's quite ant-agonizing!'"],
    ["185 ants walk into a casino bar…", "The bartender says 'Hey, we've got a strict no-ants policy.'", "The ants say 'We just wanted to raise the ant-te!'"],

    // Triple threat 2
    [ef, "Carrying more than their own weight."],
    [Ag, "Communicating without saying a word."],
    [ak, "Full of tunnels."],
    ["I like my men like I like my ant simulator:", "Always challenging."],
    ["I like my men like I like my ants:", "Knowing who's queen."],
    [ef, "All over my picnic."],
    [Ag, "Swarming around me."],
    [Ag, "Easily squashed."],
    [ak, "Behind glass I can peep through."],
    ["I like my women like I like my ant simulator:", "Easy to quit."],
    [ef, "In my pants."],
    ["I like my men like I like my ant farms:", "Digging deep."],
    [ef, "Small."],
    [ef, "Always finding a way into my house."],
    [Ag, "Coming in hundreds."],

    // Triple threat 3
    ["They call me the ant farm,", "Because I'm very dirty."],
    ["They call me the simulator game,", "Because people love to play with me but it's all just pretend."],
    ["They call me the pheromone trail,", "Because I lead everyone to the action."],
    ["They call me the ant farm glass,", "Because you can see right through my intentions."],
    ["They call me the ant trap,", "Because once you step in, you can't get out."],
    ["They call me the glitch,", "Because I can mess up your simulation in ways you never expected."],

    // Ant trivia that keeps mentioning Israel
    ["In Israel, the Cataglyphis niger ant has been studied extensively","due to its remarkable navigational abilities.","These ants live in harsh desert environments","and have adapted to find their way back to their nests","over long distances using the position of the sun and internal step-counting.","Israeli researchers have been fascinated by their precise homing skills","in the extreme heat of the southern Israeli Negev desert.","This ability to navigate in seemingly featureless landscapes…","has drawn parallels to modern robotic navigation techniques.",Hc,"In fact, the research conducted in Israel on desert ants…","has contributed to the understanding of biological navigation systems","which in turn has inspired improvements in robotics","and Israeli autonomous vehicle guidance systems."],
    ["In Israel, scientists discovered a unique species of blind subterranean ants","called Aphaenogaster phillipsi, which thrive in caves in the Galilee region.","These ants have adapted to their dark, underground environment","by losing their eyesight completely and relying on chemical signals","and vibrations to communicate and navigate.","This discovery is quite significant because it highlights","the extreme adaptations organisms can develop","in response to their specific environments.",Hc,"Additionally, these Israeli cave ants have attracted interest from biologists","studying evolutionary processes and how creatures adapt over time","to isolated and challenging Israeli habitats."],
    ["In Israel's Hula Valley there is an ant species called Crematogaster scutellaris","and it plays a surprising role in local agriculture.","These ants have a symbiotic relationship with fig trees.","The ants protect the fig trees from herbivorous insects and pests","in exchange for the sugary secretions produced by the tree's fig wasps.", "This mutualistic interaction has been observed to significantly benefit the fig trees","resulting in healthier plants and higher fruit yields for Israelis.",Hc,"This ant-fig partnership garnered attention from agricultural researchers in Israel","as they study natural methods of pest control","that reduce the need for chemical pesticides","contributing to more sustainable farming practices in that region of Israel."],
    ["In Israel, researchers have studied the Tapinoma israele.","These ants are known for their highly efficient recruitment behavior.","When they discover a food source, they quickly recruit other members of their colony", "using chemical trails to lead them directly to the food.","What makes Tapinoma israele particularly interesting is their speed and coordination","with which they mobilize their colony compared to other ant species.",Hc,"This behavior has implications for the study of collective intelligence and swarm behavior","areas that are of great interest in fields like computer science and robotics.","Israeli researchers are exploring how ant foraging can inspire algorithms","for solving problems like optimizing routes in networks or coordinating robot swarms."],
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
    ["The small but mighty ant teaches me that every action…", bk, "…has value and significance."],
    ["Watching ants…", "…I find solace in the realization that life's meaning is found in the journey…", "…not the destination."],
    ["The collaborative spirit of ants reminds me that together…", "…we can achieve greatness, and this unity brings me joy."],
    ["The industrious ant shows me that a life of purpose…", "…however modest…", "…is a life well-lived."],
    ["Watching ants work with purpose…", "…I realize that even in fleeting moments…", "…there is profound beauty in existence."],
    ["The brief life of an ant teaches me to cherish every moment…", "…finding joy in the simplicity of being."],
    ["In the intricate dance of ants…", "…I see a reflection of life's delicate balance…", "…embracing my own journey with newfound serenity."],
    ["The relentless march of ants reminds me that each step…", bk, "…contributes to the grand tapestry of life."],
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
mc = {
  'blood': {
    n: "Blood Type",
    [j]: "Have one kind of ant in a farm.",
    lvls: 1,
    sub: "of a kind",
    ico: "🩸",
    [e]: 3,
  },
  'sac': {
    n: "Sacrifices",
    [j]: "Feed rival ants to meat eaters.",
    lvls: 1,
    sub: "ants sacrificed",
    ico: "🤼‍♂️",
    [e]: 5,
  },
  'scene': {
    n: "Be Scene",
    [j]: "Place scenery items.",
    lvls: 1,
    sub: "items placed",
    ico: "⛰️",
    [e]: 20,
  },
  'fac': {
    n: "Factory Fourm",
    [j]: "Have four farms developing.",
    sub: P,
    ico: "🏭",
    [e]: 25,
  },
  'tri': {
    n: "Tri-fill-cta",
    [j]: "Have 3 fill types used at the same time.",
    ico: "3️⃣",
    [e]: 30,
  },
  'arty': {
    n: "Arty Farty",
    [j]: "Paint several items.",
    lvls: 1,
    sub: "items painted",
    ico: "🎨",
    [e]: 32,
  },
  'sweep': {
    n: "Queen Sweep",
    [j]: "A single queen wipes out a colony.",
    ico: "👸🏾",
    [e]: 35,
  },
  'kweens': {
    n: "Kweens",
    [j]: "Have multiple queens in a colony.",
    ico: "👑",
    [e]: 40,
  },
  'progeny': {
    n: "Progeny",
    [j]: "Start a farm without capturing free ants.",
    ico: "🐜",
    [e]: 45,
  },
  'man': {
    n: "Man Fairies",
    [j]: "Nurse drone ants to adulthood.",
    lvls: 1,
    sub: "drones",
    ico: "🧚‍♂️",
    [e]: 50,
  },
  [$e]: {
    n: "Dragged Queen",
    [j]: "Insert a queen taken from another farm.",
    ico: "💃",
    [e]: 55,
  },
  'hb': {
    n: "Heartbreaker",
    [j]: 'Have a nest with 10 "other" causes of death.',
    ico: "💔",
    [e]: 60,
  },
  'day': {
    n: "Twinny Faux",
    [j]: "Keep a farm going at least a day.",
    ico: "🌗",
    [e]: 65,
  },
  'weak': {
    n: "The Weak End",
    [j]: "Keep a farm going for 7 days.",
    ico: "📅",
    [e]: 80,
  },
  [cd]: {
    n: "Get Mom",
    [j]: "What the heck???",
    ico: "🤔",
    [e]: 100,
  },
},

// The blank data structure of a farm object.
Xh = {
  [Xb]: {
    [wc]: {
      [sg]: 0,
      [tg]: 0,
      [Ba]: 0,
      [Gd]: 0,
    },
    [Pb]: 0,
  },
  a: [], // ants
  e: [], // eggs
  c: [], // carry
  [v]: [],
  [oc]: [],
  [aa]: [],
  [be]: [],
  [Aa]: [],
  [$]: [],
},

// Actions that can be enqueued when in certain areas, and a flag indicating whether they can be done randomly.
// The first item in each list is the default action. There should always be a corresponding function in act[action].
// Some functions rely on the actions being listed here, stop doubting it.
xd = {
  'bg': {[jd]: 1, uncrawl: 1, [Mc]: 1, [Ba]: 0, slip: 0, land: 0, kip: 0, [Pc]: 0, [K]: 0, [Oc]: 0, die: 0, [_]: 0},
  [H]: {[xc]: 1, [ia]: 1, [$]: 1, [jd]: 1, [Mc]: 1, [Jd]: 1, [Ga]: 1, [Ba]: 0, kip: 0, [Pc]: 0, [zc]: 0, [K]: 0, [Oc]: 0, die: 0, [_]: 0},
  [Eb]: {[ia]: 1, [bf]: 1, [Mc]: 1, [md]: 0, [Ba]: 0, [Jd]: 0, kip: 0, [Pc]: 0, [zc]: 0, [K]: 0, [Oc]: 0, die: 0, [_]: 0, [Qb]: 0},
},

// Nip Ids (Note: 0 is not a valid key for nipIds)
Nb = [0, 'nip-bl', 'nip-br', 'nip-tl', 'nip-tr'],

// Reasons an ant might die.
Cj = {
  [sg]: 'of hunger',
  [tg]: 'of thirst',
  [Ba]: 'in a fight',
  [Gd]: 'of a broken heart'
},

// HTML for farm.
Dj =
`<div id=kit><div id=wrapper class=farm data-col=green><div id=a-nip-tl class="nants nip-tl"></div><div id=a-nip-tr class="nants nip-tr"></div><div id=a-nip-bl class="nants nip-bl"></div><div id=a-nip-br class="nants nip-br"></div><div id=farm data-fill=none><div id=card></div><div id=scenery class=above></div><div id=food class=above></div><div id=hills class=above></div><div id=fill class=fill><div class=specks></div></div><div id=tunnels class=fill></div></div><div id=glass><div id=frost></div><div class=ahole-set><div class=ahole></div><div class=ahole></div><div class=ahole></div></div><div class=ahole-set><div class=ahole></div><div class=ahole></div><div class=ahole></div></div></div><div id=decals></div><div id=l-wrap><div id=loupe><div id=lg></div><div id=lh></div></div><div id=l-inf><div id=l-head></div><div id=l-l><div id=l-t><span class=txt></span><span class=emo>🐜</span></div><div id=l-c><span class=txt></span><span class=emo></span></div><div id=l-d><span class=txt></span><span class=emo>⌛</span></div><div id=l-a><span class=txt></span><span class=emo>💡</span></div></div><div id=l-r><div id=l-rot><span class=emo>☣️</span><span class=bar></span></div><div id=l-decay><span class=emo>🥀</span><span class=bar></span></div><div id=l-fd><span class=emo>🍔</span><span class=bar></span></div><div id=l-dr><span class=emo>🥤</span><span class=bar></span></div><div id=l-md><span class=emo></span><span class=bar></span></div><div id=l-hp><span class=emo>♥️</span><span class=bar></span></div></div></div></div><div class="frame-l frame"></div><div class="frame-r frame"></div><div id=dropzone class=glow></div><div id=lid><div class="hole frame"></div><div class="frame-t frame"></div></div><div class="frame-b frame"></div><div id=nip-tl class="nip frame"><div class="nipcap frame"></div></div><div id=nip-tr class="nip frame"><div class="nipcap frame"></div></div><div id=nip-bl class="nip frame"><div class="nipcap frame"></div></div><div id=nip-br class="nip frame"><div class="nipcap frame"></div></div><div id=vial class=vial><div class=vc></div><div class=vt></div><div class=vf></div><div class=vw></div><div class=vs><div></div></div></div><div id=t-nip-tl class="toob nip-tl"><div></div><span><span>►</span><span>►</span><span>►</span></span></div><div id=t-nip-tr class="toob nip-tr"><div></div><span><span>►</span><span>►</span><span>►</span></span></div><div id=t-nip-bl class="toob nip-bl"><div></div><span><span>►</span><span>►</span><span>►</span></span></div><div id=t-nip-br class="toob nip-br"><div></div><span><span>►</span><span>►</span><span>►</span></span></div></div><div id=base class=frame data-col=green><div id=sign class=plate><div class="sign-l plate"></div><h1 id=n>ANT FARM SOCIAL</h1><div class="sign-r plate"></div></div><div class="trim plate"><div class=trim-inner></div></div></div></div>`,

// HTML for ant.
Ej =
`<div id=ant class=ant><div class=spot></div><div class=body><div class=body-mag><div class=body-wrap><div class="legs legs-l"><div class=leg><div class=foot></div></div><div class=leg><div class=foot></div></div><div class=leg><div class=foot></div></div></div><div class=head><div class=antenna></div><div class=antenna></div><div class=hat></div><div class=c></div></div><div class=torso></div><div class=rear></div><div class="legs legs-r"><div class=leg><div class=foot></div></div><div class=leg><div class=foot></div></div><div class=leg><div class=foot></div></div></div><div class=wings><div class="wing wing-l"></div><div class="wing wing-r"></div></div></div></div></div></div>`,

// Locations for the bus tickets (the bg images and corresponding ambient audio).
gg = {
  // Keyed by the base slugs of the image filenames, c: count of bgs, a: audio file.
  beach: {c: 5}, // Default 'a' is 'wind'.
  park: {c: 5, a: 'park'},
  country: {c: 6, a: 'wild'},
  lake: {c: 3, a: 'wild'},
  [hi]: {c: 8},
  picnic: {c: 3, a: 'park'},
  desert: {c: 6},
};

// STICKERS
// Dynamically added because they're all identical.
for (let fk = 1; fk < 9; fk++) {
  l[sb + (w + fk).padStart(2, 0)] = {
    n: 'a sticker',
    [j]: w,
    t: Te,
    max: 1,
    [e]: 100,
  }
}

