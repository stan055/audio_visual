class Wave1 extends WaveSuperClass {
  minHeight = 0.01;
  waveWidth = 0.017;
  tension = 0.2;
  fftSize = 2048 * 4;
  minDecibels = -70;
  styles = [[0.5, 'rgb(0, 213, 255)'], [0.5, 'rgb(0, 213, 255)'], [1, 'rgb(0, 213, 255)'], [1, 'rgb(0, 213, 255)']];
  chromakeyColor = 'rgb(1, 1, 1)';


  constructor(canvas) {
    super(canvas);
    this.minHeight = this.canvasHeight * this.minHeight;
    this.midHeight = this.canvasHeight / 2;
  }


  fillOfCurvePath(x1, y1, x2, y2) {
    this.ctx.lineTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.fill();
  }


  draw(arrayHeightBars) {
    this.clearCanvas(this.chromakeyColor);

    const createSplinePoints = (hFactor1, hFactor2) => {
      // Create points addSplinePoint(x, y)
      const pts1 = [];
      const pts1Mirror = [];
      const pts2 = [];
      const pts2Mirror = [];
      const step = Math.floor(this.canvasWidth * this.waveWidth); // Step should be an integer

      for (let i = 0; i <= this.canvasWidth + step; i += step) {
        const height = arrayHeightBars[i] * this.canvasHeight;
        const y1 = height * hFactor1 + this.minHeight;
        const y2 = height * hFactor2 + this.minHeight;

        pts1.push(i); pts1.push(this.midHeight - y1);
        pts1Mirror.push(i); pts1Mirror.push(this.midHeight + y1);

        pts2.push(i); pts2.push(this.midHeight - y2);
        pts2Mirror.push(i); pts2Mirror.push(this.midHeight + y2);
      }
      return [pts1, pts1Mirror, pts2, pts2Mirror];
    }


    const pts = createSplinePoints(0.5, 0.2);
    for (let i = 0; i < pts.length; i++) {
      this.ctx.globalAlpha = this.styles[i][0];
      this.ctx.strokeStyle = this.styles[i][1];
      this.ctx.fillStyle = this.ctx.strokeStyle;
      smoothPath(this.ctx, pts[i], this.tension);
      this.fillOfCurvePath(this.canvasWidth, this.midHeight, 0, this.midHeight);
    }

  }
}