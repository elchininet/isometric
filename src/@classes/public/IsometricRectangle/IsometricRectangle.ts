import {
    Command,
    PlaneView,
} from '@constants';
import {
    LinePoint,
    CommandPoint,
    SVGPositionableProperties,
    SVGRectangleProperties,
    SVGRectangleAnimation,
    SVGAnimationObject
} from '@types';
import { getSVGPath, translateCommandPoints } from '@utils/svg';
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

    protected getSVGProperty(): string {
        return 'd';
    }

    protected getAnimationProps(animation: SVGAnimationObject): Record<string, string> {

        const props = {
            right: this.right,
            left: this.left,
            top: this.top,
            width: this.width,
            height: this.height
        };

        if (Object.prototype.hasOwnProperty.call(props, animation.property)) {

            const property = animation.property as SVGPositionableProperties | SVGRectangleProperties;

            if (animation.values) {

                if (Array.isArray(animation.values)) {
                    return {
                        values: animation.values.map((value: string | number): string => {
                            const modifiedArgs = { ...props };
                            modifiedArgs[property] = +value;
                            return this.getRectanglePath(modifiedArgs);
                        }).join(';')
                    };
                } else {
                    const modifiedArgs = { ...props };
                    modifiedArgs[property] = +animation.values;
                    return {
                        values: this.getRectanglePath(modifiedArgs)
                    };
                }

            } else {
                const fromArgs = { ...props };
                const toArgs = { ...props };
                fromArgs[property] = +animation.from;
                toArgs[property] = +animation.to;
                return {
                    from: this.getRectanglePath(fromArgs),
                    to: this.getRectanglePath(toArgs)
                };
            }

        }

        throw new TypeError(`The property ${animation.property} is not an allowed animation property for the IsometricRectangle class`);

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