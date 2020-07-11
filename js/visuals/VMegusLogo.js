class VMegusLogo extends VisualLayer {
  constructor() {
    super();
    this.logoSize = 1.0;
    this.logoSpeed = 1.0;
    this.logoScales = [];
  }

  onStep(step) {
    if (step % 4 == 0) {
      this.logoSize = 1.5;
      this.logoSpeed = 1.0;
    }
  }

  draw(ctx, dTime, immediateValues) {

    this.logoScales.push(this.logoSize * 0.9);

    // Draw Megus logo
    ctx.translate(0.5, 0.5);
    for (let c = 0; c < this.logoScales.length; c++) {
      const scale = this.logoScales[c];
      let alpha = (c + 1) / this.logoScales.length;
      alpha *= alpha;
      const gradient = ctx.createLinearGradient(0.129 * scale, -0.227 * scale, 0.229 * scale, 0.092 * scale);
      gradient.addColorStop(0, this.lightColorWithOpacity(16, 89, 199, alpha, scale * 2 - 0.8));
      gradient.addColorStop(1, this.lightColorWithOpacity(17, 69, 148, alpha, scale * 2 - 0.8));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0.129 * scale, -0.227 * scale);
      ctx.lineTo(0.229 * scale, 0.092 * scale);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-0.129 * scale, -0.227 * scale);
      ctx.lineTo(-0.229 * scale, 0.092 * scale);
      ctx.fill();
    }

    if (this.logoScales.length > 6) {
      this.logoScales.splice(0, 1);
    }

    this.logoSize -= dTime * this.logoSpeed;
    this.logoSpeed += 7 * dTime;
    if (this.logoSize < 1.0) {
      this.logoSize = 1.0;
    }
  }

  // Light color with opacity
  lightColorWithOpacity(r, g, b, a, light) {
    r *= light;
    g *= light;
    b *= light;
    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }
}