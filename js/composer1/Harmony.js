class Harmony {
  constructor(key, scale) {
    this.key = key;
    this.scale = scale;

    this.sequences = [
      {0: 1, 16: 5, 32: 1, 48: 5},
      {0: 1, 16: 4, 32: 1, 48: 4},
      {0: 1, 16: 4, 32: 5, 48: 1},
      {0: 4, 16: 1, 32: 4, 48: 1},
      {0: 4, 16: 5, 32: 1, 48: 1},
      {0: 4, 16: 5, 32: 1, 48: 5},
      {0: 5, 16: 1, 32: 5, 48: 1},
    ];
  }

  generateHarmony() {
    const sequence = this.sequences[Math.floor(Math.random() * this.sequences.length)];
    let harmony = {};
    let oldChord = -1;

    for (let step = 0; step < 64; step++) {
      if (sequence[step] == null) continue;
      let func = sequence[step] - 1;
      let chord = func;

      let variation = rndRange({min: -1, max: 1}) * 2;

      if (chord + variation != (6 - this.scale)) {
        chord += variation;
      } else {
        variation = 0;
      }

      /*if ((step % 32 == 0) && chord == oldChord) {
        chord -= variation * 2;
      }*/

      harmony[step] = {
        root: chord,
        func: func,
        steps: [chord, chord + 2, chord + 4],
      }

      // 7th
      if (chord != 6 && chord != 2 && Math.random() > 0.5) {
        harmony[step].steps.push(chord + 6);
      }

      oldChord = chord;
    }

    return harmony;
  }
}