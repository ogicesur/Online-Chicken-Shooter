
export class Crosshairs {
    constructor(world) {
        this.world = world;
        this.canvasPosition = {
            x: 0,
            y: 0
        }
        this.size = 80;
        this.image = new Image(this.size, this.size);
        this.offset = this.size / 2;
        this.image.src = './resources/crosshairs.png';

    }

    moveTo(x, y) {
        this.canvasPosition.x = x;
        this.canvasPosition.y = y;
    };

    render() {
        this.world.context.drawImage(
            this.image,
            this.world.localPlayer.position.x + this.canvasPosition.x - this.offset,
            this.canvasPosition.y - this.offset,
            this.size,
            this.size
        );
    }
}
