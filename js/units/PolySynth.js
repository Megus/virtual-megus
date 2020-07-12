// Polyphonic Subtractive Synth Unit
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class PolySynth extends Unit {
	constructor(context, pitchTable, preset) {
		super(context, pitchTable, "polysynt");

		this.voicePreset = preset;

		this.voices = [];

		this.gainNode = context.createGain();
		this.gainNode.gain.value = 1;
		this.output = this.gainNode;
	}

	playNote(time, note) {
		const voice = new SubSynthVoice(this);
		this.voices.push(voice);
		voice.output.connect(this.gainNode);
		voice.playNote(time, note);
	}

	onVoiceStop(voice) {
		const idx = this.voices.indexOf(voice);
		if (idx != -1) {
			this.voices.splice(idx, 1);
		}
	}

  getAudioLevel() {
    return this.voices.reduce((prev, voice) => prev + voice.getAudioLevel(), 0);
  }
}
