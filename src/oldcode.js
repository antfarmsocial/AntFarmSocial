
  // Burrowing action.
  // @TODO - add bumping into other ants - like in bg crawl, except they swith between mid/floor/ceil or prone/side to bypass, while other pauses?
  diveOld: (ant, antEl,
    action = ant.q[0], tun = action.id != -1 ? getTun(action.id) : {t: 0, x: ant.x, y: ant.y}, nextAction = ant.q[1], nextTun = nextAction && nextAction.act == 'dive' && getTun(nextAction.id),
    step = abs(getAntStep(ant)) / 2, nextProg = nextAction && nextAction.prog ? nextAction.prog : 100, nextPercent = ant.dir ? 100 - nextProg : nextProg
  ) => {
    console.log("DIVE", tun ? tun.id : 'setup');
    console.log(action, tun);
    if (action.id) {
      // This is a fully expanded dive queue; determine destinations.
      if (ant.area.n == 'top') {
        // Entering from surface.
        action.dest = {x: (tun.p[0].x + tun.p[1].x) / 2, y: (tun.p[0].y + tun.p[1].y) / 2};
        // Get appropriate tunnel point or far end midpoint for next action.
        /*nextAction.dest = nextProg < 100 ? getPointInTunnel(nextTun, nextPercent) : getTunnelEnd(nextTun, tun.x1, tun.y1, 0);*/
      }
      else if (tun.t == 'ent') {
        // Ant is about to surface.
        // Pick a spot on the surface either to the left or the right of the tunnel entrance, based on the ent's pins and ant's x offset.
        action.dest = {x: pickRandom([tun.x1 - 7 - antOffsetX(ant), tun.x1 + 7 + antOffsetX(ant)]), y: getAntGroundLevel(ant) - surface};
      }
      else if (nextTun) {
        if (nextTun.t == 'tun') {
          // Ant is in a con or ent and heading to a tun.
          // Get near end midpoint for this action. (or use ant's position if it is a stub action)
          action.dest = tun.t ? getTunnelEnd(nextTun, tun.x1, tun.y1) : tun;
          // Get appropriate tunnel point or far end midpoint for next action.
          nextAction.dest = nextProg < 100 ? getPointInTunnel(nextTun, nextPercent) : getTunnelEnd(nextTun, tun.x1 || tun.x, tun.y1 || tun.y, 0);
        }
        else if (nextTun.t == 'cav') {
          // Ant is in a con (or stub) and heading to a cav.
          let rand = ant.pos == 'd' ? .5 : ant.pos == 'u' ? 1 : ant.pos == 'm' ? 0 : nextProg == 100 || hasSurfaceAtPercent(nextTun, 1, nextPercent) ? random() : 0,
            up = rand > .8,
            isTypicalDest = tun.t || nextProg < 100 /*&& nextProg > 0*/,
            subsequentAction = !isTypicalDest && ant.q[2], subsequentTun = subsequentAction && subsequentAction.act == 'dive' && getTun(subsequentAction.id);
          ant.pos = 0; // Reset ant pos now that it has been checked.
          if (rand > .2) {
            // Go to surface.
            action.pos = nextAction.pos = up ? 'u' : 'd';
            // Find closest pin for this action. (or use ant's position if it is a stub action)
            action.dest = tun.t ? getCavEnd(nextTun, up, ant) : tun;
            // Find destination pin for next action.

            ////if (tun.t || nextProg < 100 && nextProg > 0) {
              nextAction.dest = isTypicalDest ? (nextProg < 100 ? getPointOnTunSurface(nextTun, up, nextPercent, antOffsetY(ant)) : getCavEnd(nextTun, up, ant, 0)) : {x: subsequentTun.x1, y: subsequentTun.y};
           /// }
            ////else {

            ///  console.log("subsequentTun", subsequentTun);

              //nextAction.dest = nextProg < 100 ? getPointOnTunSurface(subsequentTun, up, nextPercent, antOffsetY(ant)) : getCavEnd(subsequentTun, up, ant, 0);
            ///  nextAction.dest = {x: subsequentTun.x1, y: subsequentTun.y};
           /// }
          }
          else {
            // Crawl across middle.
            action.pos = nextAction.pos = 'm';
            // Get near end random point for this action. (or use ant's position if it is a stub action)
            action.dest = tun.t ? getTunnelEnd(nextTun, tun.x1, tun.y1, 1, .3 + .4 * random()) : tun;
            console.log("Setting nearest action.dest to ", action.dest, "ant was:", ant.x, ant.y);
            // Get far end random point for next action.
            /////if (tun.t || nextProg < 100 && nextProg > 0) {
              nextAction.dest = isTypicalDest ? (nextProg < 100 ? getPointInTunnel(nextTun, nextPercent) : surfaceAdjustY(getTunnelEnd(nextTun, tun.x1, tun.y1, 0, .3 + .4 * random()))) : {x: subsequentTun.x1, y: subsequentTun.y};
            ////}
            ////else {
            ///  nextAction.dest = {x: subsequentTun.x1, y: subsequentTun.y};
            ////}
            nextAction.r = getAngle(action.dest, nextAction.dest);
            console.log("Setting NEXT action.dest to ", nextAction.dest, "with angle:",nextAction.r, "nextProg is", nextProg);
          }
        }
        else if (tun.t == 'con') {
          // Ant is in a con, without a nextTun, so it would be for digging purposes only.
          console.log("con dig");
          // Determine where the edges of the con are, and have ant head to a random spot on that, preferably away from their current position.

          // @todo not implemented yet.

          antToProne(ant, antEl, 1); // @TODO this is a copout because there are obviously some cases where we can stay in side pose.
        }
        // Note: If the ant is already in a 'tun' or 'cav', the previous tunnel ('con' or 'ent') would have set up the action.dest, so no need to handle those cases.
      }
      /*
      if (!action.dest && tun.t == 'cav') {
        return antNext(ant, antEl);
      } // Starting tunnel is a cavity, proceed to next action.
       */
      // For stub actions the ant has to be oriented the correct way to continue.
      if (!tun.t) {
        if (/*tun.t == 'cav' &&*/ (
          ((nextAction.dest.x < ant.x && ant.scale > 0 || nextAction.dest.x > ant.x && ant.scale < 0) && nextAction.pos != 'up') ||
          ((nextAction.dest.x < ant.x && ant.scale < 0 || nextAction.dest.x > ant.x && ant.scale > 0) && nextAction.pos == 'up')
        )) {
          console.log("wrong way ant - flip the other way");
          console.log(nextAction.pos, "nextAction.dest.x", nextAction.dest.x, "ant.x", ant.x, "ant.scale:", ant.scale);
          ant.scale *= -1; // Flip the ant if it is going the wrong way.
          ant.dir = !ant.dir;
          updateAntPosition(ant, antEl);
        }
        //woof();
        return antNext(ant, antEl);
      }
      if (!action.dist) {
        // One-time setup.
        // Work out step (step size) and dist (num steps / frames).
        action.step = isRotationTunnel(tun) || action.r ? getPointToPointStep(ant.x, ant.y, action.dest.x, action.dest.y, step) : getTunnelStep(tun, step);
        action.dist = round(hypot(action.dest.x - ant.x, action.dest.y - (action.r ? ant.y : getAntY(ant))) / hypot(action.step.x, action.step.y));
        action.left = nextAction && nextAction.dest ? nextAction.dest.x < ant.x : 0;
        // Switch to prone when entering tunnel from surface at a shitty angle - part way through the turn, except sometimes.
        tun.t == 'ent' && ((ant.scale > 0 && nextTun.r > 210) || (ant.scale < 0 && nextTun.r < 150)) && randomInt(6) && setTimeout(X => antToProne(ant, antEl), action.dist / 2 * frameTick);
        if (action.r) ant.r = ant.scale < 0 ? -action.r : action.r; // If action already has an 'r' value, flick the ant into that rotation.

        console.log("action calculated to:", action);

      }
      // Execute the relevant walking action.
      antAction(ant, antEl, isRotationTunnel(tun) ? 'rotWalk' : 'tunWalk');
    }
    else {
      // No dive queue - select tunnels and create queue.
      let targetTun = pickRandom(F.tuns.filter(t => t.t == 'cav' && t.prog == 100));
      if (targetTun) {
        let path = findPath(targetTun, ant.area.n == 'top' ? {t: 'ent'} : {id: ant.area.t});
        if (ant.area.n == 'top') {
          let ent = getTun(path.pop());
          antFinna(ant, 'pace');
          antFinna(ant, 'dive', {tx: ent.x1, id: ent.id});
        }
        else {
          antFinna(ant, 'dive', {id: -1}); // Stub tunnel.
        }
        path.reverse().forEach(tunId => antFinna(ant, 'dive', {id: tunId}));
        antFinna(ant, 'dive', {id: targetTun.id, prog: 30 + randomInt(40)});
        // @todo ensure it handles the case where targetTun.id == ant.area.t (i.e destination is same as current tunnel)
      }
      // Execute queue.
      antNext(ant, antEl);
    }
  },

  // Transitions ant between two tunnel pieces.
  rotWalkOld: (ant, antEl, action = ant.q[0], tun = getTun(action.id), nextAction = ant.q[1],
      nextTun = nextAction && nextAction.act == 'dive' && getTun(nextAction.id), nextTunAngle = nextTun ? nextTun.r : 0) => {
    antElMove(ant, antEl);
    console.log("rotateToNextTun()", action.left ? "to left" : "to right");
    if (!action.rot) {
      // One-time setup on first tick.
      if (nextTun) {
        if (tun.t == 'con') {
          if (nextTun.t == 'cav') nextTunAngle += 90; // Cav chambers use a different coordinate system :/
          nextTunAngle = (deg180 + nextTunAngle) % deg360;
        }
        antArea(ant, 'bot', nextTun.id);
      }
      if (ant.area.n == 'top') {
        // Normalize angle of surface level ants to prevent over-rotation.
        ant.r = 90;
        updateAntPosition(ant, antEl);
      }
      else if (tun.t == 'con' && (action.pos == 'm' || (action.pos == 'u' || action.pos == 'd') &&
        /**
         * The following condition is equivalent to:
         * (action.pos == 'u' && (ant.scale < 0 && action.left || ant.scale > 0 && !action.left)) || (action.pos == 'd' && (ant.scale < 0 && !action.left || ant.scale > 0 && action.left))
         */
        (action.pos == 'u') == (ant.scale < 0 ? action.left : !action.left)
      )) antToProne(ant, antEl, 1); // In some con transitions ant looks silly if in side position.

      tun.t == 'con' && console.log("CON PRONE?", ant.scale, action.left);
      if (ant.scale < 0) nextTunAngle = deg360 - nextTunAngle; // Invert tun angle for negative scale ants.
      action.r = nextTunAngle - ant.r;
      if (!action.left && tun.t == 'con') action.r += ant.scale > 0 ? -deg180 : deg180; // Correct rotation for ants going towards the right from a con based on their scale.

      console.log("action.r:",action.r," final rot:", action.r+ant.r);

      action.dist *= .8; // Speed up transitions.
      action.rot = action.r + ant.r; // Final rotation.
      action.r = action.r / action.dist; // Rotation step.
      action.sX = (action.dest.x - ant.x) / action.dist;
      action.sY = (action.dest.y - ant.y + surface) / action.dist;
      ant.dir = tun.x1 == nextTun.x2 && tun.y1 == nextTun.y2;
      antEl.classList.add('turning');//@todo add turning styles - see also todo.md about hill angle styles.
      console.log("action.rot:", action.r, "by", action.dist, "steps, final should be:", action.rot);
    }
    if (--action.dist > 0) {
      // One step of rotation.
      ant.r += action.r;
      ant.x += action.sX;
      ant.y += action.sY;
      updateAntPosition(ant, antEl);
      setTimeout(X => antAction(ant, antEl, 'rotWalk'), frameTick);
    }
    else {
      // Rotation complete.
      ant.r = action.rot % deg360; // Correct the final angle.
      ant.x = action.dest.x; // Correct the final x position.
      ant.y = action.dest.y + surface; // Correct the final y position.
      antEl.classList.remove('turning');
      // Switch to side upon rotation completion when going to surface.
      if (action.pos == 'u' || action.pos == 'd') {
        console.log("ant to side triggered");
        antToSide(ant, antEl);
        if (
          /**
           * The following condition is equivalent to:
           * (action.left && (action.pos == 'u' && ant.scale < 0 || action.pos == 'd' && ant.scale > 0)) || (!action.left && (action.pos == 'u' && ant.scale > 0 || action.pos == 'd' && ant.scale < 0))
           */
          (action.pos == 'u') == (ant.scale < 0 == action.left)
        ) {
          !action.sf && antScaleFlip(ant);
          action.sf = 1; // Prevent double scale flip if func is retriggered on action restart.
        }
      }
      if (!nextTun && tun.t == 'ent') {
        // Special case for ants that have just surfaced.
        antFixOrient(ant, antEl);
        antArea(ant, 'top');
      }
      ant.pos = action.pos || 0; // If action has a pos, store it on the ant too at this point in case the next action needs to know.
      updateAntPosition(ant, antEl);
      antElStill(antEl);
      console.log("ANT ROT DONE");
      antNext(ant, antEl);
    }
  },


// Gets the next spot to step to in the tunnel.
//moveAntInTunnel = (ant, step) => ant.dir ? ( ant.x -= step.x, ant.y -= step.y ) : ( ant.x += step.x, ant.y += step.y ),


// Gets a point a certain distance along a top tunnel, optionally with an offset margin for the y value.
/*getEntrancePoint = (tun, margin, pos, distance = 12, distComp = calcDistComponents(tun.x1, tun.y1, tun.x2, tun.y2), actualDistance = min(distance, distComp.d * (tun.prog / 100))) =>
  ({x: tun.x1 + distComp.x * actualDistance, y: / *surface +* / (pos < 0 ? max(tun.y1, tun.y2) + margin : pos > 0 ? min(tun.y1, tun.y2) - margin : tun.y1 + distComp.y * actualDistance)}),
*/


/*getPercentInTunnel = (tun, x, y) => (((x - tun.x1) / (tun.x2 - tun.x1)) * 100 + ((y - tun.y1) / (tun.y2 - tun.y1)) * 100) / 2,*/


////////////getAngleStep = (angleDeg, step) => ({x: cos(degToRad(angleDeg)) * step, y: sin(degToRad(angleDeg)) * step}),

/*
getWaypointIndex = (wp, threshold = 1) => {
  let index = wayPoints.indexOf(wp);
  if (index !== -1) return index;

  // Fallback to proximity search
  let closestIndex = -1;
  let shortestDist = Infinity;
  for (let i = 0; i < wayPoints.length; i++) {
    const dist = calculateDistance(wp.x, wp.y, wayPoints[i].x, wayPoints[i].y);
    if (dist < shortestDist && dist < threshold) {
      shortestDist = dist;
      closestIndex = i;
    }
  }
  return closestIndex;
},*/

/*
// Get average angle of a set of waypoints.
getWaypointAngle2 = (points, sumX = 0, sumY = 0) => {
  for (let i = 0; i < points.length - 1; i++) {
    let angle = atan2(wayPoints[points[i + 1]].y - wayPoints[points[i]].y, wayPoints[points[i + 1]].x - wayPoints[points[i]].x);
    sumX += cos(angle);
    sumY += sin(angle);
  })
  return radToDeg(atan2(sumY, sumX));
},

getWaypointAngleOLD = (wpArray, antAngle = 0, dir = 1, lookAhead = 1, lookBehind = 3) => {
  let sumX = cos(degToRad(antAngle));
  let sumY = sin(degToRad(antAngle)); // was radToDeg by mistake

  for (let offset = 0; offset < wpArray.length; offset++) {
    const i1 = offset * dir;
    const i2 = (offset + 1) * dir;
    if (i1 < 0 || i2 < 0 || i1 >= wpArray.length || i2 >= wpArray.length) continue;

    const dx = wpArray[i2].x - wpArray[i1].x;
    const dy = wpArray[i2].y - wpArray[i1].y;
    const angle = atan2(dy, dx);

    sumX += cos(angle);
    sumY += sin(angle);
  }

  return radToDeg(atan2(sumY, sumX));
},*/

/*
// Gets the next spot to step to in the tunnel. -- unused version???
moveAntInTunnelScalar = (ant, step) => {
  ant.x += step.x;
  ant.y += step.y;
},
*/
/*
// Calculates relative normalized distance components, signed if a is left/above b.  Note: surface compensation built in.
calcRelDistance = (a, b, dx = b.x - a.x, dy = b.y - a.y - surface, dist = sqrt(dx * dx + dy * dy) || 1) => ({x: dx / dist, y: dy / dist}),
*/

// Determines the coordinates for the nearest (or furthest) tunnel end.  @TODO - unused function?
getTunnelEnd = (tun, x, y, nearest = 1, head = { x: tun.x1 + tun.x2 - tun.x1, y: tun.y1 + tun.y2 - tun.y1}, tail = { x: tun.x2 + tun.x1 - tun.x2, y: tun.y2 + tun.y1 - tun.y2}) =>
  calculateDistance(head.x, head.y, x, y) < calculateDistance(tail.x, tail.y, x, y) == nearest ? head : tail,

/*
// Works out the waypoint pin an ant should move towards when entering a chamber cavity.
getCavEnd = (tun, up, ant, nearest = 1, offset = antOffsetY(ant), pin =
  tun.p.filter(p => p.up == up).reduce((c, p) => (calculateDistance(p.x, p.y, ant.x, ant.y - surface) < calculateDistance(c.x, c.y, ant.x, ant.y - surface)) == nearest ? p : c)) =>
    ({ ...pin, y: pin.y + (up ? offset : -offset) }),



// Gets a point at a percentage along the floor or ceiling of a tunnel.
getPointOnTunSurface = (tun, up, percent, yOffset, points = tun.p.filter(p => p.up == up)) =>
  ({x: getPointInTunnel(tun, percent).x, y: (up ? -yOffset : yOffset) + points[0].y + (points[1].y - points[0].y) * (percent / 100)}),

// Checks if a given percentage falls within the range where the floor or ceiling is defined.
hasSurfaceAtPercent = (tun, up, percent, points = tun.p.filter(p => p.up == up)) =>
  points.length < 2 ? 0 : percent >= getPercentInTunnel(tun, points[0].x, points[0].y) && percent <= getPercentInTunnel(tun, points[1].x, points[1].y),

// Adjusts an object with x/y coordinates to compensate for the surface level of the farm.
surfaceAdjustY = coords => {
  if (coords.y < surface) coords.y += surface;
  return coords;
},
*/


// Removes waypoints that are too acute (sharp angles) to be useful.
remAcuteWaypoints = (points, minAngle = 60/*, result = []*/) => { // @todo not very good function, maybe don't worry about keeping this if it doesn't work out.
  return points;
  console.log("Acute before:", points.length);
  for (let i = 1; i < points.length - 1; i++) {
    let prev = points[i - 1], curr = points[i], next = points[i + 1];
    if (prev && next) {
      let a = {x: prev.x - curr.x, y: prev.y - curr.y}, b = {x: next.x - curr.x, y: next.y - curr.y},
        magA = hypot(a.x, a.y), magB = hypot(b.x, b.y);
      if (magA > 0.01 && magB > 0.01) {
        let dot = a.x * b.x + a.y * b.y;
        dot = max(-1, min(1, dot / (magA * magB))); // Clamp
        if (radToDeg(Math.acos(dot)) < minAngle) {
          // Remove point.
          points.splice(i, 1);
          //i--;
        } //result.push(curr);
      }
      //else result.push(curr);
    }
    //else result.push(curr); // keep endpoints
  }
  console.log("Acute after:", points.length);
  return points;
},


// Determines if a waypoint is on the allowed side of an ant.
//isWaypointOnUnderside = (ant, wp, angleAdjust, r = ant.r - angleAdjust) => (wp.x - ant.x) * -sin(degToRad(r)) + (wp.y - ant.y - surface) * cos(degToRad(r)) > 0,
isWaypointOnUnderside = (ant, wp, angleAdjust, rad = degToRad(ant.r - angleAdjust)) => (wp.x - (ant.x + sin(rad) * 21)) * -sin(rad) + (wp.y - (ant.y - cos(rad) * 21) - surface) * cos(rad) > 0,
//@TODO 21 is hardcoded - but it should be based on ant's size... make a  getAntSize func??


// Determines what percentage of the way along a tunnel we at.
getPercentInTunnel = (tun, x, y) => (hypot(x - tun.x1, y - tun.y1) / hypot(tun.x2 - tun.x1, tun.y2 - tun.y1)) * 100,


// Gets a point a percentage of the way along a tunnel. --- @TODO UNUSED FUNCTION?
getPointInTunnel = (tun, percent) => ({x: tun.x1 + (tun.x2 - tun.x1) * percent / 100, y: surface + tun.y1 + (tun.y2 - tun.y1) * percent / 100}),

/*
antGetTunPosition = (ant, limitTun = 0) => {
  for (let type of ['con', 'cav', 'ent', 'tun']) {
    for (let tun of F.tuns.filter(t => (!limitTun || limitTun.id == t.id || limitTun.co.includes(t.id)) && t.t == type)) {
      let rect = getEl(tun.id).getBoundingClientRect();
      console.log(tun.id, "rect", rect);
      if (ant.x >= rect.left && ant.x <= rect.right && ant.y >= rect.top && ant.y <= rect.bottom) {
        return {tun, x: (ant.x - rect.left) / rect.width, y: (ant.y - rect.top) / rect.height};
      }
    }
  }
},*/


// Find where con overlaps with nextTun along nextTun's middle line.
//getConnectionPoint = (con, nextTun, dist = calcDistComponents(nextTun.x1, nextTun.y1, nextTun.x2, nextTun.y2), end = con.x1 == nextTun.x1 && con.y1 == nextTun.y1, offset = 1 + (con.w / 2)) =>
//  ({x: (end ? nextTun.x1 : nextTun.x2) + dist.x * offset, y: (end ? nextTun.y1 : nextTun.y2) + dist.y * offset}),
//getConnectionPoint = (con, nextTun, dist = calcDistComponents(nextTun.x1,nextTun.y1,nextTun.x2,nextTun.y2), end = con.x1==nextTun.x1&&con.y1==nextTun.y1, offset = 1+con.w/2) =>
//  ((x0,y0,s)=>( {x:x0+dist.x*offset*s, y:y0+dist.y*offset*s} ))(nextTun.x1*(end?1:0)+nextTun.x2*(end?0:1), nextTun.y1*(end?1:0)+nextTun.y2*(end?0:1), end?1:-1)
getConnectionPoint = (con, nextTun, dist = calcDistComponents(nextTun.x1, nextTun.y1, nextTun.x2, nextTun.y2), offset = 1 + con.w / 2,
  [x0, y0, s] = con.x1 == nextTun.x1 && con.y1 == nextTun.y1 ? [nextTun.x1, nextTun.y1, offset] : [nextTun.x2, nextTun.y2, -offset]) =>
  ({x: x0 + dist.x * s, y: y0 + dist.y * s}),
//getConnectionPoint = (con, nextTun, dist = calcDistComponents(nextTun.x1, nextTun.y1, nextTun.x2, nextTun.y2), end = con.x1 == nextTun.x1 && con.y1 == nextTun.y1, offset = 1 + (con.w / 2)) =>
// ({x: (end ? nextTun.x1 : nextTun.x2 * -1) + dist.x * offset, y: (end ? nextTun.y1 : nextTun.y2 * -1) + dist.y * offset}),

// Gets the index of the closest waypoint to an ant or a previous waypoint.
/*
getWaypointIndex = (obj, wps = wayPoints, threshold = 10, closestIndex = wayPoints.indexOf(obj), shortestDist = Infinity) => {
  if (closestIndex < 0) {
    for (let i = 0; i < wps.length; i++) {
      let dist = calculateDistance(obj.x, obj.y, wps[i].x, wps[i].y);
      if (dist < shortestDist && dist < threshold) {
        shortestDist = dist;
        closestIndex = i;
      }
    }
  }
  return closestIndex;
},*/
/*

getWaypointIndex = (obj, wps = wayPoints, threshold = 10, closestIndex = wayPoints.indexOf(obj), shortestDist = Infinity) => {
  console.log("getWAypointIndex:", obj);
  if (closestIndex < 0) {
    for (let i = 0; i < wps.length; i++) {
      let dist = calculateDistance(obj.x, obj.y - (obj.t ? surface : 0), wps[i].x, wps[i].y);
      if (dist < shortestDist && dist < threshold) {
        shortestDist = dist;
        closestIndex = i;
      }
    }
  }
  return closestIndex;
},*/


// Flips an ant over when diving in a tunnel.
antScaleFlip = ant => (ant.scale *= -1, ant.r = (ant.r + deg180) % deg360),//@TODO might not need this func



if (!action.ns && tun.t == 'tun' && !randomInt(num500)) {
  let wp = wayPoints[getWaypointIndex(ant)],
    tunSide = ((tun.x2 - tun.x1) * (wp.y - tun.y1) - (tun.y2 - tun.y1) * (wp.x - tun.x1) > 0 ? -1 : 1) * (tun.rev || -1);


    //legs = 1,  // Default: "right".
    // Determine which side of the tunnel the ant is on.


    /*
    dx = tun.x2 - tun.x1,
    dy = tun.y2 - tun.y1,
    cross = dx * ((ant.y - surface) - tun.y1) - dy * (ant.x - tun.x1),
    tunSide = abs(cross) / hypot(dx, dy) < 1 ? 0 : (cross > 0 ? -1 : 1) * (tun.rev ? 1 : -1);
*/

  // @T..ODO maybe we should be testing the closest waypoint rather than the ant's actual position?

    //cross = (tun.x2 - tun.x1) * ((ant.y - surface) - tun.y1) - (tun.y2 - tun.y1) * (ant.x - tun.x1),
    //tunSide = (cross > 0 ? -1 : cross < 0 ? 1 : 0) * (tun.rev ? 1 : -1); // Perhaps make the cross calculation simpler?  No "0" value?

  //if (/*tunSide ||*/ ant.pose == 'side') {
    console.log("switching pose to ",ant.pose == 'side' ? 'prone' : 'side')
    ant.pose == 'side' ? antToProne(ant, antEl) : antToSide(ant, antEl);
    updateAntPosition(ant, antEl); // TEMP
    //checkwhathappened();
    // @TODO if it's gone to side, we need to know which side it's legs are on.?????

    if (ant.pose == 'side') {

      //if (action.rev) legs *= -1;
      //if (ant.scale < 0) legs *= -1;
      console.log("? legs:", legs < 0 ? 'left' : 'right');
      console.log("tuns side", tunSide < 0 ? 'left' : tunSide > 0 ? 'right' : 'mid', cross);
      if (/*tunSide &&*/ ant.scale != tunSide) {
        // Ant is on the wrong side.
        ant.r = oppositeAngle(ant.r);
        ant.scale *= -1;

      ////checklegs();
    }
    else {
      if (ant.scale < 0) {
        ant.scale = 1;
        ant.r = oppositeAngle(ant.r);
        updateAntPosition(ant, antEl); //TEMP
        console.log("prone scale corrected");
      }
    }

  }
  else {
    console.log("X tunSide is", tunSide);
  }

  action.wp = [];
  action.act = 'dive';
  return antAction(ant, antEl);

//}



/*
// Generates pin corners.
pinCorners = (tun, rot, pad,
  rad = degToRad(tun.r + rot), // Convert angle to radians.
  // Unit direction vectors (along the tunnel).
  ux = cos(rad),
  uy = sin(rad),
  // Midpoint of the rotated box.
  cx = (tun.x1 + tun.x2) / 2,
  cy = (tun.y1 + tun.y2) / 2,
  // Half width/height.
  hw = (tun.w / 2) - pad,
  hh = tun.h / 2,
  // Products.
  wx = hw * ux,
  hx = hh * -uy,
  wy = hw * uy,
  hy = hh * ux,
) => {
  // Compute the four corner points (adjusted by pad inward along the length).
  tun.p = [
      { x: cx - wx - hx, y: cy - wy - hy, up: 1 }, // Top-left
      { x: cx - wx + hx, y: cy - wy + hy, up: 0 }, // Bottom-left
      { x: cx + wx - hx, y: cy + wy - hy, up: 1 }, // Top-right
      { x: cx + wx + hx, y: cy + wy + hy, up: 0 }  // Bottom-right
  ];
  // Calculate pin lines.
  tun.pl = [
    { x1: tun.p[0].x, y1: tun.p[0].y, x2: tun.p[2].x, y2: tun.p[2].y }, // Top
    { x1: tun.p[1].x, y1: tun.p[1].y, x2: tun.p[3].x, y2: tun.p[3].y }  // Bottom
  ];
  // Now see if any tuns where t.t != tun.t intersect with one of our pin lines.
  // This is to reduce the cases where a corridor tunnel runs through a cavity creating an invisible walkway.
  // This solution doesn't work 100% of the time, but it is ok to suppose there is sometimes a camouflagued surface the user cannot clearly see.
  F.tuns.forEach(t => {
    t.t != tun.t && t.pl && t.pl.forEach(pl => {
      tun.pl.forEach(tunPl => {
        let intersect = doLinesIntersect(pl, tunPl, 4, t.t == 'cav' ? -10 : 0, 1);
        intersect.x && (tun.t == 'tun' ? replacePin(tun, tunPl, intersect) : replacePin(t, pl, intersect));
      });
    });
  });
},

// Replaces pins with an intersect pin.
replacePin = (tun, pinLines, intersect, closestPointIndex = -1, minDistance = Infinity) => {
  intersect.i = 1;
  // We need to delete the nearest point from each tunnel and replace with this new point.
  // Which means getting the "up" value from the original point.
  tun.p.forEach((p, index) => {
    if ((p.x == pinLines.x1 && p.y == pinLines.y1) || (p.x == pinLines.x2 && p.y == pinLines.y2)) {
      // Calculate the distance between the point and intersect.x/intersect.y
      let distance = calculateDistance(p.x, p.y, intersect.x, intersect.y);
      // If this point is closer, update the closest point - as long as it's not an intersect already.
      if (distance < minDistance && p.i != 1) {
        minDistance = distance;
        closestPointIndex = index;
        intersect.up = p.up;
      }
    }
  });
  // If a closest point was found, remove it from the array.
  if (closestPointIndex !== -1) {
    tun.p.splice(closestPointIndex, 1);
  }
  // Add point.
  tun.p.push(intersect);
},
*/



/*
        let dx = wp.x - ant.x;
        let dy = wp.y - (ant.y - surface);
        // Only move if farther than leg overhang
        if (hypot(dx, dy) > antOffsetWP(ant)) {
          // Nudge ant closer
          if (abs(dx) > action.step) ant.x += dx > 0 ? nudge : -nudge;
          if (abs(dy) > action.step) ant.y += dy > 0 ? nudge : -nudge;
        }
*/

/*
        let wpDist = calcDistComponents(ant.x, ant.y - surface, wp.x, wp.y);
        if (abs(wpDist.d) > antOffsetWP(ant)) {
          // Nudge ant closer to wp if needed.
          if (abs(wpDist.x) > action.step) ant.x += wpDist.x < 0 ? nudge : -nudge;
          if (abs(wpDist.y) > action.step) ant.y += wpDist.y < 0 ? nudge : -nudge;
        }
*/
        /*
        let xDist = ant.x - wp.x, yDist = ant.y - surface - wp.y;
        // Nudge ant closer to wp if needed.
        if (abs(xDist) > action.step) ant.x += xDist < 0 ? nudge : -nudge;
        if (abs(yDist) > action.step) ant.y += yDist < 0 ? nudge : -nudge;
        */


/*
// Flips an ant about.
antFlip = ant => {
  ant.scale *= -1;
  ant.r = normalize360(deg180 - ant.r);
  //ant.r = oppositeAngle(ant.r); // This does:  normalize360(ant.r + 180)
},*/

/*
antDir = (ant, tun, dx = tun.x2 - tun.x1, dy = tun.y2 - tun.y1, len = hypot(dx, dy)) => ant.scale * (cos(degToRad(ant.r)) * dx / len + sin(degToRad(ant.r)) * dy / len) > 0.05, // 0.05 is a tolerance to avoid issues with near-perpendicular angles
*/

/*
antCheckDir = (ant, tun) => {
  console.log("Check dir: ant.scale:", ant.scale, "ant.r:", ant.r, "tun.r:", tun.r, "antDir:", !!antDir(ant, tun), "ant.q[0].rev:", !!ant.q[0].rev);

  if (antDir(ant, tun) == !!ant.q[0].rev) {
    console.log("Direction mismatch -  REFLECTING from:", ant.r);
    ant.r = normalize360(deg180 - ant.r);
    updateAntPosition(ant, getEl(ant.id));// TEMP
    console.log("to:", ant.r);
  }
},*/



        /*
        // Determine if we're heading towards our destination or away from it.
        // @TODO move this to the 'dive' task as a lookahead to avoid flickering?
        if (action.rev ? antTunPos.pc > action.dist : antTunPos.pc < action.dist) {
          // We're heading the wrong way.
          console.log("heading wrong way, switching direction", antTunPos.pc, action.dist, antTunPos);
          if (ant.pose == 'side') {
            console.log("side dir change - ant flip");
            stopstopstop();
            //antFlip(ant);

            //ant.scale *= -1;
            //ant.r = normalize360(deg180 - ant.r);

          }
          else {
            console.log("prone dir change - opposite angle");
            ant.r = oppositeAngle(ant.r);
          }
        }*/




// Returns true if ant is facing forward along the tunnel, false if backward.
//antDir = (ant, tun, diff = normalize360(/*normalize360(*/ant.r - 90 + (ant.scale < 0 ? deg180 : 0) /*)*/ - radToDeg(atan2(tun.y2 - tun.y1, tun.x2 - tun.x1)))) => abs(diff > deg180 ? diff - deg360 : diff) <= 90,

/*
antDir = (ant, tun, diff = normalize360(ant.r - 90 + (ant.scale < 0 ? deg180 : 0) - radToDeg(atan2(tun.y2 - tun.y1, tun.x2 - tun.x1)))) => {
  console.log("ANTDIR ant.scale:", ant.scale, ", diff:", diff);
  return abs(diff > deg180 ? diff - deg360 : diff) <= 90
},*/
/*
antDir = (ant, tun) => {
  let diff = normalize360(
    ant.r - 90 + (ant.scale < 0 ? deg180 : 0) - radToDeg(atan2(tun.y2 - tun.y1, tun.x2 - tun.x1))
  );

  // Normalize into [-180, 180]
  if (diff > 180) diff -= 360;

  console.log("ANTDIR ant.scale:", ant.scale, ", diff:", diff);
  return Math.abs(diff) <= 90;
},*/
/*
antDir = (ant, tun) => {
  // Ant facing vector
  const angle = ant.r - 90 + (ant.scale < 0 ? 180 : 0);
  const ax = Math.cos(degToRad(angle));
  const ay = Math.sin(degToRad(angle));

  // Vectors from ant to tunnel ends
  const vx2 = tun.x2 - ant.x;
  const vy2 = tun.y2 - ant.y;
  const vx1 = tun.x1 - ant.x;
  const vy1 = tun.y1 - ant.y;

  const dotToEnd = ax * vx2 + ay * vy2;
  const dotToStart = ax * vx1 + ay * vy1;

  const result = dotToEnd > 0 && dotToEnd > dotToStart;

  console.log('[ANTDBG]', {
    antAngle: angle.toFixed(2),
    dotToEnd: dotToEnd.toFixed(2),
    dotToStart: dotToStart.toFixed(2),
    result
  });

  return result;
},*/

/*
getWaypointAngle = (points, antAngle, sumX = 0, sumY = 0) => {
  for (let i = 0; i < points.length - 1; i++) {
    let p1 = points[i], p2 = points[i + 1], angle = atan2(p1.y - p2.y, p2.x - p1.x); // Originally was atan2(p2.y - p1.y, p2.x - p1.x) but that was skewing the angle slightly?
    sumX += cos(angle);
    sumY += sin(angle);
  }
  let avgAngle = normalize360(radToDeg(atan2(sumY, sumX)) );
  console.log("avgAngle: ", avgAngle);
  return avgAngle;
},
  //return abs(normalize180(oppositeAngle(avgAngle) - antAngle)) < abs(normalize180(avgAngle - antAngle)) ? oppositeAngle(avgAngle) : avgAngle;
*/


////////////getAntWorldFacing = (ant) => ant.scale < 0 ? normalize360(180 - ant.r) : ant.r,
/*
antDir = (ant, tun) => {
  // Ant facing vector
  const angle = ant.r - 90 + (ant.scale < 0 ? 180 : 0);
  const ax = Math.cos(degToRad(angle));
  const ay = Math.sin(degToRad(angle));
  // // Vectors from ant to tunnel ends
  const vx2 = tun.x2 - ant.x;
  const vy2 = tun.y2 - ant.y;
  const vx1 = tun.x1 - ant.x;
  const vy1 = tun.y1 - ant.y;
  const dotToEnd = ax * vx2 + ay * vy2;
  const dotToStart = ax * vx1 + ay * vy1;
  const result = dotToEnd > 0 && dotToEnd > dotToStart;
  console.log('[ANTDBG]', { antAngle: angle.toFixed(2), dotToEnd: dotToEnd.toFixed(2), dotToStart: dotToStart.toFixed(2), result });
  return result;
},
*/
/*

antDir = (ant, tun) => {
  console.log(ant.r);
  // Ant's world-facing vector
  const antAngle = ant.scale < 0 ? normalize360(180 - ant.r) : ant.r;
  const ax = Math.cos(degToRad(antAngle));
  const ay = Math.sin(degToRad(antAngle));

  // Vector from ant to "true" tunnel end
  const vx = tun.x2 - ant.x;
  const vy = tun.y2 - ant.y;

  // Dot product tells if ant is pointing roughly toward x2/y2
  const dot = ax * vx + ay * vy;
  const facing = dot > 0;

  console.log('[ANTDIR DEBUG]', {
    ant_r: ant.r.toFixed(2),
    ant_scale: ant.scale,
    antAngle: antAngle.toFixed(2),
    ant_x: ant.x.toFixed(2),
    ant_y: ant.y.toFixed(2),
    tun_x2: tun.x2.toFixed(2),
    tun_y2: tun.y2.toFixed(2),
    vx: vx.toFixed(2),
    vy: vy.toFixed(2),
    dot: dot.toFixed(2),
    facing
  });

  return facing;
},
*/

if (abs(normalize180(tun.r - ant.r)) > 3 && offset > 3) {
  /*
  let t = max(0, min(dist.d, vx * dist.x + vy * dist.y)),
    dx = (tun.x1 + dist.x * t) - ant.x, dy = (tun.y1 + dist.y * t) - (ant.y - surface), d = hypot(dx, dy) * nudge,
    blend = min(1, offset / 50), // 0=close (follow tunnel), 1=far (aim at midline).
    step = min(max(offset / 30, 1, 10)); // Turn speed: 1–10° per update.
  ant.x += dx / d;
  ant.y += dy / d;
  ant.r = normalize360(ant.r + min(max(normalize180(normalize360((1 - blend) * tun.r + blend * radToDeg(atan2(dy, dx))) - ant.r), -step, step)));
*/


/*
// Nudges an ant toward the middle line of a tunnel.
antNudgeToMid = (ant, tun, nudge) => {
  let antDistToMid = calcDistComponents(tun.x1, tun.y1, tun.x2, tun.y2), vx = ant.x - tun.x1, vy = ant.y - surface - tun.y1;
  if (abs(normalize180(tun.r - ant.r)) > 3 && abs(vx * antDistToMid.y - vy * antDistToMid.x) > 3) {
    let t = max(0, min(antDistToMid.d, vx * antDistToMid.x + vy * antDistToMid.y)),
      cx = tun.x1 + antDistToMid.x * t, cy = tun.y1 + antDistToMid.y * t;
      dx = cx - ant.x, dy = cy - (ant.y - surface), d = hypot(dx, dy);
    ant.x += dx / d * nudge;
    ant.y += dy / d * nudge;
    ant.r = normalize360(ant.r - sign(normalize180(tun.r - ant.r)));
  }
},
*/

/*
getWaypointIndex = (obj, wps = wayPoints, threshold = 10, exact = wayPoints.indexOf(obj), d) =>
  exact < 0 ? wps.reduce((best, wp, i) => ((d = calculateDistance(obj.x, obj.y - (obj.t ? surface : 0), wp.x, wp.y)) < best.d && d < threshold) ? {d, i} : best, {d: Infinity, i: -1}).i : exact,

getWaypointIndex = (obj, wps = wayPoints, threshold = 10, exact = wps.indexOf(obj)) =>
  exact < 0 ? wps.reduce((best, wp, i) => { let d = calculateDistance(obj.x, obj.y - (obj.t ? surface : 0), wp.x, wp.y); return (d < best.d && d < threshold) ? { d, i } : best; }, { d: Infinity, i: -1 }).i : exact,
*/


// Checks if a waypoint is in an action's waypoint list.
///wpKnown = (wp, action) => wp && action.wp.some(w => w.x == wp.x && w.y == wp.y),

////ORIGINAL antDir: return abs(normalize180((ant.scale < 0 ? mirrorAngle(ant.r) : ant.r) - 90 - radToDeg(atan2(tun.y2 - tun.y1, tun.x2 - tun.x1)))) < 90;

////antDir = (ant, tun, antAngle = degToRad(ant.r - 90)) => ((ant.scale < 0 ? -cos(antAngle) : cos(antAngle)) * (tun.x2 - tun.x1) + sin(antAngle) * (tun.y2 - tun.y1)) > 0,


      /*
      /// Now to make it convincing, "move" ants that are in the other half of the tube.
      otherAnts.forEach(ant => {
        // If nipPh 3-5 -> decrease x towards other farm, otherwise increase x towards midway.  Some extra calculations included to make sure the ants don't get bunched up in the other tube.
        if (ant.nipPh) {
          let ahead = otherAnts.filter(a => a.id != ant.id && a.x < ant.x).sort((a, b) => b.x - a.x)[0];
          ant.x += ant.nipPh > 2 ? max(-40 * clamp((ant.x - (ahead?.x || 0) - 20) / 280, 0, 1), -ant.x - 25) : 40;
          if (ant.nipPh < 3 && ant.x > 600) {
            // Ant in other half of tube has reached midway, so bring them over to this half of the tube.
            ants.push(ant);
            otherAnts = otherAnts.filter(a => a.id != ant.id);
            ant.nipPh = 3; // Skip to phase 3.
          }
        }
      });
      */



   /// ant.r = normalize360(ant.r + clamp(normalize180((1 - blend) * normalize360(rev ? deg180 + tun.r : tun.r) + blend * angleFromDelta(dx, dy) - ant.r), -step, step));
/*
antNudgeToMid = (ant, tun, nudge, rev, dist = calcDistComponents(tun.x1, tun.y1, tun.x2, tun.y2),
    vx = ant.x - tun.x1, vy = ant.y - surface - tun.y1, offset = abs(vx * dist.y - vy * dist.x),
    t = max(0, min(dist.d, vx * dist.x + vy * dist.y)), dx = (tun.x1 + dist.x * t) - ant.x, dy = (tun.y1 + dist.y * t) - (ant.y - surface),
    d = hypot(dx, dy), step = clamp(offset / 30, 1, 10), blend = min(1, offset / 50), move = min(nudge, d)
  ) => {
    if (d > 2) {
      ant.x += (dx / d) * move;
      ant.y += (dy / d) * move;
    }
    //ant.r = normalize360(ant.r + max(-step, min(step, normalize180((1 - blend) * normalize360(rev ? deg180 + tun.r : tun.r) + blend * radToDeg(atan2(dy, dx)) - ant.r))));
    ant.r = normalize360(ant.r + clamp(normalize180((1 - blend) * (rev ? deg180 + tun.r : tun.r) + blend * angleFromDelta(dx, dy, -ant.r)), -step, step));
},
*/
/*step = max(1, min(10, offset / 30))*/
    //ant.r = normalize360(ant.r + max(-step, min(step, normalize180((1 - blend) * normalize360(rev ? deg180 + tun.r : tun.r) + blend * radToDeg(atan2(dy, dx)) - ant.r))));
    //ant.r = normalize360(ant.r + clamp(normalize180((1 - blend) * normalize360(rev ? deg180 + tun.r : tun.r) + blend * getAngle(dx, dy) - ant.r), -step, step));


/*
// Nudges an ant toward the middle line of a tunnel.
antNudgeToMid = (ant, tun, nudge, rev, dist = calcDistComponents(tun.x1, tun.y1, tun.x2, tun.y2),
    vx = ant.x - tun.x1, vy = ant.y - surface - tun.y1, offset = abs(vx * dist.y - vy * dist.x),
    t = max(0, min(dist.d, vx * dist.x + vy * dist.y)), dx = (tun.x1 + dist.x * t) - ant.x, dy = (tun.y1 + dist.y * t) - (ant.y - surface),
    d = hypot(dx, dy), step = clamp(offset / 30, 1, 10), blend = min(1, offset / 50), move = min(nudge, d)
  ) => {
    if (d > 2) {
      ant.x += (dx / d) * move;
      ant.y += (dy / d) * move;
    }
    ant.r = normalize360(ant.r + clamp(normalize180((1 - blend) * (rev ? deg180 + tun.r : tun.r) + blend * radToDeg(atan2(dy, dx)) -ant.r), -step, step));

    console.log("nudge to mid");
},*/

/*
    let baseAngle = rev ? oppositeAngle(tun.r) : tun.r,
        midAngle = angleFromDelta(dx, dy),
        delta = clamp(normalize180(baseAngle + 90 - ant.r) * (1 - blend) + normalize180(midAngle - ant.r) * blend, -step, step)
*/
   // let antR = ant.r;
    ///ant.r = normalize360(ant.r + delta);

    ///ant.r = normalize360(ant.r + clamp(normalize180((1 - blend) * normalize360(rev ? deg180 + tun.r : tun.r) + blend * angleFromDelta(dx, dy) - ant.r), -step, step));
   // ant.r = normalize360(ant.r + clamp(normalize180((1 - blend) * ((rev ? oppositeAngle(tun.r) : tun.r) + 90) + blend * angleFromDelta(dx, dy) - ant.r), -step, step));
   // console.warn(tun.id, "nudge to mid", "tun rot:", (rev ? oppositeAngle(tun.r) : tun.r)+90, "ant rot:", antR, "so we must turn:", ant.r > antR ? "clockwise" : 'anticlockwise');



// Estimates where an ant's feet would be.
// @todo doesn't work and not used for anything
////antFootPoint = (ant, leg = antOffsetY(ant), rad = degToRad(ant.r + deg180 * ant.scale)) => ({x: ant.x + cos(rad) * leg, y: ant.y + sin(rad) * leg}),
