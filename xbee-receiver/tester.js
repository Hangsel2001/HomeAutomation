var dateFormat = require('dateformat');
const readline = require('readline');
var RadioOperator = require('./radioOperator.js').Operator;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var port = "COM7";



var devices = [];
var deviceNames = [];
deviceNames["0013a20040d87029"] = { name: "Car Port", address: "0013a20040d87029" };
var address = "0013a20040d87029";

var radio = new RadioOperator(port);

radio.on("namerequest", function (address) { 
    console.log("Name Request: " + address);
});
radio.on("timerequest", function (address) {
    console.log("Time Request: " + address);
});
radio.on("measurement", function (data) { 
    console.log(data);
});

rl.setPrompt('XBee> ');
rl.prompt();

rl.on('line', function (line) {
switch (line.trim()) {
    case 'time':
            radio.sendCurrentTime(address);
            break;
        case 'name':
            radio.sendDeviceName(address);
            break;
        case 'message':
            radio.sendMessage(address);
            break;
        default:
            break;    
    }
    rl.setPrompt('XBee> ');
    rl.prompt();
}).on('close', function ()  {
    console.log('Have a great day!');
    process.exit(0);
});


