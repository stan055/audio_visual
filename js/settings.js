const widthItem = document.getElementById('widthItem');
const valueWidthItem = document.getElementById('valueWidthItem');


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

