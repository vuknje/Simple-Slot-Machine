import { ViewData } from './ViewModel';

class GameUI extends Phaser.GameObjects.Container {
    vm: ViewData;
    reels: Phaser.GameObjects.Container[];

    isSpinning: boolean = false;

    DEV_MODE: boolean = false;

    constructor(scene: Phaser.Scene, viewData: ViewData) {
        super(scene);

        this.DEV_MODE = false;
        this.vm = viewData;

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
                            const img = this.scene.add.image(
                                0,
                                symbolIndex * viewData.symbolHeight,
                                `symbol${symbolId}`
                            );
                            img.setOrigin(0, 0);
                            return img;
                        }
                    );

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

            const mask = this.scene.add
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

            reel.setMask(mask);
            return reel;
        });
    }

    spin() {
        if (this.isSpinning) return;

        this.isSpinning = true;

        this.vm.reels.forEach((reelData, reelIndex) => {
            const instances = [
                this.reels[reelIndex].list[0] as Phaser.GameObjects.Container,
                this.reels[reelIndex].list[1] as Phaser.GameObjects.Container
            ];

            const newTotalY =
                reelData.totalY +
                this.vm.symbolHeight * Phaser.Math.Between(4, 8);

            this.scene.tweens.addCounter({
                from: reelData.totalY,
                to: newTotalY,
                duration: 5000 + reelIndex * 250,
                ease: 'Back.easeOut',
                onUpdate: (tween) => {
                    reelData.totalY = Math.round(tween.getValue());
                    reelData.y = reelData.totalY % this.vm.reelCircumference;

                    reelData.instances[0].y = -reelData.y;
                    reelData.instances[1].y =
                        this.vm.reelCircumference - reelData.y;

                    instances[0].setY(reelData.instances[0].y);
                    instances[1].setY(reelData.instances[1].y);
                },
                onComplete: () => {
                    if (reelIndex === this.reels.length - 1) {
                        this.onSpinEnd();

                        if (this.DEV_MODE) {
                            console.log(JSON.stringify(this.vm, null, 2));
                        }
                    }
                    reelData.totalY = reelData.y;
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
