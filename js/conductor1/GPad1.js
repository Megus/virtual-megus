'use strict';

class GPad1 {
  constructor() {
  }

  nextLoop(state) {
    const pitch1 = state.scalePitches[state.chord + 28];
    const pitch2 = state.scalePitches[state.chord + 28 + 2];
    const pitch3 = state.scalePitches[state.chord + 28 + 4];
    const loop = {
      steps: 16,
      events: [
        {time: 0, type: 'note', data: {pitch: pitch1, velocity: 0.2, duration: 1}},
        {time: 0, type: 'note', data: {pitch: pitch2, velocity: 0.2, duration: 1}},
        {time: 0, type: 'note', data: {pitch: pitch3, velocity: 0.2, duration: 1}},
      ],
    };

    //loop.events.sort((a, b) => a.time - b.time);
    return loop;
  }
}