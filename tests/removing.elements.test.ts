import { IsometricCanvas, IsometricGroup, IsometricPath } from '../src';

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
        const group = new IsometricGroup();

        top.moveTo(0, 0, 1).lineTo(1, 0, 1).lineTo(1, 1, 1).lineTo(0, 1, 1);
        right.moveTo(1, 0, 1).lineTo(1, 0, 0).lineTo(1, 1, 0).lineTo(1, 1, 1);
        left.moveTo(1, 1, 1).lineTo(1, 1, 0).lineTo(0, 1, 0).lineTo(0, 1, 1);
        group.addChildren(top, right, left);
        cube.addChildren(group);

        const svgElement = cube.getElement();
        const topElement = top.getElement();
        const rightElement = right.getElement();
        const leftElement = left.getElement();
        const groupElement = group.getElement();

        expect(topElement.parentNode).toBe(groupElement);
        expect(rightElement.parentNode).toBe(groupElement);
        expect(leftElement.parentNode).toBe(groupElement);
        expect(groupElement.parentNode).toBe(svgElement);

        group.removeChild(top);

        expect(topElement.parentNode).toBeNull();

        group.removeChildByIndex(0);

        expect(rightElement.parentNode).toBeNull();

        // Clear IsometricCanvas
        group.clear();

        expect(leftElement.parentNode).toBeNull();
        expect(groupElement.parentNode).toBe(svgElement);

        cube.clear();

        expect(groupElement.parentNode).toBeNull();

        cube.addChildren(top, right, left);

        expect(topElement.parentNode).toBe(svgElement);
        expect(rightElement.parentNode).toBe(svgElement);
        expect(leftElement.parentNode).toBe(svgElement);

        cube.removeChildren(top, right, left);

        expect(topElement.parentNode).toBeNull();
        expect(rightElement.parentNode).toBeNull();
        expect(leftElement.parentNode).toBeNull();

        // Clear IsometricPath
        left.clear();
        expect(leftElement.getAttribute('d')).toBe('');

        // Removing wrong elements should throw an error
        expect(() => {
            cube.removeChild(top);
        }).toThrow();

        // Removing elements that belongs to the children but are already removed from DOM should not throw an error
        expect(() => {
            cube.addChild(top);
            topElement.parentNode.removeChild(topElement);
            cube.removeChild(top);
        }).not.toThrow();

        // Removing by a wrong index should not throw an error
        expect(() => {
            cube.removeChildByIndex(10);
        }).not.toThrow();

        cube.addChild(top);

        // Removing an array of children with a wrong child should throw an error
        expect(() => {
            cube.removeChildren(group, left);
        }).toThrow();

    });

});