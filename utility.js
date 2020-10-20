const attackMessages = require('./attack-messages');

exports.getRandomInt = function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

exports.displayAttackMessage = function(code) {
    if(!code) {
        return;
    }
    console.log(attackMessages[code]);
}

exports.display = function(message) {
    console.log(message);
}