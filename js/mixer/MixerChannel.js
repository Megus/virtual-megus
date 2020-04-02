// Mixer channel strip
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class MixerChannel {
    constructor(unit) {
        this.unit = unit;
        this.output = unit.output;
    }
}
