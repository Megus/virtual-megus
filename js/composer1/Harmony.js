class Harmony {
  constructor(key, scale) {
    this.key = key;
    this.scale = scale;

    this.sequences = [
      [1, 5, 1, 5],
      [5, 1, 5, 1],
      [1, 5, 5, 1],
      [1, 4, 1, 4],
      [4, 1, 4, 1],
      [1, 4, 5, 1],
    ];
  }

  randomChord() {
    let chord = Math.floor(Math.random() * 7);
    if (chord == (6 - this.scale)) {
      chord += Math.floor(Math.random() * 3) + 1;
    }
    chord = chord % 7;

    return chord;
  }

  generateHarmony() {
    const sequence = this.sequences[Math.floor(Math.random() * this.sequences.length)];
    let step = 0;
    let harmony = {};

    for (let c = 0; c < sequence.length; c++) {
      let chord = sequence[c] - 1;
      let variation = (Math.floor(Math.random() * 3) - 1) * 2;

      if (chord + variation != (6 - this.scale)) {
        chord += variation;
      }

      harmony[step] = chord;
      step += 16;
    }

    //console.log(harmony);

    return harmony;
  }
}