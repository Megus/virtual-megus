'use strict';

class FX {
  /**
   * Base constructor for all FX subclasses
   *
   * @param {AudioContext} context
   * @param {string} fxType
   */
  constructor(context, fxType) {
    this.context = context;
    this.fxType = fxType;
  }

  dispose() {}

}