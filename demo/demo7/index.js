import '../images/block_side.png';
import '../images/block_top.png';

export default ( IsometricModule, container ) => {

    const { IsometricCanvas, IsometricRectangle, IsometricText, PlaneView } = IsometricModule;

    const cube = new IsometricCanvas({
        container,
        backgroundColor: '#CCC',
        scale: 120,
        width: 500,
        height: 320
    });

    const rectangleCommonProps = {height: 1, width: 1};
    const textCommonProps = { fontFamily: 'Arial', fontSize: 15, fillColor: '#666', strokeWidth: 0 };
    const topPiece = new IsometricRectangle({...rectangleCommonProps, planeView: PlaneView.TOP});
    const rightPiece = new IsometricRectangle({...rectangleCommonProps, planeView: PlaneView.FRONT});
    const leftPiece = new IsometricRectangle({...rectangleCommonProps, planeView: PlaneView.SIDE});

    const topText = new IsometricText({...textCommonProps, planeView: PlaneView.TOP, right: 0.5, left: 0.5, top: 1});
    const rightText = new IsometricText({...textCommonProps, planeView: PlaneView.FRONT, right: 1, left: 0.5, top: 0.5});
    const leftText = new IsometricText({...textCommonProps, planeView: PlaneView.SIDE, right: 0.5, left: 1, top: 0.5});

    topPiece.top = 1;
    rightPiece.right = 1;
    leftPiece.left = 1;

    topText.text = 'TOP FACE';
    rightText.text = 'RIGHT FACE';
    leftText.text = 'LEFT FACE';

    cube
        .addChild(topPiece)
        .addChild(rightPiece)
        .addChild(leftPiece)
        .addChild(topText)
        .addChild(rightText)
        .addChild(leftText);

};