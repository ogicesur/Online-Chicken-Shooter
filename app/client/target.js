import { Coord } from './coord.js';
import { Hitbox } from './hitbox.js';
import { Hitmarker } from './hitmarker.js';
import { AbstractSolidObject } from './abstractSolidObject.js';

export class Target extends AbstractSolidObject{
    constructor(world, targetSpawn) {
        const BASE_SIZE = world.height/80;
        const RELATIVE_HITBOX_SIZE = {
            width: 0.95,
            height: 0.65
        };
        const RELATIVE_HITBOX_OFFSET = {
            x: 0.025,
            y: 0.2
        };

        let flyingRightFrames = [
            './resources/frame-1.png',
            './resources/frame-2.png'];
        let flyingLeftFrames = [
            './resources/frame-1-mirror.png',
            './resources/frame-2-mirror.png'];
        
        let bloodFrames = [
            './resources/blood1.png',
            './resources/blood2.png',
            './resources/blood3.png',
            './resources/blood4.png',
            './resources/blood5.png',
            './resources/blood6.png',
            './resources/blood7.png',
            './resources/blood8.png',
            './resources/blood9.png',
            './resources/blood10.png',
            './resources/blood11.png',
            './resources/blood12.png',
            './resources/blank.png'
        ];
        
        let position = new Coord(0, 0, 0);
        position.z = world.depth * targetSpawn.depthPercent;
        let distance = Math.abs(world.localPlayer.position.z - position.z);
        let modifierPerUnit = 0.0045;
        let scaling = 10 - distance * modifierPerUnit; //foreground up to 10; background down to 1

        let size = BASE_SIZE * scaling;
        let hitboxOffset = { 
            x: size*RELATIVE_HITBOX_OFFSET.x, 
            y: size*RELATIVE_HITBOX_OFFSET.y 
        };
        let hitbox = new Hitbox(size*RELATIVE_HITBOX_SIZE.width, size*RELATIVE_HITBOX_SIZE.height, hitboxOffset);

        let image = new Image(size, size);

        super(world, position, hitbox, image, size, targetSpawn.id);

        this.dyingAnimation = bloodFrames;
        this.bloodFrame = 0;
        this.alive = true;
        this.frame = 1;
        this.direction = targetSpawn.direction;
        this.speed = targetSpawn.speed;
        this.scoreValue = (targetSpawn.scoreValue * scaling).toFixed(0);
        this.dying = null;
        this.hitmarker = null;

        if (this.direction == 1) {
            this.flyingFrames = flyingRightFrames;
            this.position.x = - this.hitbox.width;
        } else {
            this.flyingFrames = flyingLeftFrames;
            this.position.x = this.world.width + this.hitbox.width;
        }
        this.position.y = this.world.height - this.world.height * targetSpawn.heightPercent;

        if(this.world.debug) {
            console.log("New target: ", this);
        }
    }

    render() { //@override
        this.renderHitbox(this.world.debug);
        if(this.alive) {
            this.image.src = this.flyingFrames[this.frame-1];
            this.frame = 2 - (1 % this.frame);
        } else if(this.alive === false) {
            if(this.dying > 0) {
                this.image.src =  this.dyingAnimation[this.bloodFrame];  
                this.bloodFrame++; 
                this.dying -= 1;
            }
            this.hitmarker.render();
        }
        this.renderImage();
    }

    move() { //@override
        this.position.x = this.position.x + this.speed * this.direction;
    }

    isAlive() { //@override
        return this.alive;
    }

    getHitByLocalBullet() {
        this.die();
        let hitByLocalPlayer = true;
        this.hitmarker = new Hitmarker(this.world, this.position, hitByLocalPlayer, this.scoreValue, null);
    }

    getHitByRemoteBullet(remoteScoreValue) {
        this.die();
        let hitByLocalPlayer = false;
        this.hitmarker = new Hitmarker(this.world, this.position, hitByLocalPlayer, remoteScoreValue, this.scoreValue);
    }

    die(){
        this.speed = 0;
        this.alive = false;
        this.dying = this.dyingAnimation.length;
    }

    deadAndDone() { //@override
        if(this.alive) {
            return false;
        } else {
            return (this.dying===0 && this.hitmarker.framesToLive===0);
        }
    }
}