class VCommon extends VisualLayer {
  draw(ctx, dTime, immediateValues) {
    const reduction = immediateValues.compressor;

    if (reduction != null) {
      ctx.fillStyle = "#000040";
      ctx.fillRect(0, 0, 1, -reduction * 0.03);
    }
  }
}