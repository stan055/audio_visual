
var blob = window.URL || window.webkitURL;
if (!blob) {
  console.log('Your browser does not support Blob URLs :(');
}


const canvas = document.getElementById('visualizer')
const wave = new Wave6(canvas);
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
  
    analyser.fftSize = 2048;
    analyser.minDecibels = -60; 
    wave.heightBarFactor = 1.2; // heightBar = heinghtBar * heightBarFactor
    wave.calculatingVariables(93, 0.03, 0.4);
    
    const recursiveDrawAudio = createRecursiveDrawFunction(analyser);
    
    recursiveDrawAudio()
    audio.play();
});

