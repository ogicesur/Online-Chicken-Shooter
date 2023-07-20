import { AbstractObstacle } from './abstractObstacle.js';

export class ShipWreck extends AbstractObstacle {

constructor(world, x, id) {
        const IMAGE = './resources/shipWreck.png';
        const RELATIVE_Y_POSITION = 0.6;
        const RELATIVE_SIZE = 0.4;
        const RELATIVE_DISTANCE = 0.7;
        const RELATIVE_HITBOX_SIZE = {
            width: 0.9,
            height: 0.75
        };
        const RELATIVE_HITBOX_OFFSET = {
            x: 0.05,
            y: 0.1
        };
        super(world, x, id, IMAGE, RELATIVE_Y_POSITION, RELATIVE_SIZE, RELATIVE_DISTANCE, RELATIVE_HITBOX_SIZE, RELATIVE_HITBOX_OFFSET);
    }
}