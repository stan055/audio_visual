class WaveSuperClass {
  fftSize = 2048;
  minDecibels = -100;
  bassCount = 150;
  chromakeyColor = 'green';
  ctx;
  canvas;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
  }

  get canvasHeight() {
    if (this._cachedCanvasHeight) {
      return this._cachedCanvasHeight
    }

    this._cachedCanvasHeight =  this.canvas.height
    return this._cachedCanvasHeight
  }

  get canvasWidth() {
    if (this._cachedCanvasWidth) {
      return this._cachedCanvasWidth
    }

    this._cachedCanvasWidth =  this.canvas.width
    return this._cachedCanvasWidth
  }


  clearCanvas() {
    if (this.chromakeyColor) {
      this.ctx.beginPath();
      this.ctx.fillStyle = this.chromakeyColor;
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    } else {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    }
  }

  filterAudio(array, count, factor) {
    for (let i = 0; i < count; i++) {
      array[i] = array[i] * factor;
    }
    return array;
  }
}



function smoothPath(ctx, pts, tension) {

  function va(arr, i, j) {
    return [arr[2 * j] - arr[2 * i], arr[2 * j + 1] - arr[2 * i + 1]]
  }
  
  
  function dista(arr, i, j) {
    return Math.sqrt(Math.pow(arr[2 * i] - arr[2 * j], 2) + Math.pow(arr[2 * i + 1] - arr[2 * j + 1], 2));
  }
  
  
  function ctlpts(x1, y1, x2, y2, x3, y3) {
    var t = tension;
    var v = va([x1, y1, x2, y2, x3, y3], 0, 2);
    var d01 = dista([x1, y1, x2, y2, x3, y3], 0, 1);
    var d12 = dista([x1, y1, x2, y2, x3, y3], 1, 2);
    var d012 = d01 + d12;
    return [x2 - v[0] * t * d01 / d012, y2 - v[1] * t * d01 / d012,
    x2 + v[0] * t * d12 / d012, y2 + v[1] * t * d12 / d012];
  }
  
  
  function drawCurvedPath(cps, pts) {
    var len = pts.length / 2; // number of points
  
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    // from point 0 to point 1 is a quadratic
    ctx.quadraticCurveTo(cps[0], cps[1], pts[2], pts[3]);
    // for all middle points, connect with bezier
    for (var i = 2; i < len - 1; i += 1) {
      ctx.bezierCurveTo(cps[(2 * (i - 1) - 1) * 2], cps[(2 * (i - 1) - 1) * 2 + 1],
        cps[(2 * (i - 1)) * 2], cps[(2 * (i - 1)) * 2 + 1],
        pts[i * 2], pts[i * 2 + 1]);
    }
    ctx.quadraticCurveTo(cps[(2 * (i - 1) - 1) * 2], cps[(2 * (i - 1) - 1) * 2 + 1],
      pts[i * 2], pts[i * 2 + 1]);

  }
  
  
  function drawSplines(pts) {
    let cps = []; // There will be two control points for each "middle" point, 1 ... len-2e
    for (var i = 0; i < pts.length - 2; i += 1) {
      cps = cps.concat(ctlpts(pts[2 * i], pts[2 * i + 1], pts[2 * i + 2], pts[2 * i + 3], pts[2 * i + 4], pts[2 * i + 5]));
    }
    drawCurvedPath(cps, pts);
  }

  drawSplines(pts)
}