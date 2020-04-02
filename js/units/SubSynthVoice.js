// Single voice of subtractive synths (MonoSynth, PolySynth)
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class SubSynthVoice {
    constructor(unit) {
        this.unit = unit;

        const preset = unit.voicePreset;
        const context = unit.context;

        this.filterNode = context.createBiquadFilter();
        this.filterNode.type = preset.filter.type;
        this.filterNode.Q.value = preset.filter.resonance;

        this.gainNode = context.createGain();
        this.filterNode.connect(this.gainNode);

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

    startNote(time, note) {
        const preset = this.unit.voicePreset;

        try {
            for (let c = 0; c < this.oscBank.length; c++) {
                this.oscBank[c].frequency.setValueAtTime(this.unit.pitchTable[note.pitch + preset.osc[c].pitch], time);
                this.oscBank[c].start(time);
            }
        } catch (e) {}

        this.velocity = note.velocity;

        this.unit.applyEnvelopeADS(time, preset.ampEnvelope, this.gainNode.gain, 0, note.velocity);
        this.unit.applyEnvelopeADS(time, preset.filterEnvelope, this.filterNode.frequency, preset.filter.cutoff, preset.filter.envelopeLevel);

        if (preset.ampEnvelope.sustain == 0) {
            this.shutNote(time + preset.ampEnvelope.attack + preset.ampEnvelope.decay);
        }

    }

    stopNote(time) {
        const preset = this.unit.voicePreset;

        this.unit.applyEnvelopeR(time, preset.ampEnvelope, this.gainNode.gain, 0, this.velocity);
        this.unit.applyEnvelopeR(time, preset.filterEnvelope, this.filterNode.frequency, preset.filter.cutoff, preset.filter.envelopeLevel);
        this.shutNote(time + preset.ampEnvelope.release);
    }

    shutNote(time) {
        for (let c = 0; c < this.oscBank.length; c++) {
            try {
                this.oscBank[c].stop(time);
            } catch (e) {}
        }
    }
}
