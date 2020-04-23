// Simple composer
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Composer1 extends Composer {
  constructor(mixer, sequencer) {
    super(mixer, sequencer);
    this.pitchTable = create12TETPitchTable(440.0);
    this.generators = {};
    this.generatorConstructors = {};
    this.channels = {};
    this.stepCallback = this.stepCallback.bind(this);
  }

  /**
   *
   * @param {Unit} unit
   * @param {function} generatorConstructor
   */
  addUnit(unit, generatorConstructor) {
    const channel = new MixerChannel(unit);
    if (unit.unitType == "drummach") {
      channel.reverbSend.gain.value = 0.1;
    }
    this.mixer.addChannel(channel);
    this.channels[channel.id] = channel;
    this.generatorConstructors[channel.id] = generatorConstructor;
  }

  async setupEnsemble() {
    const drums = new DrumMachine(this.mixer.context);

    const kitInfo = [
      ['808-bass-drum.mp3'], // 0
      ['808-clap.mp3'], // 1
      ['808-rim-shot.mp3'], // 2
      ['808-snare.mp3'], // 3
      ['808-closed-hat.mp3'], // 4
      ['808-open-hat.mp3'], // 5
      ['808-clave.mp3'], // 6
      ['808-cymbal.mp3'], // 7
    ];

    drums.loadKit(kitInfo);

    this.addUnit(drums, GDrums1);
    this.addUnit(new MonoSynth(this.mixer.context, this.pitchTable, synthPresets["bass"]), GBass1);
    this.addUnit(new PolySynth(this.mixer.context, this.pitchTable, synthPresets["pad"]), GPad1);
    this.addUnit(new PolySynth(this.mixer.context, this.pitchTable, synthPresets["arp"]), GArp1);
    this.addUnit(new MonoSynth(this.mixer.context, this.pitchTable, synthPresets["lead1"]), GMelody1);
  }

  start() {
    for (const channelId in this.channels) {
      this.generators[channelId] = new this.generatorConstructors[channelId];
    }

    this.patternStep = 0;

    // Prepare sequencer
    this.sequencer.setBPM(120);
    this.sequencer.addStepCallback(this.stepCallback);

    // Add first patterns
    this.initState();
    this.generateNextPatterns();
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
    const startingChord = 0;    // Starting with root

    this.state = {
      key: key,
      scale: scale,
      chord: startingChord,
      scalePitches: diatonicScalePitches(key, scale, this.pitchTable),
    };
  }

  stepCallback(time, step) {
    if (step % 16 == 12) {
      this.patternStep += 16;
      this.nextState();
      this.generateNextPatterns();
    }
  }

  generateNextPatterns() {
    for (const channelId in this.channels) {
      this.sequencer.addEvents(
        this.channels[channelId],
        this.generators[channelId].nextEvents(this.state),
        this.patternStep
      );
    }
  }

  nextState() {
    let newChord = Math.floor(Math.random() * 6);
    if (newChord == (13 - this.state.scale) % 7) {
      newChord++;
    }
    this.state.chord = newChord;
  }
}