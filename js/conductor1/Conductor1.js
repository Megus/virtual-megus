// Simple conductor
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Conductor1 extends Conductor {
    constructor(mixer, sequencer, pitchTable) {
        super(mixer, sequencer, pitchTable);
        this.generators = {};
        this.generatorConstructors = {};
        this.units = {};
    }

    addUnit(unit, generatorConstructor) {
        this.mixer.addChannel(unit);
        this.units[unit.id] = unit;
        this.generatorConstructors[unit.id] = generatorConstructor;
    }

    async setupEnsemble() {
        const drums = new DrumMachine(this.mixer.context);

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

        this.addUnit(drums, GDrums1);
        this.addUnit(new MonoSynth(this.mixer.context, this.pitchTable, synthPresets["bass"]), GBass1);
        this.addUnit(new PolySynth(this.mixer.context, this.pitchTable, synthPresets["pad"]), GPad1);
        this.addUnit(new PolySynth(this.mixer.context, this.pitchTable, synthPresets["arp"]), GArp1);
    }

    play() {
        for (const unitId in this.units) {
            this.generators[unitId] = new this.generatorConstructors[unitId];
        }

        this.patternStep = 0;

        // Prepare sequencer
        this.sequencer.setBPM(120);
        this.sequencer.onPatternStart = (unitId) => {
            if (this.sequencer.step >= this.patternStep) {
                this.patternStep += 16;
                console.log(this.patternStep);
                this.nextState();
            }

            const newLoop = this.generators[unitId].nextLoop(this.state);
            this.sequencer.addLoop(this.units[unitId], newLoop);
        };

        // Add first loops
        this.initState();

        for (const unitId in this.units) {
            this.sequencer.addLoop(this.units[unitId], this.generators[unitId].nextLoop(this.state));
        }

        this.sequencer.play();
    }

    stop() {
        this.sequencer.stop();
    }

    initState() {
        this.state = {
            key: 0,     // C
            scale: 5,   // Minor
            chord: 0,   // Starting with root/tonic
        };
        this.state.scalePitches = this.generateDiatonicScalePitches(this.state.key, this.state.scale);
    }

    nextState() {
        let newChord = Math.floor(Math.random() * 6);
        if (newChord == (13 - this.state.scale) % 7) {
            newChord++;
        }
        this.state.chord = newChord;
    }
}