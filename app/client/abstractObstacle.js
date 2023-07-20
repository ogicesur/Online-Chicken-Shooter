import { AbstractSolidObject } from './abstractSolidObject.js';
import { Coord } from './coord.js';
import {Hitbox} from './hitbox.js';

export class AbstractObstacle extends AbstractSolidObject {

    constructor(world, x, id, imageSource, relativeYPosition, relativeSize, relativeDistance, relativeHitboxSize, relativeHitboxOffset) {
        let yPositioning = world.height * relativeYPosition;
        let position = new Coord(x, yPositioning, 0);
        let imageSize = world.height * relativeSize;
        let hitboxOffset = {
            x: imageSize * relativeHitboxOffset.x,
            y: imageSize * relativeHitboxOffset.y
        };
        let hitbox = new Hitbox(
            relativeHitboxSize.width * imageSize,
            relativeHitboxSize.height * imageSize,
            hitboxOffset
        );
        let image = new Image(imageSize, imageSize);
        image.src = imageSource;

        let z = world.depth * relativeDistance;
        if (world.localPlayer.position.z > 0) {
            z = world.depth - z;
        }
        position.z = z;

        super(world, position, hitbox, image, imageSize, id);
    }
}