// Simple bass line generator
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class GBass1 {
    constructor() {
        this.pattern = this.createInitialPattern();
    }

    createInitialPattern() {
        const pattern = [0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1, 0, -1, -1, -1];
        return pattern;
    }

    createLoop(pattern, state) {
        const loop = {
            events: [],
        }
        loop.steps = pattern.length;
        for (let c = 0; c < pattern.length; c++) {
            const step = pattern[c];
            if (step != -1) {
                const pitch = state.scalePitches[state.chord + step];
                loop.events.push({time: c * 256, type: 'noteOn', data: {pitch: pitch, velocity: 0.5}});
            }
        }

        if (loop.events.length == 0) {
            loop.events.push({time: 0, type: 'noteOff', data: {pitch: 0, velocity: 0}});
        }

        loop.events.sort((a, b) => a.time - b.time);
        return loop;
    }

    nextLoop(state) {
        const step = Math.floor(Math.random() * 16);
        this.pattern[step] = this.pattern[step] == -1 ? (Math.floor(Math.random() * 2) * 7) : -1;
        return this.createLoop(this.pattern, state);
    }
}

