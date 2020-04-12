
/**
* Base class for all composers
*/

class Composer {
  /**
  *
  * @param {Mixer} mixer
  * @param {Sequencer} sequencer
  */
  constructor(mixer, sequencer) {
    this.mixer = mixer;
    this.sequencer = sequencer;
  }

  // To be implemented in subclasses
  async setupEnsemble() {};
  start() {};
  stop() {};
}