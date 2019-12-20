import { SVG_NAMESPACE, SVG_ELEMENTS, SVG_PROPERTIES, DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@constants';
import { Colors } from '@types';
import { IsometricCanvasProps } from './types';
import { IsometricPath } from '@components/IsometricPath';
import { addSVGProperties } from '@utils';
import { GlobalData } from '@global';

const defaultProps: IsometricCanvasProps = {
    devMode: false,
    backgroundColor: Colors.white,
    scale: 1,
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH
};

export class IsometricCanvas {

    public constructor(container: Node, props: IsometricCanvasProps = {}) {
        this.props = { ...defaultProps, ...props };
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

        GlobalData.setSizes( this.props.width, this.props.height );
        GlobalData.scale = this.props.scale;

    }
    
    private props: IsometricCanvasProps;
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
        this.paths.push(path);
        this.svg.appendChild(path.getPath());
        path.update();
        return this;
    }

    public addPaths(...paths: IsometricPath[]): IsometricCanvas {
        paths.forEach((p: IsometricPath) => this.addPath(p));
        return this;
    }

}