import { Command, CommandPoint } from './types';
import { LineCap, LineJoin, StrokeLinecap, StrokeLinejoin } from '@types';
import { SVG_NAMESPACE, SVG_ELEMENTS } from '@constants';
import { Graphic, GraphicProps } from '@components/Graphic';
import { addSVGProperties, getSVGPath } from '@utils';
import { GlobalData } from '@global';

export class IsometricPath extends Graphic {

    public constructor(props: GraphicProps) {

        super(props);
        this.commands = [];
        this.path = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.path);
        
        addSVGProperties(this.path, {
            'fill': this.fillColor,
            'fill-opacity': `${this.fillOpacity}`,
            'stroke': this.strokeColor,
            'stroke-dasharray': this.strokeDasharray.join(','),
            'stroke-linecap': this.strokeLinecap,
            'stroke-linejoin': this.strokeLinejoin,
            'stroke-opacity': `${this.strokeOpacity}`,
            'stroke-width': `${this.strokeWidth}`
        });

    }

    private commands: CommandPoint[];
    private path: SVGPathElement;
    private commandsReg = /(M|L)\s*(\d+\.?\d*|\.\d+)\s*,\s*(\d+\.?\d*|\.\d+)\s*,\s*(\d+\.?\d*|\.\d+)/g;

    protected setFillColor(value: string): void {
        super.setFillColor(value);
        addSVGProperties(this.path, { 'fill': this.fillColor });
    }

    protected setFillOpacity(value: number): void {
        super.setFillOpacity(value);
        addSVGProperties(this.path, { 'fill-opacity': `${this.fillOpacity}` });
    }

    protected setStrokeColor(value: string): void {
        super.setStrokeColor(value);
        addSVGProperties(this.path, { 'stroke': this.strokeColor });
    }

    protected setStrokeDasharray(value: number[]): void {
        super.setStrokeDashArray(value);
        addSVGProperties(this.path, { 'stroke-dasharray': this.strokeDasharray.join(',') });
    }

    protected setStrokeLinecap(value: StrokeLinecap): void {
        super.setStrokeLinecap(value);
        addSVGProperties(this.path, { 'stroke-linecap': this.strokeLinecap });
    }

    protected setStrokeLinejoin(value: StrokeLinejoin): void {
        super.setStrokeLinejoin(value);
        addSVGProperties(this.path, { 'stroke-linejoin': this.strokeLinejoin });
    }

    protected setStrokeOpacity(value: number): void {
        super.setStrokeOpacity(value);
        addSVGProperties(this.path, { 'stroke-opacity': `${this.strokeOpacity}` });
    }

    protected setStrokeWidth(value: number): void {
        super.setStrokeWidth(value);
        addSVGProperties(this.path, { 'stroke-width': `${this.strokeWidth}` });
    }

    public update(): void {
        if (this.path.parentNode) {
            addSVGProperties(this.path, {
                d: getSVGPath(this.commands, GlobalData.centerX, GlobalData.centerY, GlobalData.scale)
            });
        }
    }

    public getPath(): SVGPathElement {
        return this.path;
    }

    public moveTo(right: number, left: number, top: number): IsometricPath {
        this.commands.push({
            command: Command.move,
            point: { r: right, l: left, t: top }
        });        
        this.update();
        return this;
    }

    public lineTo(right: number, left: number, top: number): IsometricPath {
        this.commands.push({
            command: Command.line,
            point: { r: right, l: left, t: top }
        });       
        this.update();
        return this;
    }

    public mt(right: number, left: number, top: number): IsometricPath {
        return this.moveTo(right, left, top);
    }

    public lt(right: number, left: number, top: number): IsometricPath {
        return this.lineTo(right, left, top);
    }

    public draw(commands: string): void {
        let array;
        while ((array = this.commandsReg.exec(commands)) !== null) {
            switch(array[1]) {
                case 'M':
                    this.moveTo(+array[2], +array[3], +array[4]);
                    break;
                case 'L':
                    this.lineTo(+array[2], +array[3], +array[4]);
                    break;
            }
        }
        
    }

}