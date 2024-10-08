import { ViewData, Reel } from './ViewModel';
import Engine from './Engine';
import Effects from './Effects';

class GameUI extends Phaser.GameObjects.Container {
    vm: ViewData;
    engine: Engine;
    effects: Effects;

    reels: Phaser.GameObjects.Container[];
    symbols: Phaser.GameObjects.Image[];
    isSpinning: boolean = false;

    DEV_MODE: boolean = false;

    constructor(
        scene: Phaser.Scene,
        engine: Engine,
        viewData: ViewData,
        effects: Effects
    ) {
        super(scene);

        this.DEV_MODE = false;

        this.vm = viewData;
        this.engine = engine;
        this.effects = effects;

        this.symbols = [];
        this.reels = this.generateReels(viewData);

        this.scene.add.container(
            this.vm.machineX,
            this.vm.machineY,
            this.reels
        );
    }

    generateReels(viewData: ViewData) {
        return viewData.reels.map((reelData, reelIndex) => {
            const reelInstances = reelData.instances.map(
                (instanceData, instanceIndex) => {
                    const symbols = instanceData.symbolIds.map(
                        (symbolId, symbolIndex) => {
                            return this.scene.add
                                .image(
                                    viewData.reelWidth / 2,
                                    symbolIndex * viewData.symbolHeight +
                                        viewData.symbolHeight / 2,
                                    `symbol${symbolId}`
                                )
                                .setOrigin(0.5, 0.5);
                        }
                    );

                    this.symbols.push(...symbols);

                    const children = this.DEV_MODE
                        ? [
                              this.DEV_MODE_getColor(
                                  viewData.reelWidth,
                                  viewData.reelCircumference,
                                  instanceIndex
                              ),
                              ...symbols
                          ]
                        : symbols;

                    const reelInstance = this.scene.add.container(
                        0,
                        instanceIndex * viewData.reelCircumference,
                        children
                    );

                    return reelInstance;
                }
            );

            const reel = this.scene.add.container(
                viewData.reelWidth * reelIndex +
                    viewData.spaceBetweenReels * reelIndex,
                0,
                reelInstances
            );

            this.addReelBg(reelData);
            reel.setMask(this.addMask(reelData));

            return reel;
        });
    }

    addReelBg(reelData: Reel) {
        return this.scene.add
            .rectangle(
                reelData.x,
                reelData.y,
                this.vm.reelWidth,
                this.vm.reelHeight,
                0xffffff
            )
            .setOrigin(0, 0)
            .setStrokeStyle(4, 0x333333)
            .setAlpha(0.85);
    }

    addMask(reelData: Reel) {
        return this.scene.add
            .rectangle(
                reelData.x,
                reelData.y,
                this.vm.reelWidth,
                this.vm.reelHeight,
                0xff0000
            )
            .setOrigin(0, 0)
            .setVisible(this.DEV_MODE)
            .createGeometryMask();
    }

    spin(symbolCombination: number[]) {
        if (this.isSpinning) return;

        this.isSpinning = true;

        const distances = this.engine.calculateSpinDistances(
            symbolCombination,
            this.vm.reels
        );

        const durations = this.engine.calculateSpinDurations(
            symbolCombination.length
        );

        this.effects.addTempBlurEffect(this.symbols, durations[0]);

        this.vm.reels.forEach((reelData, reelIndex) => {
            const instances = [
                this.reels[reelIndex].list[0] as Phaser.GameObjects.Container,
                this.reels[reelIndex].list[1] as Phaser.GameObjects.Container
            ];

            this.scene.tweens.addCounter({
                from: reelData.circumferencePosition,
                to: reelData.circumferencePosition + distances[reelIndex],
                duration: durations[reelIndex],
                ease: 'Cubic.Out',
                onUpdate: (tween) => {
                    this.engine.updateReelPositions(reelData, tween.getValue());

                    instances[0].setY(reelData.instances[0].y);
                    instances[1].setY(reelData.instances[1].y);
                },
                onComplete: () => {
                    this.effects.animateWinningSymbol(
                        this.reels[reelIndex],
                        symbolCombination[reelIndex]
                    );

                    if (reelIndex === this.reels.length - 1) {
                        this.onSpinEnd();

                        if (this.DEV_MODE) {
                            console.log(JSON.stringify(this.vm, null, 2));
                        }
                    }
                }
            });
        });
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
