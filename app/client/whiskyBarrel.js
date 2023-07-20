import { AbstractObstacle } from './abstractObstacle.js';

export class WhiskyBarrel extends AbstractObstacle {

    constructor(world, x, id) {
        const IMAGE = './resources/whiskyBarrel.png';
        const RELATIVE_Y_POSITION = 0.5;
        const RELATIVE_SIZE = 0.7;
        const RELATIVE_DISTANCE = 0.15;
        const RELATIVE_HITBOX_SIZE = {
            width: 0.63,
            height: 1
        };
        const RELATIVE_HITBOX_OFFSET = {
            x: 0.04,
            y: 0.01
        };
        super(world, x, id, IMAGE, RELATIVE_Y_POSITION, RELATIVE_SIZE, RELATIVE_DISTANCE, RELATIVE_HITBOX_SIZE, RELATIVE_HITBOX_OFFSET);
    }
}