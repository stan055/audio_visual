const widthItem = document.getElementById('widthItem');
const valueWidthItem = document.getElementById('valueWidthItem');

const heightItem = document.getElementById('heightItem');
const valueHeightItem = document.getElementById('valueHeightItem');

widthItem.addEventListener("input", e => {
    if (analyser) {
        part = (width / itemCount) * e.target.value;

        console.log((width / itemCount), part, e.target.value);
        space = (width / itemCount) / 2 + part;
        barWidth = (width / itemCount) / 2 - part;
        startX = (barWidth / 2);
        ctx.lineWidth = barWidth;
    }

    valueWidthItem.innerHTML = ' ' + e.target.value;
});

heightItem.addEventListener("input", e => {
    visualizer.height = e.target.value;

    visualizer.style.height = `${e.target.value}px`;


    getValue()


    valueHeightItem.innerHTML = ' ' + e.target.value;
});

