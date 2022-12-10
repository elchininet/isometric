import { IsometricCanvas, IsometricPath, IsometricRectangle, IsometricCircle } from '../src';

describe('Wrong drawing commands', (): void => {

    let container: HTMLDivElement;

    it('Using no valid drawing commands', (): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        const cube = new IsometricCanvas({container});

        const top = new IsometricPath();

        cube.addChild(top);
        const topElement = top.getElement();

        top.draw('B1 0 0 X1 1 0 Y1 1 0.25 B1 0.5 0.25 U1 0.5 1 P1 0 1');

        expect(topElement.getAttribute('d')).toBe('');

    });

    it('Start a line without a moving point', (): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        const cube = new IsometricCanvas({container});

        const top = new IsometricPath();

        cube.addChild(top);

        top.draw('L 1 1 1');

        const topElement = top.getElement();

        expect(topElement.getAttribute('d')).toBe('M320 240 L320 240z');

    });

    it('Start a curve without a moving point', (): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        const cube = new IsometricCanvas({container});

        const top = new IsometricPath();

        cube.addChild(top);

        top.draw('C 1 1 1 2 2 2');

        const topElement = top.getElement();

        expect(topElement.getAttribute('d')).toBe('M320 240 A 0 0 0 0 0 320 240z');

    });

    it('Wrong animation with IsometricPath', (): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        const cube = new IsometricCanvas({container});

        const top = new IsometricPath();

        cube.addChild(top);

        top.draw('C 1 1 1 2 2 2');

        const addAnimation = () => {
            top.addAnimation({
                // @ts-ignore
                property: 'color',
                duration: 1,
                values: [
                    '#FFF',
                    'F0F',
                    '#FFF'
                ]
            });
        };

        expect(addAnimation).toThrowError();

    });

    it('Wrong animation with IsometricRectanle', (): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        const cube = new IsometricCanvas({container});

        const top = new IsometricRectangle({ planeView: 'TOP', height: 10, width: 10 });

        cube.addChild(top);

        const addRightAnimation = () => {
            top.addAnimation({
                property: 'fillColor',
                duration: 1,
                values: '#FF0000'
            });
        };

        const addWrongAnimation = () => {
            top.addAnimation({
                // @ts-ignore
                property: 'text',
                duration: 1,
                values: [
                    'abc',
                    'def',
                    'ghi'
                ]
            });
        };

        expect(addRightAnimation).not.toThrowError();
        expect(addWrongAnimation).toThrowError();

    });

    it('Wrong animation with IsometricCircle', (): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        const cube = new IsometricCanvas({container});

        const top = new IsometricCircle({ planeView: 'TOP', radius: 10 });

        cube.addChild(top);

        const addRightAnimation = () => {
            top.addAnimation({
                property: 'fillColor',
                duration: 1,
                from: '#FF0000',
                to: '#FFFFFF'
            });
        };

        const addWrongAnimation = () => {
            top.addAnimation({
                // @ts-ignore
                property: 'diameter',
                duration: 1,
                values: [
                    '100',
                    '50',
                    '100'
                ]
            });
        };

        expect(addRightAnimation).not.toThrowError();
        expect(addWrongAnimation).toThrowError();

    });

});