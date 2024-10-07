interface InitParams {
    symbolHeight: number;
    reelWidth: number;
    spaceBetweenReels: number;
    rowsCount: number;
    screenCenter: ScreenCenter;
}

interface ScreenCenter {
    centerX: number;
    centerY: number;
}

interface ViewData {
    symbolHeight: number;
    reelWidth: number;
    reelCircumference: number;
    spaceBetweenReels: number;
    reelHeight: number;
    machineX: number;
    machineY: number;
    reels: Reel[];
}

interface Reel {
    x: number;
    y: number;
    circumferencePosition: number;
    instances: ReelInstance[];
}

interface ReelInstance {
    y: number;
    symbolIds: number[];
}

class ViewModel {
    private symbolHeight: number;
    private reelWidth: number;
    private spaceBetweenReels: number;
    private rowsCount: number;
    private screenCenter: ScreenCenter;

    data: ViewData;

    constructor({
        symbolHeight,
        reelWidth,
        spaceBetweenReels,
        rowsCount,
        screenCenter
    }: InitParams) {
        this.symbolHeight = symbolHeight;
        this.reelWidth = reelWidth;
        this.spaceBetweenReels = spaceBetweenReels;
        this.rowsCount = rowsCount;

        this.screenCenter = screenCenter;
    }

    generateViewModelData(symbolGroups: number[][]): ViewData {
        const reelCircumference = symbolGroups[0].length * this.symbolHeight;
        const reelHeight = this.rowsCount * this.symbolHeight;

        return {
            symbolHeight: this.symbolHeight,
            spaceBetweenReels: this.spaceBetweenReels,
            reelCircumference,
            machineX: this.getMachineXPosition(symbolGroups.length),
            machineY: this.getMachineYPosition(),
            reelHeight,
            reelWidth: this.reelWidth,
            reels: symbolGroups.map((symbolIds, reelIndex) => {
                return {
                    x: this.getMaskXPosition(symbolGroups.length, reelIndex),
                    y: this.getMachineYPosition(),
                    circumferencePosition: 0,
                    instances: [
                        {
                            y: 0,
                            symbolIds
                        },
                        {
                            y: reelCircumference,
                            symbolIds
                        }
                    ]
                };
            })
        };
    }

    getMachineXPosition(reelCount: number): number {
        const halfWidth =
            ((this.reelWidth + this.spaceBetweenReels) * reelCount -
                this.spaceBetweenReels) /
            2;
        return this.screenCenter.centerX - halfWidth;
    }

    getMachineYPosition(): number {
        const halfHeight = (this.symbolHeight * this.rowsCount) / 2;
        return this.screenCenter.centerY - halfHeight;
    }

    getMaskXPosition(reelCount: number, reelIndex: number): number {
        return (
            this.getMachineXPosition(reelCount) +
            reelIndex * (this.reelWidth + this.spaceBetweenReels)
        );
    }
}

export { ViewModel };
export type { ViewData, Reel };
