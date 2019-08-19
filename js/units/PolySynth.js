let _polySynthId = 0;

function PolySynth(context, pitchTable, preset) {
    this.id = 'PolySynth' + (_polySynthId++);

    this.pitchTable = pitchTable;
    this.context = context;
    this.voicePreset = preset;

    this.gain = 1;
    this.voices = {};

    this.gainNode = context.createGain();
    this.gainNode.gain.value = this.gain;

    this.output = this.gainNode;
}

PolySynth.prototype.startNote = function(time, note) {
    const voice = new SubSynthVoice(this.context, this.voicePreset, this.pitchTable, this.onVoiceStop.bind(this));
    this.stopNote(time, note);
    this.voices[note.pitch] = voice;
    voice.output.connect(this.gainNode);
    voice.startNote(time, note);

}

PolySynth.prototype.stopNote = function(time, note) {
    if (this.voices[note.pitch] != null) {
        this.voices[note.pitch].stopNote(time);
    }
}

PolySynth.prototype.onVoiceStop = function(voice) {
    for (let pitch in this.voices) {
        if (this.voices[pitch] === voice) {
            this.voices[pitch] = null;
            break;
        }
    }
}