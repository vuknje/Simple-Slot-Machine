import SlotCombinator from './SlotCombinator';

class GameUI extends Phaser.GameObjects.Container {
    reels: Phaser.GameObjects.Container[];

    constructor(scene: Phaser.Scene, centerX: number, centerY: number) {
        super(scene);

        const reelCount = 3;
        const rowsCount = 3;
        const uniqueSymbolsCount = 5;
        const reelRepeatCount = 2;

        const symbolHeight = 134;
        const symbolWidth = 134;
        const spaceBetweenReels = 20;
        const reelWidth = symbolWidth;
        const screenHeight = symbolHeight * rowsCount;

        const combinator = new SlotCombinator(reelCount);
        combinator.generateSymbols(uniqueSymbolsCount, reelRepeatCount, false);

        function getMachineXPosition(centerX: number): number {
            const halfWidth =
                ((reelWidth + spaceBetweenReels) * reelCount -
                    spaceBetweenReels) /
                2;
            return centerX - halfWidth;
        }

        function getMachineHeight(centerY: number): number {
            const halfHeight = (symbolHeight * rowsCount) / 2;
            return centerY - halfHeight;
        }

        function getMaskXPosition(centerX: number, reelIndex: number): number {
            return (
                getMachineXPosition(centerX) +
                reelIndex * (reelWidth + spaceBetweenReels)
            );
        }

        this.reels = Array.from({ length: reelCount }, (_, reelIndex) => {
            const symbols = Array.from(
                { length: combinator.symbols[reelIndex].length },
                (_, symbolIndex) => {
                    const img = this.scene.add.image(
                        0,
                        symbolIndex * symbolHeight,
                        `symbol${combinator.symbols[reelIndex][symbolIndex]}`
                    );
                    img.setOrigin(0, 0);
                    return img;
                }
            );
            const reelInstance = this.scene.add.container(
                reelWidth * reelIndex + spaceBetweenReels * reelIndex,
                0,
                symbols
            );

            const mask = this.createReelMask(
                getMaskXPosition(centerX, reelIndex),
                getMachineHeight(centerY),
                reelWidth,
                screenHeight
            );

            reelInstance.setMask(mask);
            return reelInstance;
        });

        this.scene.add.container(
            getMachineXPosition(centerX),
            getMachineHeight(centerY),
            this.reels
        );
    }

    createReelMask(
        x: number,
        y: number,
        width: number,
        height: number
    ): Phaser.Display.Masks.GeometryMask {
        const maskRect = this.scene.add
            .rectangle(x, y, width, height, 0xff0000)
            .setOrigin(0, 0)
            .setVisible(true);
        return maskRect.createGeometryMask();
    }

    spin() {
        let currentScore = 0;
        let newScore = -134 * 6;

        for (const [reelIndex, reel] of this.reels.entries()) {
            this.scene.tweens.addCounter({
                from: currentScore,
                to: newScore,
                duration: 1000 + reelIndex * 250,
                ease: 'Back.easeOut',
                onUpdate: (tween) => {
                    reel.setY(Math.round(tween.getValue()));
                },
                onComplete: () => {
                    if (reelIndex === this.reels.length - 1) {
                        this.onSpinEnd();
                    }
                }
            });
        }
    }

    onSpinEnd() {
        console.log('Spin end.');
    }
}

export default GameUI;
