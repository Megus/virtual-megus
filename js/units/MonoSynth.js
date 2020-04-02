// Monophonic Subtractive Synth Unit
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class MonoSynth extends Unit {
    constructor(context, pitchTable, preset) {
        super(context, "monosynt");

        this.pitchTable = pitchTable;
        this.voicePreset = preset;

        this.gain = 1;
        this.voices = [];

        this.gainNode = context.createGain();
        this.gainNode.gain.value = this.gain;

        this.output = this.gainNode;
    }

    // Note: {pitch: ..., velocity: ...}
    startNote(time, note) {
        this.shutNote(time);
        const voice = new SubSynthVoice(this);
        this.voices.push(voice);
        voice.output.connect(this.gainNode);
        voice.startNote(time, note);
    }

    stopNote(time, note) {
        this.voices.forEach((v) => v.stopNote(time, note));
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


