class SlotCombinator {
    reelCount: number;
    symbols: number[][];
    symbolCombination: number[];

    constructor(reelCount: number) {
        this.reelCount = reelCount;
    }

    generateSymbols(
        uniqueSymbolsCount: number,
        reelRepeatCount: number,
        shouldRandomize: boolean = true
    ) {
        this.symbols = Array.from({ length: this.reelCount }, () =>
            this.randomizeSymbols(
                uniqueSymbolsCount,
                reelRepeatCount,
                shouldRandomize
            )
        );
    }

    getSymbolCountPerReel() {
        return this.symbols[0].length;
    }

    randomizeSymbols(
        uniqueSymbolsCount: number,
        repeatCount: number,
        shouldRandomize: boolean
    ): number[] {
        const arr = [];
        const uniqueIndexes = Array.from(
            { length: uniqueSymbolsCount },
            (_, i) => i
        );

        while (repeatCount-- > 0) {
            arr.push(...uniqueIndexes);
        }

        if (shouldRandomize) {
            console.log('randomize');
            return Phaser.Utils.Array.Shuffle(arr);
        } else {
            return arr;
        }
    }
}

export default SlotCombinator;
