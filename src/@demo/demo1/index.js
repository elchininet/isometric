import './styles.scss';

export default ( Isometric, container ) => {

    const { IsometricCanvas, IsometricPath } = Isometric;

    function toggleColor(evt) {
        this.fillColor = this.fillColor === 'white' ? '#EEE' : 'white';
    }

    const cube = new IsometricCanvas(container, {
        backgroundColor: '#CCC',
        scale: 120,
        width: 500,
        height: 320
    });

    const top = new IsometricPath();
    const right = new IsometricPath();
    const left = new IsometricPath();

    top
        .moveTo(0, 0, 1)
        .lineTo(1, 0, 1)
        .lineTo(1, 1, 1)
        .lineTo(0, 1, 1)
        .addEventListener('click', toggleColor, true);

    right
        .moveTo(1, 0, 1)
        .lineTo(1, 0, 0)
        .lineTo(1, 1, 0)
        .lineTo(1, 1, 1)
        .addEventListener('click', toggleColor, true);

    left
        .moveTo(1, 1, 1)
        .lineTo(1, 1, 0)
        .lineTo(0, 1, 0)
        .lineTo(0, 1, 1)
        .addEventListener('click', toggleColor, true);

    cube
        .addPath(top)
        .addPath(right)
        .addPath(left);

};