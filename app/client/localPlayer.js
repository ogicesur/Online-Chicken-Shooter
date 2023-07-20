import {Coord} from './coord.js';

export class LocalPlayer {
    constructor () {
        this.position = new Coord(0, 0, 0);
        this.readyStatus = false;
        this.wounded = false;
        this.maxBloodFrames = 150;
        this.bloodFrames = this.maxBloodFrames;
    }

    update(x) {
        this.position.x = x;
    }

    setZ(z) {
        this.position.z = z;
    }

    async wound() {
        this.wounded = true;
        await this.sleep(5000);
        this.wounded = false;
        this.bloodFrames = this.maxBloodFrames;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}