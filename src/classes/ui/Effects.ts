/*
    The Effects class helps `GameUI` improve the UX by
    animating and adding FX effects to the game objects.
*/

class Effects {
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    animateWinningSymbol(
        reel: Phaser.GameObjects.Container,
        symbolIndex: number
    ) {
        const symbols = this.getWinningSymbols(reel, symbolIndex);

        const tween = this.scene.tweens.add({
            targets: symbols,
            scaleX: 1.5,
            scaleY: 1.35,
            ease: 'Circular.Out',
            duration: 150,
            yoyo: true,
            repeat: 0,
            onComplete() {
                tween.destroy();
            }
        });
    }

    getWinningSymbols(
        reel: Phaser.GameObjects.Container,
        symbolIndex: number
    ): Phaser.GameObjects.GameObject[] {
        const symbols = reel.list.map((reelInstance) => {
            return (reelInstance as Phaser.GameObjects.Container).list[
                symbolIndex
            ];
        });
        return Array.from(symbols);
    }

    addTempBlurEffect(
        symbols: Phaser.GameObjects.Image[],
        duration: number
    ): void {
        setTimeout(() => {
            const effects = symbols.map((symbol) => {
                return symbol.preFX!.addBlur(0, 0.5, 10, 2);
            });
            setTimeout(() => {
                effects.forEach((effect) => {
                    effect.setActive(false);
                });
            }, duration * 0.5);
        }, duration * 0.1);
    }
}

export default Effects;
