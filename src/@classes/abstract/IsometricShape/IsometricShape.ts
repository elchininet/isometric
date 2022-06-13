import { IsometricPlaneView } from '@types';
import {
    SVG_ELEMENTS,
    Typeof
} from '@constants';
import { addSVGProperties } from '@utils/svg';
import { IsometricGraphic } from '@classes/abstract/IsometricGraphic';
import { IsometricShapeProps } from './types';

export abstract class IsometricShape extends IsometricGraphic {

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
    }
    
    protected override props: IsometricShapeProps;

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
        this.props.right = value;
        this.update();
    }

    // left
    public get left(): number {
        return this.props.left;
    }

    public set left(value: number) {
        this.props.left = value;
        this.update();
    }

    // top
    public get top(): number {
        return this.props.top;
    }

    public set top(value: number) {
        this.props.top = value;
        this.update();
    }

}