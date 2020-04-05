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
        const pattern = [24,0,0,0,24,0,0,0,24,0,0,0,24,0,0,0];
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

    nextLoop() {
        const step = Math.floor(Math.random() * 16);
        this.pattern[step] = this.pattern[step] != 0 ? 0 : Math.floor(Math.random() * 2) * 12 + 24;
        return this.createLoop(this.pattern);
    }
}

