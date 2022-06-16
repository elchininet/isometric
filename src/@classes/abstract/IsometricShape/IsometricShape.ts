import { IsometricPlaneView } from '@types';
import { SVG_ELEMENTS } from '@constants';
import { addSVGProperties } from '@utils/svg';
import { applyMixins } from '@utils/other';
import { IsometricGraphic } from '@classes/abstract/IsometricGraphic';
import { IsometricDraggable } from '@classes/abstract/IsometricDraggable';
import { IsometricShapeProps } from './types';

const defaultProps = {
    right: 0,
    left: 0,
    top: 0,
};

export abstract class IsometricShape extends IsometricGraphic {

    // Exclude the next constructor from the coverage reports
    // Check https://github.com/microsoft/TypeScript/issues/13029
    /* istanbul ignore next */
    public constructor(props: IsometricShapeProps) {
        super({...defaultProps, ...props}, SVG_ELEMENTS.path);
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

}

export interface IsometricShape extends IsometricDraggable {}

applyMixins(IsometricShape, IsometricDraggable);