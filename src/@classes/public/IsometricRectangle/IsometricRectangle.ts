import {
    Command,
    PlaneView,
} from '@constants';
import {
    LinePoint,
    IsometricPlaneView,
    SVGShapeProperties,
    SVGRectangleProperties,
    SVGRectangleAnimation,
    SVGAnimationObject
} from '@types';
import { IsometricShape } from '@classes/abstract/IsometricShape';
import {
    addSVGProperties,
    getTextureCorner,
    getSVGPath,
    translateCommandPoints
} from '@utils/svg';
import { IsometricRectangleProps } from './types';

interface GetRectanglePathArguments {
    right: number;
    left: number;
    top: number;
    width: number;
    height: number;
}

export class IsometricRectangle extends IsometricShape {

    public constructor(props: IsometricRectangleProps) {
        const { height, width, ...rest } = props;
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        super(rest)/* istanbul ignore next */;
        this.rectWidth = width;
        this.rectHeight = height;
    }

    private rectWidth: number;
    private rectHeight: number;

    private getCommands(args: GetRectanglePathArguments): LinePoint[] {
        const { right, left, top, width, height } = args;
        const commands: LinePoint[] = [ {command: Command.move, point: {r: 0, l: 0, t: 0}} ];
        switch(this.planeView) {
            case PlaneView.FRONT:
                commands.push(
                    {command: Command.line, point: {r: 0, l: width, t: 0}},
                    {command: Command.line, point: {r: 0, l: width, t: height}},
                    {command: Command.line, point: {r: 0, l: 0, t: height}}
                );
                break;
            case PlaneView.SIDE:
                commands.push(
                    {command: Command.line, point: {r: width, l: 0, t: 0}},
                    {command: Command.line, point: {r: width, l: 0, t: height}},
                    {command: Command.line, point: {r: 0, l: 0, t: height}}
                );
                break;
            case PlaneView.TOP:
                commands.push(
                    {command: Command.line, point: {r: width, l: 0, t: 0}},
                    {command: Command.line, point: {r: width, l: height, t: 0}},
                    {command: Command.line, point: {r: 0, l: height, t: 0}}
                );
                break;
        }
        translateCommandPoints(commands, right, left, top);
        return commands;
    }

    private getRectanglePath(args: GetRectanglePathArguments): string {
        const commands = this.getCommands(args);
        return getSVGPath(
            commands,
            this.data.centerX,
            this.data.centerY,
            this.data.scale
        );
    }

    protected privateUpdateAnimations(): void {

        this.animations.forEach((animation: SVGAnimationObject): void => {

            const args = {
                right: this.right,
                left: this.left,
                top: this.top,
                width: this.width,
                height: this.height
            };

            if (Object.prototype.hasOwnProperty.call(args, animation.property)) {

                const property = animation.property as SVGShapeProperties | SVGRectangleProperties;

                if (animation.values) {

                    let values: string;

                    if (Array.isArray(animation.values)) {
                        values = animation.values.map((value: string | number): string => {
                            const modifiedArgs = { ...args };
                            modifiedArgs[property] = +value;
                            return this.getRectanglePath(modifiedArgs);
                        }).join(';');
                    } else {
                        const modifiedArgs = { ...args };
                        modifiedArgs[property] = +animation.values;
                        values = this.getRectanglePath(modifiedArgs);
                    }

                    addSVGProperties(animation.element, { values });

                } else {
                    const fromArgs = { ...args };
                    const toArgs = { ...args };
                    fromArgs[property] = +animation.from;
                    toArgs[property] = +animation.to;
                    addSVGProperties(animation.element, {
                        from: this.getRectanglePath(fromArgs),
                        to: this.getRectanglePath(toArgs)
                    });
                }
            }

        });
    }

    public update(): IsometricRectangle {
        if (this.path.parentNode) {
            const commands = this.getCommands({
                right: this.right,
                left: this.left,
                top: this.top,
                width: this.width,
                height: this.height
            });
            const corner = getTextureCorner(
                commands,
                this.data.centerX,
                this.data.centerY,
                this.data.scale
            );
            addSVGProperties(
                this.path,
                {
                    d: getSVGPath(
                        commands,
                        this.data.centerX,
                        this.data.centerY,
                        this.data.scale
                    )
                }
            );
            this.updatePatternTransform(corner, this.planeView);
            this.updateAnimations();
        }
        return this;
    }

    public clear(): IsometricRectangle {
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

    public get width(): number {
        return this.rectWidth;
    }

    public set width(value: number) {
        this.rectWidth = value;
        this.update();
    }

    public get height(): number {
        return this.rectHeight;
    }

    public set height(value: number) {
        this.rectHeight = value;
        this.update();
    }

    public addAnimation(animation: SVGRectangleAnimation): IsometricRectangle {
        return super.addAnimation(animation) as IsometricRectangle;
    }

    public removeAnimationByIndex(index: number): IsometricRectangle {
        return super.removeAnimationByIndex(index) as IsometricRectangle;
    }

    public removeAnimations(): IsometricRectangle {
        return super.removeAnimations() as IsometricRectangle;
    }

}