import { SVG_NAMESPACE, SVG_ELEMENTS, SVG_PROPERTIES } from '@constants';
import { Colors } from '@types';
import { IsometricCanvasProps } from './types';
import { IsometricPath } from '@components/IsometricPath';
import { addSVGProperties } from '@utils';

const defaultProps: IsometricCanvasProps = {
    devMode: false,
    backgroundColor: Colors.white,
    scale: 1,
    height: 480,
    width: 640
};

export class IsometricCanvas {

    public constructor(container: Node, props: IsometricCanvasProps = {}) {
        this.props = { ...defaultProps, ...props };

        this.centerY = this.height / 2;
        this.centerX = this.width / 2;
        this.paths = [];

        this.svg = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.svg);

        addSVGProperties(this.svg, {
            [SVG_PROPERTIES.viewBox]: `0 0 ${this.width} ${this.height}`,
            width: `${this.width}px`,
            height: `${this.height}px`
        });

        const background = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.rect);

        addSVGProperties(background, {
            fill: this.backgroundColor,
            x: '0',
            y: '0',
            width: `${this.width}px`,
            height: `${this.height}px`
        });

        this.svg.appendChild(background);
        container.appendChild(this.svg);
    }
    
    private props: IsometricCanvasProps;
    private centerX: number;
    private centerY: number;
    private paths: IsometricPath[];
    private svg: SVGElement;

    public get backgroundColor(): string {
        return this.props.backgroundColor;
    }

    public get scale(): number {
        return this.props.scale;
    }

    public get height(): number {
        return this.props.height;
    }

    public get width(): number {
        return this.props.width;
    }

    public addPath(path: IsometricPath): IsometricCanvas {
        path.setProps(this.centerX, this.centerY, this.scale);
        this.paths.push(path);
        this.svg.appendChild(path.svgPath);
        return this;
    }

    public addPaths(...paths: IsometricPath[]): IsometricCanvas {
        paths.forEach((p: IsometricPath) => this.addPath(p));
        return this;
    }

}