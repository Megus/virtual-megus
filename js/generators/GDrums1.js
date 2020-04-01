function GDrums1(sequencer, mixer, unit) {
    this.sequencer = sequencer;
    this.mixer = mixer;
    this.unit = unit;

    this.prepareMutations(patternTemplate);
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

const patternTemplate = {
    kick: {
        weight: 2,
        on:     [16,1,2,1, 16,1,2,1, 16,1,2,1, 16,1,8,1],
        off:    [1,4,4,4, 1,4,4,4, 1,4,4,4, 1,4,4,4],
    },
    clap: {
        weight: 1,
        on:     [1,1,1,1, 16,1,1,1, 1,1,1,1, 16,1,1,1],
        off:    [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    },
    rimShot: {
        weight: 2,
        on:     [1,2,1,2, 1,2,1,2, 1,2,1,2, 1,2,1,2],
        off:    [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    },
    snare: {
        weight: 1,
        on:     [1,1,1,1, 8,1,1,3, 1,3,1,1, 8,1,1,4],
        off:    [2,2,2,2, 1,2,2,2, 2,2,2,2, 1,2,2,2],
    },
    closedHat: {
        weight: 5,
        on:     [4,1,4,1, 4,1,4,1, 4,1,4,1, 4,1,4,1],
        off:    [1,2,1,2, 1,2,1,2, 1,2,1,2, 1,2,1,2],
    },
    clave: {
        weight: 4,
        on:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        off:    [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    },
}

GDrums1.prototype.createInitialPattern = function() {
    const pattern = {
        kick:       [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        clap:       [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        rimShot:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        snare:      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        closedHat:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        openHat:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        clave:      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        cymbal:     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    };

    for (let c = 0; c < 32; c++) {
        this.mutatePattern(pattern);
    }

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

GDrums1.prototype.prepareMutations = function(template) {
    this.partDistribution = [];
    this.partStepOnDistribution = {};
    this.partStepOffDistribution = {};
    for (const partName in template) {
        const part = template[partName];
        for (let c = 0; c < part.weight; c++) {
            this.partDistribution.push(partName);

            const offDistribution = [];
            const onDistribution = [];
            for (let d = 0; d < part.on.length; d++) {
                for (let e = 0; e < part.on[d]; e++) {
                    onDistribution.push(d);
                }
                for (let e = 0; e < part.off[d]; e++) {
                    offDistribution.push(d);
                }
            }

            this.partStepOnDistribution[partName] = onDistribution;
            this.partStepOffDistribution[partName] = offDistribution;
        }
    }
}

GDrums1.prototype.mutatePattern = function(pattern) {
    // Pick part for mutation
    const partName = this.partDistribution[Math.floor(Math.random() * this.partDistribution.length)];

    // Off a note
    let step = this.partStepOffDistribution[partName][Math.floor(Math.random() * this.partStepOffDistribution[partName].length)];
    pattern[partName][step] = 0;

    // On a note
    step = this.partStepOnDistribution[partName][Math.floor(Math.random() * this.partStepOnDistribution[partName].length)];
    pattern[partName][step] = 1;
}

GDrums1.prototype.nextPattern = function() {
    const mutations = 4 + Math.floor(Math.random() * 4);
    for (let c = 0; c < mutations; c++) {
        this.mutatePattern(this.pattern);
    }

    const loop = this.createLoop(this.pattern);
    this.sequencer.addLoop(this.unit, loop);
}