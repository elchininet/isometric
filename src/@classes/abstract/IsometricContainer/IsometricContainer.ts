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

type IsometricChild = IsometricElement | IsometricContainer;

export class IsometricContainer extends IsometricStore {

    public constructor(svgElement: SVG_ELEMENTS) {
        super();
        this._children = [];
        this.listeners = [];
        this.element = document.createElementNS(SVG_NAMESPACE, svgElement);
    }

    protected element: SVGElement;
    protected _children: IsometricChild[];
    protected listeners: Listener[];

    private getChildIndex(child: IsometricChild): number {
        return this._children.indexOf(child);
    }

    private throwChildError() {
        throw new Error('You cannot provide a child that is not a children of the container');
    }

    protected removeSVGChild(child: IsometricChild): void {
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
            this._children.forEach((child: IsometricChild): void => {
                child.data = this.data;
                child.update();
            });
        }
    }

    public get children(): IsometricChild[] {
        return this._children;
    }

    public getElement(): SVGElement {
        return this.element;
    }

    public update(): IsometricContainer {
        this.updateChildren();
        return this;
    }

    public addChild(child: IsometricChild): IsometricContainer {
        child.data = this.data;
        this._children.push(child);
        if (child instanceof IsometricElement) {
            this.insertPattern(child.getPattern());
        }        
        this.element.appendChild(child.getElement());
        child.update();       
        return this;
    }

    public addChildren(...children: IsometricChild[]): IsometricContainer {
        children.forEach((child: IsometricChild) => this.addChild(child));
        return this;
    }

    public removeChild(child: IsometricChild): IsometricContainer {
        const childIndex = this.getChildIndex(child);
        if (childIndex > -1) {
            this._children.splice(childIndex, 1);
            this.removeSVGChild(child);
            return this;
        }
        this.throwChildError();
    }

    public removeChildren(...children: IsometricChild[]): IsometricContainer {
        children.forEach((child: IsometricChild) => {
            const childIndex = this.getChildIndex(child);
            if (childIndex === -1) {
                this.throwChildError();
            }
            this.removeChild(child);
        });
        return this;
    }

    public removeChildByIndex(index: number): IsometricContainer {
        if (index >= 0 && index < this._children.length) {
            const [ child ] = this._children.splice(index, 1);
            this.removeSVGChild(child);
        }
        return this;
    }

    public setChildIndex(child: IsometricChild, index: number): IsometricContainer {
        const childIndex = this.getChildIndex(child);
        if (childIndex > -1) {
            index = Math.min(Math.max(0, index), this._children.length - 1);
            const movedElement = child.getElement();
            const replacedElement = this._children[index].getElement();
            if (this._children[index] !== child) {
                this._children.splice(childIndex, 1);
                this._children.splice(index, 0, child);
                if (childIndex > index) {
                    this.element.insertBefore(movedElement, replacedElement);
                } else {
                    if (replacedElement.nextSibling) {
                        this.element.insertBefore(movedElement, replacedElement.nextSibling);
                    } else {
                        this.element.appendChild(movedElement);
                    }
                }
            }
            return this;
        }        
        this.throwChildError();        
    }

    public bringChildToFront(child: IsometricChild): IsometricContainer {
        const childIndex = this.getChildIndex(child);
        if (childIndex > -1) {
            this.setChildIndex(child, this._children.length - 1);
            return this;
        }
        this.throwChildError();
    }

    public bringChildForward(child: IsometricChild): IsometricContainer {
        const childIndex = this.getChildIndex(child);
        if (childIndex > -1) {
            if (childIndex < this._children.length - 1) {
                this.setChildIndex(child, childIndex + 1);
            }
            return this;
        }
        this.throwChildError();
    }

    public sendChildToBack(child: IsometricChild): IsometricContainer {
        const childIndex = this.getChildIndex(child);
        if (childIndex > -1) {
            this.setChildIndex(child, 0);
            return this;
        }
        this.throwChildError();
    }

    public sendChildBackward(child: IsometricChild): IsometricContainer {
        const childIndex = this.getChildIndex(child);
        if (childIndex > -1) {
            if (childIndex > 0) {
                this.setChildIndex(child, childIndex - 1);
            }
            return this;
        }
        this.throwChildError();
    }

    public clear(): IsometricContainer {
        const children = this._children.splice(0);
        children.forEach((child: IsometricChild): void => {
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