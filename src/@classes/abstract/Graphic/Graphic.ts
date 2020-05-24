import { Colors, LineCap, LineJoin, StrokeLinecap, StrokeLinejoin } from '@types';
import { IsometricStore } from '@classes/abstract/IsometricStore';
import { GraphicProps } from './types';

const defaultGraphicProps: GraphicProps = {
    fillColor: Colors.white,
    fillOpacity: 1,
    strokeColor: Colors.black,
    strokeDashArray: [],
    strokeLinecap: LineCap.butt,
    strokeLinejoin: LineJoin.round,
    strokeOpacity: 1,
    strokeWidth: 1
};

export abstract class Graphic extends IsometricStore {

    public constructor(props: GraphicProps) {
        super();
        this.props = {...defaultGraphicProps, ...props};
    }

    protected props: GraphicProps;

    abstract getElement(): SVGElement;
    abstract update(): Graphic;
    abstract clear(): Graphic;

    // fillColor
    protected setFillColor(value: string): void {
        this.props.fillColor = value;
    }

    public get fillColor(): string {
        return this.props.fillColor;
    }

    public set fillColor(value: string) {
        this.setFillColor(value);
    }

    // fillOpacity
    protected setFillOpacity(value: number): void {
        this.props.fillOpacity = value;
    }

    public get fillOpacity(): number {
        return this.props.fillOpacity;
    }

    public set fillOpacity(value: number) {
        this.setFillOpacity(value);
    }

    // strokeColor
    protected setStrokeColor(value: string): void {
        this.props.strokeColor = value;
    }

    public get strokeColor(): string {
        return this.props.strokeColor;
    }

    public set strokeColor(value: string) {
        this.setStrokeColor(value);
    }

    // strokeDashArray
    protected setStrokeDashArray(value: number[]): void {
        this.props.strokeDashArray = value;
    }

    public get strokeDashArray(): number[] {
        return this.props.strokeDashArray;
    }

    public set strokeDashArray(value: number[]) {
        this.setStrokeDashArray(value);
    }

    // strokeLinecap
    protected setStrokeLinecap(value: StrokeLinecap): void {
        this.props.strokeLinecap = LineCap[value];
    }

    public get strokeLinecap(): StrokeLinecap {
        return this.props.strokeLinecap;
    }

    public set strokeLinecap(value: StrokeLinecap) {
        this.setStrokeLinecap(value);
    }

    // strokeLinejoin
    protected setStrokeLinejoin(value: StrokeLinejoin): void {
        this.props.strokeLinejoin = LineJoin[value];
    }

    public get strokeLinejoin(): StrokeLinejoin {
        return this.props.strokeLinejoin;
    }

    public set strokeLinejoin(value: StrokeLinejoin) {
        this.setStrokeLinejoin(value);
    }

    // strokeOpacity
    protected setStrokeOpacity(value: number): void {
        this.props.strokeOpacity = value;
    }

    public get strokeOpacity(): number {
        return this.props.strokeOpacity;
    }

    public set strokeOpacity(value: number) {
        this.setStrokeOpacity(value);
    }

    // strokeWidth
    protected setStrokeWidth(value: number): void {
        this.props.strokeWidth = value;
    }

    public get strokeWidth(): number {
        return this.props.strokeWidth;
    }

    public set strokeWidth(value: number) {
        this.setStrokeWidth(value);
    }

}