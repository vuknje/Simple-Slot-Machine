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
            fontSize: '34px',
            color: '#ffffff',
            align: 'center',
            fixedWidth: 200,
            fixedHeight: 85,
            backgroundColor: '#0c7b00',
            stroke: '#063f00',
            strokeThickness: 5
        });

        this.setPadding(20);
        this.setOrigin(0.5);

        this.setInteractive({ useHandCursor: true });

        this.initListeners(onClick);
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

            this.setBackgroundColor('#11b100');
            this.setFontSize('42px');
            this.setFixedSize(220, 90);
        });

        this.on('pointerup', () => {
            this.setBackgroundColor('#0d8500');
            this.setFontSize('34px');
            this.setFixedSize(200, 85);
        });
    }
}

export default Button;
