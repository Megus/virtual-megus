let generator = null;
let visualizer = null;

function init() {
  visualizer = new Visualizer("visuals");
}

async function play() {
  if (generator == null) {
    generator = new Generator();
  }

  await generator.play();
  visualizer.setSequencer(generator.sequencer);
  document.getElementById("playButton").style.display = "none";
  document.getElementById("stopButton").style.display = "block";
  document.getElementById("buttonContainer").className = "buttonContainer2";
}

function stop() {
  generator.stop();
  document.getElementById("playButton").style.display = "block";
  document.getElementById("stopButton").style.display = "none";
  document.getElementById("buttonContainer").className = "buttonContainer1";
}
