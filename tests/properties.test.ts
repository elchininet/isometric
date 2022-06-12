import {
    IsometricCanvas,
    IsometricGroup,
    IsometricRectangle,
    IsometricCircle,
    IsometricPath,
    IsometricGraphicProps,
    PlaneView
} from '../src';

describe('Test properties', (): void => {

    const containerID = 'container';
    const containerSelector = `#${containerID}`;
    let container: HTMLDivElement;
    let cube: IsometricCanvas;
    let group: IsometricGroup;
    let path: IsometricPath;
    let rectangle: IsometricRectangle;
    let circle: IsometricCircle;
    let svgElement: SVGElement;
    let groupElement: SVGElement;
    let pathElement: SVGElement;
    let rectangleElement: SVGElement;
    let circleElement: SVGElement;

    beforeEach((): void => {

        container = document.createElement('div');
        container.id = containerID;
        document.body.appendChild(container);

        const commonProps: IsometricGraphicProps = {
            fillColor: '#FFF',
            fillOpacity: 0.5,
            strokeColor: '#000',
            strokeDashArray: [1, 2, 3],
            strokeLinecap: 'round',
            strokeLinejoin: 'miter',
            strokeOpacity: 0.25,
            strokeWidth: 2
        };

        cube = new IsometricCanvas({
            container: containerSelector,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        path = new IsometricPath(commonProps);

        rectangle = new IsometricRectangle({
            height: 1,
            width: 1,
            planeView: PlaneView.TOP,
            ...commonProps
        });

        circle = new IsometricCircle({
            radius: 0.5,
            right: 1,
            left: 2,
            top: 0.5,
            planeView: PlaneView.TOP,
            ...commonProps
        });

        path.moveTo(0, 0, 0).lineTo(1, 0, 0).lineTo(1, 1, 0).lineTo(0, 1, 0);

        group = new IsometricGroup({
            right: 1,
            left: 2,
            top: 0.5
        });
        
        group.addChildren(rectangle, circle);

        cube.addChildren(path, group);

        svgElement = cube.getElement();
        groupElement = group.getElement();
        pathElement = path.getElement();
        rectangleElement = rectangle.getElement();
        circleElement = circle.getElement();

    });

    afterEach((): void => {
        if (container.parentNode && container.parentNode === document.body) {
            document.body.removeChild(container);
        }        
    });

    it('IsometricCanvas properties', (): void => {

        expect(cube.backgroundColor).toBe('#CCC');
        expect(cube.scale).toBe(120);
        expect(cube.height).toBe(320);
        expect(cube.width).toBe(500);

        const rect = svgElement.querySelector('rect:first-child') as SVGRectElement;

        expect(rect).not.toBeNull();

        expect(rect.getAttribute('fill')).toBe('#CCC');
        expect(rect.getAttribute('height')).toBe('320px');
        expect(rect.getAttribute('width')).toBe('500px');
        expect(svgElement.getAttribute('height')).toBe('320px');
        expect(svgElement.getAttribute('width')).toBe('500px');

        cube.backgroundColor = '#EEE';
        cube.scale = 100;
        cube.height = 480;
        cube.width = 640;

        expect(cube.backgroundColor).toBe('#EEE');
        expect(cube.scale).toBe(100);
        expect(cube.height).toBe(480);
        expect(cube.width).toBe(640);

        expect(rect.getAttribute('fill')).toBe('#EEE');
        expect(rect.getAttribute('height')).toBe('480px');
        expect(rect.getAttribute('width')).toBe('640px');
        expect(svgElement.getAttribute('height')).toBe('480px');
        expect(svgElement.getAttribute('width')).toBe('640px');

        expect(cube.animated).toBe(true);
        cube.pauseAnimations();
        expect(cube.animated).toBe(false);
        cube.resumeAnimations();
        expect(cube.animated).toBe(true);

    });

    it('Compare IsometricPath vs IsometricRectangle', (): void => {
        
        expect(path.fillColor).toBe(rectangle.fillColor);
        expect(path.fillOpacity).toBe(rectangle.fillOpacity);
        expect(path.strokeColor).toBe(rectangle.strokeColor);
        expect(path.strokeDashArray).toMatchObject(rectangle.strokeDashArray);
        expect(path.strokeLinecap).toBe(rectangle.strokeLinecap);
        expect(path.strokeLinejoin).toBe(rectangle.strokeLinejoin);
        expect(path.strokeOpacity).toBe(rectangle.strokeOpacity);
        expect(path.strokeWidth).toBe(rectangle.strokeWidth);

        expect(pathElement.getAttribute('d')).toBe(rectangleElement.getAttribute('d'));
        
    });

    it('Compare IsometricPath vs IsometricCircle', (): void => {
        
        expect(path.fillColor).toBe(circle.fillColor);
        expect(path.fillOpacity).toBe(circle.fillOpacity);
        expect(path.strokeColor).toBe(circle.strokeColor);
        expect(path.strokeDashArray).toMatchObject(circle.strokeDashArray);
        expect(path.strokeLinecap).toBe(circle.strokeLinecap);
        expect(path.strokeLinejoin).toBe(circle.strokeLinejoin);
        expect(path.strokeOpacity).toBe(circle.strokeOpacity);
        expect(path.strokeWidth).toBe(circle.strokeWidth);
        
    });

    it('IsometricRectangle change position', (): void => {
        
        rectangle.planeView = PlaneView.TOP;
        expect(rectangleElement.getAttribute('d')).toBe('M250 160 L353.923 220 L250 280 L146.077 220z');
        
        rectangle.planeView = PlaneView.FRONT;
        expect(rectangleElement.getAttribute('d')).toBe('M250 160 L146.077 220 L146.077 100 L250 40z');
        
        rectangle.planeView = PlaneView.SIDE;
        expect(rectangleElement.getAttribute('d')).toBe('M250 160 L353.923 220 L353.923 100 L250 40z');

        rectangle.planeView = PlaneView.TOP;
        rectangle.width = 2;
        expect(rectangle.width).toBe(2);
        expect(rectangleElement.getAttribute('d')).toBe('M250 160 L457.846 280 L353.923 340 L146.077 220z');

        rectangle.height = 2;
        expect(rectangle.height).toBe(2);
        expect(rectangleElement.getAttribute('d')).toBe('M250 160 L457.846 280 L250 400 L42.154 280z');

        rectangle.clear();
        expect(rectangleElement.getAttribute('d')).toBe('');
        rectangle.update();
        expect(rectangleElement.getAttribute('d')).toBe('M250 160 L457.846 280 L250 400 L42.154 280z');
        
    });

    it('IsometricCircle change position', (): void => {

        expect(circle.right).toBe(1);
        expect(circle.left).toBe(2);
        expect(circle.top).toBe(0.5);

        circle.planeView = PlaneView.TOP;
        expect(circleElement.getAttribute('d')).toBe('M94.1155 310 A 73.484658 42.426407 0 0 0 198.0385 250 A 73.484658 42.426407 180 0 0 94.1155 310z');
        
        circle.planeView = PlaneView.FRONT;
        expect(circleElement.getAttribute('d')).toBe('M94.1155 310 A 73.484684 42.426392 119.999977 0 0 198.0385 250 A 73.484684 42.426392 -60.000023 0 0 94.1155 310z');
        
        circle.planeView = PlaneView.SIDE;
        expect(circleElement.getAttribute('d')).toBe('M94.1155 250 A 73.484684 42.426392 60.000023 0 0 198.0385 310 A 73.484684 42.426392 -119.999977 0 0 94.1155 250z');

        circle.planeView = PlaneView.TOP;
        circle.radius = 1;
        expect(circle.radius).toBe(1);
        expect(circleElement.getAttribute('d')).toBe('M42.154 340 A 146.969316 84.852814 0 0 0 250 220 A 146.969316 84.852814 180 0 0 42.154 340z');

        circle.clear();
        expect(circleElement.getAttribute('d')).toBe('');
        circle.update();
        expect(circleElement.getAttribute('d')).toBe('M42.154 340 A 146.969316 84.852814 0 0 0 250 220 A 146.969316 84.852814 180 0 0 42.154 340z');
        
    });

    it('IsometricPath properties', (): void => {
        
        expect(path.fillColor).toBe('#FFF');
        expect(path.fillOpacity).toBe(0.5);
        expect(path.strokeColor).toBe('#000');
        expect(path.strokeDashArray).toMatchObject([1, 2, 3]);
        expect(path.strokeLinecap).toBe('round');
        expect(path.strokeLinejoin).toBe('miter');
        expect(path.strokeOpacity).toBe(0.25);
        expect(path.strokeWidth).toBe(2);
        expect(path.autoclose).toBeTruthy();
        
        expect(pathElement.getAttribute('fill')).toBe('#FFF');
        expect(pathElement.getAttribute('fill-opacity')).toBe('0.5');
        expect(pathElement.getAttribute('stroke')).toBe('#000');
        expect(pathElement.getAttribute('stroke-dasharray')).toBe('1 2 3');
        expect(pathElement.getAttribute('stroke-linecap')).toBe('round');
        expect(pathElement.getAttribute('stroke-linejoin')).toBe('miter');
        expect(pathElement.getAttribute('stroke-opacity')).toBe('0.25');
        expect(pathElement.getAttribute('stroke-width')).toBe('2');
        expect(pathElement.getAttribute('d').endsWith('z')).toBeTruthy();

        path.fillColor = '#000';
        path.fillOpacity = 1;
        path.strokeColor = '#FFF';
        path.strokeDashArray = [3, 2, 1];
        path.strokeLinecap = 'butt';
        path.strokeLinejoin = 'bevel';
        path.strokeOpacity = 0.75;
        path.strokeWidth = 1;
        path.autoclose = false;

        expect(path.fillColor).toBe('#000');
        expect(path.fillOpacity).toBe(1);
        expect(path.strokeColor).toBe('#FFF');
        expect(path.strokeDashArray).toMatchObject([3, 2, 1]);
        expect(path.strokeLinecap).toBe('butt');
        expect(path.strokeLinejoin).toBe('bevel');
        expect(path.strokeOpacity).toBe(0.75);
        expect(path.strokeWidth).toBe(1);
        expect(path.autoclose).toBeFalsy();
        
        expect(pathElement.getAttribute('fill')).toBe('#000');
        expect(pathElement.getAttribute('fill-opacity')).toBe('1');
        expect(pathElement.getAttribute('stroke')).toBe('#FFF');
        expect(pathElement.getAttribute('stroke-dasharray')).toBe('3 2 1');
        expect(pathElement.getAttribute('stroke-linecap')).toBe('butt');
        expect(pathElement.getAttribute('stroke-linejoin')).toBe('bevel');
        expect(pathElement.getAttribute('stroke-opacity')).toBe('0.75');
        expect(pathElement.getAttribute('stroke-width')).toBe('1');
        expect(pathElement.getAttribute('d').endsWith('z')).toBeFalsy();
        
    });

    it('IsometricRectangle properties', (): void => {
        
        expect(rectangle.fillColor).toBe('#FFF');
        expect(rectangle.fillOpacity).toBe(0.5);
        expect(rectangle.strokeColor).toBe('#000');
        expect(rectangle.strokeDashArray).toMatchObject([1, 2, 3]);
        expect(rectangle.strokeLinecap).toBe('round');
        expect(rectangle.strokeLinejoin).toBe('miter');
        expect(rectangle.strokeOpacity).toBe(0.25);
        expect(rectangle.strokeWidth).toBe(2);
        
        expect(rectangleElement.getAttribute('fill')).toBe('#FFF');
        expect(rectangleElement.getAttribute('fill-opacity')).toBe('0.5');
        expect(rectangleElement.getAttribute('stroke')).toBe('#000');
        expect(rectangleElement.getAttribute('stroke-dasharray')).toBe('1 2 3');
        expect(rectangleElement.getAttribute('stroke-linecap')).toBe('round');
        expect(rectangleElement.getAttribute('stroke-linejoin')).toBe('miter');
        expect(rectangleElement.getAttribute('stroke-opacity')).toBe('0.25');
        expect(rectangleElement.getAttribute('stroke-width')).toBe('2');

        rectangle.fillColor = '#000';
        rectangle.fillOpacity = 1;
        rectangle.strokeColor = '#FFF';
        rectangle.strokeDashArray = [3, 2, 1];
        rectangle.strokeLinecap = 'butt';
        rectangle.strokeLinejoin = 'bevel';
        rectangle.strokeOpacity = 0.75;
        rectangle.strokeWidth = 1;

        expect(rectangle.fillColor).toBe('#000');
        expect(rectangle.fillOpacity).toBe(1);
        expect(rectangle.strokeColor).toBe('#FFF');
        expect(rectangle.strokeDashArray).toMatchObject([3, 2, 1]);
        expect(rectangle.strokeLinecap).toBe('butt');
        expect(rectangle.strokeLinejoin).toBe('bevel');
        expect(rectangle.strokeOpacity).toBe(0.75);
        expect(rectangle.strokeWidth).toBe(1);
        
        expect(rectangleElement.getAttribute('fill')).toBe('#000');
        expect(rectangleElement.getAttribute('fill-opacity')).toBe('1');
        expect(rectangleElement.getAttribute('stroke')).toBe('#FFF');
        expect(rectangleElement.getAttribute('stroke-dasharray')).toBe('3 2 1');
        expect(rectangleElement.getAttribute('stroke-linecap')).toBe('butt');
        expect(rectangleElement.getAttribute('stroke-linejoin')).toBe('bevel');
        expect(rectangleElement.getAttribute('stroke-opacity')).toBe('0.75');
        expect(rectangleElement.getAttribute('stroke-width')).toBe('1');
        
    });

    it('IsometricGroup properties', (): void => {
        
        expect(group.right).toBe(1);
        expect(group.left).toBe(2);
        expect(group.top).toBe(0.5);

        expect(groupElement.tagName).toBe('g');
        expect(svgElement.contains(groupElement)).toBeTruthy();
        expect(groupElement.getAttribute('transform')).toBe('translate(-103.923, 120)');
        expect(groupElement.contains(rectangleElement)).toBeTruthy();
        expect(groupElement.contains(circleElement)).toBeTruthy();

        group.right = 2;
        group.left = 1;
        group.top = 1.5;

        expect(group.right).toBe(2);
        expect(group.left).toBe(1);
        expect(group.top).toBe(1.5);

        expect(groupElement.getAttribute('transform')).toBe('translate(103.923, 0)');

        expect(group.children).toMatchObject([rectangle, circle]);

        group.removeChild(circle);

        expect(group.children).toMatchObject([rectangle]);

        expect(groupElement.contains(circleElement)).toBeFalsy();
        expect(svgElement.contains(circleElement)).toBeFalsy();
        
    });

});