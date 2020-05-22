import './styles.scss';

export default ( IsometricModule, container ) => {

    const { IsometricCanvas, IsometricPath } = IsometricModule;

    const isometric = new IsometricCanvas(container, {
        backgroundColor: '#CCC',
        scale: 120,
        width: 500,
        height: 320
    });

    const right = new IsometricPath();
    const top1 = new IsometricPath();
    const top2 = new IsometricPath();
    const top3 = new IsometricPath();
    const left1 = new IsometricPath();
    const left2 = new IsometricPath();

    // Mr l t (Move to right left top)
    // Lr l t (Line to right left top)
    right.draw('M1 0 0 L1 1 0 L1 1 0.25 L1 0.5 0.25 L1 0.5 1 L1 0 1');
    top1.draw('M1 0 1 L0 0 1 L0 0.5 1 L1 0.5 1');
    top2.draw('M0 0.5 0.5 L0.5 0.5 0.5 L0.5 1 0.5 L0 1 0.5');
    top3.draw('M0.5 0.5 0.5 L1 0.5 0.25 L1 1 0.25 L0.5 1 0.5');
    left1.draw('M0 0.5 1 L0 0.5 0.5 L0.5 0.5 0.5 L1 0.5 0.25 L1 0.5 1');
    left2.draw('M0 1 0.5 L0.5 1 0.5 L1 1 0.25 L1 1 0 L0 1 0');

    isometric.addChildren(right, top1, top2, top3, left1, left2);

};