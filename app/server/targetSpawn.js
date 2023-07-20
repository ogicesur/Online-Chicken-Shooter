class TargetSpawn {
    constructor (id, direction, heightPercent, depthPercent, speed, scoreValue) {
        this.id = id;
        this.direction = direction;
        this.heightPercent = heightPercent;
        this.depthPercent = depthPercent;
        this.speed = speed;
        this.scoreValue = scoreValue;
    }
}
module.exports = TargetSpawn;
