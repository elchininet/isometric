import { SVG_NAMESPACE, SVG_ELEMENTS } from '@constants';
import { addSVGProperties, getSVGPath } from '@utils';
import { Graphic, GraphicProps } from '@components/Graphic';
import { Command, CommandPoint } from './types';

export class IsometricPath extends Graphic {

    public constructor(props: GraphicProps) {
        super(props);
        this.commands = [];
        this.pathX = 0;
        this.pathY = 0;
        this.pathScale = 1;
        this.path = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.path);
        addSVGProperties(this.path, {
            fill: this.fillColor,
            stroke: this.strokeColor,
            'fill-opacity': `${this.fillOpacity}`,
            'stroke-dasharray': this.strokeDasharray.join(','),
            'stroke-linecap': this.strokeLinecap,
            'stroke-linejoin': this.strokeLinejoin,
            'stroke-width': `${this.strokeWidth}`
        });
    }

    private commands: CommandPoint[];
    private path: SVGPathElement;
    private pathX: number;
    private pathY: number;
    private pathScale: number;

    private updatePath(): void {
        addSVGProperties(this.path, {
            d: getSVGPath(this.commands, this.pathX, this.pathY, this.pathScale)
        });
    }

    public moveTo(right: number, left: number, top: number): IsometricPath {
        this.commands.push({
            command: Command.move,
            point: { r: right, l: left, t: top }
        });
        this.updatePath();
        return this;
    }

    public lineTo(right: number, left: number, top: number): IsometricPath {
        this.commands.push({
            command: Command.line,
            point: { r: right, l: left, t: top }
        });
        this.updatePath();
        return this;
    }

    public mt(right: number, left: number, top: number): IsometricPath {
        return this.moveTo(right, left, top);
    }

    public lt(right: number, left: number, top: number): IsometricPath {
        return this.lineTo(right, left, top);
    }

    public set x(value: number) {
        this.pathX = value;
        this.updatePath();
    }

    public set y(value: number) {
        this.pathY = value;
        this.updatePath();
    }

    public set scale(value: number) {
        this.pathScale = value;
        this.updatePath();
    }

    public setProps(x: number, y: number, scale: number): void {
        this.pathX = x;
        this.pathY = y;
        this.pathScale = scale;
        this.updatePath();
    }

    public get svgPath(): SVGPathElement {
        return this.path;
    }

}