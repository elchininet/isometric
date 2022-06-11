import {
    IsometricCanvas,
    IsometricGroup,
    IsometricRectangle,
    IsometricCircle,
    IsometricPath,
    IsometricElementProps,
    PlaneView
} from '../src';

const childIndex = (child: SVGElement): number => {
    return Array.from(child.parentNode.children).indexOf(child);
};

describe('Test changing container‘s child index', (): void => {

    let container: HTMLDivElement;
    let canvas: IsometricCanvas;
    let group: IsometricGroup;
    let top: IsometricRectangle;
    let right: IsometricRectangle;
    let left: IsometricRectangle;
    let circle: IsometricCircle;
    let path: IsometricPath;
    let groupElement: SVGElement;
    let topElement: SVGElement;
    let rightElement: SVGElement;
    let leftElement: SVGElement;
    let circleElement: SVGElement;
    let pathElement: SVGElement;

    beforeEach((): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        const commonProps: IsometricElementProps = {
            fillColor: '#FFF',
            fillOpacity: 0.5,
            strokeColor: '#000',
            strokeDashArray: [1, 2, 3],
            strokeLinecap: 'round',
            strokeLinejoin: 'miter',
            strokeOpacity: 0.25,
            strokeWidth: 2
        };

        const commonRectangleProps = {
            ...commonProps,
            height: 1,
            width: 1
        };

        canvas = new IsometricCanvas({
            container,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        group = new IsometricGroup();
        top = new IsometricRectangle({ ...commonRectangleProps, planeView: PlaneView.TOP });
        right = new IsometricRectangle({ ...commonRectangleProps, planeView: PlaneView.FRONT });
        left = new IsometricRectangle({ ...commonRectangleProps, planeView: PlaneView.SIDE });
        circle = new IsometricCircle({ ...commonProps, planeView: PlaneView.TOP, radius: 10 });
        path = new IsometricPath({ ...commonProps });

        path.moveTo(0, 0, 0).lineTo(1, 0, 0).lineTo(1, 1, 0).lineTo(0, 1, 0);

        group.addChildren(top, right, left);

        canvas.addChildren(group, circle, path);
        
        groupElement = group.getElement();
        topElement = top.getElement();
        rightElement = right.getElement();
        leftElement = left.getElement();
        circleElement = circle.getElement();
        pathElement = path.getElement();

    });

    afterEach((): void => {
        if (container.parentNode && container.parentNode === document.body) {
            document.body.removeChild(container);
        }        
    });

    it('Check initial children order', (): void => {

        expect(canvas.children).toMatchObject([group, circle, path]);
        expect(group.children).toMatchObject([top, right, left]);

        expect(childIndex(groupElement)).toBe(1);
        expect(childIndex(circleElement)).toBe(2);
        expect(childIndex(pathElement)).toBe(3);

        expect(childIndex(topElement)).toBe(0);
        expect(childIndex(rightElement)).toBe(1);
        expect(childIndex(leftElement)).toBe(2);

    });

    it('setChildIndex', (): void => {

        canvas.setChildIndex(group, 2);

        expect(canvas.children).toMatchObject([circle, path, group]);

        expect(childIndex(circleElement)).toBe(1);
        expect(childIndex(pathElement)).toBe(2);
        expect(childIndex(groupElement)).toBe(3);

        canvas.setChildIndex(path, 0);
        
        expect(canvas.children).toMatchObject([path, circle, group]);

        expect(childIndex(pathElement)).toBe(1);
        expect(childIndex(circleElement)).toBe(2);
        expect(childIndex(groupElement)).toBe(3);

        group.setChildIndex(top, 1);

        expect(group.children).toMatchObject([right, top, left]);

        expect(childIndex(rightElement)).toBe(0);
        expect(childIndex(topElement)).toBe(1);
        expect(childIndex(leftElement)).toBe(2);

        group.setChildIndex(top, 10);

        expect(group.children).toMatchObject([right, left, top]);

        expect(childIndex(rightElement)).toBe(0);
        expect(childIndex(leftElement)).toBe(1);
        expect(childIndex(topElement)).toBe(2);

        group.setChildIndex(left, -10);

        expect(group.children).toMatchObject([left, right, top]);

        expect(childIndex(leftElement)).toBe(0);
        expect(childIndex(rightElement)).toBe(1);
        expect(childIndex(topElement)).toBe(2);

    });

    it('bringChildToFront', (): void => {

        canvas.bringChildToFront(group);

        expect(canvas.children).toMatchObject([circle, path, group]);

        expect(childIndex(circleElement)).toBe(1);
        expect(childIndex(pathElement)).toBe(2);
        expect(childIndex(groupElement)).toBe(3);

        group.bringChildToFront(right);

        expect(group.children).toMatchObject([top, left, right]);

        expect(childIndex(topElement)).toBe(0);
        expect(childIndex(leftElement)).toBe(1);
        expect(childIndex(rightElement)).toBe(2);        

    });

    it('sendChildToBack', (): void => {

        canvas.sendChildToBack(path);

        expect(canvas.children).toMatchObject([path, group, circle]);

        expect(childIndex(pathElement)).toBe(1);
        expect(childIndex(groupElement)).toBe(2);
        expect(childIndex(circleElement)).toBe(3);

        group.sendChildToBack(right);

        expect(group.children).toMatchObject([right, top, left]);

        expect(childIndex(rightElement)).toBe(0);
        expect(childIndex(topElement)).toBe(1);
        expect(childIndex(leftElement)).toBe(2);

    });

    it('bringChildForward', (): void => {

        canvas.bringChildForward(circle);

        expect(canvas.children).toMatchObject([group, path, circle]);

        expect(childIndex(groupElement)).toBe(1);
        expect(childIndex(pathElement)).toBe(2);
        expect(childIndex(circleElement)).toBe(3);

        group.bringChildForward(top);

        expect(group.children).toMatchObject([right, top, left]);

        expect(childIndex(rightElement)).toBe(0);
        expect(childIndex(topElement)).toBe(1);
        expect(childIndex(leftElement)).toBe(2);

    });

    it('sendChildBackward', (): void => {

        canvas.sendChildBackward(path);

        expect(canvas.children).toMatchObject([group, path, circle]);

        expect(childIndex(groupElement)).toBe(1);
        expect(childIndex(pathElement)).toBe(2);
        expect(childIndex(circleElement)).toBe(3);

        group.sendChildBackward(right);

        expect(group.children).toMatchObject([right, top, left]);

        expect(childIndex(rightElement)).toBe(0);
        expect(childIndex(topElement)).toBe(1);
        expect(childIndex(leftElement)).toBe(2);

    });

    it('Errors', (): void => {

        expect(() => {
            canvas.setChildIndex(right, 2);
        }).toThrowError();

        expect(() => {
            group.setChildIndex(path, 1);
        }).toThrowError();

        expect(() => {
            canvas.bringChildToFront(top);
        }).toThrowError();

        expect(() => {
            group.bringChildToFront(circle);
        }).toThrowError();

        expect(() => {
            canvas.bringChildForward(left);
        }).toThrowError();

        expect(() => {
            group.bringChildForward(group);
        }).toThrowError();

        expect(() => {
            canvas.sendChildToBack(top);
        }).toThrowError();

        expect(() => {
            group.sendChildToBack(path);
        }).toThrowError();

        expect(() => {
            canvas.sendChildBackward(right);
        }).toThrowError();

        expect(() => {
            group.sendChildBackward(circle);
        }).toThrowError();

    });

});