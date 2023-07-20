export class GunManager {
    constructor(world, maxAmmo, reloadCost) {
        this.world = world;
        this.maxAmmo = maxAmmo;
        this.ammo = this.maxAmmo;
        this.reloadCost = reloadCost;
        this.currentlyReloading = false;
        this.volume = {
            reloadLocal :  0.3,
            reloadRemote :  0.08,
            shotLocal : 0.05,
            shotRemote : 0.01,
            needAmmo : 0.2
        }
    }

    decreaseAmmo() {
        this.ammo -= 1;
    }

    async reload() {
        let reloadsound = new Audio('./resources/gun-reload-sound-effect.mp3');
        reloadsound.volume = this.volume.reloadLocal;
        this.currentlyReloading = true;
        if (this.ammo >= 0) {
            reloadsound.play();
            await this.sleep(1000);          
        }
        else {
            await this.sleep(2000)
            reloadsound.play();
            await this.sleep(1000);  
        }
        this.refillAmmo();
        this.currentlyReloading = false;
    }

    refillAmmo() {
        this.ammo = this.maxAmmo;
    }

    fire(bullet) {
        if (this.currentlyReloading) {
            return false;
        }
        else if (this.ammo <= 0) {  
            let needAmmo = new Audio('./resources/needammo.mp3');         
            needAmmo.volume = this.volume.needAmmo;
            needAmmo.play();
            return false;
        }
        else if (bullet.isOnCanvas()) {
            this.decreaseAmmo();
            let shotsound = new Audio('./resources/shotgun-shot-sound-effect.mp3');
            shotsound.volume = this.volume.shotLocal;
            shotsound.play();
            return true;
        }
    }

    remoteReload() {
        let reloadsound = new Audio('./resources/gun-reload-sound-effect.mp3');
        reloadsound.volume = this.volume.reloadRemote;
        reloadsound.play();
    }

    remoteShot() {
        let shotsound = new Audio('./resources/shotgun-shot-sound-effect.mp3');
        shotsound.volume = this.volume.shotRemote;
        shotsound.play();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
}