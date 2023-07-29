import { IsometricCanvas, IsometricRectangle, PlaneView } from '../src';

describe('Buggy test', (): void => {

    let canvas: IsometricCanvas;
    let rectangle: IsometricRectangle;

    beforeEach(() => {
        const container = document.createElement('div');
        canvas = new IsometricCanvas({ container });
        rectangle = new IsometricRectangle({
            height: 1,
            width: 1,
            planeView: PlaneView.FRONT
        });
        // addChild adds the rectangle to an array later children property should return that array
        canvas.addChild(rectangle);
    });

    it('Test with toEqual', (): void => {
        expect(canvas.children).toEqual([rectangle]);
    });

    it('Test with toStrictEqual', (): void => {
        expect(canvas.children).toStrictEqual([rectangle]);
    });

    it('Test with toMatchObject', (): void => {
        expect(canvas.children).toMatchObject([rectangle]);
    });

});