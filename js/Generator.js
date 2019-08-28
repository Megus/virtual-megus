'use strict';

function Generator() {
    this.mixer = new Mixer();
    this.sequencer = new Sequencer(this.mixer.context);
    this.pitchTable = createPitchTable(440.0);
}

Generator.prototype.start = async function() {
    const bass = new MonoSynth(this.mixer.context, this.pitchTable, synthPresets['bass']);
    const synth = new PolySynth(this.mixer.context, this.pitchTable, synthPresets['pad']);
    const drums = new DrumMachine(this.mixer.context);

    this.mixer.addChannel(bass);
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

    const bassLoop = {
        steps: 8,
        events: [
            {time: 0x0, type: 'noteOn', data: {pitch: 24, velocity: 0.7}},
            {time: 0x100, type: 'noteOn', data: {pitch: 36, velocity: 0.7}},
            {time: 0x200, type: 'noteOn', data: {pitch: 24, velocity: 0.7}},
            {time: 0x300, type: 'noteOn', data: {pitch: 24, velocity: 0.7}},
            {time: 0x400, type: 'noteOn', data: {pitch: 36, velocity: 0.7}},
            {time: 0x500, type: 'noteOn', data: {pitch: 24, velocity: 0.7}},
            {time: 0x600, type: 'noteOn', data: {pitch: 24, velocity: 0.7}},
            {time: 0x700, type: 'noteOn', data: {pitch: 36, velocity: 0.7}},
        ],
    };

    const synthLoop = {
        steps: 16,
        events: [
            {time: 0x700, type: 'noteOn', data: {pitch: 48, velocity: 0.7}},
            {time: 0x700, type: 'noteOn', data: {pitch: 51, velocity: 0.7}},
            {time: 0x700, type: 'noteOn', data: {pitch: 55, velocity: 0.7}},
            {time: 0x700, type: 'noteOn', data: {pitch: 58, velocity: 0.7}},
        ],
    };

    const drumLoop = {
        steps: 8,
        events: [
            {time: 0x0, type: 'noteOn', data: {pitch: 0, velocity: 1}},
            {time: 0x0, type: 'noteOn', data: {pitch: 48, velocity: 1}},
            {time: 0x100, type: 'noteOn', data: {pitch: 48, velocity: 0.7}},
            {time: 0x200, type: 'noteOn', data: {pitch: 48, velocity: 1}},
            {time: 0x300, type: 'noteOn', data: {pitch: 48, velocity: 0.7}},
            {time: 0x400, type: 'noteOn', data: {pitch: 0, velocity: 1}},
            {time: 0x400, type: 'noteOn', data: {pitch: 12, velocity: 1}},
            {time: 0x400, type: 'noteOn', data: {pitch: 48, velocity: 1}},
            {time: 0x500, type: 'noteOn', data: {pitch: 48, velocity: 0.7}},
            {time: 0x600, type: 'noteOn', data: {pitch: 60, velocity: 0.5}},
            {time: 0x700, type: 'noteOn', data: {pitch: 48, velocity: 0.7}},
            {time: 0x700, type: 'noteOn', data: {pitch: 36, velocity: 1}},
        ],
    };

    this.sequencer.setBPM(100);
    //this.sequencer.addLoop(bass, bassLoop);
    //this.sequencer.addLoop(synth, synthLoop);
    //this.sequencer.addLoop(drums, drumLoop);

    this.generators = {
        [drums.id]: new GDrums1(this.sequencer, this.mixer, drums),
        [bass.id]: new GBass1(this.sequencer, this.mixer, bass),
    };

    this.sequencer.onPatternStart = (unitId) => {
        this.generators[unitId].nextPattern();
    };

    this.sequencer.start();
}