const modifiers = require('../enums').modifiers;
const Modifier = require('./modifier');

module.exports = class Entity {
    static counter = 0;

    constructor(health = 1, attack = 1, entityId) {
        this.entityId = entityId;
        this.health = health;
        this.attack = attack;
        this.attackReady = true;
        this.modifiers = [];
    }

    addArmour(value) {
        this.modifiers.push(new Modifier(modifiers.armour, value));
    }

    addVulnerability(value) {
        this.modifiers.push(new Modifier(modifiers.vulnerability, value));
    }
}