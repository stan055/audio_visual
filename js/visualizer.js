const visualizer = document.getElementById('visualizer')
const audio = document.getElementById("audio");

let analyser;
let ctx;
let array;

var blob = window.URL || window.webkitURL;
    if (!blob) {
        console.log('Your browser does not support Blob URLs :(');
                 
    }

    document.getElementById('file').addEventListener('change', function(event){

      console.log('change on input#file triggered');
      var file = this.files[0],
       fileURL = blob.createObjectURL(file);
      console.log(file);
      console.log('File name: '+file.name);
      console.log('File type: '+file.type);
      console.log('File BlobURL: '+ fileURL);
      document.getElementById('audio').src = fileURL;

      preparation();
      audio.play();

});


function preparation(){
    
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const src = audioCtx.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(audioCtx.destination);

    ctx = visualizer.getContext('2d')
    array = new Uint8Array(analyser.frequencyBinCount);
    
    getSize();
    getValue();
    drawWave5();
}


// Size canvas
function getSize() {
    visualizer.width = visualizer.clientWidth * window.devicePixelRatio
    visualizer.height = visualizer.clientHeight * window.devicePixelRatio
}