const visualizer = document.getElementById('visualizer')
const audio = document.getElementById("audio");

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

let analyser;
let bufferLength;
let ctx;
let array;

function preparation(){
    
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    const src = audioCtx.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(audioCtx.destination);

    bufferLength = analyser.frequencyBinCount;

    ctx = visualizer.getContext('2d')
    array = new Uint8Array(analyser.frequencyBinCount);
    loop();

    //Set caption text
    $('#captionWave5').text('Wave#5');
}

function loop(){
    window.requestAnimationFrame(loop);

    analyser.getByteFrequencyData(array);

    const paddingBottom = 10;
    const itemCount = 45;
    const width = visualizer.width;
    const height = visualizer.height - paddingBottom;
    const space = 4;
    const barWidth = (width / itemCount) - space;
    const startX = (barWidth / 2);
    const heightWave = 6;

    // Text
    ctx.font = "7px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    // Line
    ctx.lineWidth = barWidth;
    ctx.clearRect(0, paddingBottom, width, height)

    for (let index = 0; index < 45; index++) {
        const y = array[index] / heightWave;
        const x = (barWidth * index) + startX + index * space;
  
        ctx.strokeStyle = `hsl(${y / height * 400}, 100%, 65%)`;
        
        ctx.beginPath();
        ctx.moveTo(x, height - y);
        ctx.lineTo(x , height + 2);
        ctx.stroke();        
        ctx.fillText(index+1, x, height + 10);
    }
}

setupEventListeners();

function setupEventListeners() {
    resize();
    window.addEventListener('resize', resize)
}

function resize() {
    visualizer.width = visualizer.clientWidth * window.devicePixelRatio
    visualizer.height = visualizer.clientHeight * window.devicePixelRatio
}