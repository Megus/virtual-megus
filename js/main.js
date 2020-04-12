let sharedConductor = null;
let visualizer = null;

function init() {
  sharedConductor = new Conductor();
  visualizer = new Visualizer("visuals");
}

function play() {
  document.getElementById("playButton").style.display = "none";
  document.getElementById("stopButton").style.display = "block";
  document.getElementById("pauseButton").style.display = "block";
  document.getElementById("buttonContainer").className = "buttonContainer2";
  sharedConductor.setVisualizer(visualizer);
  sharedConductor.play();
}

function stop() {
  document.getElementById("playButton").style.display = "block";
  document.getElementById("stopButton").style.display = "none";
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("buttonContainer").className = "buttonContainer1";
  sharedConductor.stop();
}

function pause() {
  document.getElementById("playButton").style.display = "block";
  document.getElementById("stopButton").style.display = "none";
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("buttonContainer").className = "buttonContainer1";
  sharedConductor.pause();
}
