import {
    Command,
    PlaneView
} from '@constants';
import {
    CommandPoint,
    SVGCircleAnimation,
    SVGShapeProperties,
    SVGCircleProperties,
    SVGAnimationObject
} from '@types';
import {
    addSVGProperties,
    getSVGPath,
    translateCommandPoints
} from '@utils/svg';
import { IsometricShapeAbstract } from '@classes/abstract/IsometricShapeAbstract';
import {
    IsometricCircleProps,
    GetCirclePathArguments
} from './types';

export class IsometricCircle extends IsometricShapeAbstract {

    public constructor(props: IsometricCircleProps) {
        const { radius, ...rest } = props;
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        super(rest);
        this._radius = radius;
    }

    private _radius: number;

    protected getCommands(args?: GetCirclePathArguments): CommandPoint[] {
        const right = args?.right || this.right;
        const left = args?.left || this.left;
        const top = args?.top || this.top;
        const radius = args?.radius || this.radius;
        const commands: CommandPoint[] = [];
        switch(this.planeView) {
            case PlaneView.FRONT:
                commands.push(
                    {
                        command: Command.move,
                        point: { r: 0, l: radius, t: 0 }
                    },
                    {
                        command: Command.curve,
                        point: { r: 0, l: - radius, t: 0 },
                        control: { r: 0, l: 0, t: - radius }
                    },
                    {
                        command: Command.curve,
                        point: { r: 0, l: radius, t: 0 },
                        control: { r: 0, l: 0, t: radius }
                    }
                );
                break;
            case PlaneView.SIDE:
                commands.push(
                    {
                        command: Command.move,
                        point: { r: - radius, l: 0, t: 0 }
                    },
                    {
                        command: Command.curve,
                        point: { r: radius, l: 0, t: 0 },
                        control: { r: 0, l: 0, t: - radius }
                    },
                    {
                        command: Command.curve,
                        point: { r: - radius, l: 0, t: 0 },
                        control: { r: 0, l: 0, t: radius }
                    }
                );
                break;
            case PlaneView.TOP:
                commands.push(
                    {
                        command: Command.move,
                        point: { r: 0, l: radius, t: 0 }
                    },
                    {
                        command: Command.curve,
                        point: { r: 0, l: - radius, t: 0 },
                        control: { r: radius, l: 0, t: 0 }
                    },
                    {
                        command: Command.curve,
                        point: { r: 0, l: radius, t: 0 },
                        control: { r: - radius, l: 0, t:0 }
                    }
                );
                break;
        }
        translateCommandPoints(commands, right, left, top);
        return commands;
    }

    private getCirclePath(args: GetCirclePathArguments): string {
        const commands = this.getCommands(args);
        return getSVGPath(
            commands,
            this.data.centerX,
            this.data.centerY,
            this.data.scale,
            true
        );
    }

    protected privateUpdateAnimations(): void {

        this.animations.forEach((animation: SVGAnimationObject): void => {

            const args = {
                right: this.right,
                left: this.left,
                top: this.top,
                radius: this.radius
            };

            if (Object.prototype.hasOwnProperty.call(args, animation.property)) {

                const property = animation.property as SVGShapeProperties | SVGCircleProperties;

                if (animation.values) {

                    let values: string;

                    if (Array.isArray(animation.values)) {
                        values = animation.values.map((value: string | number): string => {
                            const modifiedArgs = { ...args };
                            modifiedArgs[property] = +value;
                            return this.getCirclePath(modifiedArgs);
                        }).join(';');
                    } else {
                        const modifiedArgs = { ...args };
                        modifiedArgs[property] = +animation.values;
                        values = this.getCirclePath(modifiedArgs);
                    }

                    addSVGProperties(animation.element, { values });

                } else {
                    const fromArgs = { ...args };
                    const toArgs = { ...args };
                    fromArgs[property] = +animation.from;
                    toArgs[property] = +animation.to;
                    addSVGProperties(animation.element, {
                        from: this.getCirclePath(fromArgs),
                        to: this.getCirclePath(toArgs)
                    });
                }
            }

        });

    }

    public get radius(): number {
        return this._radius;
    }

    public set radius(value: number) {
        this._radius = value;
        this.update();
    }

    public addAnimation(animation: SVGCircleAnimation): this {
        return super.addAnimation(animation);
    }

}