import { Listener } from '@types';
import {
    SVG_NAMESPACE,
    SVG_ELEMENTS
} from '@constants';
import { IsometricStore } from '@classes/abstract/IsometricStore';
import {
    addEventListenerToElement,
    removeEventListenerFromElement
} from '@utils/svg';

export abstract class IsometricElement extends IsometricStore {

    public constructor(svgElement: SVG_ELEMENTS) {

        super();
        
        this.listeners = [];
        this.element = document.createElementNS(SVG_NAMESPACE, svgElement);

    }
       
    protected element: SVGElement;
    protected listeners: Listener[];

    public abstract update(): IsometricElement;
    public abstract clear(): IsometricElement;

    public getElement(): SVGElement {
        return this.element;
    }

    public addEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricElement {
        addEventListenerToElement.call(this, this.element, this.listeners, event, callback, useCapture);
        return this;
    }

    public removeEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricElement {
        removeEventListenerFromElement(this.element, this.listeners, event, callback, useCapture);
        return this;
    }

}