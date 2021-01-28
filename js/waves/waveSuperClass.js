class WaveSuperClass {
  fftSize = 2048;
  minDecibels = -100;
  bassLower = 0.15;
  bassMidle = 0.5;
  bassTreble = 0.9;
  bassCount = 150;
  ctx;
  canvas;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
  }

  get canvasHeight() {
    if (this._cachedCanvasHeight) {
      return this._cachedCanvasHeight
    }

    this._cachedCanvasHeight =  this.canvas.height
    return this._cachedCanvasHeight
  }

  get canvasWidth() {
    if (this._cachedCanvasWidth) {
      return this._cachedCanvasWidth
    }

    this._cachedCanvasWidth =  this.canvas.width
    return this._cachedCanvasWidth
  }


  clearCanvas(chromakeyColor) {
    if (chromakeyColor) {
      this.ctx.beginPath();
      this.ctx.fillStyle = chromakeyColor;
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    } else {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    }
  }


  lowerBass(arrayHeightBars, count, factor) {
    for (let i = 0; i < count; i++) {
      arrayHeightBars[i] = arrayHeightBars[i] * factor;
    }
    return arrayHeightBars;
  }
}
