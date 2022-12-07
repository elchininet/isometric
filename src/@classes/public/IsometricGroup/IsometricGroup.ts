import { SVG_ELEMENTS } from '@constants';
import { getPointFromIsometricPoint } from '@utils/math';
import {
    elementHasSVGParent,
    addSVGProperties
} from '@utils/svg';
import { applyMixins } from '@utils/other';
import { IsometricContainerAbstract } from '@classes/abstract/IsometricContainerAbstract';
import { IsometricDraggableAbstract } from '@classes/abstract/IsometricDraggableAbstract';
import { IsometricGroupProps } from './types';

const defaultProps = {
    right: 0,
    left: 0,
    top: 0,
};

export class IsometricGroup extends IsometricContainerAbstract {

    // Exclude the next constructor from the coverage reports
    // Check https://github.com/microsoft/TypeScript/issues/13029
    /* istanbul ignore next */
    constructor(props: IsometricGroupProps = {}) {
        super(SVG_ELEMENTS.group);
        this.props = { ...defaultProps, ...props };
    }

    protected props: IsometricGroupProps;

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

}

export interface IsometricGroup extends IsometricDraggableAbstract {}

applyMixins(IsometricGroup, IsometricDraggableAbstract);