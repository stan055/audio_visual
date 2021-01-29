class Wave2 extends WaveSuperClass {
  minHeight = 0.04;
  waveWidth = 0.080;
  tension = 0.4;
  fftSize = 2048 * 4;
  minDecibels = -95;
  styles = [
    { heightFactor: 1, alpha: 0.3, color: 'rgb(138, 36, 15)' }, 
    { heightFactor: 0.75, alpha: 0.4, color: 'rgb(230, 59, 25)' }, 
    { heightFactor: 0.45, alpha: 0.5, color: 'rgb(230, 77, 25)' }, 
    { heightFactor: 0.55, alpha: 0.5, color: 'rgb(236, 199, 147)' }
  ];
  
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
      let j = 25;

      for (let i = 0; i <= this.canvasWidth + step; i += step, j+=25) {
        const height = arrayHeightBars[j] * this.canvasHeight;

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

    const pts = createSplinePoints(this.styles[0].heightFactor, this.styles[1].heightFactor, this.styles[2].heightFactor, this.styles[3].heightFactor);

    for (let i = 0; i < pts.length; i++) {
      this.ctx.globalAlpha = this.styles[i].alpha;
      this.ctx.strokeStyle = this.styles[i].color;
      this.ctx.fillStyle = this.ctx.strokeStyle;
      this.smoothPath(this.ctx, pts[i], this.tension);
      this.fillOfCurvePath(this.canvasWidth, this.canvasHeight, 0, this.canvasHeight);
    }
  }


  drawPrewiev() {
    let array = new Float32Array(1500);
    const min1 = 0.1, max1 = 0.3;
    const min2 = 0.3, max2 = 0.7;
  
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
