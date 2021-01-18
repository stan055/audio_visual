class Wave {
  paddingBottom = 0;
  itemCount = 0;
  minHeight = 0;
  barWidth = 1;
  widthInPercent = 1; // (0-1)%
  startX = 0;
  ctxLineWidth = 0;
  fftSize = 256;
  heightBarFactor = 1.0;
  analyser;
  ctx;
  canvas;
  draw;

  get height() {return this.canvas.height;}
  get width() {return this.canvas.width;}

  constructor(canvas, itemCount = 45, minHeight = 0.03, widthInPercent = 0.5, fftSize = 256, paddingBottom = 0) {
    this.canvas = canvas;
    this.fftSize = fftSize;
    this.minHeight = minHeight;
    this.widthInPercent = widthInPercent;
    this.itemCount = itemCount;
    this.paddingBottom = paddingBottom;

    this.calculatingVariables();
  }

  calculatingVariables(itemCount = this.itemCount, widthInPercent = this.widthInPercent, minHeight = this.minHeight) {
    this.getSize();
   
    this.minHeight = minHeight; // New minHeight
    this.itemCount = itemCount; // New itemCount
   
    // calculating
    this.barWidth = this.width / this.itemCount;
    this.startX = this.barWidth * widthInPercent / 2;
    
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineWidth = this.barWidth * widthInPercent;
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

      const step = this.barWidth * i + this.startX;
      const heightBar = arrayHeightBars[i] * this.height;

      this.ctx.moveTo(step, this.height);
      this.ctx.lineTo(step, this.height - heightBar);
      this.ctx.stroke();
    }
  }

  draw6(arrayHeightBars) {
    this.ctx.clearRect(0, 0, this.width, this.height)

    const midCanvasY = this.height / 2;

    for (let i = 0; i < arrayHeightBars.length; i++) {
      this.ctx.strokeStyle = `hsl(284, 60%, 60%)`;
      this.ctx.beginPath();

      const step = this.barWidth * i + this.startX;
      const heightBar = arrayHeightBars[i] * this.height * this.heightBarFactor;      

      this.ctx.moveTo(step, midCanvasY + heightBar / 2);
      this.ctx.lineTo(step, midCanvasY - heightBar + heightBar / 2);
      this.ctx.stroke();
    }
  }

  draw7(arrayHeightBars) {
    this.ctx.clearRect(0, 0, this.width, this.height)

    for (let i = 0; i < arrayHeightBars.length; i++) {
      this.ctx.strokeStyle = `hsl(${arrayHeightBars[i] * this.height / (this.height*5) * 600}, 75%, 55%)`;
      this.ctx.beginPath();

      const step = this.barWidth * i + this.startX;
      const heightBar = arrayHeightBars[i] * this.height * this.heightBarFactor;

      this.ctx.moveTo(step, this.height);
      this.ctx.lineTo(step, this.height - heightBar);
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
      wave.calculatingVariables(45, 0.5);
      return wave.draw5;
    }
    case 'wave6': {
      analyser.fftSize = 2048;
      analyser.minDecibels = -60; 
      wave.heightBarFactor = 1.2; // heightBar = heinghtBar * heightBarFactor
      wave.calculatingVariables(93, 0.4);
      return wave.draw6;
    }
    case 'wave7':{
      analyser.fftSize = 2048;
      // analyser.minDecibels = -40; 
      // analyser.maxDecibels = -60;
      wave.calculatingVariables(wave.width, 1);
      wave.heightBarFactor = 0.5;
      return wave.draw7;
    }
    default:
      return null
  }
}
