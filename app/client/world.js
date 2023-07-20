export class World {

    constructor(width, height, depth, context, canvas, localPlayer) {
        this.width = width; // [0,xMax]
        this.height = height; // [0,yMax]
        this.depth = depth; // [0,zMax]
        this.verticalMargin = undefined;
        this.context = context;
        this.canvas = canvas;
        this.localPlayer = localPlayer;
        this.debug = false;
    }

    setFont(size, color, isBold) {
        const BASE_WOLRD_HEIGHT = 750;
        let formatting = "";
        if (isBold) {
            formatting = "bold ";
        }
        let fontSize = size * (this.height/BASE_WOLRD_HEIGHT);
        this.context.font = formatting + fontSize + "px Georgia";
        this.context.fillStyle = color;
    }

    font(size, color) {
        this.setFont(size, color, false);
    }

    boldFont(size, color) {
        this.setFont(size, color, true);
    }
}
