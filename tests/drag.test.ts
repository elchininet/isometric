import { EVENTS } from '../src/@constants';
import {
    IsometricCanvas,
    IsometricGroup,
    IsometricRectangle,
    IsometricCircle,
    PlaneView
} from '../src';

const getMouseEvent = (event: string, clientX?: number, clientY?:number): MouseEvent => {
    return new MouseEvent(
        event,
        {
            bubbles: true,
            clientX: clientX || 0,
            clientY: clientY || 0
        }
    );
};


const getTouchEvent = (event: string, clientX?: number, clientY?:number): TouchEvent => {
    return new TouchEvent(
        event,
        {
            touches: [
                // @ts-ignore
                {
                    clientX: clientX || 0,
                    clientY: clientY || 0
                }
            ]
        }
    );
};

const dragElement = async (element: SVGElement, x: number, y: number): Promise<void> => {

    element.dispatchEvent(getMouseEvent(EVENTS.MOUSE_DOWN));
    document.dispatchEvent(getMouseEvent(EVENTS.MOUSE_MOVE, x, y));

    await new Promise(resolve => setTimeout(resolve, 20));

    document.dispatchEvent(getMouseEvent(EVENTS.MOUSE_UP));

    await new Promise(resolve => setTimeout(resolve, 20));

};

const dragElementWithTouchEvents = async (element: SVGElement, x: number, y: number): Promise<void> => {

    element.dispatchEvent(getTouchEvent(EVENTS.TOUCH_START));
    element.dispatchEvent(getTouchEvent(EVENTS.TOUCH_MOVE, x, y));

    await new Promise(resolve => setTimeout(resolve, 20));

    element.dispatchEvent(getTouchEvent(EVENTS.TOUCH_END));

    await new Promise(resolve => setTimeout(resolve, 20));

};

describe('Test dragging', (): void => {

    let spy: jest.SpyInstance<number, [callback: FrameRequestCallback]>;
    let container: HTMLDivElement;
    let canvas: IsometricCanvas;
    let group: IsometricGroup;
    let rectangle: IsometricRectangle;
    let circle: IsometricCircle;
    let groupElement: SVGElement;
    let rectangleElement: SVGElement;
    let circleElement: SVGElement;

    beforeEach((): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        canvas = new IsometricCanvas({
            container,
            backgroundColor: '#CCC',
            scale: 10,
            width: 500,
            height: 320
        });

        rectangle = new IsometricRectangle({
            height: 1,
            width: 1,
            right: 2,
            left: 1,
            top: 3,
            planeView: PlaneView.TOP
        });

        circle = new IsometricCircle({
            radius: 0.5,
            right: 1,
            left: 2,
            top: 0.5,
            planeView: PlaneView.TOP
        });

        group = new IsometricGroup();

        group.addChildren(rectangle, circle);

        canvas.addChildren(group);

        groupElement = group.getElement();
        rectangleElement = rectangle.getElement();
        circleElement = circle.getElement();

        spy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback): number => {
            window.setTimeout(() => {
                callback(0);
            }, 10);
            return 0;
        });

    });

    afterEach((): void => {
        if (container.parentNode && container.parentNode === document.body) {
            document.body.removeChild(container);
        }
        spy.mockRestore();
    });

    it('Initial coordinates and initial paths', (): void => {

        expect(rectangle.right).toBe(2);
        expect(rectangle.left).toBe(1);
        expect(rectangle.top).toBe(3);
        expect(rectangleElement.getAttribute('d')).toBe('M258.66025 145 L267.3205 150 L258.66025 155 L250 150z');

        expect(circle.right).toBe(1);
        expect(circle.left).toBe(2);
        expect(circle.top).toBe(0.5);
        expect(circleElement.getAttribute('d')).toBe('M237.009625 172.5 A 6.123722 3.535534 0 0 0 245.669875 167.5 A 6.123722 3.535534 -180 0 0 237.009625 172.5z');

        expect(group.right).toBe(0);
        expect(group.left).toBe(0);
        expect(group.top).toBe(0);
        expect(groupElement.getAttribute('transform')).toBe('translate(0, 0)');
    });

    it('Change coordinates and paths', (): void => {

        rectangle.right = 1;
        rectangle.left = 2;
        rectangle.top = 0.5;

        circle.right = 2;
        circle.left = 1;
        circle.top = 3;

        expect(rectangle.right).toBe(1);
        expect(rectangle.left).toBe(2);
        expect(rectangle.top).toBe(0.5);
        expect(rectangleElement.getAttribute('d')).toBe('M241.33975 170 L250 175 L241.33975 180 L232.6795 175z');

        expect(circle.right).toBe(2);
        expect(circle.left).toBe(1);
        expect(circle.top).toBe(3);
        expect(circleElement.getAttribute('d')).toBe('M254.330125 147.5 A 6.123722 3.535534 0 0 0 262.990375 142.5 A 6.123722 3.535534 180 0 0 254.330125 147.5z');

        group.right = 2;
        group.left = 1;
        group.top = 1.5;

        expect(group.right).toBe(2);
        expect(group.left).toBe(1);
        expect(group.top).toBe(1.5);

        expect(groupElement.getAttribute('transform')).toBe('translate(8.66025, 0)');

    });

    it('Drag group', async (): Promise<void> => {

        expect(group.drag).toBeFalsy();

        // Drag top
        group.drag = PlaneView.TOP;
        expect(group.drag).toBe(PlaneView.TOP);

        await dragElement(groupElement, 200, 300);

        expect(group.right).toBe(41.547011);
        expect(group.left).toBe(18.452989);
        expect(group.top).toBe(0);
        expect(groupElement.getAttribute('transform')).toBe('translate(200.000004, 300)');

        group.right = 0;
        group.left = 0;

        // Drag front
        group.drag = PlaneView.FRONT;
        expect(group.drag).toBe(PlaneView.FRONT);

        await dragElement(rectangleElement, 300, 400);

        expect(group.right).toBe(0);
        expect(group.left).toBe(-34.641032);
        expect(group.top).toBe(-57.320516);
        expect(groupElement.getAttribute('transform')).toBe('translate(299.999997, 400)');

        group.left = 0;
        group.top = 0;

        // Drag side
        group.drag = PlaneView.SIDE;
        expect(group.drag).toBe(PlaneView.SIDE);

        await dragElement(circleElement, 800, 500);

        expect(group.right).toBe(92.376086);
        expect(group.left).toBe(0);
        expect(group.top).toBe(-3.811957);
        expect(groupElement.getAttribute('transform')).toBe('translate(799.999999, 500)');

    });

    it('Drag group with limits', async (): Promise<void> => {

        expect(group.bounds).toBeFalsy();

        const bounds: Record<string, [number, number]> = {
            right: [-10, 10],
            left: [-20, 20],
            top: [-30, 30]
        };

        group.bounds = { right: bounds.right, left: bounds.left };

        expect(group.bounds).toMatchObject({
            right: bounds.right,
            left: bounds.left
        });

        // Drag top
        group.drag = PlaneView.TOP;
        expect(group.drag).toBe(PlaneView.TOP);

        await dragElement(groupElement, 200, 300);

        expect(group.right).toBe(10);
        expect(group.left).toBe(18.452989);
        expect(group.top).toBe(0);
        expect(groupElement.getAttribute('transform')).toBe('translate(-73.204998, 142.264945)');

        group.right = 0;
        group.left = 0;

        group.bounds = { left: bounds.left, top: bounds.top };

        expect(group.bounds).toMatchObject({
            left: bounds.left,
            top: bounds.top
        });

        // Drag front
        group.drag = PlaneView.FRONT;
        expect(group.drag).toBe(PlaneView.FRONT);

        await dragElement(rectangleElement, 300, 400);

        expect(group.right).toBe(0);
        expect(group.left).toBe(-20);
        expect(group.top).toBe(-30);
        expect(groupElement.getAttribute('transform')).toBe('translate(173.205, 200)');

        group.left = 0;
        group.top = 0;

        group.bounds = { right: bounds.right, top: bounds.top };

        expect(group.bounds).toMatchObject({
            right: bounds.right,
            top: bounds.top
        });

        // Drag side
        group.drag = PlaneView.SIDE;
        expect(group.drag).toBe(PlaneView.SIDE);

        await dragElement(circleElement, 800, 500);

        expect(group.right).toBe(10);
        expect(group.left).toBe(0);
        expect(group.top).toBe(-3.811957);
        expect(groupElement.getAttribute('transform')).toBe('translate(86.6025, 88.11957)');

    });

    it('Drag with touchevents', async (): Promise<void> => {

        expect(group.drag).toBeFalsy();

        // Drag top
        group.drag = PlaneView.TOP;

        await dragElementWithTouchEvents(groupElement, 200, 300);

        expect(group.right).toBe(41.547011);
        expect(group.left).toBe(18.452989);
        expect(group.top).toBe(0);
        expect(groupElement.getAttribute('transform')).toBe('translate(200.000004, 300)');

        group.right = 0;
        group.left = 0;

        // Drag front
        group.drag = PlaneView.FRONT;
        expect(group.drag).toBe(PlaneView.FRONT);

        await dragElementWithTouchEvents(groupElement, 300, 400);

        expect(group.right).toBe(0);
        expect(group.left).toBe(-34.641032);
        expect(group.top).toBe(-57.320516);
        expect(groupElement.getAttribute('transform')).toBe('translate(299.999997, 400)');

        group.left = 0;
        group.top = 0;

        // Drag side
        group.drag = PlaneView.SIDE;
        expect(group.drag).toBe(PlaneView.SIDE);

        await dragElementWithTouchEvents(groupElement, 800, 500);

        expect(group.right).toBe(92.376086);
        expect(group.left).toBe(0);
        expect(group.top).toBe(-3.811957);
        expect(groupElement.getAttribute('transform')).toBe('translate(799.999999, 500)');

    });

    it('Capturing drag events', async (): Promise<void> => {

        const mockDragstart = jest.fn();
        const mockDrag = jest.fn();
        const mockEnd = jest.fn();

        group.drag = PlaneView.TOP;

        group.addEventListener('dragstart', mockDragstart);
        group.addEventListener('drag', mockDrag);
        group.addEventListener('dragend', mockEnd);

        await dragElement(groupElement, 200, 300);

        expect(mockDragstart).toBeCalledTimes(1);
        expect(mockDragstart.mock.calls[0][0].detail.right).toBe(41.547011);
        expect(mockDragstart.mock.calls[0][0].detail.left).toBe(18.452989);
        expect(mockDragstart.mock.calls[0][0].detail.top).toBe(0);

        expect(mockDrag).toBeCalledTimes(1);
        expect(mockDrag.mock.calls[0][0].detail.right).toBe(41.547011);
        expect(mockDrag.mock.calls[0][0].detail.left).toBe(18.452989);
        expect(mockDrag.mock.calls[0][0].detail.top).toBe(0);

        expect(mockEnd).toBeCalledTimes(1);
        expect(mockEnd.mock.calls[0][0].detail.right).toBe(41.547011);
        expect(mockEnd.mock.calls[0][0].detail.left).toBe(18.452989);
        expect(mockEnd.mock.calls[0][0].detail.top).toBe(0);

        group.removeEventListener('dragstart', mockDragstart);
        group.removeEventListener('drag', mockDrag);
        group.removeEventListener('dragend', mockEnd);

        await dragElement(groupElement, 300, 200);

        expect(mockDragstart).toBeCalledTimes(1);
        expect(mockDrag).toBeCalledTimes(1);
        expect(mockEnd).toBeCalledTimes(1);

    });

    it('Preventing dragging', async (): Promise<void> => {

        const mockDragstart = jest.fn();
        const mockDrag = jest.fn((event: CustomEvent) => {
            event.preventDefault();
        });
        const mockEnd = jest.fn();

        group.drag = PlaneView.TOP;

        group.addEventListener('dragstart', mockDragstart);
        group.addEventListener('drag', mockDrag);
        group.addEventListener('dragend', mockEnd);

        await dragElement(groupElement, 200, 300);

        expect(mockDragstart).toBeCalledTimes(1);
        expect(mockDragstart.mock.calls[0][0].detail.right).toBe(41.547011);
        expect(mockDragstart.mock.calls[0][0].detail.left).toBe(18.452989);
        expect(mockDragstart.mock.calls[0][0].detail.top).toBe(0);

        expect(mockDrag).toBeCalledTimes(1);
        expect(mockDrag.mock.calls[0][0].detail.right).toBe(41.547011);
        expect(mockDrag.mock.calls[0][0].detail.left).toBe(18.452989);
        expect(mockDrag.mock.calls[0][0].detail.top).toBe(0);

        expect(mockEnd).toBeCalledTimes(1);
        expect(mockEnd.mock.calls[0][0].detail.right).toBe(41.547011);
        expect(mockEnd.mock.calls[0][0].detail.left).toBe(18.452989);
        expect(mockEnd.mock.calls[0][0].detail.top).toBe(0);

        expect(group.right).toBe(0);
        expect(group.left).toBe(0);
        expect(group.top).toBe(0);

    });

});