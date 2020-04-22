Teachable Machine Scaffold
===========================

This app is a very small scaffold to get you started using Teachable Machine. It will require an internet connection to work, since it loads ml5 as well as TensorFlow from a CDN.

## PoseDetection

The initial scaffold contained code for Image and Audio models used in Teaachable Machine. In this project I added a framework for using the pose detection model as well.  In this particular instance, I used a pose where, seated in from of the camera with arms raised will be classified one way and a default class for everything else.  Based, on the detected class a byte is sent to an Arduino running a sketch that turns on a light.

![Pose Turning on light example](https://media.giphy.com/media/f41cUnkqowBNBmMM9g/giphy.gif)


## Basic Usage

```
npm run watch
```

will start a webpack server at localhost:3000. 

## Attribution
A long time ago this was a starter on Glitch using React and Webpack. It was copied by @starakaj, and then React has been removed You can find the original at https://glitch.com/~starter-react.

This project relates to video 2 of 5 in the [React Starter Kit](https://glitch.com/react-starter-kit) video series.
