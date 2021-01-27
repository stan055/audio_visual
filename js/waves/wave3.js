class Wave3 extends WaveSuperClass{
  waveWidth = 0.06; // 0.02-0.1
  waveHeightFactor = 5;
  tension = 0.4;
  fftSize = 2048*4;
  minDecibels = -80;
  styles = [[1, 'hsl(1, 99%, 99%)']];
  lineWidth = 1;
  factorRadiusOfCircles = [5.5, 3.8, 2]; // Difference factor radius of circles

  constructor(canvas) {
    super(canvas);
  }


  va(arr, i, j) {
    return [arr[2*j]-arr[2*i], arr[2*j+1]-arr[2*i+1]]
  }


  dista(arr, i, j) {
    return Math.sqrt(Math.pow(arr[2*i]-arr[2*j], 2) + Math.pow(arr[2*i+1]-arr[2*j+1], 2));
  }


  ctlpts(x1,y1,x2,y2,x3,y3) {
    var t = this.tension;
    var v = this.va([x1,y1,x2,y2,x3,y3], 0, 2);
    var d01 = this.dista([x1,y1,x2,y2,x3,y3], 0, 1);
    var d12 = this.dista([x1,y1,x2,y2,x3,y3], 1, 2);
    var d012 = d01 + d12;
    return [x2 - v[0] * t * d01 / d012, y2 - v[1] * t * d01 / d012,
            x2 + v[0] * t * d12 / d012, y2 + v[1] * t * d12 / d012 ];
  }


  drawCurvedPath(cps, pts) {
    var len = pts.length / 2; // number of points

    this.ctx.beginPath();
    this.ctx.moveTo(pts[0], pts[1]);
    // from point 0 to point 1 is a quadratic
    this.ctx.quadraticCurveTo(cps[0], cps[1], pts[2], pts[3]);
    // for all middle points, connect with bezier
    for (var i = 2; i < len-1; i += 1) {
      this.ctx.bezierCurveTo(cps[(2*(i-1)-1)*2], cps[(2*(i-1)-1)*2+1],
                        cps[(2*(i-1))*2], cps[(2*(i-1))*2+1],
                        pts[i*2], pts[i*2+1]);
    }
    this.ctx.quadraticCurveTo(cps[(2*(i-1)-1)*2], cps[(2*(i-1)-1)*2+1],
                         pts[i*2], pts[i*2+1]);


    this.ctx.stroke();
  }


  drawSplines(pts) {
    let cps = []; // There will be two control points for each "middle" point, 1 ... len-2e
    for (var i = 0; i < pts.length - 2; i += 1) {
      cps = cps.concat(this.ctlpts(pts[2*i], pts[2*i+1], pts[2*i+2], pts[2*i+3], pts[2*i+4], pts[2*i+5]));
    }
      this.drawCurvedPath(cps, pts);
  }

  draw(arrayHeightBars) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

      const createSplinePoints = (hFactor, radius) => {
        // Create points addSplinePoint(x, y)
        const pts1 = [];
        
        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;
        const steps = Math.floor(2*Math.PI*radius);

        let waveHeight;

        for (var i = 0; i <= steps; i += steps * this.waveWidth) {
          if (arrayHeightBars.length > i)
            waveHeight = arrayHeightBars[i >> 0] > 0 ? arrayHeightBars[i >> 0] * hFactor : 0;
          else
            waveHeight = 0;

          const r = radius + waveHeight;
          const cosSin = 2 * Math.PI * i / steps;
          const xValue = centerX + r * Math.cos(cosSin);
          const yValue = centerY + r * Math.sin(cosSin);
          pts1.push(xValue); pts1.push(yValue);
        }
        // Closure
        waveHeight = arrayHeightBars[0] > 0 ? arrayHeightBars[0] * hFactor : 0;
        const xValue = centerX + (radius + waveHeight) * Math.cos(2 * Math.PI * steps / steps);
        const yValue = centerY + (radius + waveHeight) * Math.sin(2 * Math.PI * steps / steps);
        pts1.push(xValue); pts1.push(yValue);
      

        return pts1;
      }

      const steps = Math.floor(2*Math.PI*this.canvasHeight/2);
      const pts = [];

      for (let i = 0; i < this.factorRadiusOfCircles.length; i++) {
        pts[i] = createSplinePoints(
          this.waveHeightFactor, 
          this.canvasHeight/2 - this.waveHeightFactor/2 * this.factorRadiusOfCircles[i]);
        
        if (arrayHeightBars.length - steps > steps) arrayHeightBars = arrayHeightBars.slice(steps);
      }

      this.ctx.lineWidth = this.lineWidth;
      this.ctx.strokeStyle = this.styles[0][1];

      pts.forEach(p => this.drawSplines(p));
  }
}
