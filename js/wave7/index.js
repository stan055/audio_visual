
var blob = window.URL || window.webkitURL;
if (!blob) {
  console.log('Your browser does not support Blob URLs :(');
}


const canvas = document.getElementById('visualizer')
const wave = new Wave7(canvas);
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
  
    analyser.fftSize = 2048*4;
    analyser.minDecibels = -80; 
    wave.waveWidth = 0.085;
    wave.bassFactor = 0.7;
    wave.calculatingVariables(wave.width*2, 0.04, 1);
    
    const recursiveDrawAudio = createRecursiveDrawFunction(analyser);
    
    recursiveDrawAudio()
    audio.play();
});


