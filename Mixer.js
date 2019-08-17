'use strict';

function Mixer() {
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

Mixer.prototype.addChannel = function (unit) {
    const channel = new MixerChannel(unit);
    channel.output.connect(this.context.destination);
    this.channels.push(channel);
    return channel;
}
