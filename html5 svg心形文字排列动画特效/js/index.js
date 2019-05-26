let rid = null; // request animation id
const SVG_NS = "http://www.w3.org/2000/svg";
const pathlength = shape.getTotalLength();

let t = 0; // at the begining of the path
let lengthAtT = pathlength * t;

let d = shape.getAttribute("d");

// 1. build the d array
let n = d.match(/C/gi).length; // how many times

let pos = 0; // the position, used to find the indexOf the nth C

class subPath {
  constructor(d) {
    this.d = d;
    this.get_PointsRy();
    this.previous = subpaths.length > 0 ? subpaths[subpaths.length - 1] : null;
    this.measurePath();
    this.get_M_Point(); //lastPoint
    this.lastCubicBezier;
    this.get_lastCubicBezier();
  }

  get_PointsRy() {
    this.pointsRy = [];
    let temp = this.d.split(/[A-Z,a-z\s,]/).filter(v => v); // remove empty elements
    temp.map(item => {
      this.pointsRy.push(parseFloat(item));
    }); //this.pointsRy numbers not strings
  }

  measurePath() {
    let path = document.createElementNS(SVG_NS, "path");
    path.setAttributeNS(null, "d", this.d);
    // no need to append it to the SVG
    // the lengths of every path in dry
    this.pathLength = path.getTotalLength();
  }

  get_M_Point() {
    if (this.previous) {
      let p = this.previous.pointsRy;
      let l = p.length;
      this.M_point = [p[l - 2], p[l - 1]];
    } else {
      let p = this.pointsRy;
      this.M_point = [p[0], p[1]];
    }
  }

  get_lastCubicBezier() {
    let lastIndexOfC = this.d.lastIndexOf("C");
    let temp = this.d
    .substring(lastIndexOfC + 1)
    .split(/[\s,]/)
    .filter(v => v);
    let _temp = [];
    temp.map(item => {
      _temp.push(parseFloat(item));
    });
    this.lastCubicBezier = [this.M_point];
    for (let i = 0; i < _temp.length; i += 2) {
      this.lastCubicBezier.push(_temp.slice(i, i + 2));
    }
  }
}

let subpaths = [];

// create new subPaths
for (let i = 0; i < n; i++) {
  // finds the of nth C in d
  let newpos = d.indexOf("C", pos + 1);
  if (i > 0) {
    // if it's not the first C
    let sPath = new subPath(d.substring(0, newpos));
    subpaths.push(sPath);
  }
  //change the value of the position pos
  pos = newpos;
}
// at the end add d to the subpaths array
subpaths.push(new subPath(d));

// 2. get the index of the bezierLengths where the point at t is
let index;
for (index = 0; index < subpaths.length; index++) {
  if (subpaths[index].pathLength >= lengthAtT) {
    break;
  }
}

function get_T(t, index) {
  let T;
  lengthAtT = pathlength * t;
  if (index > 0) {
    T =
      (lengthAtT - subpaths[index].previous.pathLength) /
      (subpaths[index].pathLength - subpaths[index].previous.pathLength);
  } else {
    T = lengthAtT / subpaths[index].pathLength;
  }
  //console.log(T)
  return T;
}

let T = get_T(t, index);

let newPoints = getBezierPoints(T, subpaths[index].lastCubicBezier);

drawCBezier(newPoints, partialPath, index);

function getBezierPoints(t, points) {
  let helperPoints = [];

  // helper points 0,1,2
  for (let i = 1; i < 4; i++) {
    //points.length must be 4 !!!
    let p = lerp(points[i - 1], points[i], t);
    helperPoints.push(p);
  }

  // helper points 3,4
  helperPoints.push(lerp(helperPoints[0], helperPoints[1], t));
  helperPoints.push(lerp(helperPoints[1], helperPoints[2], t));

  // helper point 5 is where the first Bézier ends and where the second Bézier begins
  helperPoints.push(lerp(helperPoints[3], helperPoints[4], t));

  // points for the dynamic bézier
  let firstBezier = [
    points[0],
    helperPoints[0],
    helperPoints[3],
    helperPoints[5]
  ];
  //console.log(firstBezier)
  return firstBezier;
}

function lerp(A, B, t) {
  // a virtual line from A to B
  // get the position of a point on this line
  // if(t == .5) the point in in the center of the line
  // 0 <= t <= 1
  let ry = [
    (B[0] - A[0]) * t + A[0], //x
    (B[1] - A[1]) * t + A[1] //y
  ];
  return ry;
}

function drawCBezier(points, path, index) {
  let d;

  if (index > 0) {
    d = subpaths[index].previous.d;
  } else {
    d = `M${points[0][0]},${points[0][1]} C`;
  }

  // points.length == 4
  for (let i = 1; i < 4; i++) {
    d += ` ${points[i][0]},${points[i][1]} `;
  }
  //console.log(d)
  partialPath.setAttributeNS(null, "d", d);
}

/*
_t.addEventListener("input", ()=>{
  t = _t.value;
  lengthAtT = pathlength*t;
  for(index = 0; index < subpaths.length; index++){
if(subpaths[index].pathLength >= lengthAtT){break; }  
}
  T = get_T(t, index); 
  newPoints = getBezierPoints(T,subpaths[index].lastCubicBezier);
  drawCBezier(newPoints, partialPath, index);
})*/

t = 0.025;
function Typing() {
  rid = window.requestAnimationFrame(Typing);
  if (t >= 1) {
    window.cancelAnimationFrame(rid);
    rid = null;
  } else {
    t += 0.0025;
  }

  lengthAtT = pathlength * t;
  for (index = 0; index < subpaths.length; index++) {
    if (subpaths[index].pathLength >= lengthAtT) {
      break;
    }
  }
  T = get_T(t, index);
  newPoints = getBezierPoints(T, subpaths[index].lastCubicBezier);
  drawCBezier(newPoints, partialPath, index);
}

Typing();
theSvg.addEventListener("click", () => {
  if (rid) {
    window.cancelAnimationFrame(rid);
    rid = null;
  } else {
    if (t >= 1) {
      t = 0.025;
    }
    rid = window.requestAnimationFrame(Typing);
  }
});

cb.addEventListener("input", () => {
  if (cb.checked) {
    useThePath.style.display = "block";
  } else {
    useThePath.style.display = "none";
  }
});