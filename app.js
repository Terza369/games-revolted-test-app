const Board = require('./models/board');
const Creature = require('./models/creature');
const Avatar = require('./models/avatar');
const random = require('./utility').getRandomInt;
const display = require('./utility').display;
const displayAttackMessage = require('./utility').displayAttackMessage;

const attacksFailedThreshold = 10;

let board = new Board('board.json');

//It is possible to add new entities to the board like this:
//board.entities.push(new Creature(5, 1, 'e' + (board.entities.length + 1)));

//Change from windows 10
//Change from Linux

let entityIds;
let round = 0;

//The following simulation is only for demonstration purposes. I am aware that a real game would not function like this.
while(true) {
    entityIds = board.entities.map(entity => entity.entityId);
    board.attackSuccessCounter = 0;
    board.attackFailedCounter = 0;
    round++;
    display(entityIds);
    display(`ROUND ${round} FIGHT!`);
    //A round is finished after 10 invalid attack attempts in a row
    while(board.attackFailedCounter < attacksFailedThreshold) {
        let validationCode = board.attack(entityIds[random(0, entityIds.length)], entityIds[random(0, entityIds.length)]);
        displayAttackMessage(validationCode);
        //Uncomment the next line to enable saving into a file. It has been commented for easier testing.
        //board.save('board.json');
    }
    //If a round is finnished and there wasn't a single successfull attack, it's game over
    if(board.attackSuccessCounter === 0) break;
    board.resetAttack();
    board.removeDead();
}

display('GAME OVER');

display(board);