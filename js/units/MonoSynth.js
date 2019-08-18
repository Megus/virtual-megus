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
    const voice = new SynthVoice(this.context, this.settings, this.onVoiceStop.bind(this));
    this.voices.push(voice);
    voice.output.connect(this.gainNode);
    voice.startNote(time, {pitch: this.pitchTable[note.pitch], velocity: note.velocity});
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



function SynthVoice(context, settings, onStop) {
    this.ampEnvelope = settings.ampEnvelope;

    this.oscNode = context.createOscillator();
    this.oscNode.onended = () => onStop(this);
    this.oscNode.type = 'square';

    this.gainNode = context.createGain();

    this.oscNode.connect(this.gainNode);

    this.output = this.gainNode;
}

SynthVoice.prototype.startNote = function(time, note) {
    try {
        this.oscNode.start(time);
    } catch (e) {}

    this.oscNode.frequency.setValueAtTime(note.pitch, time);

    this.velocity = note.velocity;

    // Amp envelope: attack
    if (this.ampEnvelope.attack != 0) {
        this.gainNode.gain.setValueAtTime(0.0001, time);
        this.gainNode.gain.exponentialRampToValueAtTime(note.velocity, time + this.ampEnvelope.attack);
    } else {
        this.gainNode.gain.setValueAtTime(note.velocity, time);
    }

    // Amp evelope: decay
    this.gainNode.gain.exponentialRampToValueAtTime(
        (this.ampEnvelope.sustain * note.velocity + 0.0001),
        time + this.ampEnvelope.attack + this.ampEnvelope.decay);

    if (this.ampEnvelope.sustain == 0) {
        this.oscNode.stop(time + this.ampEnvelope.attack + this.ampEnvelope.decay);
    }
}

SynthVoice.prototype.stopNote = function(time, note) {
    this.gainNode.gain.cancelAndHoldAtTime(time);
    this.gainNode.gain.exponentialRampToValueAtTime(this.ampEnvelope.sustain * this.velocity + 0.0001, time);
    this.gainNode.gain.exponentialRampToValueAtTime(0.0001, time + this.ampEnvelope.release);
    this.oscNode.stop(time + this.ampEnvelope.release);
}

SynthVoice.prototype.shutNote = function(time) {
    this.oscNode.stop(time);
}