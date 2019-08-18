'use strict';

function Generator() {
    this.mixer = new Mixer();
    this.pitchTable = createPitchTable(440.0);
}

Generator.prototype.start = async function() {
    const synth = new MonoSynth(this.mixer.context, this.pitchTable);
    const drums = new DrumMachine(this.mixer.context);
    const sequencer = new Sequencer(this.mixer.context);
    this.mixer.addChannel(synth);
    this.mixer.addChannel(drums);

    const kitInfo = [
        ['/samples/808/808-bass-drum.mp3'], // 0
        ['/samples/808/808-clap.mp3'], // 1
        ['/samples/808/808-rim-shot.mp3'], // 2
        ['/samples/808/808-snare.mp3'], // 3
        ['/samples/808/808-closed-hat.mp3'], // 4
        ['/samples/808/808-open-hat.mp3'], // 5
        ['/samples/808/808-clave.mp3'], // 6
        ['/samples/808/808-cymbal.mp3'], // 7
    ];

    await drums.loadKit(kitInfo);

    sequencer.setBPM(103);

    const synthLoop = {
        steps: 8,
        events: [
            {time: 0x0, type: 'noteOn', data: {pitch: 48, velocity: 1}},
            {time: 0x100, type: 'noteOff', data: {pitch: 48}},
            {time: 0x100, type: 'noteOn', data: {pitch: 55, velocity: 0.5}},
            {time: 0x200, type: 'noteOff', data: {pitch: 55}},
            {time: 0x200, type: 'noteOn', data: {pitch: 60, velocity: 1}},
            {time: 0x300, type: 'noteOff', data: {pitch: 60}},
            {time: 0x400, type: 'noteOn', data: {pitch: 51, velocity: 0.7}},
            {time: 0x480, type: 'noteOff', data: {pitch: 51}},
        ],
    };

    const drumLoop = {
        steps: 8,
        events: [
            {time: 0x0, type: 'noteOn', data: {pitch: 0, velocity: 1}},
            {time: 0x0, type: 'noteOn', data: {pitch: 48, velocity: 1}},
            {time: 0x100, type: 'noteOn', data: {pitch: 48, velocity: 1}},
            {time: 0x200, type: 'noteOn', data: {pitch: 48, velocity: 1}},
            {time: 0x300, type: 'noteOn', data: {pitch: 48, velocity: 1}},
            {time: 0x400, type: 'noteOn', data: {pitch: 0, velocity: 1}},
            {time: 0x400, type: 'noteOn', data: {pitch: 12, velocity: 1}},
            {time: 0x400, type: 'noteOn', data: {pitch: 48, velocity: 1}},
            {time: 0x500, type: 'noteOn', data: {pitch: 48, velocity: 1}},
            {time: 0x600, type: 'noteOn', data: {pitch: 48, velocity: 1}},
            {time: 0x700, type: 'noteOn', data: {pitch: 48, velocity: 1}},
            {time: 0x700, type: 'noteOn', data: {pitch: 36, velocity: 1}},
        ],
    };

    sequencer.addLoop(synth, synthLoop);
    sequencer.addLoop(drums, drumLoop);
    sequencer.start();
}