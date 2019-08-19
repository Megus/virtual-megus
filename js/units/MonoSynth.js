let _monoSynthId = 0;

function MonoSynth(context, pitchTable) {
    this.id = 'MonoSynth' + (_monoSynthId++);

    this.pitchTable = pitchTable;
    this.context = context;

    this.settings = {
        gain: 1,
        ampEnvelope: {
            attack: 0,
            decay: 0.3,
            sustain: 0.1,
            release: 0.6,
        },
        filterEnvelope: {
            attack: 0,
            decay: 0.2,
            sustain: 0,
            release: 0,
        },
        filter: {
            cutoff: 300,
            resonance: 10,
            envelopeLevel: 500,
            type: 'lowpass',
        },
        osc: [
            {
                type: 'sawtooth',
                pitch: 0,
                detune: 0,
                level: 0.5,
            },
            {
                type: 'sawtooth',
                pitch: 12,
                detune: 10,
                level: 0.5,
            }
        ],
    };

    this.voices = [];

    this.gainNode = context.createGain();
    this.gainNode.gain.value = this.settings.gain;

    this.output = this.gainNode;
}

MonoSynth.prototype.setAmpEnvelope = function(ampEnvelope) {
    this.settings.ampEnvelope = {
        attack: ampEnvelope.attack != null ? ampEnvelope.attack : this.ampEnvelope.attack,
        decay: ampEnvelope.decay != null ? ampEnvelope.decay : this.ampEnvelope.decay,
        sustain: ampEnvelope.sustain != null ? ampEnvelope.sustain : this.ampEnvelope.sustain,
        release: ampEnvelope.release != null ? ampEnvelope.release : this.ampEnvelope.release,
        gain: ampEnvelope.gain != null ? ampEnvelope.gain : this.ampEnvelope.gain,
    };
}

// Note:
// pitch, velocity
MonoSynth.prototype.startNote = function(time, note) {
    this.shutNote(time);
    const voice = new SynthVoice(this.context, this.settings, this.pitchTable, this.onVoiceStop.bind(this));
    this.voices.push(voice);
    voice.output.connect(this.gainNode);
    voice.startNote(time, note);
}

MonoSynth.prototype.stopNote = function(time, note) {
    this.voices.forEach((v) => v.stopNote(time, note));
}

MonoSynth.prototype.shutNote = function(time) {
    this.voices.forEach((v) => v.shutNote(time));
}

MonoSynth.prototype.onVoiceStop = function(voice) {
    const idx = this.voices.indexOf(voice);
    if (idx != -1) {
        this.voices.splice(idx, 1);
    }
}



function SynthVoice(context, settings, pitchTable, onStop) {
    this.pitchTable = pitchTable;
    this.ampEnvelope = settings.ampEnvelope;
    this.filterEnvelope = settings.filterEnvelope;
    this.filter = settings.filter;
    this.osc = settings.osc;

    this.filterNode = context.createBiquadFilter();
    this.filterNode.type = this.filter.type;

    this.gainNode = context.createGain();
    this.filterNode.connect(this.gainNode);

    this.oscBank = [];
    for (let c = 0; c < this.osc.length; c++) {
        const osc = context.createOscillator();
        osc.type = settings.osc[c].type;
        osc.detune.value = settings.osc[c].detune;
        const oscGain = context.createGain();
        oscGain.gain.value = settings.osc[c].level;
        osc.connect(oscGain);
        oscGain.connect(this.filterNode);
        this.oscBank.push(osc);
    }
    this.oscBank[0].onended = () => onStop(this);

    this.output = this.gainNode;
}

SynthVoice.prototype.startNote = function(time, note) {
    try {
        for (let c = 0; c < this.osc.length; c++) {
            this.oscBank[c].frequency.setValueAtTime(this.pitchTable[note.pitch + this.osc[c].pitch], time);
            this.oscBank[c].start(time);
        }    
    } catch (e) {}

    this.velocity = note.velocity;

    applyEnvelopeADS(time, this.ampEnvelope, this.gainNode.gain, 0, note.velocity);
    applyEnvelopeADS(time, this.filterEnvelope, this.filterNode.frequency, this.filter.cutoff, this.filter.envelopeLevel);

    if (this.ampEnvelope.sustain == 0) {
        this.shutNote(time + this.ampEnvelope.attack + this.ampEnvelope.decay);
    }
}

SynthVoice.prototype.stopNote = function(time, note) {
    applyEnvelopeR(time, this.ampEnvelope, this.gainNode.gain, 0, this.velocity);
    applyEnvelopeR(time, this.filterEnvelope, this.filterNode.frequency, this.filter.cutoff, this.filter.envelopeLevel);
    this.shutNote(time + this.ampEnvelope.release);
}

SynthVoice.prototype.shutNote = function(time) {
    for (let c = 0; c < this.oscBank.length; c++) {
        this.oscBank[c].stop(time);
    }
}