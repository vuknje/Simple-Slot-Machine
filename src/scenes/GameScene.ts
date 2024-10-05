import { Scene } from 'phaser';

export class GameScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    text: Phaser.GameObjects.Text;

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background', 'bg.png');

        this.load.image('symbol0', 'symbol0.png');
        this.load.image('symbol1', 'symbol1.png');
        this.load.image('symbol2', 'symbol2.png');
        this.load.image('symbol3', 'symbol3.png');
        this.load.image('symbol4', 'symbol4.png');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00daff);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.85);

        const reelCount = 3;
        const rowsCount = 3;
        const symbolHeight = 134;
        const symbolWidth = 134;
        const reelWidth = symbolWidth;
        const screenHeight = symbolHeight * rowsCount;
        const uniqueSymbolsCount = 5;
        const spaceBetweenReels = 20;

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
            const halfWidth =
                ((reelWidth + spaceBetweenReels) * reelCount -
                    spaceBetweenReels) /
                2;
            return (
                centerX -
                halfWidth +
                reelIndex * (reelWidth + spaceBetweenReels)
            );
        }

        const reels = Array.from({ length: reelCount }, (_, reelIndex) => {
            const symbols = Array.from(
                { length: uniqueSymbolsCount },
                (_, index) => {
                    const img = this.add.image(
                        0,
                        index * symbolHeight,
                        `symbol${index}`
                    );
                    img.setOrigin(0, 0);
                    return img;
                }
            );
            const reel = this.add.container(
                reelWidth * reelIndex + spaceBetweenReels * reelIndex,
                0,
                symbols
            );

            const maskRect = this.add
                .rectangle(
                    getMaskXPosition(this.cameras.main.centerX, reelIndex),
                    getMachineHeight(this.cameras.main.centerY),
                    reelWidth,
                    screenHeight,
                    0xff0000
                )
                .setOrigin(0, 0)
                .setVisible(true);
            const mask = maskRect.createGeometryMask();
            reel.setMask(mask);
            return reel;
        });

        this.add.container(
            getMachineXPosition(this.cameras.main.centerX),
            getMachineHeight(this.cameras.main.centerY),
            reels
        );
    }
}
