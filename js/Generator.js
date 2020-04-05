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

    async play() {
        if (this.sequencer == null) {
            this.sequencer = new Sequencer(this.mixer.context);
        }

        this.conductor = new Conductor1(this.mixer, this.sequencer, this.pitchTable);
        await this.conductor.setupEnsemble();
        this.conductor.play();
    }

    stop() {
        this.conductor.stop();
    }
}
