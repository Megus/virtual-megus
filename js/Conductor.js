
/**
 * Base class for all conductors
 */

class Conductor {
    /**
     *
     * @param {Mixer} mixer
     * @param {Sequencer} sequencer
     * @param {Array} pitchTable
     */
    constructor(mixer, sequencer, pitchTable) {
        this.mixer = mixer;
        this.sequencer = sequencer;
        this.pitchTable = pitchTable;
    }

    // To be implemented in subclasses
    start() {};
    stop() {};

    /**
     *
     * @param {int} key
     * @param {int} scale
     */
    generateDiatonicScalePitches(key, scale) {
        const diatonic = [0, 2, 4, 5, 7, 9, 11];
        const pitches = [];
        let idx = scale;
        let pitch = key;

        while (pitch < 96) {
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
}