class GameUI extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, centerX: number, centerY: number) {
        super(scene);

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
            return (
                getMachineXPosition(centerX) +
                reelIndex * (reelWidth + spaceBetweenReels)
            );
        }

        const reels = Array.from({ length: reelCount }, (_, reelIndex) => {
            const symbols = Array.from(
                { length: uniqueSymbolsCount },
                (_, index) => {
                    const img = this.scene.add.image(
                        0,
                        index * symbolHeight,
                        `symbol${index}`
                    );
                    img.setOrigin(0, 0);
                    return img;
                }
            );
            const reel = this.scene.add.container(
                reelWidth * reelIndex + spaceBetweenReels * reelIndex,
                0,
                symbols
            );

            const maskRect = this.scene.add
                .rectangle(
                    getMaskXPosition(centerX, reelIndex),
                    getMachineHeight(centerY),
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

        this.scene.add.container(
            getMachineXPosition(centerX),
            getMachineHeight(centerY),
            reels
        );
    }
}

export default GameUI;
