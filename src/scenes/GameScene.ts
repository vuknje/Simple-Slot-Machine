import { Scene } from 'phaser';
import { config } from '../config';

import DataService from '../classes/core/DataService';
import ViewModel from '../classes/core/ViewModel';
import Engine from '../classes/core/Engine';

import Button from '../classes/ui/Button';
import Effects from '../classes/ui/Effects';
import GameUI from '../classes/ui/GameUI';

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
        const {
            reelCount,
            rowsCount,

            symbolHeight,
            reelWidth,
            spaceBetweenReels,

            rotationsPerSpin,
            minSpinDuration,
            spinEndDelay
        } = config;

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00daff);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.85);

        const dataService = new DataService({ reelCount, showLogs: true });
        dataService.generateSymbolGroups();

        const viewModel = new ViewModel({
            symbolHeight,
            reelWidth,
            spaceBetweenReels,
            rowsCount,
            screenCenter: this.cameras.main
        });

        const viewData = viewModel.generateViewModelData(
            dataService.symbolGroups
        );

        const engine = new Engine({
            rotationsPerSpin,
            minSpinDuration,
            spinEndDelay,
            symbolHeight,
            rowsCount,
            reelCircumference: viewData.reelCircumference
        });

        const gameUI = new GameUI(this, {
            engine,
            viewData,
            effects: new Effects(this)
        });

        const spinButton = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 290,
            'SPIN!',
            () => {
                dataService.generateSymbolCombination();

                gameUI.spin(dataService.symbolCombination);
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
