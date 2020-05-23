import './styles.scss';

export default ( IsometricModule, container ) => {

    const { IsometricCanvas, IsometricRectangle, PlaneView } = IsometricModule;

    function toggleColor() {
        this.fillColor = this.fillColor === 'white' ? '#EEE' : 'white';
    }

    const cube = new IsometricCanvas(container, {
        backgroundColor: '#CCC',
        scale: 120,
        width: 500,
        height: 320
    });

    const commonProps = {height: 1, width: 1};
    const topPiece = new IsometricRectangle({...commonProps, planeView: PlaneView.TOP});
    const rightPiece = new IsometricRectangle({...commonProps, planeView: PlaneView.FRONT});
    const leftPiece = new IsometricRectangle({...commonProps, planeView: PlaneView.SIDE});

    topPiece.top = 1;
    topPiece.addEventListener('click', toggleColor, true);

    rightPiece.right = 1;
    rightPiece.addEventListener('click', toggleColor, true);

    leftPiece.left = 1;
    leftPiece.addEventListener('click', toggleColor, true);

    cube
        .addChild(topPiece)
        .addChild(rightPiece)
        .addChild(leftPiece);

};