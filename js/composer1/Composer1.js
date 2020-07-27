// Simple composer
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Composer1 extends Composer {
  constructor() {
    super();
    this.pitchTable = create12TETPitchTable(440.0);
    this.stepCallback = this.stepCallback.bind(this);
    this.visualizers = {};
  }

  /**
   *
   * @param {Unit} unit
   * @param {number} gain
   * @param {number} reverb
   * @param {number} delay
   */
  createChannel(unit, gain, reverb, delay, visualConstructor) {
    const channel = new MixerChannel(unit);
    channel.gainNode.gain.value = gain;
    channel.unitReverbSend = reverb;
    channel.delay.input.gain.value = delay;
    core.mixer.addChannel(channel);
    const visualLayer = new visualConstructor(channel.id);
    this.visualizers[channel.id] = visualLayer;
    core.visualizer.addLayer(visualLayer, 0);
    return channel;
  }

  async setupEnsemble() {
    const context = core.mixer.context;
    const pitchTable = this.pitchTable;

    const pool = {
      drums: [
        this.createChannel(new DrumMachine(context, drumKits["tr808"]), 1, 0.1, 0, VDots),
      ],
      bass: [
        this.createChannel(new MonoSynth(context, pitchTable, synthPresets["bass"]), 1, 0, 0, VTriangles),
      ],
      pad: [
        this.createChannel(new PolySynth(context, pitchTable, synthPresets["pad"]), 0.2, 1, 0.1, VTriangles),
      ],
      melody: [
        this.createChannel(new MonoSynth(context, pitchTable, synthPresets["lead3"]), 0.9, 0.3, 0.2, VTriangles),
        this.createChannel(new MonoSynth(context, pitchTable, synthPresets["lead2"]), 0.9, 0.3, 0.3, VTriangles),
      ],
      arpeggio: [
        this.createChannel(new PolySynth(context, pitchTable, synthPresets["arp"]), 0.4, 0.7, 0.4, VTriangles),
      ],
    };

    this.pool = pool;
  }

  start() {
    this.generators = {
      drums: new GDrums1(),
      bass: new GBass1(),
      pad: new GPad1(),
      melody: new GMelody1(),
      arpeggio: new GArp1(),
    };

    this.patternStep = 0;

    // Prepare sequencer
    core.sequencer.addStepCallback(this.stepCallback);

    // Add first patterns
    this.initState();
    this.state.parts.forEach((partInfo) => this.generatePattern(partInfo));
  }

  stop() {
    core.sequencer.removeStepCallback(this.stepCallback);
    for (const partId in this.pool) {
      const part = this.pool[partId];
      part.forEach((channel) => {
        core.mixer.removeChannel(channel);
        core.visualizer.removeLayer(this.visualizers[channel.id]);
      });
    }
    this.generators = {};
  }

  stepCallback(time, step) {
    const patternStep = step % this.state.patternLength;

    if (patternStep > 4) {
      if (this.partToGenerate == -1) {
        this.patternStep += this.state.patternLength;
        this.nextState();
        this.partToGenerate++;
      } else if (this.partToGenerate < this.state.parts.length) {
        this.generatePattern(this.state.parts[this.partToGenerate]);
        this.partToGenerate++;
      }
    } else {
      this.partToGenerate = -1;
    }
  }

  generatePattern(partInfo) {
    let part = "";
    let instrument = 0;
    if (typeof partInfo == "string") {
      part = partInfo;
    } else {
      part = partInfo[0];
      instrument = partInfo[1];
    }

    core.sequencer.addEvents(
      this.pool[part][instrument],
      this.generators[part].nextEvents(this.state),
      this.patternStep,
    );
  }

  expandHarmony(harmonyMap) {
    const harmony = [];
    for (let c = 0; c < this.state.patternLength; c++) {
      harmony.push([]);
    }
    for (const step in harmonyMap) {
      harmony[step] = harmonyMap[step];
    }
    let chord = harmony[0];
    for (let c = 0; c < this.state.patternLength; c++) {
      if (harmony[c].length != 0) {
        chord = harmony[c];
      }
      harmony[c] = chord;
    }
    return harmony;
  }



  // Actual composing logic

  initState() {
    core.sequencer.setBPM(100 + Math.floor(Math.random() * 30));

    const key = Math.floor(Math.random() * 12);
    const scale = 5; // Minor

    this.harmonies = {};
    this.harmonyGenerator = new Harmony(key, scale);
    this.state = {
      key: key,
      scale: scale,
      scalePitches: diatonicScalePitches(key, scale, this.pitchTable),
    };

    //this.setupSection("verse");
    this.setupSection("intro");
  }

  /**
   * Next state
   */
  nextState() {
    this.state.sectionPattern++;
    if (this.state.sectionPattern == this.state.sectionLength) {
      this.nextSection();
    }
  }

  generateHarmony(section) {
    if (this.harmonies[section] == null || Math.random() > 0.6) {
      this.harmonies[section] = this.harmonyGenerator.generateHarmony();
    }
    return this.harmonies[section];
  }

  /**
   * Setup a new song section
   * @param {string} name
   */
  setupSection(name) {
    this.state.section = name;
    this.state.patternLength = 64;
    this.state.harmonyMap = this.generateHarmony(name);
    this.state.harmony = this.expandHarmony(this.state.harmonyMap);
    this.state.sectionPattern = 0;

    if (name == "intro") {
      this.state.sectionLength = (Math.random() > 0.5) ? 2 : 4;
      this.state.parts = ["pad", "arpeggio"];
    } else if (name == "verse") {
      this.state.sectionLength = 2;
      this.state.parts = ["drums", "bass", "pad", "melody"];
    } else if (name == "chorus") {
      this.state.sectionLength = 2;
      this.state.parts = ["drums", "bass", "pad", "arpeggio", ["melody", 1]];
    } else if (name == "bridge") {
      this.state.sectionLength = 1;
      this.state.parts = ["drums", "bass", "pad", "arpeggio"];
    } else if (name == "s1") {
      this.state.sectionLength = 2;
      this.state.parts = ["drums", "bass", "arpeggio"];
    } else if (name == "s2") {
      this.state.sectionLength = (Math.random() > 0.6) ? 2 : 4;
      this.state.parts = ["bass", "pad", "arpeggio"];
    }
    console.log(`Section: ${name}, length: ${this.state.sectionLength} patterns`);
  }

  nextSection() {
    const current = this.state.section;
    let next = current;
    if (current == "intro") {
      next = (Math.random() > 0.3) ? "verse" : "bridge";
    } else if (current == "verse") {
      next = "chorus";
    } else if (current == "chorus") {
      next = (Math.random() > 0.4) ? "verse" : "bridge";
    } else if (current == "bridge") {
      next = (Math.random() > 0.7) ? ((Math.random() > 0.5) ? "s1" : "s2") : "verse";
    } else if (current == "s1") {
      next = (Math.random() > 0.5) ? "bridge" : "s2";
    } else if (current == "s2") {
      next = (Math.random() > 0.8) ? "s1" : "bridge";
    }

    this.setupSection(next);
  }
}