import { SVG_NAMESPACE, SVG_ELEMENTS, SVG_PROPERTIES, DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@constants';
import { Colors } from '@types';
import { Graphic } from '@components/Graphic';
import { IsometricCanvasProps } from './types';
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

    public constructor(container: HTMLElement, props: IsometricCanvasProps = {}) {
        this.props = { ...defaultProps, ...props };
        this.children = [];
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
    private children: Graphic[];
    private svg: SVGElement;
    private background: SVGRectElement;

    private removeSVGChild(child: Graphic): void {
        const svgChild = child.getElement();
        if (svgChild.parentNode) {
            this.svg.removeChild(svgChild);
        }
    }

    private updateChildren(): void {
        this.children.forEach((child: Graphic): void => {
            child.update();
        });
    }

    public getElement(): SVGElement {
        return this.svg;
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
        this.updateChildren();
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
        this.updateChildren();
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
        this.updateChildren();
    }

    public addChild(child: Graphic): IsometricCanvas {
        this.children.push(child);
        this.svg.appendChild(child.getElement());
        child.update();
        return this;
    }

    public addChildren(...children: Graphic[]): IsometricCanvas {
        children.forEach((child: Graphic) => this.addChild(child));
        return this;
    }

    public removeChild(child: Graphic): IsometricCanvas {
        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
            this.removeSVGChild(child);
        }
        return this;
    }

    public removeChildren(...children: Graphic[]): IsometricCanvas {
        children.forEach((child: Graphic) => this.removeChild(child));
        return this;
    }

    public removeChildByIndex(index: number): IsometricCanvas {
        if (index >= 0 && index < this.children.length) {
            const [ child ] = this.children.splice(index, 1);
            this.removeSVGChild(child);
        }
        return this;
    }

    public clear(): IsometricCanvas {
        const children = this.children.splice(0);
        children.forEach((child: Graphic): void => {
            this.removeSVGChild(child);
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