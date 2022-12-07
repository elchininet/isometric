import {
    SVG_NAMESPACE,
    SVG_ELEMENTS,
    SVG_PROPERTIES,
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT,
    Colors
} from '@constants';
import { addSVGProperties } from '@utils/svg';
import { Store } from '@store';
import { IsometricContainerAbstract } from '@classes/abstract/IsometricContainerAbstract';
import { IsometricCanvasProps } from './types';

const defaultProps: IsometricCanvasProps = {
    container: 'body',
    backgroundColor: Colors.white,
    scale: 1,
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH
};

export class IsometricCanvas extends IsometricContainerAbstract {

    // Exclude the next constructor from the coverage reports
    // Check https://github.com/microsoft/TypeScript/issues/13029
    /* istanbul ignore next */
    public constructor(props: IsometricCanvasProps = {}) {
        super(SVG_ELEMENTS.svg);
        this.props = { ...defaultProps, ...props };
        this.isAnimated = true;

        this.data = new Store(
            this.props.width,
            this.props.height,
            this.props.scale
        );

        addSVGProperties(this.element, {
            [SVG_PROPERTIES.viewBox]: `0 0 ${this.data.width} ${this.data.height}`,
            width: `${this.data.width}px`,
            height: `${this.data.height}px`
        });

        this.background = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.rect);

        addSVGProperties(this.background, {
            fill: this.backgroundColor,
            x: '0',
            y: '0',
            width: `${this.data.width}px`,
            height: `${this.data.height}px`
        });

        this.element.appendChild(this.background);

        const containerElement = typeof this.props.container === 'string'
            ? document.querySelector(this.props.container)
            : this.props.container;

        containerElement.appendChild(this.element);

    }

    private props: IsometricCanvasProps;
    private background: SVGRectElement;
    private isAnimated: boolean;

    public getSVGCode(): string {
        return this.element.outerHTML;
    }

    public get backgroundColor(): string {
        return this.props.backgroundColor;
    }

    public set backgroundColor(value: string) {
        this.props.backgroundColor = value;
        addSVGProperties(this.background, { fill: this.backgroundColor });
    }

    public get scale(): number {
        return this.data.scale;
    }

    public set scale(value: number) {
        this.data.scale = value;
        this.update();
    }

    public get height(): number {
        return this.data.height;
    }

    public set height(value: number) {
        this.data.height = value;
        addSVGProperties(this.element, {
            [SVG_PROPERTIES.viewBox]: `0 0 ${this.data.width} ${this.data.height}`,
            height: `${this.data.height}px`
        });
        addSVGProperties(this.background, {
            height: `${this.data.height}px`
        });
        this.update();
    }

    public get width(): number {
        return this.data.width;
    }

    public set width(value: number) {
        this.data.width = value;
        addSVGProperties(this.element, {
            [SVG_PROPERTIES.viewBox]: `0 0 ${this.data.width} ${this.data.height}`,
            width: `${this.data.width}px`
        });
        addSVGProperties(this.background, {
            width: `${this.data.width}px`
        });
        this.update();
    }

    public get animated(): boolean {
        return this.isAnimated;
    }

    public pauseAnimations(): IsometricCanvas {
        const svg = this.element as SVGSVGElement;
        /* istanbul ignore next */ /* jsdom doesn't have SVGSVGElement methods */
        if (typeof svg.pauseAnimations === 'function') {
            svg.pauseAnimations();
        }
        this.isAnimated = false;
        return this;
    }

    public resumeAnimations(): IsometricCanvas {
        const svg = this.element as SVGSVGElement;
        /* istanbul ignore next */ /* jsdom doesn't have SVGSVGElement methods */
        if (typeof svg.unpauseAnimations === 'function') {
            svg.unpauseAnimations();
        }
        this.isAnimated = true;
        return this;
    }

}