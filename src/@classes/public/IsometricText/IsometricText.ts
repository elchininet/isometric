import {
    IsometricPlaneView,
    SVGAnimationObject,
    SVGPositionableProperties,
    IsometricPoint
} from '@types';
import { SVG_ELEMENTS, ORIGIN } from '@constants';
import { IsometricDraggableProps } from '@classes/abstract/IsometricDraggableAbstract';
import { IsometricGraphicAbstract } from '@classes/abstract/IsometricGraphicAbstract';
import { getPointFromIsometricPoint } from '@utils/math';
import {
    addSVGProperties,
    elementHasSVGParent,
    getPatternTransform
} from '@utils/svg';
import { IsometricTextProps } from './types';

export class IsometricText extends IsometricGraphicAbstract {

    public constructor(props: IsometricTextProps) {
        const {
            text,
            planeView,
            fontFamily = 'Arial',
            fontSize = 12,
            fontWeight = 'normal',
            origin = ['center', 'center'],
            right = 0,
            left = 0,
            top = 0,
            ...rest
        } = props;
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        super(rest, SVG_ELEMENTS.text);
        this.text = text;
        this.planeView = planeView;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.fontWeight = fontWeight;
        this.origin = origin;
        this.right = right;
        this.left = left;
        this.top = top;
    }

    private _text: string;
    private _planeView: IsometricPlaneView;
    private _fontFamily: string;
    private _fontSize: number;
    private _fontWeight: IsometricTextProps['fontWeight'];
    private _origin: IsometricTextProps['origin'];
    private _right: number;
    private _left: number;
    private _top: number;
    private _originHash = {
        [ORIGIN.CENTER]: 'middle',
        [ORIGIN.LEFT]: 'start',
        [ORIGIN.RIGHT]: 'end',
        [ORIGIN.TOP]: 'hanging',
        [ORIGIN.BOTTOM]: 'baseline'
    };

    private getTransformPosition = (props: Required<IsometricDraggableProps>): IsometricPoint => {
        return getPointFromIsometricPoint(
            this.data.centerX,
            this.data.centerY,
            {
                r: props.right,
                l: props.left,
                t: props.top
            },
            this.data.scale
        );
    };

    protected getSVGAnimationElement(): SVG_ELEMENTS {
        return SVG_ELEMENTS.animateTransform;
    }

    protected getSVGProperty(): string {
        return 'transform';
    }

    protected getAnimationProps(animation: SVGAnimationObject): Record<string, string> {

        const props = {
            right: this.right,
            left: this.left,
            top: this.top
        };

        if (Object.prototype.hasOwnProperty.call(props, animation.property)) {

            const property = animation.property as SVGPositionableProperties;
            const commonProps = {
                type: 'translate',
                additive: 'sum'
            };

            if (animation.values) {

                if (Array.isArray(animation.values)) {
                    return {
                        values: animation.values.map((value: string | number): string => {
                            const modifiedArgs = { ...props };
                            modifiedArgs[property] = +value;
                            const coords = this.getTransformPosition(modifiedArgs);
                            return `${coords.x} ${coords.y}`;
                        }).join(';'),
                        ...commonProps
                    };
                } else {
                    const modifiedArgs = { ...props };
                    modifiedArgs[property] = +animation.values;
                    const coords = this.getTransformPosition(modifiedArgs);
                    return {
                        values: `${coords.x} ${coords.y}`,
                        ...commonProps
                    };
                }

            } else {
                const fromArgs = { ...props };
                const toArgs = { ...props };
                fromArgs[property] = +animation.from;
                toArgs[property] = +animation.to;
                const coordsFrom = this.getTransformPosition(fromArgs);
                const coordsTo = this.getTransformPosition(toArgs);
                return {
                    from: `${coordsFrom.x} ${coordsFrom.y}`,
                    to: `${coordsTo.x} ${coordsTo.y}`,
                    ...commonProps
                };
            }

        }

        throw new TypeError(`The property ${animation.property} is not an allowed animation property for the IsometricText class`);

    }

    public update(): this {
        if (elementHasSVGParent(this.element)) {
            const coords = this.getTransformPosition({
                right: this.right,
                left: this.left,
                top: this.top
            });
            const transform = getPatternTransform(coords, this.planeView);
            this.element.textContent = this._text;
            addSVGProperties(this.element, {
                transform
            });
        }
        return this;
    }

    public clear (): this {
        this.text = '';
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
        addSVGProperties(this.element, {
            'font-family': this._fontFamily
        });
    }

    // fontSize
    public get fontSize(): number {
        return this._fontSize;
    }

    public set fontSize(value: number) {
        this._fontSize = value;
        addSVGProperties(this.element, {
            'font-family': `${this._fontSize}px`
        });
    }

    // fontSize
    public get fontWeight(): IsometricTextProps['fontWeight'] {
        return this._fontWeight;
    }

    public set fontWeight(value: IsometricTextProps['fontWeight']) {
        this._fontWeight = value;
        addSVGProperties(this.element, {
            'font-weight': `${this._fontWeight}`
        });
    }

    // origin
    public get origin(): IsometricTextProps['origin'] {
        return this._origin;
    }

    public set origin(value: IsometricTextProps['origin']) {
        this._origin = value;
        const [textAnchor, alignmentBaseline] = this._origin;
        addSVGProperties(this.element, {
            'text-anchor': this._originHash[textAnchor],
            'alignment-baseline': this._originHash[alignmentBaseline]
        });
    }

    public get right(): number {
        return this._right;
    }

    public set right(value: number) {
        if (this._right !== value) {
            this._right = value;
            this.update();
        }
    }

    public get left(): number {
        return this._left;
    }

    public set left(value: number) {
        if (this._left !== value) {
            this._left = value;
            this.update();
        }
    }

    public get top(): number {
        return this._top;
    }

    public set top(value: number) {
        if (this._top !== value) {
            this._top = value;
            this.update();
        }
    }

}