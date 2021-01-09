const volume = document.getElementById('volume')
const visualizer = document.getElementById('visualizer')
const audio = document.getElementById('audio');


const context = new AudioContext()
const analyserNode = new AnalyserNode(context, { fftSize: 256 })
const gainNode = new GainNode(context, { gain: volume.value})

setupEventListeners()
setupContext()
resize()
drawVisualizer()

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

});

function setupEventListeners() {
  window.addEventListener('resize', resize)

  volume.addEventListener('input', e => {
    const value = parseFloat(e.target.value)
    gainNode.gain.setTargetAtTime(value, context.currentTime, .01)
  })
}

async function setupContext() {
  const guitar = await getGuitar()
  if (context.state === 'suspended') {
    await context.resume()
  }
  const source = context.createMediaElementSource(audio)
  source
    .connect(gainNode)
    .connect(analyserNode)
    .connect(context.destination)
}

function getGuitar() {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      autoGainControl: false,
      noiseSuppression: false,
      latency: 0
    }
  })
}

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer)

  const bufferLength = analyserNode.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  analyserNode.getByteFrequencyData(dataArray)
  const width = visualizer.width
  const height = visualizer.height
  const barWidth = width / bufferLength

  const canvasContext = visualizer.getContext('2d')
  canvasContext.clearRect(0, 0, width, height)

  dataArray.forEach((item, index) => {
    const y = item / 255 * height / 2
    const x = barWidth * index

    canvasContext.fillStyle = `hsl(${y / height * 400}, 100%, 50%)`
    canvasContext.fillRect(x, height - y, barWidth, y)
  })
}

function resize() {
  visualizer.width = visualizer.clientWidth * window.devicePixelRatio
  visualizer.height = visualizer.clientHeight * window.devicePixelRatio
}