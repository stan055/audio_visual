var blob = window.URL || window.webkitURL;
if (!blob) {
  console.log('Your browser does not support Blob URLs :(');
}

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

  const canvas = document.getElementById('visualizer')

  const wave = initWave(analyser, canvas);
  analyser.fftSize = wave.fftSize
  if (wave.minDecibels) {
    analyser.minDecibels = wave.minDecibels
  }

  const recursiveDrawAudio = createRecursiveDrawFunction(analyser, wave);

  recursiveDrawAudio()
  audio.play();
});


document.getElementById('inputWidth').addEventListener('change', function(event){
  const canvas = document.getElementById('visualizer')
  canvas.width = event.target.value;
});

document.getElementById('inputHeight').addEventListener('change', function(event){
  const canvas = document.getElementById('visualizer')
  canvas.height = event.target.value;
});