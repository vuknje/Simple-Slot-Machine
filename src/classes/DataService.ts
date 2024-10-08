class DataService {
    reelCount: number;
    symbolGroups: number[][];
    symbolCombination: number[];

    labels = ['watermelon', 'pear', 'bannana', 'orange', 'lemon'];
    showLogs = false;

    constructor(reelCount: number, showLogs: boolean = false) {
        this.reelCount = reelCount;
        this.showLogs = showLogs;
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

    generateSymbolCombination(symbolGroups?: number[][]) {
        symbolGroups ||= this.symbolGroups;
        this.symbolCombination = Array.from({ length: this.reelCount }, () =>
            this.randomIntFromInterval(0, symbolGroups[0].length - 1)
        );

        if (this.showLogs) {
            console.log(
                'Combination:',
                this.getSymbolCombinationLabels().join(', ')
            );
        }
    }

    getGeneratedSymbolLabels() {
        return this.symbolGroups.map((symbolIds) =>
            symbolIds.map(this.getLabel, this)
        );
    }

    getSymbolCombinationLabels() {
        return this.symbolCombination.map((symbolIndex, reelIndex) =>
            this.getLabel(this.symbolGroups[reelIndex][symbolIndex])
        );
    }

    getLabel(index: number) {
        return this.labels[index];
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

export default DataService;
