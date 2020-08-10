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

  createEvents(events, pattern, state, startStep) {
    for (let c = 0; c < pattern.length; c++) {
      const step = pattern[c];
      if (step != -1) {
        const pitch = state.scalePitches[state.harmony[startStep + c].root + step + 7];
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
      const step = Math.floor(Math.random() * 16);
      this.pattern[step] = this.pattern[step] == -1 ? (Math.floor(Math.random() * 2) * 7) : -1;
      this.createEvents(events, this.pattern, state, c);
    }

    return events;
  }
}

