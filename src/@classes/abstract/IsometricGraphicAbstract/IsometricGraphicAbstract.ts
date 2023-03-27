import {
    Colors,
    LineCap,
    LineJoin,
    DECIMALS,
    SVG_NAMESPACE,
    SVG_ELEMENTS
} from '@constants';
import {
    IsometricPoint,
    IsometricPlaneView,
    StrokeLinecap,
    StrokeLinejoin,
    SVGAnimation,
    SVGAnimationObject,
    Texture
} from '@types';
import {
    addSVGProperties,
    getSVGProperty,
    getPatternTransform,
    isSVGProperty
} from '@utils/svg';
import { uuid, round, getPointFromIsometricPoint } from '@utils/math';
import { IsometricElementAbstract } from '../IsometricElementAbstract';
import { IsometricGraphicProps } from './types';

const defaultObjectProps: IsometricGraphicProps = {
    fillColor: Colors.white,
    fillOpacity: 1,
    strokeColor: Colors.black,
    strokeDashArray: [],
    strokeLinecap: LineCap.butt,
    strokeLinejoin: LineJoin.round,
    strokeOpacity: 1,
    strokeWidth: 1
};

export abstract class IsometricGraphicAbstract extends IsometricElementAbstract {

    // Exclude the next constructor from the coverage reports
    // Check https://github.com/microsoft/TypeScript/issues/13029
    /* istanbul ignore next */
    public constructor(props: IsometricGraphicProps, svgElement: SVG_ELEMENTS) {

        super(svgElement);

        this.props = {...defaultObjectProps, ...props};
        this.animations = [];

        if (this.props.texture) {
            this.createTexture(this.props.texture);
        }

        addSVGProperties(this.element, {
            'fill': this.props.texture
                ? `url(#${this.patternId}) ${this.fillColor}`
                : this.fillColor,
            'fill-opacity': `${this.fillOpacity}`,
            'stroke': this.strokeColor,
            'stroke-dasharray': this.strokeDashArray.join(' '),
            'stroke-linecap': this.strokeLinecap,
            'stroke-linejoin': this.strokeLinejoin,
            'stroke-opacity': `${this.strokeOpacity}`,
            'stroke-width': `${this.strokeWidth}`
        });

    }

    private createTexture(texture: Texture) {

        this.patternId = uuid();

        this.pattern = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.pattern);

        addSVGProperties(this.pattern, {
            'id': this.patternId,
            'preserveAspectRatio': 'none',
            'patternUnits': 'userSpaceOnUse'
        });

        const image = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.image);

        addSVGProperties(image, {
            'href': texture.url,
            'x': '0',
            'y': '0',
            'preserveAspectRatio': 'none'
        });

        if (texture.pixelated) {
            addSVGProperties(image, {
                'style': 'image-rendering: pixelated'
            });
        }
        this.pattern.appendChild(image);
    }

    private _updateTexture() {
        const image = this.pattern.firstChild as SVGImageElement;
        if (
            this.props.texture.url &&
            image.getAttribute('href') !== this.props.texture.url
        ) {
            addSVGProperties(image, {
                'href': this.props.texture.url
            });
        }
        if (this.props.texture.pixelated) {
            addSVGProperties(image, {
                'style': 'image-rendering: pixelated'
            });
        } else {
            image.removeAttribute('style');
        }
        this.update();
    }

    protected props: IsometricGraphicProps;

    protected patternId: string;
    protected pattern: SVGPatternElement;
    protected animations: SVGAnimationObject[];
    protected abstract updateSubClassAnimations(): void;

    protected addAnimationBasicProperties(attributeName: string, animation: SVGAnimationObject): void {
        addSVGProperties(animation.element, {
            repeatCount: `${animation.repeat || 'indefinite'}`,
            attributeName,
            dur: `${animation.duration || 1}s`
        });
    }

    protected updateAnimations(): void {

        this.animations.forEach((animation: SVGAnimationObject): void => {

            const isNativeSVGProperty = isSVGProperty(animation.property);

            if (isNativeSVGProperty) {

                const property = getSVGProperty(animation.property);

                if (!animation.element) {
                    animation.element = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.animate) as SVGAnimateElement;
                }

                if (!animation.element.parentNode) {
                    this.element.appendChild(animation.element);
                }

                this.addAnimationBasicProperties(property, animation);

                if (animation.values) {
                    addSVGProperties(
                        animation.element,
                        {
                            values: Array.isArray(animation.values)
                                ? animation.values.map((value: string | number): string => `${value}`).join(';')
                                : `${animation.values}`
                        }
                    );
                } else {
                    addSVGProperties(
                        animation.element, {
                            from: `${animation.from}`,
                            to: `${animation.to}`
                        }
                    );
                }

            }
        });

        this.updateSubClassAnimations();

    }

    protected updatePatternTransform(
        corner: IsometricPoint,
        planeView?: IsometricPlaneView
    ) {
        if (this.props.texture) {
            const height = this.props.texture.height
                ? `${this.props.texture.height * this.data.scale}`
                : '100%';
            const width = this.props.texture.width
                ? `${this.props.texture.width * this.data.scale}`
                : '100%';
            const shift = getPointFromIsometricPoint(
                0,
                0,
                {
                    r: this.props.texture.shift?.right || 0,
                    l: this.props.texture.shift?.left || 0,
                    t: this.props.texture.shift?.top || 0
                },
                this.data.scale
            );
            const transform = getPatternTransform(
                {
                    x: round(corner.x + shift.x, DECIMALS),
                    y: round(corner.y + shift.y, DECIMALS)
                },
                this.props.texture.planeView || planeView,
                this.props.texture.scale,
                this.props.texture.rotation
            );
            addSVGProperties(
                this.pattern,
                {
                    'patternTransform': transform,
                    'height': height,
                    'width': width
                }
            );
            addSVGProperties(
                this.pattern.firstChild as SVGImageElement,
                {
                    'height': height,
                    'width': width
                }
            );
        }
    }

    // fillColor
    public get fillColor(): string {
        return this.props.fillColor;
    }

    public set fillColor(value: string) {
        this.props.fillColor = value;
        addSVGProperties(this.element, {
            'fill': this.props.texture
                ? `url(#${this.patternId}) ${this.fillColor}`
                : this.fillColor
        });
    }

    // fillOpacity
    public get fillOpacity(): number {
        return this.props.fillOpacity;
    }

    public set fillOpacity(value: number) {
        this.props.fillOpacity = value;
        addSVGProperties(this.element, { 'fill-opacity': `${this.fillOpacity}` });
    }

    // texture
    public set texture(value: Texture) {
        const hasTexture = !!this.props.texture;
        this.props.texture = value;
        if (hasTexture) {
            this._updateTexture();
        } else {
            this.createTexture(this.props.texture);
            this.update();
        }
    }

    public get texture(): Texture {
        return this.props.texture;
    }

    // strokeColor
    public get strokeColor(): string {
        return this.props.strokeColor;
    }

    public set strokeColor(value: string) {
        this.props.strokeColor = value;
        addSVGProperties(this.element, { 'stroke': this.strokeColor });
    }

    // strokeDashArray
    public get strokeDashArray(): number[] {
        return this.props.strokeDashArray;
    }

    public set strokeDashArray(value: number[]) {
        this.props.strokeDashArray = value;
        addSVGProperties(this.element, { 'stroke-dasharray': this.strokeDashArray.join(' ') });
    }

    // strokeLinecap
    public get strokeLinecap(): StrokeLinecap {
        return this.props.strokeLinecap;
    }

    public set strokeLinecap(value: StrokeLinecap) {
        this.props.strokeLinecap = LineCap[value];
        addSVGProperties(this.element, { 'stroke-linecap': this.strokeLinecap });
    }

    // strokeLinejoin
    public get strokeLinejoin(): StrokeLinejoin {
        return this.props.strokeLinejoin;
    }

    public set strokeLinejoin(value: StrokeLinejoin) {
        this.props.strokeLinejoin = LineJoin[value];
        addSVGProperties(this.element, { 'stroke-linejoin': this.strokeLinejoin });
    }

    // strokeOpacity
    public get strokeOpacity(): number {
        return this.props.strokeOpacity;
    }

    public set strokeOpacity(value: number) {
        this.props.strokeOpacity = value;
        addSVGProperties(this.element, { 'stroke-opacity': `${this.strokeOpacity}` });
    }

    // strokeWidth
    public get strokeWidth(): number {
        return this.props.strokeWidth;
    }

    public set strokeWidth(value: number) {
        this.props.strokeWidth = value;
        addSVGProperties(this.element, { 'stroke-width': `${this.strokeWidth}` });
    }

    public getPattern(): SVGPatternElement | undefined {
        return this.pattern;
    }

    public updateTexture(value: Partial<Texture>): this {
        const hasTexture = !!this.props.texture;
        if (hasTexture || value.url) {
            const { shift, rotation, ...newProps } = value;
            this.props.texture = hasTexture
                ? {
                    ...this.props.texture,
                    ...newProps
                }
                : { ...newProps } as Texture;
            if (shift) {
                this.props.texture.shift = {
                    ...(this.props.texture.shift || {}),
                    ...shift
                };
            }
            if (rotation) {
                this.props.texture.rotation = rotation;
            }
            if (hasTexture) {
                this._updateTexture();
            } else {
                this.createTexture(this.props.texture);
                this.update();
            }
        }
        return this;
    }

    public addAnimation(animation: SVGAnimation): this {
        this.animations.push({ ...animation });
        this.update();
        return this;
    }

    public removeAnimationByIndex(index: number): this {

        if (index >= 0 && index < this.animations.length) {

            const animation = this.animations.splice(index, 1)[0];

            if (animation.element && animation.element.parentNode) {
                animation.element.parentNode.removeChild(animation.element);
            }

        }

        return this;

    }

    public removeAnimations(): this {

        const animations = this.animations.splice(0);

        animations.forEach((animation: SVGAnimationObject): void => {
            if (animation.element && animation.element.parentNode) {
                animation.element.parentNode.removeChild(animation.element);
            }
        });

        return this;
    }

}