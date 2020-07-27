'use strict';

const melodyPresets = [
  {
    noteLengthWeights: [5, 8, 2, 4], // 2 for 1/16, 4 for 1/8, 1 for 1/8., 3 for 1/4
    noteStepWeights: [1, 6, 4, 1, 2, 0, 0, 1],
    restLengthWeights: [1, 2, 1, 4, 1, 1, 1, 1],
    runLength: {min: 4, max: 12},
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

  isGoodPitch(state, pitch, duration, pitches, currentChord, lastInPhrase) {
    const cPitches = [0, 0, 0, 0, 0, 0, 0];
    currentChord.forEach((pitch) => cPitches[scaleStep(pitch, 7)]++);

    const pitchStep = scaleStep(pitch, 7);

    if (lastInPhrase && cPitches[pitchStep] == 0) return false;

    if (cPitches[pitchStep] == 0 && pitches[pitchStep] == 0) return false;
    if (cPitches[pitchStep] != 0) return true;

    if (duration == 1) return true;
    if (duration == 2 && pitches[pitchStep] > 0) return true;
    if (duration > 2 && duration < 4 && pitches[pitchStep] > 1) return true;
    if (duration > 4 && pitches[pitchStep] > 2) return true;

    if (pitches[pitchStep] > (duration == 1 ? -1 : 0)) return true;

    return false;
  }

  nextEvents(state) {
    const events = [];

    let step = rndRange({min: 0, max: 4}) * 2;

    const pitches = [0, 0, 0, 0, 0, 0, 0];
    // Analyze harmony
    for (let step in state.harmonyMap) {
      const chord = state.harmonyMap[step];
      chord.forEach((pitch) => pitches[scaleStep(pitch, 7)]++);
    }

    const pDist = wrndPrepare(pitches);
    let pitch = wrnd(pDist) + 28;
    let dirLength = Math.floor(rndRange(this.preset.runLength) / 2) + 1;
    let direction = rndSign();

    while (step < state.patternLength) {
      const runLength = rndRange(this.preset.runLength);

      for (let d = 0; d < runLength; d++) {
        const duration = wrnd(this.noteLengthDistribution) + 1;
        // Limit pitch range and change direction to the opposite
        if ((pitch <= 28 && direction < 0) || (pitch >= state.scalePitches.length - 28 && direction > 0)) direction *= -1;

        pitch += wrnd(this.noteStepDistribution) * direction;
        while (!this.isGoodPitch(state, pitch, duration, pitches, state.harmony[step], (d == runLength - 1) || (step + duration >= state.patternLength))) {
          pitch += direction;
        }

        events.push({
          type: 'note',
          timeSteps: step * 256,
          data: {
            pitch: state.scalePitches[pitch],
            velocity: 1,
            durationSteps: 0,
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