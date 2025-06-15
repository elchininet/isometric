import {
    Command,
    PlaneView,
    SVG_ELEMENTS,
    SVG_NAMESPACE,
} from '@constants';
import {
    LinePoint,
    CommandPoint,
    SVGRectangleAnimation,
    SVGAnimationObject
} from '@types';
import {
    getSVGPath,
    translateCommandPoints,
    addSVGProperties,
    isSVGProperty,
    getAnimationProperties
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
        const right = args?.right ?? this.right;
        const left = args?.left ?? this.left;
        const top = args?.top ?? this.top;
        const width = args?.width ?? this.width;
        const height = args?.height ?? this.height;
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

    protected updateSubClassAnimations(): void {

        this.animations.forEach((animation: SVGAnimationObject): void => {

            const isNativeSVGProperty = isSVGProperty(animation.property);

            if (!isNativeSVGProperty) {

                const props: GetRectanglePathArguments = {
                    right: this.right,
                    left: this.left,
                    top: this.top,
                    width: this.width,
                    height: this.height
                };

                const properties: Record<string, string> = getAnimationProperties(
                    this.getRectanglePath.bind(this),
                    animation,
                    props,
                );

                animation.element = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.animate) as SVGAnimateElement;

                this.element.appendChild(animation.element);

                this.addAnimationBasicProperties('d', animation);

                addSVGProperties(animation.element, properties);

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