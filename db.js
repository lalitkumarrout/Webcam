//open a database
//Create objectstore
//make transaction
let db;
let openRequest = indexedDB.open("myDatabase");
openRequest.addEventListener("success", (e) => {
  console.log("DB Sucess");
  db = openRequest.result;
});
openRequest.addEventListener("error", (e) => {
  console.log("DB error");
});
openRequest.addEventListener("upgradeneeded", (e) => {
  console.log("DB upgraded and also for intial DB creation");
  db = openRequest.result;
  db.createObjectStore("video", { keyPath: "id" });
  db.createObjectStore("image", { keyPath: "id" });
});
