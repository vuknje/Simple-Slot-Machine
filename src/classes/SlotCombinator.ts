class SlotCombinator {
    reelCount: number;
    symbols: number[][];
    symbolCombination: number[];

    constructor(
        uniqueSymbolsCount: number,
        reelRepeatCount: number,
        reelCount: number
    ) {
        this.reelCount = reelCount;

        this.symbols = Array.from({ length: reelCount }, () =>
            this.randomizeSymbols(uniqueSymbolsCount, reelRepeatCount)
        );
    }

    randomizeSymbols(
        uniqueSymbolsCount: number,
        repeatCount: number
    ): number[] {
        const arr = [];
        const uniqueIndexes = Array.from(
            { length: uniqueSymbolsCount },
            (_, i) => i
        );

        while (repeatCount-- > 0) {
            arr.push(...uniqueIndexes);
        }
        return Phaser.Utils.Array.Shuffle(arr);
    }
}

export default SlotCombinator;
