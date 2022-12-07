import { Position } from '@types';
import {
    EVENTS,
    DECIMALS,
    PlaneView,
    Typeof
} from '@constants';
import {
    getTopPlanePointFromCoordinates,
    getFrontPlanePointFromCoordinates,
    getSidePlanePointFromCoordinates,
    round
} from '@utils/math';
import { IsometricElementAbstract } from '@classes/abstract/IsometricElementAbstract';
import {
    NO_LIMITS,
    DRAG_EVENT
} from './constants';
import {
    IsometricDraggableProps,
    Drag,
    Boundaries,
    ClientCoords
} from './types';

const _isBrowser = typeof window !== Typeof.UNDEFINED;

/* istanbul ignore next */
const _requestAnimationFrame = _isBrowser
    ? (
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame
    )
    : null;

const _dragStoreDefault = {
    right: 0,
    left: 0,
    top: 0,
    x: 0,
    y: 0
};

const isMouseEvent = (event: MouseEvent | TouchEvent): event is MouseEvent => 'clientX' in event;
const getClientCoords = (event: MouseEvent | TouchEvent | ClientCoords): ClientCoords => {
    if (event instanceof Event) {
        if (isMouseEvent(event)) {
            return {
                clientX: event.clientX,
                clientY: event.clientY
            };
        }
        return {
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY
        };
    }
    return event;
};

export abstract class IsometricDraggableAbstract extends IsometricElementAbstract {

    protected props: IsometricDraggableProps;

    private _drag: Drag;
    private _bounds: Boundaries;
    private _dragStore: typeof _dragStoreDefault;
    private _coords: Partial<Position>;
    private _update: boolean;
    private _dragging: boolean;
    private _prevented: boolean;

    private setup() {

        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.moveElement = this.moveElement.bind(this);
        this.dropElement = this.dropElement.bind(this);
        this.animate = this.animate.bind(this);

        if (typeof this._bounds === Typeof.UNDEFINED) {
            this._bounds = false;
        }
        if (typeof this._dragStore === Typeof.UNDEFINED) {
            this._dragStore = _dragStoreDefault;
        }
        if (typeof this._coords === Typeof.UNDEFINED) {
            this._coords = {};
        }
    }

    private betweenBounds(value: number, bounds: readonly [number, number]): number {
        const orderedBounds = [...bounds].sort();
        return round(
            Math.min(
                Math.max(value, orderedBounds[0]),
                orderedBounds[1]
            ),
            DECIMALS
        );
    }

    private getRight(value: number): number {
        const bounds = this._bounds && this._bounds.right || NO_LIMITS;
        return this.betweenBounds(
            this._dragStore.right + value / this.data.scale,
            bounds
        );
    }

    private getLeft(value: number): number {
        const bounds = this._bounds && this._bounds.left || NO_LIMITS;
        return this.betweenBounds(
            this._dragStore.left + value / this.data.scale,
            bounds,
        );
    }

    private getTop(value: number): number {
        const bounds = this._bounds && this._bounds.top || NO_LIMITS;
        return this.betweenBounds(
            this._dragStore.top + value / this.data.scale,
            bounds
        );
    }

    private getFixedCoordinates(coords: Partial<Position>): Partial<Position> {
        return Object.entries(coords).reduce((acc: Partial<Position>, entry: [string, number]): Partial<Position> => {
            const fixedCoords = { ...acc };
            switch(entry[0]) {
                case 'right':
                    fixedCoords.right = this.getRight(entry[1]);
                    break;
                case 'left':
                    fixedCoords.left = this.getLeft(entry[1]);
                    break;
                default:
                    fixedCoords.top = this.getTop(entry[1]);
            }
            return fixedCoords;
        }, {});
    }

    private dispatchEvent(eventType: DRAG_EVENT): CustomEvent {
        const dragEvent = new CustomEvent(
            eventType,
            {
                cancelable: eventType === DRAG_EVENT.DRAG,
                detail: {
                    right: this._coords.right || this.right,
                    left: this._coords.left || this.left,
                    top: this._coords.top || this.top
                }
            }
        );
        this.element.dispatchEvent(dragEvent);
        return dragEvent;
    }

    private animate() {
        if (this._update) {
            if (!this._prevented) {
                if (typeof this._coords.right === Typeof.NUMBER) {
                    this.right = this._coords.right;
                }
                if (typeof this._coords.left === Typeof.NUMBER) {
                    this.left = this._coords.left;
                }
                if (typeof this._coords.top === Typeof.NUMBER) {
                    this.top = this._coords.top;
                }
            }
            _requestAnimationFrame(this.animate);
        }
    }

    private startDrag(event: MouseEvent | TouchEvent) {

        event.preventDefault();

        const { clientX, clientY } = getClientCoords(event);
        this._dragStore.x = clientX;
        this._dragStore.y = clientY;
        this._dragStore.right = this.right;
        this._dragStore.left = this.left;
        this._dragStore.top = this.top;
        this._update = true;

        this.moveElement({clientX, clientY});

        this.element.addEventListener(EVENTS.TOUCH_MOVE, this.moveElement, true);
        this.element.addEventListener(EVENTS.TOUCH_END, this.dropElement, true);
        document.addEventListener(EVENTS.MOUSE_MOVE, this.moveElement, true);
        document.addEventListener(EVENTS.MOUSE_UP, this.dropElement, true);
        _requestAnimationFrame(this.animate);
    }

    private moveElement(event: MouseEvent | TouchEvent | ClientCoords) {

        const { clientX, clientY } = getClientCoords(event);
        const diffX = clientX - this._dragStore.x;
        const diffY = clientY - this._dragStore.y;

        if (this._drag === PlaneView.TOP) {
            this._coords = this.getFixedCoordinates(
                getTopPlanePointFromCoordinates(diffX, diffY)
            );
        } else if (this._drag === PlaneView.FRONT) {
            this._coords = this.getFixedCoordinates(
                getFrontPlanePointFromCoordinates(diffX, diffY)
            );
        } else {
            this._coords = this.getFixedCoordinates(
                getSidePlanePointFromCoordinates(diffX, diffY)
            );
        }

        let dragEvent: CustomEvent;

        if (event instanceof Event) {

            event.preventDefault();

            if (!this._dragging) {
                this.dispatchEvent(DRAG_EVENT.DRAG_START);
            }

            this._dragging = true;

            dragEvent = this.dispatchEvent(DRAG_EVENT.DRAG);

        }

        this._prevented = !!(dragEvent && dragEvent.defaultPrevented);

    }

    private dropElement() {
        this._update = false;
        this._dragging = false;

        this.element.removeEventListener(EVENTS.TOUCH_MOVE, this.moveElement, true);
        this.element.removeEventListener(EVENTS.TOUCH_END, this.dropElement, true);
        document.removeEventListener(EVENTS.MOUSE_MOVE, this.moveElement, true);
        document.removeEventListener(EVENTS.MOUSE_UP, this.dropElement, true);

        this.dispatchEvent(DRAG_EVENT.DRAG_END);

    }

    private beginDrag() {
        this.element.addEventListener(EVENTS.TOUCH_START, this.startDrag, true);
        this.element.addEventListener(EVENTS.MOUSE_DOWN, this.startDrag, true);
    }

    private stopDrag() {
        this.element.removeEventListener(EVENTS.TOUCH_START, this.startDrag, true);
        this.element.removeEventListener(EVENTS.TOUCH_MOVE, this.moveElement, true);
        this.element.removeEventListener(EVENTS.TOUCH_END, this.dropElement, true);
        this.element.removeEventListener(EVENTS.MOUSE_DOWN, this.startDrag, true);
        document.removeEventListener(EVENTS.MOUSE_MOVE, this.moveElement, true);
        document.removeEventListener(EVENTS.MOUSE_UP, this.dropElement, true);
    }

    public get right(): number {
        return this.props.right;
    }

    public set right(value: number) {
        if (this.props.right !== value) {
            this.props.right = value;
            this.update();
        }
    }

    public get left(): number {
        return this.props.left;
    }

    public set left(value: number) {
        if (this.props.left !== value) {
            this.props.left = value;
            this.update();
        }
    }

    public get top(): number {
        return this.props.top;
    }

    public set top(value: number) {
        if (this.props.top !== value) {
            this.props.top = value;
            this.update();
        }
    }

    public get drag(): Drag {
        return this._drag || false;
    }

    public set drag(value: Drag) {
        if (typeof this._drag === Typeof.UNDEFINED) {
            this.setup();
        }
        this._drag = value;
        if (_isBrowser) {
            this.stopDrag();
            this.beginDrag();
        }
    }

    public get bounds(): Boundaries {
        return this._bounds || false;
    }

    public set bounds(value: Boundaries) {
        this._bounds = value;
        const boundsRight = this._bounds && this._bounds.right || NO_LIMITS;
        const boundsLeft = this._bounds && this._bounds.left || NO_LIMITS;
        const boundsTop = this._bounds && this._bounds.top || NO_LIMITS;
        this.right = this.betweenBounds(this.right, boundsRight);
        this.left = this.betweenBounds(this.left, boundsLeft);
        this.top = this.betweenBounds(this.top, boundsTop);
    }

}