interface InitParams {
    rotationsPerSpin: number;
    spinSpeed: number;
    delayBetweenRotations: number;
    symbolHeight: number;
    reelCircumference: number;
}

class Engine {
    rotationsPerSpin: number;
    spinSpeed: number;
    delayBetweenRotations: number;
    symbolHeight: number;
    reelCircumference: number;

    constructor({
        rotationsPerSpin,
        spinSpeed,
        delayBetweenRotations,
        symbolHeight,
        reelCircumference
    }: InitParams) {
        if (this.rotationsPerSpin < 1) {
            throw new Error('rotationsPerSpin must be at least 1');
        }

        this.rotationsPerSpin = rotationsPerSpin;
        this.spinSpeed = spinSpeed;
        this.delayBetweenRotations = delayBetweenRotations;
        this.symbolHeight = symbolHeight;
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
            this.symbolHeight * (targetSymbolIndex - 1)
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
}

export default Engine;
