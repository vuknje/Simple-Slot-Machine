import { Math } from 'phaser';

class SlotCombinator {
    uniqueSymbolsCount = 3; // 5
    reelRepeatCount = 1; // 2;

    reelCount: number;
    symbolGroups: number[][];
    symbolCombination: number[];

    constructor(reelCount: number) {
        this.reelCount = reelCount;
    }

    generateSymbols(shouldRandomize: boolean = true) {
        this.symbolGroups = Array.from({ length: this.reelCount }, () =>
            this.randomizeSymbols(
                this.uniqueSymbolsCount,
                this.reelRepeatCount,
                shouldRandomize
            )
        );
    }

    getSymbolCountPerReel() {
        return this.symbolGroups[0].length;
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
