class Wave7 {
    paddingBottom = 0;
    itemCount = 0;
    minHeight = 0;
    barWidth = 1;
    widthInPercent = 0.5; // (0-1)
    bassFactor = 1;
    bassCount = 150;
    waveWidth = 0.09;
    startX = 0;
    ctxLineWidth = 0;
    heightBarFactor = 1.0;
    tension = 0.4;
    analyser;
    ctx;
    canvas;
    styles = [[1, 'hsl(304, 100%, 67%)']];
    
  
    get height() {return this.canvas.height;}
    get width() {return this.canvas.width;}
  

    constructor(
        canvas, 
        itemCount = 45, 
        minHeight = 0.03, 
        widthInPercent = 0.5, 
        paddingBottom = 0
      ) {

      this.canvas = canvas;
      this.minHeight = this.height * minHeight;
      this.widthInPercent = widthInPercent;
      this.itemCount = itemCount;
      this.paddingBottom = paddingBottom;
  
      this.calculatingVariables();
    }
  

    calculatingVariables(itemCount = this.itemCount, minHeight = 0, widthInPercent = this.widthInPercent ) {
      this.getSize();
     
      this.minHeight = this.height * minHeight; // New minHeight
      this.itemCount = itemCount; // New itemCount
     
      // calculating
      this.barWidth = this.width / this.itemCount;
      this.startX = this.barWidth * widthInPercent / 2;
      
      this.ctx = this.canvas.getContext('2d');
      this.ctx.lineWidth = this.barWidth * widthInPercent;
    }
  

    getSize() {
      this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
      this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;
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
      this.ctx.lineTo(this.width, this.height);
      this.ctx.lineTo(0, this.height);

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
        this.ctx.clearRect(0, 0, this.width, this.height)
    
        const createSplinePoints = (hFactor1) => {
          // Create points addSplinePoint(x, y)
          const pts1 = [];
          const step = Math.floor(this.width * this.waveWidth); // Step should be an integer
          
          for (let i = 0; i <= this.width+step; i += step) {
            const height = arrayHeightBars[i] * this.height;
            const y1 = height * hFactor1 + this.minHeight;
    
            pts1.push(i); pts1.push(this.height - y1);
    
          }
          return pts1;
        }
    
        arrayHeightBars = this.lowerBass(arrayHeightBars, this.bassCount, this.bassFactor);
    
        const pts1 = createSplinePoints(1); 
    
        this.ctx.strokeStyle = this.styles[0][1];
        this.drawSplines(pts1);    
    }
}