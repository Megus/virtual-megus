// Some synth presets
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

const drumKits = {
  'tr808': [
    ['808-bass-drum.mp3'], // 0
    ['808-clap.mp3'], // 1
    ['808-rim-shot.mp3'], // 2
    ['808-snare.mp3'], // 3
    ['808-closed-hat.mp3'], // 4
    ['808-open-hat.mp3'], // 5
    ['808-clave.mp3'], // 6
    ['808-cymbal.mp3'], // 7
  ],
}

const synthPresets = {
  // Basses
  'bass': {
    ampEnvelope: {attack: 0, decay: 0.4, sustain: 0, release: 0},
    filterEnvelope: {attack: 0, decay: 0.2, sustain: 0, release: 0},
    filter: {cutoff: 300, resonance: 1, envelopeLevel: 500, type: 'lowpass'},
    osc: [
      {type: 'sawtooth', pitch: 0, detune: 0, level: 0.5},
      {type: 'sawtooth', pitch: 12, detune: 10, level: 0.5},
    ],
  },

  // Stabs
  'stab': {
    ampEnvelope: {attack: 0, decay: 1.5, sustain: 0, release: 0},
    filterEnvelope: {attack: 0, decay: 1, sustain: 0, release: 0},
    filter: {cutoff: 4000, resonance: 1, envelopeLevel: 1000, type: 'lowpass'},
    osc: [
      {type: 'sawtooth', pitch: 0, detune: 0, level: 0.33},
      {type: 'sawtooth', pitch: 0, detune: -15, level: 0.33},
      {type: 'sawtooth', pitch: 0, detune: 15, level: 0.33},
    ]
  },

  // Arpeggios
  'arp': {
    ampEnvelope: {attack: 0, decay: 0.2, sustain: 0.2, release: 0.5},
    filterEnvelope: {attack: 0.1, decay: 0.3, sustain: 0, release: 0},
    filter: {cutoff: 800, resonance: 2, envelopeLevel: 1200, type: 'lowpass'},
    panning: {pan: 0.2, centerPitch: 48, spread: -0.03},
    osc: [
      {type: 'square', pitch: 0, detune: 0, level: 0.33},
      {type: 'square', pitch: 0, detune: -10, level: 0.23},
      {type: 'square', pitch: 0, detune: 10, level: 0.23},
      {type: 'square', pitch: 12, detune: 0, level: 0.2},
    ]
  },

  // Pad
  'pad': {
    ampEnvelope: {attack: 0.7, decay: 2, sustain: 0.8, release: 2},
    filterEnvelope: {attack: 0.5, decay: 2, sustain: 0.4, release: 2},
    filter: {cutoff: 3000, resonance: 1, envelopeLevel: 500, type: 'lowpass'},
    panning: {pan: -0.2, centerPitch: 48, spread: 0.03},
    osc: [
      {type: 'sawtooth', pitch: 0, detune: 0, level: 0.33},
      {type: 'sawtooth', pitch: 0, detune: -15, level: 0.33},
      {type: 'sawtooth', pitch: 0, detune: 15, level: 0.33},
    ]
  },

  // Leads
  'lead1': {
    ampEnvelope: {attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.3},
    filterEnvelope: {attack: 0.01, decay: 0.5, sustain: 0, release: 0},
    filter: {cutoff: 6000, resonance: 2, envelopeLevel: 3000, type: 'lowpass'},
    osc: [
      {type: 'sawtooth', pitch: 0, detune: 0, level: 0.23},
      {type: 'sawtooth', pitch: 0, detune: -5, level: 0.23},
      {type: 'square', pitch: 19, detune: -10, level: 0.07},
      {type: 'square', pitch: 19, detune: 10, level: 0.07},
      {type: 'sawtooth', pitch: 12, detune: 0, level: 0.23},
      {type: 'sawtooth', pitch: 12, detune: 5, level: 0.23},
    ]
  },
  'lead2': {
    ampEnvelope: {attack: 0.0, decay: 0.15, sustain: 0.3, release: 0.3},
    filterEnvelope: {attack: 0.01, decay: 0.5, sustain: 0, release: 0},
    filter: {cutoff: 5000, resonance: 2, envelopeLevel: 3000, type: 'lowpass'},
    osc: [
      {type: 'square', pitch: 0, detune: 0, level: 0.33},
      {type: 'sawtooth', pitch: 0, detune: -10, level: 0.23},
      {type: 'square', pitch: -12, detune: 0, level: 0.13},
      {type: 'square', pitch: -12, detune: 10, level: 0.13},
    ]
  },

}