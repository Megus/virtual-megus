'use strict';

class GMelody1 {
  constructor() {
    this.pentatonic = null;
  }

  minorPentatonic(pitches, key) {
    const pentatonic = [];

    for (let c = 0; c < pitches.length; c++) {
      const step = c % 7;
      if (step != 1 && step != 5) {
        pentatonic.push(pitches[c]);
      }
    }

    return pentatonic;
  }

  nextEvents(state) {
    const pattern = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

    if (this.pentatonic == null) {
      this.pentatonic = this.minorPentatonic(state.scalePitches, state.key);
    }

    const runs = Math.floor(Math.random() * 4) + 1
    let step = Math.floor(Math.random() * 4) * 2;
    let pitch = 20 + Math.floor(Math.random() * 10);

    for (let c = 0; c < runs; c++) {
      const runLength = Math.floor(Math.random() * 4) + 1;

      for (let d = 0; d < runLength; d++) {
        const blueNote = (pitch % 5 != 2) ? 0 : (d != (runLength - 1) && Math.random() > 0.8 ? 1 : 0);
        pattern[step] = this.pentatonic[pitch] + blueNote;

        pitch += Math.floor(Math.random() * 7) - 3;
        if (pitch < 20) { pitch += Math.floor(Math.random() * 4)};
        if (pitch >= this.pentatonic.length - 15) { pitch -= Math.floor(Math.random() * 4)};

        if (Math.random() > 0.5) step++;
        step++;

        if (step == 16) break;
      }
      if (step == 16) break;
    }

    const events = [];
    for (let c = 0; c < pattern.length; c++) {
      const step = pattern[c];
      if (step != -1) {
        events.push({
          type: 'note',
          timeSteps: c * 256,
          data: {
            pitch: step,
            velocity: 1,
            durationSteps: 0
          }
        });
      }
    }

    return events;
  }
}