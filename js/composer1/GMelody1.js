'use strict';

const melodyPresets = [
  {
    noteLengthWeights: [5, 8, 2, 4], // 2 for 1/16, 4 for 1/8, 1 for 1/8., 3 for 1/4
    noteStepWeights: [1, 6, 4, 1, 2, 0, 0, 1],
    restLengthWeights: [1, 2, 1, 4, 1, 1, 1, 1],
    runLength: {min: 4, max: 12},
    setNoteLengths: true,
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

  isGoodPitch(state, step, pitch, duration, currentChord, lastInPhrase) {
    const cPitches = [0, 0, 0, 0, 0, 0, 0];
    const root = scaleStep(currentChord[1], 7);
    cPitches[root] = 2;
    cPitches[scaleStep(root + 2, 7)] = 2;
    cPitches[scaleStep(root + 4, 7)] = 2;
    cPitches[scaleStep(root + 6, 7)] = 1;
    cPitches[scaleStep(root + 8, 7)] = 1;

    const pitchStep = scaleStep(pitch, 7);

    if (lastInPhrase && cPitches[pitchStep] < 2) return false;
    if (cPitches[pitchStep] != 0) return true;
    if (duration == 1 && (step % 2 == 1)) return true;

    return false;
  }

  nextEvents(state) {
    const events = [];

    let step = rndRange({min: 0, max: 4}) * 2;

    let pitch = rndRange({min: 28, max: 35});
    let dirLength = Math.floor(rndRange(this.preset.runLength) / 2) + 1;
    let direction = rndSign();

    while (step < state.patternLength) {
      const runLength = rndRange(this.preset.runLength);

      for (let d = 0; d < runLength; d++) {
        const duration = wrnd(this.noteLengthDistribution) + 1;
        // Limit pitch range and change direction to the opposite
        if ((pitch <= 28 && direction < 0) || (pitch >= state.scalePitches.length - 28 && direction > 0)) direction *= -1;

        pitch += wrnd(this.noteStepDistribution) * direction;
        while (!this.isGoodPitch(state, step, pitch, duration, state.harmony[step], (d == runLength - 1) || (step + duration >= state.patternLength))) {
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

        step += duration;
        if (step >= state.patternLength) break;
      }

      step += wrnd(this.restLengthDistribution) + 1;
      if (step % 2 == 1) step++;
    }

    return events;
  }
}