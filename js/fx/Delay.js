'use strict';

class Delay extends FX {
  /**
   * Ping-ping delay constructor
   *
   * @param {AudioContext} context
   */
  constructor(context) {
    super(context, "delay");

    this.input = context.createGain();
    this.input.gain.value = 0.25;

    // Create nodes
    this.filter1 = context.createBiquadFilter();
    this.filter1.type = "lowshelf";
    this.filter1.frequency.value = 400;
    this.filter1.gain.value = -12;
    this.filter2 = context.createBiquadFilter();
    this.filter2.type = "lowshelf";
    this.filter2.frequency.value = 400;
    this.filter2.gain.value = -12;
    this.delay1 = context.createDelay();
    this.delay1.delayTime.value = 0.3;
    this.delay2 = context.createDelay();
    this.delay2.delayTime.value = 0.3;
    this.panner1 = context.createStereoPanner();
    this.panner1.pan.value = -0.6;
    this.panner2 = context.createStereoPanner();
    this.panner2.pan.value = 0.6;
    this.feedback1 = context.createGain();
    this.feedback1.gain.value = 0.3;
    this.feedback2 = context.createGain();
    this.feedback2.gain.value = 0.3;
    this.output = context.createGain();

    // Signal routing
    this.input.connect(this.filter1);
    this.filter1.connect(this.delay1);
    this.delay1.connect(this.filter2);
    this.filter2.connect(this.delay2);
    this.delay1.connect(this.feedback1);
    this.delay2.connect(this.feedback2);
    this.feedback1.connect(this.filter2);
    this.feedback2.connect(this.filter1);
    this.delay1.connect(this.panner1);
    this.delay2.connect(this.panner2);
    this.panner1.connect(this.output);
    this.panner2.connect(this.output);
  }
}