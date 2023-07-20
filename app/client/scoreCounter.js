export class ScoreCounter {
    constructor(){
        this.localScore = 0;
        this.remoteScore = 0;
    }

    addLocalScore(scoreAddition) {
        this.localScore += Math.floor(scoreAddition);
    }

    updateRemoteScore(updatedRemoteScore) {
        this.remoteScore = updatedRemoteScore;
    }
    
    reset() {
        this.localScore = 0;
        this.remoteScore = 0;
    }
}