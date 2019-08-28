function GDrums1(sequencer, mixer, unit) {
    this.sequencer = sequencer;
    this.mixer = mixer;
    this.unit = unit;

    this.pattern = this.createInitialPattern();
    const loop = this.createLoop(this.pattern);
    sequencer.addLoop(this.unit, loop);
}

const instrumentMappings = {
    kick: 0,
    clap: 12,
    rimShot: 24,
    snare: 36,
    closedHat: 48,
    openHat: 60,
    clave: 72,
    cymbal: 84,
};

GDrums1.prototype.createInitialPattern = function() {
    const pattern = {
        kick: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
        clap: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        rimShot: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        snare: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        closedHat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        openHat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        clave: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        cymbal: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    };
    return pattern;
}

GDrums1.prototype.createLoop = function(pattern) {
    const loop = {
        events: [],
    }
    for (let instrument in pattern) {
        const hits = pattern[instrument];
        loop.steps = hits.length;
        for (let c = 0; c < hits.length; c++) {
            if (hits[c] != 0) {
                loop.events.push({time: c * 256, type: 'noteOn', data: {pitch: instrumentMappings[instrument], velocity: hits[c]}});
            }
        }
    }
    loop.events.sort((a, b) => a.time - b.time);
    return loop;
}

GDrums1.prototype.nextPattern = function() {
    const step = Math.floor(Math.random() * 16);
    this.pattern.clave[step] = this.pattern.clave[step] == 1 ? 0 : 1;
    const loop = this.createLoop(this.pattern);
    this.sequencer.addLoop(this.unit, loop);
}