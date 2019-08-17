'use strict';

function Generator() {
    this.mixer = new Mixer();
    this.pitchTable = createPitchTable(440.0);
}

Generator.prototype.start = function() {
    const synth = new MonoSynth(this.mixer.context, this.pitchTable);
    const sequencer = new Sequencer(this.mixer.context);
    const channel = this.mixer.addChannel(synth);

    sequencer.setBPM(20);

    const loop = {
        steps: 8,
        events: [
            {time: 0x0, type: 'noteOn', data: {pitch: 48, velocity: 1}},
            //{time: 0x100, type: 'noteOff', data: {pitch: 48}},
            {time: 0x100, type: 'noteOn', data: {pitch: 55, velocity: 1}},
            {time: 0x200, type: 'noteOff', data: {pitch: 55}},
            {time: 0x200, type: 'noteOn', data: {pitch: 60, velocity: 1}},
            {time: 0x300, type: 'noteOff', data: {pitch: 60}},
            {time: 0x400, type: 'noteOn', data: {pitch: 51, velocity: 1}},
            {time: 0x480, type: 'noteOff', data: {pitch: 51}},
        ],
    };

    sequencer.addLoop(synth, loop);
    sequencer.start();
}