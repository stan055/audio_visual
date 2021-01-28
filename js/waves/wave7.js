class Wave7 extends WaveSuperClass {
  minHeight = 0.04;
  waveWidth = 0.085;
  tension = 0.4;
  fftSize = 2048 * 4;
  minDecibels = -80;
  styles = [[1, 'rgb(255, 87, 244)']];
  chromakeyColor;

  constructor(canvas) {
    super(canvas);
    this.minHeight = this.canvasHeight * this.minHeight;
  }


  fillOfCurvePath(x1, y1, x2, y2) {
    this.ctx.lineTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.fill();
  }

  
  draw(arrayHeightBars) {
    this.clearCanvas(this.chromakeyColor);

    const createSplinePoints = (hFactor1) => {
      // Create points addSplinePoint(x, y)
      const pts1 = [];
      const step = Math.floor(this.canvasWidth * this.waveWidth); // Step should be an integer

      for (let i = 0; i <= this.canvasWidth + step; i += step) {
        const height = arrayHeightBars[i] * this.canvasHeight;
        const y1 = height * hFactor1 + this.minHeight;

        pts1.push(i); pts1.push(this.canvasHeight - y1);

      }
      return pts1;
    }

    arrayHeightBars = this.lowerBass(arrayHeightBars, this.bassCount, this.bassTreble);

    const pts1 = createSplinePoints(1);

    this.ctx.strokeStyle = this.styles[0][1];
    this.ctx.fillStyle = this.ctx.strokeStyle;
    
    smoothPath(this.ctx, pts1, this.tension);
    this.fillOfCurvePath(this.canvasWidth, this.canvasHeight, 0, this.canvasHeight);
  }
}
