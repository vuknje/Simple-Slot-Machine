class SlotCombinator {
    reelCount: number;
    symbolGroups: number[][];
    symbolCombination: number[];

    constructor(reelCount: number) {
        this.reelCount = reelCount;
    }

    generateSymbols(
        shouldRandomize = true,
        uniqueSymbolsCount = 5,
        reelRepeatCount = 2
    ): void {
        this.symbolGroups = Array.from({ length: this.reelCount }, () => {
            return this.randomizeSymbols(
                uniqueSymbolsCount,
                reelRepeatCount,
                shouldRandomize
            );
        });
    }

    private randomizeSymbols(
        uniqueSymbolsCount: number,
        reelRepeatCount: number,
        shouldRandomize: boolean
    ): number[] {
        const arr = [];
        const uniqueIndexes = Array.from(
            { length: uniqueSymbolsCount },
            (_, i) => i
        );

        while (reelRepeatCount-- > 0) {
            arr.push(...uniqueIndexes);
        }

        if (!shouldRandomize) {
            return arr;
        }

        return this.shuffle(arr);
    }

    generateSymbolCombination(symbolGroups: number[][]) {
        this.symbolCombination = Array.from({ length: this.reelCount }, () =>
            this.randomIntFromInterval(
                0,
                (symbolGroups || this.symbolGroups).length - 1
            )
        );
    }

    shuffle(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    randomIntFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

export default SlotCombinator;
