import {
    Command,
    PlaneView,
    SVG_ELEMENTS,
    SVG_NAMESPACE,
} from '@constants';
import {
    IsometricPoint,
    LinePoint,
    CommandPoint,
    SVGPositionableProperties,
    SVGPentagramProperties,
    SVGPentagramAnimation,
    SVGAnimationObject
} from '@types';
import {
    getSVGPath,
    translateCommandPoints,
    addSVGProperties,
    isSVGProperty
} from '@utils/svg';
import { IsometricShapeAbstract } from '@classes/abstract/IsometricShapeAbstract';
import {
    IsometricStarPolygonAbstractProps,
    GetStarPolygonAbstractPathArguments
} from './types';

export abstract class IsometricStarPolygonAbstract extends IsometricShapeAbstract {

    public constructor(props: IsometricStarPolygonAbstractProps) {
        const {
            radius,
            points,
            density,
            rotation = 0,
            ...rest
        } = props;
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        super(rest);
        this._radius = radius;
        this._points = points;
        this._density = density;
        this._rotation = rotation;
        this._sector =  2 * Math.PI / this._points;
        this._halfSector = this._sector / 2;
    }

    protected _radius: number;
    protected _points: number;
    protected _density: number;
    protected _rotation: number;

    protected _sector: number;
    protected _halfSector: number;

    protected getCommands(args?: GetStarPolygonAbstractPathArguments): CommandPoint[] {
        const right = args?.right || this.right;
        const left = args?.left || this.left;
        const top = args?.top || this.top;
        const radius = args?.radius || this.radius;
        const points = args?.points || this._points;
        const density = args?.density || this._density;
        const rotation = args?.rotation || this.rotation;
        const coordinates = this.get2DCoordinates(
            radius,
            points,
            density,
            rotation
        );
        const commands: LinePoint[] = [];
        switch(this.planeView) {
            case PlaneView.FRONT:
                coordinates.forEach((point: IsometricPoint, index: number): void => {
                    commands.push({
                        command: index === 0
                            ? Command.move
                            : Command.line,
                        point: {
                            r: 0,
                            l: point.x,
                            t: point.y
                        }
                    });
                });
                break;
            case PlaneView.SIDE:
                coordinates.forEach((point: IsometricPoint, index: number): void => {
                    commands.push({
                        command: index === 0
                            ? Command.move
                            : Command.line,
                        point: {
                            r: point.x,
                            l: 0,
                            t: point.y
                        }
                    });
                });
                break;
            case PlaneView.TOP:
                coordinates.forEach((point: IsometricPoint, index: number): void => {
                    commands.push({
                        command: index === 0
                            ? Command.move
                            : Command.line,
                        point: {
                            r: - point.x,
                            l: - point.y,
                            t: 0
                        }
                    });
                });
                break;
        }
        translateCommandPoints(commands, right, left, top);
        return commands;
    }

    private _getRadianAngle(angle: number): number {
        return angle * Math.PI / 180;
    }

    private _getInnerRadius(
        radius: number,
        points: number,
        density: number
    ): number {
        return radius * Math.cos(Math.PI * density / points) / Math.cos(Math.PI * (density - 1) / points);
    }

    private get2DCoordinates(
        radius: number,
        points: number,
        density: number,
        rotation: number
    ): IsometricPoint[] {
        const innerRadius = this._getInnerRadius(
            radius,
            points,
            density
        );
        return [...Array(this._points)].reduce((points: IsometricPoint[], _undefined: undefined, index: number) => {
            const angle = index * this._sector + 2 *  Math.PI - this._getRadianAngle(rotation);
            const innerAngle = angle + this._halfSector;
            const oX = Math.sin(angle) * radius;
            const oY = Math.cos(angle) * radius;
            const iX = Math.sin(innerAngle) * innerRadius;
            const iY = Math.cos(innerAngle) * innerRadius;
            return [
                ...points,
                { x: oX, y: oY },
                { x: iX, y: iY }
            ];
        }, []);
    }

    private getPentagramPath(args: GetStarPolygonAbstractPathArguments): string {
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

                const props = {
                    right: this.right,
                    left: this.left,
                    top: this.top,
                    radius: this.radius,
                    points: this._points,
                    density: this._density,
                    rotation: this.rotation
                };

                if (Object.prototype.hasOwnProperty.call(props, animation.property)) {

                    const property = animation.property as SVGPositionableProperties | SVGPentagramProperties;
                    let properties: Record<string, string>;

                    if (animation.values) {

                        if (Array.isArray(animation.values)) {
                            properties = {
                                values: animation.values.map((value: string | number): string => {
                                    const modifiedArgs = { ...props };
                                    modifiedArgs[property] = +value;
                                    return this.getPentagramPath(modifiedArgs);
                                }).join(';')
                            };
                        } else {
                            const modifiedArgs = { ...props };
                            modifiedArgs[property] = +animation.values;
                            properties = {
                                values: this.getPentagramPath(modifiedArgs)
                            };
                        }

                    } else {
                        const fromArgs = { ...props };
                        const toArgs = { ...props };
                        fromArgs[property] = +animation.from;
                        toArgs[property] = +animation.to;
                        properties = {
                            from: this.getPentagramPath(fromArgs),
                            to: this.getPentagramPath(toArgs)
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

    public get rotation(): number {
        return this._rotation;
    }

    public set rotation(value: number) {
        this._rotation = value;
        this.update();
    }

    public addAnimation(animation: SVGPentagramAnimation): this {
        return super.addAnimation(animation);
    }

}