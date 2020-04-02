// Sequencer
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Sequencer {
    constructor(context) {
        this.context = context;

        this.period = 25.0;
        this.scheduleAhead = 0.1;

        this.onBeat = null;
        this.onEvent = null;
        this.onPatternStart = null;

        this.loops = {};
        this.loopStartTimes = {};

        this.isStopped = false;
    }

    setBPM(bpm) {
        this.bpm = bpm;
    }

    addLoop(unit, loop) {
        if (this.loops[unit.id] == null) {
            this.loops[unit.id] = [];
        }
        this.loops[unit.id].push({loop: loop, unit: unit, idx: 0});
    }

    play() {
        this.isStopped = false;
        this.step = 0;
        this.stepTime = this.context.currentTime;
        this.stepLength = 15.0 / this.bpm; // 60/4, each step is 1/16

        if (this.onBeat != null) { this.onBeat(this.stepTime, this.step); }

        this.scheduler();
    }

    stop() {
        this.isStopped = true;
        this.loops = {};
        this.loopStartTimes = {};
    }

    scheduler() {
        if (this.isStopped) { return; }

        const currentTime = this.context.currentTime;
        if (this.onBeat != null && currentTime + this.scheduleAhead >= this.stepTime + this.stepLength) {
            this.onBeat(this.stepTime + this.stepLength, this.step + 1);
        }

        if (currentTime >= this.stepTime + this.stepLength) {
            this.step++;
            this.stepTime += this.stepLength;
        }

        for (let unitId in this.loops) {
            let loop = this.loops[unitId][0];

            if (this.loopStartTimes[unitId] == null) {
                this.loopStartTimes[unitId] = currentTime;
            }
            let loopStart = this.loopStartTimes[unitId];

            let idx = loop.idx;

            do {
                const event = loop.loop.events[idx];
                if (event == null) break;
                let eventTime = (event.time / 256.0) * this.stepLength + loopStart;
                if (eventTime <= this.context.currentTime + this.scheduleAhead) {
                    this.handleEvent(loop.unit, event, eventTime);
                    idx++;
                    if (idx == loop.loop.events.length) {
                        if (this.onPatternStart != null) {
                            this.onPatternStart(unitId);
                        }

                        idx = 0;
                        loopStart += loop.loop.steps * this.stepLength;
                        this.loopStartTimes[unitId] = loopStart;
                        if (this.loops[unitId].length > 1) {
                            this.loops[unitId].splice(0, 1);
                            loop = this.loops[unitId][0];
                        }
                    }
                } else {
                    break;
                }
            } while (idx != loop.idx);
            loop.idx = idx;
        }

        this.timerID = window.setTimeout(this.scheduler.bind(this), this.period);
    }

    handleEvent(unit, event, time) {
        if (this.onEvent != null) { this.onEvent(time, event.type, unit.id, event.data); }

        if (event.type == 'noteOn') {
            unit.startNote(time, event.data);
        } else if (event.type == 'noteOff') {
            unit.stopNote(time, event.data);
        }
    }
}


