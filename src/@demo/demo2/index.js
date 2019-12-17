import './styles.scss';

export default ( Isometric, container ) => {

    const { IsometricCanvas, IsometricPath } = Isometric;

    const isometric = new IsometricCanvas(container, {scale: 150, width: 500, height: 320});

    const bottomConfig = { fillColor: 'lightgray' };
    const bottomT = new IsometricPath(bottomConfig);
    const bottomR = new IsometricPath(bottomConfig);
    const bottomL = new IsometricPath(bottomConfig);

    const topConfig = { fillColor: 'darkgray' };
    const topT = new IsometricPath(topConfig);
    const topR = new IsometricPath(topConfig);
    const topL = new IsometricPath(topConfig);

    isometric.addPaths(bottomT, bottomR, bottomL, topT, topR, topL);

    bottomT.mt(0, 0, .5).lt(1, 0, .5).lt(1, 1, .5).lt(0, 1, .5);
    bottomR.mt(1, 0, .5).lt(1, 0, 0).lt(1, 1, 0).lt(1, 1, .5);
    bottomL.mt(1, 1, .5).lt(1, 1, 0).lt(0, 1, 0).lt(0, 1, .5);

    topT.mt(.25, .25, 1).lt(.75, .25, 1).lt(.75, .75, 1).lt(.25, .75, 1);
    topR.mt(.75, .25, 1).lt(.75, .75, 1).lt(.75, .75, .5).lt(.75, .25, .5);
    topL.mt(.75, .75, 1).lt(.25, .75, 1).lt(.25, .75, .5).lt(.75, .75, .5);

};