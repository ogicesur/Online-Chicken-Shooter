export class Timer {
    constructor(){
        this.seconds = 0;
    }

    decrease() {
        if (this.seconds > 0) {
            this.seconds--;
        }
    }
}