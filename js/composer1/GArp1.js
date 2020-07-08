'use strict';

class GArp1 {
  constructor() {
    this.pattern = this.createInitialPattern();
  }

  createInitialPattern() {
    const pattern = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    return pattern;
  }

  createEvents(events, pattern, state, startStep) {
    for (let c = 0; c < pattern.length; c++) {
      const step = pattern[c];
      if (step != -1) {
        const pitch = state.scalePitches[state.harmony[startStep + c] + step + 28];
        events.push({
          type: 'note',
          timeSteps: (c + startStep) * 256,
          data: {
            pitch: pitch,
            velocity: 1,
            durationSteps: 0
          }
        });
      }
    }
  }

  nextEvents(state) {
    const events = [];

    for (let c = 0; c < state.patternLength; c += 16) {
      for (let d = 0; d < 2; d++) {
        const step = Math.floor(Math.random() * 16);
        this.pattern[step] = this.pattern[step] == -1 ? (Math.floor(Math.random() * 3) * 2) : -1;
      }
      this.createEvents(events, this.pattern, state, c);
    }

    return events;
  }
}