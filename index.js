const {RaspiIO} = require('raspi-io');
const Five = require('johnny-five');
const OledJS = require('oled-js');
const Font = require('oled-font-5x7');
const exec = require('child_process').exec;

// Globals
const BOARD = new Five.Board({io: new RaspiIO()});
const INTERVAL = {time: 2000, speedTest: 60000};
const ANIM = [">   ", ">>  ", ">>> ", ">>>>"];
const OPTS = {width: 128, height: 32, address: 0x3c};
let animIndex = 0;
let data = {time: '', speed: ''};
let startDate = new Date();
let shouldUpdateSpeed = true;

//const execSpeedTest = () => {
//    if(shouldUpdateSpeed) {
//        console.log('Exec speedTest...');
//        shouldUpdateSpeed = false;
//        exec('speedtest --simple | awk \'NR==2{print$2" "$3}\'', (err, res, code) => {
//            if(err === null) {
//                console.log("speedTest done");
//                console.log(err, res, code);
//                data.speed = res.replace(/\\\//g, "/").replace('Mbit/s', 'MB');
//                startDate = new Date();
//            } else {
//                console.error("ERROR: Speedtest failed to retrieve data!", err, res, code);
//            }
//            shouldUpdateSpeed = true;
//        });
//    }
//};
const execSpeedTest = () => {
    console.log("executing command");
    return new Promise(acc => {
        exec('speedtest --simple | awk \'NR==2{print$2" "$3}\'', (err, res, code) => {
            acc();
            data.speed = res.replace(/\\\//g, "/").replace('Mbit/s', 'MB');
        });
    }).then(() => setTimeout(function() { execSpeedTest(); }, 1000));
};

const getTimeDiff = startDate => {
    const endDate = new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime()) / 1000;
    let date = new Date(null);
    date.setSeconds(diffTime); // specify value for SECONDS here
    return date.toISOString().substr(14, 5);
};

execSpeedTest(); // Run on start
BOARD.on('ready', () => {
    const oled = new OledJS(BOARD, Five, OPTS);

    // Clear screen
    oled.fillRect(0, 0, 128, 32, 0);
    oled.clearDisplay();

    // Main Loop
    setInterval(() => {
        // Display anim
        oled.setCursor(0, 18);
        oled.writeString(Font, 2, ANIM[animIndex], 1, false, 2);
        animIndex = animIndex < 3 ? animIndex + 1 : 0;
        // Display Speed
        oled.setCursor(0, 0);
        oled.writeString(Font, 2, data.speed, 1, false, 2);
        // Display Time
        data.time = getTimeDiff(startDate);
        oled.setCursor(64, 18);
        oled.writeString(Font, 2, data.time, 1, true, 2);
        // console.log(JSON.stringify(data));
    }, INTERVAL.time);
});