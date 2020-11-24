const fs = require('fs');
const path = require('path');

const entitiesEnum = require('../enums').entities;
const Avatar = require('./avatar');
const Creature = require('./creature');
const Modifier = require('./modifier');
const display = require('../utility').display;
const attackMessages = require('../enums').attackMessages;

module.exports = class Board {

    constructor(boardFile) {
        this.entities = [];
        this.attackFailedCounter = 0;
        this.attackSuccessCounter = 0;
        if(boardFile) {
            const entitiesTemp = JSON.parse(fs.readFileSync(path.join(require.main.path, boardFile)));
            entitiesTemp.forEach((entity, i) => {
                let entityTemp;
                if(entity.entityType === entitiesEnum.creature) {
                    entityTemp = new Creature(entity.health, entity.atack, entity.entityId || i + 1);
                } else if(entity.entityType === entitiesEnum.avatar) {
                    entityTemp = new Avatar(entity.health, entity.atack, entity.entityId || i + 1);
                } else {
                    throw new Error(`Invalid entity type in ${boardFile}`);
                }
                if(entity.modifiers.length > 0) {
                    entity.modifiers.forEach(modifier => entityTemp.modifiers.push(new Modifier(modifier.modifierType, modifier.value)));
                }
                this.entities.push(entityTemp);
            })
        }
    }

    attack(sourceId, targetId) {
        if(sourceId === targetId) return;

        //Load up the entities
        const source = this.entities.find(entity => entity.entityId === sourceId);
        const target = this.entities.find(entity => entity.entityId === targetId);

        display(`${sourceId} initiated attack on ${targetId}`);

        //Check if attack is valid
        let validityCode = this.attackValidityCheck(source, target);
        
        //If validity code anything but 0, attack is invalid
        if(validityCode) {
            this.attackFailedCounter++;
            return validityCode;
        } else {
            //Apply modifiers
            let sourceModifiedAttack = source.attack;
            let targetModifiedAttack = target.attack;
    
            target.modifiers.forEach(modifier => {
                sourceModifiedAttack = modifier.apply(source.attack);
            });
            source.modifiers.forEach(modifier => {
                targetModifiedAttack = modifier.apply(target.attack);
            });
    
            //Perform attack
            target.health = target.health - sourceModifiedAttack;
            display(`${source.entityId} attacked ${target.entityId} for ${sourceModifiedAttack} dmg`);
            source.attackReady = false;

            //Attacking with 0 attack counts as failed attack to avoid infinite loop where Avatar attacks creature who has armour but creature can't attack avatar
            if(sourceModifiedAttack === 0) {
                this.attackFailedCounter++;
            } else {
                this.attackFailedCounter = 0;
                this.attackSuccessCounter++;
            }

            //Check if retaliation is possible
            if(target.health <= 0) {
                display(`${target.entityId} died`);
                target.attackReady = false;
                target.health = 0;
            } else {
                validityCode = this.attackValidityCheck(target, source);

                if(validityCode) {
                    return;
                } else {
                    //Perform retaliation
                    source.health = source.health - targetModifiedAttack;
                    display(`${target.entityId} retaliated for ${targetModifiedAttack} dmg`);
        
                    if(source.health <= 0) {
                        source.health = 0;
                        display(`${source.entityId} died`);
                    }
                }
            }
            return validityCode;
        }
    }

    attackValidityCheck(source, target) {
        if(source.health === 0 && source instanceof Avatar) {
            return attackMessages.attackerDead.avatar;
        }
        if(source.health === 0 && source instanceof Creature) {
            return attackMessages.attackerDead.creature;
        }
        if((source instanceof Creature) && (target instanceof Avatar)) {
            return attackMessages.creatureCantAttackAvatar;
        }
        if(target.health === 0 && target instanceof Avatar) {
            return attackMessages.targetDead.avatar;
        }
        if(target.health === 0 && target instanceof Creature) {
            return attackMessages.targetDead.creature;
        }
        if(!source.attackReady && source instanceof Avatar) {
            return attackMessages.notAttackReady.avatar;
        }
        if(!source.attackReady && source instanceof Creature) {
            return attackMessages.notAttackReady.creature;
        }
        return attackMessages.attackApproved;
    }

    save(boardFile) {
        fs.writeFileSync(path.join(require.main.path, boardFile), JSON.stringify(this.entities));
    }

    removeDead() {
        this.entities = this.entities.filter(entity => entity.health > 0)
    }

    resetAttack() {
        this.entities = this.entities.map(entity => {
            entity.attackReady = true;
            return entity;
        });
    }
}