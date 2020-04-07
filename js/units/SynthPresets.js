// Some synth presets
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

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
        ampEnvelope: {attack: 0, decay: 1, sustain: 0.1, release: 1},
        filterEnvelope: {attack: 0.6, decay: 1, sustain: 0, release: 0},
        filter: {cutoff: 600, resonance: 2, envelopeLevel: 1200, type: 'highpass'},
        osc: [
            {type: 'sawtooth', pitch: 0, detune: 0, level: 0.33},
            {type: 'sawtooth', pitch: 0, detune: -10, level: 0.23},
            {type: 'sawtooth', pitch: 0, detune: 10, level: 0.23},
            {type: 'sawtooth', pitch: -12, detune: 0, level: 0.3},
            {type: 'sawtooth', pitch: 12, detune: 0, level: 0.2},
            {type: 'sawtooth', pitch: 7, detune: 0, level: 0.2},
        ]
    },

    // Pad
    'pad': {
        ampEnvelope: {attack: 0.4, decay: 2, sustain: 0.8, release: 2},
        filterEnvelope: {attack: 0.5, decay: 2, sustain: 0.4, release: 2},
        filter: {cutoff: 3000, resonance: 1, envelopeLevel: 500, type: 'lowpass'},
        osc: [
            {type: 'sawtooth', pitch: 0, detune: 0, level: 0.33},
            {type: 'sawtooth', pitch: 0, detune: -15, level: 0.33},
            {type: 'sawtooth', pitch: 0, detune: 15, level: 0.33},
        ]
    },
}