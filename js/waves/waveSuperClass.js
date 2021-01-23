class WaveSuperClass {
  fftSize = 2048;
  minDecibels = -100;
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
}
