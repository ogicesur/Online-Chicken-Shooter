export class SolidObjectIndex {
    constructor(world) {
        this.world = world;
        this.solidObjects = new Array();
    }

    add(solidObject) {
        this.solidObjects.push(solidObject);
    }

    removeById(id) {
        this.solidObjects = this.solidObjects.filter(obj => obj.id !== id);
    }

    removeDeadTargets() {
        this.solidObjects = this.solidObjects.filter(obj => (!obj.deadAndDone()));
    }

    removeAllTargets() {
        this.solidObjects = this.solidObjects.filter(obj => (obj.id <= 0));
    }

    getById(id) {
        return this.solidObjects.find(obj => obj.id === id)
    }

    getByDescendingDistance() {
        if (this.world.localPlayer.position.z === 0) {
            return this.getZDescending();
        } else {
            return this.getZAscending();
        }
    }

    getByAscendingDistance() {
        if (this.world.localPlayer.position.z === 0) {
            return this.getZAscending();
        } else {
            return this.getZDescending();
        }
    }

    getZAscending() {
        return this.solidObjects.sort((l, r) => (l.position.z - r.position.z));
    }

    getZDescending() {
        return this.solidObjects.sort((l, r) => (r.position.z - l.position.z));
    }

    getHit(shotCoord) {
        let ascDistObj = this.getByAscendingDistance();
        for (let i = 0; i < ascDistObj.length; i++) {
            if (this.solidObjects[i].checkForHit(shotCoord)) {
                if (this.world.debug) {
                    console.log("Hit object with id: ", this.solidObjects[i].id);
                }
                return this.solidObjects[i];
            }
        };
        if (this.world.debug) {
            console.log("No hit.");
        }
        return null;
    }

    handleTargetHitFromRemote(targetHit) {
        let hitTarget = this.getById(targetHit.id);
        if (hitTarget === undefined) {
            if(this.world.debug) {
                console.log("remote hit on dead target", targetHit.id);
            }
        } else {
            if(this.world.debug) {
                console.log("remote targetHit", targetHit, hitTarget);
            }
            hitTarget.getHitByRemoteBullet(targetHit.scoreValue);
        }
    }

    move() {
        let self = this;
        this.solidObjects.forEach(solidObject => {
            solidObject.move();
            //remove if to far outside map
            if (solidObject.isTarget()) {
                if ((solidObject.position.x > this.world.width + solidObject.hitbox.width + 1)
                    || (solidObject.position.x < -solidObject.hitbox.width - 1)) {
                    self.removeById(solidObject.id);
                    if(this.world.debug) {
                        console.log("Removing runaway target");
                    }
                }
            }
        });
    }

    render() {
        let descDistObj = this.getByDescendingDistance();
        descDistObj.forEach(solidObject => {
            solidObject.render();
        });
    }
}