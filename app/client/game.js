import { World } from './world.js';
import { LocalPlayer } from './localPlayer.js';
import { RemotePlayer } from './remotePlayer.js';
import { UiManager } from './uiManager.js';
import { Target } from './target.js';
import { GunManager } from './gunManager.js';
import { ScoreCounter } from './scoreCounter.js';
import { Timer } from './timer.js';
import { Crosshairs } from './crosshairs.js';
import { SolidObjectIndex } from './solidObjectIndex.js';
import { OrangeTree } from './orangeTree.js';
import { WhiskyBarrel } from './whiskyBarrel.js';
import { ShipWreck } from './shipWreck.js';
import { Bullet } from './bullet.js';

export class Game {
    constructor() {

        //World setup
        const MOVEMENT_SPEED = 0.025;
        const WORLDHEIGHT = 750;
        const WOLRDWIDTH = 5400;
        const WOLRDDEPTH = 1000;
        const MAX_AMMO = 8;
        const RELOADCOST = 100;
        this.backgroundPanorama = new Image (WOLRDWIDTH,WORLDHEIGHT);
        this.backgroundPanorama.src = './resources/panorama.png';
        this.maxCanvasWidth = 1920;
        this.minCanvasWidth = 1200;
        this.canvas = document.getElementById('gameCanvas');
        this.canvas.height = WORLDHEIGHT;
        this.context = this.canvas.getContext('2d');
        this.world = new World(WOLRDWIDTH, WORLDHEIGHT, WOLRDDEPTH, this.context, this.canvas, new LocalPlayer());
        this.movementSpeed =  MOVEMENT_SPEED * this.world.height;
        this.camMoveLeft = false;
        this.camMoveRight = false;

        //Socket.io
        this.socket = io();

        //Object setup
        this.localPlayer = this.world.localPlayer;
        this.localPlayer.update(this.world.width / 2 - this.canvas.width / 2);
        this.remotePlayer = new RemotePlayer(this.world);
        this.gunManager = new GunManager(this.world, MAX_AMMO, RELOADCOST);
        this.scoreCounter = new ScoreCounter();
        this.timer = new Timer();
        this.uiManager = new UiManager(this.world, this.gunManager, this.scoreCounter, this.timer, this.remotePlayer);
        this.crosshairs = new Crosshairs(this.world);
        this.solidObjectIndex = new SolidObjectIndex(this.world);
        this.solidObjectIndex.add(this.remotePlayer);
        this.bullet = new Bullet(this.world);

        //Listener setup
        this.listenOnSocket();
        this.listenOnBrowserEvents();

        //Audio setup
        this.playerHitSound = new Audio('./resources/wilhelmscream.mp3');
        this.obstacleHitSound = new Audio('./resources/woodbreaking.mp3');

        //Start loop
        setInterval(this.loop.bind(this), 33);
        setInterval(this.loopForTimer.bind(this), 1000);
    }

    isGameOn() {
        if (this.timer.seconds > 0) {
            return true
        }
        else {
            return false
        }
    }

    listenOnSocket() {
        let self = this;

        this.socket.on('playerReady', () => {
            console.log("Other player is ready.");
            self.notifyAboutPlayerPosition();
            self.remotePlayer.readyStatus = true;
        });
        this.socket.on('setside', (data) => {
            self.localPlayer.setZ((data == 1) * self.world.depth);
            self.remotePlayer.setZ((data != 1) * self.world.depth);
            console.log("Client on Z=", self.localPlayer.position.z);
            self.initObstacles();
        });
        this.socket.on('playerposition', (data) => {
            self.remotePlayer.updatePosition(data);
        });

        this.socket.on('newScore', (data) => {
            self.scoreCounter.updateRemoteScore(data);
        });

        this.socket.on('bothConnected', () => {
            console.log("Other player is connected.");
            self.remotePlayer.isConnected = true;
            console.log("Game is ready to start.");
        });

        this.socket.on('remotePlayerStatus', (data) => {
            self.remotePlayer.readyStatus = data;
        });

        this.socket.on('gameOver', () => {
            console.log("Game Over!");
            self.uiManager.startScreen = false;
            self.timer.seconds = 0;
        });

        this.socket.on('startgame', (data) => {
            self.uiManager.reset();
            self.timer.seconds = data;
            self.solidObjectIndex.removeAllTargets();
            self.scoreCounter.reset();
            self.gunManager.refillAmmo();
            self.localPlayer.readyStatus = false;
            self.remotePlayer.readyStatus = false;
            console.log("Start game timer at ", self.timer.seconds);
        });

        this.socket.on('refused', () => {
            console.log("connection was refused. Server is full.");
        });
        this.socket.on('targetspawn', (targetSpawn) => {
            let newTarget = new Target(self.world, targetSpawn);
            self.solidObjectIndex.add(newTarget);
        });

        this.socket.on('targetHit', (data) => {
            self.solidObjectIndex.handleTargetHitFromRemote(data)
        });

        this.socket.on('playerGotHit', () => {
            console.log('LocalPlayer got shot!');
            self.playerHitSound.volume = 1.0;
            self.playerHitSound.play();
            if (!this.localPlayer.wounded) {
                if (self.gunManager.ammo >= 0) {
                    self.gunManager.decreaseAmmo();
                }
                if (self.gunManager.ammo >= 0) {
                    self.gunManager.decreaseAmmo();
                }
                self.localPlayer.wound();
            }
        });

        this.socket.on('shotFired', () => {
            this.gunManager.remoteShot();
        });

        this.socket.on('reloading', () => {
            this.gunManager.remoteReload();
        });
    }

    listenOnBrowserEvents() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("click", this.handleShot.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
        document.addEventListener("mousemove", this.handleMouseMovement.bind(this));
    }

    notifyAboutPlayerPosition() {
        let scaledPostion = this.localPlayer.position.x + this.canvas.width / 2;
        this.socket.emit('playerposition', scaledPostion);
    }

    notifyAboutChangedLocalScore() {
        this.socket.emit('newScore', this.scoreCounter.localScore);
    }

    notifyAboutReady() {
        this.socket.emit('playerReady');
    }

    notifyAboutTargetHit(id, scoreValue) {
        let hit = {
            id : id,
            scoreValue : scoreValue
        };
        this.socket.emit('targetHit', hit);
    }

    notifyAboutPlayerHit() {
        this.socket.emit('playerGotHit');
    }

    notifyAboutShot() {
        this.socket.emit('shotFired');
    }

    notifyAboutReload() {
        this.socket.emit('reloading');
    }

    handleKeyDown(event) {
        if (event.code === "ArrowRight" || event.code === "KeyD") {
            this.camMoveRight = true;
        }
        else if (event.code === "ArrowLeft" || event.code === "KeyA") {
            this.camMoveLeft = true;
        }
        else if (event.code == "Space" && this.isGameOn() && this.gunManager.currentlyReloading == false) {
            this.notifyAboutReload();
            this.gunManager.reload();
            this.scoreCounter.localScore -= this.gunManager.reloadCost;
            this.notifyAboutChangedLocalScore();
        }
        else if (event.code == "Enter") {
            if (this.timer.seconds === 0) {
                this.localPlayer.readyStatus = true;
                this.notifyAboutReady();
            }
        }
        else if (event.code == "F9") {
            this.world.debug = !this.world.debug;
            console.log("Debug mode:",this.world.debug);
        }
    }

    handleKeyUp(event) {
        if (event.code === "ArrowRight" || event.code === "KeyD") {
            this.camMoveRight = false;
        }
        else if (event.code === "ArrowLeft" || event.code === "KeyA") {
            this.camMoveLeft = false;
        }
    }

    handleMouseMovement(event) {
        this.crosshairs.moveTo(event.offsetX,event.offsetY);
    }

    initObstacles() {
        let obstacleId = -1;
        let relativePosition = 0.22;
        let orangeTree = new OrangeTree(this.world, this.world.width*relativePosition, obstacleId);
        this.solidObjectIndex.add(orangeTree);

        obstacleId = -2;
        relativePosition = 0.85;
        let whiskyBarrel = new WhiskyBarrel(this.world, this.world.width*relativePosition, obstacleId);
        this.solidObjectIndex.add(whiskyBarrel);

        obstacleId = -3;
        relativePosition = 0.16;
        let shipWreck = new ShipWreck(this.world, this.world.width*relativePosition, obstacleId);
        this.solidObjectIndex.add(shipWreck);
    }

    handleShot(event) {
        if (this.isGameOn()) {
            this.bullet.load(event);
            let shotFired = this.gunManager.fire(this.bullet);
            if (shotFired) {
                this.notifyAboutShot();
                let solidObject = this.solidObjectIndex.getHit(this.bullet.worldCoord);
                if (solidObject !== null) {
                    if (solidObject.id > 0 && solidObject.alive) { //targets
                        solidObject.getHitByLocalBullet();
                        this.scoreCounter.addLocalScore(solidObject.scoreValue);
                        this.notifyAboutChangedLocalScore();
                        this.notifyAboutTargetHit(solidObject.id, solidObject.scoreValue);        
                    }
                    else if (solidObject.id < 0) { //obstacles
                        if (this.world.debug) {
                            console.log("Obstacle hit!");
                        }
                        this.obstacleHitSound.volume = 0.2;
                        this.obstacleHitSound.play();
                    }
                    else if (solidObject.id === 0) { //remotePlayer
                        this.notifyAboutPlayerHit();
                        this.playerHitSound.volume = 0.2;
                        this.playerHitSound.play();
                    }
                }
            }
        }
    }

    render() {
        this.renderCanvas();
        this.renderBackground();
        this.solidObjectIndex.render();
        this.uiManager.render();
        this.crosshairs.render();
        this.bullet.render();
    }

    renderCanvas() {
        this.world.verticalMargin = Math.max( 0, (window.innerHeight-this.world.height)/2 );
        this.canvas.style.margin = this.world.verticalMargin+"px 0px 0px 0px";
        this.canvas.width  = Math.min(this.maxCanvasWidth, Math.max(this.minCanvasWidth,window.innerWidth));
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.translate(- this.localPlayer.position.x, 0);
    }

    renderBackground() {
        this.context.drawImage(
            this.backgroundPanorama,
            0,
            0,
            this.world.width,
            this.world.height
        )
    }

    loop() {
        if (this.camMoveRight) {
            this.localPlayer.position.x = Math.min(this.world.width - this.canvas.width, this.localPlayer.position.x + this.movementSpeed);
            this.notifyAboutPlayerPosition();
        }
        else if (this.camMoveLeft) {
            this.localPlayer.position.x = Math.max(0, this.localPlayer.position.x - this.movementSpeed);
            this.notifyAboutPlayerPosition();
        }
        this.solidObjectIndex.move();
        this.solidObjectIndex.removeDeadTargets();
        this.render();
    }
    
    loopForTimer() {
        this.timer.decrease();
    }
}