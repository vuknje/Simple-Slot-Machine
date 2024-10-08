import { beforeEach, describe, it, expect } from 'vitest';
import DataService from './DataService';

describe('DataService', () => {
    const reelCount = 3;
    let _dataService: DataService;

    beforeEach(() => {
        _dataService = new DataService(reelCount);
    });

    describe('generateSymbolGroups', () => {
        it('returns an array of non-empty arrays, the length must be equal to the `reelCount`', () => {
            _dataService.generateSymbolGroups();

            expect(
                _dataService.symbolGroups.some(
                    (symbolGroup) => symbolGroup.length === 0
                )
            ).toBe(false);
            expect(_dataService.symbolGroups.length).toEqual(reelCount);
        });
    });

    describe('randomizeSymbols', () => {
        it('returns an array with 3 unique symbols repeated 2 times (shuffle is OFF)', () => {
            const output = _dataService['randomizeSymbols'](3, 2, false);
            expect(output).toEqual([0, 1, 2, 0, 1, 2]);
        });

        it('returns an array with `uniqueSymbolCount` unique symbols repeated `reelRepeatCount` times (shuffle is OFF)', () => {
            const output = _dataService['randomizeSymbols'](5, 3, false);
            const arr = [0, 1, 2, 3, 4];
            expect(output).toEqual([...arr, ...arr, ...arr]);
        });

        it('returns a shuffled array with `uniqueSymbolCount` unique symbols repeated `reelRepeatCount` times (shuffle is ON)', () => {
            const output = _dataService['randomizeSymbols'](5, 2, true);
            const sortedOutput = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
            const sortNum = (a: number, b: number) => a - b;

            expect(output).not.toEqual([0, 1, 2, 3, 4, 0, 1, 2, 3, 4]);
            // Must be the last as the `sort` method mutates in place
            expect(output.sort(sortNum)).toEqual(sortedOutput);
        });
    });

    describe('generateSymbolCombination', () => {
        it('returns an array of the length equal to the `reelCount` containing a provided symbolId', () => {
            const input = [
                [1, 2, 3],
                [3, 1, 2],
                [1, 3, 2]
            ];

            _dataService.generateSymbolCombination(input);

            expect(_dataService.symbolCombination.length).toEqual(input.length);

            for (let i = 0; i < input.length; i++) {
                expect(
                    input[i].includes(_dataService.symbolCombination[i])
                ).toBe(true);
            }
        });
    });
});
