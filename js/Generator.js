// Core of music generator
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Generator {
  constructor() {
    this.mixer = new Mixer();
    this.sequencer = new Sequencer(this.mixer.context);
    this.pitchTable = createPitchTable(440.0);
  }

  async play() {
    if (this.conductor == null) {
      this.conductor = new Conductor1(this.mixer, this.sequencer, this.pitchTable);
      await this.conductor.setupEnsemble();
      this.conductor.start();
    }
    this.sequencer.play();
  }

  pause() {
    this.sequencer.pause();
  }

  stop() {
    this.conductor.stop();
    this.sequencer.reset();
    this.conductor = null;
  }
}
