/*
    DataService is an abstraction over a server service that provides the data.
    It prepares the core data - the reel symbols the game depends on.
    `symbolGroups` as a simple 2-dimensional array of symbol IDs
    that are used for generating the UI.

    The method `generateSymbolCombination` returns a random combination - 
    an array of the single symbol IDs from the previously generated `symbolGroups`.
    The game engine then spins the reels so it shows the defined combination.

    In practice 2 main methods (`generateSymbolGroups` and `generateSymbolCombination`)
    would be async. For simplicity, here they are synchronous. 

    `showLogs` enables logging the friendly output of the 2 methods in the console.  
*/

interface InitParams {
    reelCount: number;
    showLogs: boolean;
}

class DataService {
    reelCount: number;
    showLogs = false;

    labels = ['watermelon', 'pear', 'bannana', 'orange', 'lemon'];

    symbolGroups: number[][];
    symbolCombination: number[];

    constructor(params: InitParams) {
        Object.assign(this, params);
    }

    generateSymbolGroups(
        shouldRandomize = true,
        uniqueSymbolsCount = 5,
        reelRepeatCount = 3
    ): void {
        this.symbolGroups = Array.from({ length: this.reelCount }, () => {
            return this.randomizeSymbols(
                uniqueSymbolsCount,
                reelRepeatCount,
                shouldRandomize
            );
        });

        if (this.showLogs) {
            console.log(
                this.getGeneratedSymbolLabels()
                    .map(
                        (labels, reelIndex) =>
                            `Reel ${reelIndex}: ${labels.join(', ')}`
                    )
                    .join('\n')
            );
        }
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

    generateSymbolCombination(symbolGroups?: number[][]): void {
        symbolGroups ||= this.symbolGroups;
        this.symbolCombination = Array.from({ length: this.reelCount }, () => {
            const min = Math.min(...symbolGroups[0]);
            const max = Math.max(...symbolGroups[0]);

            return this.randomIntFromInterval(min, max);
        });

        if (this.showLogs) {
            console.log(
                'Combination:',
                this.getSymbolCombinationLabels().join(', ')
            );
        }
    }

    getGeneratedSymbolLabels(): string[][] {
        return this.symbolGroups.map((symbolIds) =>
            symbolIds.map(this.getLabel, this)
        );
    }

    getSymbolCombinationLabels(): string[] {
        return this.symbolCombination.map((symbolIndex, reelIndex) =>
            this.getLabel(this.symbolGroups[reelIndex][symbolIndex])
        );
    }

    getLabel(index: number): string {
        return this.labels[index];
    }

    shuffle(array: number[]): number[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

export default DataService;
