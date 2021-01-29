class Wave5 extends WaveSuperClass {
  itemCount = 45;
  minHeight = 0.03;
  barWidth = 1;
  widthInPercent = 0.5; // (0-1)
  startX = 0;
  fftSize = 512;
  styles = [[1, 'rgb(143, 255, 199)']];
  

  constructor(canvas) {
    super(canvas)

    this.barWidth = this.canvasWidth / this.itemCount;
    this.startX = this.barWidth * this.widthInPercent / 2;
    this.minHeight = this.canvasHeight * this.minHeight;
    this.ctx.lineWidth = this.barWidth * this.widthInPercent;
  }


  draw(arrayHeightBars) {
    this.clearCanvas();

    this.ctx.strokeStyle = this.styles[0][1];

    for (let i = 0; i < arrayHeightBars.length; i++) {
      this.ctx.beginPath();

      const step = this.barWidth * i + this.startX;
      const heightBar = arrayHeightBars[i] * this.canvasHeight + this.minHeight;

      this.ctx.moveTo(step, this.canvasHeight);
      this.ctx.lineTo(step, this.canvasHeight - heightBar);
      this.ctx.stroke();
    }
  }


  prewievDraw() {
    let array = new Float32Array(100);
    const min1 = 0.1, max1 = 0.4;
    const min2 = 0.5, max2 = 0.8;
  
    for (let i = 0; i < array.length; i+=10) {
      for (let ii = 0; ii < 3; ii++) {
        array[i+ii] = Math.random() * (max1 - min1) + min1
      }
      for (let ii = 3; ii < 10; ii++) {
        array[i+ii] = Math.random() * (max2 - min2) + min2
      }
    }
    this.draw(array);
  } 
}

