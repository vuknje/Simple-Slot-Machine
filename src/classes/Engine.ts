import { Reel } from './ViewModel';

interface InitParams {
    rotationsPerSpin: number;
    spinSpeed: number;
    delayBetweenRotations: number;
    symbolHeight: number;
    rowsCount: number;
    reelCircumference: number;
}

class Engine {
    rotationsPerSpin: number;
    spinSpeed: number;
    delayBetweenRotations: number;
    symbolHeight: number;
    rowsCount: number;
    reelCircumference: number;

    constructor({
        rotationsPerSpin,
        spinSpeed,
        delayBetweenRotations,
        symbolHeight,
        rowsCount,
        reelCircumference
    }: InitParams) {
        if (rowsCount % 2 === 0) {
            throw new Error('rowsCount must be an odd number');
        }

        if (rotationsPerSpin < 1) {
            throw new Error('rotationsPerSpin must be at least 1');
        }

        this.rotationsPerSpin = rotationsPerSpin;
        this.spinSpeed = spinSpeed;
        this.delayBetweenRotations = delayBetweenRotations;
        this.symbolHeight = symbolHeight;
        this.rowsCount = rowsCount;
        this.reelCircumference = reelCircumference;
    }

    calculateSpinDistances(
        symbolCombination: number[],
        reels: { circumferencePosition: number }[]
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

    calculateSpinDurations(distances: number[]): number[] {
        return distances.map((distance, index) => {
            return this.calculateDuration(distance, index);
        });
    }

    calculateDuration(distance: number, index: number) {
        return (
            (distance * 1) / this.spinSpeed + this.delayBetweenRotations * index
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
