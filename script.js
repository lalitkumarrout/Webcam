let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recordflag = false;
let transparentColor = "transparent";

let recorder;
let chunks = []; //Media data in chunks

let constraints = {
  video: true,
  audio: true,
};

//navigator=navigator is a Global object who tells about browser related information.

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;

  recorder = new MediaRecorder(stream);
  recorder.addEventListener("start", (e) => {
    chunks = [];
  });
  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });
  recorder.addEventListener("stop", (e) => {
    //conversion of media chunks data to video
    let blob = new Blob(chunks, { type: "video/mp4" });

    if(db){
      let videoid=shortid();
      let dbTransaction=db.transaction("video","readwrite");
      let videoStore=dbTransaction.objectStore("video");
      let videoEntry={
        id:`vid-${videoid}`,
        blobData:blob
      }
      videoStore.add(videoEntry);
    }
    // let videoURL = URL.createObjectURL(blob);

    // let a = document.createElement("a");
    // a.href = videoURL;
    // a.download = "stream.mp4";
    // a.click();
  });
});
recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) return;

  recordflag = !recordflag;

  if (recordflag) {
    //start
    recorder.start();
    recordBtn.classList.add("scale-record");
    strattimer();
  } else {
    //stop
    recorder.stop();
    recordBtn.classList.remove("scale-record");
    stoptimer();
  }
});
captureBtnCont.addEventListener("click", (e) => {
  captureBtn.classList.add("scale-capture");

  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let tool = canvas.getContext("2d");
  tool.drawImage(video, 0, 0, canvas.width, canvas.height);
  //Fitering
    tool.fillStyle=transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height)
  let imageURL = canvas.toDataURL();

  if(db){
    let imageid=shortid();
    let dbTransaction=db.transaction("image","readwrite");
    let imageStore=dbTransaction.objectStore("image");
    let imageEntry={
      id:`img-${imageid}`,
      url:imageURL
    }
    imageStore.add(imageEntry);
  }
  setTimeout(()=>{
    captureBtn.classList.remove("scale-capture");
  },500)
  
});
let timerID;
let counter = 0; //represents total seconds
let timer = document.querySelector(".timer");
function strattimer() {
  timer.style.display = "block";
  function displayTimer() {
    let totalseconds = counter;
    let hours = Number.parseInt(totalseconds / 3600);
    totalseconds = totalseconds % 3600; //remaining value
    let minutes = Number.parseInt(totalseconds / 60);
    totalseconds = totalseconds % 60;
    let seconds = totalseconds;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    timer.innerText = `${hours}:${minutes}:${seconds}`;
    counter++;
  }
  timerID = setInterval(displayTimer, 1000);
}

function stoptimer() {
  clearInterval(timerID);
  timer.innerText = "00:00:00";
  timer.style.display = "none";
}
//filtering logic
let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        // Get style
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })
})
