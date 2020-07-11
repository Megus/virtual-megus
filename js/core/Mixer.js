// Mixer
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Mixer {
  constructor() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext();

      this.channels = [];
      this.getValuesForVisuals = this.getValuesForVisuals.bind(this);

      // Setup master bus elements
      this.masterBusInput = this.context.createGain();
      this.masterBusOutput = this.context.createGain();
      this.masterBusOutput.connect(this.context.destination);

      // Default master compressor
      this.masterCompressor = this.context.createDynamicsCompressor();
      this.masterCompressor.attack.value = 0.05;
      this.masterCompressor.release.value = 0.1;
      this.masterCompressor.threshold.value = -20;
      this.masterCompressor.ratio.value = 4;
      this.masterCompressor.knee.value = 40;

      // Master reverberator
      this.masterReverb = this.context.createConvolver();
      this.masterReverb.normalize = true;

      // Routing
      this.masterBusInput.connect(this.masterCompressor);
      this.masterReverb.connect(this.masterCompressor);
      this.masterCompressor.connect(this.masterBusOutput);
    }
    catch (e) {
      alert(e);
    }
  }

  setMasterReverbImpulse(buffer) {
    this.masterReverb.buffer = buffer;
  }

  addChannel(channel) {
    channel.output.connect(this.masterBusInput);
    channel.reverbSend.connect(this.masterReverb);
    this.channels.push(channel);
    return channel;
  }

  removeChannel(channel) {
    channel.dispose();
    const index = this.channels.indexOf(channel);
    if (index != -1) {
      this.channels.splice(index, 1);
    }
  }

  getValuesForVisuals() {
    return {
      compressor: this.masterCompressor.reduction,
    }
  }
}
