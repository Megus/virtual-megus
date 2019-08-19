let _monoSynthId = 0;

function MonoSynth(context, pitchTable, preset) {
    this.id = 'MonoSynth' + (_monoSynthId++);

    this.pitchTable = pitchTable;
    this.context = context;
    this.voicePreset = preset;

    this.gain = 1;
    this.voices = [];

    this.gainNode = context.createGain();
    this.gainNode.gain.value = this.gain;

    this.output = this.gainNode;
}

// Note: {pitch: ..., velocity: ...}
MonoSynth.prototype.startNote = function(time, note) {
    this.shutNote(time);
    const voice = new SubSynthVoice(this.context, this.voicePreset, this.pitchTable, this.onVoiceStop.bind(this));
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
