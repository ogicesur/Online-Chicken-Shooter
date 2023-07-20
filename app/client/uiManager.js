export class UiManager {
    constructor(world, gunManager, scoreCounter, timer, remotePlayer) {
        this.world = world;
        this.gunManager = gunManager;
        this.scoreCounter = scoreCounter;
        this.timer = timer;
        this.remotePlayer = remotePlayer;

        this.startScreen = true;

        this.bloodBorder = new Image();
        this.bloodBorder.src = "./resources/BloodOverlay.png";

        this.loserSound = new Audio('./resources/boo.mp3');
        this.winnerSound = new Audio('./resources/winner.mp3');
        this.audioPlayed = false;
        this.timerSound = new Audio('./resources/countdown.mp3');
        this.timerAudioPlayed = false;
    }

    col(num) {
        let column = this.world.localPlayer.position.x + (this.world.canvas.width * (num*0.1) );
        return column;
    }

    row(num) {
        let row = this.world.canvas.height * (num*0.1);
        return row;
    }

    reset() {
        this.audioPlayed = false;
        this.timerAudioPlayed = false;
    }

    timerAudio() {
        if (!this.timerAudioPlayed&&this.timer.seconds<11) {
            this.timerSound.volume = 0.05;
            this.timerSound.play();
            this.timerAudioPlayed = true;
        }
    }

    render() {
        if (this.timer.seconds > 0) { //running
            this.renderTimer();
            this.renderScores();
            this.renderAmmoCounter();
            this.timerAudio();
            if (this.world.localPlayer.wounded) {           
                this.renderWoundedEffect();
            }
        } else if (!this.remotePlayer.isConnected) {
            this.renderAwaitingSecondPlayer();
        } else if (this.timer.seconds === 0 && !this.startScreen) {
            this.renderGameOverScreen();
        } else if (this.timer.seconds === 0 && this.startScreen) {
            this.renderStartScreen();
        }
    }

    renderAwaitingSecondPlayer() {
        this.world.font(60,"white");
        this.world.context.fillText("Waiting for other player to join.", this.col(2), this.row(5.5));
    }

    renderGameOverScreen() {
        this.renderParchment();
        this.world.font(40,"black");
        this.world.context.fillText("Game Over", this.col(3), this.row(2));
        this.renderWinnerDeclaration();
        this.renderReadySection();
    }

    renderStartScreen() {
        this.renderParchment();
        this.world.font(40,"black");
        this.world.context.fillText("Welcome to Crazy Flies!", this.col(3), this.row(2));

        this.world.boldFont(30,"black");
        this.world.context.fillText("How to play?", this.col(3), this.row(2.5));

        this.world.font(20,"black");
        this.world.context.fillText("1. Shoot targets to get score points.", this.col(3),this.row(3));
        this.world.context.fillText("2. More distant targets give you more points.", this.col(3),this.row(3.25));
        this.world.context.fillText("3. Faster targets give you more points.", this.col(3), this.row(3.5));
        this.world.context.fillText("3. Reloading costs you "+ this.gunManager.reloadCost +" points.", this.col(3), this.row(3.75));
        this.world.context.fillText("4. Shoot your opponent to obstruct them.", this.col(3), this.row(4));
        this.world.context.fillText("Shoot: ", this.col(3), this.row(4.5));
        this.world.context.fillText("Reload: ", this.col(3), this.row(5));
        this.world.context.fillText("Move: ", this.col(3), this.row(5.5));

        this.world.boldFont(20,"black");
        this.world.context.fillText("[Left Click]", this.col(4), this.row(4.5));
        this.world.context.fillText("[Space] ", this.col(4), this.row(5));
        this.world.context.fillText("[ArrowLeft]  [ArrowRight]", this.col(4), this.row(5.35));
        this.world.context.fillText("[A]  [D]", this.col(4), this.row(5.65));

        this.renderReadySection();
    }

    renderReadySection() {
        this.world.font(30,"black");
        this.world.context.fillText("You:", this.col(3), this.row(7));
        this.world.context.fillText("Opponent:", this.col(3), this.row(7.5));
        if (!this.world.localPlayer.readyStatus) {
            this.world.context.fillText("Press [ENTER] to get ready.", this.col(3), this.row(6.5));

            this.world.context.fillStyle = "red";
            this.world.context.fillText("NOT READY", this.col(5), this.row(7));
        } else {
            this.world.context.fillText("Waiting for other player...", this.col(3), this.row(6.5));

            this.world.context.fillStyle = "green";
            this.world.context.fillText("READY", this.col(5), this.row(7));
        }
        if (!this.remotePlayer.readyStatus) {
            this.world.context.fillStyle = "red";
            this.world.context.fillText("NOT READY", this.col(5), this.row(7.5));
        } else {
            this.world.context.fillStyle = "green";
            this.world.context.fillText("READY", this.col(5), this.row(7.5));
        }
    }

    renderTimer() {
        this.world.font(30,"white");
        let min = Math.floor(this.timer.seconds / 60);
        let sec = Math.floor(this.timer.seconds % 60);
        if(sec < 10) {
            sec = '0' + sec;
        };
        let text = min + ":" + sec;
        this.world.context.fillText(text, this.col(0.15), this.row(0.5));
    }

    renderAmmoCounter() {
        this.world.font(30,"white");
        this.world.context.fillText("Ammo Left: " + this.gunManager.ammo, this.col(0.15), this.row(9.5));
    }

    renderScores() {
        this.world.font(30,"white");

        this.world.context.fillText("You:", this.col(7.5), this.row(0.5));
        this.world.context.fillText("Opponent:", this.col(7.5), this.row(1));

        this.world.context.fillText(this.scoreCounter.localScore, this.col(8.7), this.row(0.5));
        this.world.context.fillText(this.scoreCounter.remoteScore, this.col(8.7), this.row(1));
    }

    renderWoundedEffect() {
        if (this.world.localPlayer.bloodFrames <= 100) {
            this.world.context.globalAlpha = this.world.localPlayer.bloodFrames/100;
        }
        if (this.world.localPlayer.bloodFrames > 0) {
            this.world.localPlayer.bloodFrames--;
        }
        this.world.context.drawImage(
            this.bloodBorder,
            this.col(0),
            0,
            this.world.canvas.width,
            this.world.height
        );
        this.world.context.globalAlpha = 1;
    }

    renderWinnerDeclaration() {
        let localPlayerColor;
        let remotePlayerColor;
        let winnerDeclaration;
        if (this.scoreCounter.localScore > this.scoreCounter.remoteScore) {
            localPlayerColor = "green";
            remotePlayerColor = "red";
            winnerDeclaration = "You Won"
            if (!this.audioPlayed) {
                this.winnerSound.volume = 0.2;
                this.winnerSound.play();
                this.audioPlayed = true;
            }
        }
        else if (this.scoreCounter.localScore < this.scoreCounter.remoteScore) {
            localPlayerColor = "red";
            remotePlayerColor = "green";
            winnerDeclaration = "You Lost"
            if (!this.audioPlayed) {
                this.loserSound.volume = 0.2;
                this.loserSound.play();
                this.audioPlayed = true;
            }
        } else  {
            localPlayerColor = "blue";
            remotePlayerColor = "blue";
            winnerDeclaration = "Tie!"
            if (!this.audioPlayed) {
                this.winnerSound.volume = 0.2;
                this.winnerSound.play();
                this.audioPlayed = true;
            }
        }
        this.world.font(100,localPlayerColor);
        this.world.context.fillText(winnerDeclaration, this.col(3), this.row(3));

        this.world.font(30,"black");
        this.world.context.fillText("Your Score:", this.col(3), this.row(4));
        this.world.context.fillText("Opponent's Score:", this.col(3), this.row(4.5));

        this.world.font(30,localPlayerColor);
        this.world.context.fillText(this.scoreCounter.localScore, this.col(5.5), this.row(4));
        this.world.font(30,remotePlayerColor);
        this.world.context.fillText(this.scoreCounter.remoteScore, this.col(5.5), this.row(4.5));

        this.world.boldFont(30,"black");
        this.world.context.fillText("Difference:", this.col(3), this.row(5));

        this.world.boldFont(30,localPlayerColor);
        let difference = Math.abs(this.scoreCounter.localScore - this.scoreCounter.remoteScore);
        this.world.context.fillText(difference, this.col(5.5), this.row(5));

    }

    renderParchment() {
        let image = new Image(this.world.canvas.width/2, this.world.height*0.9);
        image.src = "./resources/Parchment.png";
        this.world.context.drawImage(
            image,
            this.col(2.5),
            this.row(0.5),
            image.width,
            image.height
        )
    }
}