'use strict';

class GArp1 {
  constructor() {
    this.pattern = this.createInitialPattern();
  }

  createInitialPattern() {
    const pattern = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    return pattern;
  }

  createEvents(pattern, state) {
    const events = [];
    for (let c = 0; c < 16; c++) {
      const step = pattern[c];
      if (step != -1) {
        const pitch = state.scalePitches[state.chord + step + 28];
        events.push({
          type: 'note',
          timeSteps: c * 256,
          data: {
            pitch: pitch,
            velocity: 0.4,
            durationSteps: 0
          }
        });
      }
    }

    return events;
  }

  nextEvents(state) {
    const step = Math.floor(Math.random() * 16);
    this.pattern[step] = this.pattern[step] == -1 ? (Math.floor(Math.random() * 3) * 2) : -1;
    return this.createEvents(this.pattern, state);
  }
}