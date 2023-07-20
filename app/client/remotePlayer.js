import {Coord} from './coord.js';
import {Hitbox} from './hitbox.js';
import {AbstractSolidObject} from './abstractSolidObject.js';

export class RemotePlayer extends AbstractSolidObject {
    constructor (world) {
        const IMAGE = './resources/otherplayer.png';
        const RELATIVE_Y_POSITION = 0.74;
        const RELATIVE_SIZE = 0.15;
        const RELATIVE_HITBOX_SIZE = {
            width: 0.25,
            height: 0.93
        };
        const RELATIVE_HITBOX_OFFSET = {
            x: 0.24,
            y: 0.06
        };
        const ID = 0;

        let outsideMapStartX = -200;

        let size = world.height * RELATIVE_SIZE;
        let position = new Coord(outsideMapStartX, world.height * RELATIVE_Y_POSITION, 0);
        position.z = world.depth - world.localPlayer.position.z;

        let hitboxOffset = { 
            x: size*RELATIVE_HITBOX_OFFSET.x, 
            y: size*RELATIVE_HITBOX_OFFSET.y
        };
        let hitbox = new Hitbox(
            size * RELATIVE_HITBOX_SIZE.width, 
            size * RELATIVE_HITBOX_SIZE.height, 
            hitboxOffset
        );

        let image = new Image(size, size);
        image.src = IMAGE;

        super(world, position, hitbox, image, size, ID);

        this.alive = true;
        this.readyStatus = false;
        this.isConnected = false;

        if(this.world.debug) {
            console.log("Remote Player: ", this);
        }
    }

    updatePosition(x) {
        if(this.world.debug) {
            console.log("Remote Player position: ", this);
        }
        this.position.x = x;
    }

    setZ(z) {
        this.position.z = z;
    }
}