let core = null;
let currentComposer = null;

function init() {
  core = new Core();
  document.getElementById("playButton").focus();
}

async function play() {
  document.getElementById("playButton").style.display = "none";
  if (currentComposer == null) {
    currentComposer = new Composer1();
  }
  await core.play(currentComposer);

  document.getElementById("stopButton").style.display = "block";
  document.getElementById("pauseButton").style.display = "block";
  document.getElementById("buttonContainer").className = "buttonContainer2";
  document.getElementById("stopButton").focus();
}

function stop() {
  document.getElementById("playButton").style.display = "block";
  document.getElementById("stopButton").style.display = "none";
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("buttonContainer").className = "buttonContainer1";
  document.getElementById("playButton").focus();
  core.stop();
  currentComposer = null;
}

function pause() {
  document.getElementById("playButton").style.display = "block";
  document.getElementById("stopButton").style.display = "none";
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("buttonContainer").className = "buttonContainer1";
  core.pause();
}
