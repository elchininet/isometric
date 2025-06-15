import { IsometricCanvas, IsometricPath } from '../src';

describe('Test event listeners', (): void => {

    let container: HTMLDivElement;
    let cube: IsometricCanvas;
    let top: IsometricPath;
    let svgElement: SVGElement;
    let topElement: SVGElement;

    beforeEach((): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        cube = new IsometricCanvas({
            container,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        top = new IsometricPath();

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

    it('IsometricCanvas event listeners', (): void => {

        const mockCallBack = jest.fn();

        cube.addEventListener('click', mockCallBack, true);

        const event = document.createEvent('SVGEvents');
        event.initEvent('click', true, true);

        svgElement.dispatchEvent(event);

        expect(mockCallBack.mock.calls[0][0].target).toBe(svgElement);

        cube.removeEventListener('click', mockCallBack, true);

        svgElement.dispatchEvent(event);

        expect(mockCallBack.mock.calls[1]).toBeUndefined();

        cube.addEventListener('click', mockCallBack);
        cube.removeEventListener('click', mockCallBack);

        svgElement.dispatchEvent(event);

        expect(mockCallBack.mock.calls[1]).toBeUndefined();

    });

    it('IsometricPath event listeners', (): void => {

        const mockCallBack = jest.fn();

        top.addEventListener('click', mockCallBack, true);

        const event = document.createEvent('SVGEvents');
        event.initEvent('click', true, true);

        topElement.dispatchEvent(event);

        expect(mockCallBack.mock.calls[0][0].target).toBe(topElement);

        top.removeEventListener('click', mockCallBack, true);

        topElement.dispatchEvent(event);

        expect(mockCallBack.mock.calls[1]).toBeUndefined();

        top.addEventListener('click', mockCallBack);
        top.removeEventListener('click', mockCallBack);

        topElement.dispatchEvent(event);

        expect(mockCallBack.mock.calls[1]).toBeUndefined();

    });

    it('Remove event listeners that have not been added', (): void => {

        const mockCallBack = jest.fn();
        const mockCallBackNotAdded = jest.fn();

        cube.addEventListener('click', mockCallBack);
        top.addEventListener('click', mockCallBack);

        // Remove an event listsner that doesn't exist should not throw an error
        expect(() => {
            cube.removeEventListener('click', mockCallBackNotAdded);
        }).not.toThrow();

        // Remove an event listsner that doesn't exist should not throw an error
        expect(() => {
            top.removeEventListener('click', mockCallBackNotAdded);
        }).not.toThrow();

    });

});