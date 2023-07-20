import { AbstractObstacle } from './abstractObstacle.js';

export class OrangeTree extends AbstractObstacle {

    constructor(world, x, id) {
        const IMAGE = './resources/orangeTree.png';
        const RELATIVE_Y_POSITION = -2.4;
        const RELATIVE_SIZE = 3.5;
        const RELATIVE_DISTANCE = 0.15;
        const RELATIVE_HITBOX_SIZE =  {
            width : 75/1200, //tree trunk
            height: 1
        };
        const RELATIVE_HITBOX_OFFSET = {
            x : 0.49,
            y : 0
        };
        super(world, x, id, IMAGE, RELATIVE_Y_POSITION, RELATIVE_SIZE, RELATIVE_DISTANCE, RELATIVE_HITBOX_SIZE, RELATIVE_HITBOX_OFFSET);
    }
}