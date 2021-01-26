class Wave3 extends WaveSuperClass {
  minHeight = 0.005;
  waveWidth = 0.2;
  bassFactor = 0.5;
  bassCount = 150;
  tension = 0.4;
  fftSize = 2048*4;
  minDecibels = -70;
  styles = [[1, 'hsl(0, 1%, 99%)']];
  heightWaveFactor = 0.12;
  heightDifferenceFactor = 0.1; // Height difference factor of squares

  constructor(canvas) {
    super(canvas);
    this.minHeight = this.canvasHeight * this.minHeight;
  }

  lowerBass(arrayHeightBars, count, factor) {
    for (let i = 0; i < count; i++) {
      arrayHeightBars[i] = arrayHeightBars[i] * factor;
    }
    return arrayHeightBars;
  }


  va(arr, i, j) {
    return [arr[2*j]-arr[2*i], arr[2*j+1]-arr[2*i+1]]
  }


  dista(arr, i, j) {
    return Math.sqrt(Math.pow(arr[2*i]-arr[2*j], 2) + Math.pow(arr[2*i+1]-arr[2*j+1], 2));
  }


  ctlpts(x1,y1,x2,y2,x3,y3) {
    var t = this.tension;
    var v = this.va([x1,y1,x2,y2,x3,y3], 0, 2);
    var d01 = this.dista([x1,y1,x2,y2,x3,y3], 0, 1);
    var d12 = this.dista([x1,y1,x2,y2,x3,y3], 1, 2);
    var d012 = d01 + d12;
    return [x2 - v[0] * t * d01 / d012, y2 - v[1] * t * d01 / d012,
            x2 + v[0] * t * d12 / d012, y2 + v[1] * t * d12 / d012 ];
  }


  drawCurvedPath(cps, pts) {
    var len = pts.length / 2; // number of points

    this.ctx.beginPath();
    this.ctx.moveTo(pts[0], pts[1]);
    // from point 0 to point 1 is a quadratic
    this.ctx.quadraticCurveTo(cps[0], cps[1], pts[2], pts[3]);
    // for all middle points, connect with bezier
    for (var i = 2; i < len-1; i += 1) {
      this.ctx.bezierCurveTo(cps[(2*(i-1)-1)*2], cps[(2*(i-1)-1)*2+1],
                        cps[(2*(i-1))*2], cps[(2*(i-1))*2+1],
                        pts[i*2], pts[i*2+1]);
    }
    this.ctx.quadraticCurveTo(cps[(2*(i-1)-1)*2], cps[(2*(i-1)-1)*2+1],
                         pts[i*2], pts[i*2+1]);

  }


  fillOfCurvePath(x1, y1, x2, y2) {
    this.ctx.lineTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.fill();
  }


  drawSplines(pts) {
    let cps = []; // There will be two control points for each "middle" point, 1 ... len-2e
    for (var i = 0; i < pts.length - 2; i += 1) {
      cps = cps.concat(this.ctlpts(pts[2*i], pts[2*i+1], pts[2*i+2], pts[2*i+3], pts[2*i+4], pts[2*i+5]));
    }
      this.ctx.fillStyle = this.ctx.strokeStyle;
      this.drawCurvedPath(cps, pts);
  }


  draw(arrayHeightBars) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      
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

      const createY = (i, sideLength, sideFactor, heightFactor) => {
      if (sideLength * sideFactor + i > arrayHeightBars.length)
        return this.minHeight;
      else 
        return arrayHeightBars[sideLength + i] * heightFactor + this.minHeight;
      } 

      const createSplinePoints1 = () => {
        // Create points addSplinePoint(x, y)
        const sideLength = this.sideLength;
        const ptsBottom = [];
        const ptsRight = [];
        const ptsTop = [];
        const ptsLeft = [];
        const step = Math.floor(sideLength * this.waveWidth); // Step should be an integer
        const heightFactor = sideLength * this.heightWaveFactor;

        for (let i = 0; i <= sideLength; i += step) {
          let y1, y2, y3, y4;
          
          y1 = arrayHeightBars[i] * heightFactor + this.minHeight;
          y2 = createY(i, sideLength, 1, heightFactor);
          y3 = createY(i, sideLength, 2, heightFactor);
          y4 = createY(i, sideLength, 3, heightFactor);

          ptsRight.push(rightX - y1); ptsRight.push(bottomY - i);
          ptsTop.push(rightX - i); ptsTop.push(y2);
          ptsLeft.push(leftX + y3); ptsLeft.push(topY + i);
          ptsBottom.push(i + leftX); ptsBottom.push(bottomY - y4);
        }
        return [ptsBottom, ptsRight, ptsTop, ptsLeft];
      }
      
      const createSplinePoints2 = (diff) => {
        // Create points addSplinePoint(x, y)
        const sideLength = this.sideLength - diff*2;
        const ptsBottom = [];
        const ptsRight = [];
        const ptsTop = [];
        const ptsLeft = [];
        const step = Math.floor(sideLength * this.waveWidth); // Step should be an integer
        const heightFactor = sideLength * this.heightWaveFactor;

        for (let i = 0; i <= sideLength; i += step) {
          let y1, y2, y3, y4;
          
          y1 = arrayHeightBars[i] * heightFactor + this.minHeight;
          y2 = createY(i, sideLength, 1, heightFactor);
          y3 = createY(i, sideLength, 2, heightFactor);
          y4 = createY(i, sideLength, 3, heightFactor);

          ptsBottom.push(i + leftX + diff); ptsBottom.push(bottomY - diff - y1);
          ptsRight.push(rightX - diff - y2); ptsRight.push(bottomY - diff - i);
          ptsTop.push(rightX - diff - i); ptsTop.push(y3 + diff);
          ptsLeft.push(leftX + diff + y4); ptsLeft.push(topY + diff + i);

        }
        return [ptsBottom, ptsRight, ptsTop, ptsLeft];
      }


      arrayHeightBars = this.lowerBass(arrayHeightBars, this.bassCount, this.bassFactor);

      const pts1 = createSplinePoints1();
      const pts2 = createSplinePoints2(heightDiff);
    
      this.ctx.strokeStyle = this.styles[0][1];

      for (let i = 0; i < pts1.length; i++) {
        this.drawSplines(pts1[i]);
        this.fillOfCurvePath(pointsToFill1[i][0], pointsToFill1[i][1], pointsToFill1[i][2], pointsToFill1[i][3]);
      }
      for (let i = 0; i < pts2.length; i++) {
        this.drawSplines(pts2[i]);
        this.fillOfCurvePath(pointsToFill2[i][0], pointsToFill2[i][1], pointsToFill2[i][2], pointsToFill2[i][3]);
      }
  }
}