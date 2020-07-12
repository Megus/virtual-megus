class VTriangles extends VisualLayer {
  constructor(channelId) {
    super();
    this.channelId = channelId;
    this.shapes = [];
    this.color = this.randomColor();
    this.points = [[Math.random(), Math.random()], [Math.random(), Math.random()], [Math.random(), Math.random()]];
    this.speeds = [[Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5]];
  }

  onEvent(event) {
    if (event.channelId == this.channelId) {
      this.color = this.randomColor();
    }
  }

  draw(ctx, dTime, immediateValues) {
    let strokeWidth = immediateValues.levels[this.channelId] * 0.005;
    this.shapes.push([
      [this.points[0][0], this.points[0][1]],
      [this.points[1][0], this.points[1][1]],
      [this.points[2][0], this.points[2][1]],
      this.color, strokeWidth
    ]);

    this.shapes.forEach((shape) => {
      if (shape[4] > 0) {
        ctx.strokeStyle = shape[3];
        ctx.lineWidth = shape[4];
        ctx.beginPath();
        ctx.moveTo(shape[0][0], shape[0][1]);
        ctx.lineTo(shape[1][0], shape[1][1]);
        ctx.lineTo(shape[2][0], shape[2][1]);
        ctx.closePath();
        ctx.stroke();
      }
    });

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
  }

  // Utility functions
  randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return (`rgb(${r},${g},${b},0.2)`);
  }
}