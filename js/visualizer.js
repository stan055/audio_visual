
var blob = window.URL || window.webkitURL;
if (!blob) {
    console.log('Your browser does not support Blob URLs :(');
             
}

// Global var 
var wave5;

document.getElementById('file').addEventListener('change', function(event){

    console.log('change on input#file triggered');
    var file = this.files[0],
     fileURL = blob.createObjectURL(file);
    console.log(file);
    console.log('File name: '+file.name);
    console.log('File type: '+file.type);
    console.log('File BlobURL: '+ fileURL);
    document.getElementById('audio').src = fileURL;

    const canvas = document.getElementById('visualizer')
    const audio = document.getElementById("audio");
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    
    wave5 = new Wave5(audioCtx, audio, canvas, 45);
    drawWave5();

    audio.play();

});

