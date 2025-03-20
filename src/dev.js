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

// Create a global variable to let the main program make certain decisions differently when in developer mode.
let dev = 1;

// Draws a line defined in the obj parameter.
const debugLine = (obj, score = 100) => {
  if (showLines) {
    bb = getEl('fill')[getRekt]();
    drawLine(bb.x + obj.x1, bb.y + obj.y1, bb.x + obj.x2, bb.y + obj.y2, score);
  }
};

// Draws a line defined in the parameters.
const drawLine = (x1, y1, x2, y2, score) => {
  !getEl('L') && appendHTML(B, `<div id="L" style="position: absolute; z-index: 1; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></div>`);
  let lineContainer = getEl('L'),
    line = document.createElement('div'),
    length = Math.hypot(x2 - x1, y2 - y1),
    angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  Object.assign(line.style, {
    position: 'absolute',
    width: `${length}px`,
    height: '2px',
    backgroundColor: `hsl(${(1 - score) * 240}, 100%, 50%)`,
    opacity: Math.max(score, .1),
    transformOrigin: '0 0',
    transform: `rotate(${angle}deg)`,
    left: `${x1}px`,
    top: `${y1}px`
  });
  lineContainer.appendChild(line);
};

// Toggles the display of waypoint pins.
const togglePins = off => {
  if (getEl('pins')) {
    getEl('pins')[rem]();
  }
  else if (!off && getEl('farm')) {
    appendHTML(getEl('farm'), `<div id="pins" class="fill"></div>`);
    let pinsCont = getEl('pins');
    F.tuns.forEach(t => {
      t.pl && t.pl.forEach(pl => {
        let line = document.createElement('div'),
          length = Math.hypot(pl.x2 - pl.x1, pl.y2 - pl.y1),
          angle = Math.atan2(pl.y2 - pl.y1, pl.x2 - pl.x1) * (180 / Math.PI);
        Object.assign(line.style, {
          position: 'absolute',
          width: `${length}px`,
          height: '2px',
          backgroundColor: '#ff0000',
          opacity: .1,
          transformOrigin: '0 0',
          transform: `rotate(${angle}deg)`,
          left: `${pl.x1}px`,
          top: `${pl.y1}px`
        });
        pinsCont.appendChild(line);
      });
      t.p && t.p.forEach(p => {
        appendHTML(pinsCont, `<div class="pin pin-${t.t} pinup-${p.up} pinde-${p.de} pinI-${p.i}" style="position: absolute; top: ${p.y - 1}px; left: ${p.x - 1}px;"></div>`);
      });
      if (t.t == 'con' || t.t == 'ent') {
        appendHTML(pinsCont, `<div class="pinC pinC-${t.t}" style="position: absolute; top: ${(t.y1 - t.w/2)-.5}px; left: ${(t.x1 - t.h/2)-.5}px; width: ${t.w}px; height: ${t.h}px; opacity: .7"></div>`);
      }
    });
  }
}

// Creates a fully formed tunnel system.
const testTuns = X => dumpFarm(1) || timer(X => F.tuns.forEach(t => {t.prog = 100; drawTun(t)}) || F.hills.forEach(h => {h.h = 25 + randomInt(25); drawHill(h)}), 0);

// Dispays the developer panel.
const devPanel = X => {
  let devParams = new URLSearchParams(window.location.search);
  if (!devParams.get('dev')) return;


  let devDropOpts = '';
  Object.keys(items).sort((a, b) => items[a].n.localeCompare(items[b].n)).forEach(item => devDropOpts += `<option value="${item}">${devTruncate(items[item].n) + ' (' + item + ')'}</option>`);

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
  
      <hr>
  
      <select name="dev-drop-item" id="dev-drop-item">${devDropOpts}</select>
      <button id="dev-drop">🎁 Drop</button>
  
      <hr>
  
      <button id="dev-ss">🚀 Super speed</button>
      <label><input type="checkbox" id="dev-ss-reapply" name="dev-ss-reapply">reapply</label>
      <br>
      <button id="dev-ns">🐌 Normal speed</button>
      <br>
      <span id="framerate">50fps</span> <button id="dev-rs">📉 Reduce fps</button>
  
      <hr>

      <button id="dev-spawner">🚫 Disable free ant spawner</button>
      <br>
      <button id="dev-spawnant">🐜 + Ant spawn</button>
      <br>
      <button id="dev-stopants">🛑 Stop ants</button>
      <button id="dev-clearants">🗑️ Clear all ants</button>

      <a style="font-size:1.2em" onClick="devAntDisplay()">Display first ant object &raquo;</a>
      <br>
      
      
      <hr>
  
      Clone # <input type="number" id="dev-clone-x" name="dev-clone-x" min="1" value="3">
      <button id="dev-clone">👯 Clone</button>
      <br>
      <button id="dev-bite">🧛 Ant bite</button>
      <button id="dev-clearbite">🧴 Clear bite</button>
      <button id="dev-cologne">💨 Cologne</button>


      <hr>
  
      <select name="dev-act" id="dev-act">${devActsOpts}</select>
      <button id="dev-request">📢 Request action</button>

      <h3>Allowed Random Actions</h3>
      <div id="dev-banned-acts">
        ${devBannedActsOpts}
      </div>


      <hr>

      <button id="dev-testtuns">⛏️ Test tuns</button>
      <label><input type="checkbox" id="dev-lines" name="dev-lines"> show lines</label>
      <br>
      <button id="dev-clearlines">🧹 Clear lines</button>
  
      <button id="dev-togglepins">📌 Toggle pins</button>
      

      <hr>

      <button id="dev-save" style="margin-bottom: .5em" disabled>💾 Save game</button>
      <br>
      Use after editing vars <input class="devinput" type="text" name="_" value="_" disabled> and <input class="devinput" type="text" name="F" value="F" disabled> in console

      <hr>
      
      Note: <input class="devinput" type="text" name="Q" value="Q()" style="width:1.6em;" disabled> in console will clear game data
      <br>
      <a onClick="devClear()">Reset form and reload</a>
  
    </div>
    <style>
      #dev, #devant {
        position: absolute; 
        top: 0.5em; 
        left: 0.5em;
        padding: .5em .25em;
        background: rgba(255,255,255,.7);
        border-radius: 5px;
        z-index: 999;
        font-size: .75em;
        text-align: center;
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
    </style>
  `);

  // Handle form inputs.
  document.querySelectorAll('#dev input, #dev select').forEach(input => {
    devLoad(input);
    input.addEventListener('change', X => devSave(input));
  });

  // Handle form buttons.
  document.querySelectorAll('#dev button').forEach(butt => {
    butt.addEventListener('click', event => devButtFunk[event.target.id]());
  });

  // Banned actions.
  document.querySelectorAll('#dev-banned-acts input').forEach(cb => {
    cb.addEventListener('change', event => banAction(cb));
  });

  // Enable save button after 30s, same as the save() function.
  timer(X => {document.querySelector('#dev-save').disabled = 0}, standardDelay);

  // Apply settings on load.
  timer(X => {
    if (_.ss && document.querySelector('#dev-ss-reapply').checked) devButtFunk['dev-ss']();
    document.querySelectorAll('#dev-banned-acts input').forEach(cb => banAction(cb));
  }, 50);

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
  'dev-ss': X => {
    SS();
    clearInterval(devSpeedCheck);
    devSpeedCheck = setInterval(X => {
      if (!_.ss) document.querySelector('#dev-ss-reapply').checked ? timer(X => devButtFunk['dev-ss'](), 1000) : clearInterval(devSpeedCheck);
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
    clearBite();
  },
  'dev-cologne': X => {
    cologne();
  },
  'dev-clone': X => {
    clone(document.querySelector('#dev-clone-x').value);
  },
  'dev-spawnant': X => {
    spawnAnt();
  },
  'dev-clearants': X => {
    while(F.a[len]) F.a.forEach(a => deleteAnt(a));
  },
  'dev-spawner': X => {
    spawner = 0;
    document.querySelector('#dev-spawner').disabled = 1;
  },
  'dev-testtuns': X => {
    showLines = document.querySelector('#dev-lines').checked;
    getEl('L') && getEl('L')[rem]();
    togglePins(1);
    testTuns();
  },
  'dev-clearlines': X => {
    getEl('L') && getEl('L')[rem]();
  },
  'dev-togglepins': X => {
    togglePins();
  },
  'dev-request': X => {
    F.a.filter(a => livesInFarm(a)).forEach(ant => antFinna(ant, document.querySelector('#dev-act').value));
  },
  'dev-stopants': X => {
    stopAnts = 1;
    document.querySelector('#dev-stopants').disabled = 1;
  },
  'dev-save': X => {
    save();
  },
};

// Handles the banned actions functionality.
const banAction = input => {
  let value = input.value.split('-');
  let checked = input.checked;
  acts[value[0]][value[1]] = !checked;
  let label = input.parentElement;
  checked ? label.classList.add('ban') : label.classList[rem]('ban');
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
    <div class="row"><span class="label">getAntX:</span><span class="value">${getAntX(ant)}</span></div>
    <div class="row"><span class="label">getAntY:</span><span class="value">${getAntY(ant)}</span></div>
    <div class="row"><span class="label">getAntGroundLevel:</span><span class="value">${getAntGroundLevel(ant)}</span></div>
    <div class="row"><span class="label">Classes:</span><span class="value">${getEl(ant.id) ? getEl(ant.id).className.split(' ').join('<br>') : '?'}</span></div>
  `;
  return '<em>(no ant)</em>';
};

// Displays the HTML of an ant object.
const devAntDisplay = () => {
  getEl('devant') && getEl('devant')[rem]();
  appendHTML(B, `<div id="devant">
    <h2>First ant</h2>
    <hr>
    <div id="devAntDisplay"></div>
    <hr>
    <h3>Calculated</h3>
    <div id="devAntCalc">
    </div>
  </div>`);
  setInterval(X => {getEl('devAntDisplay')[innerHTML] = devObjectDisplay(F.a[0]); getEl('devAntCalc')[innerHTML] = devAntCalcDisplay(F.a[0])}, frameTick);
};


/////////////////////////
// Load the dev panel. //
/////////////////////////
window.onload = function() {
  devPanel();
};