import { Command, CommandPoint } from './types';
import { GraphicProps } from '@classes/abstract/Graphic';
import { IsometricGraphic } from '@classes/abstract/IsometricGraphic';
import { addSVGProperties, getSVGPath, drawCommands } from '@utils';
import { GlobalData } from '@global';

export class IsometricPath extends IsometricGraphic {

    public constructor(props: GraphicProps = {}) {
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        super(props)/* istanbul ignore next */;
        this.commands = [];
    }

    private commands: CommandPoint[];

    public update(): IsometricPath {
        if (this.path.parentNode) {
            addSVGProperties(this.path, {
                d: getSVGPath(this.commands, GlobalData.centerX, GlobalData.centerY, GlobalData.scale)
            });
        }
        return this;
    }

    public clear(): IsometricPath {
        this.commands.splice(0);
        addSVGProperties(this.path, {
            d: ''
        });
        return this;
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

    public curveTo(
        controlRight: number,
        controlLeft: number,
        controlTop: number,
        right: number,
        left: number,
        top: number
    ): IsometricPath {
        this.commands.push({
            command: Command.curve,
            control: { r: controlRight, l: controlLeft, t: controlTop },
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
    public ct(
        controlRight: number,
        controlLeft: number,
        controlTop: number,
        right: number,
        left: number,
        top: number
    ): IsometricPath {
        return this.curveTo(controlRight, controlLeft, controlTop, right, left, top);
    }

    public draw(commands: string): IsometricPath {
        return drawCommands(this, commands);     
    }

}