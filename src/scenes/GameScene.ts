import { Scene } from 'phaser';

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
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00daff);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.85);
        1;
        this.text = this.add.text(512, 384, 'Hello world!', {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        });
        this.text.setOrigin(0.5);
    }
}
