export default ( IsometricModule, container ) => {

    const { IsometricCanvas, IsometricStarPolygon, PlaneView } = IsometricModule;

    const cube = new IsometricCanvas({
        container,
        backgroundColor: '#CCC',
        scale: 120,
        width: 500,
        height: 320
    });

    const commonProps = {
        radius: 0.5,
        points: 8,
        density: 2,
        right: 0.5,
        left: 0.5,
        top: 0.5
    };

    const planes = [PlaneView.SIDE, PlaneView.FRONT, PlaneView.TOP];

    const planePropsHash = {
        [PlaneView.TOP]: 'top',
        [PlaneView.FRONT]: 'right',
        [PlaneView.SIDE]: 'left'
    };

    planes.forEach((planeView) => {
        const props = { ...commonProps, fillColor: '#EEE', planeView };
        const coord = planePropsHash[planeView];
        const starPolygonBack = new IsometricStarPolygon(props);
        starPolygonBack[coord] = 0;
        cube.addChild(starPolygonBack);
    });

    planes.forEach((planeView) => {
        const props = { ...commonProps, planeView };
        const coord = planePropsHash[planeView];
        const starPolygonFront = new IsometricStarPolygon(props);
        starPolygonFront[coord] = 1;
        cube.addChild(starPolygonFront);
    });

};