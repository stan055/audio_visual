class Wave5 {
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
    styles = [[1, 'hsl(150, 100%, 78%)']];


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


    draw(arrayHeightBars) {
        this.ctx.clearRect(0, 0, this.width, this.height)

        this.ctx.strokeStyle = this.styles[0][1];
        
        for (let i = 0; i < arrayHeightBars.length; i++) {
          this.ctx.beginPath();
    
          const step = this.barWidth * i + this.startX;
          const heightBar = arrayHeightBars[i] * this.height + this.minHeight;
    
          this.ctx.moveTo(step, this.height);
          this.ctx.lineTo(step, this.height - heightBar);
          this.ctx.stroke();
        }
    }

    
    get height() {return this.canvas.height;}
    get width() {return this.canvas.width;}

}