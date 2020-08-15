// Single voice of subtractive synths (MonoSynth, PolySynth)
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class SubSynthVoice {
  /**
   * SubSyntVoice constructor
   *
   * @param {Unit} unit
   */
  constructor(unit) {
    this.unit = unit;

    const preset = unit.voicePreset;
    const context = unit.context;

    this.filterNode = context.createBiquadFilter();
    this.filterNode.type = preset.filter.type;
    this.filterNode.Q.value = preset.filter.resonance;
    this.filterNode.frequency.value = preset.filter.cutoff;

    this.pannerNode = context.createStereoPanner();
    this.gainNode = context.createGain();
    this.gainNode.gain.value = 0;

    this.filterNode.connect(this.pannerNode);
    this.pannerNode.connect(this.gainNode);

    this.pitchMod = context.createGain();

    this.oscBank = [];
    for (let c = 0; c < preset.osc.length; c++) {
      const osc = context.createOscillator();
      osc.type = preset.osc[c].type;
      osc.detune.value = preset.osc[c].detune;
      this.pitchMod.connect(osc.detune);
      const oscGain = context.createGain();
      oscGain.gain.value = preset.osc[c].level;
      osc.connect(oscGain);
      oscGain.connect(this.filterNode);
      this.oscBank.push(osc);
    }
    this.oscBank[0].onended = () => unit.onVoiceStop(this);

    this.output = this.gainNode;
  }

  playNote(time, note) {
    const preset = this.unit.voicePreset;
    const context = this.unit.context;

    try {
      // Apply panning
      if (preset.panning != null) {
        let pan = preset.panning.pan;
        if (preset.panning.spread != null) {
          pan += (note.pitch - preset.panning.centerPitch) * preset.panning.spread;
        }

        this.pannerNode.pan.setValueAtTime(this.unit.clamp(pan, -1, 1), time);
      }

      // Set frequencies
      for (let c = 0; c < this.oscBank.length; c++) {
        this.oscBank[c].frequency.setValueAtTime(this.unit.pitchTable[note.pitch + preset.osc[c].pitch], time);
        this.oscBank[c].start(time);
      }

      this.velocity = note.velocity;

      let endTime = time;
      // Create ADSR envelopes
      this.envelopes = preset.env.map((adsr) => {
        const adsrNode = context.createConstantSource();
        adsrNode.offset.value = 0;
        endTime = Math.max(endTime, this.unit.applyADSR(time, note.durationSeconds, adsr, adsrNode.offset, 0, 1));
        adsrNode.start();
        return adsrNode;
      });

      // Create LFOs
      if (preset.lfo != null) {
        this.lfos = preset.lfo.map((lfo) => {
          const lfoNode = context.createOscillator();
          lfoNode.type = lfo.type;
          lfoNode.frequency.value = lfo.rate;
          lfoNode.start();
          return lfoNode;
        });
      }

      // Apply modulation
      preset.mod.forEach((mod) => {
        // Create modulation source
        let modNode = context.createGain();
        modNode.gain.value = mod.amount;
        if (mod.src[0] == "env") {
          this.envelopes[mod.src[1]].connect(modNode);
        } else if (mod.src[0] == "lfo") {
          this.lfos[mod.src[1]].connect(modNode);
        }

        if (mod.dst[0] == "output") {
          // Amp
          modNode.connect(this.gainNode.gain);
        } else if (mod.dst[0] == "filter") {
          // Filter modulations
          if (mod.dst[1] == "cutoff") {
            modNode.connect(this.filterNode.frequency);
          }
        } else if (mod.dst[0] == "pitch") {
          // Pitch modulation
          modNode.connect(this.pitchMod);
        }
      });

      this.shutNote(endTime);
    } catch (e) {
      console.log(e);
      console.log(time);
      console.log(note);
    }

  }

  shutNote(time) {
    for (let c = 0; c < this.oscBank.length; c++) {
      try {
        this.oscBank[c].stop(time);
      } catch (e) {}
    }
  }

  getAudioLevel() {
    return this.envelopes[0].offset.value;
  }
}
