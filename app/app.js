// Require different files to change behavior
//  const setup = require("./imageDetector/imageDetectorApp");
// const setup = require("./soundDetector/soundDetectorApp");
// const setup = require("./drawDetector/drawDetectorApp");
const setup = require("./poseDetector/poseDetectorApp");

// Calls the setup function when the page is loaded
window.addEventListener("DOMContentLoaded", setup);
