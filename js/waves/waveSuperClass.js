class WaveSuperClass {
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

    if (window) {
      this._cachedCanvasHeight =  this.canvas.clientHeight * window.devicePixelRatio
      return this._cachedCanvasHeight
    } else {
      this._cachedCanvasHeight =  this.canvas.height
      return this._cachedCanvasHeight
    }
  }

  get canvasWidth() {
    if (this._cachedCanvasWidth) {
      return this._cachedCanvasWidth
    }

    if (window) {
      this._cachedCanvasWidth =  this.canvas.clientWidth * window.devicePixelRatio
      return this._cachedCanvasWidth
    } else {
      this._cachedCanvasWidth =  this.canvas.width
      return this._cachedCanvasWidth
    }
  }
}
