import {
    IsometricPlaneView,
    SVGAnimationObject,
    SVGPositionableProperties,
    SVGTextProperties,
    IsometricPoint
} from '@types';
import {
    SVG_NAMESPACE,
    SVG_ELEMENTS,
    ORIGIN
} from '@constants';
import { IsometricDraggableProps } from '@classes/abstract/IsometricDraggableAbstract';
import { IsometricGraphicAbstract } from '@classes/abstract/IsometricGraphicAbstract';
import { getPointFromIsometricPoint } from '@utils/math';
import {
    addSVGProperties,
    elementHasSVGParent,
    getPatternTransform,
    isSVGProperty
} from '@utils/svg';
import { IsometricTextProps } from './types';

export class IsometricText extends IsometricGraphicAbstract {

    public constructor(props: IsometricTextProps) {
        const {
            planeView,
            text = '',
            fontFamily = 'Arial',
            fontSize = 12,
            fontStyle = 'normal',
            fontWeight = 'normal',
            origin = ['center', 'center'],
            right = 0,
            left = 0,
            top = 0,
            rotation = 0,
            selectable = true,
            ...rest
        } = props;
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        super(rest, SVG_ELEMENTS.group);
        this._textElement = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.text);
        this._tspan = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.tspan);
        this._textElement.appendChild(this._tspan);
        this.element.appendChild(this._textElement);
        this.planeView = planeView;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.fontStyle = fontStyle;
        this.fontWeight = fontWeight;
        this.selectable = selectable;
        this.origin = origin;
        this.right = right;
        this.left = left;
        this.top = top;
        this.rotation = rotation;
        this.text = text;

    }

    private _textElement: SVGTextElement;
    private _tspan: SVGTSpanElement;
    private _text: string;
    private _planeView: IsometricPlaneView;
    private _fontFamily: string;
    private _fontSize: number;
    private _fontStyle: IsometricTextProps['fontStyle'];
    private _fontWeight: IsometricTextProps['fontWeight'];
    private _origin: IsometricTextProps['origin'];
    private _selectable: boolean;
    private _right: number;
    private _left: number;
    private _top: number;
    private _rotation: number;
    private _originHash = {
        [ORIGIN.CENTER]: 'middle',
        [ORIGIN.LEFT]: 'start',
        [ORIGIN.RIGHT]: 'end',
        [ORIGIN.TOP]: 'hanging',
        [ORIGIN.BOTTOM]: 'baseline'
    };

    private commonAnimationAttributes = {
        attributeName: 'transform',
        attributeType: 'XML',
        additive: 'sum',
        fill: 'freeze'
    };

    private getPositionTransform(props: Required<IsometricDraggableProps>, fromCenter = true): IsometricPoint {
        return getPointFromIsometricPoint(
            fromCenter
                ? this.data.centerX
                : 0,
            fromCenter
                ? this.data.centerY
                : 0,
            {
                r: props.right,
                l: props.left,
                t: props.top
            },
            this.data.scale
        );
    }

    private getMatrixTransform = (props: Required<IsometricDraggableProps>): string => {
        const transformMatrix = getPatternTransform(
            this.getPositionTransform(props),
            this.planeView,
            1
        );
        return `${transformMatrix} rotate(${this.rotation})`;
    };

    protected updateSubClassAnimations(): void {

        const props = {
            right: 0,
            left: 0,
            top: 0,
            rotation: 0,
        };

        this.animations.forEach((animation: SVGAnimationObject): void => {

            const isNativeSVGProperty = isSVGProperty(animation.property);

            if (!isNativeSVGProperty) {

                if (Object.prototype.hasOwnProperty.call(props, animation.property)) {

                    const property = animation.property as SVGPositionableProperties | SVGTextProperties;
                    const isRotation = property === 'rotation';
                    const commonProps = {
                        ...this.commonAnimationAttributes,
                        type: isRotation
                            ? 'rotate'
                            : 'translate',
                        begin: 'indefinite'
                    };

                    let properties: Record<string, string>;

                    if (animation.values) {

                        if (Array.isArray(animation.values)) {
                            properties = {
                                values: animation.values.map((value: string | number): string => {
                                    if (isRotation) {
                                        return `${value}`;
                                    } else {
                                        const modifiedArgs = { ...props };
                                        modifiedArgs[property] = +value - this[property];
                                        const coords = this.getPositionTransform(modifiedArgs, false);
                                        return `${coords.x},${coords.y}`;
                                    }
                                }).join(';'),
                                ...commonProps
                            };
                        } else {
                            if (isRotation) {
                                properties = {
                                    values: `${animation.values}`,
                                    ...commonProps
                                };
                            } else {
                                const modifiedArgs = { ...props };
                                modifiedArgs[property] = +animation.values - this[property];
                                const coords = this.getPositionTransform(modifiedArgs, false);
                                properties = {
                                    values: `${coords.x},${coords.y}`,
                                    ...commonProps
                                };
                            }
                        }

                    } else {
                        if (isRotation) {
                            properties = {
                                from: `${animation.from}`,
                                to: `${animation.to}`,
                                ...commonProps
                            };
                        } else {
                            const fromArgs = { ...props };
                            const toArgs = { ...props };
                            fromArgs[property] = +animation.from - this[property];
                            toArgs[property] = +animation.to - this[property];
                            const coordsFrom = this.getPositionTransform(fromArgs, false);
                            const coordsTo = this.getPositionTransform(toArgs, false);
                            properties = {
                                from: `${coordsFrom.x},${coordsFrom.y}`,
                                to: `${coordsTo.x},${coordsTo.y}`,
                                ...commonProps
                            };
                        }

                    }

                    if (!animation.element) {
                        animation.element = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.animateTransform) as SVGAnimateElement;
                    }

                    this.addAnimationBasicProperties('transform', animation);

                    addSVGProperties(animation.element, properties);

                    if (!animation.element.parentNode) {
                        if (isRotation) {
                            this._textElement.appendChild(animation.element);
                        } else {
                            this.element.appendChild(animation.element);
                        }
                    }

                    // Exclude the next line from the coverage reports
                    // beginElement is not available in Jest
                    /* istanbul ignore next */
                    window.requestAnimationFrame(() => {
                        animation.element.beginElement();
                    });

                }
            }

        });

    }

    public update(): this {
        if (elementHasSVGParent(this.element)) {
            const transform = this.getMatrixTransform(
                {
                    right: this.right,
                    left: this.left,
                    top: this.top
                }
            );
            addSVGProperties(this._textElement, { transform });
            this._tspan.textContent = this._text;
            this.updatePatternTransform({ x: 0, y: 0 }, this.planeView);
            this.updateAnimations();
        }
        return this;
    }

    public clear (): this {
        this.text = '';
        this.update();
        return this;
    }

    // text
    public get text(): string {
        return this._text;
    }

    public set text(value: string) {
        this._text = value;
        this.update();
    }

    // planeView
    public get planeView(): IsometricPlaneView {
        return this._planeView;
    }

    public set planeView(value: IsometricPlaneView) {
        this._planeView = value;
        this.update();
    }

    // fontFamily
    public get fontFamily(): string {
        return this._fontFamily;
    }

    public set fontFamily(value: string) {
        this._fontFamily = value;
        addSVGProperties(this._tspan, {
            'font-family': this._fontFamily
        });
    }

    // fontSize
    public get fontSize(): number {
        return this._fontSize;
    }

    public set fontSize(value: number) {
        this._fontSize = value;
        addSVGProperties(this._tspan, {
            'font-size': `${this._fontSize}px`
        });
    }

    // fontStyle
    public get fontStyle(): IsometricTextProps['fontStyle'] {
        return this._fontStyle;
    }

    public set fontStyle(value: IsometricTextProps['fontStyle']) {
        this._fontStyle = value;
        addSVGProperties(this._tspan, {
            'font-style': `${this._fontStyle}`
        });
    }

    // fontSize
    public get fontWeight(): IsometricTextProps['fontWeight'] {
        return this._fontWeight;
    }

    public set fontWeight(value: IsometricTextProps['fontWeight']) {
        this._fontWeight = value;
        addSVGProperties(this._tspan, {
            'font-weight': `${this._fontWeight}`
        });
    }

    // selectable
    public get selectable(): boolean {
        return this._selectable;
    }

    public set selectable(value: boolean) {
        this._selectable = value;
        if (this._selectable) {
            this._textElement.removeAttribute('style');
        } else {
            addSVGProperties(this._textElement, {
                style: [
                    '-webkit-user-select',
                    '-moz-user-select',
                    '-ms-user-select',
                    'user-select',
                    'pointer-events'
                ].map(
                    (decl) => `${decl}: none`
                ).join(';')
            });
        }
    }

    // origin
    public get origin(): IsometricTextProps['origin'] {
        return this._origin;
    }

    public set origin(value: IsometricTextProps['origin']) {
        this._origin = value;
        const [textAnchor, alignmentBaseline] = this._origin;
        addSVGProperties(this._tspan, {
            'text-anchor': this._originHash[textAnchor],
            'alignment-baseline': this._originHash[alignmentBaseline]
        });
    }

    // right
    public get right(): number {
        return this._right;
    }

    public set right(value: number) {
        if (this._right !== value) {
            this._right = value;
            this.update();
        }
    }

    // left
    public get left(): number {
        return this._left;
    }

    public set left(value: number) {
        if (this._left !== value) {
            this._left = value;
            this.update();
        }
    }

    // top
    public get top(): number {
        return this._top;
    }

    public set top(value: number) {
        if (this._top !== value) {
            this._top = value;
            this.update();
        }
    }

    // rotation
    public get rotation(): number {
        return this._rotation;
    }

    public set rotation(value: number) {
        if (this._rotation !== value) {
            this._rotation = value;
            this.update();
        }
    }

}