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

    // Create modulation sources
    this.pitchMod = context.createGain();

    // Create controls
    this.controls = {};
    for (let cc in preset.cc) {
      this.controls[cc] = context.createConstantSource();
      this.controls[cc].offset.value = 0;
    }

    // Create oscillator bank
    this.oscBank = [];
    for (let c = 0; c < preset.osc.length; c++) {
      let osc;
      if (preset.osc[c].type == "pulse") {
        osc = context.createPulseOscillator();
        osc.width.value = preset.osc[c].width || 0;
      } else {
        osc = context.createOscillator();
        osc.type = preset.osc[c].type;
      }

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

  applyModSource(node, src) {
    if (src[0] == "env") {
      this.envelopes[src[1]].connect(node);
    } else if (src[0] == "lfo") {
      this.lfos[src[1]].connect(node);
    } else if (src[0] == "vel") {
      this.velocitySrc.connect(node);
    }
  }

  applyModToDestination(modNode, dst) {
    if (dst[0] == "output") {
      // Amp
      modNode.connect(this.gainNode.gain);
    } else if (dst[0] == "filter") {
      // Filter modulations
      if (dst[1] == "cutoff") {
        modNode.connect(this.filterNode.frequency);
      }
    } else if (dst[0] == "pitch") {
      // Pitch modulation
      modNode.connect(this.pitchMod);
    } else if (dst[0] == "osc") {
      // Oscillator parameter
      if (dst[2] == "width") {
        modNode.connect(this.oscBank[dst[1]].width);
      }
    }
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

      // Create ADSR envelopes
      let endTime = time;
      this.envelopes = preset.env.map((adsr) => {
        const adsrNode = context.createConstantSource();
        adsrNode.offset.value = 0;
        endTime = Math.max(endTime, this.unit.applyADSR(time, note.durationSeconds, adsr, adsrNode.offset, 0, 1));
        adsrNode.start();
        return adsrNode;
      });

      // Note parameters as sources
      this.velocitySrc = context.createConstantSource();
      this.velocitySrc.offset.value = note.velocity;
      this.velocitySrc.start();

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
        this.applyModSource(modNode, mod.src);

        // Modulation control (if present)
        if (mod.control != null) {
          let modControl = context.createGain();
          modControl.gain.value = 0;
          this.applyModSource(modControl.gain, mod.control);
          modNode.connect(modControl);
          modNode = modControl;
        }

        this.applyModToDestination(modNode, mod.dst);
      });

      this.shutNote(endTime);
    } catch (e) {
      console.log(e);
      console.log(time);
      console.log(note);
    }
  }

  shutNote(time) {
    try {
      this.oscBank.forEach((osc) => osc.stop(time));
      this.envelopes.forEach((env) => env.stop(time));
      this.lfos.forEach((lfo) => lfo.stop(time));
      this.velocitySrc.stop(time);
    } catch (e) {}
  }

  getAudioLevel() {
    return this.envelopes[0].offset.value;
  }
}
