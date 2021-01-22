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

  
    get height() {return this.canvas.height;}
    get width() {return this.canvas.width;}
  

    constructor(
        canvas, 
        itemCount = 93, 
        minHeight = 0.03, 
        widthInPercent = 0.4, 
      ) {

      this.canvas = canvas;
      this.minHeight = minHeight;
      this.widthInPercent = widthInPercent;
      this.itemCount = itemCount;
  
      this.calculatingVariables();
    }
  
    getSize() {
        this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
        this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;
    }
    
    calculatingVariables(
        itemCount = this.itemCount, 
        minHeight = this.minHeight, 
        widthInPercent = this.widthInPercent 
      ) {
      
        this.getSize();
     
      this.minHeight = this.height * minHeight; // New minHeight
      this.itemCount = itemCount; // New itemCount
     
      // calculating
      this.barWidth = this.width / this.itemCount;
      this.startX = this.barWidth * widthInPercent / 2;
      
      this.ctx = this.canvas.getContext('2d');
      this.ctx.lineWidth = this.barWidth * widthInPercent;
    }


    draw(arrayHeightBars) {
        this.ctx.clearRect(0, 0, this.width, this.height)
    
        const midCanvasY = this.height / 2;
        this.ctx.strokeStyle = this.styles[0][1];
    
        for (let i = 0; i < arrayHeightBars.length; i++) {
          this.ctx.beginPath();
    
          const step = this.barWidth * i + this.startX;
          const heightBar = arrayHeightBars[i] * this.height * this.heightBarFactor + this.minHeight;      
    
          this.ctx.moveTo(step, midCanvasY + heightBar / 2);
          this.ctx.lineTo(step, midCanvasY - heightBar + heightBar / 2);
          this.ctx.stroke();
        }
    }
}