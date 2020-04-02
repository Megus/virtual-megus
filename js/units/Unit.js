// Base class for synth units
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

let _unitId = 0;

class Unit {
    constructor(context, typeString) {
        this.context = context;
        this.id = typeString  + (_unitId++);
    }

    // startNote and stopNote should be implemented in subclasses
    startNote(time, note) {}
    stopNote(time, note) {}

    // Convenient untility functions for all units

    // Apply attack, decay and sustain phases of an ADSR envelope
    applyEnvelopeADS(time, adsr, param, minValue, amplitude) {
        // Attack
        let maxValue = minValue + amplitude;
        if (maxValue < 0.0001) { maxValue = 0.0001; }
        if (minValue < 0.0001) { minValue = 0.0001; }
        if (adsr.attack != 0) {
            param.setValueAtTime(minValue, time);
            param.exponentialRampToValueAtTime(maxValue, time + adsr.attack);
        } else {
            param.setValueAtTime(maxValue, time);
        }

        // Decay and sustain level
        let sustainValue = minValue + adsr.sustain * amplitude;
        if (sustainValue < 0.0001) { sustainValue = 0.0001; }
        param.exponentialRampToValueAtTime(sustainValue, time + adsr.attack + adsr.decay);
    }

    // Apply release phase of an ADSR envelope
    applyEnvelopeR(time, adsr, param, minValue, amplitude) {
        let sustainValue = minValue + adsr.sustain * amplitude;
        if (sustainValue < 0.0001) { sustainValue = 0.0001; }
        if (minValue < 0.0001) { minValue = 0.0001; }

        param.cancelAndHoldAtTime(time);
        param.exponentialRampToValueAtTime(sustainValue, time);
        param.exponentialRampToValueAtTime(minValue, time + adsr.release);
    }
}