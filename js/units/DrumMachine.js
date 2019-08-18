let _drumMachineId = 0;

function DrumMachine(context) {
    this.id = 'DrumMachine' + (_drumMachineId++);

    this.context = context;
    this.kit = [];
    this.settings = {
        gain: 1,
    };

    this.gainNode = context.createGain();
    this.gainNode.gain.value = this.settings.gain;

    this.output = this.gainNode;
}

DrumMachine.prototype.loadKit = async function(kitInfo) {
    this.kit = [];
    for (let c = 0; c < kitInfo.length; c++) {
        const sampleSet = kitInfo[c];
        let instrument = [];
        for (let d = 0; d < sampleSet.length; d++) {
            const response = await fetch(sampleSet[d]);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            instrument.push(audioBuffer);
        }
        this.kit.push(instrument);
    }
}

DrumMachine.prototype.startNote = function(time, note) {
    const pitch = note.pitch;
    const instrumentIdx = Math.floor(pitch / 12);
    const sampleIdx = pitch % 12;

    if (instrumentIdx >= this.kit.length || sampleIdx >= this.kit[instrumentIdx].length) {
        return
    }

    const sampleNode = this.context.createBufferSource();
    const ampNode = this.context.createGain();

    ampNode.gain.value = 1;//note.velocity;

    sampleNode.buffer = this.kit[instrumentIdx][sampleIdx];

    sampleNode.connect(ampNode);
    ampNode.connect(this.gainNode);
    sampleNode.start(time);    
}

DrumMachine.prototype.stopNote = function(time, note) {

}