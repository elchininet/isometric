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

        GlobalData.setSizes( this.props.width, this.props.height );
        GlobalData.scale = this.props.scale;

        addSVGProperties(this.svg, {
            [SVG_PROPERTIES.viewBox]: `0 0 ${GlobalData.width} ${GlobalData.height}`,
            width: `${GlobalData.width}px`,
            height: `${GlobalData.height}px`
        });

        this.background = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.rect);

        addSVGProperties(this.background, {
            fill: this.backgroundColor,
            x: '0',
            y: '0',
            width: `${GlobalData.width}px`,
            height: `${GlobalData.height}px`
        });

        this.svg.appendChild(this.background);
        container.appendChild(this.svg);

    }
    
    private props: IsometricCanvasProps;
    private paths: IsometricPath[];
    private svg: SVGElement;
    private background: SVGRectElement;

    private removeSVGChild(path: IsometricPath): void {
        const svgPath = path.getPath();
        if (svgPath.parentNode) {
            this.svg.removeChild(svgPath);
        }
    }

    private updatePaths(): void {
        this.paths.forEach((path: IsometricPath): void => {
            path.update();
        });
    }

    public get backgroundColor(): string {
        return this.props.backgroundColor;
    }

    public set backgroundColor(value: string) {
        this.props.backgroundColor = value;
        addSVGProperties(this.background, { fill: this.backgroundColor });
    }

    public get scale(): number {
        return GlobalData.scale;
    }

    public set scale(value: number) {
        GlobalData.scale = value;
        this.updatePaths();
    }

    public get height(): number {
        return GlobalData.height;
    }

    public set height(value: number) {
        GlobalData.height = value;
        addSVGProperties(this.svg, {
            [SVG_PROPERTIES.viewBox]: `0 0 ${GlobalData.width} ${GlobalData.height}`,
            height: `${GlobalData.height}px`
        });
        addSVGProperties(this.background, {
            height: `${GlobalData.height}px`
        });
        this.updatePaths();
    }

    public get width(): number {
        return this.props.width;
    }

    public set width(value: number) {
        GlobalData.width = value;
        addSVGProperties(this.svg, {
            [SVG_PROPERTIES.viewBox]: `0 0 ${GlobalData.width} ${GlobalData.height}`,
            width: `${GlobalData.width}px`
        });
        addSVGProperties(this.background, {
            width: `${GlobalData.width}px`
        });
        this.updatePaths();
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

    public removePath(path: IsometricPath): IsometricCanvas {
        const index = this.paths.indexOf(path);
        if (index >= 0) {
            this.paths.splice(index, 1);
            this.removeSVGChild(path);
        }
        return this;
    }

    public removePathByIndex(index: number): IsometricCanvas {
        if (index >= 0 && index < this.paths.length) {
            const [ path ] = this.paths.splice(index, 1);
            this.removeSVGChild(path);
        }
        return this;
    }

    public clear(): IsometricCanvas {
        const paths = this.paths.splice(0);
        paths.forEach((path: IsometricPath): void => {
            this.removeSVGChild(path);
        });
        return this;
    }

    public addEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricCanvas {
        this.svg.addEventListener(event, callback, useCapture);
        return this;
    }

    public removeEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricCanvas {
        this.svg.removeEventListener(event, callback, useCapture);
        return this;
    }

}