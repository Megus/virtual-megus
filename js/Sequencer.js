// Sequencer
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Sequencer {
  constructor(context) {
    this.context = context;

    this.period = 25.0; // ms
    this.scheduleAhead = 0.1; // s

    this.stepCallbacks = [];
    this.eventCallbacks = [];

    this.events = {};
    this.channels = {};
    this.step = 0;
    this.calledStepCallback = false;

    this.isStopped = true;

    this.scheduler = this.scheduler.bind(this);
  }

  // Working with step callbacks
  addStepCallback(callback) {
    this.stepCallbacks.push(callback);
  }

  removeStepCallback(callback) {
    const index = this.stepCallbacks.indexOf(callback);
    if (index != -1) {
      this.stepCallbacks.splice(index, 1);
    }
  }

  callStepCallbacks(stepTime, step) {
    if (!this.calledStepCallback) {
      this.stepCallbacks.forEach((callback) => callback(stepTime, step));
      this.calledStepCallback = true;
    }
  }

  // Working with event callbacks
  addEventCallback(callback) {
    this.eventCallbacks.push(callback);
  }

  removeEventCallback(callback) {
    const index = this.eventCallbacks.indexOf(callback);
    if (index != -1) {
      this.eventCallbacks.splice(index, 1);
    }
  }

  callEventCallbacks(time, channelId, event) {
    this.eventCallbacks.forEach((callback) => callback(time, channelId, event));
  }

  /**
  * Add new events for the channel
  *
  * @param {MixerChannel} channel
  * @param {Array} events
  * @param {int} stepOffset
  */
  addEvents(channel, events, stepOffset) {
    if (this.events[channel.id] == null) {
      this.events[channel.id] = [];
      this.channels[channel.id] = channel;
    }

    const offset = stepOffset * 256;
    events.sort((a, b) => a.time - b.time);
    events.forEach((event) => event.time += offset);

    Array.prototype.push.apply(this.events[channel.id], events)
  }

  setBPM(bpm) {
    this.bpm = bpm;
    this.stepLength = 15.0 / bpm; // 60/4, each step is 1/16
  }

  // Stop sequencer and drop all scheduled events
  reset() {
    this.isStopped = true;
    this.events = {};
    this.channels = {};
    this.step = 0;
  }

  // Play/resume
  play() {
    this.isStopped = false;
    this.stepTime = this.context.currentTime;
    this.calledStepCallback = false;
    this.callStepCallbacks(this.stepTime, this.step);
    this.scheduler();
  }

  // Pause playback
  pause() {
    this.isStopped = true;
  }

  scheduler() {
    if (this.isStopped) { return; }

    const currentTime = this.context.currentTime;
    if (currentTime + this.scheduleAhead >= this.stepTime + this.stepLength) {
      this.callStepCallbacks(this.stepTime + this.stepLength, this.step + 1);
    }

    if (currentTime >= this.stepTime + this.stepLength) {
      this.step++;
      this.stepTime += this.stepLength;
      this.calledStepCallback = false;
    }

    for (const channelId in this.events) {
      let events = this.events[channelId];
      if (events.length == 0) { continue; }

      let playedEvents = 0;
      for (let idx = 0; idx < events.length; idx++) {
        const event = events[idx];
        let eventTime = (event.time / 256.0 - this.step) * this.stepLength + this.stepTime;

        if (eventTime <= this.context.currentTime + this.scheduleAhead) {
          this.handleEvent(this.channels[channelId], event, eventTime);
          playedEvents++;
        } else {
          break;
        }
      }
      if (playedEvents != 0) {
        events.splice(0, playedEvents);
      }
    }

    this.timerID = window.setTimeout(this.scheduler, this.period);
  }

  handleEvent(channel, event, time) {
    this.callEventCallbacks(time, channel.id, event);

    if (event.type == 'note') {
      event.data.duration = event.data.duration / 256 * this.stepLength;
      channel.unit.playNote(time, event.data);
    }
  }
}