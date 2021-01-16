class Wave5 {
  paddingBottom = 0;
  itemCount = 0;
  width = 0;
  height = 0;
  minHeight = 0;
  part = 0;
  countPart = 0;
  space = 0;
  barWidth = 0;
  startX = 0;
  canvasHeight = 0;
  ctxLineWidth = 0;
  fftSize = 0;
  analyser;
  ctx;
  canvas;

  constructor(canvas,
              itemCount = 45, minHeight = 0, countPart = 0.2, fftSize = 256) {

    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.fftSize = fftSize;

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
    this.canvasHeight = this.fftSize / this.canvas.height; // bar ratio height
    this.ctx.lineWidth = this.barWidth;
  }

  getSize() {
    this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;
  }


  draw(arrayHeightBars) {
    this.ctx.clearRect(0, 0, this.width, this.height)

    console.log(arrayHeightBars[0]);

    for (let i = 0; i < arrayHeightBars.length; i++) {
      wave5.ctx.strokeStyle = `hsl(${arrayHeightBars[i] * wave5.height / (this.height*5) * 600}, 75%, 55%)`;
      wave5.ctx.beginPath();

      const step = (this.barWidth * i) + (i * this.space) + this.startX;

      wave5.ctx.moveTo(step, this.height);
      wave5.ctx.lineTo(step, this.height - arrayHeightBars[i] * wave5.height);
      wave5.ctx.stroke();
    }
  }
}



var blob = window.URL || window.webkitURL;
if (!blob) {
  console.log('Your browser does not support Blob URLs :(');
}

// Global var
const canvas = document.getElementById('visualizer')
const wave5 = new Wave5(canvas, 45);
let array;


document.getElementById('file').addEventListener('change', function(event){
  const file = this.files[0],
  fileURL = blob.createObjectURL(file);

  const audio = document.getElementById("audio");
  audio.src = fileURL

  const audioCtx = new(window.AudioContext || window.webkitAudioContext)();


  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;


  const src = audioCtx.createMediaElementSource(audio);
  src.connect(analyser);
  analyser.connect(audioCtx.destination);

  array = new Uint8Array(analyser.frequencyBinCount);

  const recursiveDrawAudio = createRecursiveDrawFunction(analyser);

  recursiveDrawAudio()
  audio.play();
});


function createRecursiveDrawFunction(analyser) {
  function recursiveDrawAudio() {
    // Fill "array" with raw audio data
    analyser.getByteFrequencyData(array);

    const [arrayHeightBars] = normalizeAudioData(array)

    wave5.draw(arrayHeightBars)

    window.requestAnimationFrame(recursiveDrawAudio);
  }

  return recursiveDrawAudio
}


function normalizeAudioData (array) {
  const arrayHeightBars = [];

  // Create arrays height bars & step
  for (let index = 0; index < wave5.itemCount; index++) {
    const barHeight = array[index] / wave5.canvasHeight / wave5.height + wave5.minHeight;

    arrayHeightBars.push(barHeight);
  }

  return [arrayHeightBars]
}
