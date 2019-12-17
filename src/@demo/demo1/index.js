import './styles.scss';

export default ( Isometric, container ) => {

    const { IsometricCanvas, IsometricPath } = Isometric;

    const cube = new IsometricCanvas(container, {scale: 150, width: 500, height: 320});

    const top = new IsometricPath({ fillColor: '#EEE' });
    const right = new IsometricPath({ fillColor: '#999' });
    const left = new IsometricPath({ fillColor: '#CCC' });

    cube
        .addPath(top)
        .addPath(right)
        .addPath(left);

    top
        .moveTo(0, 0, 1)
        .lineTo(1, 0, 1)
        .lineTo(1, 1, 1)
        .lineTo(0, 1, 1);

    right
        .moveTo(1, 0, 1)
        .lineTo(1, 0, 0)
        .lineTo(1, 1, 0)
        .lineTo(1, 1, 1);

    left
        .moveTo(1, 1, 1)
        .lineTo(1, 1, 0)
        .lineTo(0, 1, 0)
        .lineTo(0, 1, 1);

};