
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

var wave5;

function preparation(){
    const canvas = document.getElementById('visualizer')
    const audio = document.getElementById("audio");
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    
    wave5 = new Wave5(audioCtx, audio, canvas, 45);
    
    drawWave5();
}


// Size canvas
function getSize(visualizer) {
    visualizer.width = visualizer.clientWidth * window.devicePixelRatio
    visualizer.height = visualizer.clientHeight * window.devicePixelRatio
}