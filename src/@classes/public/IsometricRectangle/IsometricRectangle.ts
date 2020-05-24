import { Command, LinePoint, PlaneView, IsometricPlaneView } from '@types';
import { IsometricShape } from '@classes/abstract/IsometricShape';
import { addSVGProperties, getSVGPath, translateCommandPoints } from '@utils';
import { IsometricRectangleProps } from './types';

export class IsometricRectangle extends IsometricShape {

    public constructor(props: IsometricRectangleProps) {
        const { height, width, ...rest } = props;
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        super(rest)/* istanbul ignore next */;
        this.rectWidth = width;
        this.rectHeight = height;
    }

    private rectWidth: number;
    private rectHeight: number;

    public update(): IsometricRectangle {
        if (this.path.parentNode) {
            const commands: LinePoint[] = [ {command: Command.move, point: {r: 0, l: 0, t: 0}} ];
            switch(this.planeView) {
                case PlaneView.FRONT:
                    commands.push(
                        {command: Command.line, point: {r: 0, l: this.width, t: 0}},
                        {command: Command.line, point: {r: 0, l: this.width, t: this.height}},
                        {command: Command.line, point: {r: 0, l: 0, t: this.height}}
                    );
                    break;
                case PlaneView.SIDE:
                    commands.push(
                        {command: Command.line, point: {r: this.rectWidth, l: 0, t: 0}},
                        {command: Command.line, point: {r: this.rectWidth, l: 0, t: this.height}},
                        {command: Command.line, point: {r: 0, l: 0, t: this.height}}
                    );
                    break;
                case PlaneView.TOP:
                    commands.push(
                        {command: Command.line, point: {r: this.width, l: 0, t: 0}},
                        {command: Command.line, point: {r: this.width, l: this.height, t: 0}},
                        {command: Command.line, point: {r: 0, l: this.width, t: 0}}
                    );
                    break;
            }
            translateCommandPoints(commands, this.right, this.left, this.top);
            addSVGProperties(this.path, {
                d: getSVGPath(
                    commands,
                    this.data.centerX,
                    this.data.centerY,
                    this.data.scale
                )
            });
        }
        return this;
    }

    public clear(): IsometricRectangle {
        addSVGProperties(this.path, {
            d: ''
        });
        return this;
    }

    protected setPlaneView(value: IsometricPlaneView): void {
        super.setPlaneView(value);
        this.update();
    }

    public get width(): number {
        return this.rectWidth;
    }

    public set width(value: number) {
        this.rectWidth = value;
        this.update();
    }

    public get height(): number {
        return this.rectHeight;
    }

    public set height(value: number) {
        this.rectHeight = value;
        this.update();
    }

    protected setRight(value: number): void {
        super.setRight(value);
        this.update();
    }

    protected setLeft(value: number): void {
        super.setLeft(value);
        this.update();
    }

    protected setTop(value: number): void {
        super.setTop(value);
        this.update();
    }

}