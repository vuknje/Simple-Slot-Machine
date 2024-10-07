import { Scene } from 'phaser';
import { config } from '../config';

import { ViewModel } from '../classes/ViewModel';

import DataService from '../classes/DataService';
import Engine from '../classes/Engine';
import Button from '../classes/Button';
import GameUI from '../classes/GameUI';

export class GameScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    text: Phaser.GameObjects.Text;

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background', 'bg.png');

        this.load.image('symbol0', 'symbol0.png');
        this.load.image('symbol1', 'symbol1.png');
        this.load.image('symbol2', 'symbol2.png');
        this.load.image('symbol3', 'symbol3.png');
        this.load.image('symbol4', 'symbol4.png');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00daff);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.85);

        const dataService = new DataService(config.reelCount);
        dataService.generateSymbols();

        const viewModel = new ViewModel({
            symbolHeight: config.symbolHeight,
            reelWidth: config.symbolWidth,
            spaceBetweenReels: config.spaceBetweenReels,
            rowsCount: config.rowsCount,
            screenCenter: this.cameras.main
        });

        const viewData = viewModel.generateViewModelData(
            dataService.symbolGroups
        );

        const engine = new Engine(
            config.rotationsPerSpin,
            config.symbolHeight,
            viewData.reelCircumference
        );

        const gameUI = new GameUI(this, viewData);

        const spinButton = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 290,
            'SPIN!',
            () => {
                dataService.generateSymbolCombination();

                const distances = engine.calculateSpinDistances(
                    dataService.symbolCombination,
                    viewData
                );

                console.log(dataService.getSymbolCombinationLabels());

                gameUI.spin(distances);
                setTimeout(() => {
                    spinButton.disable();
                }, 50);
            }
        );

        gameUI.onSpinEndCb = () => {
            spinButton.enable();
        };
    }
}
