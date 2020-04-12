// Monophonic Subtractive Synth Unit
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class MonoSynth extends Unit {
  /**
  *
  * @param {AudioContext} context
  * @param {Array} pitchTable
  * @param {Object} preset
  */
  constructor(context, pitchTable, preset) {
    super(context, pitchTable, "monosynt");

    this.voicePreset = preset;

    this.voices = [];

    this.gainNode = context.createGain();
    this.gainNode.gain.value = 1;
    this.output = this.gainNode;
  }

  // Note: {pitch: ..., velocity: ..., duration: ...}
  playNote(time, note) {
    this.shutNote(time);
    const voice = new SubSynthVoice(this);
    this.voices.push(voice);
    voice.output.connect(this.gainNode);
    voice.playNote(time, note);
  }

  shutNote(time) {
    this.voices.forEach((v) => v.shutNote(time));
  }

  // Called by SubSynthVoice
  onVoiceStop(voice) {
    const idx = this.voices.indexOf(voice);
    if (idx != -1) {
      this.voices.splice(idx, 1);
    }
  }
}


