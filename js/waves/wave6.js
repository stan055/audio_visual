class Wave6 extends WaveSuperClass {
  itemCount = 93;
  minHeight = 0.03;
  barWidth = 1;
  widthInPercent = 0.4; // (0-1)
  startX = 0;
  fftSize = 2048;
  minDecibels = -60;
  styles = [{ heightFactor: 1.1, alpha: 1, color: 'rgb(191, 224, 249)' }];
  

  constructor(canvas) {
    super(canvas)

    this.startX = this.barWidth * this.widthInPercent / 2;
    this.minHeight = this.canvasHeight * this.minHeight;
    this.barWidth = this.canvasWidth / this.itemCount;
    this.ctx.lineWidth = this.barWidth * this.widthInPercent;
  }


  draw(arrayHeightBars) {
    this.clearCanvas();

    const midCanvasY = this.canvasHeight / 2;
    this.ctx.strokeStyle = this.styles[0].color;

    for (let i = 0; i < arrayHeightBars.length; i++) {
      this.ctx.beginPath();

      const step = this.barWidth * i + this.startX;
      const heightBar = arrayHeightBars[i] * this.canvasHeight * this.styles[0].heightFactor + this.minHeight;

      this.ctx.moveTo(step, midCanvasY + heightBar / 2);
      this.ctx.lineTo(step, midCanvasY - heightBar + heightBar / 2);
      this.ctx.stroke();
    }
  }

  
  drawPreview() {
    let array = new Float32Array(300);
    let min = 0.1, max = 0.4;
    array = array.map(e => {
      e = Math.random() * (max - min) + min;    
      max = max > 0 ? max - 0.1 : 0.7;
      return e;
    });
    this.draw(array);
  } 
  
}
