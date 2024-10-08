import { describe, it, expect } from 'vitest';
import DataService from './DataService';

describe('DataService', () => {
    describe('generateSymbolGroups', () => {
        it('returns an array of the length equal to the `reelCount`', () => {
            const reelCount = 3;
            const dataService = new DataService(reelCount);

            dataService.generateSymbolGroups();

            expect(dataService.symbolGroups.length).toEqual(reelCount);
        });
    });

    describe('randomizeSymbols', () => {
        it('returns an array with 3 unique symbols repeated 2 times (shuffle is OFF)', () => {
            const dataService = new DataService(3);

            const output = dataService['randomizeSymbols'](3, 2, false);
            expect(output).toEqual([0, 1, 2, 0, 1, 2]);
        });

        it('returns an array with `uniqueSymbolCount` unique symbols repeated `reelRepeatCount` times (shuffle is OFF)', () => {
            const dataService = new DataService(3);

            const output = dataService['randomizeSymbols'](5, 3, false);
            const arr = [0, 1, 2, 3, 4];
            expect(output).toEqual([...arr, ...arr, ...arr]);
        });

        it('returns a shuffled array with `uniqueSymbolCount` unique symbols repeated `reelRepeatCount` times (shuffle is ON)', () => {
            const dataService = new DataService(3);

            const output = dataService['randomizeSymbols'](5, 2, true);
            const sortedOutput = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
            const sortNum = (a: number, b: number) => a - b;

            expect(output).not.toEqual([0, 1, 2, 3, 4, 0, 1, 2, 3, 4]);
            // Must be the last as the `sort` method mutates in place
            expect(output.sort(sortNum)).toEqual(sortedOutput);
        });
    });

    describe('generateSymbolCombination', () => {
        it('returns an array of the length equal to the `reelCount`', () => {
            const reelCount = 3;
            const dataService = new DataService(reelCount);

            const input = [
                [1, 2, 0],
                [0, 1, 2],
                [1, 0, 2]
            ];
            dataService.generateSymbolCombination(input);

            expect(dataService.symbolCombination.length).toEqual(input.length);

            for (let i = 0; i < input.length; i++) {
                expect(
                    input[i].includes(dataService.symbolCombination[i])
                ).toBe(true);
            }
        });
    });
});
