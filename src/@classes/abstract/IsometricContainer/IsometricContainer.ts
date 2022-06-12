import { SVG_ELEMENTS } from '@constants';
import { elementHasSVGParent } from '@utils/svg';
import { IsometricElement } from '@classes/abstract/IsometricElement';
import { IsometricGraphic } from '@classes/abstract/IsometricGraphic';

export class IsometricContainer extends IsometricElement {

    // Exclude the next constructor from the coverage reports
    // Check https://github.com/microsoft/TypeScript/issues/13029
    /* istanbul ignore next */
    public constructor(svgElement: SVG_ELEMENTS) {
        super(svgElement);
        this._children = [];
    }
    
    protected _children: IsometricElement[];

    private getChildIndex(child: IsometricElement): number {
        return this._children.indexOf(child);
    }

    private throwChildError() {
        throw new Error('You cannot provide a child that is not a children of the container');
    }

    protected removeSVGChild(child: IsometricElement): void {
        const svgChild = child.getElement();
        if (child instanceof IsometricGraphic) {
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
            this._children.forEach((child: IsometricElement): void => {
                child.data = this.data;
                child.update();
            });
        }
    }

    public get children(): IsometricElement[] {
        return this._children;
    }

    public update(): this {
        this.updateChildren();
        return this;
    }

    public clear(): this {
        const children = this._children.splice(0);
        children.forEach((child: IsometricElement): void => {
            this.removeSVGChild(child);
        });
        return this;
    }

    public addChild(child: IsometricElement): this {
        child.data = this.data;
        this._children.push(child);
        if (child instanceof IsometricGraphic) {
            this.insertPattern(child.getPattern());
        }        
        this.element.appendChild(child.getElement());
        child.update();       
        return this;
    }

    public addChildren(...children: IsometricElement[]): this {
        children.forEach((child: IsometricElement) => this.addChild(child));
        return this;
    }

    public removeChild(child: IsometricElement): this {
        const childIndex = this.getChildIndex(child);
        if (childIndex > -1) {
            this._children.splice(childIndex, 1);
            this.removeSVGChild(child);
            return this;
        }
        this.throwChildError();
    }

    public removeChildren(...children: IsometricElement[]): this {
        children.forEach((child: IsometricElement) => {
            const childIndex = this.getChildIndex(child);
            if (childIndex === -1) {
                this.throwChildError();
            }
            this.removeChild(child);
        });
        return this;
    }

    public removeChildByIndex(index: number): this {
        if (index >= 0 && index < this._children.length) {
            const [ child ] = this._children.splice(index, 1);
            this.removeSVGChild(child);
        }
        return this;
    }

    public setChildIndex(child: IsometricElement, index: number): this {
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

    public bringChildToFront(child: IsometricElement): this {
        const childIndex = this.getChildIndex(child);
        if (childIndex > -1) {
            this.setChildIndex(child, this._children.length - 1);
            return this;
        }
        this.throwChildError();
    }

    public bringChildForward(child: IsometricElement): this {
        const childIndex = this.getChildIndex(child);
        if (childIndex > -1) {
            if (childIndex < this._children.length - 1) {
                this.setChildIndex(child, childIndex + 1);
            }
            return this;
        }
        this.throwChildError();
    }

    public sendChildToBack(child: IsometricElement): this {
        const childIndex = this.getChildIndex(child);
        if (childIndex > -1) {
            this.setChildIndex(child, 0);
            return this;
        }
        this.throwChildError();
    }

    public sendChildBackward(child: IsometricElement): this {
        const childIndex = this.getChildIndex(child);
        if (childIndex > -1) {
            if (childIndex > 0) {
                this.setChildIndex(child, childIndex - 1);
            }
            return this;
        }
        this.throwChildError();
    }

}