import { SVG_ELEMENTS } from '@constants';
import { IsometricContainer } from '@classes/abstract/IsometricContainer';
import { getPointFromIsometricPoint } from '@utils/math';
import {
    addSVGProperties,
    elementHasSVGParent
} from '@utils/svg';
import { IsometricGroupProps } from './types';

const defaultProps: IsometricGroupProps = {
    right: 0,
    left: 0,
    top: 0
};

export class IsometricGroup extends IsometricContainer {

    // Exclude the next constructor from the coverage reports
    // Check https://github.com/microsoft/TypeScript/issues/13029
    /* istanbul ignore next */
    constructor(props: IsometricGroupProps = {}) {

        super(SVG_ELEMENTS.group);
        this.props = { ...defaultProps, ...props };

    }

    protected props: IsometricGroupProps;

    protected override updateChildren() {
        super.updateChildren();
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
    }

    // right
    public get right(): number {
        return this.props.right;
    }

    public set right(value: number) {
        this.props.right = value;
        this.updateChildren();
    }

    // left
    public get left(): number {
        return this.props.left;
    }

    public set left(value: number) {
       this.props.left = value;
       this.updateChildren();
    }

    // top
    public get top(): number {
        return this.props.top;
    }

    public set top(value: number) {
        this.props.top = value;
        this.updateChildren();
    }

}