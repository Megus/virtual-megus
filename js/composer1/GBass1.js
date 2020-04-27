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

  createEvents(pattern, state) {
    const events = [];
    for (let c = 0; c < pattern.length; c++) {
      const step = pattern[c];
      if (step != -1) {
        const pitch = state.scalePitches[state.chord + step + 7];
        events.push({
          type: 'note',
          timeSteps: c * 256,
          data: {
            pitch: pitch,
            velocity: 1,
            durationSteps: 0
          }
        });
      }
    }

    return events;
  }

  nextEvents(state) {
    const step = Math.floor(Math.random() * 16);
    this.pattern[step] = this.pattern[step] == -1 ? (Math.floor(Math.random() * 2) * 7) : -1;
    return this.createEvents(this.pattern, state);
  }
}

