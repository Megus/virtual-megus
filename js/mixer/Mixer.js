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

      this.addChannelCallbacks = [];
      this.removeChannelCallbacks = [];
    }
    catch (e) {
      alert(e);
    }
  }

  addAddChannelCallback(callback) {
    this.addChannelCallbacks.push(callback);
  }

  removeAddChannelCallback(callback) {
    const index = this.addChannelCallbacks.indexOf(callback);
    if (index != -1) {
      this.addChannelCallbacks.splice(index, 1);
    }
  }

  addRemoveChannelCallback(callback) {
    this.removeChannelCallbacks.push(callback);
  }

  removeRemoveChannelCallback(callback) {
    const index = this.removeChannelCallbacks.indexOf(callback);
    if (index != -1) {
      this.removeChannelCallbacks.splice(index, 1);
    }
  }

  addChannel(channel) {
    channel.output.connect(this.context.destination);
    this.channels.push(channel);
    this.addChannelCallbacks.forEach((callback) => callback(channel));
    return channel;
  }

  removeChannel(channel) {
    channel.output.disconnect();
    channel.dispose();
    const index = this.channels.indexOf(channel);
    if (index != -1) {
      this.channels.splice(index, 1);
      this.removeChannelCallbacks.forEach((callback) => callback(channel));
    }
  }
}
