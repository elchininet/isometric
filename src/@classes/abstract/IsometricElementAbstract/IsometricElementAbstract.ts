import {
    Listener,
    AddEventListenerCallback
} from '@types';
import {
    SVG_NAMESPACE,
    SVG_ELEMENTS
} from '@constants';
import { IsometricStore } from '@classes/abstract/IsometricStore';
import {
    addSVGProperties,
    addEventListenerToElement,
    removeEventListenerFromElement
} from '@utils/svg';

export abstract class IsometricElementAbstract extends IsometricStore {

    public constructor(id: string, svgElement: SVG_ELEMENTS) {

        super();

        this._id = id;
        this.listeners = [];
        this.element = document.createElementNS(SVG_NAMESPACE, svgElement);
        addSVGProperties(this.element, {
            'id': this._id
        });

    }

    protected _id: string;
    protected element: SVGElement;
    protected listeners: Listener[];

    protected setId(value: string): void {
        this._id = value;
        addSVGProperties(this.element, {
            'id': this._id
        });
    }

    // id
    public abstract get id(): string;
    public abstract set id(value: string);

    public abstract update(): this;
    public abstract clear(): this;

    public getElement(): SVGElement {
        return this.element;
    }

    public addEventListener(event: string, callback: AddEventListenerCallback, useCapture = false): this {
        addEventListenerToElement.call(this, this.element, this.listeners, event, callback, useCapture);
        return this;
    }

    public removeEventListener(event: string, callback: AddEventListenerCallback, useCapture = false): this {
        removeEventListenerFromElement(this.element, this.listeners, event, callback, useCapture);
        return this;
    }

}