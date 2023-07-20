import { Coord } from './coord.js';

export class Hitmarker {
    constructor(world, position, hitByLocalPlayer, scoreValue, localCamparisonValue) {
        this.world = world;
        this.position = position;
        this.hitByLocalPlayer = hitByLocalPlayer;
        this.scoreValue = scoreValue;
        this.localCamparisonValue = localCamparisonValue;
        this.framesToLive = 50;
        this.fontSize = 30;
        this.height = this.position.y;
    }

    render() {
        if (this.framesToLive > 0) {
            this.height = this.position.y - (this.world.height / 200) * (50 - this.framesToLive);
            this.framesToLive -= 1;

            if (this.hitByLocalPlayer) {
                this.world.font(this.fontSize, "green");
            } else {
                this.renderLocalComparison();
                this.world.font(this.fontSize, "red");
            }
            this.world.context.fillText(this.scoreValue, this.position.x, this.height);
        }
    }

    renderLocalComparison() {
        this.world.font(this.fontSize, "black");
        let yOffset = (this.world.height*0.04);
        this.world.context.fillText(this.localCamparisonValue, this.position.x, this.height + yOffset);
    }
}