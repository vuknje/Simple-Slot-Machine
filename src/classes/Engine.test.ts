import { describe, it, beforeEach, expect } from 'vitest';
import Engine from './Engine';
import { Reel } from './ViewModel';

describe('Engine', () => {
    const _params = {
        rotationsPerSpin: 2,
        minSpinDuration: 2500,
        rowsCount: 3,
        spinEndDelay: 250,
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

            expect(distances).toEqual([3618, 5092, 3752]);
        });
    });

    describe('calculateSpinDurations', () => {
        it('returns an array of reel spin durations given the number of reels', () => {
            const reelCount = 3;
            const durations = _engine.calculateSpinDurations(reelCount);

            expect(durations).toEqual([2500, 2750, 3000]);
        });
    });

    describe('updateReelPositions', () => {
        it('updates the reel `circumferencePosition` and its instance `y` positions', () => {
            const reelsData: Reel = {
                x: 0,
                y: 183,
                circumferencePosition: 0,
                instances: [
                    {
                        y: 0,
                        symbolIds: []
                    },
                    {
                        y: 2010,
                        symbolIds: []
                    }
                ]
            };

            const value = 265;
            _engine.updateReelPositions(reelsData, value);

            expect(reelsData.circumferencePosition).toEqual(265);
            expect(reelsData.instances[0].y).toEqual(-265);
            expect(reelsData.instances[1].y).toEqual(1745);
        });
    });
});
