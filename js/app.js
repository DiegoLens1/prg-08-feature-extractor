const video = document.getElementById("webcam");
const label = document.getElementById("label");
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
const options = { numLabels: 3 };
let classifier = Object

const objectAmountInput = document.querySelector("#objectAmount");
const objectAmountInputbtn = document.querySelector("#objectAmountbtn");
const createNewObject = document.querySelector("#createNewObject");
const createNewObjectbtn = document.querySelector("#createNewObjectbtn");
const trainbtn = document.querySelector("#train");
const savebtn = document.querySelector("#saveModel");
const loadbtn = document.querySelector("#loadModel");

objectAmountInputbtn.addEventListener("click", () => setObjectAmount(objectAmountInput.value));
createNewObjectbtn.addEventListener("click", () => addNewObject(createNewObject.value));
savebtn.addEventListener("click", () => featureExtractor.save());
loadbtn.addEventListener("click", () => loadCustomModel());

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

function setObjectAmount(amount) {
    options["numLabels"] = parseInt(amount);
    classifier = featureExtractor.classification(video, options);
}

function addNewObject(objectName) {
    if(objectName == "" || document.querySelector("#buttonWrapper").childElementCount >= options["numLabels"]) return;
    let newObject = document.createElement("button");
    newObject.innerHTML = objectName;
    newObject.addEventListener("click", () => classifier.addImage(objectName, ()=> {console.log("added " + objectName + " image")}));
    document.querySelector("#buttonWrapper").appendChild(newObject);
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

function loadCustomModel() {
    if(Error) setObjectAmount(options["numLabels"])
    featureExtractor.load('./model/model.json', customModelLoaded)
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