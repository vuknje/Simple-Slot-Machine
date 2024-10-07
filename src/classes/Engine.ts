class Engine {
    rotationsPerSpin: number;
    symbolHeight: number;
    reelCircumference: number;

    constructor(
        rotationsPerSpin: number,
        symbolHeight: number,
        reelCircumference: number
    ) {
        if (this.rotationsPerSpin < 1) {
            throw new Error('rotationsPerSpin must be at least 1');
        }

        this.rotationsPerSpin = rotationsPerSpin;
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
}

export default Engine;
