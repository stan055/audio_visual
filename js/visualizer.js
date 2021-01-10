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
    
    var AudioContext = window.AudioContext || window.webkitAudioContext || null;

    if (!AudioContext) 
        console.log('AudioContext = null');

    const context = new AudioContext();
    
    analyser = context.createAnalyser();
    analyser.fftSize = 128;
    const src = context.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(context.destination);

    bufferLength = analyser.frequencyBinCount;
    ctx = visualizer.getContext('2d')
    array = new Uint8Array(analyser.frequencyBinCount);

    loop();
}

function loop(){
    window.requestAnimationFrame(loop);

    analyser.getByteFrequencyData(array);

    const width = visualizer.width
    const height = visualizer.height
    const barWidth = width / bufferLength;


    ctx.lineCap = 'round';
    ctx.lineWidth = barWidth;
    ctx.clearRect(0, 0, width, height)

    array.forEach((item, index) => {
      const y = item / 255 * 150;
      const x = (barWidth * index) + barWidth / 2

      ctx.strokeStyle = `hsl(${y / height * 600}, 100%, 60%)`;
      
      ctx.beginPath();
      ctx.moveTo(x, height - y);
      ctx.lineTo(x , height);
      ctx.stroke();

    })

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