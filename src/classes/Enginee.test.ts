import { describe, it, beforeEach, expect } from 'vitest';
import Engine from './Engine';

describe('Engine', () => {
    const _params = {
        rotationsPerSpin: 2,
        spinSpeed: 10,
        delayBetweenRotations: 300,
        symbolHeight: 134,
        reelCircumference: 2010
    };
    let _engine: Engine;

    beforeEach(() => {
        _engine = new Engine(_params);
    });

    describe('calculateSpinDistance', () => {
        it('returns a proper distance when `startingPoint` is 0', () => {
            const targetSymbolIndex = 7;
            const startingPoint = 0;
            const distance = _engine.calculateSpinDistance(
                targetSymbolIndex,
                startingPoint
            );

            expect(distance).toBe(4824);
        });

        it('returns a proper distance when `startingPoint` is greater than 0', () => {
            const targetSymbolIndex = 14;
            const startingPoint = 804;
            const distance = _engine.calculateSpinDistance(
                targetSymbolIndex,
                startingPoint
            );

            expect(distance).toBe(4958);
        });
    });

    describe('calculateSpinDistances', () => {
        it('returns a proper distances given `symbolCombination` and zero circumferencePositions', () => {
            const symbolCombination = [5, 1, 7];
            const reels = [
                { circumferencePosition: 0 },
                { circumferencePosition: 0 },
                { circumferencePosition: 0 }
            ];
            const distances = _engine.calculateSpinDistances(
                symbolCombination,
                reels
            );

            expect(distances).toEqual([4556, 4020, 4824]);
        });

        it('returns a proper distances given `symbolCombination` and non-zero circumferencePositions', () => {
            const symbolCombination = [2, 11, 0];
            const reels = [
                { circumferencePosition: 536 },
                { circumferencePosition: 268 },
                { circumferencePosition: 134 }
            ];
            const distances = _engine.calculateSpinDistances(
                symbolCombination,
                reels
            );

            console.log(distances);

            expect(distances).toEqual([3618, 5092, 3752]);
        });
    });
});
