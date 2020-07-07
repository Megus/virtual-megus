// Simple composer
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Composer1 extends Composer {
  /**
   *
   * @param {Mixer} mixer
   * @param {Sequencer} sequencer
   */
  constructor(mixer, sequencer) {
    super(mixer, sequencer);
    this.pitchTable = create12TETPitchTable(440.0);
    this.stepCallback = this.stepCallback.bind(this);
  }

  /**
   *
   * @param {Unit} unit
   * @param {number} gain
   * @param {number} reverb
   * @param {number} delay
   */
  createChannel(unit, gain, reverb, delay) {
    const channel = new MixerChannel(unit);
    channel.gainNode.gain.value = gain;
    channel.unitReverbSend = reverb;
    channel.delay.input.gain.value = delay;
    this.mixer.addChannel(channel);
    return channel;
  }

  async setupEnsemble() {
    const context = this.mixer.context;
    const pitchTable = this.pitchTable;

    const pool = {
      drums: [
        this.createChannel(new DrumMachine(context, drumKits["tr808"]), 1, 0.1, 0),
      ],
      bass: [
        this.createChannel(new MonoSynth(context, pitchTable, synthPresets["bass"]), 1, 0, 0),
      ],
      pad: [
        this.createChannel(new PolySynth(context, pitchTable, synthPresets["pad"]), 0.2, 1, 0.1),
      ],
      melody: [
        this.createChannel(new MonoSynth(context, pitchTable, synthPresets["lead1"]), 0.9, 0.3, 0.2),
      ],
      arpeggio: [
        this.createChannel(new PolySynth(context, pitchTable, synthPresets["arp"]), 0.4, 0.7, 0.2),
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
    this.sequencer.setBPM(120);
    this.sequencer.addStepCallback(this.stepCallback);

    // Add first patterns
    this.initState();
    this.generatePatterns();
  }

  stop() {
    this.sequencer.removeStepCallback(this.stepCallback);
    for (const channelId in this.channels) {
      this.mixer.removeChannel(this.channels[channelId]);
    }
    this.channels = {};
    this.generatorConstructors = {};
    this.generators = {};
  }

  initState() {
    const key = 0; // C
    const scale = 5; // Minor

    this.state = {
      key: key,
      scale: scale,
      scalePitches: diatonicScalePitches(key, scale, this.pitchTable),
    };

    this.setupSection("intro");
  }

  stepCallback(time, step) {
    if (step % this.state.patternLength == this.state.patternLength - 4) {
      this.patternStep += this.state.patternLength;
      this.nextState();
      this.generatePatterns();
    }
  }

  generatePatterns() {
    console.log("Generating next patterns");
    this.state.parts.forEach((part) => {
      this.sequencer.addEvents(
        this.pool[part][0],
        this.generators[part].nextEvents(this.state),
        this.patternStep,
      );
    });
  }

  expandHarmony(harmonyMap) {
    const harmony = [];
    for (let c = 0; c < this.state.patternLength; c++) {
      harmony.push(-1);
    }
    for (const step in harmonyMap) {
      harmony[step] = harmonyMap[step];
    }
    let chord = harmony[0];
    for (let c = 0; c < this.state.patternLength; c++) {
      if (harmony[c] != -1) {
        chord = harmony[c];
      }
      harmony[c] = chord;
    }
    return harmony;
  }

  /**
   * Setup a new song section
   * @param {string} name
   */
  setupSection(name) {
    console.log("Setting up section " + name);
    this.state.patternLength = 64;
    this.state.harmony = this.expandHarmony({0: 7, 16: 5, 32: 6, 48: 4});
    this.state.sectionPatterns = 4;
    this.state.parts = ["drums", "arpeggio", "pad", "bass", "melody"];
  }

  nextSection() {
    this.setupSection("intro");
  }

  /**
   * Next state
   */
  nextState() {
    this.state.sectionPatterns--;
    if (this.state.sectionPatterns <= 0) {
      this.nextSection();
    }
  }
}