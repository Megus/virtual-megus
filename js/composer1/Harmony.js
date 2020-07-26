class Harmony {
  constructor(key, scale) {
    this.key = key;
    this.scale = scale;

    this.sequences = [
      {0: 1, 16: 5, 32: 1, 48: 5},
      {0: 5, 16: 1, 32: 5, 48: 1},
      {0: 1, 16: 5, 32: 5, 48: 1},
      {0: 1, 16: 4, 32: 1, 48: 4},
      {0: 4, 16: 1, 32: 4, 48: 1},
      {0: 1, 16: 4, 32: 5, 48: 1},
    ];
  }

  generateHarmony() {
    const sequence = this.sequences[Math.floor(Math.random() * this.sequences.length)];
    let harmony = {};

    for (let step in sequence) {
      let chord = sequence[step] - 1;
      let variation = (Math.floor(Math.random() * 3) - 1) * 2;

      if (chord + variation != (6 - this.scale)) {
        chord += variation;
      }

      harmony[step] = [chord, chord + 2, chord + 4];
    }

    return harmony;
  }
}