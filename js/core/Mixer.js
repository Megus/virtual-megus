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

      this.setupPulseOscillatorFactory();
    }
    catch (e) {
      alert(e);
    }
  }

  setupPulseOscillatorFactory() {
    var pulseCurve=new Float32Array(256);
    for(var i=0;i<128;i++) {
      pulseCurve[i]= -0.4;
      pulseCurve[i+128]=0.4;
    }
    var constantOneCurve=new Float32Array(2);
    constantOneCurve[0]=1;
    constantOneCurve[1]=1;

    this.context.createPulseOscillator = function() {
      //Use a normal oscillator as the basis of our new oscillator.
      var node=this.createOscillator();
      node.type="sawtooth";

      //Shape the output into a pulse wave.
      var pulseShaper=this.createWaveShaper();
      pulseShaper.curve=pulseCurve;
      node.connect(pulseShaper);

      //Use a GainNode as our new "width" audio parameter.
      var widthGain=this.createGain();
      widthGain.gain.value=0; //Default width.
      node.width=widthGain.gain; //Add parameter to oscillator node.
      widthGain.connect(pulseShaper);

      //Pass a constant value of 1 into the widthGain – so the "width" setting is
      //duplicated to its output.
      var constantOneShaper=this.createWaveShaper();
      constantOneShaper.curve=constantOneCurve;
      node.connect(constantOneShaper);
      constantOneShaper.connect(widthGain);

      //Override the oscillator's "connect" method so that the new node's output
      //actually comes from the pulseShaper.
      node.connect=function() {
        pulseShaper.connect.apply(pulseShaper, arguments);
        return node;
      }

      //Override the oscillator's "disconnect" method.
      node.disconnect=function() {
        pulseShaper.disconnect.apply(pulseShaper, arguments);
        return node;
      }

      return node;
    };
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
    const values = {
      compressor: this.masterCompressor.reduction,
      levels: {},
    };

    this.channels.forEach((channel) => {
      values.levels[channel.id] = channel.unit.getAudioLevel();
    });

    return values;
  }
}
