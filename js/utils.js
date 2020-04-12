// Equal-tempered pitch table generator function
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

/**
 * Create 12-TET pitch table
 *
 * @param {double} A4Freq
 */
function create12TETPitchTable(A4Freq) {
  let table = [];
  for (let c = 0; c < 9 * 12; c++) {
    table.push(0);
  }

  table[4 * 12 + 9] = A4Freq;
  let i = 4 * 12 + 10;
  while (i < 9 * 12) {
    if (i % 12 == 9) {
      table[i] = table[i - 12] * 2;
    } else {
      table[i] = table[i - 1] * Math.pow(2, 1 / 12);
    }
    i++;
  }

  i = 4 * 12 + 8;
  while (i >= 0) {
    if (i % 12 == 2) {
      table[i] = table[i + 12] / 2;
    } else {
      table[i] = table[i + 1] / Math.pow(2, 1 / 12);
    }
    i--;
  }

  return table;
}



  /**
  * Creates a list of any diatonic scale pitches
  *
  * @param {int} key
  * @param {int} scale
  */
 function diatonicScalePitches(key, scale, pitchTable) {
  const diatonic = [0, 2, 4, 5, 7, 9, 11];
  const pitches = [];
  let idx = scale;
  let pitch = key;

  while (pitch < pitchTable.length) {
    pitches.push(pitch);
    const oldStep = diatonic[idx];
    idx = (idx + 1) % 7;
    const newStep = diatonic[idx];
    let diff = newStep - oldStep;
    if (diff < 0) diff += 12;
    pitch += diff;
  }

  return pitches;
}