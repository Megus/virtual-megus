const synthPresets = {
    // Basses
    'bass': {
        ampEnvelope: {attack: 0, decay: 0.3, sustain: 0.1, release: 0.6},
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
    }
}