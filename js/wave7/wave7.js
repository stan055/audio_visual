class Wave7 {
    minHeight = 0.04;
    bassFactor = 0.7;
    bassCount = 150;
    waveWidth = 0.085;
    tension = 0.4;
    ctx;
    canvas;
    styles = [[1, 'hsl(304, 100%, 67%)']];
  

    constructor(
        canvas, 
        minHeight = 0.04, 
      ) {

      this.canvas = canvas;

      this.canvasWidth = this.canvas.clientWidth * window.devicePixelRatio;
      this.canvasHeight = this.canvas.clientHeight * window.devicePixelRatio;
      this.minHeight = this.canvasHeight * minHeight;
  
      this.ctx = this.canvas.getContext('2d');

    }
  
    
    lowerBass(arrayHeightBars, count, factor) {
        for (let i = 0; i < count; i++) {
          arrayHeightBars[i] = arrayHeightBars[i] * factor;
        }
        return arrayHeightBars;
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

      // Closure
      this.ctx.lineTo(this.canvasWidth, this.canvasHeight);
      this.ctx.lineTo(0, this.canvasHeight);

      this.ctx.stroke();
      this.ctx.fill();
    }


    drawSplines(pts) {
      let cps = []; // There will be two control points for each "middle" point, 1 ... len-2e
      for (var i = 0; i < pts.length - 2; i += 1) {
        cps = cps.concat(this.ctlpts(pts[2*i], pts[2*i+1], pts[2*i+2], pts[2*i+3], pts[2*i+4], pts[2*i+5]));
      }
        this.ctx.fillStyle = this.ctx.strokeStyle;
        this.drawCurvedPath(cps, pts);
    }
          
    draw(arrayHeightBars) {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    
        const createSplinePoints = (hFactor1) => {
          // Create points addSplinePoint(x, y)
          const pts1 = [];
          const step = Math.floor(this.canvasWidth * this.waveWidth); // Step should be an integer
          
          for (let i = 0; i <= this.canvasWidth+step; i += step) {
            const height = arrayHeightBars[i] * this.canvasHeight;
            const y1 = height * hFactor1 + this.minHeight;
    
            pts1.push(i); pts1.push(this.canvasHeight - y1);
    
          }
          return pts1;
        }
    
        arrayHeightBars = this.lowerBass(arrayHeightBars, this.bassCount, this.bassFactor);
    
        const pts1 = createSplinePoints(1); 
    
        this.ctx.strokeStyle = this.styles[0][1];
        this.drawSplines(pts1);    
    }
}