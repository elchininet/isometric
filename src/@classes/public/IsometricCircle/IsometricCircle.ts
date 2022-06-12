import {
    Command,
    PlaneView
} from '@constants';
import {
    CommandPoint,
    IsometricPlaneView,
    SVGCircleAnimation,
    SVGShapeProperties,
    SVGCircleProperties,
    SVGAnimationObject
} from '@types';
import { IsometricShape } from '@classes/abstract/IsometricShape';
import {
    addSVGProperties,
    getSVGPath,
    getTextureCorner,
    translateCommandPoints,
    elementHasSVGParent
} from '@utils/svg';
import { IsometricCircleProps } from './types';

interface GetCirclePathArguments {
    right: number;
    left: number;
    top: number;
    radius: number;
}

export class IsometricCircle extends IsometricShape {

    public constructor(props: IsometricCircleProps) {
        const { radius, ...rest } = props;
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        super(rest);
        this.circleRadius = radius;
    }

    private circleRadius: number;

    private getCommands(args: GetCirclePathArguments): CommandPoint[] {
        const { right, left, top, radius } = args;        
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

    public update(): this {
        if (elementHasSVGParent(this.element)) {
            const commands = this.getCommands({
                right: this.right,
                left: this.left,
                top: this.top,
                radius: this.radius
            });
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
                        true
                    )
                }
            );
            this.updatePatternTransform(corner, this.planeView);
            this.updateAnimations();
        }
        return this;
    }

    public clear(): this {
        addSVGProperties(this.element, {
            d: ''
        });
        return this;
    }

    protected setPlaneView(value: IsometricPlaneView): void {
        super.setPlaneView(value);
        this.update();
    }

    protected setRight(value: number): void {
        super.setRight(value);
        this.update();
    }

    protected setLeft(value: number): void {
        super.setLeft(value);
        this.update();
    }

    protected setTop(value: number): void {
        super.setTop(value);
        this.update();
    }

    public get radius(): number {
        return this.circleRadius;
    }

    public set radius(value: number) {
        this.circleRadius = value;
        this.update();
    }

    public addAnimation(animation: SVGCircleAnimation): this {
        return super.addAnimation(animation);
    }

}