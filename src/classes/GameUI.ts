import SlotCombinator from './SlotCombinator';

class GameUI extends Phaser.GameObjects.Container {
    reels: Phaser.GameObjects.Container[];

    symbolHeight: number;
    reelCircumference: number;

    instancePositions: number[];
    delayBetweenReelSpins: number;
    isSpinning: boolean = false;

    constructor(scene: Phaser.Scene, centerX: number, centerY: number) {
        super(scene);

        const DEV_MODE = true;

        const reelCount = 3;
        const rowsCount = 3;
        const uniqueSymbolsCount = 3; // 5
        const reelRepeatCount = 1; // 2;

        const symbolHeight = 134;
        const symbolWidth = 134;
        const spaceBetweenReels = 20;
        const delayBetweenReelSpins = 250;
        const reelWidth = symbolWidth;
        const screenHeight = symbolHeight * rowsCount;

        const combinator = new SlotCombinator(reelCount);
        combinator.generateSymbols(uniqueSymbolsCount, reelRepeatCount);

        this.symbolHeight = symbolHeight;
        this.instancePositions = Array(reelCount).fill(0);
        this.delayBetweenReelSpins = delayBetweenReelSpins;
        this.reelCircumference =
            combinator.getSymbolCountPerReel() * this.symbolHeight;

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
            const reelInstances = Array.from(
                { length: 2 },
                (_, instanceIndex) => {
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

                    const children = DEV_MODE
                        ? [
                              this.DEV_MODE_getColor(
                                  symbolWidth,
                                  this.reelCircumference,
                                  instanceIndex
                              ),
                              ...symbols
                          ]
                        : symbols;

                    const reelInstance = this.scene.add.container(
                        0,
                        instanceIndex * this.reelCircumference,
                        children
                    );
                    return reelInstance;
                }
            );

            const reel = this.scene.add.container(
                reelWidth * reelIndex + spaceBetweenReels * reelIndex,
                0,
                reelInstances
            );

            const mask = this.createReelMask(
                getMaskXPosition(centerX, reelIndex),
                getMachineHeight(centerY),
                reelWidth,
                screenHeight
            );

            reel.setMask(mask);
            return reel;
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
        if (this.isSpinning) return;

        this.isSpinning = true;

        for (const [reelIndex, reel] of this.reels.entries()) {
            const instances = [
                reel.list[0] as Phaser.GameObjects.Container,
                reel.list[1] as Phaser.GameObjects.Container
            ];
            const newTotalY =
                this.instancePositions[reelIndex] +
                this.symbolHeight * Phaser.Math.Between(4, 8);

            this.scene.tweens.addCounter({
                from: this.instancePositions[reelIndex],
                to: newTotalY,
                duration: 5000 + reelIndex * this.delayBetweenReelSpins,
                ease: 'Back.easeOut',
                onUpdate: (tween) => {
                    const totalY = Math.round(tween.getValue());
                    this.instancePositions[reelIndex] =
                        totalY % this.reelCircumference;

                    instances[0].setY(-this.instancePositions[reelIndex]);
                    instances[1].setY(
                        this.reelCircumference -
                            this.instancePositions[reelIndex]
                    );
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
        this.isSpinning = false;
        this.onSpinEndCb();
    }

    onSpinEndCb() {}

    // DEV_MODE

    DEV_MODE_getColor(
        width: number,
        height: number,
        instanceIndex: number
    ): Phaser.GameObjects.Rectangle {
        const colors = [0xff00ff, 0x00ff00];

        return new Phaser.GameObjects.Rectangle(
            this.scene,
            0,
            0,
            width,
            height,
            colors[instanceIndex]
        ).setOrigin(0, 0);
    }
}

export default GameUI;
