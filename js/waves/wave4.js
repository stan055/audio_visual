class Wave4 extends WaveSuperClass {
  minHeight = 0.005;
  waveWidth = 0.2;
  tension = 0.4;
  fftSize = 2048 * 4;
  minDecibels = -75;
  styles = [[1, 'rgb(252, 252, 252)']];
  heightWaveFactorOutside = 0.16;     // height wave factor outside square
  heightWaveFactorInside = 0.16;      // height wave factor inside square
  heightDifferenceFactor = 0.1;       // height difference factor of squares

  
  constructor(canvas) {
    super(canvas);
    this.minHeight = this.canvasHeight * this.minHeight;
  }


  fillOfCurvePath(x1, y1, x2, y2) {
    this.ctx.lineTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.fill();
  }


  draw(arrayHeightBars) {
    this.clearCanvas();

    this.sideLength = this.canvasHeight;

    const heightDiff = this.sideLength * this.heightDifferenceFactor;
    const leftX = this.canvasWidth / 2 - this.sideLength / 2;
    const rightX = leftX + this.sideLength;
    const topY = this.canvasHeight - this.sideLength;
    const bottomY = this.sideLength;
    const pointsToFill1 = [
      [rightX, bottomY, leftX, bottomY],
      [rightX, topY, rightX, bottomY],
      [leftX, topY, rightX, topY],
      [leftX, bottomY, leftX, topY],
    ]
    const pointsToFill2 = [
      [rightX - heightDiff, bottomY - heightDiff, leftX + heightDiff, bottomY - heightDiff],
      [rightX - heightDiff, topY + heightDiff, rightX - heightDiff, bottomY - heightDiff],
      [leftX + heightDiff, topY + heightDiff, rightX - heightDiff, topY + heightDiff],
      [leftX + heightDiff, bottomY - heightDiff, leftX + heightDiff, topY + heightDiff]
    ]

    const createY = (i, heightFactor) => {
      if (i < arrayHeightBars.length)
        return arrayHeightBars[i >> 0] * heightFactor + this.minHeight;
      else
        return this.minHeight;
    }

    const createSplinePoints1 = () => {
      // Create points addSplinePoint(x, y)
      const sideLength = this.sideLength;
      const ptsBottom = [];
      const ptsRight = [];
      const ptsTop = [];
      const ptsLeft = [];
      const step = Math.floor(sideLength * this.waveWidth); // Step should be an integer
      const heightFactor = sideLength * this.heightWaveFactorOutside;

      for (let i = 0; i <= sideLength; i += step) {
        let y1, y2, y3, y4;

        y1 = arrayHeightBars[i] * heightFactor + this.minHeight;
        y2 = createY(i+sideLength, heightFactor);
        y3 = createY(i+sideLength*2, heightFactor);
        y4 = createY(i+sideLength*3, heightFactor);

        ptsRight.push(rightX - y1); ptsRight.push(bottomY - i);
        ptsTop.push(rightX - i); ptsTop.push(y2);
        ptsLeft.push(leftX + y3); ptsLeft.push(topY + i);
        ptsBottom.push(i + leftX); ptsBottom.push(bottomY - y4);
      }
      return [ptsBottom, ptsRight, ptsTop, ptsLeft];
    }

    const createSplinePoints2 = (diff) => {
      // Create points addSplinePoint(x, y)
      const sideLength = this.sideLength - diff * 2;
      const ptsBottom = [];
      const ptsRight = [];
      const ptsTop = [];
      const ptsLeft = [];
      const step = Math.floor(sideLength * this.waveWidth); // Step should be an integer
      const heightFactor = this.sideLength * this.heightWaveFactorInside;

      for (let i = 0; i <= sideLength; i += step) {
        let y1, y2, y3, y4;

        y1 = arrayHeightBars[i] * heightFactor + this.minHeight;
        y2 = createY(i+sideLength, heightFactor);
        y3 = createY(i+sideLength*2, heightFactor);
        y4 = createY(i+sideLength*3, heightFactor);

        ptsBottom.push(i + leftX + diff); ptsBottom.push(bottomY - diff - y1);
        ptsRight.push(rightX - diff - y2); ptsRight.push(bottomY - diff - i);
        ptsTop.push(rightX - diff - i); ptsTop.push(y3 + diff);
        ptsLeft.push(leftX + diff + y4); ptsLeft.push(topY + diff + i);

      }
      return [ptsBottom, ptsRight, ptsTop, ptsLeft];
    }


    arrayHeightBars = this.filterAudio(arrayHeightBars, this.bassCount, 0.6);

    const pts1 = createSplinePoints1();
    const pts2 = createSplinePoints2(heightDiff);

    this.ctx.strokeStyle = this.styles[0][1];
    this.ctx.fillStyle = this.ctx.strokeStyle;

    for (let i = 0; i < pts1.length; i++) {
      this.smoothPath(this.ctx, pts1[i], this.tension);
      this.fillOfCurvePath(pointsToFill1[i][0], pointsToFill1[i][1], pointsToFill1[i][2], pointsToFill1[i][3]);
    }
    for (let i = 0; i < pts2.length; i++) {
      this.smoothPath(this.ctx, pts2[i], this.tension);
      this.fillOfCurvePath(pointsToFill2[i][0], pointsToFill2[i][1], pointsToFill2[i][2], pointsToFill2[i][3]);
    }
  }


  drawPrewiev() {
    let array = new Float32Array(2000);
    const min = 0, max = 0.2;
    array = array.map(e => e = Math.random() * (max - min) + min);
    this.draw(array);
  } 
}