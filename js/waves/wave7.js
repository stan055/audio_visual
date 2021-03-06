class Wave7 extends WaveSuperClass {
  minHeight = 0.04;
  waveWidth = 0.085;
  tension = 0.4;
  fftSize = 2048 * 4;
  audioStep = 15;
  minDecibels = -80;
  styles = [{ alpha: 1, color: 'rgb(255, 87, 244)' }];

  
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
    this.clearCanvas();

    const createSplinePoints = () => {
      // Create points addSplinePoint(x, y)
      const pts1 = [];
      const step = Math.floor(this.canvasWidth * this.waveWidth); // Step should be an integer

      for (let i = 0, j = 0; i <= this.canvasWidth + step; i += step, j += this.audioStep) {
        const height = arrayHeightBars[j] * this.canvasHeight;
        const y1 = height + this.minHeight;

        pts1.push(i); pts1.push(this.canvasHeight - y1);

      }
      return pts1;
    }

    arrayHeightBars = this.filterAudio(arrayHeightBars, this.bassCount, 0.8);

    const pts1 = createSplinePoints();

    this.ctx.strokeStyle = this.styles[0].color;
    this.ctx.fillStyle = this.ctx.strokeStyle;
    
    this.smoothPath(this.ctx, pts1, this.tension);
    this.fillOfCurvePath(this.canvasWidth, this.canvasHeight, 0, this.canvasHeight);
  }


  drawPreview() {
    let array = new Float32Array(1000);
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
