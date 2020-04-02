// Core of music generator
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Generator {
    constructor() {
        this.mixer = new Mixer();
        this.sequencer = new Sequencer(this.mixer.context);
        this.pitchTable = createPitchTable(440.0);
    }

    async start() {
        const bass = new MonoSynth(this.mixer.context, this.pitchTable, synthPresets['bass']);
        const synth = new PolySynth(this.mixer.context, this.pitchTable, synthPresets['pad']);
        const drums = new DrumMachine(this.mixer.context);

        this.mixer.addChannel(bass);
        this.mixer.addChannel(synth);
        this.mixer.addChannel(drums);

        const kitInfo = [
            ['samples/808/808-bass-drum.mp3'], // 0
            ['samples/808/808-clap.mp3'], // 1
            ['samples/808/808-rim-shot.mp3'], // 2
            ['samples/808/808-snare.mp3'], // 3
            ['samples/808/808-closed-hat.mp3'], // 4
            ['samples/808/808-open-hat.mp3'], // 5
            ['samples/808/808-clave.mp3'], // 6
            ['samples/808/808-cymbal.mp3'], // 7
        ];

        await drums.loadKit(kitInfo);

        this.sequencer.setBPM(120);

        this.generators = {
            [drums.id]: new GDrums1(this.sequencer, this.mixer, drums),
            [bass.id]: new GBass1(this.sequencer, this.mixer, bass),
        };

        this.sequencer.onPatternStart = (unitId) => {
            this.generators[unitId].nextPattern();
        };

        this.sequencer.play();
    }
}
