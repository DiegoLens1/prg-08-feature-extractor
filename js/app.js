const video = document.getElementById("webcam");
const label = document.getElementById("label");
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
const options = { numLabels: 3 };
const classifier = featureExtractor.classification(video, options);

const labelOneBtn = document.querySelector("#labelOne");
const labelTwoBtn = document.querySelector("#labelTwo");
const labelThreeBtn = document.querySelector("#labelThree");
const trainbtn = document.querySelector("#train");
const savebtn = document.querySelector("#saveModel");
const loadbtn = document.querySelector("#loadModel");

labelOneBtn.addEventListener("click", () => classifier.addImage('dog', ()=> {console.log("added dog image")}));
labelTwoBtn.addEventListener("click", () => classifier.addImage('cat', ()=> {console.log("added cat image")}));
labelThreeBtn.addEventListener("click", () => classifier.addImage('bird', ()=> {console.log("added bird image")}));
savebtn.addEventListener("click", () => featureExtractor.save());
loadbtn.addEventListener("click", () => featureExtractor.load('./model/model.json', customModelLoaded));

trainbtn.addEventListener("click", () => train());

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

let synth = window.speechSynthesis

function speak(text) {
    if (synth.speaking) {
        console.log('still speaking...')
        return
    }
    if (text !== '') {
        let utterThis = new SpeechSynthesisUtterance(text)
        synth.speak(utterThis)
    }
}

function train() {
    classifier.train((lossValue) => {
        console.log('Loss is', lossValue);
        if(lossValue == null) {
            showClassification()
        }
      })
}

function customModelLoaded() {
    console.log("Custom model loaded")
    showClassification()
}

function showClassification() {
    setInterval(()=>{
        classifier.classify(video, (err, result) => {
            if (err) console.log(err)
            console.log(result)
            label.innerHTML = result[0].label + "   " + result[0].confidence
            speak(result[0].label)
        })
    }, 1000)
}

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
}

// Triggers when the video is ready
function    videoReady() {
  console.log('The video is ready!');
}