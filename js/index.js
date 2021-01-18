class Wave {
  paddingBottom = 0;
  itemCount = 0;
  minHeight = 0;
  spacePart = 0;
  partWidth = 0;
  startX = 0;
  ctxLineWidth = 0;
  fftSize = 256;
  analyser;
  ctx;
  canvas;
  draw;

  get height() {return this.canvas.height;}
  get width() {return this.canvas.width;}

  constructor(canvas, itemCount = 45, minHeight = 0.04, spacePart = 0.2, fftSize = 256, paddingBottom = 0) {
    this.canvas = canvas;
    this.fftSize = fftSize;
    this.minHeight = minHeight;
    this.spacePart = spacePart;
    this.itemCount = itemCount;
    this.paddingBottom = paddingBottom;

    this.calculatingVariables();
  }

  calculatingVariables(itemCount = this.itemCount, spacePart = this.spacePart, minHeight = this.minHeight) {
    this.getSize();
   
    this.minHeight = minHeight; // New minHeight
    this.itemCount = itemCount; // New itemCount
   
    // calculating
    this.partWidth = this.width / this.itemCount;
    const part = this.partWidth * spacePart;
    const barWidth = this.partWidth / 2 - part;
    this.startX = barWidth / 2;
    
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineWidth = barWidth;
  }

  getSize() {
    this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;
  }


  draw5(arrayHeightBars) {
    this.ctx.clearRect(0, 0, this.width, this.height)

    for (let i = 0; i < arrayHeightBars.length; i++) {
      this.ctx.strokeStyle = `hsl(${arrayHeightBars[i] * this.height / (this.height*5) * 600}, 75%, 55%)`;
      this.ctx.beginPath();

      const step = this.partWidth * i + this.startX;
      const heightBar = arrayHeightBars[i] * this.height;

      this.ctx.moveTo(step, this.height);
      this.ctx.lineTo(step, this.height - heightBar);
      this.ctx.stroke();
    }
  }

  draw6(arrayHeightBars) {
    this.ctx.clearRect(0, 0, this.width, this.height)

    for (let i = 0; i < arrayHeightBars.length; i++) {
      this.ctx.strokeStyle = `hsl(${arrayHeightBars[i] * this.height / (this.height*5) * 600}, 75%, 55%)`;
      this.ctx.beginPath();

      const step = this.partWidth * i + this.startX;
      const midCanvasY = this.height / 2;
      const heightBar = arrayHeightBars[i] * this.height;

      this.ctx.moveTo(step, midCanvasY + heightBar / 2);
      this.ctx.lineTo(step, midCanvasY - heightBar + heightBar / 2);
      this.ctx.stroke();
    }
  }


}



var blob = window.URL || window.webkitURL;
if (!blob) {
  console.log('Your browser does not support Blob URLs :(');
}

// Global var
const canvas = document.getElementById('visualizer')
const wave = new Wave(canvas);
let array;


document.getElementById('file').addEventListener('change', function(event){
  const file = this.files[0],
  fileURL = blob.createObjectURL(file);

  const audio = document.getElementById("audio");
  audio.src = fileURL

  const audioCtx = new(window.AudioContext || window.webkitAudioContext)();


  const analyser = audioCtx.createAnalyser();
  
  const sourceNode = audioCtx.createMediaElementSource(audio);

  sourceNode.connect(analyser);
  
  analyser.connect(audioCtx.destination);

  array = new Uint8Array(analyser.frequencyBinCount);
  
  // Choose draw f-n
  wave.draw = chooseDrawFunction(canvas.getAttribute('name'), analyser);


  const recursiveDrawAudio = createRecursiveDrawFunction(analyser);
  
  recursiveDrawAudio()
  audio.play();
});


function createRecursiveDrawFunction(analyser) {
  function recursiveDrawAudio() {
    // Fill "array" with raw audio data
    analyser.getByteFrequencyData(array);

    const [arrayHeightBars] = normalizeAudioData(array)

    wave.draw(arrayHeightBars)

    window.requestAnimationFrame(recursiveDrawAudio);
  }

  return recursiveDrawAudio
}


function normalizeAudioData (array) {
  const arrayHeightBars = [];

  // Create array height bars 
  for (let index = 0; index < wave.itemCount; index++) {
    const barHeight = array[index] / wave.fftSize + wave.minHeight;

    arrayHeightBars.push(barHeight);
  }
  return [arrayHeightBars]
}

// Choose draw f-n and set settings
function chooseDrawFunction(name, analyser) {
  switch (name) {
    case 'wave5':{
      analyser.fftSize = 256;
      wave.calculatingVariables(45, 0.2);
      return wave.draw5;
    }
    case 'wave6': {
      analyser.fftSize = 2048;
      analyser.minDecibels = -65; 
      wave.calculatingVariables(93, 0);
      return wave.draw6;
    }
    default:
      return null
  }
}
