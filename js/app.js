const video = document.getElementById("webcam");
const label = document.getElementById("label");

const labelOneBtn = document.querySelector("#labelOne");
const labelTwoBtn = document.querySelector("#labelTwo");
const labelThreeBtn = document.querySelector("#labelThree");
const trainbtn = document.querySelector("#train");

labelOneBtn.addEventListener("click", () => classifier.addImage('dog', ()=> {console.log("added dog image")}));
labelTwoBtn.addEventListener("click", () => classifier.addImage('cat', ()=> {console.log("added cat image")}));
labelThreeBtn.addEventListener("click", () => classifier.addImage('bird', ()=> {console.log("added bird image")}));

trainbtn.addEventListener("click", () => classifier.train((lossValue) => {
    console.log('Loss is', lossValue);
  }));

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.log("Something went wrong!");
        });
}

setInterval(()=>{
    classifier.classify(video, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        label.innerHTML = result[0].label
    })
}, 1000)

// Extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
}

// Create a new classifier using those features and with a video element
const classifier = featureExtractor.classification(video, videoReady);

// Triggers when the video is ready
function videoReady() {
  console.log('The video is ready!');
}

// Add a new image with a label
classifier.addImage(document.getElementById('dogA'), 'dog');

// Retrain the network
classifier.train((lossValue) => {
    console.log('Loss is', lossValue)
})

// Get a prediction for that image
classifier.classify(document.getElementById('dogB'), (err, result) => {
  console.log(result); // Should output 'dog'
});
