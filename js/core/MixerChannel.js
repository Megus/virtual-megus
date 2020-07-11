// Mixer channel strip
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

let _channelId = 0;

class MixerChannel {
  constructor(unit) {
    this.context = unit.context;
    this.unit = unit;
    this.id = unit.unitType + (_channelId++);

    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = 1;

    this.delay = new Delay(this.context);

    this.reverbSend = this.context.createGain();
    this.unitReverbSend = this.context.createGain();
    this.unitReverbSend.gain.value = 0.5;
    this.delayReverbSend = this.context.createGain();

    this.output = this.context.createGain();

    this.unitReverbSend.connect(this.reverbSend);
    this.delayReverbSend.connect(this.reverbSend);

    this.unit.output.connect(this.gainNode);
    this.gainNode.connect(this.unitReverbSend);
    this.gainNode.connect(this.delay.input);
    this.delay.output.connect(this.output);
    this.delay.output.connect(this.delayReverbSend);
    this.gainNode.connect(this.output);
  }

  dispose() {
    this.unit.output.disconnect();
    this.reverbSend.disconnect();
  }

  handleEvent(event) {
    if (event.type != "channel") {
      this.unit.handleEvent(event);
    }
    // TODO: handle mixer events
  }
}
