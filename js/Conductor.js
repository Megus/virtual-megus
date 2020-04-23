// Core of music generator
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Conductor {
  constructor() {
  }

  /**
   * Set main visualizer
   *
   * @param {Object} visualizer
   */
  setVisualizer(visualizer) {
    this.visualizer = visualizer;
  }

  /**
   * Start playing or resume playback after pause
   */
  async play() {
    if (this.mixer == null) {
      this.mixer = new Mixer();
      this.sequencer = new Sequencer(this.mixer.context);
      this.mixer.addRemoveChannelCallback(this.visualizer.onRemoveChannel);
      this.visualizer.setSequencer(this.sequencer);
      this.visualizer.setValuesProvider(this.mixer.getValuesForVisuals);
      this.audioFileManager = new AudioFileManager();
      await this.audioFileManager.loadAudioFiles(this.mixer.context, this.visualizer.setLoadingProgress);
      this.visualizer.setLoadingProgress(0);
      this.mixer.setMasterReverbImpulse(this.audioFileManager.audioBuffers["SteinmanFoundationRecordingSuite.wav"]);
    }

    if (this.composer == null) {
      this.composer = new Composer1(this.mixer, this.sequencer);
      await this.composer.setupEnsemble();
      this.composer.start();
    }
    this.sequencer.play();
  }

  /**
   * Pause playback
   */
  pause() {
    this.sequencer.pause();
  }

  /**
   * Stop playback
   */
  stop() {
    this.composer.stop();
    this.sequencer.reset();
    this.composer = null;
  }
}
