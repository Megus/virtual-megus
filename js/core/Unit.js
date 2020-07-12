// Base class for synth units
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

const _eps = 0.0001;

class Unit {
  /**
  * Default Unit constructor
  *
  * @param {AudioContext} context
  * @param {Array} pitchTable
  * @param {string} unitType
  */
  constructor(context, pitchTable, unitType) {
    this.context = context;
    this.pitchTable = pitchTable;
    this.unitType = unitType;
  }

  // Should be implemented in subclasses

  // Dispose unit: free all resources
  dispose() {}

  /**
   * Handle note and automation events
   *
   * @param {Object} event
   */
  handleEvent(event) {
    if (event.type == "note") {
      this.playNote(event.timeSeconds, event.data);
    }
  }

  /**
   * Plays a note
   *
   * @param {number} time
   * @param {Object} note
   */
  playNote(time, note) {
    throw "playNote must be implemented in Unit subclasses";
  }

  /**
   * Get audio level (or something similar to audio level)
   */
  getAudioLevel() {
    return 0;
  }

  // Convenient untility functions for all units

  /**
   * Apply ADSR envelope to AudioNode parameter
   *
   * @param {number} time
   * @param {number} duration
   * @param {Object} adsr
   * @param {AudioParam} param
   * @param {number} minValue
   * @param {number} amplitude
   */
  applyADSR(time, duration, adsr, param, minValue, amplitude) {
    const releaseTime = time + ((duration < _eps) ? (adsr.attack + adsr.decay) : duration);
    const decayTime = time + adsr.attack;
    const sustainTime = time + adsr.attack + adsr.decay;
    const endTime = releaseTime + adsr.release;

    let maxValue = minValue + amplitude;
    let sustainValue = minValue + adsr.sustain * amplitude;
    if (minValue < _eps) { minValue = _eps; }
    if (maxValue < _eps) { maxValue = _eps; }
    if (sustainValue < _eps) { sustainValue = _eps; }

    // Attack
    const attackValue = (releaseTime > decayTime) ? maxValue : (minValue + amplitude * (releaseTime - time) / adsr.attack);

    if (adsr.attack != 0) {
      param.setValueAtTime(minValue, time);
      param.linearRampToValueAtTime(attackValue, Math.min(decayTime, releaseTime));
    } else {
      param.setValueAtTime(attackValue, time);
    }

    // Decay and sustain level
    if (attackValue > sustainValue) {
      param.linearRampToValueAtTime(sustainValue, Math.min(sustainTime, releaseTime));
    }

    // Release
    param.linearRampToValueAtTime(sustainValue, releaseTime);
    param.linearRampToValueAtTime(minValue, endTime);

    return endTime;
  }

  /**
   * Clamp value between min and max values
   *
   * @param {number} value
   * @param {number} min
   * @param {number} max
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}