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

    this.reverbSend = this.context.createGain();
    this.reverbSend.gain.value = 0.5;

    this.unit.output.connect(this.gainNode);
    this.unit.output.connect(this.reverbSend);

    this.output = this.gainNode;
  }

  dispose() {
    this.unit.output.disconnect();
    this.reverbSend.disconnect();
  }
}
