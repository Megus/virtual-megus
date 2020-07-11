// Visualizer
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Visualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.events = [];
    this.loadingProgress = 0;

    this.draw = this.draw.bind(this);
    this.onStep = this.onStep.bind(this);
    this.onEvent = this.onEvent.bind(this);
    this.setLoadingProgress = this.setLoadingProgress.bind(this);

    this.layers = [];

    window.requestAnimationFrame(this.draw);
  }

  addLayer(layer) {
    this.layers.push(layer);
  }

  removeLayer(layer) {
    const index = this.layers.indexOf(layer);
    if (index != -1) {
      this.layers.splice(index, 1);
    }
  }

  /**
   * Set immediate analyser values provider
   *
   * @param {function} provider
   */
  setValuesProvider(provider) {
    this.valuesProvider = provider;
  }

  /**
   * Set loading progress value (0-1)
   *
   * @param {number} value
   */
  setLoadingProgress(value) {
    this.loadingProgress = value;
  }

  // Sequencer events
  onStep(time, step) {
    this.events.push({type: "step", time: time, data: step});
  }

  onEvent(channelId, event) {
    this.events.push({type: event.type, time: event.timeSeconds, channelId: channelId, data: event.data});
  }

  // Main drawing function
  draw(drawTime) {
    // Time
    const currentTime = (core.mixer != null) ? core.mixer.context.currentTime : 0;
    if (this.lastTime == null) { this.lastTime = currentTime; }
    const dTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Prepare 2D context
    const ctx = this.canvas.getContext('2d');
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    // Draw loading progress
    ctx.fillStyle = "#d0d0f0";
    ctx.fillRect(0, height - 8, width * this.loadingProgress, height);

    ctx.scale(width, width);

    // Handle events
    const events = this.events.filter(event => event.time <= currentTime);

    events.forEach((event) => {
      if (event.type == "step") {
        this.layers.forEach(layer => layer.onStep(event.data));
      } else {
        this.layers.forEach(layer => layer.onEvent(event));
      }
    });

    this.events = this.events.filter(event => event.time > currentTime);

    // Draw layers
    const immediateValues = (this.valuesProvider != null) ? this.valuesProvider() : {};
    this.layers.forEach((layer) => {
      ctx.save();
      layer.draw(ctx, dTime, immediateValues);
      ctx.restore();
    });

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    window.requestAnimationFrame(this.draw);
  }
}
