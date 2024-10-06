class Button extends Phaser.GameObjects.Text {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        label: string,
        onClick: () => void
    ) {
        super(scene, x, y, label, {
            fontFamily: 'Arial Black',
            color: '#ffffff',
            align: 'center'
        });

        this.setPadding(20);
        this.setOrigin(0.5);

        this.initListeners(onClick);
        this.enable();

        scene.add.existing(this);
    }

    initListeners(onClick: () => void) {
        this.on('pointerover', () => {
            this.setBackgroundColor('#0d8500');
        });

        this.on('pointerout', () => {
            this.setBackgroundColor('#0c7b00');
        });

        this.on('pointerdown', () => {
            onClick();
            this.setStylesClicked();
        });

        this.on('pointerup', () => {
            this.setStylesDefault();
        });
    }

    setStylesDefault() {
        this.setBackgroundColor('#0d8500');
        this.setFontSize('34px');
        this.setFixedSize(200, 85);
        this.setStroke('#063f00', 6);
    }

    setStylesClicked() {
        this.setBackgroundColor('#11b100');
        this.setFontSize('42px');
        this.setFixedSize(220, 90);
    }

    setStylesDisabled() {
        this.setBackgroundColor('#cccccc');
        this.setFontSize('34px');
        this.setFixedSize(200, 85);
        this.setStroke('#999999', 6);
    }

    enable() {
        this.setStylesDefault();
        this.setInteractive({ useHandCursor: true });
    }

    disable() {
        this.setStylesDisabled();
        this.disableInteractive();
        this.scene.input.setDefaultCursor('default');
    }
}

export default Button;
