import { IsometricCanvas, IsometricPath } from '../src';

describe('Removing methods', (): void => {

    let container: HTMLDivElement;

    it('Removing elements and checking their statuses', (): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        const cube = new IsometricCanvas({
            container,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });
    
        const top = new IsometricPath();
        const right = new IsometricPath();
        const left = new IsometricPath();
    
        top.moveTo(0, 0, 1).lineTo(1, 0, 1).lineTo(1, 1, 1).lineTo(0, 1, 1);
        right.moveTo(1, 0, 1).lineTo(1, 0, 0).lineTo(1, 1, 0).lineTo(1, 1, 1);
        left.moveTo(1, 1, 1).lineTo(1, 1, 0).lineTo(0, 1, 0).lineTo(0, 1, 1);
        cube.addChildren(top, right, left);

        const svgElement = cube.getElement();
        const topElement = top.getElement();
        const rightElement = right.getElement();
        const leftElement = left.getElement();

        expect(topElement.parentNode).toBe(svgElement);
        expect(rightElement.parentNode).toBe(svgElement);
        expect(leftElement.parentNode).toBe(svgElement);

        cube.removeChild(top);

        expect(topElement.parentNode).toBeNull();
        
        cube.removeChildByIndex(0);

        expect(rightElement.parentNode).toBeNull();

        // Clear IsometricCanvas
        cube.clear();

        expect(leftElement.parentNode).toBeNull();

        cube.addChildren(top, right, left);

        cube.removeChildren(top, right, left);

        expect(topElement.parentNode).toBeNull();
        expect(rightElement.parentNode).toBeNull();
        expect(leftElement.parentNode).toBeNull();

        // Clear IsometricPath
        left.clear();
        expect(leftElement.getAttribute('d')).toBe('');

        // Removing wrong elements should not throw errors
        expect(() => {
            cube.removeChild(top);
        }).not.toThrowError();

        expect(() => {
            cube.addChild(top);
            topElement.parentNode.removeChild(topElement);
            cube.removeChild(top);
        }).not.toThrowError();

        expect(() => {
            cube.removeChildByIndex(10);
        }).not.toThrowError();

    });

});