function GBass1(sequencer, mixer, unit) {
    this.sequencer = sequencer;
    this.mixer = mixer;
    this.unit = unit;

    this.pattern = this.createInitialPattern();
    const loop = this.createLoop(this.pattern);
    sequencer.addLoop(this.unit, loop);
}

GBass1.prototype.createInitialPattern = function() {
    const pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    return pattern;
}

GBass1.prototype.createLoop = function(pattern) {
    const loop = {
        events: [],
    }
    loop.steps = pattern.length;
    for (let c = 0; c < pattern.length; c++) {
        if (pattern[c] != 0) {
            loop.events.push({time: c * 256, type: 'noteOn', data: {pitch: pattern[c], velocity: 0.7}});
        }
    }

    if (loop.events.length == 0) {
        loop.events.push({time: 0, type: 'noteOff', data: {pitch: 0, velocity: 0}});
    }

    loop.events.sort((a, b) => a.time - b.time);
    return loop;
}

GBass1.prototype.nextPattern = function() {
    const step = Math.floor(Math.random() * 16);
    this.pattern[step] = this.pattern[step] != 0 ? 0 : Math.floor(Math.random() * 2) * 12 + 24;
    const loop = this.createLoop(this.pattern);
    this.sequencer.addLoop(this.unit, loop);
}