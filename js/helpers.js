function applyEnvelopeADS(time, adsr, param, minValue, amplitude) {
    // Attack
    let maxValue = minValue + amplitude;
    if (maxValue < 0.0001) { maxValue = 0.0001; }
    if (adsr.attack != 0) {
        param.setValueAtTime(minValue, time);
        param.exponentialRampToValueAtTime(maxValue, time + adsr.attack);
    } else {
        param.setValueAtTime(maxValue, time);
    }

    // Decay
    let sustainValue = minValue + adsr.sustain * amplitude;
    if (sustainValue < 0.0001) { sustainValue = 0.0001; }
    param.exponentialRampToValueAtTime(sustainValue, time + adsr.attack + adsr.decay);
}

function applyEnvelopeR(time, adsr, param, minValue, amplitude) {
    let sustainValue = minValue + adsr.sustain * amplitude;
    if (sustainValue < 0.0001) { sustainValue = 0.0001; }
    if (minValue < 0.0001) { minValue = 0.0001; }

    param.cancelAndHoldAtTime(time);
    param.exponentialRampToValueAtTime(sustainValue, time);
    param.exponentialRampToValueAtTime(minValue, time + adsr.release);
}