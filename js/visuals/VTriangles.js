class VTriangles extends VisualLayer {
  constructor(channelId) {
    super();
    this.channelId = channelId;
    this.shapes = [];
    this.width = 0.001;
    this.color = this.randomColor();
    this.points = [[Math.random(), Math.random()], [Math.random(), Math.random()], [Math.random(), Math.random()]];
    this.speeds = [[Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5]];
  }

  onEvent(event) {
    if (event.channelId == this.channelId) {
      this.width = 0.01;
      this.color = this.randomColor();
    }
  }

  draw(ctx, dTime, immediateValues) {
    this.shapes.push([
      [this.points[0][0], this.points[0][1]],
      [this.points[1][0], this.points[1][1]],
      [this.points[2][0], this.points[2][1]],
      this.color,
    ]);

    let strokeWidth = this.width;
    for (let c = this.shapes.length - 1; c >= 0; c -= 5) {
      ctx.strokeStyle = this.shapes[c][3];
      ctx.lineWidth = strokeWidth;
      ctx.beginPath();
      ctx.moveTo(this.shapes[c][0][0], this.shapes[c][0][1]);
      ctx.lineTo(this.shapes[c][1][0], this.shapes[c][1][1]);
      ctx.lineTo(this.shapes[c][2][0], this.shapes[c][2][1]);
      ctx.closePath();
      ctx.stroke();
      strokeWidth *= 0.8;
    }
    if (this.shapes.length > 60) {
      this.shapes.splice(0, 1);
    }

    for (let c = 0; c < this.points.length; c++) {
      this.points[c][0] += this.speeds[c][0] * dTime;
      this.points[c][1] += this.speeds[c][1] * dTime;
      if (this.points[c][0] > 1 || this.points[c][0] < 0) {
        this.points[c][0] = this.points[c][0] > 1 ? 1 : 0;
        this.speeds[c][0] = -Math.sign(this.speeds[c][0]) * Math.random();
      }
      if (this.points[c][1] > 1 || this.points[c][1] < 0) {
        this.points[c][1] = this.points[c][1] > 1 ? 1 : 0;
        this.speeds[c][1] = -Math.sign(this.speeds[c][1]) * Math.random();
      }
    }
    this.width -= dTime * 0.01;
    if (this.width < 0.001) {
      this.width = 0.001;
    }
  }

  // Utility functions
  randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return ('rgb(' + r + ',' + g + ',' + b + ')');
  }
}