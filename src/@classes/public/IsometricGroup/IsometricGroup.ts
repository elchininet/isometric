import { SVG_ELEMENTS } from '@constants';
import { getPointFromIsometricPoint } from '@utils/math';
import {
    addSVGProperties,
    elementHasSVGParent,
    getDraggableMethods
} from '@utils/svg';
import { Positionable } from '@interfaces/Positionable';
import {
    Draggable,
    Drag,
    DragLimit
} from '@interfaces/Draggable';
import { IsometricContainer } from '@classes/abstract/IsometricContainer';
import { IsometricGroupProps } from './types';

const defaultProps: IsometricGroupProps = {
    right: 0,
    left: 0,
    top: 0
};

export class IsometricGroup extends IsometricContainer implements Positionable, Draggable {

    // Exclude the next constructor from the coverage reports
    // Check https://github.com/microsoft/TypeScript/issues/13029
    /* istanbul ignore next */
    constructor(props: IsometricGroupProps = {}) {

        super(SVG_ELEMENTS.group);
        this.props = { ...defaultProps, ...props };
        this._dragMethods = getDraggableMethods(
            this.element,
            this
        );
        this._drag = false;
        this._dragLimit = false;
    }

    protected props: IsometricGroupProps;
    private _drag: Drag;
    private _dragMethods: ReturnType<typeof getDraggableMethods>;
    private _dragLimit: DragLimit;

    public override update(): this {
        if (elementHasSVGParent(this.element)) {            
            const point = getPointFromIsometricPoint(
                0,
                0,
                {
                    r: this.props.right,
                    l: this.props.left,
                    t: this.props.top
                },
                this.data.scale
            );
            addSVGProperties(
                this.element,
                {
                    transform: `translate(${point.x}, ${point.y})`
                }
            );
        }
        return super.update();
    }

    // right
    public get right(): number {
        return this.props.right;
    }

    public set right(value: number) {
        if (this.props.right !== value) {
            this.props.right = value;
            this.update();
        }        
    }

    // left
    public get left(): number {
        return this.props.left;
    }

    public set left(value: number) {
        if (this.props.left !== value) {
            this.props.left = value;
            this.update();
        }
    }

    // top
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
        return this._drag;
    }

    public set drag(value: Drag) {
        this._drag = value;
        this._dragMethods.stopDrag();
        if (this._drag) {
            this._dragMethods.updateDrag(this._drag);
            this._dragMethods.beginDrag();
        }
    }

    public get dragLimit(): DragLimit {
        return this._dragLimit;
    }

    public set dragLimit(value: DragLimit) {
        this._dragLimit = value;
        this._dragMethods.updateDragLimit(this._dragLimit);
    }

}