class Wave5 extends WaveSuperClass {
  itemCount = 45;
  minHeight = 0.03;
  barWidth = 1;
  widthInPercent = 0.5; // (0-1)
  startX = 0;
  fftSize = 512;
  styles = [[1, 'rgb(143, 255, 199)']];
  chromakeyColor;
  

  constructor(canvas) {
    super(canvas)

    this.barWidth = this.canvasWidth / this.itemCount;
    this.startX = this.barWidth * this.widthInPercent / 2;
    this.minHeight = this.canvasHeight * this.minHeight;
    this.ctx.lineWidth = this.barWidth * this.widthInPercent;
  }


  draw(arrayHeightBars) {
    this.clearCanvas(this.chromakeyColor);

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
}
