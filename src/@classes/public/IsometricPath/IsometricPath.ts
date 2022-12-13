import {
    Command,
    SVG_ELEMENTS,
    SVG_NAMESPACE
} from '@constants';
import {
    CommandPoint,
    SVGPathAnimation,
    SVGAnimationObject
} from '@types';
import {
    addSVGProperties,
    parseDrawCommands,
    getSVGPath
} from '@utils/svg';
import { IsometricPathAbstract } from '@classes/abstract/IsometricPathAbstract';
import { IsometricPathProps } from './types';

export class IsometricPath extends IsometricPathAbstract {
    // Exclude the next constructor from the coverage reports
    // Check https://github.com/microsoft/TypeScript/issues/13029
    /* istanbul ignore next */
    public constructor(props: IsometricPathProps = {}) {
        super(props, SVG_ELEMENTS.path);
        this.commands = [];
        this._autoclose = 'autoclose' in props
            ? props.autoclose
            : true;
    }

    private commands: CommandPoint[];
    private _autoclose: boolean;

    private getPathFromCommands = (commands: string): string => getSVGPath(
        parseDrawCommands(commands),
        this.data.centerX,
        this.data.centerY,
        this.data.scale,
        this._autoclose
    );

    protected updateSubClassAnimations(): void {

        this.animations.forEach((animation: SVGAnimationObject): void => {

            if (animation.property === 'path') {

                let properties: Record<string, string>;

                if (animation.values) {
                    properties =  {
                        values: Array.isArray(animation.values)
                            ? animation.values.map((value: string | number): string => {
                                return this.getPathFromCommands(`${value}`);
                            }).join(';')
                            : this.getPathFromCommands(`${animation.values}`)
                    };
                } else {
                    properties = {
                        from: this.getPathFromCommands(`${animation.from}`),
                        to: this.getPathFromCommands(`${animation.to}`)
                    };
                }

                if (!animation.element) {
                    animation.element = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.animate) as SVGAnimateElement;
                }

                if (!animation.element.parentNode) {
                    this.element.appendChild(animation.element);
                }

                this.addAnimationBasicProperties('d', animation);

                addSVGProperties(animation.element, properties);

            }

        });

    }

    protected getCommands(): CommandPoint[] {
        return this.commands;
    }

    public get autoclose(): boolean {
        return this._autoclose;
    }

    public set autoclose(value: boolean) {
        this._autoclose = value;
        this.update();
    }

    public update(): this {
        this.updateGraphic(undefined, this.autoclose);
        return this;
    }

    public clear(): this {
        this.commands.splice(0);
        addSVGProperties(this.element, {
            d: ''
        });
        return this;
    }

    public moveTo(right: number, left: number, top: number): IsometricPath {
        this.commands.push({
            command: Command.move,
            point: { r: right, l: left, t: top }
        });
        this.update();
        return this;
    }

    public lineTo(right: number, left: number, top: number): IsometricPath {
        this.commands.push({
            command: Command.line,
            point: { r: right, l: left, t: top }
        });
        this.update();
        return this;
    }

    public curveTo(
        controlRight: number,
        controlLeft: number,
        controlTop: number,
        right: number,
        left: number,
        top: number
    ): IsometricPath {
        this.commands.push({
            command: Command.curve,
            control: { r: controlRight, l: controlLeft, t: controlTop },
            point: { r: right, l: left, t: top }
        });
        this.update();
        return this;
    }

    public mt(right: number, left: number, top: number): IsometricPath {
        return this.moveTo(right, left, top);
    }

    public lt(right: number, left: number, top: number): IsometricPath {
        return this.lineTo(right, left, top);
    }
    public ct(
        controlRight: number,
        controlLeft: number,
        controlTop: number,
        right: number,
        left: number,
        top: number
    ): IsometricPath {
        return this.curveTo(controlRight, controlLeft, controlTop, right, left, top);
    }

    public draw(commands: string): IsometricPath {
        this.commands = parseDrawCommands(commands);
        this.update();
        return this;
    }

    public addAnimation(animation: SVGPathAnimation): this {
        return super.addAnimation(animation);
    }

}