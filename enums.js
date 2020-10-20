const entities = {
    creature: 1,
    avatar: 2
}

const modifiers = {
    armour: 1,
    vulnerability: 2,
    armourPercentage: 3,
    vulnerabilityPercentage: 4,
    armourMultiplication: 5,
    vulnerabilityMultiplication: 6
}

const attackMessages = {
    attackApproved: 0,
    attackerDead: {
        avatar: 1,
        creature: 2 
    },
    creatureCantAttackAvatar: 3,
    targetDead: {
        avatar: 4,
        creature: 5
    },
    notAttackReady: {
        avatar: 6,
        creature: 7
    }
}

exports.entities = entities;
exports.modifiers = modifiers;
exports.attackMessages = attackMessages;