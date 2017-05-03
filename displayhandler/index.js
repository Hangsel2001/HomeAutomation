// const Measurementsdb = require("./measurementsdb");
// const db = new Measurementsdb();
// db.connect().then(() => {
//     setInterval(() => {
//         db.getLatest("Kontor", "temperature").then((data) => {
//             console.log(data);
//         });
//     }, 1000);
// }, (err) => {
//     console.log(err);
// });
const locPage= require("./locationpage");
let page = new locPage({
    location: "Kontor",
    types: ["temperature", "atmospheric pressure"]
});
page.on('update',(text)=> {
    console.log(text);
})