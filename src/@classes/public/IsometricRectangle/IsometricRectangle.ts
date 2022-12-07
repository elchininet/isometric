import {
    Command,
    PlaneView,
} from '@constants';
import {
    LinePoint,
    CommandPoint,
    SVGShapeProperties,
    SVGRectangleProperties,
    SVGRectangleAnimation,
    SVGAnimationObject
} from '@types';
import {
    addSVGProperties,
    getSVGPath,
    translateCommandPoints
} from '@utils/svg';
import { IsometricShapeAbstract } from '@classes/abstract/IsometricShapeAbstract';
import {
    IsometricRectangleProps,
    GetRectanglePathArguments
} from './types';

export class IsometricRectangle extends IsometricShapeAbstract {

    public constructor(props: IsometricRectangleProps) {
        const { height, width, ...rest } = props;
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        super(rest);
        this._width = width;
        this._height = height;
    }

    private _width: number;
    private _height: number;

    protected getCommands(args?: GetRectanglePathArguments): CommandPoint[] {
        const right = args?.right || this.right;
        const left = args?.left || this.left;
        const top = args?.top || this.top;
        const width = args?.width || this.width;
        const height = args?.height || this.height;
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

    public get width(): number {
        return this._width;
    }

    public set width(value: number) {
        this._width = value;
        this.update();
    }

    public get height(): number {
        return this._height;
    }

    public set height(value: number) {
        this._height = value;
        this.update();
    }

    public addAnimation(animation: SVGRectangleAnimation): this {
        return super.addAnimation(animation);
    }

}