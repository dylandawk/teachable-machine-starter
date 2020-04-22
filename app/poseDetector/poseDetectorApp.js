//const p5 = require("p5");

// Update this following link to your own model link
const poseModelUrl = 'https://teachablemachine.withgoogle.com/models/t3USek1O1/';
const poseModelUrl_test = 'https://teachablemachine.withgoogle.com/models/wbcfYVWAX/';
let serial;// variable to hold an instance of the serialport library
let portName = '/dev/tty.usbmodem1453301';// fill in your serial port name here
// the json file (model topology) has a reference to the bin file (model weights)
const checkpointURL = poseModelUrl_test + "model.json";
// the metatadata json file contains the text labels of your model and additional information
const metadataURL = poseModelUrl_test + "metadata.json";

const size = 300;
let webcamEl;
let model;
let totalClasses;
let myCanvas;
let ctx;
let setup;

let outByte = 0;// for outgoing data
let latestData = "waiting for data";

// A function that loads the model from the checkpoint
async function load() {
  model = await tmPose.load(checkpointURL, metadataURL);
  totalClasses = model.getTotalClasses();
  console.log("Number of classes, ", totalClasses);
}

async function loadWebcam() {
  webcamEl = new tmPose.Webcam(size, size); // can change width and height
  await webcamEl.setup();
  await webcamEl.play();
}

const p5draw = (p) => {

    p.setup = async () => {
        serial = new p5.SerialPort();    // make a new instance of the serialport library
        serial.open(portName);           // open a serial port
        serial.on('error', serialError); // callback for errors
        serial.on('open', gotOpen);
        serial.on('close', gotClose);
        myCanvas = p.createCanvas(size, size);
        ctx = myCanvas.elt.getContext("2d");
        // Call the load function, wait until it finishes loading
        await load();
        await loadWebcam();
        predictVideo(webcamEl);
    }
    function gotOpen() {
        print("Serial Port is Open");
    }
       
    function gotClose(){
        print("Serial Port is Closed");
        latestData = "Serial Port is Closed";
    } 

    function serialError(err) {
        console.log('Something went wrong with the serial port. ' + err);
    }

    async function predictVideo(image) {
        if (image.canvas) {
            // Prediction #1: run input through posenet
            // predictPosenet can take in an image, video or canvas html element
            const flipHorizontal = false;
            const { pose, posenetOutput } = await model.estimatePose(
            webcamEl.canvas,
            flipHorizontal
            );
            // Prediction 2: run input through teachable machine assification model
            const prediction = await model.predict(
            posenetOutput,
            flipHorizontal,
            totalClasses
            );

            console.log('prediction', prediction)
            // // Show the result
            // const res = select('#res'); // select <span id="res">
            // res.html(prediction[0].className);
        
            // // Show the probability
            // const prob = select('#prob'); // select <span id="prob">
            // prob.html(prediction[0].probability.toFixed(2));

            // draw the keypoints and skeleton
            ctx.drawImage(image.canvas, 0, 0);
            if (pose) {
                const minPartConfidence = 0.5;
                drawKeypoints(pose, minPartConfidence);
                // console.log(pose);
                //tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
                //tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
            }
            
            
           // console.log(prediction[0].className);
            // Send result to arduino
            if (prediction[0].probability > 0.8) {  
                outByte = 1;
            } else {
                outByte = 0;
            }
            // send it out the serial port:
            console.log('outByte: ', outByte)
            serial.write(outByte);
            
            // Wait for 0.2 second before classifying again
            image.update();
            setTimeout(() => predictVideo(webcamEl), 100);
        }
    }

    // A function to draw ellipses over the detected keypoints
    function drawKeypoints(pose, minPartConfidence)  {

        // For each pose detected, loop through all the keypoints
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > minPartConfidence) {
                p.fill(255, 0, 0);
                p.noStroke();
                p.ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }

    }
  
}

module.exports = function setup() {
	const myp5 = new p5(p5draw, "main");
}
