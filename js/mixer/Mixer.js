// Mixer
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Mixer {
    constructor() {
        try {
            // Get context
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();

            this.channels = [];
        }
        catch (e) {
            alert(e);
            //alert('Web Audio API is not supported in this browser');
        }
    }

    addChannel(unit) {
        const channel = new MixerChannel(unit);
        channel.output.connect(this.context.destination);
        this.channels.push(channel);
        return channel;
    }
}
