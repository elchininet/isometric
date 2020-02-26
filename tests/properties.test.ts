import { IsometricCanvas, IsometricPath } from '../src';

describe('Test properties', (): void => {

    let container: HTMLDivElement;
    let cube: IsometricCanvas;
    let top: IsometricPath;
    let svgElement: SVGElement;
    let topElement: SVGElement;

    beforeEach((): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        cube = new IsometricCanvas(container, {
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        top = new IsometricPath({
            fillColor: '#FFF',
            fillOpacity: 0.5,
            strokeColor: '#000',
            strokeDashArray: [1, 2, 3],
            strokeLinecap: 'round',
            strokeLinejoin: 'miter',
            strokeOpacity: 0.25,
            strokeWidth: 2
        });

        top.moveTo(0, 0, 1).lineTo(1, 0, 1).lineTo(1, 1, 1).lineTo(0, 1, 1);
        cube.addChild(top);

        svgElement = cube.getElement();
        topElement = top.getElement();

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

    });

    it('IsometricPath properties', (): void => {
        
        expect(top.fillColor).toBe('#FFF');
        expect(top.fillOpacity).toBe(0.5);
        expect(top.strokeColor).toBe('#000');
        expect(top.strokeDashArray).toMatchObject([1, 2, 3]);
        expect(top.strokeLinecap).toBe('round');
        expect(top.strokeLinejoin).toBe('miter');
        expect(top.strokeOpacity).toBe(0.25);
        expect(top.strokeWidth).toBe(2);
        
        expect(topElement.getAttribute('fill')).toBe('#FFF');
        expect(topElement.getAttribute('fill-opacity')).toBe('0.5');
        expect(topElement.getAttribute('stroke')).toBe('#000');
        expect(topElement.getAttribute('stroke-dasharray')).toBe('1 2 3');
        expect(topElement.getAttribute('stroke-linecap')).toBe('round');
        expect(topElement.getAttribute('stroke-linejoin')).toBe('miter');
        expect(topElement.getAttribute('stroke-opacity')).toBe('0.25');
        expect(topElement.getAttribute('stroke-width')).toBe('2');

        top.fillColor = '#000';
        top.fillOpacity = 1;
        top.strokeColor = '#FFF';
        top.strokeDashArray = [3, 2, 1];
        top.strokeLinecap = 'butt';
        top.strokeLinejoin = 'bevel';
        top.strokeOpacity = 0.75;
        top.strokeWidth = 1;

        expect(top.fillColor).toBe('#000');
        expect(top.fillOpacity).toBe(1);
        expect(top.strokeColor).toBe('#FFF');
        expect(top.strokeDashArray).toMatchObject([3, 2, 1]);
        expect(top.strokeLinecap).toBe('butt');
        expect(top.strokeLinejoin).toBe('bevel');
        expect(top.strokeOpacity).toBe(0.75);
        expect(top.strokeWidth).toBe(1);
        
        expect(topElement.getAttribute('fill')).toBe('#000');
        expect(topElement.getAttribute('fill-opacity')).toBe('1');
        expect(topElement.getAttribute('stroke')).toBe('#FFF');
        expect(topElement.getAttribute('stroke-dasharray')).toBe('3 2 1');
        expect(topElement.getAttribute('stroke-linecap')).toBe('butt');
        expect(topElement.getAttribute('stroke-linejoin')).toBe('bevel');
        expect(topElement.getAttribute('stroke-opacity')).toBe('0.75');
        expect(topElement.getAttribute('stroke-width')).toBe('1');
        
    });

});