import { Command, CommandPoint } from './types';
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
    private commandsReg = /(M|L)\s*(\d+\.?\d*|\.\d+)\s*,\s*(\d+\.?\d*|\.\d+)\s*,\s*(\d+\.?\d*|\.\d+)/g;

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