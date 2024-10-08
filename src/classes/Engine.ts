import { Reel } from './ViewModel';

interface InitParams {
    rotationsPerSpin: number;
    minSpinDuration: number;
    spinEndDelay: number;
    symbolHeight: number;
    rowsCount: number;
    reelCircumference: number;
}

class Engine {
    private rotationsPerSpin: number;
    private minSpinDuration: number;
    private spinEndDelay: number;
    private symbolHeight: number;
    private rowsCount: number;
    private reelCircumference: number;

    constructor(params: InitParams) {
        if (params.rowsCount % 2 === 0) {
            throw new Error('rowsCount must be an odd number');
        }

        if (params.rotationsPerSpin < 1) {
            throw new Error('rotationsPerSpin must be at least 1');
        }

        Object.assign(this, params);
    }

    calculateSpinDistances(
        symbolCombination: number[],
        reels: Pick<Reel, 'circumferencePosition'>[]
    ): number[] {
        return reels.map((reel, reelIndex) => {
            return this.calculateSpinDistance(
                symbolCombination[reelIndex],
                reel.circumferencePosition
            );
        });
    }

    calculateSpinDistance(targetSymbolIndex: number, startingPoint = 0) {
        return (
            -startingPoint +
            this.rotationsPerSpin * this.reelCircumference +
            this.symbolHeight *
                (targetSymbolIndex - Math.floor(this.rowsCount / 2))
        );
    }

    calculateSpinDurations(reelCount: number): number[] {
        return Array.from(
            { length: reelCount },
            (_, index) => this.minSpinDuration + this.spinEndDelay * index
        );
    }

    updateReelPositions(reelData: Reel, value: number) {
        const totalPosition = Math.round(value);

        reelData.circumferencePosition = totalPosition % this.reelCircumference;
        reelData.instances[0].y = -reelData.circumferencePosition;
        reelData.instances[1].y =
            this.reelCircumference - reelData.circumferencePosition;
    }
}

export default Engine;
