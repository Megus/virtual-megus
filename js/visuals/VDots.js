class VDots extends VisualLayer {
  constructor(channelId) {
    super();
    this.channelId = channelId;
    this.dots = [];
    this.dotColors = [
      '#ffffff',
      '#df8040',
      '#30d040',
      '#4060ef',
      '#506050',
      '#708070',
      '#30d040',
      '#ffff00',
    ];
  }

  onEvent(event) {
    if (event.channelId == this.channelId) {
      this.dots.push({
        x: Math.random(),
        y: Math.random(),
        radius: event.data.velocity * 0.1,
        color: this.dotColors[Math.floor(event.data.pitch / 12)],
        speed: 0.1
      });
    }
  }

  draw(ctx, dTime, immediateValues) {
    this.dots.forEach((dot) => {
      const gradient = ctx.createRadialGradient(dot.x, dot.y, dot.radius * 0.2, dot.x, dot.y, dot.radius);
      gradient.addColorStop(0, dot.color + 'ff');
      gradient.addColorStop(0.2, dot.color + 'ff');
      gradient.addColorStop(0.5, dot.color + '80');
      gradient.addColorStop(1, dot.color + '00');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(dot.x, dot.y, dot.radius, dot.radius, 0, 0, Math.PI * 2);
      ctx.fill();

      dot.radius -= dot.speed * dTime;
      dot.speed += 0.1 * dTime;
    });

    this.dots = this.dots.filter(dot => dot.radius > 0);
  }
}