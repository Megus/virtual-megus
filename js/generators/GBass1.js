// Simple bass line generator
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class GBass1 {
    constructor(sequencer, mixer, unit) {
        this.sequencer = sequencer;
        this.mixer = mixer;
        this.unit = unit;

        this.pattern = this.createInitialPattern();
        const loop = this.createLoop(this.pattern);
        sequencer.addLoop(this.unit, loop);
    }

    createInitialPattern() {
        const pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        return pattern;
    }

    createLoop(pattern) {
        const loop = {
            events: [],
        }
        loop.steps = pattern.length;
        for (let c = 0; c < pattern.length; c++) {
            if (pattern[c] != 0) {
                loop.events.push({time: c * 256, type: 'noteOn', data: {pitch: pattern[c], velocity: 0.5}});
            }
        }

        if (loop.events.length == 0) {
            loop.events.push({time: 0, type: 'noteOff', data: {pitch: 0, velocity: 0}});
        }

        loop.events.sort((a, b) => a.time - b.time);
        return loop;
    }

    nextPattern() {
        const step = Math.floor(Math.random() * 16);
        this.pattern[step] = this.pattern[step] != 0 ? 0 : Math.floor(Math.random() * 2) * 12 + 24;
        const loop = this.createLoop(this.pattern);
        this.sequencer.addLoop(this.unit, loop);
    }
}

