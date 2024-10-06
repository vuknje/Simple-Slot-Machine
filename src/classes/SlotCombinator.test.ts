import { describe, it, expect } from 'vitest';
import SlotCombinator from '../classes/SlotCombinator';

describe('SlotCombinator', () => {
    describe('generateSymbols', () => {
        it('returns an array of the length equal to the `reelCount`', () => {
            const reelCount = 3;
            const slotCombinator = new SlotCombinator(reelCount);

            slotCombinator.generateSymbols();

            expect(slotCombinator.symbolGroups.length).toEqual(reelCount);
        });
    });

    describe('randomizeSymbols', () => {
        it('returns an array with 3 unique symbols repeated 2 times (shuffle is OFF)', () => {
            const slotCombinator = new SlotCombinator(3);

            const output = slotCombinator['randomizeSymbols'](3, 2, false);
            expect(output).toEqual([0, 1, 2, 0, 1, 2]);
        });

        it('returns an array with `uniqueSymbolCount` unique symbols repeated `reelRepeatCount` times (shuffle is OFF)', () => {
            const slotCombinator = new SlotCombinator(3);

            const output = slotCombinator['randomizeSymbols'](5, 3, false);
            const arr = [0, 1, 2, 3, 4];
            expect(output).toEqual([...arr, ...arr, ...arr]);
        });

        it('returns a shuffled array with `uniqueSymbolCount` unique symbols repeated `reelRepeatCount` times (shuffle is ON)', () => {
            const slotCombinator = new SlotCombinator(3);

            const output = slotCombinator['randomizeSymbols'](5, 2, true);
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
            const slotCombinator = new SlotCombinator(reelCount);

            const input = [
                [1, 2, 0],
                [0, 1, 2],
                [1, 0, 2]
            ];
            slotCombinator.generateSymbolCombination(input);
            console.log(slotCombinator.symbolCombination);

            expect(slotCombinator.symbolCombination.length).toEqual(
                input.length
            );

            for (let i = 0; i < input.length; i++) {
                expect(
                    input[i].includes(slotCombinator.symbolCombination[i])
                ).toBe(true);
            }
        });
    });
});
