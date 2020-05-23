import './styles.scss';

export default ( IsometricModule, container ) => {

    const { IsometricCanvas, IsometricPath } = IsometricModule;

    const isometric = new IsometricCanvas(container, {
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

    topT.mt(.25, .25, 1.25).lt(.75, .25, 1.25).lt(.75, .75, 1).lt(.25, .75, 1);
    topR.mt(.75, .25, 1.25).lt(.75, .75, 1).lt(.75, .75, .5).lt(.75, .25, .5);
    topL.mt(.75, .75, 1).lt(.25, .75, 1).lt(.25, .75, .5).lt(.75, .75, .5);

    isometric.addChildren(bottomT, bottomR, bottomL, topT, topR, topL);

};