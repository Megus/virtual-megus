// Mixer
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Mixer {
    constructor() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();

            this.channels = [];
        }
        catch (e) {
            alert(e);
        }
    }

    addChannel(unit) {
        const channel = new MixerChannel(unit);
        channel.output.connect(this.context.destination);
        this.channels.push(channel);
        return channel;
    }

    removeChannel(channel) {
        channel.output.disconnect();
        const index = this.channels.indexOf(channel);
        if (index != -1) {
            this.channels.splice(index, 1);
        }
    }
}
