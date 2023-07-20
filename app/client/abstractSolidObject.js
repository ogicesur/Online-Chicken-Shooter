export class AbstractSolidObject {

    constructor(world, position, hitbox, image, imageSize, id) {
        this.world = world;
        this.position = position;
        this.hitbox = hitbox;
        this.id = id;

        this.image = image;
        this.imageSize = imageSize;
    }

    render() {
        this.renderHitbox(this.world.debug);
        this.renderImage();
    }

    renderImage() {
        this.world.context.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.imageSize,
            this.imageSize
        );
    }

    renderHitbox(rendered) {
        if (rendered) {
            this.world.context.fillStyle = "purple";
            this.world.context.fillRect(
                this.position.x + this.hitbox.offset.x,
                this.position.y + this.hitbox.offset.y,
                this.hitbox.width,
                this.hitbox.height
            );
        }
    }

    checkForHit(shotCoord) {
        return this.hitbox.checkForHitboxMatch(this.position, shotCoord);
    }

    move() {
        //do nothing
    }

    isAlive() {
        return false;
    }

    isTarget() {
        return (this.id > 0);
    }

    deadAndDone() {
        return false;
    }
}
