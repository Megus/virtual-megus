// Simple conductor
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Conductor1 extends Conductor {
  constructor(mixer, sequencer, pitchTable) {
    super(mixer, sequencer, pitchTable);
    this.generators = {};
    this.generatorConstructors = {};
    this.units = {};
    this.stepCallback = this.stepCallback.bind(this);
  }

  addUnit(unit, generatorConstructor) {
    this.mixer.addChannel(unit);
    this.units[unit.id] = unit;
    this.generatorConstructors[unit.id] = generatorConstructor;
  }

  async setupEnsemble() {
    const drums = new DrumMachine(this.mixer.context);

    const kitInfo = [
      ['samples/808/808-bass-drum.mp3'], // 0
      ['samples/808/808-clap.mp3'], // 1
      ['samples/808/808-rim-shot.mp3'], // 2
      ['samples/808/808-snare.mp3'], // 3
      ['samples/808/808-closed-hat.mp3'], // 4
      ['samples/808/808-open-hat.mp3'], // 5
      ['samples/808/808-clave.mp3'], // 6
      ['samples/808/808-cymbal.mp3'], // 7
    ];

    await drums.loadKit(kitInfo);

    this.addUnit(drums, GDrums1);
    this.addUnit(new MonoSynth(this.mixer.context, this.pitchTable, synthPresets["bass"]), GBass1);
    this.addUnit(new PolySynth(this.mixer.context, this.pitchTable, synthPresets["pad"]), GPad1);
    this.addUnit(new PolySynth(this.mixer.context, this.pitchTable, synthPresets["arp"]), GArp1);
    this.addUnit(new MonoSynth(this.mixer.context, this.pitchTable, synthPresets["lead1"]), GMelody1);
  }

  start() {
    for (const unitId in this.units) {
      this.generators[unitId] = new this.generatorConstructors[unitId];
    }

    this.patternStep = 0;

    // Prepare sequencer
    this.sequencer.setBPM(120);
    this.sequencer.addStepCallback(this.stepCallback);

    // Add first loops
    this.initState();

    for (const unitId in this.units) {
      this.sequencer.addEvents(this.units[unitId], this.generators[unitId].nextEvents(this.state), this.patternStep);
    }
  }

  stop() {
    this.sequencer.removeStepCallback(this.stepCallback);
    // TODO: Remove channels and do other cleanup, if needed
  }

  initState() {
    const key = 0; // C
    const scale = 5; // Minor
    const startingChord = 0;    // Starting with root

    this.state = {
      key: key,
      scale: scale,
      chord: startingChord,
      scalePitches: this.generateDiatonicScalePitches(key, scale),
    };
  }

  stepCallback(time, step) {
    if (step % 16 == 12) {
      this.patternStep += 16;
      this.nextState();
      for (const unitId in this.units) {
        this.sequencer.addEvents(this.units[unitId], this.generators[unitId].nextEvents(this.state), this.patternStep);
      }
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