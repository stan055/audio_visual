class Wave6 {
    itemCount = 93;
    minHeight = 0.03;
    barWidth = 1;
    widthInPercent = 0.4; // (0-1)
    bassFactor = 1;
    bassCount = 150;
    startX = 0;
    heightBarFactor = 1.1;
    ctx;
    canvas;
    styles = [[1, 'hsl(250, 90%, 77%)']]; 
  

    constructor(
        canvas, 
        itemCount = 93, 
        minHeight = 0.03, 
        widthInPercent = 0.4, 
      ) {

      this.canvas = canvas;
      this.widthInPercent = widthInPercent;
      this.itemCount = itemCount;

      this.minHeight = this.canvasHeight * minHeight;
      this.barWidth = this.canvasWidth / this.itemCount;
      this.startX = this.barWidth * widthInPercent / 2;
      
      this.ctx = this.canvas.getContext('2d');
      this.ctx.lineWidth = this.barWidth * widthInPercent;
    }


    draw(arrayHeightBars) {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    
        const midCanvasY = this.canvasHeight / 2;
        this.ctx.strokeStyle = this.styles[0][1];
    
        for (let i = 0; i < arrayHeightBars.length; i++) {
          this.ctx.beginPath();
    
          const step = this.barWidth * i + this.startX;
          const heightBar = arrayHeightBars[i] * this.canvasHeight * this.heightBarFactor + this.minHeight;      
    
          this.ctx.moveTo(step, midCanvasY + heightBar / 2);
          this.ctx.lineTo(step, midCanvasY - heightBar + heightBar / 2);
          this.ctx.stroke();
        }
    }

    get canvasHeight() { 
      if (this._cachedCanvasHeight) {
        return this._cachedCanvasHeight
      }
    
      if (window) {
        this._cachedCanvasHeight =  this.canvas.clientHeight * window.devicePixelRatio
        return this._cachedCanvasHeight
      } else {
        this._cachedCanvasHeight =  this.canvas.height
        return this._cachedCanvasHeight 
      }
    }

    get canvasWidth() { 
      if (this._cachedCanvasWidth) {
        return this._cachedCanvasWidth
      }
    
      if (window) {
        this._cachedCanvasWidth =  this.canvas.clientWidth * window.devicePixelRatio
        return this._cachedCanvasWidth
      } else {
        this._cachedCanvasWidth =  this.canvas.width
        return this._cachedCanvasWidth 
      }
    }
}