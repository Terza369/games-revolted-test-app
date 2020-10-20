const Entity = require("./entity");
const entities = require('../enums').entities;

module.exports = class Avatar extends Entity {
    constructor(health = 1, attack = 1, entityId) {
        super(health, attack, entityId);
        this.entityType = entities.avatar;
    }
}