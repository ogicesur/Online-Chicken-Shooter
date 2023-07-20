const TargetSpawn = require('./targetSpawn.js');

class TargetSpawnFactory {
    constructor (baseScoreValue) {
      this.baseScoreValue = baseScoreValue;
      this.currentId = 1;
    }

    createNewTargetSpawn() {
      let randomDirectionBoolean = Math.random() >= 0.5;
      let direction = 1;
      if(randomDirectionBoolean) {
        direction = -1;
      }
      let heightPercent = this.getRandomInteger(15,95)/100;
      let depthPercent = this.getRandomInteger(2,98)/100;
      let speed = this.generateSpeedModifier();
      let scoreValue = this.calculateScoreBaseValue(speed);
      let targetSpawn = new TargetSpawn(this.currentId, direction, heightPercent, depthPercent, speed, scoreValue);
      this.currentId++;
      return targetSpawn;
    }

    calculateScoreBaseValue(speed) {
      let scoreValue = this.baseScoreValue + (speed**2)/10;
      scoreValue = scoreValue.toFixed(1);
      return scoreValue;
    }

    generateSpeedModifier() {
      let randomInt = this.getRandomInteger(0, 100);
      let modifier = 10*Math.exp(-0.1*(-7+0.15*randomInt)**2)+1; //min 1, up to 11
      modifier = modifier.toFixed(1);
      return modifier;
    }

    getRandomInteger(min, max) {
      return Math.floor(Math.random() * (max - min) ) + min;
    }

    reset() {
      this.currentId = 1;
    }
}
module.exports = TargetSpawnFactory;
