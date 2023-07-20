import { Coord } from './coord.js';

export class Bullet {

    constructor(world) {
        this.world = world;
        this.rawCoord = new Coord(0,0,undefined);
        this.worldCoord = new Coord(0,0,undefined);
    }

    load(clickEvent) {
        this.rawCoord = new Coord(
            clickEvent.clientX,
            clickEvent.clientY,
            undefined);
        this.worldCoord = new Coord(
            this.rawCoord.x + this.world.localPlayer.position.x,
            this.rawCoord.y - this.world.verticalMargin,
            undefined);
    }

    isOnCanvas() {
        let xLeftOfRightBorder = this.rawCoord.x <= this.world.canvas.width;
        let yAboveLowerBorder = this.rawCoord.y <= this.world.canvas.height + this.world.verticalMargin;
        let yBelowUpperBorder = this.rawCoord.y >= this.world.verticalMargin;
        if(this.world.debug) {
            console.log(this.rawCoord,xLeftOfRightBorder,yAboveLowerBorder,yBelowUpperBorder);
        }
        let onCanvas = xLeftOfRightBorder && yAboveLowerBorder && yBelowUpperBorder;
        return (onCanvas);
    }

    render() {
        if (this.world.debug) {
            this.world.context.beginPath();
            this.world.context.moveTo(this.worldCoord.x, this.worldCoord.y);
            this.world.context.lineTo(this.worldCoord.x, this.worldCoord.y+50);
            this.world.context.lineTo(this.worldCoord.x+50, this.worldCoord.y);
            this.world.context.closePath();

            this.world.context.strokeStyle = 'black';
            this.world.context.stroke();
            this.world.context.fillStyle = "red";
            this.world.context.fill();
        }
    }
}