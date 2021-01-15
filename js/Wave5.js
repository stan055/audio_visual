class Wave5 {
    paddingBottom = 0;
    itemCount = 0;
    width = 0;
    height = 0;
    minHeight = 0;
    part = 0;
    countPart;
    space = 0;
    barWidth = 0;
    startX = 0;
    canvasHeight = 0;
    ctxLineWidth = 0;
    array;
    analyser;
    ctx;
    canvas;

    constructor(audioCtx, audio, canvas, itemCount = 45, minHeight = 3, countPart = 0.2) {

        this.canvas = canvas;
        this.analyser = audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        
        this.src = audioCtx.createMediaElementSource(audio);
        this.src.connect(this.analyser);

        this.analyser.connect(audioCtx.destination);
        this.ctx = this.canvas.getContext('2d');

        this.getSize();

        this.minHeight = minHeight;
        this.countPart = countPart;
        this.width = this.canvas.width;
        this.itemCount = itemCount;
        this.height = canvas.height + this.paddingBottom;

        this.part = ((this.width / this.itemCount) * this.countPart);
        this.space = (this.width / this.itemCount) / 2 + this.part;
        this.barWidth = (this.width / this.itemCount) / 2 - this.part;
        this.startX = (this.barWidth / 2);
        this.canvasHeight = this.analyser.fftSize / this.canvas.height; // bar ratio height
        this.ctx.lineWidth = this.barWidth;
        this.array = new Uint8Array(this.analyser.frequencyBinCount);

    }

    getSize() {
        this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
        this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;
    }

}