// Core of music generator
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Conductor {
  constructor() {
  }

  setVisualizer(visualizer) {
    this.visualizer = visualizer;
  }

  async play() {
    if (this.mixer == null) {
      this.mixer = new Mixer();
      this.sequencer = new Sequencer(this.mixer.context);
      this.mixer.addRemoveChannelCallback(this.visualizer.onRemoveChannel);
      this.visualizer.setSequencer(this.sequencer);
    }


    if (this.composer == null) {
      this.composer = new Composer1(this.mixer, this.sequencer);
      await this.composer.setupEnsemble();
      this.composer.start();
    }
    this.sequencer.play();
  }

  pause() {
    this.sequencer.pause();
  }

  stop() {
    this.composer.stop();
    this.sequencer.reset();
    this.composer = null;
  }
}
