import { Command, CommandPoint } from './types';
import { StrokeLinecap, StrokeLinejoin, Listener } from '@types';
import { SVG_NAMESPACE, SVG_ELEMENTS } from '@constants';
import { Graphic, GraphicProps } from '@components/Graphic';
import { addSVGProperties, getSVGPath, drawCommands, addEventListenerToElement, removeEventListenerFromElement } from '@utils';
import { GlobalData } from '@global';

export class IsometricPath extends Graphic {

    public constructor(props: GraphicProps = {}) {

        super(props);
        this.commands = [];
        this.path = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.path);
        this.listeners = [];
        
        addSVGProperties(this.path, {
            'fill': this.fillColor,
            'fill-opacity': `${this.fillOpacity}`,
            'stroke': this.strokeColor,
            'stroke-dasharray': this.strokeDashArray.join(' '),
            'stroke-linecap': this.strokeLinecap,
            'stroke-linejoin': this.strokeLinejoin,
            'stroke-opacity': `${this.strokeOpacity}`,
            'stroke-width': `${this.strokeWidth}`
        });

    }

    private commands: CommandPoint[];
    private path: SVGPathElement;
    private listeners: Listener[];

    public getElement(): SVGPathElement {
        return this.path;
    }

    public update(): void {
        if (this.path.parentNode) {
            addSVGProperties(this.path, {
                d: getSVGPath(this.commands, GlobalData.centerX, GlobalData.centerY, GlobalData.scale)
            });
        }
    }

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

    protected setStrokeDashArray(value: number[]): void {        
        super.setStrokeDashArray(value);
        addSVGProperties(this.path, { 'stroke-dasharray': this.strokeDashArray.join(' ') });
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

    public draw(commands: string): IsometricPath {
        return drawCommands(this, commands);     
    }

    public addEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricPath {
        addEventListenerToElement.call(this, this.path, this.listeners, event, callback, useCapture);
        return this;
    }

    public removeEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricPath {
        removeEventListenerFromElement(this.path, this.listeners, event, callback, useCapture);
        return this;
    }

}