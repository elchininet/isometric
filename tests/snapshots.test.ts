import {
    IsometricCanvas,
    IsometricRectangle,
    IsometricCircle,
    IsometricPentagram,
    IsometricPath,
    IsometricText,
    PlaneView,
    SVGPathAnimation,
    SVGRectangleAnimation,
    SVGCircleAnimation,
    IsometricStarPolygon
} from '../src';

enum IDS {
    SVG = 'svg',
    PATH = 'path',
    STAR = 'star',
    CIRCLE = 'circle',
    LABEL = 'label',
    TOP = 'top',
    RIGHT = 'right',
    LEFT = 'left',
    UNDER = 'under'
}

describe('Snapshot tests', (): void => {

    let container: HTMLDivElement;
    //let spySVGAnimateBeginElement: jest.SpyInstance<typeof SVGAnimateTransformElement>;

    beforeEach((): void => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach((): void => {
        if (container.parentNode && container.parentNode === document.body) {
            document.body.removeChild(container);
        }
    });

    it('Default options', (): void => {
        const svg = new IsometricCanvas({ id: IDS.SVG });
        expect(document.body).toMatchSnapshot();
        expect(svg.getSVGCode()).toMatchSnapshot();
        expect(svg.getElement().outerHTML).toBe(svg.getSVGCode());
    });

    it('Draw rectangles', (): void => {

        const cube = new IsometricCanvas({
            container,
            id: IDS.SVG,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const commonProps = {height: 1, width: 1};
        const topPiece = new IsometricRectangle({...commonProps, id: IDS.TOP, planeView: PlaneView.TOP});
        const rightPiece = new IsometricRectangle({...commonProps, id: IDS.RIGHT, planeView: PlaneView.FRONT});
        const leftPiece = new IsometricRectangle({...commonProps, id: 'left', planeView: PlaneView.SIDE});

        topPiece.top = 1;
        rightPiece.right = 1;
        leftPiece.left = 1;

        cube.addChild(topPiece).addChild(rightPiece).addChild(leftPiece);

        expect(container).toMatchSnapshot();

    });

    it('Draw a rectangle with a class', (): void => {
        const canvas = new IsometricCanvas({
            container,
            id: IDS.SVG,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const rect = new IsometricRectangle({
            height: 1,
            width: 1,
            id: IDS.TOP,
            planeView: PlaneView.TOP,
            className: 'rect'
        });

        const circle = new IsometricCircle({
            radius: 0.5,
            id: IDS.CIRCLE,
            planeView: PlaneView.TOP,
            className: 'circle'
        });

        const polygon = new IsometricStarPolygon({
            radius: 0.5,
            points: 5,
            density: 2,
            rotation: 0,
            id: IDS.STAR,
            planeView: PlaneView.TOP,
            className: 'polygon'
        });

        const pentagram = new IsometricPentagram({
            id: IDS.STAR,
            radius: 0.25,
            planeView: PlaneView.TOP,
            className: 'pentagram'
        });

        const path = new IsometricPath({
            id: IDS.PATH,
            className: 'path'
        });

        canvas
            .addChild(rect)
            .addChild(circle)
            .addChild(polygon)
            .addChild(pentagram)
            .addChild(path);
        expect(container).toMatchSnapshot();
    });

    it('Draw circles', (): void => {

        const cube = new IsometricCanvas({
            container,
            id: IDS.SVG,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const commonProps = {radius: 0.5};
        const topPiece = new IsometricCircle({...commonProps, id: IDS.TOP, planeView: PlaneView.TOP});
        const rightPiece = new IsometricCircle({...commonProps, id: IDS.RIGHT, planeView: PlaneView.FRONT});
        const leftPiece = new IsometricCircle({...commonProps, id: 'left', planeView: PlaneView.SIDE});

        topPiece.right = topPiece.left = 0.5;
        topPiece.top = 1;
        rightPiece.left = rightPiece.top = 0.5;
        rightPiece.right = 1;
        leftPiece.right = leftPiece.top = 0.5;
        leftPiece.left = 1;

        cube.addChild(topPiece).addChild(rightPiece).addChild(leftPiece);

        expect(container).toMatchSnapshot();

    });

    it('Draw methods', (): void => {

        const isometric = new IsometricCanvas({
            container,
            id: IDS.SVG,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const bottomT = new IsometricPath({ id: `${IDS.PATH}-bottom-top` });
        const bottomR = new IsometricPath({ id: `${IDS.PATH}-bottom-right` });
        const bottomL = new IsometricPath({ id: `${IDS.PATH}-bottom-left` });

        const topT = new IsometricPath({ id: `${IDS.PATH}-top-top` });
        const topR = new IsometricPath({ id: `${IDS.PATH}-top-right` });
        const topL = new IsometricPath({ id: `${IDS.PATH}-top-left` });

        bottomT.moveTo(0, 0, .5).lineTo(1, 0, .5).lineTo(1, 1, .5).lineTo(0, 1, .5);
        bottomR.moveTo(1, 0, .5).lineTo(1, 0, 0).lineTo(1, 1, 0).lineTo(1, 1, .5);
        bottomL.moveTo(1, 1, .5).lineTo(1, 1, 0).lineTo(0, 1, 0).lineTo(0, 1, .5);

        topT.moveTo(.25, .25, 1.25).lineTo(.75, .25, 1.25).lineTo(.75, .75, 1).lineTo(.25, .75, 1);
        topR.moveTo(.75, .25, 1.25).lineTo(.75, .75, 1).lineTo(.75, .75, .5).lineTo(.75, .25, .5);
        topL.moveTo(.75, .75, 1).lineTo(.25, .75, 1).lineTo(.25, .75, .5).lineTo(.75, .75, .5);

        isometric.addChildren(bottomT, bottomR, bottomL, topT, topR, topL);

        expect(container).toMatchSnapshot();

    });

    it('Draw commands', (): void => {

        const isometric = new IsometricCanvas({
            container,
            id: IDS.SVG,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const right = new IsometricPath({ id: IDS.RIGHT });
        const top1 = new IsometricPath({ id: IDS.TOP });
        const top2 = new IsometricPath({ id: `${IDS.TOP}-2` });
        const top3 = new IsometricPath({ id: `${IDS.TOP}-3` });
        const top4 = new IsometricPath({ id: `${IDS.TOP}-4` });
        const left1 = new IsometricPath({ id: IDS.LEFT });
        const left2 = new IsometricPath({ id: `${IDS.LEFT}-2` });

        right.draw('M1 0 0 L1 1 0 L1 1 0.25 L1 0.5 0.25 L1 0.5 1 L1 0 1');
        top1.draw('M0.25 0.5 1 C0.5 0.5 0.75 0.75 0.5 1 L0.75 0 1 C0.5 0 0.75 0.25 0 1 L0.25 0.5 1');
        top2.draw('M1 0 1 L0.75 0 1 L0.75 0.5 1 L1 0.5 1 L1 0 1 M0 0 1 L0.25 0 1 L0.25 0.5 1 L0 0.5 1 L0 0 1');
        top3.draw('M0 0.5 0.5 L0.5 0.5 0.5 L0.5 1 0.5 L0 1 0.5');
        top4.draw('M0.5 0.5 0.5 L1 0.5 0.25 L1 1 0.25 L0.5 1 0.5');
        left1.draw('M0 0.5 1 L0 0.5 0.5 L0.5 0.5 0.5 L1 0.5 0.25 L1 0.5 1 L0.75 0.5 1 C0.5 0.5 0.75 0.25 0.5 1 L0 0.5 1');
        left2.draw('M0 1 0.5 L0.5 1 0.5 L1 1 0.25 L1 1 0 L0 1 0');

        isometric.addChildren(right, top1, top2, top3, top4, left1, left2);

        expect(container).toMatchSnapshot();

    });

    it('Paths without autoclose', (): void => {

        const isometric = new IsometricCanvas({
            container,
            id: IDS.SVG,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const pathA = new IsometricPath({ id: `${IDS.PATH}-a` });
        const pathB = new IsometricPath({ id: `${IDS.PATH}-b`, autoclose: false });
        const commands = 'M0 0 0 L1 0 0 L1 1 0 L0 1 0';

        pathA.draw(commands);
        pathB.draw(commands);

        isometric.addChildren(pathA, pathB);

        expect(container).toMatchSnapshot();

    });

    it('Draw curves with method aliases', (): void => {

        const cube = new IsometricCanvas({
            container,
            id: IDS.SVG,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const under = new IsometricPath({ id: IDS.UNDER, fillColor: '#EEE' });
        const top = new IsometricPath({ id: IDS.TOP });
        const right = new IsometricPath({ id: IDS.RIGHT });
        const left = new IsometricPath({ id: IDS.LEFT });

        under
            .mt(0, 0, 1)
            .mt(0.25, 0, 1).ct(0.5, 0, 0.75, 0.75, 0, 1).lt(1, 0, 1)
            .lt(1, 0, 0.75).ct(0.75, 0, 0.5, 1, 0, 0.25).lt(1, 0, 0)
            .lt(1, 0.25, 0).ct(0.75, 0.5, 0, 1, 0.75, 0).lt(1, 1, 0)
            .lt(0.75, 1, 0).ct(0.5, 0.75, 0, 0.25, 1, 0).lt(0, 1, 0)
            .lt(0, 1, 0.25).ct(0, 0.75, 0.5, 0, 1, 0.75).lt(0, 1, 1)
            .lt(0, 0.75, 1).ct(0, 0.5, 0.75, 0, 0.25, 1).lt(0, 0, 1);

        top
            .mt(0, 0, 1)
            .lt(0.25, 0, 1).ct(0.5, 0.25, 1, 0.75, 0, 1).lt(1, 0, 1)
            .lt(1, 0.25, 1).ct(0.75, 0.5, 1, 1, 0.75, 1).lt(1, 1, 1)
            .lt(0.75, 1, 1).ct(0.5, 0.75, 1, 0.25, 1, 1).lt(0, 1, 1)
            .lt(0, 0.75, 1).ct(0.25, 0.5, 1, 0, 0.25, 1).lt(0, 0, 1);

        right
            .mt(1, 0, 1)
            .lt(1, 0, 0.75).ct(1, 0.25, 0.5, 1, 0, 0.25).lt(1, 0, 0)
            .lt(1, 0.25, 0).ct(1, 0.5, 0.25, 1, 0.75, 0).lt(1, 1, 0)
            .lt(1, 1, 0.25).ct(1, 0.75, 0.5, 1, 1, 0.75).lt(1, 1, 1)
            .lt(1, 0.75, 1).ct(1, 0.5, 0.75, 1, 0.25, 1).lt(1, 0, 1);

        left
            .mt(1, 1, 1)
            .lt(1, 1, 0.75).ct(0.75, 1, 0.5, 1, 1, 0.25).lt(1, 1, 0)
            .lt(0.75, 1, 0).ct(0.5, 1, 0.25, 0.25, 1, 0).lt(0, 1, 0)
            .lt(0, 1, 0.25).ct(0.25, 1, 0.5, 0, 1, 0.75).lt(0, 1, 1)
            .lt(0.25, 1, 1).ct(0.5, 1, 0.75, 0.75, 1, 1).lt(1, 1, 1);

        cube.addChildren(under, top, right, left);

        expect(container).toMatchSnapshot();

    });

    it('Draw animations with values', (): void => {

        const isometric = new IsometricCanvas({
            container,
            id: IDS.SVG,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const commonProps = {height: 1, width: 1};

        const duration = 3;

        const colorAnimationProps = {
            property: 'fillColor',
            duration,
            values: ['#FFF', '#DDD', '#FFF']
        };

        const topPiece = new IsometricPath({ id: IDS.TOP });
        const rightPiece = new IsometricRectangle({...commonProps, id: IDS.RIGHT, planeView: PlaneView.FRONT});
        const leftPiece = new IsometricRectangle({...commonProps, id: IDS.LEFT, planeView: PlaneView.SIDE});
        const star = new IsometricPentagram({id: IDS.STAR, radius: 0.25, planeView: PlaneView.TOP});
        const label = new IsometricText({id: IDS.LABEL, planeView: PlaneView.TOP});

        topPiece.mt(0, 0, 1).lt(1, 0, 1).lt(1, 1, 1).lt(0, 1, 1);
        rightPiece.right = 1;
        leftPiece.left = 1;
        star.left = 0.5;
        star.right = 0.5;
        star.top = 1;
        label.text = 'TEST';

        topPiece
            .addAnimation({
                property: 'path',
                duration,
                values: [
                    'M0 0 1 L1 0 1 L1 1 1 L0 1 1',
                    'M0 0 0.5 L1 0 0.5 L1 1 0.5 L0 1 0.5',
                    'M0 0 1 L1 0 1 L1 1 1 L0 1 1'
                ]
            } as SVGPathAnimation)
            .addAnimation(colorAnimationProps as SVGPathAnimation);

        rightPiece
            .addAnimation({
                property: 'height',
                duration,
                from: 1,
                to: 0.5
            } as SVGRectangleAnimation)
            .addAnimation(colorAnimationProps as SVGRectangleAnimation);

        leftPiece
            .addAnimation({
                property: 'height',
                duration,
                values: 0.5
            } as SVGRectangleAnimation)
            .addAnimation(colorAnimationProps as SVGRectangleAnimation);

        star
            .addAnimation({
                property: 'radius',
                duration,
                values: [0.25, 1, 0.25]
            });

        label.
            addAnimation({
                property: 'right',
                duration,
                values: [0, 1, 0]
            })
            .addAnimation({
                property: 'rotation',
                duration,
                values: [0, 180, 360]
            });

        isometric.addChildren(topPiece, rightPiece, leftPiece, label, star);

        expect(container).toMatchSnapshot();

    });

    it('Draw animations with a single value', (): void => {

        const isometric = new IsometricCanvas({
            container,
            id: IDS.SVG,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const commonProps = {height: 1, width: 1};

        const duration = 3;

        const colorAnimationProps = {
            property: 'fillColor',
            duration,
            values: '#FFF'
        };

        const topPiece = new IsometricPath({ id: IDS.TOP });
        const rightPiece = new IsometricRectangle({...commonProps, id: IDS.RIGHT, planeView: PlaneView.FRONT});
        const leftPiece = new IsometricRectangle({...commonProps, id: IDS.LEFT, planeView: PlaneView.SIDE});
        const star = new IsometricPentagram({id: IDS.STAR, radius: 0.25, planeView: PlaneView.TOP});
        const label = new IsometricText({id: IDS.LABEL, planeView: PlaneView.TOP});

        topPiece.mt(0, 0, 1).lt(1, 0, 1).lt(1, 1, 1).lt(0, 1, 1);
        rightPiece.right = 1;
        leftPiece.left = 1;

        topPiece
            .addAnimation({
                property: 'path',
                duration,
                values: 'M0 0 1 L1 0 1 L1 1 1 L0 1 1'
            } as SVGPathAnimation)
            .addAnimation(colorAnimationProps as SVGPathAnimation);

        rightPiece
            .addAnimation({
                property: 'height',
                duration,
                values: 1
            } as SVGRectangleAnimation)
            .addAnimation(colorAnimationProps as SVGRectangleAnimation);

        leftPiece
            .addAnimation({
                property: 'height',
                duration,
                values: 0.5
            } as SVGRectangleAnimation)
            .addAnimation(colorAnimationProps as SVGRectangleAnimation);

        star
            .addAnimation({
                property: 'radius',
                duration,
                values: 1
            });

        label.
            addAnimation({
                property: 'right',
                duration,
                values: 1
            })
            .addAnimation({
                property: 'rotation',
                duration,
                values: 180
            });

        isometric.addChildren(topPiece, rightPiece, leftPiece, label, star);

        expect(container).toMatchSnapshot();

    });

    it('Draw animations with from and to', (): void => {

        const isometric = new IsometricCanvas({
            container,
            id: IDS.SVG,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const commonProps = {height: 1, width: 1};

        const duration = 3;

        const colorAnimationProps = {
            property: 'fillColor',
            duration,
            from: '#FFF',
            to: '#DDD'
        };

        const topPiece = new IsometricPath({ id: IDS.TOP });
        const rightPiece = new IsometricRectangle({...commonProps, id: IDS.RIGHT, planeView: PlaneView.FRONT});
        const leftPiece = new IsometricRectangle({...commonProps,id: IDS.LEFT, planeView: PlaneView.SIDE});
        const star = new IsometricPentagram({id: IDS.STAR, radius: 0.25, planeView: PlaneView.TOP, rotation: 90});
        const label = new IsometricText({id: IDS.LABEL, planeView: PlaneView.TOP});

        topPiece.mt(0, 0, 1).lt(1, 0, 1).lt(1, 1, 1).lt(0, 1, 1);
        rightPiece.right = 1;
        leftPiece.left = 1;

        topPiece
            .addAnimation({
                property: 'path',
                duration,
                from: 'M0 0 1 L1 0 1 L1 1 1 L0 1 1',
                to: 'M0 0 0.5 L1 0 0.5 L1 1 0.5 L0 1 0.5'
            } as SVGPathAnimation)
            .addAnimation(colorAnimationProps as SVGPathAnimation);

        rightPiece
            .addAnimation({
                property: 'height',
                duration,
                from: 1,
                to: 0.5
            } as SVGRectangleAnimation)
            .addAnimation(colorAnimationProps as SVGRectangleAnimation);

        leftPiece
            .addAnimation({
                property: 'height',
                duration,
                from: 1,
                to: 2
            } as SVGRectangleAnimation)
            .addAnimation(colorAnimationProps as SVGRectangleAnimation);

        star
            .addAnimation({
                property: 'radius',
                duration,
                from: 0.25,
                to: 1
            });

        label.
            addAnimation({
                property: 'right',
                duration,
                from: 0,
                to: 1
            })
            .addAnimation({
                property: 'rotation',
                duration,
                from: 0,
                to: 180
            });

        isometric.addChildren(topPiece, rightPiece, leftPiece, label, star);

        expect(container).toMatchSnapshot();

    });

    it('Remove animations', (): void => {

        const isometric = new IsometricCanvas({
            container,
            id: IDS.SVG,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const commonProps = {height: 1, width: 1};

        const colorAnimationProps = {
            property: 'fillColor',
            values: ['#FFF', '#DDD', '#FFF']
        };

        const topPiece = new IsometricPath({ id: IDS.TOP });
        const rightPiece = new IsometricRectangle({...commonProps, id: IDS.TOP, planeView: PlaneView.FRONT});
        const leftPiece = new IsometricRectangle({...commonProps, id: IDS.LEFT, planeView: PlaneView.SIDE});
        const star = new IsometricPentagram({id: IDS.STAR, radius: 0.25, planeView: PlaneView.FRONT});
        const circlePiece = new IsometricCircle({id: IDS.CIRCLE, radius: 1, planeView: PlaneView.TOP});

        topPiece.mt(0, 0, 1).lt(1, 0, 1).lt(1, 1, 1).lt(0, 1, 1);
        rightPiece.right = 1;
        leftPiece.left = 1;

        topPiece
            .addAnimation({
                property: 'path',
                values: 'M0 0 1 L1 0 1 L1 1 1 L0 1 1'
            } as SVGPathAnimation)
            .addAnimation(colorAnimationProps as SVGPathAnimation);

        rightPiece
            .addAnimation({
                property: 'height',
                from: 1,
                to: 0.5
            } as SVGRectangleAnimation)
            .addAnimation(colorAnimationProps as SVGRectangleAnimation);

        leftPiece
            .addAnimation({
                property: 'height',
                values: [1, 0.5]
            } as SVGRectangleAnimation)
            .addAnimation(colorAnimationProps as SVGRectangleAnimation);

        circlePiece
            .addAnimation({
                property: 'radius',
                from: 1,
                to: 0.5
            })
            .addAnimation(colorAnimationProps as SVGCircleAnimation);
        star
            .addAnimation({
                property: 'radius',
                values: [0.25, 1, 0.25]
            });

        // Remove animation before adding the elements
        rightPiece.removeAnimations();
        topPiece.removeAnimationByIndex(1);
        circlePiece.removeAnimationByIndex(0);
        star.removeAnimations();

        isometric.addChildren(topPiece, rightPiece, leftPiece, circlePiece, star);

        // Redraw the elements with animations
        topPiece.update();

        // Remove animations after adding the elements
        leftPiece.removeAnimationByIndex(0);
        leftPiece.removeAnimations();
        circlePiece.removeAnimations();
        star.removeAnimations();

        // Remove a wrong index
        topPiece.removeAnimationByIndex(1);
        topPiece.removeAnimationByIndex(10);

        // Add another animation
        topPiece.addAnimation({
            property: 'path',
            from: 'M0 0 1 L1 0 1 L1 1 1 L0 1 1',
            to: 'M0 0 0.5 L1 0 0.5 L1 1 0.5 L0 1 0.5'
        } as SVGPathAnimation);

        topPiece.removeAnimations();

        circlePiece
            .addAnimation({
                property: 'radius',
                values: [0.5, 1]
            });

        circlePiece.removeAnimationByIndex(0);

        circlePiece
            .addAnimation({
                property: 'radius',
                values: 1
            });

        circlePiece.removeAnimations();

        circlePiece
            .addAnimation({
                property: 'left',
                from: 0,
                to: 1
            });

        circlePiece.removeAnimations();

        expect(container).toMatchSnapshot();

    });

});