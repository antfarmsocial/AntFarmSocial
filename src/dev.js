/*
 * Ant Farm Social
 * dev.js (Developer assistant)
 *
 * This file contains functions to help developers.
 * It is not included in production releases, and may not be written as carefully as the main program.
 * This script is included in the app when gulp is run with the --dev flag.
 * Most of the functionality is easily accessible in a GUI when ?dev=1 is added to the app's URL.
 *
 * UPDATE: This file has been restructured so that the HTML/CSS/JS for any piece of dev functionality
 * is all very close together for ease of editing.  KEEP THAT GOING!
 *
 *
 * STRUCTURE OF THIS FILE
 *
 * 1. Global state and utility functions used throughout the app.
 * 2. Feature definitions - everything displayed in the developer panel comes from a "feature".
 *    Each feature's HTML, CSS, JS, and helpers are co-located, as well as any directly related global vars/funcs.
 *    Features are grouped into sections (devSecXXXX arrays), then pushed into a devSections config
 *    which is supplied to the panel builder function.
 * 4. devPanel() - collects CSS, builds and mounts the dev panel - kind of the master dev function.
 * 5. window.onload - entry point that call devPanel().
 *
 * HOW TO ADD A FEATURE
 *
 *   const myFeature = devFeature('My Feature Label');
 *   myFeature.html = `...`;
 *   myFeature.css = `...`; // Shared / Long styles that can't be inlined.
 *   myFeature.switch = () => {...}; // Hook func for farm switch / stale data.
 *   secSomething.push(myFeature);
 *
 * devFeature(name) takes the one param every feature needs; everything
 * else (.config, .html, .js, .css, .switch) is set directly on the
 * returned object, so there's one consistent way to configure the rest of
 * a feature - assignment.
 *   name    - human label; also the seed for the wrapper div ID (slugified).
 *   config  - optional object: {collapsible, collapsed, id}
 *             collapsible: wrap in <details>/<summary>  (default false)
 *             collapsed:   start closed                 (default false)
 *             id:          override the auto-derived id (default: none)
 *   html    - inner HTML string for the feature.
 *   id      - read-only getter; config.id if set, else devId(name) live.
 *
 * devId(label)  - slugifies a label to a DOM id: "Ant Points" -> "dev-ant-points"
 * devInput(label, type, opts) - builds labelled input string with auto id/name.
 * devButt(label, opts)        - builds button string with auto id.
 * devToggle(label, opts)      - builds toggle control html string.
 *
 *
 */

/*
 * ============================================================
 * GLOBAL STATE
 * ============================================================
 */

let dev = 1;
let devLoaded = 0;
let devListeners = [];
let devRegistry = [];
let devGlobalCSS = '';


/*
 * ============================================================
 * GLOBAL UTILITIES
 * Used by multiple features; anything used by only one feature
 * lives with that feature below.
 * ============================================================
 */

// Slugifies a label to a DOM id: "Ant Points" -> "dev-ant-points"
const devId = label => 'dev-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Builds a labelled <input> with id and name derived from label.
// opts: {value, min, max, checked, wrapLabel, attrs, click, change}
// attrs takes any raw attribute string, including class="..."
const devInput = (label, type = 'text', opts = {}) => {
  const id = opts.id || devId(label);
  const attrs = [
    `type="${type}"`,
    `id="${id}"`,
    `name="${id}"`,
    opts.value !== undefined ? `value="${opts.value}"` : '',
    opts.min !== undefined ? `min="${opts.min}"` : '',
    opts.max !== undefined ? `max="${opts.max}"` : '',
    opts.checked ? 'checked' : '',
    opts.attrs || '',
  ].filter(Boolean).join(' ');
  if (opts.click) devListeners.push({id, event: 'click', fn: opts.click});
  if (opts.change) devListeners.push({id, event: 'change', fn: opts.change});
  const input = `<input ${attrs}>`;
  if (type === 'checkbox' && opts.wrapLabel !== false) {
    const spanId = opts.labelId || (id + '-label');
    return `<label>${input}<span id="${spanId}">${opts.labelText || label}</span></label>`;
  }
  return input;
};

// Builds a <button> with id derived from label.
// opts: {prefix, id (override), attrs, click}
const devButt = (label, opts = {}) => {
  const prefix = opts.prefix ? `<span class="dev-btn-prefix">${opts.prefix}</span>` : '';
  const extra = opts.attrs || '';
  const id = opts.id || devId(label);
  if (opts.click) devListeners.push({id, event: 'click', fn: opts.click});
  return `<button id="${id}" ${extra}>${prefix}${label}</button>`;
};

// Builds a <select> with id/name derived from label.
// options: raw HTML string, or an object {value: text} to auto-convert.  Bonus: text can be an array with [class, text] instead.
// opts: {id (override), attrs, click, change}
const devSelect = (label, options, opts = {}) => {
  const id = opts.id || devId(label);
  const extra = opts.attrs || '';
  if (opts.click) devListeners.push({id, event: 'click', fn: opts.click});
  if (opts.change) devListeners.push({id, event: 'change', fn: opts.change});
  if (options !== null && typeof options === 'object') {
    options = Object.entries(options)
      .map(([value, text]) => {
        let outText = '';
        let outClass = '';
        if (Array.isArray(text)) {
          outText = text[1];
          outClass = text[0];
        }
        else outText = text;
        return `<option class="${outClass}" value="${value}">${outText}</option>`;
      }).join('');
  }
  return `<select id="${id}" name="${id}" ${extra}>${options}</select>`;
};

// Builds a toggle control.
// opts: {id (override), checked, text (string or on/off array), prefix, toggle, attrs}
const devToggle = (label, opts = {}) => {
  // Resolve a value that may be a plain string or array for a given state.
  const resolve = (val, checked, fallback) => {
    if (val === undefined) return fallback;
    if (Array.isArray(val)) return checked ? val[0] : val[1];
    return val;
  };
  const id = opts.id || devId(label);
  const labelId = id + '-label';
  const render = checked => {
    const prefix = resolve(opts.prefix, checked, checked ? '✅' : '🚫');
    const text = resolve(opts.text, checked, '');
    return (prefix ? `<span class="dev-tog-prefix">${prefix}</span>` : '') +  `<span class="dev-tog-lbl">${text}</span>`;
  };
  const onChange = () => {
    const checkbox = getEl(id);
    opts.toggle && opts.toggle(checkbox.checked);
    getEl(labelId).innerHTML = render(checkbox.checked);
  };
  return `<span class="dev-toggle">${devInput(label, 'checkbox', {id, checked: opts.checked, labelId, labelText: render(opts.checked), attrs: opts.attrs, change: onChange})}</span>`;
};

// Builds a feature.
// {config {id (override), collapsible, collapsed}, html, css, js, switch}
const devFeature = name => ({
  name,
  config: {},
  html: '',
  css: '',
  js: null,
  switch: null,
  get id() {
    return this.config.id || devId(this.name);
  },
});

// Builds a panel.
// config: {id (override), name, html, config}
const devBuildPanel = (title, id, sections) => {
  let resolvedId = id || devId(title);
  devRegistry.push({title: title, id: resolvedId, sections: sections});
  let html = `<div id="${resolvedId}" class="dev-panel"><h2>${title}</h2>`;
  sections.forEach((section, si) => {
    html += `<div class="dev-sec-${si} dev-sec">`;
    section.forEach(feat => {
      if (feat.config.collapsible) {
        html += `
          <div id="${feat.id}-wrap" class="dev-feature">
            <details id="${feat.id}" ${feat.config.collapsed ? '' : 'open'}>
              <summary>${feat.name}</summary>
              <div class="dev-feature">${feat.html}</div>
            </details>
          </div>`;
      }
      else {
        html += `<div id="${feat.id}-wrap" class="dev-feature">${feat.html}</div>`;
      }
    });
    html += `</div>`;
  });
  html += `</div>`;
  return html;
};

// Mounts a panel into the DOM.
// opts: {css}
const devMountPanel = (title, id, sections, opts = {}) => {
  let css = '';
  sections.forEach(section => {
    section.forEach(f => {
      if (f.css) css += f.css + '\n';
    });
  });
  // Mount structural HTML
  appendHTML(B, devBuildPanel(title, id, sections));
  // Inject shared styles + collected feature CSS into a per-panel tag.
  const styleId = `${id}-styles`;
  if (!getEl(styleId)) {
    appendHTML(B, `<style id="${styleId}">
      ${opts.css || ''}
      ${css}
    </style>`);
  }
  // Drain queued listeners.
  devListeners.forEach(({id, event, fn}) => {
    const el = getEl(id);
    if (el) el.addEventListener(event, fn);
  });
  devListeners = [];
  // Persist inputs inside this panel.
  document.querySelectorAll(`#${id} input, #${id} select`).forEach(input => {
    devLoad(input);
    input.addEventListener('change', () => devSave(input));
  });
  // Persist <details> open/closed state inside this panel.
  document.querySelectorAll(`#${id} details[id]`).forEach(details => {
    const saved = JSON.parse(localStorage.getItem('afsDev') || '{}')[details.id];
    if (saved !== undefined) details.open = saved;
    details.addEventListener('toggle', () => {
      const devData = JSON.parse(localStorage.getItem('afsDev')) || {};
      devData[details.id] = details.open;
      localStorage.setItem('afsDev', JSON.stringify(devData));
    });
  });
  // Fire every toggle's change handler once now that devLoad has restored
  // checkbox state, so opts.toggle/label rendering reflect the loaded
  // value on mount (see devNotifySwitch for the equivalent on farm switch).
  document.querySelectorAll(`#${id} .dev-toggle input:not(.dev-skip-onload)`).forEach(checkbox => {
    checkbox.dispatchEvent(new Event('change'));
  });
  // Run feature scripts.
  sections.forEach(section => {
    section.forEach(f => {
      if (typeof f.js === 'function') f.js();
    });
  });
  const el = getEl(id);
  return {
    el,
    cleanup: () => {
      sections.forEach(section => {
        section.forEach(f => {
          if (typeof f.cleanup === 'function') f.cleanup();
        });
      });
      const styleEl = getEl(styleId);
      if (styleEl) styleEl.remove();
      if (el) el.remove();
    }
  };
};

// Persists one form input's value to the 'afsDev' localStorage key.
const devSave = input => {
  const devData = JSON.parse(localStorage.getItem('afsDev')) || {};
  devData[input.id] = input.type === 'checkbox' ? input.checked : input.value;
  localStorage.setItem('afsDev', JSON.stringify(devData));
};

// Restores one form input's value from the 'afsDev' localStorage key.
const devLoad = input => {
  const saved = JSON.parse(localStorage.getItem('afsDev') || '{}')[input.id];
  if (saved !== undefined) {
    if (input.type === 'checkbox') input.checked = saved;
    else input.value = saved;
  }
};

// Clears saved form data and reloads.
const devClear = () => {
  localStorage.removeItem('afsDev');
  location.reload();
};

// Triggers each feature's switch function.
// Called by the main app when the farm changes and also called by this script.
const devNotifySwitch = () => {
  let devParams = new URLSearchParams(window.location.search);
  if (!devParams.get('dev')) return;
  const runswitch = () => {
    document.querySelectorAll(`#dev .dev-toggle input:not(.dev-skip-onload)`).forEach(checkbox => {
      checkbox.dispatchEvent(new Event('change'));
    });
    devRegistry.forEach(panel => {
      panel.sections.forEach(section => {
        section.forEach(feat => {
          if (typeof feat.switch === 'function') feat.switch();
        });
      });
    });
  };
  if (devLoaded) runswitch();
  setTimeout(runswitch, 1000);
};


/*
 * ============================================================
 * SECTION: ANT INSPECTOR
 * ============================================================
 */

  const devSecTree = [];

  // Styles required by the dev-ant panel.
  devGlobalCSS += `
    #dev-ant {
      left: initial;
      right: .5em;
      bottom: .5em;
      width: 300px;
      text-align: left;
      user-select: auto;
    }
  `;

/*
 * ANT OBJECT TREE
 */
  {
    const feat = devFeature('Ant Object Tree');

    feat.html = `<div id="dev-ant-tree"></div>`;
    feat.css = `
      #dev-ant {
        &.isInfant:not(.isDead) {
          background: rgba(253, 244, 189, 0.8);
        }
        &.isDead {
          background: rgba(155, 155, 155, 0.8);
        }
        &.isEgg {
          background: rgba(118, 255, 113, 0.8);
        }
        &.isQueen {
          background: rgba(255, 161, 255, 0.8);
        }
        div {
          font-family: monospace;
          display: inline-block;
          width: 100%;
        }
        span {
          font-size: 14px;
        }
        h3 {
          text-align: center;
          font-weight: bold;
        }
        .row {
          display: block;
          padding: .25em;
          border-radius: 3px;
          .row {
            font-size: 80%;
            background: rgba(0,0,0,.04);
          }
        }
        .label {
          width: 3.5em;
          display: inline-block;
          text-align: right;
          font-weight: bold;
          color: green;
          vertical-align: top;
          margin-right: .4em;
        }
        .value {
          display: inline-block;
          text-overflow: ellipsis;
          color: blue;
          vertical-align: top;
        }
      }
    `;

    const isFloat = value => typeof value === 'number' && !isNaN(value) && !Number.isInteger(value);

    // Recursively builds the ant object tree HTML.
    const devObjectDisplay = obj => {
      let html = '';
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const val = typeof obj[key] === 'object' && obj[key] !== null
            ? devObjectDisplay(obj[key])
            : isFloat(obj[key]) ? obj[key].toFixed(2) : obj[key];
          html += `<span class="row"><span class="label">${key}:</span><span class="value">${val}</span></span>`;
        }
      }
      return `<div>${html || '<em>(empty)</em>'}</div>`;
    };

    let treeTimer = null;
    feat.js = () => {
      treeTimer = setInterval(() => {
        const treeEl = getEl('dev-ant-tree');
        const devAntEl = getEl('dev-ant');
        const firstAnt = F.a[0];
        if (firstAnt) {
          devAntEl.classList.toggle('isInfant', !!firstAnt.inf);
          devAntEl.classList.toggle('isEgg', !!firstAnt.egg);
          devAntEl.classList.toggle('isDead', !!isDead(firstAnt));
          devAntEl.classList.toggle('isQueen', !!isQueen(firstAnt));
        }
        if (treeEl) treeEl.innerHTML = devObjectDisplay(firstAnt);
      }, frameTick);
    };
    feat.cleanup = () => {
      clearInterval(treeTimer);
      treeTimer = null;
    };

    devSecTree.push(feat);
  }

/*
 * ANT CALCULATED VALUES
 */
  const devSecCalc = [];
  {
    const feat = devFeature('Ant Calculated Values');

    feat.html = `<div id="dev-ant-calc"></div>`;

    // This feature's style mostly piggybacks off the CSS of the "Ant object tree" feature.
    feat.css = `
      #dev-ant-calc .label {
        width: 10em;
      }
    `;

    // Builds the calculated-values HTML for one ant.
    const devAntCalcDisplay = ant => {
      if (ant) return `
        <div class="row"><span class="label">antFaceX:</span><span class="value">${antFaceX(ant).toFixed(2)}</span></div>
        <div class="row"><span class="label">antGroundLevel:</span><span class="value">${antGroundLevel(ant).toFixed(2)}</span></div>
        <div class="row"><span class="label">Classes:</span><span class="value">${getEl(ant.id) ? getEl(ant.id).className.split(' ').join('<br>') : '?'}</span></div>
      `;
      return '<em>(no ant)</em>';
    };

    let calcTimer = null;
    feat.js = () => {
      calcTimer = setInterval(() => {
        const calcEl = getEl('dev-ant-calc');
        if (calcEl) calcEl.innerHTML = devAntCalcDisplay(F.a[0]);
      }, frameTick);
    };
    feat.cleanup = () => {
      clearInterval(calcTimer);
      calcTimer = null;
    };

    devSecCalc.push(feat);
  }

/*
  * ============================================================
  * DEVANTSECTIONS - ordered list of sections to render
  * ============================================================
  */
  const devAntSections = [
    devSecTree,
    devSecCalc,
  ];


// ----------------------------------------------------------------------------




/*
 * ============================================================
 * SECTION: SCORES, DROPS & ACHIEVEMENTS
 * ============================================================
 */

const devSecScore = [];

// Truncates a string.
const devTruncate = str => str.length > 15 ? str.slice(0, 12) + '…' : str;

/*
 * SCORES & DROPS
 */
{
  // Build option lists.
  let devDropOpts = {};
  Object.keys(items)
    .filter(it => items[it].n)
    .sort((a, b) => items[a].n.localeCompare(items[b].n))
    .forEach(item => devDropOpts[item] = `${devTruncate(items[item].n)} (${item})`);

  let devAchOpts = {};
  Object.keys(ach).forEach(a => {
    if (ach[a].lvls) {
      for (let i = 1; i <= 3; i++)
        devAchOpts[`${a}-${i}`] = `${devTruncate(ach[a].ico)} ${devTruncate(ach[a].n)} (${a}) [${i * 3}]`;
    }
    else {
      devAchOpts[`${a}-0`] = `${devTruncate(ach[a].ico)} ${devTruncate(ach[a].n)} (${a})`;
    }
  });

  const feat = devFeature('Scores and Drops');
  feat.html = `
    ${devInput('Score', 'number', {value: 1})}
    ${devInput('Bonus', 'checkbox', {labelText: 'bonus'})}
    ${devButt('Score', {prefix: '➕', click: () => score(parseInt(getEl('dev-score').value), getEl('dev-bonus').checked)})}
    <br>
    ${devSelect('Drop Item', devDropOpts)}
    ${devButt('Drop', {prefix: '🎁', click: () => drop(getEl('dev-drop-item').value)})}
    <br>
    ${devSelect('Ach Item', devAchOpts)}
    ${devButt('Ach', {prefix: '🏆', click: () => {
      let a = getEl('dev-ach-item').value.split('-');
      _.ach[a[0]] = parseInt(a[1]) ? {l: parseInt(a[1]), v: parseInt(a[1]) * 3} : 1;
      queueAch(a[0]);
    }})}
  `;
  feat.config = {collapsible: true, collapsed: true};

  devSecScore.push(feat);
}


/*
 * ============================================================
 * SECTION: SPEED CONTROL
 * ============================================================
 */

const devSecSpeed = [];

/*
 * SPEED CONTROL
 */
{
  const feat = devFeature('Speed Control');
  let devSpeedCheck;

  feat.html = `
    ${devButt('Super Speed', {prefix: '🚀', click: () => {
      useItem(0, 0, 0, {k: 'speedo'});
      clearInterval(devSpeedCheck);
      devSpeedCheck = setInterval(() => {
        if (!_.ss) getEl('dev-ss-reapply').checked
          ? setTimeout(() => getEl('dev-super-speed').click(), 1000)
          : clearInterval(devSpeedCheck);
      }, 999);
      getEl('framerate').textContent = 1000 / frameTick + 'fps';
    }})}
    ${devInput('SS Reapply', 'checkbox', {labelText: 're-apply', id: 'dev-ss-reapply'})}
    <br>
    ${devButt('Normal Speed', {prefix: '🐌', click: () => {
      frameTick = 20;
      _.ss = 0;
      clearInterval(devSpeedCheck);
      getEl('framerate').textContent = 1000 / frameTick + 'fps';
    }})}
    <span id="framerate" class="monospace">50fps</span>
    <br>
    ${devButt('Reduce FPS', {prefix: '📉', click: () => {
      frameTick = frameTick * 2;
      getEl('framerate').textContent = 1000 / frameTick + 'fps';
    }})}
  `;
  feat.config = {collapsible: true, collapsed: true};

  devSecSpeed.push(feat);
}


/*
 * ============================================================
 * SECTION: POWER UPS
 * ============================================================
 */

const devSecPowerups = [];

/*
 * POWER UPS
 */
{
  const feat = devFeature('Power Ups');
  feat.html = `
    Clone # ${devInput('Clone X', 'number', {value: 3, min: 1, id: 'dev-clone-x'})}
    ${devButt('Clone', {prefix: '👯', click: () => clone(getEl('dev-clone-x').value)})}
    <br>
    ${devButt('Ant Bite', {prefix: '🧛', click: () => antBite(0, 1)})}
    ${devButt('Clear Bite', {prefix: '🧴', click: () => useItem(0, 0, 0, {k: 'antyvenom'})})}
    <br>
    ${devButt('Cologne', {prefix: '💨',  click: () => useItem(0, 0, 0, {k: 'cologne'})})}
  `;
  feat.config = {collapsible: true, collapsed: true};

  devSecPowerups.push(feat);
}


/*
 * ============================================================
 * SECTION: ANT MANAGEMENT
 * ============================================================
 */

const devSecAnts = [];

/*
 * SPAWNER TOGGLE
 */
{
  const feat = devFeature('Spawner');
  feat.html = devToggle('Spawner', {
    checked: true,
    text: 'Free ant spawner',
    toggle: checked => {
      spawner = checked;
      if (!spawner) {
        setTimeout(() => _.a.forEach(antDelete), 5);
      }
      else {
        spawnAnt();
      }
    },
  });

  devSecAnts.push(feat);
}

/*
 * STOP ANTS TOGGLE
 */
{
  const feat = devFeature('Stop Ants');

  feat.html = `
  ${devToggle('Stop Ants', {
    prefix: '',
    text: ['🛑 Stop ants', '▶️ Start ants'],
    checked: true,
    toggle: checked => {
      const wasStopped = stopAnts;
      stopAnts = !checked;
      if (wasStopped && !stopAnts) {
        F.a.forEach(a => isEggOrInf(a) || antAction(a));
      }
    },
  })}
  `;

  feat.css = `
    #dev-stop-ants-label .dev-tog-lbl {
      color: #222;
      text-decoration: none;
      background: #FFFF88;
      padding: .5em;
      margin: 1em;
      font-size: 1.4em;
      border-radius: 10px;
      font-weight: bold;
      display: block !important;
    }
  `;

  devSecAnts.push(feat);
}

/*
 * ANT MANAGEMENT
 */
{
  const feat = devFeature('Ant Management');
  feat.config = {collapsible: true, collapsed: false};

  feat.html = `
    ${devButt('+ Ant Spawn', {prefix: '🐜', click: () => {
      let spawnState = spawner;
      spawner = 1;
      spawnAnt(0);
      spawner = spawnState;
    }})}
    ${devButt('Clear All Ants', {prefix: '🗑️', click: () => {F.a.forEach(antDelete); _.a.forEach(antDelete)}})}
    <br>
    ${devButt('Clear Dead', {prefix: '💀', click: () => F.a.filter(isDead).forEach(antDelete)})}

    ${devButt('Reset All Ants', {prefix: '🔄', click: () => [...F.a].forEach(a => a.egg || devResetAnt(a))})}
  `;

  devSecAnts.push(feat);
}

/*
 * ANT INSPECTOR TOGGLE
 */
{
  const feat = devFeature('Ant Inspector');

  let devAntMounted = null;

  feat.html = devToggle('Ant Inspector', {
    prefix: '',
    text: ['Conceal first ant object 🤜', 'Display first ant object 👉'],
    toggle: checked => {
      if (checked) {
        if (getEl('dev-ant')) return;
        devAntMounted = devMountPanel('First ant', 'dev-ant', devAntSections);
      }
      else {
        if (devAntMounted) {
          devAntMounted.cleanup();
          devAntMounted = null;
        }
        else {
          // fallback: preserve original cleanup behavior
          devAntSections.forEach(section => {
            section.forEach(feat => {
              if (typeof feat.cleanup === 'function') feat.cleanup();
            });
          });
          const panel = getEl('dev-ant');
          if (panel) panel.remove();
        }
      }
    },
  });

  feat.css = `
    #dev-ant-inspector-label > .dev-tog-lbl {
      background: #EEEEEE;
      display: block;
      padding: .25em .5em;
      margin: 1em .75em;
      border-radius: 5px;
      border: 2px solid #C3D9FF;
      font-family: monospace;
      font-weight: bold;
      font-size: 1.4em;
      line-height: 1.4em;
      text-decoration: none;
      color: #356AA0;
    }
  `;

  devSecAnts.push(feat);
}


/*
 * FIRST ANT CONTROLS
 */

// Resets a captured ant back to a neutral surface state.
const devResetAnt = ant => {
  let stopVal = stopAnts;
  stopAnts = 1;
  if (ant && ant.state == 'cap') {
    ant.r = 0;
    ant.x = getEl('farm').offsetWidth / 2;
    ant.y = antGroundLevel(ant);
    ant.q = [{act: 'idle'}];
    ant.area = {n: 'top', d: 0, t: 0};
    ant.md = 100;
    ant.hp = 100;
    ant.fd = 100;
    ant.dr = 100;
    ant.digDur = 0;
    ant.side = 1;
    ant.scale = 1;
    ant.f = F.id;
    del(ant, 'carry', 'hist', 'nipPh', 'nipTs');
    const index = F.a.findIndex(a => ant.id === a.id);
    if (index !== -1) {
      F.a[index] = cloneData(F.a[index]);
      ant = F.a[index];
    }
    setTimeout(() => {stopAnts = stopVal; antSurface(ant); antRemAnimUpdate(ant);}, 300);
  }
};

{
  const feat = devFeature('First Ant Controls');
  feat.config = {collapsible: true, collapsed: false};

  feat.html = `
    ${devButt('Reset First Ant', {prefix: '🔄', click: () => devResetAnt(F.a[0])})}


    ${devToggle('Go', {
      prefix: '',
      text: ['⏹️ No', '▶️ Go'],
      checked: false,
      attrs: `class="dev-skip-onload dev-btn-style"`, // Don't restore/auto-trigger from storage.
      toggle: checked => {
        stopAnts = checked ? 0 : 1;
        if (checked) antAction(F.a[0]);
      },
    })}

    <br>
    ${devButt('L', {prefix: '⬅️', click: () => {F.a[0].x = 10; antUpdate(F.a[0], getEl(F.a[0].id));}})}
    ${devButt('C', {prefix: '⏺️', click: () => {F.a[0].x = getEl('farm').offsetWidth / 2; antUpdate(F.a[0], getEl(F.a[0].id));}})}
    ${devButt('R', {prefix: '➡️', click: () => {F.a[0].x = 950; antUpdate(F.a[0], getEl(F.a[0].id));}})}
    ${devButt('Flip', {prefix: '↔️', click: () => {F.a[0].scale *= -1; antUpdate(F.a[0], getEl(F.a[0].id));}})}
    <br>
    ${devButt('Cycle ant order', {prefix: '↳', attrs: 'style="font-size:.92em;"', click: () => F.a.push(F.a.shift())})}
  `;

  devSecAnts.push(feat);
}

/*
 * ============================================================
 * SECTION: ACTION CONTROL
 * ============================================================
 */

const devSecActions = [];

/*
 * DIRECTOR TOGGLE
 */
{
  const feat = devFeature('Director');

  feat.html = `${devToggle('Director', {
    checked: true,
    text: 'Director loop',
    toggle: checked => {
      clearInterval(dirInterval);
      if (checked) {
        dirInterval = setInterval(director, standardDelay);
        getEl("dev-director-tog-extra").innerHTML = '<span style="color: #006400;">(Called every 30 seconds)</span>';
      }
      else {
        getEl("dev-director-tog-extra").innerHTML = '<span style="color: #8B0000;">(Called once on load)</span>';
      }
    },
  })}<div style="opacity: .7;" id="dev-director-tog-extra"></div>`;

  devSecActions.push(feat);
}

/*
 * ALLOWED RANDOM ACTIONS
 */

// Global state.
let allActs = cloneData(acts);

{
  const feat = devFeature('Allowed Random Actions');
  feat.config = {collapsible: true, collapsed: false};

  // Handles the banned action state for a single checkbox.
  const banAction = (devArea, devAct, allowed) => {
    if (allowed) {
      if (!acts[devArea].includes(devAct)) acts[devArea].push(devAct);
    }
    else {
      acts[devArea] = acts[devArea].filter(a => a != devAct);
    }
  };

  const devAreas = Object.keys(acts);
  let bodyHtml = '';
  devAreas.forEach(devArea => {
    const areaLabel = devArea == 'bg' ? 'BG area' : devArea == 'top' ? 'Top area' : 'Bottom area';
    let devAreaActs = allActs[devArea];
    let defaultAct = devAreaActs[0]; // Default action - not controllable, shown plain.
    bodyHtml += `<div class="dev-banned-acts-group" style="margin-bottom: .25em;">`;
    bodyHtml += `<div style="text-align: center"><b>${areaLabel}</b></div>`;
    bodyHtml += `<div style="text-align: center">${defaultAct}`;
    devAreaActs.slice(1).forEach(devAct => {
      bodyHtml += devToggle(`Banned Act ${devArea} ${devAct}`, {
        checked: true, // Default: allowed.
        prefix: '',
        text: devAct,
        toggle: (checked) => banAction(devArea, devAct, checked),
      });
    });
    bodyHtml += '</div>';
    bodyHtml += '</div>';
  });

  feat.html = `
    <div id="dev-banned-acts">${bodyHtml}</div>
    <p>Some actions not listed are forced.<br>Disable <em>Director loop</em> to avoid all.</p>
  `;

  feat.css = `
    #dev-banned-acts {
      text-align: left;
      margin-bottom: .25em;
      .dev-toggle label::before {
        content: ' | ';
      }
      .dev-tog-lbl {
        font-size: 1em;
        font-weight: normal;
      }
    }
  `;

  devSecActions.push(feat);
}

/*
 * MASS ACTION
 */
{
  const feat = devFeature('Mass Action');
  feat.config = {collapsible: true, collapsed: true};

  let devActsOpts = {};
  keys(acts).forEach(areakey =>
    acts[areakey].forEach(a => {
      devActsOpts[`${areakey}-${a}`] = `${areakey}: ${a}`;
    })
  );

  feat.html = `
    ${devSelect('Act', devActsOpts)}
    ${devButt('Request Action', {prefix: '📢', click: () => {
      let requested = getEl('dev-act').value.split('-');
      F.a.filter(a => isCapped(a)).forEach(ant => antFinnaVia(ant, requested[1], {via: requested[0]}));
    }})}
  `;

  devSecActions.push(feat);
}

/*
 * GO TO LOCATION
 */
{
  const feat = devFeature('Go To Location');
  feat.config = {collapsible: true, collapsed: true};

  feat.html = `
    <div id="locForm">
      <div>
        <label>
          ${devSelect('Loc N', {'bot': 'Bottom area', 'top': 'Top area', 'bg': 'BG area'}, {id: 'loc-n'})}
        </label>
      </div>
      <div data-show="top" hidden>
        <label>x <input type="range" name="loc-tx" id="loc-tx" min="1" max="959"><output>0</output></label>
      </div>
      <div data-show="bg" hidden>
        <label>x <input type="range" name="loc-x" id="loc-x" min="1" max="959"><output>0</output></label>
      </div>
      <div data-show="bg" hidden>
        <label>y <input type="range" name="loc-y" id="loc-y" min="301" max="509"><output>0</output></label>
      </div>
      <div data-show="bot" hidden>
        <label>Tun ${devSelect('Loc Tun', '', {id: 'loc-tun'})}</label>
      </div>
      <div data-show="bot" hidden>
        <label>% <input type="range" name="loc-pc" id="loc-pc" min="0" max="100"><output>0</output></label>
      </div>
      <div data-show="bot" hidden>
        <label>Pos
          ${devSelect('Loc Pos', {'': '- none -', 'u': 'Up', 'd': 'Down', 'm': 'Mid'}, {id: 'loc-pos'})}
        </label>
      </div>
      ${devButt('Go', {id: 'dev-gotoloc', prefix: '📍', click: () => {
        const locN = getEl('loc-n').value;
        const location = {n: locN};
        if (locN === 'top' && getEl('loc-tx').value)
          location.tx = +getEl('loc-tx').value;
        if (locN === 'bg') {
          location.x = +getEl('loc-x').value;
          location.y = +getEl('loc-y').value;
        }
        if (locN === 'bot') {
          if (getEl('loc-tun').value) location.tun = getEl('loc-tun').value;
          if (getEl('loc-pc').value) location.pc = +getEl('loc-pc').value;
          if (getEl('loc-pos').value) location.pos = getEl('loc-pos').value;
        }
        goToLocation(F.a[0], location);
      }})}
      <div>(first ant)</div>
    </div>
  `;

  feat.css = `
    #locForm {
      background: rgba(212,212,212,.35);
      border-radius: 10px;
      padding: 10px;
      margin: 10px;
      margin-top: 0;
      > div {
        margin-bottom: .5em;
      }
      output {
        display: inline-block;
        width: 2em;
      }
    }

  `;

  // Populates #loc-tun's options from the current farm's tunnels.
  // Clears existing options first since this can run again on farm switch.
  const buildLocTunOptions = () => {
    const locTun = getEl('loc-tun');
    if (!locTun) return;
    locTun.innerHTML = '';
    F.tuns.slice().sort((a, b) => a.y1 - b.y1).forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.t == 'con' ? '🟣' : t.t == 'jun' ? '🟦' : t.t == 'ent' ? '🕳️' : t.t == 'cav' ? '⭕' : '🟡'} ${t.id}`;
      locTun.appendChild(opt);
    });
  };

  feat.js = () => {
    buildLocTunOptions();

    // Show/hide form rows based on selected area.
    const locSwitch = () => {
      const val = getEl('loc-n').value;
      getEl('locForm').querySelectorAll('[data-show]').forEach(div => {
        div.hidden = !div.getAttribute('data-show').split(',').includes(val);
      });
    };
    getEl('loc-n').addEventListener('change', locSwitch);
    locSwitch();

    // Show/hide position selector based on tunnel type.
    const locIdSwitch = () => {
      const t = F.tuns.find(t => t.id == getEl('loc-tun').value);
      getEl('loc-pos').closest('div').hidden = !t || t.t !== 'cav';
    };
    getEl('loc-tun').addEventListener('change', locIdSwitch);
    locIdSwitch();

    // Sync range output labels.
    document.querySelectorAll('#locForm input[type="range"]').forEach(r => {
      r.nextElementSibling.value = r.value;
      r.addEventListener('input', () => r.nextElementSibling.value = r.value);
    });

  };
  feat.switch = () => buildLocTunOptions();

  devSecActions.push(feat);
}

/*
 * SPECIAL ACTIONS
 */
{
  const feat = devFeature('Special Actions');
  feat.config = {collapsible: true, collapsed: true};

  feat.html = `
    ${devButt('Egg laying (random queen)', {prefix: '🥚', click: () => {
      let randomQueen = pickRandom(F.a.filter(isQueen));
      if (randomQueen) {
        antFinnaVia(randomQueen, 'kip');
        antFinnaVia(randomQueen, 'lay');
      }
    }})}
    <br>
    ${devButt('Nip walk (first ant)', {
      prefix: '<span style="display:inline-block;border-radius:3px;background:#a3da86;font-weight:bold;padding:0 3px;">➜]</span>',
      click: () => {
        F.nips.length && antFinnaUnique(F.a[0], 'nip', {nip: pickRandom(F.nips).nip});
      }
    })}
  `;

  devSecActions.push(feat);
}


/*
 * ============================================================
 * SECTION: TUNNEL TOOLS
 * ============================================================
 */

const devSecTunnels = [];

// Draws a debug line between two absolute coordinates.
const drawLine = (x1, y1, x2, y2, score) => {
  !getEl('L') && appendHTML(B, `<div id="L" style="position:absolute;z-index:1;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>`);
  let lineContainer = getEl('L'),
      line = document.createElement('div'),
      length = getHypot(x2 - x1, y2 - y1),
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
    top: y1 + 'px',
  });
  lineContainer.appendChild(line);
};

// Draws a debug line from a {x1,y1,x2,y2} object; called by the main
// script file for debugging.
const DL = (obj, score = 100) => {
  if (devShowLines) {
    bb = getEl('fill').getBoundingClientRect();
    drawLine(bb.x + obj.x1, bb.y + obj.y1, bb.x + obj.x2, bb.y + obj.y2, score);
  }
};

/*
 * GENERATE TUNNELS
 */

// Global state.
let devShowLines = 0;

{
  const feat = devFeature('Generate Tunnels');
  feat.config = {collapsible: true, collapsed: true};

  feat.html = `
    ${devButt('Test Tuns', {prefix: '⛏️', click: () => {
      devShowLines = getEl('dev-lines').checked;
      getEl('L') && getEl('L').remove();
      testTuns();
    }})}
    ${devInput('Show Lines', 'checkbox', {id: 'dev-lines', labelText: 'show lines'})}
    <br>
    ${devButt('Clear Lines', {prefix: '🧹', click: () => getEl('L') && getEl('L').remove()})}
  `;

  feat.css = `
    .waypoint {
      border-radius: 50%;
      transition: outline 0.3s ease;
    }
  `;

  // Draws tunnels.
  const testTuns = () =>
    dumpFarm(1) || setTimeout(() => {
      F.tuns.forEach(t => {t.prog = 100; t.dun = 1; tunProgDraw(t);});
      F.hills.forEach(h => {h.h = (h.r - h.l) / 4; hillDraw(h);});
      devNotifySwitch();
    }, frameTick * 2); // Because dumpFarm() takes 1 frame to kick in.

  devSecTunnels.push(feat);
}

/*
 * MANAGE TUNNELS
 */
{
  const feat = devFeature('Manage Tunnels');
  feat.config = {collapsible: true, collapsed: true};

  feat.html = `
    <div id="dev-tunnel-list-container"></div>
    <div id="dev-special-tuns"></div>
    <div id="dev-progress-tuns">
      ${devButt('Fast-forward current dig jobs', {prefix: '⏩', click: () => {
        F.tuns.forEach(tun => tun.prog > 0 && !tun.dun && (tun.prog = 99.9));
      }})}
    </div>
  `;

  // Builds the tunnel <select> list and (re)wires its listeners.  Safe to call again later (e.g. on farm switch).
  const renderTunnelList = () => {
    if (F.tuns.length > 0) {
      const tunIcon = t => t.t == 'con' ? '🟣' : t.t == 'jun' ? '🟦' : t.t == 'ent' ? '🕳️' :  t.t == 'cav' ? '⭕' : '🟡';
      const options = Object.fromEntries(F.tuns.slice().sort((a, b) => a.y1 - b.y1).map(tun => {
        const outClass = !tun.prog ? 'dev-tun-noprog' : !tun.dun ? 'dev-tun-nodun' : '';
        return [tun.id, [outClass, `${tunIcon(tun)}${tun.id} (${tun.co ? tun.co.join(', ') : 'none'})`]];
      }));
      getEl('dev-tunnel-list-container').innerHTML =
        devSelect('Tunnel List', options, {id: 'dev-tunnel-list', attrs: 'multiple style="height:200px;"'}) +
        '<br>' +
        devButt('Kill Selected Tuns', {prefix: '🧹', id: 'dev-remove-tunnels', attrs: 'disabled'}) +
        `<span class="countdown monospace"></span>`;
    }
    // Enable remove button after the standard delay.
    setTimeout(() => {
      const btn = getEl('dev-remove-tunnels');
      if (btn) btn.disabled = false;
    }, standardDelay);
    // We do custom event listeners in this one because the form can be regenerated
    // dynamically and devSelect/devButt aren't sophisticated enough to deal with it.
    if (getEl('dev-tunnel-list')) {
      getEl('dev-tunnel-list').addEventListener('change', event => {
        document.querySelectorAll('.highlighted-tunnel').forEach(el => {
          el.classList.remove('highlighted-tunnel');
          el.style.outline = '';
        });
        Array.from(event.target.selectedOptions).forEach(option => {
          const tunnelElement = getEl(option.value);
          if (tunnelElement) {
            tunnelElement.classList.add('highlighted-tunnel');
            tunnelElement.style.outline = '2px solid #ff00ff';
          }
        });
      });
      getEl('dev-remove-tunnels').addEventListener('click', () => {
        Array.from(getEl('dev-tunnel-list').selectedOptions).map(o => o.value).forEach(id => tunDelete(F, getTun(F, id)));
        save();
        location.reload();
      });
    }
  };

  // Special tunnels info (morgue, ant nests). Defined here so it can be
  // re-run both when the details block is opened and on farm switch.
  const updateSpecialTuns = () => {
    let morgue = F.tuns.find(t => t.morgue)?.id;
    let out = `<div><b>Morgue:</b> <span class="specialVal">${morgue || '<span class="none">none</span>'}</span></div>`;
    let antNestMap = Object.fromEntries(F.a.filter(a => a.nest).map(a => [a.id, a.nest]));
    let nests = `<div><b>Nests:</b> <span class="specialVal"><span class="none">none</span></span></div>`;
    let nestArray = [];
    for (let [antId, nestId] of Object.entries(antNestMap)) {
      nestArray.push(`<div><b>${antId} nest:</b> <span class="specialVal">${nestId}</span></div>`);
    }
    if (nestArray.length) nests = nestArray.join('');
    out += nests;
    let junTuns = F.tuns.filter(t => t.t == 'jun').length;
    out += `<div><b>JUN tunnels:</b> <span class="specialVal">${junTuns || '<span class="none">none</span>'}</span></div>`;
    let digJobs = [];
    F.dig.forEach(dig => digJobs.push(dig.id));
    out += `<div><b>Dig jobs:</b> <span class="specialVal">${digJobs && digJobs.join() || '<span class="none">none</span>'}</span></div>`;
    out += '<div><small>(Collapse this section to update list)</small></div>';
    getEl('dev-special-tuns').innerHTML = out;
  };

  feat.js = () => {
    renderTunnelList();
    updateSpecialTuns();
    // Refresh when the details block is opened.
    getEl(devId('Manage Tunnels')).addEventListener('toggle', updateSpecialTuns);
  };

  feat.css = `
    .specialVal {
      font-family: monospace;
      font-size: 120%;
      .none {
        color: #999 !important;
      }
    }
    .dev-tun-noprog,
    .dev-tun-nodun {
      opacity: .5;
    }
    .dev-tun-noprog {
      text-decoration: line-through;
    }
  `;

  feat.switch = () => {
    renderTunnelList();
    updateSpecialTuns();
  };

  devSecTunnels.push(feat);
}

/*
 * ============================================================
 * SECTION: POINTS
 * ============================================================
 */

const devSecPoints = [];

// Shows/hides the waypoint pin overlay.
const toggleWaypoints = turnOn => {
  let wp = getEl('waypoints');
  wp && wp.remove();

  if (turnOn) {
    waypointsUpdate(F);
    getEl('farm').innerHTML += '<div id="waypoints" class="fill"></div>';
    wayPoints[F.id].forEach(p => {
      const pointDiv = document.createElement('div');
      pointDiv.classList.add('waypoint');
      pointDiv.style.position = 'absolute';
      pointDiv.style.left = `${p.x - 1}px`;
      pointDiv.style.top = `${p.y - surface - 1}px`;
      pointDiv.style.width = '2px';
      pointDiv.style.height = '2px';
      let wpTunId = getWaypointTunnel(F, p);
      let pointColor = '#adff2f'; // default: lime
      if (wpTunId) {
        let tunSide = getTunSide(getTun(F, wpTunId), p);
        if (tunSide > 0) pointColor = '#66ff00';   // side +1 greener
        if (tunSide < 0) pointColor = '#cae00d';   // side -1 yellower
        if (getTun(F, wpTunId).t == 'jun') pointColor = '#ff00ea'; // junction
      }
      else {
        pointColor = '#e05a0d'; // tunnel position failed?
      }
      pointDiv.style.backgroundColor = p.c ? p.c : pointColor;
      pointDiv.style.borderRadius = '50%';
      pointDiv.style.transition = 'outline 0.3s ease';
      document.querySelector('#waypoints').appendChild(pointDiv);
    });

    let i = 0, wpEls = queryAll('.waypoint');
    if (wpEls.length) {
      const flashNext = () => {
        const el = wpEls[i % wpEls.length];
        el.style.outline = '1px solid white';
        setTimeout(() => el.style.outline = 'none', 500);
        i++;
        setTimeout(flashNext, 100);
      };
      flashNext();
    }
  }

  // Call functions from other features that depend on waypoints being enabled.
  devAntPointsHandler();
  devConnPointsHandler();
};

// Briefly outlines a single waypoint.
const devHighlightWaypoint = (farm, wp, color = 'black', duration = 500) => {
  const wpEls = queryAll(`#kit[data-id=${farm.id}] .waypoint`);
  if (wpEls.length) {
    const el = wpEls[wp.i];
    if (el) {
      el.style.outline = '1px solid ' + color;
      setTimeout(() => {if (el) el.style.outline = 'none';}, duration);
    }
  }
};

// Draws an overlay crosshair point.
const devPoint = (container, suffix, x, y, color) => {
  const point = document.createElement('div');
  point.className = 'dev-point ' + suffix;
  point.style.left = x + 'px';
  point.style.top = y + 'px';
  point.style.setProperty('--crosshair-color', color);
  container.appendChild(point);
};

devGlobalCSS += `
  .dev-point {
    position: absolute;
    width: 9px;
    height: 9px;
    transform: translate(-50%, -50%);
    z-index: 50;
    opacity: .5;
    &::before,
    &::after {
      content: '';
      position: absolute;
      background-color: var(--crosshair-color);
    }
    &::before {
      width: 9px;
      height: 1px;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
    &::after {
      width: 1px;
      height: 9px;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
    }
  }
`;

/*
 * WAYPOINTS TOGGLE
 */
{
  const feat = devFeature('Waypoints');
  feat.html = devToggle('Waypoints', {
    id: 'dev-waypoints',
    prefix: ['📌', '🚫'],
    text: 'Waypoints',
    toggle: checked => toggleWaypoints(checked),
  });

  devSecPoints.push(feat);
}

/*
 * ANT POINTS
 */

// Point definitions: id-suffix -> [label, pointFunc, color, showCondition]
const devAntPoints = {
  'head-point': ['Head', firstAnt => antHeadPoint(firstAnt), 'magenta', () => 1],
  'mid-point': ['Mid', firstAnt => firstAnt, 'lightgrey', () => 1],
  'tail-point': ['Tail', firstAnt => antTailPoint(firstAnt), 'green', () => 1],
  'foot-point': ['Foot', firstAnt => antFootPoint(firstAnt), 'cyan', firstAnt => firstAnt.pose == 'side' && firstAnt.area.t],
  'front-foot-point': ['Front foot', firstAnt => antFootPoint(antHeadPoint(firstAnt)), 'pink', firstAnt => firstAnt.pose == 'side' && firstAnt.area.t],
  'rear-foot-point': ['Rear foot', firstAnt => antFootPoint(antTailPoint(firstAnt)), 'yellow', firstAnt => firstAnt.pose == 'side' && firstAnt.area.t],
};
let devAntPointsTimer = null;
let devAntPointsHandler = () => {
  devAntPointsTimer && clearInterval(devAntPointsTimer);
  if (document.querySelectorAll('#dev-ant-points-list input:checked').length > 0) {
    devAntPointsTimer = setInterval(() => {
      let waypoints = getEl('waypoints');
      if (waypoints) {
        waypoints.querySelectorAll('.dev-point.ant-point').forEach(el => el.remove());
        let firstAnt = F.a[0];
        if (firstAnt) {
          for (let [suffix, [, pointFunc, color, showFunc]] of Object.entries(devAntPoints)) {
            if (getEl('dev-ant-points-' + suffix).checked && showFunc(firstAnt)) {
              let point = pointFunc(firstAnt);
              devPoint(waypoints, 'ant-point ' + suffix, point.x, point.y - surface, color);
            }
          }
        }
      }
    }, 20);
  }
  else if (getEl('waypoints')) {
    getEl('waypoints').querySelectorAll('.dev-point.ant-point').forEach(el => el.remove());
  }
};

{
  const feat = devFeature('Ant Points');
  feat.config = {collapsible: true, collapsed: true};

  const togglesHtml = Object.entries(devAntPoints).map(([suffix, [label, , color]]) =>
    devToggle(`Ant Points ${suffix}`, {
      id: 'dev-ant-points-' + suffix,
      prefix: `<span style="color:${color};">╋</span>`,
      text: `${label} point`,
      toggle: devAntPointsHandler,
    })
  );

  feat.html = `
    <p>Displays points on ant used for decisions.</p>
    <small>First ant only. Waypoints must be on.<br>Foot points show on side tun walk.</small>
    <div id="dev-ant-points-list">${togglesHtml.join('<br>')}</div>
  `;

  feat.css = `
    #dev-ant-points-list {
      width: 50%;
      margin: 0 auto;
      text-align: left;
    }
  `;

  devSecPoints.push(feat);
}

/*
 * CONNECTION POINTS
 */

const devConnPointTypes = ['ent', 'con', 'jun'];
let devConnPointsHandler = () => {
  if (document.querySelectorAll('#dev-conn-points-list input:checked').length > 0) {
    let waypoints = getEl('waypoints');
    if (waypoints) {
      devConnPointTypes.forEach(pointType => {
        if (getEl('dev-conn-points-' + pointType).checked) {
          F.tuns.filter(t => t.t == pointType).forEach(t => {
            t.co.forEach(nextTun => {
              let point = getConnectionPoint(t, getTun(F, nextTun), F);
              devPoint(waypoints, 'conn-point ' + pointType, point.x, point.y - surface, '#000');
            });
          });
        }
        else {
          getEl('waypoints')?.querySelectorAll('.dev-point.' + pointType + '.conn-point').forEach(el => el.remove());
        }
      });
    }
  }
  else if (getEl('waypoints')) {
    getEl('waypoints').querySelectorAll('.dev-point.conn-point').forEach(el => el.remove());
  }
};

{
  const feat = devFeature('Connection Points');
  feat.config = {collapsible: true, collapsed: true};

  const togglesHtml = devConnPointTypes.map(type =>
    devToggle(`Connection Points ${type}`, {
      id: 'dev-conn-points-' + type,
      prefix: `<span style="color:#000;">╋</span>`,
      text: `${type.toUpperCase()} tunnels`,
      toggle: devConnPointsHandler,
    })
  );

  feat.html = `
    <p>Displays "rotWalk" targets.</p>
    <small>Waypoints must be on.</small>
    <div id="dev-conn-points-list">${togglesHtml.join('<br>')}</div>
  `;

  feat.css = `
    #dev-conn-points-list {
      width: 50%;
      margin: 0 auto;
      text-align: left;
    }
  `;

  devSecPoints.push(feat);
}


/*
 * ============================================================
 * SECTION: SAVE
 * ============================================================
 */

const devSecSave = [];

// Calculates how much localStorage is being used on this page.
const getLocalStorageSizeInMB = () => {
  if (!window.localStorage) return 'localStorage not supported';
  const encoder = new TextEncoder();
  let totalBytes = 0;
  for (const key of Object.keys(localStorage)) {
    totalBytes += encoder.encode(key).byteLength;
    totalBytes += encoder.encode(localStorage.getItem(key)).byteLength;
  }
  return `Data loaded: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB (${(totalBytes / 1024).toFixed(2)} KB)`;
};

/*
 * SAVE GAME
 */
{
  const feat = devFeature('Save Game');
  feat.config = {collapsible: true, collapsed: false};

  feat.html = `
    ${devButt('Save Game', {prefix: '💾', id: 'dev-save', attrs: 'disabled', click: () => save()})}<span class="countdown monospace"></span>
    <br>
    <div style="margin: .25em 0 .5em 0">
    Use after editing vars
    <input class="dev-console-hint" type="text" name="_" value="_" style="width:1em;" disabled>
    and
    <input class="dev-console-hint" type="text" name="F" value="F" style="width:1em;" disabled>
    in console
    </div>
    ${getLocalStorageSizeInMB()}
    <div><small>(includes dev data)</small></div>
  `;

  feat.css = `
    .dev-console-hint {
      font-family: monospace;
      width: .9em;
      text-align: center;
      font-weight: bold;
      display: inline;
    }
  `;

  feat.js = () => {
    setTimeout(() => {
      getEl('dev-save').disabled = false;
    }, standardDelay);
  };

  devSecSave.push(feat);
}



/*
 * ============================================================
 * SECTION: STATE
 * ============================================================
 */

const devSecState = [];

/*
 * ACTION HISTORY
 */

// Global state.
let devKeepHistory = 0;

{
  const feat = devFeature('Action History');
  feat.html = devToggle('Hist', {
    text: 'Action history',
    toggle: checked => {
      devKeepHistory = checked;
    },
  });

  devSecState.push(feat);
}

/*
 * SAVED STATES
 */
{
  // Renders the list of saved states into #dev-states-list.
  const devRenderStates = () => {
    let states = JSON.parse(localStorage.getItem('afsDevStates') || '[]');
    let container = getEl('dev-states-list');
    container.innerHTML = '';

    states.forEach((state, i) => {
      let row = document.createElement('div');
      let input = document.createElement('input');
      input.value = state.name;
      input.id = 'state' + getTime() + '-' + i;
      input.style.width = '9em';
      input.addEventListener('change', () => {
        states[i].name = input.value;
        localStorage.setItem('afsDevStates', JSON.stringify(states));
        devRenderStates();
      });
      let loadBtn = document.createElement('button');
      loadBtn.textContent = '📤 Load';
      loadBtn.addEventListener('click', () => {
        states[i].name = input.value;
        localStorage.setItem('afsDevStates', JSON.stringify(states));
        let spawnerVal = spawner;
        _ = states[i].data;
        getEl('kit').remove();
        switchFarm(_.F);
        devNotifySwitch();
        devRenderStates();
        spawner = spawnerVal;
      });

      let delBtn = document.createElement('button');
      delBtn.textContent = '❌';
      delBtn.addEventListener('click', () => {
        states.splice(i, 1);
        localStorage.setItem('afsDevStates', JSON.stringify(states));
        devRenderStates();
      });

      row.appendChild(input);
      row.appendChild(loadBtn);
      row.appendChild(delBtn);
      container.appendChild(row);
    });
  };

  const feat = devFeature('Saved States');
  feat.config = {collapsible: true, collapsed: true};

  feat.html = `
    <p style="margin: 0 0 .25em 0">Snapshot the farm/ants when debugging.</p>
    ${devButt('Save State', {prefix: '📥', click: () => {
      let states = JSON.parse(localStorage.getItem('afsDevStates') || '[]');
      let now = new Date();
      let thetime = now.toLocaleString('en-US', {
        day: 'numeric', weekday: 'short',
        hour: 'numeric', minute: '2-digit', hour12: true,
      });
      states.push({name: thetime, data: _});
      localStorage.setItem('afsDevStates', JSON.stringify(states));
      devRenderStates();
    }})}
    <div id="dev-states-list"></div>
  `;

  feat.js = () => {
    devRenderStates();
  };

  devSecState.push(feat);
}


/*
 * ============================================================
 * SECTION: DISPLAY & MISC
 * ============================================================
 */

const devSecDisplay = [];

/*
 * TRANSPARENCY TOGGLE
 */
{
  const feat = devFeature('Transparency');
  feat.html = devToggle('Trans', {
    prefix: ['🕶️', '👓'],
    text: 'Farm cowling',
    checked: true,
    toggle: checked => {
      let doTrans = !checked;
      queryAll('#glass, #wrapper, #kit, #game, #waypoints, .frame')
        .forEach(el => el.classList.toggle('frametrans', doTrans));
    },
  });
  feat.css = `
    .frametrans {
      pointer-events: none;
      &.glass,
      &.frame {
        opacity: .2;
      }
      #farm * {
        pointer-events: all;
        #waypoints {
          pointer-events: none;
        }
      }
    }
  `;

  devSecDisplay.push(feat);
}

/*
 * RESET
 */
{
  const feat = devFeature('Reset');
  feat.config = {collapsible: true, collapsed: true};

  feat.html = `
    Note: <input class="dev-console-hint" type="text" name="Q" value="Q()" style="width:1.6em;" disabled> in console will clear game data
    <br>
    <a onClick="devClear()">Reset dev panel and reload</a>
  `;

  devSecDisplay.push(feat);
}


/*
 * ============================================================
 * DEVSECTIONS - ordered list of sections to render
 * ============================================================
 */
const devSections = [
  devSecScore,
  devSecSpeed,
  devSecPowerups,
  devSecAnts,
  devSecActions,
  devSecTunnels,
  devSecPoints,
  devSecSave,
  devSecState,
  devSecDisplay,
];

// ----------------------------------------------------------------------------

/*
 * ============================================================
 * DEVPANEL - RENDERER
 *
 * Collects feature CSS, calls devBuildPanel() to get the structural HTML,
 * mounts it, then injects the shared style block and wires everything up.
 * CSS generation lives here (not in the builder); devBuildPanel() is structure-only.
 * ============================================================
 */
const devPanel = () => {
  let devParams = new URLSearchParams(window.location.search);
  if (!devParams.get('dev')) return;

  const css = `
    .dev-panel {
      position: absolute;
      top: .5em;
      left: .5em;
      padding: .5em .25em 1em;
      background: rgba(255,255,255,.7);
      border-radius: 5px;
      z-index: 999;
      font-size: .75em;
      text-align: center;
      overflow-y: auto;
      overflow-x: clip;
      h2 {
        text-align: center;
        margin: .25em;
        color: #222;
      }
      h3 {
        margin: .25em;
        color: #222;
      }
      input[type=text],
      input[type=number] {
        width: 3em;
        display: inline;
      }
      button {
        margin: .25em;
        padding: .25em .5em;
        font-size: 1em;
      }
      select {
        font-size: 1em;
      }
      .monospace {
        font-family: monospace;
      }
      details {
        summary {
          color: #356AA0;
        }
        .dev-feature {
          padding-top: .5em;
        }
      }
      .dev-sec {
        border-top: 1px solid rgba(0,0,0,.15);
        padding-top: .5em;
      }
      .dev-feature {
        margin-bottom: .5em;
      }
      .dev-toggle {
        .dev-tog-lbl {
          font-size: 1.2em;
          font-weight: bold;
        }
        input {
          display: none;
          ~ span .dev-tog-lbl {
            cursor: pointer;
            display: inline;
            color: #006400;
          }
          &:not(:checked) ~ span .dev-tog-lbl {
            color: #8B0000;
            text-decoration: line-through;
          }
        }
        input.dev-btn-style {
          ~ span {
            display: inline-block;
            margin: .25em;
            padding: .25em .5em;
            background: #64bc41;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-shadow: 2px 2px 1px rgba(0, 0, 0, .2);
            font-family: sans-serif;
          }
          ~ span .dev-tog-lbl {
            font-size: 1em;
            font-weight: normal;
            color: #fff;
            text-decoration: none;
          }
          &:not(:checked) ~ span .dev-tog-lbl {
            color: #fff;
            text-decoration: none;
          }
        }
      }
      .dev-tog-prefix,
      .dev-btn-prefix {
        padding-right: .5em;
      }
    }
    ${devGlobalCSS}
  `;

  devMountPanel('Developer panel', 'dev', devSections, {css: css});

  // Global: countdown timer for save/remove buttons.
  let timeLeft = standardDelay / 1000;
  const updateCountdown = (countdownEls, timeLeft, timer) => countdownEls.forEach(el => {el.textContent = timeLeft > 0 ? ` (${timeLeft}s)` : ''});
  let timer = setInterval(() => {
    if (--timeLeft >= 0) updateCountdown(document.querySelectorAll('.countdown'), timeLeft, timer)  ;
    else clearInterval(timer);
  }, 1000);
  updateCountdown(document.querySelectorAll('.countdown'), timeLeft, timer);


};


/*
 * ============================================================
 * ENTRY POINT
 * ============================================================
 */
window.onload = function() {
  devPanel();
  devLoaded = 1;

  // Replaces antNext() in the main app with a custom one which can be tweaked for debugging.
  // Supports the "Action history" feature too.
  antNext = (ant, timeout) => {
    // Normal antNext() stuff:
    let popAction = ant.q.shift();
    antAction(ant, timeout);
    antThot(ant);
    // History:
    if (devKeepHistory) {
      ant.hist ||= [];
      ant.hist.push(popAction);
      while (ant.hist.length > 20) ant.hist.shift();
    }
    else {
      del(ant, 'hist');
    }
    // Debugging:
    if (!isCapped(ant)) console.warn('Dead ant walking!');
    if (ant.q.length > 99) {
      console.warn(ant.id, getFarm(ant).n, 'has a long queue.', JSON.stringify(ant.q));
      ant.q = [{}];
    }
  };

};

