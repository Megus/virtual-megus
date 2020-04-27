'use strict';

class GPad1 {
  constructor() {

  }

  nextEvents(state) {
    const pitch1 = state.scalePitches[state.chord + 28];
    const pitch2 = state.scalePitches[state.chord + 28 + 2];
    const pitch3 = state.scalePitches[state.chord + 28 + 4];

    const events = [
      {timeSteps: 0, type: 'note', data: {pitch: pitch1, velocity: 1, durationSteps: 0xa00}},
      {timeSteps: 0, type: 'note', data: {pitch: pitch2, velocity: 1, durationSteps: 0xa00}},
      {timeSteps: 0, type: 'note', data: {pitch: pitch3, velocity: 1, durationSteps: 0xa00}},
    ];

    return events;
  }
}