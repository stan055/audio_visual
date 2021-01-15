let paddingBottom, itemCount, width, height, space, 
barWidth, startX, heightWave, part;

// Set variables & constants
function getValue() {
    paddingBottom = 0;
    itemCount = 45;
    width = visualizer.width;
    height = visualizer.height - paddingBottom;
    part = ((width / itemCount) * 0.2);
    space = (width / itemCount) / 2 + part;
    barWidth = (width / itemCount) / 2 - part;
    startX = (barWidth / 2);
    heightWave = analyser.fftSize / visualizer.height; // normalize data
    ctx.lineWidth = barWidth;
}


// Drawing
function drawWave5(){

    analyser.getByteFrequencyData(array);

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    for (let index = 0; index < itemCount; index++) {
        const y = array[index] / heightWave;
        const x = (barWidth * index) + startX + index * space;
  
        ctx.strokeStyle = `hsl(${y / (height*5) * 700}, 75%, 55%)`;
        
        ctx.beginPath();
        ctx.moveTo(x, height - y);
        ctx.lineTo(x , height + 2);
        ctx.stroke();        
    }

    window.requestAnimationFrame(drawWave5);
}