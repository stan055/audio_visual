
// Set variables & constants
function calculatingWave5(analyser, ctx) {
    const paddingBottom = 0;
    const itemCount = 45;
    let width = visualizer.width;
    let height = visualizer.height - paddingBottom;
    const minHeight = 3;
    let part = ((width / itemCount) * 0.2);
    let space = (width / itemCount) / 2 + part;
    let barWidth = (width / itemCount) / 2 - part;
    let startX = (barWidth / 2);
    let canvasHeight = analyser.fftSize / visualizer.height; // bar ratio height
    ctx.lineWidth = barWidth;
    const array = new Uint8Array(analyser.frequencyBinCount);

    createSettingListeters(analyser, part, space, width, barWidth, startX, ctx, itemCount);

    drawWave5(analyser, itemCount, canvasHeight, startX, space, barWidth,
        width, height, minHeight, array, ctx);

}


// Drawing
function drawWave5(analyser, itemCount, canvasHeight, startX, space, barWidth,
                    width, height, minHeight, array, ctx){

    function createArraysData() {
        analyser.getByteFrequencyData(array);
    
        // Clear canvas
        ctx.clearRect(0, 0, width, height)
        const arrayHeightBars = [];
        const arraySteps = [];
        
        // Create arrays height bars & step
        for (let index = 0; index < itemCount; index++) {
            const barHeight = array[index] / canvasHeight + minHeight;
            const step = (barWidth * index) + (index * space) + startX;

            arrayHeightBars.push(barHeight);
            arraySteps.push(step);
        }

        draw(ctx, arrayHeightBars, arraySteps, height);
        window.requestAnimationFrame(createArraysData);

    };

    createArraysData();
}


function draw(ctx, arrayHeightBars, arraySteps, height) {
    for (let i = 0; i < arrayHeightBars.length; i++) {
        ctx.strokeStyle = `hsl(${arrayHeightBars[i] / (height*5) * 600}, 75%, 55%)`;
        ctx.beginPath();
        ctx.moveTo(arraySteps[i], height);
        ctx.lineTo(arraySteps[i], height - arrayHeightBars[i]);
        ctx.stroke();
    }
}
