'use strict';

class GArp1 {
    constructor() {
        this.pattern = this.createInitialPattern();
    }

    createInitialPattern() {
        const pattern = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
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
                const pitch = state.scalePitches[state.chord + step + 28];
                loop.events.push({time: c * 256, type: 'note', data: {pitch: pitch, velocity: 0.4, duration: 0}});
            }
        }

        if (loop.events.length == 0) {
            loop.events.push({time: 0, type: 'nop', data: {}});
        }

        loop.events.sort((a, b) => a.time - b.time);
        return loop;
    }

    nextLoop(state) {
        console.log("Arp next");
        const step = Math.floor(Math.random() * 16);
        this.pattern[step] = this.pattern[step] == -1 ? (Math.floor(Math.random() * 3) * 2) : -1;
        return this.createLoop(this.pattern, state);
    }
}