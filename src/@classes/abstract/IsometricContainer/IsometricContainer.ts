import {
    SVG_NAMESPACE,
    SVG_ELEMENTS
} from '@constants';
import { Listener } from '@types';
import {
    addEventListenerToElement,
    removeEventListenerFromElement,
    elementHasSVGParent
} from '@utils/svg';
import { IsometricStore } from '@classes/abstract/IsometricStore';
import { IsometricElement } from '@classes/abstract/IsometricElement';

type IsometricChildren = IsometricElement | IsometricContainer;

export class IsometricContainer extends IsometricStore {

    public constructor(svgElement: SVG_ELEMENTS) {
        super();
        this._children = [];
        this.listeners = [];
        this.element = document.createElementNS(SVG_NAMESPACE, svgElement);
    }

    protected element: SVGElement;
    protected _children: IsometricChildren[];
    protected listeners: Listener[];

    protected removeSVGChild(child: IsometricChildren): void {
        const svgChild = child.getElement();
        if (child instanceof IsometricElement) {
            const svgPatternChild = child.getPattern();
            if (svgPatternChild && svgPatternChild.parentNode) {
                this.element.removeChild(svgPatternChild);
            }
        }
        if (svgChild.parentNode) {
            this.element.removeChild(svgChild);
        }
    }

    protected insertPattern(pattern?: SVGPatternElement) {
        if (pattern) {
            this.element.insertBefore(pattern, this.element.firstChild);
        }
    }

    protected updateChildren(): void {
        if (elementHasSVGParent(this.element)) {
            this._children.forEach((child: IsometricChildren): void => {
                child.data = this.data;
                child.update();
            });
        }
    }

    public get children(): IsometricChildren[] {
        return this._children;
    }

    public getElement(): SVGElement {
        return this.element;
    }

    public update(): IsometricContainer {
        this.updateChildren();
        return this;
    }

    public addChild(child: IsometricChildren): IsometricContainer {
        child.data = this.data;
        this._children.push(child);
        if (child instanceof IsometricElement) {
            this.insertPattern(child.getPattern());
        }        
        this.element.appendChild(child.getElement());
        child.update();       
        return this;
    }

    public addChildren(...children: IsometricChildren[]): IsometricContainer {
        children.forEach((child: IsometricChildren) => this.addChild(child));
        return this;
    }

    public removeChild(child: IsometricChildren): IsometricContainer {
        const index = this._children.indexOf(child);
        if (index >= 0) {
            this._children.splice(index, 1);
            this.removeSVGChild(child);
        }
        return this;
    }

    public removeChildren(...children: IsometricChildren[]): IsometricContainer {
        children.forEach((child: IsometricChildren) => this.removeChild(child));
        return this;
    }

    public removeChildByIndex(index: number): IsometricContainer {
        if (index >= 0 && index < this._children.length) {
            const [ child ] = this._children.splice(index, 1);
            this.removeSVGChild(child);
        }
        return this;
    }

    public clear(): IsometricContainer {
        const children = this._children.splice(0);
        children.forEach((child: IsometricChildren): void => {
            this.removeSVGChild(child);
        });
        return this;
    }

    public addEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricContainer {
        addEventListenerToElement.call(this, this.element, this.listeners, event, callback, useCapture);
        return this;
    }

    public removeEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricContainer {
        removeEventListenerFromElement(this.element, this.listeners, event, callback, useCapture);
        return this;
    }

}