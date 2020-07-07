'use strict';

class GPad1 {
  constructor() {

  }

  addChord(events, state, chord, chordStep, chordDuration) {
    const pitch1 = state.scalePitches[chord + 28];
    const pitch2 = state.scalePitches[chord + 28 + 2];
    const pitch3 = state.scalePitches[chord + 28 + 4];
    const duration = Math.max(chordDuration - 6, 1);

    events.push({timeSteps: chordStep * 256, type: 'note', data: {pitch: pitch1, velocity: 1, durationSteps: duration * 256}});
    events.push({timeSteps: chordStep * 256, type: 'note', data: {pitch: pitch2, velocity: 1, durationSteps: duration * 256}});
    events.push({timeSteps: chordStep * 256, type: 'note', data: {pitch: pitch3, velocity: 1, durationSteps: duration * 256}});
  }

  nextEvents(state) {
    const events = [];

    let chord = null;
    let chordStep = null;
    for (let c = 0; c < state.harmony.length; c++) {
      if (state.harmony[c] != chord) {
        if (chord != null) {
          this.addChord(events, state, chord, chordStep, c - chordStep);
        }
        chordStep = c;
        chord = state.harmony[c];
      }
    }
    this.addChord(events, state, chord, chordStep, state.harmony.length - chordStep);

    return events;
  }
}