export default ( IsometricModule, container ) => {

    const { IsometricCanvas, IsometricGroup, IsometricPath } = IsometricModule;

    const isometric = new IsometricCanvas({
        container,
        backgroundColor: '#CCC',
        scale: 120,
        width: 500,
        height: 320
    });

    const bottomT = new IsometricPath();
    const bottomR = new IsometricPath();
    const bottomL = new IsometricPath();

    const topT = new IsometricPath();
    const topR = new IsometricPath();
    const topL = new IsometricPath();

    bottomT.mt(0, 0, .5).lt(1, 0, .5).lt(1, 1, .5).lt(0, 1, .5);
    bottomR.mt(1, 0, .5).lt(1, 0, 0).lt(1, 1, 0).lt(1, 1, .5);
    bottomL.mt(1, 1, .5).lt(1, 1, 0).lt(0, 1, 0).lt(0, 1, .5);

    topT.mt(.25, .25, 1).lt(.75, .25, 1).lt(.75, .75, .75).lt(.25, .75, .75);
    topR.mt(.75, .25, 1).lt(.75, .75, .75).lt(.75, .75, .25).lt(.75, .25, .25);
    topL.mt(.75, .75, .75).lt(.25, .75, .75).lt(.25, .75, .25).lt(.75, .75, .25);

    const bottomPiece = new IsometricGroup();
    const topPiece = new IsometricGroup();
    topPiece.top = .25;

    bottomPiece.addChildren(bottomT, bottomR, bottomL);
    topPiece.addChildren(topT, topR, topL);

    let flip = true;

    topPiece.addEventListener('click', function() {
        if (this.right) {
            this.right = 0;
            return;
        }
        this.right = flip ? 0.25 : -0.25;
        flip = !flip;
    });

    isometric.addChildren(bottomPiece, topPiece);

};