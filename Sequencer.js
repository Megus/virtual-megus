function Sequencer(context) {
    this.context = context;
    this.loops = {};

    this.period = 25.0;
    this.scheduleAhead = 0.1;
}

Sequencer.prototype.setBPM = function(bpm) {
    this.bpm = bpm;
}

Sequencer.prototype.addLoop = function(unit, loop) {
    this.loops[unit] = {loop: loop, unit: unit, idx: 0};
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
    if (this.context.currentTime >= this.stepTime + this.stepLength) {
        this.step++;
        this.stepTime += this.stepLength;
    }

    for (let unitId in this.loops) {
        const loop = this.loops[unitId];
        const loopSteps = loop.loop.steps;
        const currentStep = this.step % loopSteps;
        let idx = loop.idx;

        do {
            const event = loop.loop.events[idx];
            const eventTime = (event.time / 256.0 - currentStep) * this.stepLength;
            if (eventTime >= 0 && this.stepTime + eventTime < this.context.currentTime + this.scheduleAhead) {
                this.handleEvent(loop.unit, event, this.stepTime + eventTime);
                idx++;
                if (idx == loop.loop.events.length) {
                    idx = 0;
                }
            } else {
                break;
            }
        } while (true);
        loop.idx = idx;
    }

    this.timerID = window.setTimeout(this.scheduler.bind(this), this.period);
}

Sequencer.prototype.handleEvent = function(unit, event, time) {
    /*console.log(event);
    console.log(time);*/
    if (event.type == 'noteOn') {
        unit.startNote(time, event.data);
    } else if (event.type == 'noteOff') {
        unit.stopNote(time, event.data);
    }
}