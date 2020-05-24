import { Command, CommandPoint, PlaneView, IsometricPlaneView } from '@types';
import { IsometricShape } from '@classes/abstract/IsometricShape';
import { addSVGProperties, getSVGPath, translateCommandPoints } from '@utils';
import { IsometricCircleProps } from './types';

export class IsometricCircle extends IsometricShape {

    public constructor(props: IsometricCircleProps) {
        const { radius, ...rest } = props;
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        super(rest)/* istanbul ignore next */;
        this.circleRadius = radius;
    }

    private circleRadius: number;

    public update(): IsometricCircle {
        if (this.path.parentNode) {
            const commands: CommandPoint[] = [];
            switch(this.planeView) {
                case PlaneView.FRONT:
                    commands.push(
                        {
                            command: Command.move,
                            point: { r: 0, l: this.radius, t: 0 }
                        },
                        {
                            command: Command.curve,
                            point: { r: 0, l: - this.radius, t: 0 },
                            control: { r: 0, l: 0, t: - this.radius }
                        },
                        {
                            command: Command.curve,
                            point: { r: 0, l: this.radius, t: 0 },
                            control: { r: 0, l: 0, t: this.radius }
                        }
                    );
                    break;
                case PlaneView.SIDE:
                    commands.push(
                        {
                            command: Command.move,
                            point: { r: - this.radius, l: 0, t: 0 }
                        },
                        {
                            command: Command.curve,
                            point: { r: this.radius, l: 0, t: 0 },
                            control: { r: 0, l: 0, t: - this.radius }
                        },
                        {
                            command: Command.curve,
                            point: { r: - this.radius, l: 0, t: 0 },
                            control: { r: 0, l: 0, t: this.radius }
                        }
                    );
                    break;
                case PlaneView.TOP:
                    commands.push(
                        {
                            command: Command.move,
                            point: { r: 0, l: this.radius, t: 0 }
                        },
                        {
                            command: Command.curve,
                            point: { r: 0, l: - this.radius, t: 0 },
                            control: { r: this.radius, l: 0, t: 0 }
                        },
                        {
                            command: Command.curve,
                            point: { r: 0, l: this.radius, t: 0 },
                            control: { r: - this.radius, l: 0, t:0 }
                        }
                    );
                    break;
            }
            translateCommandPoints(commands, this.right, this.left, this.top);
            addSVGProperties(this.path, {
                d: getSVGPath(
                    commands,
                    this.data.centerX,
                    this.data.centerY,
                    this.data.scale
                )
            });
        }
        return this;
    }

    public clear(): IsometricCircle {
        addSVGProperties(this.path, {
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

}