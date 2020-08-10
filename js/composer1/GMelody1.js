'use strict';

const melodyPresets = [
  {
    noteLengthWeights: [5, 8, 2, 4], // 2 for 1/16, 4 for 1/8, 1 for 1/8., 3 for 1/4
    noteStepWeights: [1, 6, 4, 1, 2, 0, 0, 1],
    restLengthWeights: [1, 2, 1, 4, 1, 1, 1, 1],
    runLength: {min: 4, max: 12},
    setNoteLengths: true,
  },
  {
    noteLengthWeights: [0, 2, 0, 4, 0, 2, 0, 5], // 2 for 1/16, 4 for 1/8, 1 for 1/8., 3 for 1/4
    noteStepWeights: [3, 5, 2, 1],
    restLengthWeights: [0, 2, 0, 4],
    runLength: {min: 4, max: 8},
    setNoteLengths: false,
  }
];

class GMelody1 {
  constructor() {
    this.preset = null;
    this.prepareForPreset(melodyPresets[0]);
  }

  prepareForPreset(preset) {
    if (preset == this.preset) return;
    this.preset = preset;

    this.noteLengthDistribution = wrndPrepare(preset.noteLengthWeights);
    this.restLengthDistribution = wrndPrepare(preset.restLengthWeights);
    this.noteStepDistribution = wrndPrepare(preset.noteStepWeights);
  }

  nextEvents(state) {
    const events = [];

    let step = rndRange({min: 0, max: 2}) * 4;

    let pitch = rndRange({min: 28, max: 35});
    let dirLength = Math.floor(rndRange(this.preset.runLength) / 2) + 1;
    let direction = rndSign();

    let lastPitch = 0;
    let lastStep = 0;

    while (step < state.patternLength) {
      const runLength = rndRange(this.preset.runLength);

      for (let d = 0; d < runLength; d++) {
        const duration = Math.min(wrnd(this.noteLengthDistribution) + 1, state.patternLength - step);
        // Limit pitch range and change direction to the opposite
        if ((pitch <= 28 && direction < 0) || (pitch >= state.scalePitches.length - 28 && direction > 0)) direction *= -1;

        pitch += wrnd(this.noteStepDistribution) * direction;

        // Finding a good pitch is good
        const stepStrength = (step % 4 == 0) ? 4 : (step % 2 == 0) ? 2 : 1;
        const lastInPhrase = (d == runLength - 1) || (step + duration >= state.patternLength);

        while (1) {
          const chord = state.harmony[step];
          const cPitches = [1, 1, 1, 1, 1, 1, 1];
          const root = scaleStep(chord.root, 7);

          // Up to 5 notes from the chord root
          for (let c = 0; c < 5; c++) {
            cPitches[scaleStep(root + c * 2, 7)] = 2;
          }

          // Chord notes
          for (let c = 0; c < chord.steps.length; c++) {
            cPitches[scaleStep(chord.steps[c], 7)] = 4;
          }
          cPitches[0] = 4; // Tonic is always good

          const pitchStep = scaleStep(pitch, 7);
          const lastPitchStep = scaleStep(lastPitch, 7);

          if (cPitches[lastPitchStep] < 4) {
            // Last pitch was a non-chord note
            if (cPitches[pitchStep] == 4) break;
          } else {
            // Last pitch was a chord note
            if (lastInPhrase && cPitches[pitchStep] == 4) break;
            if (cPitches[pitchStep] >= stepStrength) break;
          }

          // Continue to search in the same direction
          pitch += direction;
        }

        events.push({
          type: 'note',
          timeSteps: step * 256,
          data: {
            pitch: state.scalePitches[pitch],
            velocity: 1,
            durationSteps: this.preset.setNoteLengths ? duration * 256 : 0,
          }
        });

        dirLength--;
        if (dirLength <= 0) {
          dirLength = Math.floor(rndRange(this.preset.runLength) / 2) + 1;
          direction = rndSign();
        }


        lastPitch = pitch;
        lastStep = step;

        step += duration;
        if (step >= state.patternLength) break;
      }

      step += wrnd(this.restLengthDistribution) + 1;
      if (step % 2 == 1) step++;
    }

    return events;
  }
}