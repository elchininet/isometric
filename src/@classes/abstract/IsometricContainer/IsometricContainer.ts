import {
    SVG_NAMESPACE,
    SVG_ELEMENTS
} from '@constants';
import { Listener } from '@types';
import {
    addEventListenerToElement,
    removeEventListenerFromElement
} from '@utils/svg';
import { IsometricStore } from '@classes/abstract/IsometricStore';
import { IsometricElement } from '@classes/abstract/IsometricElement';

export class IsometricContainer extends IsometricStore {

    public constructor(svgElement: SVG_ELEMENTS) {
        super();
        this.children = [];
        this.listeners = [];
        this.container = document.createElementNS(SVG_NAMESPACE, svgElement);
    }

    protected children: IsometricElement[];
    protected container: SVGElement;
    protected listeners: Listener[];

    protected removeSVGChild(child: IsometricElement): void {
        const svgChild = child.getElement();
        const svgPatternChild = child.getPattern();
        if (svgPatternChild && svgPatternChild.parentNode) {
            this.container.removeChild(svgPatternChild);
        }
        if (svgChild.parentNode) {
            this.container.removeChild(svgChild);
        }
    }

    protected insertPattern(pattern?: SVGPatternElement) {
        if (pattern) {
            this.container.insertBefore(pattern, this.container.firstChild);
        }
    }

    protected updateChildren(): void {
        this.children.forEach((child: IsometricElement): void => {
            child.update();
        });
    }

    public getElement(): SVGElement {
        return this.container;
    }

    public addChild(child: IsometricElement): IsometricContainer {
        child.data = this.data;
        this.children.push(child);
        this.insertPattern(child.getPattern());
        this.container.appendChild(child.getElement());
        child.update();
        return this;
    }

    public addChildren(...children: IsometricElement[]): IsometricContainer {
        children.forEach((child: IsometricElement) => this.addChild(child));
        return this;
    }

    public removeChild(child: IsometricElement): IsometricContainer {
        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
            this.removeSVGChild(child);
        }
        return this;
    }

    public removeChildren(...children: IsometricElement[]): IsometricContainer {
        children.forEach((child: IsometricElement) => this.removeChild(child));
        return this;
    }

    public removeChildByIndex(index: number): IsometricContainer {
        if (index >= 0 && index < this.children.length) {
            const [ child ] = this.children.splice(index, 1);
            this.removeSVGChild(child);
        }
        return this;
    }

    public clear(): IsometricContainer {
        const children = this.children.splice(0);
        children.forEach((child: IsometricElement): void => {
            this.removeSVGChild(child);
        });
        return this;
    }

    public addEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricContainer {
        addEventListenerToElement.call(this, this.container, this.listeners, event, callback, useCapture);
        return this;
    }

    public removeEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricContainer {
        removeEventListenerFromElement(this.container, this.listeners, event, callback, useCapture);
        return this;
    }

}