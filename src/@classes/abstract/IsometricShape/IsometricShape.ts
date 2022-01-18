import { IsometricPlaneView } from '@types';
import { IsometricGraphic } from '@classes/abstract/IsometricGraphic';
import { IsometricShapeProps } from './types';

export abstract class IsometricShape extends IsometricGraphic {

    public constructor(props: IsometricShapeProps) {
        const { planeView, ...rest } = props;
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        super(rest);
        this.shapeView = planeView;
        this.posRight = 0;
        this.posLeft = 0;
        this.posTop = 0;
    }
    
    protected shapeView: IsometricPlaneView;
    protected posRight: number;
    protected posLeft: number;
    protected posTop: number;

    // position
    protected setPlaneView(value: IsometricPlaneView): void {
        this.shapeView = value;
    }

    public get planeView(): IsometricPlaneView {
        return this.shapeView;
    }

    public set planeView(value: IsometricPlaneView) {
        this.setPlaneView(value);
    }

    // right
    protected setRight(value: number): void {
        this.posRight = value;
    }

    public get right(): number {
        return this.posRight;
    }

    public set right(value: number) {
        this.setRight(value);
    }

    // left
    protected setLeft(value: number): void {
        this.posLeft = value;
    }

    public get left(): number {
        return this.posLeft;
    }

    public set left(value: number) {
        this.setLeft(value);
    }

    // top
    protected setTop(value: number): void {
        this.posTop = value;
    }

    public get top(): number {
        return this.posTop;
    }

    public set top(value: number) {
        this.setTop(value);
    }

}