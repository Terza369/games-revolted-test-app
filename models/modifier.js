const modifiersEnum = require('../enums').modifiers;

module.exports = class Modifier {
    constructor(modifierType = 1, value = 1) {
        this.modifierType = modifierType;
        this.value = value;
    }

    apply(attack) {
        if(this.modifierType === modifiersEnum.armour) {
            return this.armour(attack);
        }
        if (this.modifierType === modifiersEnum.vulnerability) {
            return this.vulnerability(attack);
        }
        if(this.modifierType === modifiersEnum.armourPercentage) {
            return this.armourPercentage(attack);
        }
        if (this.modifierType === modifiersEnum.vulnerabilityPercentage) {
            return this.vulnerabilityPercentage(attack);
        }
        if(this.modifierType === modifiersEnum.armourMultiplication) {
            return this.armourMultiplication(attack);
        }
        if (this.modifierType === modifiersEnum.vulnerabilityMultiplication) {
            return this.vulnerabilityMultiplication(attack);
        }
    }

    armour(attack) {
        attack = attack - this.value;
        if(attack < 0) {
            attack = 0;
        }
        return attack;
    }

    vulnerability(attack) {
        return attack + this.value;
    }

    armourPercentage(attack) {
        return attack * (this.value / 100);
    }

    vulnerabilityPercentage(attack) {
        return attack + (attack * (this.value / 100));
    }

    armourMultiplication(attack) {
        return attack / this.value;
    }

    vulnerabilityMultiplication(attack) {
        return attack * this.value;
    }
}