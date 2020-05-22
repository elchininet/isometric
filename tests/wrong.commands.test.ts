import { IsometricCanvas, IsometricPath } from '../src';

describe('Wrong drawing commands', (): void => {

    let container: HTMLDivElement;

    it('Using no valid drawing commands', (): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        const cube = new IsometricCanvas(container);

        const top = new IsometricPath();

        cube.addChild(top);
        const topElement = top.getElement();

        top.draw('B1 0 0 X1 1 0 Y1 1 0.25 B1 0.5 0.25 U1 0.5 1 P1 0 1');
        
        expect(topElement.getAttribute('d')).toBe('');

    });

});