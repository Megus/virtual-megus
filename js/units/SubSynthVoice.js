// Single voice of subtractive synths (MonoSynth, PolySynth)
//
// 2019, Roman "Megus" Petrov

function SubSynthVoice(context, preset, pitchTable, onStop) {
    this.preset = preset;
    this.pitchTable = pitchTable;

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
    this.oscBank[0].onended = () => onStop(this);

    this.output = this.gainNode;
}

SubSynthVoice.prototype.startNote = function(time, note) {
    const preset = this.preset;

    try {
        for (let c = 0; c < this.oscBank.length; c++) {
            this.oscBank[c].frequency.setValueAtTime(this.pitchTable[note.pitch + preset.osc[c].pitch], time);
            this.oscBank[c].start(time);
        }
    } catch (e) {}

    this.velocity = note.velocity;

    applyEnvelopeADS(time, preset.ampEnvelope, this.gainNode.gain, 0, note.velocity);
    applyEnvelopeADS(time, preset.filterEnvelope, this.filterNode.frequency, preset.filter.cutoff, preset.filter.envelopeLevel);

    if (preset.ampEnvelope.sustain == 0) {
        this.shutNote(time + preset.ampEnvelope.attack + preset.ampEnvelope.decay);
    }
}

SubSynthVoice.prototype.stopNote = function(time) {
    const preset = this.preset;

    applyEnvelopeR(time, preset.ampEnvelope, this.gainNode.gain, 0, this.velocity);
    applyEnvelopeR(time, preset.filterEnvelope, this.filterNode.frequency, preset.filter.cutoff, preset.filter.envelopeLevel);
    this.shutNote(time + preset.ampEnvelope.release);
}

SubSynthVoice.prototype.shutNote = function(time) {
    for (let c = 0; c < this.oscBank.length; c++) {
        try {
            this.oscBank[c].stop(time);
        } catch (e) {}
    }
}
