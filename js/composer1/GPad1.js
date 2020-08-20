'use strict';

class GPad1 {
  constructor() {

  }

  nextEvents(state) {
    const events = [];

    for (let step in state.harmonyMap) {
      const chord = state.harmonyMap[step];
      // TODO: Find real duration
      const duration = 10;

      for (let c = 1; c < chord.steps.length; c++) {
        const pitch = state.scalePitches[chord.steps[c] + 21];
        events.push({
          timeSteps: step * 256,
          type: 'note',
          data: {
            pitch: pitch,
            velocity: 1,
            durationSteps: duration * 256
          }
        });
      }
    }

    return events;
  }
}