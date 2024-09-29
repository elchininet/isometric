export default ( IsometricModule, container ) => {

    const { IsometricCanvas, IsometricPath, IsometricRectangle, IsometricPentagram, PlaneView } = IsometricModule;

    const cube = new IsometricCanvas({
        container,
        backgroundColor: '#CCC',
        scale: 120,
        width: 500,
        height: 320
    });

    const commonProps = {height: 1, width: 1};

    const duration = 3;

    const rectangleAnimationProps = {
        property: 'height',
        duration,
        values: [1, 0.5, 1]
    };

    const colorAnimationProps = {
        property: 'fillColor',
        duration,
        values: ['#FFF', '#DDD', '#FFF']
    };

    const topPiece = new IsometricPath();
    const star = new IsometricPentagram({ radius: 0.35, planeView: PlaneView.TOP, right: 0.5, left: 0.5, top: 1});
    const rightPiece = new IsometricRectangle({...commonProps, planeView: PlaneView.FRONT, right: 1});
    const leftPiece = new IsometricRectangle({...commonProps, planeView: PlaneView.SIDE, left: 1});

    topPiece
        .moveTo(0, 0, 1)
        .lineTo(1, 0, 1)
        .lineTo(1, 1, 1)
        .lineTo(0, 1, 1);

    topPiece
        .addAnimation({
            property: 'path',
            duration,
            values: [
                'M0 0 1 L1 0 1 L1 1 1 L0 1 1',
                'M0 0 0.5 L1 0 0.5 L1 1 0.5 L0 1 0.5',
                'M0 0 1 L1 0 1 L1 1 1 L0 1 1'
            ]
        })
        .addAnimation(colorAnimationProps);

    star
        .addAnimation({
            property: 'top',
            duration,
            values: [1, 0.5, 1]
        });

    rightPiece
        .addAnimation(rectangleAnimationProps)
        .addAnimation(colorAnimationProps);

    leftPiece
        .addAnimation(rectangleAnimationProps)
        .addAnimation(colorAnimationProps);

    cube.addEventListener('click', function() {
        if (this.animated) {
            this.pauseAnimations();
        } else {
            this.resumeAnimations();
        }
    });

    cube.addChildren(topPiece, rightPiece, leftPiece, star);

};