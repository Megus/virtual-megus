class AudioFileManager {
  constructor() {
    this.audioBuffers = {};

    this.filePaths = [
      // Drums
      'drums/808/808-bass-drum.mp3',
      'drums/808/808-clap.mp3',
      'drums/808/808-rim-shot.mp3',
      'drums/808/808-snare.mp3',
      'drums/808/808-closed-hat.mp3',
      'drums/808/808-open-hat.mp3',
      'drums/808/808-clave.mp3',
      'drums/808/808-cymbal.mp3',

      // Reverberation impulses
      'impulses/SteinmanFoundationRecordingSuite.wav',
    ];
  }

  /**
   * Load all audio files
   *
   * @param {AudioContext} context
   */
  async loadAudioFiles(context, progressCallback) {
    const filesCount = this.filePaths.length;
    for (let d = 0; d < filesCount; d++) {
      progressCallback(d / filesCount);
      const path = this.filePaths[d];
      const response = await fetch("audio/" + path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);
      const fileName = path.split("/").pop();
      this.audioBuffers[fileName] = audioBuffer;
    }
    progressCallback(1);
  }
}