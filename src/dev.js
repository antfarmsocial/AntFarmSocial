/*
 * Ant Farm Social
 * dev.js (Developer assistant)
 *
 * This file contains functions to help developers.
 * It is not included in production releases, and may not be written as carefully as the main program.
 * This script is included in the app when gulp is run with the --dev flag.
 * Most of the functionality is easily accessible in a GUI when ?dev=1 is added to the app's URL.
 *
 */

let showLines = 0;

// Debug line: Draws a line defined in the obj parameter.
const DL = (obj, score = 100) => {
  if (showLines) {
    bb = getEl('fill').getBoundingClientRect();
    drawLine(bb.x + obj.x1, bb.y + obj.y1, bb.x + obj.x2, bb.y + obj.y2, score);
  }
};

// Draws a line defined in the parameters.
const drawLine = (x1, y1, x2, y2, score) => {
  !getEl('L') && appendHTML(B, `<div id="L" style="position: absolute; z-index: 1; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></div>`);
  let lineContainer = getEl('L'),
    line = document.createElement('div'),
    length = hypot(x2 - x1, y2 - y1),
    angle = atan2(y2 - y1, x2 - x1) * (deg180 / PI);
  Object.assign(line.style, {
    position: 'absolute',
    width: length + 'px',
    height: '2px',
    backgroundColor: `hsl(${(1 - score) * 240}, 100%, 50%)`,
    opacity: max(score, .1),
    transformOrigin: '0 0',
    transform: `rotate(${angle}deg)`,
    left: x1 + 'px',
    top: y1 + 'px'
  });
  lineContainer.appendChild(line);
};

// Toggles the display of waypoint pins.
const toggleWaypoints = (delOnly, tracer = 0) => {
  let wp = getEl('waypoints');
  if (wp || delOnly) {
    wp && wp.remove();
  }
  else {
    updateWaypoints(F);
    getEl('farm').innerHTML += '<div id="waypoints" class="fill"></div>';
    wayPoints[F.id].forEach(p => {
      const pointDiv = document.createElement('div');
      pointDiv.classList.add('waypoint');
      pointDiv.style.position = 'absolute';
      pointDiv.style.left = `${p.x - 1}px`;
      pointDiv.style.top = `${p.y - 1}px`;
      pointDiv.style.width = '2px';
      pointDiv.style.height = '2px';
      pointDiv.style.backgroundColor = `${p.c ? p.c : 'lime'}`;
      pointDiv.style.borderRadius = '50%';
      pointDiv.style.transition = 'outline 0.3s ease';
      document.querySelector('#waypoints').appendChild(pointDiv);
    });

    if (tracer) {
      // Flash each point with overlap
      let i = 0, wpEls = queryAll('.waypoint');
      if (wpEls.length) {
        const flashNext = () => {
          const el = wpEls[i % wpEls.length];
          el.style.outline = '1px solid white';
          setTimeout(() => el.style.outline = 'none', 500); // remove after 2s
          i++;
          setTimeout(flashNext, 100); // move to next point every 0.5s
        };
        flashNext();
      }
    }

  }

}

// Creates a fully formed tunnel system.
const testTuns = X => dumpFarm(1) || setTimeout(X => F.tuns.forEach(t => {t.prog = 100; tunProgDraw(t)}) || F.hills.forEach(h => {h.h = 25 + randomInt(25); drawHill(h)}), 0);

// Dispays the developer panel.
  const devPanel = X => {
  let devParams = new URLSearchParams(window.location.search);
  if (!devParams.get('dev')) return;

  let devDropOpts = '';
  Object.keys(items).filter(it => items[it].n).sort((a, b) => items[a].n.localeCompare(items[b].n)).forEach(item => devDropOpts += `<option value="${item}">${devTruncate(items[item].n) + ' (' + item + ')'}</option>`);

  let devAchOpts = '';
  Object.keys(ach).forEach(a => {
    if (ach[a].lvls) for (let i = 1; i <= 3; i++) devAchOpts += `<option value="${a}-${i}">${devTruncate(ach[a].ico) + ' ' + devTruncate(ach[a].n) + ' (' + a + ') [' + i*3 + ']'}</option>`;
    else devAchOpts += `<option value="${a}-0">${devTruncate(ach[a].ico) + ' ' + devTruncate(ach[a].n) + ' (' + a + ')'}</option>`;
  });

  let devActsOpts = '';
  Object.keys(act).sort((a, b) => a.localeCompare(b)).forEach(a => devActsOpts += `<option value="${a}">${a}</option>`);

  let devBannedActsOpts = '';
  let devAreas = Object.keys(acts);
  devAreas.forEach(devArea => {
    devBannedActsOpts += '<b>' + (devArea == 'bg' ? 'BG area' : devArea == 'top' ? 'Top area' : 'Bottom area') + ':</b> &nbsp;';
    let devAreaActs = Object.keys(acts[devArea]).filter(devAct => acts[devArea][devAct]);
    let devAreaActsOptsArray = [];
    devAreaActsOptsArray.push(devAreaActs.shift()); // Don't allow control of default action.
    devAreaActs.forEach(devAct => devAreaActsOptsArray.push(`<label><input type="checkbox" name="dev-banned-act-${devArea}-${devAct}" id="dev-banned-act-${devArea}-${devAct}" value="${devArea}-${devAct}">${devAct}</label>`));
    devBannedActsOpts += devAreaActsOptsArray.join(' | ')
    devBannedActsOpts += '<br>';
  });


  appendHTML(B, `
    <div id="dev">

      <h2>Developer panel</h2>

      <hr>

      Score <input type="number" id="dev-score" name="dev-score" value="1">
      <label><input type="checkbox" id="dev-bonus" name="dev-bonus">bonus</label>
      <button id="dev-score-submit">➕ Score</button>

      <br>

      <select name="dev-drop-item" id="dev-drop-item">${devDropOpts}</select>
      <button id="dev-drop">🎁 Drop</button>

      <br>

      <select name="dev-ach-item" id="dev-ach-item">${devAchOpts}</select>
      <button id="dev-ach">🏆 Ach</button>

      <hr>

      <button id="dev-ss">🚀 Super speed</button>
      <label><input type="checkbox" id="dev-ss-reapply" name="dev-ss-reapply">reapply</label>
      <br>
      <button id="dev-ns">🐌 Normal speed</button>
      <br>
      <span id="framerate">50fps</span> <button id="dev-rs">📉 Reduce fps</button>

      <hr>

      Clone # <input type="number" id="dev-clone-x" name="dev-clone-x" min="1" value="3">
      <button id="dev-clone">👯 Clone</button>
      <br>
      <button id="dev-bite">🧛 Ant bite</button>
      <button id="dev-clearbite">🧴 Clear bite</button>
      <button id="dev-cologne">💨 Cologne</button>


      <hr>

      <label><input type="checkbox" id="dev-spawner" name="dev-spawner"><span id="dev-spawner-label">✨ Toggle free ant spawner</span></label>
      <br>
      <label><input type="checkbox" id="dev-stopants" name="dev-stopants"><span id="dev-stopants-label">🛑 Stop ants</span></label>
      <br>
      <button id="dev-spawnant">🐜 + Ant spawn</button>
      <button id="dev-clearants">🗑️ Clear all ants</button>
      <br>


      <a onClick="devAntDisplay()" id="devAntDisplayText">Display first ant object 👉</a>

      <button id="dev-reset-ant">🔄 Reset first ant</button> <button id="dev-reset-allants">🔄 Reset all ants</button>

      <br>
      <button id="dev-antleft">⬅️ L</button>
      <button id="dev-antcenter">⏺️ C</button>
      <button id="dev-antright">➡️ R</button>
      <button id="dev-antflip">↔️ Flip</button>


      <hr>

      <div id="dev-banned-processes">
        <label><input type="checkbox" id="dev-director" name="dev-director"><span id="dev-director-label">✅ Disable "Director" loop</span></label>
      </div>

      <br>

      <h3>Allowed Random Actions</h3>
      <div id="dev-banned-acts">
        ${devBannedActsOpts}
      </div>

      <br>

      <select name="dev-act" id="dev-act">${devActsOpts}</select>
      <button id="dev-request">📢 Request action</button>

      <details>
        <summary id=gotoLoc>Go To Location</summary>
        <div id="locForm">
          <div>
            <label>
              <select id="loc-n" name="loc-n">
                <option value="bot">Bottom area</option>
                <option value="top">Top area</option>
                <option value="bg">BG area</option>
              </select>
            </label>
          </div>
          <div data-show="top" hidden>
            <label>x
              <input type="range" name="loc-tx" id="loc-tx" min="1" max="959"><output>0</output>
            </label>
          </div>
          <div data-show="bg" hidden>
            <label>x
              <input type="range" name="loc-x" id="loc-x" min="1" max="959"><output>0</output>
            </label>
          </div>
          <div data-show="bg" hidden>
            <label>y
              <input type="range" name="loc-y" id="loc-y" min="301" max="509"><output>0</output>
            </label>
          </div>
          <div data-show="bot" hidden>
            <label>Tun
              <select name="loc-tun" id="loc-tun" id="loc-tun" ></select>
            </label>
          </div>
          <div data-show="bot" hidden>
            <label>%
              <input type="range" name="loc-pc" id="loc-pc" min="0" max="100"><output>0</output>
            </label>
          </div>
          <div data-show="bot" hidden>
            <label>Pos
              <select name="loc-pos" id="loc-pos">
                <option value="">- none -</option>
                <option value="u">Up</option>
                <option value="d">Down</option>
                <option value="m">Mid</option>
              </select>
            </label>
          </div>
          <button id="dev-gotoloc">📍 Go</button>
        </div>

      </details>

      <hr>

      <button id="dev-testtuns">⛏️ Test tuns</button>
      <label><input type="checkbox" id="dev-lines" name="dev-lines"> show lines</label>
      <br>
      <button id="dev-clearlines">🧹 Clear lines</button>

      <button id="dev-togglepinswaypoints">📌 Waypoints</button>

      <details>
        <summary id=mngTuns>Manage Tunnels</summary>
        ${F.tuns.length > 0 ? `
          <select id="dev-tunnel-list" multiple>
            ${F.tuns.slice().sort((a, b) => a.y1 - b.y1).map(tun => `<option value="${tun.id}">${tun.t == 'con' ? '🟣' : tun.t == 'ent' ? '🕳️' : tun.t == 'cav' ? '⭕' : '🟡'}${tun.id} (${tun.co ? tun.co.join(', ') : 'none'})</option>`).join('')}
          </select>
          <br>
          <button id="dev-remove-tunnels" disabled>🧹 Kill tuns<span class="countdown"></span></button>
        ` : `<p>(Reload to see new tuns)</p>`}
      </details>

      <hr>

      <div id="dev-msg-processes">
        <label><input type="checkbox" id="dev-msg" name="dev-msg"><span id="dev-msg-label">✅ Disable message system</span></label>
      </div>

      <br>

      <button id="dev-save" style="margin-bottom: .5em" disabled>💾 Save game<span class="countdown"></span></button>
      <br>
      Use after editing vars <input id="d_" class="devinput" type="text" name="_" value="_" disabled> and <input id="dF" class="devinput" type="text" name="F" value="F" disabled> in console

      <hr>

      <button id="dev-savestate" style="margin-bottom: .5em">📥 Save state</button>

      <div id="devstates"></div>

      <hr>

      Note: <input id="devQ" class="devinput" type="text" name="Q" value="Q()" style="width:1.6em;" disabled> in console will clear game data
      <br>
      <a onClick="devClear()">Reset form and reload</a>

    </div>
    <style>
      #dev, #devant {
        position: absolute;
        top: 0.5em;
        left: 0.5em;
        padding: .5em .25em;
        padding-bottom: 2em;
        background: rgba(255,255,255,.7);
        border-radius: 5px;
        z-index: 999;
        font-size: .75em;
        text-align: center;
        overflow-y: auto;
        overflow-x: clip;
      }
      #devant h2,
      #dev h2 {
        text-align: center;
        margin: .25em;
      }
      #dev h3 {
        margin: .25em;
      }
      #dev input[type=text],
      #dev input[type=number] {
        width: 3em;
        display: inline;
      }
      #dev button {
        margin: .25em;
        padding: .25em .5em;
      }
      #dev input[type=text].devinput {
        font-family: monospace;
        width: .9em;
        text-align: center;
        font-weight: bold;
      }
      #dev #framerate {
        font-family: monospace;
      }
      #dev #dev-banned-acts {
        text-align: left;
      }
      #dev #dev-banned-acts input {
        display: none;
      }
      #dev #dev-banned-acts label {
        color: #006400;
      }
      #dev #dev-banned-acts label.ban {
        color: #8B0000;
        text-decoration: line-through;
      }
      #devant {
        left: initial;
        right: .5em;
        bottom: .5em;
        width: 300px;
        text-align: left;
        user-select: auto;
      }
      #devant div {
        font-family: monospace;
        display: inline-block;
        width: 100%;
      }
      #devant span {
        font-size: 14px;
      }
      #devant .row {
        display: block;
        padding: .25em;
        border-radius: 3px;
      }
      #devant .row .row {
        font-size: 80%;
        background: rgba(0,0,0,.04);
      }
      #devant .label {
        width: 4em;
        display: inline-block;
        text-align: right;
        font-weight: bold;
        color: green;
        vertical-align: top;
        margin-right: .4em;

      }
      #devant .label {
        width: 3.5em;
      }
      #devant .value {
        display: inline-block;
        text-overflow: ellipsis;
        color: blue;
        vertical-align: top;
      }
      #devAntCalc .label {
        width: 10em;
      }
      #devant h3 {
        text-align: center;
        font-weight: bold;
      }

      .pin {
        width: 2px;
        height: 2px;
        background-color: red;
        border-radius: 1px;
      }
      .pin-ent {
        background-color: green;
      }
      .pin-con {
        background-color: purple;
      }
      .pin-cav {
        background-color: blue;
      }
      .pin-cav.pinup-0 {
        outline: 2px solid yellow;
      }
      .pin-cav.pinde-1 {
        outline: 1px solid brown;
      }
      .pinC {
        outline: 1px solid pink;
        border-radius: 50%;
      }
      .pinC-ent {
        outline: 1px solid rgba(0,255,0,.5);
      }
      .pinI-1 {
        background-color: red;
        border: 1px solid blue;
      }
      #mngTuns,
      #gotoLoc {
        color:#356AA0;
      }
      #locForm {
          background: rgba(212, 212, 212, 0.35);
          border-radius: 10px;
          padding: 10px;
          margin: 10px;
          margin-top: 0;
      }
      #locForm > div {
        margin-bottom: .5em;
      }
      #locForm output {
          display: inline-block;
          width: 2em;
      }
      #dev-msg,
      #dev-director,
      #dev-stopants,
      #dev-spawner {
        display: none;
      }
      #dev-msg-label,
      #dev-director-label,
      #dev-stopants-label,
      #dev-spawner-label {
        cursor: pointer;
        display: block;
        color:#356AA0;
      }
      #dev-stopants-label {
        background: #FFFF88;
        display: block;
        padding: .5em;
        margin: 0 1em;
        font-size: 1.4em;
        border-radius: 10px;
        font-weight: bold;
      }
      #devstates input {
        width: 9em;
      }
      #dev-tunnel-list {
        height: 200px;
      }
      #devAntDisplayText {
        background: #EEEEEE;
        display: block;
        padding: .25em;
        margin: 1em;
        border-radius: 5px;
        border: 2px solid #C3D9FF;
        font-weight: bold;
        font-family: monospace;
        font-size: 1.4em;
      }
    </style>
  `);

  // Handle the spawner checkbox.
  const handleSpawner = () => {
    spawner = !document.querySelector('#dev-spawner').checked;
    // Removed this toggle because switching farms or reloading re-enables spawner without respecting this:
    //document.querySelector('#dev-spawner-label').textContent = spawner ? '✅ Disable free ant spawner' : '🚫 Enable free ant spawner';
    if (!spawner) {
      setTimeout(X => _.a.filter(a => a.state == 'free').forEach(antDelete), 5);
    }
    else {
      spawnAnt();
    }
  };
  document.querySelector('#dev-spawner').addEventListener('change', event => { handleSpawner(); });

  // Handle the director checkbox.
  const handleDirector = () => {
    let directorCheckbox = document.querySelector('#dev-director').checked;
    if (!directorCheckbox) clearInterval(dirInterval);
    else {
      clearInterval(dirInterval);
      dirInterval = setInterval(director, standardDelay);
    }
    document.querySelector('#dev-director-label').innerHTML = directorCheckbox ? '✅ Disable "Director" loop' : '🚫 Enable "Director" loop<br>[currently only called once on load]';
  };
  document.querySelector('#dev-director').addEventListener('change', event => { handleDirector(); });

  // Handle the msg checkbox.
  const handleMsg = () => {
    stopMsgs = document.querySelector('#dev-msg').checked;
    document.querySelector('#dev-msg-label').textContent = !stopMsgs ? '✅ Disable message system' : '🚫 Enable message system';
  };
  document.querySelector('#dev-msg').addEventListener('change', event => { handleMsg(); });

  // Restore stopAnts from localStorage (default false)
  stopAnts = localStorage.getItem('stopAnts') === 'true';
  document.querySelector('#dev-stopants').checked = !stopAnts;
  document.querySelector('#dev-stopants-label').textContent = stopAnts ? '▶️ Start ants' : '🛑 Stop ants';

  // Handle the Stop ants checkbox.
  document.querySelector('#dev-stopants').addEventListener('change', () => {
    stopAnts = !document.querySelector('#dev-stopants').checked; // checked means stopAnts=false
    localStorage.setItem('stopAnts', stopAnts); // remember it
    document.querySelector('#dev-stopants-label').textContent = stopAnts ? '▶️ Start ants' : '🛑 Stop ants';
    if (!stopAnts) {
      F.a.forEach(a => antAction(a, getEl(a.id))); // restart
    }
    // clear free ants every time or it becomes chaos.  [comment this out when needed I suppose]
    ////for (let i = _.a.length - 1; i >= 0; i--) antDelete(_.a[i]);
    _.a.forEach(antDelete);
    queryAll('.ant.free').forEach(el => el.remove());

  });

  // Handle form buttons.
  document.querySelectorAll('#dev button').forEach(butt => {
    butt.addEventListener('click', event => devButtFunk[event.target.id]());
  });

  // Banned actions.
  document.querySelectorAll('#dev-banned-acts input').forEach(cb => {
    cb.addEventListener('change', event => banAction(cb));
  });

  // Handle form inputs.
  document.querySelectorAll('#dev input, #dev select').forEach(input => {
    devLoad(input);
    input.addEventListener('change', X => devSave(input));
  });

  // Enable save button after 30s, same as the save() function.
  setTimeout(X => {
    document.querySelector('#dev-save').disabled = 0;
    if (document.getElementById('dev-remove-tunnels')) document.getElementById('dev-remove-tunnels').disabled = 0;
  }, standardDelay);

  // Apply settings on load.
  setTimeout(X => {
    if (_.ss && document.querySelector('#dev-ss-reapply').checked) devButtFunk['dev-ss']();
    document.querySelectorAll('#dev-banned-acts input').forEach(cb => banAction(cb));
  }, 50);

  handleSpawner();
  handleDirector();
  handleMsg();

  // Highlight selected tunnel in the list.
  if (document.querySelector('#dev-tunnel-list')) {
    document.querySelector('#dev-tunnel-list').addEventListener('change', event => {
      // Remove existing highlights.
      document.querySelectorAll('.highlighted-tunnel').forEach(el => {
        el.classList.remove('highlighted-tunnel');
        el.style.outline = '';
      });

      // Highlight selected tunnels.
      Array.from(event.target.selectedOptions).forEach(option => {
        const tunnelElement = document.querySelector(`#${option.value}`);
        if (tunnelElement) {
          tunnelElement.classList.add('highlighted-tunnel');
          tunnelElement.style.outline = '2px solid #ff00ff';
        }
      });
    });
  }

  // Setup gotoLoc form.
  F.tuns.slice().sort((a, b) => a.y1 - b.y1).forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = `${t.t == 'con' ? '🟣' : t.t == 'ent' ? '🕳️' : t.t == 'cav' ? '⭕' : '🟡'} ${t.id}`;
    document.getElementById('loc-tun').appendChild(opt);
  });
  let locSwitch = () => {
    const val = document.getElementById('loc-n').value;
    document.getElementById('locForm').querySelectorAll('[data-show]').forEach(div => {
      const targets = div.getAttribute('data-show').split(',');
      div.hidden = !targets.includes(val);
    });
  };
  document.querySelectorAll('input[type="range"]').forEach(r => {
    r.nextElementSibling.value = r.value;
    r.addEventListener('input', () => r.nextElementSibling.value = r.value);
  });
  document.getElementById('loc-n').addEventListener('change', locSwitch);
  locSwitch();
  let locIdSwitch = () => {
    const t = F.tuns.find(t => t.id == document.getElementById("loc-tun").value);
    document.getElementById("loc-pos").closest("div").hidden = !t || t.t !== "cav";
  };
  document.getElementById("loc-tun").addEventListener("change", locIdSwitch);
  locIdSwitch();


  // Do the things for when a farm is drawn.
  devDrawFarmSupplement();

  // Create a countdown for the save button.
  let countdownEls = document.querySelectorAll(".countdown");
  let timeLeft = standardDelay / 1000;
  let timer = setInterval(() => {
    timeLeft--;
    updateCountdown(countdownEls, timeLeft, timer);
  }, 1000);
  updateCountdown(countdownEls, timeLeft, timer); // initial render

  renderDevStates();
};

let devSpeedCheck;

// Handles the reaction to developer panel inputs.
const devButtFunk = {
  'dev-score-submit': X => {
    score(parseInt(document.querySelector('#dev-score').value), document.querySelector('#dev-bonus').checked);
  },
  'dev-drop': X => {
    drop(document.querySelector('#dev-drop-item').value);
  },
  'dev-ach': X => {
    let a = document.querySelector('#dev-ach-item').value.split('-');
    _.ach[a[0]] = parseInt(a[1]) ? {l: parseInt(a[1]), v: parseInt(a[1]) * 3} : 1;
    queueAch(a[0]);
  },
  'dev-ss': X => {
    ///speedo();
    useItem(0, 0, 0, {k: 'speedo'});
    clearInterval(devSpeedCheck);
    devSpeedCheck = setInterval(X => {
      if (!_.ss) document.querySelector('#dev-ss-reapply').checked ? setTimeout(X => devButtFunk['dev-ss'](), 1000) : clearInterval(devSpeedCheck);
    }, 999);
    document.querySelector('#framerate').textContent = 1000/frameTick + "fps";
  },
  'dev-ns': X => {
    frameTick = 20;
    _.ss = 0;
    clearInterval(devSpeedCheck);
    document.querySelector('#framerate').textContent = 1000/frameTick + "fps";
  },
  'dev-rs': X => {
    frameTick = frameTick * 2;
    document.querySelector('#framerate').textContent = 1000/frameTick + "fps";
  },
  'dev-bite': X => {
    antBite(0, 1);
  },
  'dev-clearbite': X => {
    ///antyvenom();
    useItem(0, 0, 0, {k: 'antyvenom'});
  },
  'dev-cologne': X => {
    ///cologne();
    useItem(0, 0, 0, {k: 'cologne'});
  },
  'dev-clone': X => {
    clone(document.querySelector('#dev-clone-x').value);
  },
  'dev-spawnant': X => {
    let spawnState = spawner;
    spawner = 1;
    spawnAnt(0);
    spawner = spawnState;
  },
  'dev-clearants': X => {
    ///while(F.a.length) antDelete(F.a[0]);
    F.a.forEach(antDelete);
    _.a.forEach(antDelete);
  },
  'dev-reset-ant': X => {
    devResetAnt(F.a[0]); // Alias for the first ant
  },
  'dev-reset-allants': X => {
    [...F.a].forEach(a => devResetAnt(a));
  },
  'dev-antleft': X => {
    F.a[0].x = 10;
    antUpdate(F.a[0], getEl(F.a[0].id));
  },
  'dev-antcenter': X => {
    F.a[0].x = getEl('farm').offsetWidth / 2;
    antUpdate(F.a[0], getEl(F.a[0].id));
  },
  'dev-antright': X => {
    F.a[0].x = 950;
    antUpdate(F.a[0], getEl(F.a[0].id));
  },
  'dev-antflip': X => {
    F.a[0].scale *= -1;
    antUpdate(F.a[0], getEl(F.a[0].id));
  },
  'dev-testtuns': X => {
    showLines = document.querySelector('#dev-lines').checked;
    getEl('L') && getEl('L').remove();
    toggleWaypoints(1);
    testTuns();
  },
  'dev-clearlines': X => {
    getEl('L') && getEl('L').remove();
  },
  'dev-togglepinswaypoints': X => {
    let wpOn = JSON.parse(localStorage.getItem('afsDevWP')) || false;
    localStorage.setItem('afsDevWP', !wpOn);
    toggleWaypoints(0, 1);
  },
  'dev-remove-tunnels': X => {
    const selectedTunnels = Array.from(document.querySelector('#dev-tunnel-list').selectedOptions).map(option => option.value);
    F.tuns = F.tuns.filter(tunnel => !selectedTunnels.includes(tunnel.id));
    selectedTunnels.forEach(tunnelId => {
      const tunnelElement = document.querySelector(`#${tunnelId}`);
      if (tunnelElement) tunnelElement.remove();
    });

    // Remove references to the deleted tunnels from other tunnels' .co property
    F.tuns.forEach(tunnel => {
      if (tunnel.co) {
        tunnel.co = tunnel.co.filter(coId => F.tuns.some(existingTunnel => existingTunnel.id === coId));
      }
    });
    save();
    location.reload();
  },
  'dev-request': X => {
    F.a.filter(a => livesInFarm(a)).forEach(ant => antFinna(ant, document.querySelector('#dev-act').value));
  },
  'dev-save': X => {
    save();
  },

  'dev-savestate': X => {
    let states = JSON.parse(localStorage.getItem('afsDevStates') || '[]');
    let now = new Date();
    let thetime = now.toLocaleString('en-US', {
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    states.push({ name: thetime, data: _ });
    localStorage.setItem('afsDevStates', JSON.stringify(states));
    renderDevStates();
  },
  'dev-gotoloc': X => {
    const locN = document.getElementById("loc-n").value;
    const location = { n: locN };
    if (locN === "top" && document.getElementById("loc-tx").value) {
      location.tx = +document.getElementById("loc-tx").value;
      ///if (document.getElementById("loc-tm").value) location.tm = +document.getElementById("loc-tm").value;
    }
    if (locN === "bg" && document.getElementById("loc-x").value && document.getElementById("loc-y").value) {
      location.x = +document.getElementById("loc-x").value;
      location.y = +document.getElementById("loc-y").value;
      ///if (document.getElementById("loc-tm").value) location.tm = +document.getElementById("loc-tm").value;
    }
    if (locN === "bot") {
      if (document.getElementById("loc-tun").value)  location.tun = document.getElementById("loc-tun").value;
      if (document.getElementById("loc-pc").value)  location.pc = +document.getElementById("loc-pc").value;
      if (document.getElementById("loc-pos").value) location.pos = document.getElementById("loc-pos").value;
    }
    goToLocation(F.a[0], location);
  },
};

// Handles the banned actions functionality.
const banAction = input => {
  let value = input.value.split('-');
  let checked = input.checked;
  acts[value[0]][value[1]] = !checked;
  let label = input.parentElement;
  checked ? label.classList.add('ban') : label.classList.remove('ban');
};

// Truncates a string.
let devTruncate = str => str.length > 15 ? str.slice(0, 12) + '…' : str;

// Saves form data to one localStorage item.
const devSave = (input) => {
  // Retrieve existing data or initialize empty object
  const devData = JSON.parse(localStorage.getItem('afsDev')) || {};
  // Save the new value
  devData[input.id] = input.type === 'checkbox' ? input.checked : input.value;
  // Store the updated object
  localStorage.setItem('afsDev', JSON.stringify(devData));
};

// Loads form data from one localStorage item.
const devLoad = (input) => {
  const devData = JSON.parse(localStorage.getItem('afsDev')) || {};
  // Apply the saved value if it exists
  const devSavedValue = devData[input.id];
  if (devSavedValue !== undefined) {
    if (input.type === 'checkbox') {
      input.checked = devSavedValue;
    } else {
      input.value = devSavedValue;
    }
  }
};

// Handles the save-state functionality.
const renderDevStates = () => {
  let states = JSON.parse(localStorage.getItem('afsDevStates') || '[]');
  let container = document.getElementById('devstates');
  container.innerHTML = '';

  states.forEach((state, i) => {
    let row = document.createElement('div');

    // Input for name
    let input = document.createElement('input');
    input.value = state.name;
    input.id = 'state' + getTime() + '-' + i;
    input.addEventListener('change', () => {
      states[i].name = input.value;
      localStorage.setItem('afsDevStates', JSON.stringify(states));
      renderDevStates(); // redraw
    });

    // Load button
    let loadBtn = document.createElement('button');
    loadBtn.textContent = '📤 Load';
    loadBtn.addEventListener('click', () => {
      // update name too (in case it was edited but not blurred)
      states[i].name = input.value;
      localStorage.setItem('afsDevStates', JSON.stringify(states));

      let spawnerVal = spawner;

      // load the data into global _
      _ = states[i].data;

      // Refresh farm
      getEl('kit').remove();
      switchFarm(_.F);

      // Restore stopAnts from localStorage (default false)
      stopAnts = localStorage.getItem('stopAnts') === 'true';
      document.querySelector('#dev-stopants').checked = !stopAnts;
      document.querySelector('#dev-stopants-label').textContent = stopAnts ? '▶️ Start ants' : '🛑 Stop ants';

      devDrawFarmSupplement();

      renderDevStates();
      spawner = spawnerVal;
    });

    // Delete button
    let delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.addEventListener('click', () => {
      states.splice(i, 1);
      localStorage.setItem('afsDevStates', JSON.stringify(states));
      renderDevStates();
    });

    row.appendChild(input);
    row.appendChild(loadBtn);
    row.appendChild(delBtn);
    container.appendChild(row);
  });
};

// Clears the form data from localStorage.
const devClear = () => {
  localStorage.removeItem('afsDev');
  location.reload();
};

// Displays the HTML output of an object.
const devObjectDisplay = obj => {
  let html = '';
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      html += `<span class="row"><span class="label">${key}:</span><span class="value">${typeof obj[key] === 'object' && obj[key] !== null ? devObjectDisplay(obj[key]) : obj[key]}</span></span>`;
    }
  }
  return `<div>${html || '<em>(empty)</em>'}</div>`;
};

// Displays the HTML of calculated properties of an ant.
const devAntCalcDisplay = ant => {
  if (ant) return `
    <div class="row"><span class="label">antGetX:</span><span class="value">${antGetX(ant)}</span></div>
    <div class="row"><span class="label">antGetY:</span><span class="value">${antGetY(ant)}</span></div>
    <div class="row"><span class="label">antGroundLevel:</span><span class="value">${antGroundLevel(ant)}</span></div>
    <div class="row"><span class="label">Classes:</span><span class="value">${getEl(ant.id) ? getEl(ant.id).className.split(' ').join('<br>') : '?'}</span></div>
  `;
  return '<em>(no ant)</em>';
};

// Displays the HTML of an ant object.
let devAntTimer;
const devAntDisplay = () => {
  if (getEl('devant')) {
    getEl('devant').remove();
    clearInterval(devAntTimer);
    devAntTimer = null;
    getEl('devAntDisplayText').innerText = 'Display first ant object 👉';
    return;
  }
  else {
    appendHTML(B, `<div id="devant">
      <h2>First ant</h2>
      <hr>
      <div id="devAntDisplay"></div>
      <hr>
      <h3>Calculated</h3>
      <div id="devAntCalc">
      </div>
    </div>`);
    devAntTimer = setInterval(X => {getEl('devAntDisplay').innerHTML = devObjectDisplay(F.a[0]); getEl('devAntCalc').innerHTML = devAntCalcDisplay(F.a[0])}, frameTick);
    getEl('devAntDisplayText').innerText = 'Conceal first ant object 🤜';
  }

};

const updateCountdown = (countdownEls, timeLeft, timer) => {
  if (timeLeft > 0) {
    countdownEls.forEach(el => el.textContent = ` (${timeLeft}s)`);
  } else {
    countdownEls.forEach(el => el.textContent = "");
    clearInterval(timer);
  }
};

const devDrawFarmSupplement = () => {
  // Re-enable waypoints if they were on last time.
  let wpOn = JSON.parse(localStorage.getItem('afsDevWP')) || false;
  wpOn && toggleWaypoints();
};

const devResetAnt = (ant) => {
  if (ant && ant.state == 'cap') {
    ant.r = 90;
    ant.x = getEl('farm').offsetWidth / 2;
    ant.y = antGroundLevel(ant);
    ant.q = [{act:'idle'}];
    ant.area = {n:'top',d:0,t:0};
    ant.md = 100;
    ant.hp = 100;
    ant.fd = 100;
    ant.dr = 100;
    ant.digDur = 0;
    ant.side = 1;
    antUpdate(ant);
  }
};

/////////////////////////
// Load the dev panel. //
/////////////////////////
window.onload = function() {
  devPanel();
}
