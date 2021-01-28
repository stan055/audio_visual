class Wave7 extends WaveSuperClass {
  minHeight = 0.04;
  waveWidth = 0.085;
  tension = 0.4;
  fftSize = 2048 * 4;
  minDecibels = -80;
  styles = [[1, 'rgb(255, 87, 244)']];
  chromakeyColor;

  constructor(canvas) {
    super(canvas);
    this.minHeight = this.canvasHeight * this.minHeight;
  }


  va(arr, i, j) {
    return [arr[2 * j] - arr[2 * i], arr[2 * j + 1] - arr[2 * i + 1]]
  }


  dista(arr, i, j) {
    return Math.sqrt(Math.pow(arr[2 * i] - arr[2 * j], 2) + Math.pow(arr[2 * i + 1] - arr[2 * j + 1], 2));
  }


  ctlpts(x1, y1, x2, y2, x3, y3) {
    var t = this.tension;
    var v = this.va([x1, y1, x2, y2, x3, y3], 0, 2);
    var d01 = this.dista([x1, y1, x2, y2, x3, y3], 0, 1);
    var d12 = this.dista([x1, y1, x2, y2, x3, y3], 1, 2);
    var d012 = d01 + d12;
    return [x2 - v[0] * t * d01 / d012, y2 - v[1] * t * d01 / d012,
    x2 + v[0] * t * d12 / d012, y2 + v[1] * t * d12 / d012];
  }


  drawCurvedPath(cps, pts) {
    var len = pts.length / 2; // number of points

    this.ctx.beginPath();
    this.ctx.moveTo(pts[0], pts[1]);
    // from point 0 to point 1 is a quadratic
    this.ctx.quadraticCurveTo(cps[0], cps[1], pts[2], pts[3]);
    // for all middle points, connect with bezier
    for (var i = 2; i < len - 1; i += 1) {
      this.ctx.bezierCurveTo(cps[(2 * (i - 1) - 1) * 2], cps[(2 * (i - 1) - 1) * 2 + 1],
        cps[(2 * (i - 1)) * 2], cps[(2 * (i - 1)) * 2 + 1],
        pts[i * 2], pts[i * 2 + 1]);
    }
    this.ctx.quadraticCurveTo(cps[(2 * (i - 1) - 1) * 2], cps[(2 * (i - 1) - 1) * 2 + 1],
      pts[i * 2], pts[i * 2 + 1]);
  }


  fillOfCurvePath(x1, y1, x2, y2) {
    this.ctx.lineTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.fill();
  }


  drawSplines(pts) {
    let cps = []; // There will be two control points for each "middle" point, 1 ... len-2e
    for (var i = 0; i < pts.length - 2; i += 1) {
      cps = cps.concat(this.ctlpts(pts[2 * i], pts[2 * i + 1], pts[2 * i + 2], pts[2 * i + 3], pts[2 * i + 4], pts[2 * i + 5]));
    }
    this.drawCurvedPath(cps, pts);
  }

  
  draw(arrayHeightBars) {
    this.clearCanvas(this.chromakeyColor);

    const createSplinePoints = (hFactor1) => {
      // Create points addSplinePoint(x, y)
      const pts1 = [];
      const step = Math.floor(this.canvasWidth * this.waveWidth); // Step should be an integer

      for (let i = 0; i <= this.canvasWidth + step; i += step) {
        const height = arrayHeightBars[i] * this.canvasHeight;
        const y1 = height * hFactor1 + this.minHeight;

        pts1.push(i); pts1.push(this.canvasHeight - y1);

      }
      return pts1;
    }

    arrayHeightBars = this.lowerBass(arrayHeightBars, this.bassCount, this.bassTreble);

    const pts1 = createSplinePoints(1);

    this.ctx.strokeStyle = this.styles[0][1];
    this.ctx.fillStyle = this.ctx.strokeStyle;
    
    smoothPath(this.ctx, pts1, this.tension);
    this.fillOfCurvePath(this.canvasWidth, this.canvasHeight, 0, this.canvasHeight);
  }
}
