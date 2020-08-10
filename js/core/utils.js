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
  * @param {number} key
  * @param {number} scale
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


/**
 * Prepare array for weighted random numbers
 */
function wrndPrepare(weights) {
  // TODO: Add support not only for weight arrays, but also for weight maps
  const distribution = [];
  for (let c = 0; c < weights.length; c++) {
    for (let d = 0; d < weights[c]; d++) {
      distribution.push(c);
    }
  }
  return distribution;
}

/**
 * Weighted random
 *
 * @param {Array} distribution
 */
function wrnd(distribution) {
  return distribution[Math.floor(Math.random() * distribution.length)];
}

function rnd() {
  return Math.random();
}

function rndRange(range) {
  return Math.floor(Math.random() * (1 + range.max - range.min) + range.min);
}

function rndSign() {
  return (Math.random() < 0.5) ? -1 : 1;
}

function scaleStep(pitch, scaleLength) {
  let step = pitch % scaleLength;
  if (step < 0) step += scaleLength;
  return step;
}