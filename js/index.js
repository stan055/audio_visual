class Wave {
  paddingBottom = 0;
  itemCount = 0;
  minHeight = 0;
  barWidth = 1;
  widthInPercent = 0.5; // (0-1)
  bassFactor = 1;
  bassCount = 150;
  waveWidth = 0.09;
  startX = 0;
  ctxLineWidth = 0;
  fftSize = 256;
  heightBarFactor = 1.0;
  tension = 0.4;
  analyser;
  ctx;
  canvas;
  draw;

  get height() {return this.canvas.height;}
  get width() {return this.canvas.width;}

  constructor(canvas, itemCount = 45, minHeight = 0.03, widthInPercent = 0.5, fftSize = 256, paddingBottom = 0) {
    this.canvas = canvas;
    this.fftSize = fftSize;
    this.minHeight = this.height * minHeight;
    this.widthInPercent = widthInPercent;
    this.itemCount = itemCount;
    this.paddingBottom = paddingBottom;

    this.calculatingVariables();
  }

  calculatingVariables(itemCount = this.itemCount, minHeight = 0, widthInPercent = this.widthInPercent ) {
    this.getSize();
   
    this.minHeight = this.height * minHeight; // New minHeight
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

  // Lower Bass
  lowerBass(arrayHeightBars, count, factor) {
    for (let i = 0; i < count; i++) {
      arrayHeightBars[i] = arrayHeightBars[i] * factor;
    }
    return arrayHeightBars;
  }


  va(arr, i, j) {
    return [arr[2*j]-arr[2*i], arr[2*j+1]-arr[2*i+1]]
  }


  dista(arr, i, j) {
    return Math.sqrt(Math.pow(arr[2*i]-arr[2*j], 2) + Math.pow(arr[2*i+1]-arr[2*j+1], 2));
  }


  ctlpts(x1,y1,x2,y2,x3,y3) {
    var t = this.tension;
    var v = this.va([x1,y1,x2,y2,x3,y3], 0, 2);
    var d01 = this.dista([x1,y1,x2,y2,x3,y3], 0, 1);
    var d12 = this.dista([x1,y1,x2,y2,x3,y3], 1, 2);
    var d012 = d01 + d12;
    return [x2 - v[0] * t * d01 / d012, y2 - v[1] * t * d01 / d012,
            x2 + v[0] * t * d12 / d012, y2 + v[1] * t * d12 / d012 ];
  }


  drawCurvedPath(cps, pts) {
    var len = pts.length / 2; // number of points    

    this.ctx.beginPath();
    this.ctx.moveTo(pts[0], pts[1]);
    // from point 0 to point 1 is a quadratic
    this.ctx.quadraticCurveTo(cps[0], cps[1], pts[2], pts[3]);
    // for all middle points, connect with bezier
    for (var i = 2; i < len-1; i += 1) {
      this.ctx.bezierCurveTo(cps[(2*(i-1)-1)*2], cps[(2*(i-1)-1)*2+1],
                        cps[(2*(i-1))*2], cps[(2*(i-1))*2+1],
                        pts[i*2], pts[i*2+1]);
    }
    this.ctx.quadraticCurveTo(cps[(2*(i-1)-1)*2], cps[(2*(i-1)-1)*2+1],
                         pts[i*2], pts[i*2+1]);

    // Closure
    this.ctx.lineTo(this.width, this.height);
    this.ctx.lineTo(0, this.height);

    this.ctx.stroke();
    this.ctx.fill();
  }


  drawSplines(pts) {
    let cps = []; // There will be two control points for each "middle" point, 1 ... len-2e
    for (var i = 0; i < pts.length - 2; i += 1) {
      cps = cps.concat(this.ctlpts(pts[2*i], pts[2*i+1], pts[2*i+2], pts[2*i+3], pts[2*i+4], pts[2*i+5]));
    }
      this.ctx.fillStyle = this.ctx.strokeStyle;
      this.drawCurvedPath(cps, pts);
  }


  // Draw wave #2
  draw2(arrayHeightBars) {
    this.ctx.clearRect(0, 0, this.width, this.height)

    const createSplinePoints = (hFactor1, hFactor2, hFactor3, hFactor4) => {
      // Create points addSplinePoint(x, y)
      const pts1 = [];
      const pts2 = [];
      const pts3 = [];
      const pts4 = [];
      
      const step = Math.floor(this.width * this.waveWidth); // Step should be an integer
      
      for (let i = 0; i <= this.width+step; i += step) {
        const height = arrayHeightBars[i] * this.height;

        const y1 = height * hFactor1 + this.minHeight;
        const y2 = height * hFactor2 + this.minHeight;
        const y3 = height * hFactor3 + this.minHeight;
        const y4 = height * hFactor4 + this.minHeight;
        
        pts1.push(i); pts1.push(this.height - y1);
        pts2.push(i); pts2.push(this.height - y2);
        pts3.push(i); pts3.push(this.height - y3);
        pts4.push(i); pts4.push(this.height - y4);
      }
      return [pts1, pts2, pts3, pts4];
    }


    arrayHeightBars = this.lowerBass(arrayHeightBars, this.bassCount, this.bassFactor);

    const [pts1, pts2, pts3, pts4] = createSplinePoints(1, .8, 1.2, 1.57); 

    this.ctx.globalAlpha = 0.3;
    this.ctx.strokeStyle = 'hsl(10, 80%, 30%)'
    this.drawSplines(pts4);

    this.ctx.globalAlpha = 0.4;
    this.ctx.strokeStyle = 'hsl(10, 80%, 50%)'
    this.drawSplines(pts3);    

    this.ctx.globalAlpha = 0.5;
    this.ctx.strokeStyle = 'hsl(15, 80%, 50%)'
    this.drawSplines(pts2);    

    this.ctx.globalAlpha = 0.5;
    this.ctx.strokeStyle = 'hsl(35, 70%, 75%)'
    this.drawSplines(pts1);    
    
  }  


  // Draw Wave#5
  draw5(arrayHeightBars) {
    this.ctx.clearRect(0, 0, this.width, this.height)

    for (let i = 0; i < arrayHeightBars.length; i++) {
      this.ctx.strokeStyle = `hsl(${arrayHeightBars[i] * this.height / (this.height*5) * 600}, 75%, 55%)`;
      this.ctx.beginPath();

      const step = this.barWidth * i + this.startX;
      const heightBar = arrayHeightBars[i] * this.height + this.minHeight;

      this.ctx.moveTo(step, this.height);
      this.ctx.lineTo(step, this.height - heightBar);
      this.ctx.stroke();
    }
  }

  // Draw wave#6
  draw6(arrayHeightBars) {
    this.ctx.clearRect(0, 0, this.width, this.height)

    const midCanvasY = this.height / 2;

    for (let i = 0; i < arrayHeightBars.length; i++) {
      this.ctx.strokeStyle = 'hsl(284, 60%, 60%)';
      this.ctx.beginPath();

      const step = this.barWidth * i + this.startX;
      const heightBar = arrayHeightBars[i] * this.height * this.heightBarFactor + this.minHeight;      

      this.ctx.moveTo(step, midCanvasY + heightBar / 2);
      this.ctx.lineTo(step, midCanvasY - heightBar + heightBar / 2);
      this.ctx.stroke();
    }
  }

  // Draw wave#7
  draw7(arrayHeightBars) {
    this.ctx.clearRect(0, 0, this.width, this.height)

    const createSplinePoints = (hFactor1) => {
      // Create points addSplinePoint(x, y)
      const pts1 = [];
      const step = Math.floor(this.width * this.waveWidth); // Step should be an integer
      
      for (let i = 0; i <= this.width+step; i += step) {
        const height = arrayHeightBars[i] * this.height;
        const y1 = height * hFactor1 + this.minHeight;

        pts1.push(i); pts1.push(this.height - y1);

      }
      return pts1;
    }

    arrayHeightBars = this.lowerBass(arrayHeightBars, this.bassCount, this.bassFactor);

    const pts1 = createSplinePoints(1); 

    this.ctx.strokeStyle = 'hsl(304, 100%, 67%)'
    this.drawSplines(pts1);    
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
    const barHeight = array[index] / wave.fftSize;

    arrayHeightBars.push(barHeight);
  }
  return [arrayHeightBars]
}

// Choose draw f-n and set settings
function chooseDrawFunction(name, analyser) {
  switch (name) {
    case 'wave5': {
      analyser.fftSize = 256;
      wave.calculatingVariables(45, 0.03, 0.5);
      return wave.draw5;
    }
    case 'wave6': {
      analyser.fftSize = 2048;
      analyser.minDecibels = -60; 
      wave.heightBarFactor = 1.2; // heightBar = heinghtBar * heightBarFactor
      wave.calculatingVariables(93, 0.03, 0.4);
      return wave.draw6;
    }
    case 'wave2': {
      analyser.fftSize = 2048*4;
      analyser.minDecibels = -95; 
      analyser.maxDecibels = 0;
      wave.waveWidth = 0.085;
      wave.bassFactor = 0.7;
      wave.calculatingVariables(wave.width*2, 0.04, 1);
      return wave.draw2;
    }
    case 'wave7': {
      analyser.fftSize = 2048*4;
      analyser.minDecibels = -80; 
      wave.waveWidth = 0.085;
      wave.bassFactor = 0.7;
      wave.calculatingVariables(wave.width*2, 0.04, 1);
      return wave.draw7;
    }
    default:
      return null;
  }
}

