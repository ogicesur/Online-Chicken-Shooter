export class Hitbox {
    constructor(width, height, offset) {
        this.height = height;
        this.width = width;
        this.offset = {
            x: offset.x,
            y: offset.y
        };
    }

    checkForHitboxMatch(objCoord, shot) {

        let min = {
            x : (objCoord.x + this.offset.x),
            y : (objCoord.y + this.offset.y)
        };
        let max = {
            x : (objCoord.x + this.offset.x + this.width),
            y : (objCoord.y + this.offset.y + this.height)
        };

        if (min.x <= Math.floor(shot.x) && Math.floor(shot.x) <= max.x) {
            if (min.y <= Math.floor(shot.y) && Math.floor(shot.y) <= max.y) {
                return true;
            }
        }
        return false;
    }
}