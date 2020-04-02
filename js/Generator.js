// Core of music generator
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Generator {
    constructor() {
        this.mixer = new Mixer();
        this.pitchTable = createPitchTable(440.0);
    }

    async setupEnsemble() {
        this.bass = new MonoSynth(this.mixer.context, this.pitchTable, synthPresets['bass']);
        this.synth = new PolySynth(this.mixer.context, this.pitchTable, synthPresets['pad']);
        this.drums = new DrumMachine(this.mixer.context);

        this.mixer.addChannel(this.bass);
        this.mixer.addChannel(this.synth);
        this.mixer.addChannel(this.drums);

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

        await this.drums.loadKit(kitInfo);
    }

    async play() {
        if (this.sequencer == null) {
            this.sequencer = new Sequencer(this.mixer.context);
            this.sequencer.setBPM(120);
            this.sequencer.onPatternStart = (unitId) => {
                this.generators[unitId].nextPattern();
            };
            await this.setupEnsemble();
        }

        this.generators = {
            [this.drums.id]: new GDrums1(this.sequencer, this.mixer, this.drums),
            [this.bass.id]: new GBass1(this.sequencer, this.mixer, this.bass),
        };

        this.sequencer.play();
    }

    stop() {
        this.sequencer.stop();
    }
}
