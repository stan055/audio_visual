class Wave3 extends WaveSuperClass {
  waveWidth = 0.06; // 0.02-0.1
  waveHeight = 1;
  waveHeightFactor = 0.05;
  tension = 0.4;
  fftSize = 2048 * 4;
  minDecibels = -85;
  styles = [[1, 'rgb(255, 250, 250)']];
  lineWidth = 1;
  factorRadiusOfCircles = [4.5, 2.8, 1]; // Difference factor radius of circles

  
  constructor(canvas) {
    super(canvas);
  }


  draw(arrayHeightBars) {
    this.clearCanvas();
    this.waveHeight = this.canvasHeight * this.waveHeightFactor;

    const createSplinePoints = (hFactor, radius) => {
      // Create points addSplinePoint(x, y)
      const pts1 = [];

      const centerX = this.canvasWidth / 2;
      const centerY = this.canvasHeight / 2;
      const steps = Math.floor(2 * Math.PI * radius);

      let waveHeight;

      for (var i = 0; i <= steps; i += steps * this.waveWidth) {
        if (arrayHeightBars.length > i)
          waveHeight = arrayHeightBars[i >> 0] > 0 ? arrayHeightBars[i >> 0] * hFactor : 0;
        else
          waveHeight = 0;

        const r = radius + waveHeight;
        const cosSin = 2 * Math.PI * i / steps;
        const xValue = centerX + r * Math.cos(cosSin);
        const yValue = centerY + r * Math.sin(cosSin);
        pts1.push(xValue); pts1.push(yValue);
      }
      // Closure
      waveHeight = arrayHeightBars[0] > 0 ? arrayHeightBars[0] * hFactor : 0;
      const xValue = centerX + (radius + waveHeight) * Math.cos(2 * Math.PI * steps / steps);
      const yValue = centerY + (radius + waveHeight) * Math.sin(2 * Math.PI * steps / steps);
      pts1.push(xValue); pts1.push(yValue);


      return pts1;
    }

    const steps = Math.floor(2 * Math.PI * this.canvasHeight / 2);
    const pts = [];

    for (let i = 0; i < this.factorRadiusOfCircles.length; i++) {
      pts[i] = createSplinePoints(
        this.waveHeight,
        this.canvasHeight / 2 - this.waveHeight / 2 * this.factorRadiusOfCircles[i]);

      if (arrayHeightBars.length - steps > steps) arrayHeightBars = arrayHeightBars.slice(steps);
    }

    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.styles[0][1];

    pts.forEach(p => {
      this.smoothPath(this.ctx, p, this.tension);
      this.ctx.stroke();
    });
  }


  prewievDraw() {
    let array = new Float32Array(2000);
    const min = 0, max = 0.2;
    array = array.map(e => e = Math.random() * (max - min) + min);
    this.draw(array);
  } 
}
