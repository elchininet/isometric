import { StrokeLinecap, StrokeLinejoin, Listener } from '@types';
import { SVG_NAMESPACE, SVG_ELEMENTS } from '@constants';
import { Graphic, GraphicProps } from '@classes/abstract/Graphic';
import { addSVGProperties, addEventListenerToElement, removeEventListenerFromElement } from '@utils';

export abstract class IsometricGraphic extends Graphic {

    public constructor(props: GraphicProps) {

        super(props);
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

    abstract update(): IsometricGraphic;
    abstract clear(): IsometricGraphic;
    
    protected path: SVGPathElement;
    protected listeners: Listener[];

    public getElement(): SVGPathElement {
        return this.path;
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

    public addEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricGraphic {
        addEventListenerToElement.call(this, this.path, this.listeners, event, callback, useCapture);
        return this;
    }

    public removeEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricGraphic {
        removeEventListenerFromElement(this.path, this.listeners, event, callback, useCapture);
        return this;
    }

}