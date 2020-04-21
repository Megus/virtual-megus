// Single voice of subtractive synths (MonoSynth, PolySynth)
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class SubSynthVoice {
  /**
   * SubSyntVoice constructor
   *
   * @param {Unit} unit
   */
  constructor(unit) {
    this.unit = unit;

    const preset = unit.voicePreset;
    const context = unit.context;

    this.filterNode = context.createBiquadFilter();
    this.filterNode.type = preset.filter.type;
    this.filterNode.Q.value = preset.filter.resonance;

    this.pannerNode = context.createStereoPanner();
    this.gainNode = context.createGain();

    this.filterNode.connect(this.pannerNode);
    this.pannerNode.connect(this.gainNode);

    this.oscBank = [];
    for (let c = 0; c < preset.osc.length; c++) {
      const osc = context.createOscillator();
      osc.type = preset.osc[c].type;
      osc.detune.value = preset.osc[c].detune;
      const oscGain = context.createGain();
      oscGain.gain.value = preset.osc[c].level;
      osc.connect(oscGain);
      oscGain.connect(this.filterNode);
      this.oscBank.push(osc);
    }
    this.oscBank[0].onended = () => unit.onVoiceStop(this);

    this.output = this.gainNode;
  }

  playNote(time, note) {
    const preset = this.unit.voicePreset;

    // Apply panning
    if (preset.panning != null) {
      let pan = preset.panning.pan;
      if (preset.panning.spread != null) {
        pan += (note.pitch - preset.panning.centerPitch) * preset.panning.spread;
      }

      this.pannerNode.pan.setValueAtTime(this.unit.clamp(pan, -1, 1), time);
    }

    try {
      for (let c = 0; c < this.oscBank.length; c++) {
        this.oscBank[c].frequency.setValueAtTime(this.unit.pitchTable[note.pitch + preset.osc[c].pitch], time);
        this.oscBank[c].start(time);
      }
    } catch (e) {}

    this.velocity = note.velocity;

    const endTime = this.unit.applyADSR(time, note.duration, preset.ampEnvelope, this.gainNode.gain, 0, note.velocity);
    this.unit.applyADSR(time, note.duration, preset.filterEnvelope, this.filterNode.frequency, preset.filter.cutoff, preset.filter.envelopeLevel);

    this.shutNote(endTime);
  }

  shutNote(time) {
    for (let c = 0; c < this.oscBank.length; c++) {
      try {
        this.oscBank[c].stop(time);
      } catch (e) {}
    }
  }
}
