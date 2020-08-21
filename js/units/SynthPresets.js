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
  "bass1": {
    tags: ["bass"],
    range: [12, 48],
    cc: [0],
    env: [
      {attack: 0, decay: 0.4, sustain: 0, release: 0},  // amp
      {attack: 0, decay: 0.2, sustain: 0, release: 0},  // filter
    ],
    osc: [
      {type: 'sawtooth', pitch: 0, detune: 0, level: 0.5},
      {type: 'sawtooth', pitch: 12, detune: 10, level: 0.5},
    ],
    filter: {cutoff: 300, resonance: 1, type: 'lowpass'},
    mod: [
      {src: ["env", 0], amount: 1, control: ["vel"], dst: ["output"]},
      {src: ['env', 1], amount: 500, dst: ["filter", "cutoff"]},
    ],
  },

  // Stabs
  "stab1": {
    tags: ["stab"],
    range: [24, 80],
    cc: [0],
    env: [
      {attack: 0, decay: 1.5, sustain: 0, release: 0},
      {attack: 0, decay: 1, sustain: 0, release: 0},
    ],
    osc: [
      {type: 'sawtooth', pitch: 0, detune: 0, level: 0.33},
      {type: 'sawtooth', pitch: 0, detune: -15, level: 0.33},
      {type: 'sawtooth', pitch: 0, detune: 15, level: 0.33},
    ],
    filter: {cutoff: 4000, resonance: 1, type: 'lowpass'},
    mod: [
      {src: ["env", 0], amount: 1, control: ["vel"], dst: ["output"]},
      {src: ['env', 1], amount: 1000, dst: ["filter", "cutoff"]},
    ]
  },

  // Arpeggios
  'arp1': {
    tags: ["arp"],
    range: [24, 80],
    cc: [0],
    env: [
      {attack: 0, decay: 0.2, sustain: 0.2, release: 0.5},
      {attack: 0.1, decay: 0.3, sustain: 0, release: 0}
    ],
    osc: [
      {type: 'square', pitch: 0, detune: 0, level: 0.33},
      {type: 'square', pitch: 0, detune: -10, level: 0.23},
      {type: 'square', pitch: 0, detune: 10, level: 0.23},
      {type: 'square', pitch: 12, detune: 0, level: 0.2},
    ],
    filter: {cutoff: 800, resonance: 2, type: 'lowpass'},
    panning: {pan: 0.2, centerPitch: 48, spread: -0.03},
    mod: [
      {src: ["env", 0], amount: 1, control: ["vel"], dst: ["output"]},
      {src: ["env", 1], amount: 1200, dst: ["filter", "cutoff"]},
    ],
  },

  // Pad
  'pad1': {
    tags: ["pad"],
    range: [24, 80],
    cc: [0],
    env: [
      {attack: 0.7, decay: 2, sustain: 0.8, release: 2},
      {attack: 0.5, decay: 2, sustain: 0.4, release: 2},
    ],
    lfo: [
      {rate: 5, type: "triangle"}
    ],
    osc: [
      {type: 'sawtooth', pitch: 0, detune: 0, level: 0.33},
      {type: 'sawtooth', pitch: 0, detune: -15, level: 0.33},
      {type: 'sawtooth', pitch: 0, detune: 15, level: 0.33},
    ],
    filter: {cutoff: 3000, resonance: 1, type: 'lowpass'},
    panning: {pan: -0.2, centerPitch: 48, spread: 0.03},
    mod: [
      {src: ["env", 0], amount: 1, control: ["vel"], dst: ["output"]},
      {src: ["env", 1], amount: 500, dst: ["filter", "cutoff"]},
      {src: ["lfo", 0], amount: 1000, control: ["env", 1], dst: ["filter", "cutoff"]},
    ],
  },

  // Leads
  'lead1': {
    tags: ["lead"],
    range: [24, 80],
    cc: [0],
    env: [
      {attack: 0, decay: 0.3, sustain: 0.4, release: 0.6},
      {attack: 0, decay: 0.4, sustain: 0, release: 0},
    ],
    osc: [
      {type: 'sawtooth', pitch: 0, detune: 0, level: 0.23},
      {type: 'square', pitch: 0, detune: -20, level: 0.23},
      {type: 'sawtooth', pitch: 12, detune: 0, level: 0.07},
      {type: 'square', pitch: 12, detune: 20, level: 0.07},
    ],
    filter: {cutoff: 1000, resonance: 1, envelopeLevel: 2000, type: 'lowpass'},
    mod: [
      {src: ["env", 0], amount: 1, control: ["vel"], dst: ["output"]},
      {src: ["env", 1], amount: 2000, dst: ["filter", "cutoff"]},
    ]
  },
  'lead2': {
    tags: ["lead"],
    range: [24, 80],
    cc: [0],
    env: [
      {attack: 0.0, decay: 0.2, sustain: 0.4, release: 0.3},
      {attack: 0.01, decay: 0.5, sustain: 0, release: 0},
    ],
    osc: [
      {type: 'square', pitch: 0, detune: 0, level: 0.33},
      {type: 'sawtooth', pitch: 0, detune: -10, level: 0.23},
      {type: 'square', pitch: -12, detune: 0, level: 0.13},
      {type: 'square', pitch: 12, detune: 10, level: 0.13},
    ],
    filter: {cutoff: 5000, resonance: 2, type: 'lowpass'},
    mod: [
      {src: ["env", 0], amount: 1, control: ["vel"], dst: ["output"]},
      {src: ["env", 1], amount: 3000, dst: ["filter", "cutoff"]},
    ]
  },
  'lead3': {
    tags: ["lead"],
    range: [24, 80],
    cc: [0],
    env: [
      {attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.05},
      {attack: 0.05, decay: 0.5, sustain: 0.8, release: 0.05},
      {attack: 0.7, decay: 0.1, sustain: 1, release: 0.05},
    ],
    lfo: [
      {rate: 4, type: "triangle"},
    ],
    osc: [
      {type: 'sawtooth', pitch: 0, detune: 0, level: 0.33},
      {type: 'sawtooth', pitch: 0, detune: -5, level: 0.23},
      {type: 'sawtooth', pitch: 12, detune: 0, level: 0.23},
      {type: 'sawtooth', pitch: 12, detune: 5, level: 0.13},
    ],
    filter: {cutoff: 3000, resonance: 3, type: 'lowpass'},
    mod: [
      {src: ["env", 0], amount: 1, control: ["vel"], dst: ["output"]},
      {src: ["env", 1], amount: 4000, dst: ["filter", "cutoff"]},
      {src: ["lfo", 0], amount: 50, control: ["env", 2], dst: ["pitch"]},
    ]
  },
  "lead4": {
    tags: ["lead"],
    range: [24, 80],
    env: [
      {attack: 0.001, decay: 0.3, sustain: 0.6, release: 0.02},
    ],
    lfo: [
      {rate: 4, type: "triangle"},
    ],
    osc: [
      {type: "pulse", width: 0.5, pitch: 0, detune: 0, level: 1},
    ],
    filter: {cutoff: 5000, resonance: 1, type: "lowpass"},
    mod: [
      {src: ["env", 0], amount: 1, control: ["vel"], dst: ["output"]},
      {src: ["env", 0], amount: 2000, dst: ["filter", "cutoff"]},
      {src: ["lfo", 0], amount: 0.3, dst: ["osc", 0, "width"]},
    ]
  }
}