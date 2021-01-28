class Wave6 extends WaveSuperClass {
  itemCount = 93;
  minHeight = 0.03;
  barWidth = 1;
  widthInPercent = 0.4; // (0-1)
  startX = 0;
  heightBarFactor = 1.1;
  fftSize = 2048;
  minDecibels = -60;
  styles = [[1, 'rgb(161, 144, 249)']];
  chromakeyColor;
  

  constructor(canvas) {
    super(canvas)

    this.startX = this.barWidth * this.widthInPercent / 2;
    this.minHeight = this.canvasHeight * this.minHeight;
    this.barWidth = this.canvasWidth / this.itemCount;
    this.ctx.lineWidth = this.barWidth * this.widthInPercent;
  }


  draw(arrayHeightBars) {
    this.clearCanvas(this.chromakeyColor);

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
}
