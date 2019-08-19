function Sequencer(context) {
    this.context = context;
    this.loops = {};
    this.loopStartTimes = {};

    this.period = 25.0;
    this.scheduleAhead = 0.1;
}

Sequencer.prototype.setBPM = function(bpm) {
    this.bpm = bpm;
}

Sequencer.prototype.addLoop = function(unit, loop) {
    this.loops[unit.id] = {loop: loop, unit: unit, idx: 0};
}

Sequencer.prototype.start = function() {
    this.step = 0;
    this.stepTime = this.context.currentTime;
    this.stepLength = 15.0 / this.bpm; // 60/4, each step is 1/16

    this.scheduler();
}

Sequencer.prototype.stop = function() {

}

Sequencer.prototype.scheduler = function() {
    const currentTime = this.context.currentTime;
    if (currentTime >= this.stepTime + this.stepLength) {
        this.step++;
        this.stepTime += this.stepLength;
    }

    for (let unitId in this.loops) {
        const loop = this.loops[unitId];

        if (this.loopStartTimes[unitId] == null) {
            this.loopStartTimes[unitId] = currentTime;
        }
        let loopStart = this.loopStartTimes[unitId];

        let idx = loop.idx;

        do {
            const event = loop.loop.events[idx];
            let eventTime = (event.time / 256.0) * this.stepLength + loopStart;
            if (eventTime <= this.context.currentTime + this.scheduleAhead) {
                this.handleEvent(loop.unit, event, eventTime);
                idx++;
                if (idx == loop.loop.events.length) {
                    idx = 0;
                    loopStart += loop.loop.steps * this.stepLength;
                    this.loopStartTimes[unitId] = loopStart;
                }
            } else {
                break;
            }
        } while (idx != loop.idx);
        loop.idx = idx;
    }

    this.timerID = window.setTimeout(this.scheduler.bind(this), this.period);
}

Sequencer.prototype.handleEvent = function(unit, event, time) {
    if (event.type == 'noteOn') {
        unit.startNote(time, event.data);
    } else if (event.type == 'noteOff') {
        unit.stopNote(time, event.data);
    }
}