import { describe, it, beforeEach, expect } from 'vitest';
import { ViewModel, ViewData } from './ViewModel';

describe('ViewModel', () => {
    const _params = {
        symbolHeight: 134,
        reelWidth: 134,
        spaceBetweenReels: 20,
        rowsCount: 3,
        screenCenter: { centerX: 512, centerY: 384 }
    };

    let _viewModel: ViewModel;

    beforeEach(() => {
        _viewModel = new ViewModel(_params);
    });

    describe('generateViewModelData', () => {
        it('returns a proper view model data when passed 1 reel with 5 unique symbols each repeated twice', () => {
            const input: number[][] = [[2, 4, 0, 1, 4, 3, 1, 2, 0, 3]];
            const output: ViewData = _viewModel.generateViewModelData(input);

            expect(output).toEqual({
                symbolHeight: 134,
                spaceBetweenReels: 20,
                reelCircumference: 1340,
                machineX: 445,
                machineY: 183,
                reelHeight: 402,
                reelWidth: 134,
                reels: [
                    {
                        x: 445,
                        y: 183,
                        circumferencePosition: 0,
                        instances: [
                            {
                                y: 0,
                                symbolIds: [2, 4, 0, 1, 4, 3, 1, 2, 0, 3]
                            },
                            {
                                y: 1340,
                                symbolIds: [2, 4, 0, 1, 4, 3, 1, 2, 0, 3]
                            }
                        ]
                    }
                ]
            });
        });

        it('returns a proper view model data when passed 3 reels with 3 unique symbols each without repetition', () => {
            const input: number[][] = [
                [0, 2, 1],
                [1, 0, 2],
                [0, 1, 2]
            ];

            const output: ViewData = _viewModel.generateViewModelData(input);

            expect(output).toEqual({
                symbolHeight: 134,
                spaceBetweenReels: 20,
                reelCircumference: 402,
                machineX: 291,
                machineY: 183,
                reelHeight: 402,
                reelWidth: 134,
                reels: [
                    {
                        x: 291,
                        y: 183,
                        circumferencePosition: 0,
                        instances: [
                            {
                                y: 0,
                                symbolIds: [0, 2, 1]
                            },
                            {
                                y: 402,
                                symbolIds: [0, 2, 1]
                            }
                        ]
                    },
                    {
                        x: 445,
                        y: 183,
                        circumferencePosition: 0,
                        instances: [
                            {
                                y: 0,
                                symbolIds: [1, 0, 2]
                            },
                            {
                                y: 402,
                                symbolIds: [1, 0, 2]
                            }
                        ]
                    },
                    {
                        x: 599,
                        y: 183,
                        circumferencePosition: 0,
                        instances: [
                            {
                                y: 0,
                                symbolIds: [0, 1, 2]
                            },
                            {
                                y: 402,
                                symbolIds: [0, 1, 2]
                            }
                        ]
                    }
                ]
            });
        });
    });
});
