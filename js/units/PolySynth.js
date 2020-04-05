// Polyphonic Subtractive Synth Unit
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class PolySynth extends Unit {
    constructor(context, pitchTable, preset) {
        super(context, pitchTable, "polysynt");

        this.voicePreset = preset;

        this.gain = 1;
        this.voices = {};

        this.gainNode = context.createGain();
        this.gainNode.gain.value = this.gain;

        this.output = this.gainNode;
    }

    startNote(time, note) {
        const voice = new SubSynthVoice(this);
        this.stopNote(time, note);
        this.voices[note.pitch] = voice;
        voice.output.connect(this.gainNode);
        voice.startNote(time, note);

    }

    stopNote(time, note) {
        if (this.voices[note.pitch] != null) {
            this.voices[note.pitch].stopNote(time);
        }
    }

    onVoiceStop(voice) {
        for (let pitch in this.voices) {
            if (this.voices[pitch] === voice) {
                this.voices[pitch] = null;
                break;
            }
        }
    }
}
