// Core of music generator
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Core {
  constructor() {
    this.sequencer = new Sequencer();
    this.visualizer = new Visualizer("visuals");
    this.audioFileManager = new AudioFileManager();

    this.sequencer.addStepCallback(this.visualizer.onStep);
    this.sequencer.addEventCallback(this.visualizer.onEvent);

    this.visualizer.addLayer(new VCommon(), -1);
    this.visualizer.addLayer(new VMegusLogo(), 1000);

    this.firstPlay = true;
  }

  /**
   * Start playing or resume playback after pause
   */
  async play(composer) {
    if (this.firstPlay) {
      this.firstPlay = false;

      // Initialize Mixer only after user action, because it's a browser requirement
      this.mixer = new Mixer();
      this.visualizer.setValuesProvider(this.mixer.getValuesForVisuals);

      await this.audioFileManager.loadAudioFiles(this.mixer.context, this.visualizer.setLoadingProgress);
      this.visualizer.setLoadingProgress(0);
      this.mixer.setMasterReverbImpulse(this.audioFileManager.audioBuffers["SteinmanFoundationRecordingSuite.wav"]);
    }

    if (this.composer != composer) {
      if (this.composer != null) {
        this.composer.stop();
        this.sequencer.reset();
      }
      this.composer = composer;
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
