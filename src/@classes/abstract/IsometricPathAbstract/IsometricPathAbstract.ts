import { SVG_ELEMENTS } from '@constants';
import { CommandPoint, IsometricPlaneView } from '@types';
import {
    addSVGProperties,
    getSVGPath,
    getTextureCorner,
    elementHasSVGParent
} from '@utils/svg';
import { IsometricGraphicAbstract, IsometricGraphicProps } from '../IsometricGraphicAbstract';

export abstract class IsometricPathAbstract extends IsometricGraphicAbstract {

    // Exclude the next constructor from the coverage reports
    // Check https://github.com/microsoft/TypeScript/issues/13029
    /* istanbul ignore next */
    public constructor(props: IsometricGraphicProps, svgElement: SVG_ELEMENTS) {
        super(props, svgElement);
    }

    protected abstract getCommands(args?: unknown): CommandPoint[];

    protected updateGraphic(planeView?: IsometricPlaneView, autoclose = true) {
        if (elementHasSVGParent(this.element)) {
            const commands = this.getCommands();
            const corner = getTextureCorner(
                commands,
                this.data.centerX,
                this.data.centerY,
                this.data.scale
            );
            addSVGProperties(
                this.element,
                {
                    d: getSVGPath(
                        commands,
                        this.data.centerX,
                        this.data.centerY,
                        this.data.scale,
                        autoclose
                    )
                }
            );
            this.updatePatternTransform(corner, planeView);
            this.updateAnimations();
        }
    }

}