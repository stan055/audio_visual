
// Drawing
function drawWave5(){

    function createArraysData() {
        wave5.analyser.getByteFrequencyData(wave5.array);
    
        // Clear canvas
        wave5.ctx.clearRect(0, 0, wave5.width, wave5.height)
        const arrayHeightBars = [];
        const arraySteps = [];
        
        // Create arrays height bars & step
        for (let index = 0; index < wave5.itemCount; index++) {
            const barHeight = wave5.array[index] / wave5.canvasHeight + wave5.minHeight;
            const step = (wave5.barWidth * index) + (index * wave5.space) + wave5.startX;
            arrayHeightBars.push(barHeight);
            arraySteps.push(step);
        }

        draw(arrayHeightBars, arraySteps, wave5.height);

        window.requestAnimationFrame(createArraysData);

    };
    createArraysData();
}


function draw(arrayHeightBars, arraySteps, height) {
    for (let i = 0; i < arrayHeightBars.length; i++) {
        wave5.ctx.strokeStyle = `hsl(${arrayHeightBars[i] / (height*5) * 600}, 75%, 55%)`;
        wave5.ctx.beginPath();
        wave5.ctx.moveTo(arraySteps[i], height);
        wave5.ctx.lineTo(arraySteps[i], height - arrayHeightBars[i]);
        wave5.ctx.stroke();
    }
}
