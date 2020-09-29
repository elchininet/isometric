import { Command, CommandPoint, SVGPathAnimation, SVGAnimationObject } from '@types';
import { IsometricGraphic, IsometricGraphicProps } from '@classes/abstract/IsometricGraphic';
import { addSVGProperties, parseDrawCommands, getSVGPath } from '@utils';

export class IsometricPath extends IsometricGraphic {

    public constructor(props: IsometricGraphicProps = {}) {
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        super(props)/* istanbul ignore next */;
        this.commands = [];
    }

    private commands: CommandPoint[];

    private getPathFromCommands = (commands: string): string => getSVGPath(parseDrawCommands(commands), this.data.centerX, this.data.centerY, this.data.scale);

    protected privateUpdateAnimations(): void {
        
        this.animations.forEach((animation: SVGAnimationObject): void => {

            if (animation.property === 'path') {

                if (animation.values) {
                    addSVGProperties(
                        animation.element,
                        {
                            values: Array.isArray(animation.values)
                                ? animation.values.map((value: string | number): string => {
                                    return this.getPathFromCommands(`${value}`);
                                }).join(';')
                                : this.getPathFromCommands(`${animation.values}`)
                        }
                    );
                } else {
                    addSVGProperties(animation.element, {
                        from: this.getPathFromCommands(`${animation.from}`),
                        to: this.getPathFromCommands(`${animation.to}`)
                    });
                }

            }

        });

    }

    public update(): IsometricPath {
        if (this.path.parentNode) {
            addSVGProperties(this.path, {
                d: getSVGPath(this.commands, this.data.centerX, this.data.centerY, this.data.scale)
            });
            this.updateAnimations();        
        }
        return this;
    }

    public clear(): IsometricPath {
        this.commands.splice(0);
        addSVGProperties(this.path, {
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

    public addAnimation(animation: SVGPathAnimation): IsometricPath {
        return super.addAnimation(animation) as IsometricPath;
    }

    public removeAnimationByIndex(index: number): IsometricPath {
        return super.removeAnimationByIndex(index) as IsometricPath;
    }

    public removeAnimations(): IsometricPath {
        return super.removeAnimations() as IsometricPath;
    }

}