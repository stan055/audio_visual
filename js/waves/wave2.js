class Wave2 extends WaveSuperClass {
  minHeight = 0.04;
  waveWidth = 0.085;
  tension = 0.4;
  fftSize = 2048 * 4;
  styles = [[0.3, 'rgb(138, 36, 15)'], [0.4, 'rgb(230, 59, 25)'], [0.5, 'rgb(230, 77, 25)'], [0.5, 'rgb(236, 199, 147)']];

  
  constructor(canvas) {
    super(canvas)
    this.minHeight = this.canvasHeight * this.minHeight;
  }


  fillOfCurvePath(x1, y1, x2, y2) {
    this.ctx.lineTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.fill();
  }


  draw(arrayHeightBars) {
    this.clearCanvas();

    const createSplinePoints = (hFactor1, hFactor2, hFactor3, hFactor4) => {
      // Create points addSplinePoint(x, y)
      const pts1 = [];
      const pts2 = [];
      const pts3 = [];
      const pts4 = [];

      const step = Math.floor(this.canvasWidth * this.waveWidth); // Step should be an integer

      for (let i = 0; i <= this.canvasWidth + step; i += step) {
        const height = arrayHeightBars[i] * this.canvasHeight;

        const y1 = height * hFactor1 + this.minHeight;
        const y2 = height * hFactor2 + this.minHeight;
        const y3 = height * hFactor3 + this.minHeight;
        const y4 = height * hFactor4 + this.minHeight;

        pts1.push(i); pts1.push(this.canvasHeight - y1);
        pts2.push(i); pts2.push(this.canvasHeight - y2);
        pts3.push(i); pts3.push(this.canvasHeight - y3);
        pts4.push(i); pts4.push(this.canvasHeight - y4);
      }
      return [pts1, pts2, pts3, pts4];
    }


    arrayHeightBars = this.filterAudio(arrayHeightBars, this.bassCount, 0.9);

    const pts = createSplinePoints(1, 0.75, 0.45, 0.55);

    for (let i = 0; i < pts.length; i++) {
      this.ctx.globalAlpha = this.styles[i][0];
      this.ctx.strokeStyle = this.styles[i][1];
      this.ctx.fillStyle = this.ctx.strokeStyle;
      smoothPath(this.ctx, pts[i], this.tension);
      this.fillOfCurvePath(this.canvasWidth, this.canvasHeight, 0, this.canvasHeight);
    }
  }
}
