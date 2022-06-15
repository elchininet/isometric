export default ( IsometricModule, container ) => {

    const { IsometricCanvas, IsometricGroup, IsometricRectangle, PlaneView } = IsometricModule;

    const canvas = new IsometricCanvas({
        container,
        backgroundColor: '#CCC',
        scale: 20,
        width: 500,
        height: 320
    });

    function resetPlanes() {
        cube.right = cube.left = cube.top = 0;
        planeTop.fillOpacity = planeRight.fillOpacity = planeLeft.fillOpacity = 0.25;
    }

    function changePlane() {
        resetPlanes();
        this.fillOpacity = 1;
        cube.drag = this.planeView;
    }

    const planeProps = { height: 6, width: 6, fillOpacity: 0.25 };
    const planeTop = new IsometricRectangle({ ...planeProps, planeView: PlaneView.TOP, fillOpacity: 1 });
    const planeRight = new IsometricRectangle({ ...planeProps, planeView: PlaneView.FRONT });
    const planeLeft = new IsometricRectangle({ ...planeProps, planeView: PlaneView.SIDE });

    const cubeProps = { height: 1, width: 1 };
    const cubeTop = new IsometricRectangle({ ...cubeProps, planeView: PlaneView.TOP, top: 1 });
    const cubeRight = new IsometricRectangle({ ...cubeProps, planeView: PlaneView.FRONT, right: 1 });
    const cubeLeft = new IsometricRectangle({ ...cubeProps, planeView: PlaneView.SIDE, left: 1 });

    const cube = new IsometricGroup();

    const limit = [0, 5];
    cube.drag = 'TOP';
    cube.dragLimit = { top: limit, right: limit, left: limit };

    planeTop.addEventListener('click', changePlane, true);
    planeRight.addEventListener('click', changePlane, true);
    planeLeft.addEventListener('click', changePlane, true);

    cube.addChildren(cubeTop, cubeRight, cubeLeft);
    canvas.addChildren(planeTop, planeRight, planeLeft, cube);

};