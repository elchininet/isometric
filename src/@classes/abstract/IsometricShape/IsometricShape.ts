import { IsometricPlaneView } from '@types';
import {
    SVG_ELEMENTS,
    Typeof
} from '@constants';
import {
    addSVGProperties,
    getDraggableMethods
} from '@utils/svg';
import { Positionable } from '@interfaces/Positionable';
import {
    Draggable,
    Drag,
    DragLimit
} from '@interfaces/Draggable';
import { IsometricGraphic } from '@classes/abstract/IsometricGraphic';
import { IsometricShapeProps } from './types';

export abstract class IsometricShape extends IsometricGraphic implements Positionable, Draggable {

    // Exclude the next constructor from the coverage reports
    // Check https://github.com/microsoft/TypeScript/issues/13029
    /* istanbul ignore next */
    public constructor(props: IsometricShapeProps) {
        super(props, SVG_ELEMENTS.path);
        if (typeof this.props.right === Typeof.UNDEFINED) {
            this.props.right = 0;
        }
        if (typeof this.props.left === Typeof.UNDEFINED) {
            this.props.left = 0;
        }
        if (typeof this.props.top === Typeof.UNDEFINED) {
            this.props.top = 0;
        }
        this._dragMethods = getDraggableMethods(
            this.element,
            this
        );
        this._drag = false;
        this._dragLimit = false;
    }
    
    protected override props: IsometricShapeProps;
    private _drag: Drag;
    private _dragMethods: ReturnType<typeof getDraggableMethods>;
    private _dragLimit: DragLimit;

    public update(): this {
        this.updateGraphic(this.planeView);
        return this;
    }

    public clear(): this {
        addSVGProperties(this.element, {
            d: ''
        });
        return this;
    }

    // planeView
    public get planeView(): IsometricPlaneView {
        return this.props.planeView;
    }

    public set planeView(value: IsometricPlaneView) {
        this.props.planeView = value;
        this.update();
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