import { Colors, LineCap, LineJoin, StrokeLinecap, StrokeLinejoin } from '@types';
import { GraphicProps } from './types';

const defaultGraphicProps: GraphicProps = {
    fillColor: Colors.white,
    fillOpacity: 1,
    strokeColor: Colors.black,
    strokeDasharray: [],
    strokeLinecap: LineCap.butt,
    strokeLinejoin: LineJoin.round,
    strokeOpacity: 1,
    strokeWidth: 1
};

export class Graphic {

    public constructor(props: GraphicProps) {
        this.props = {...defaultGraphicProps, ...props};
    }

    protected props: GraphicProps;

    public get fillColor(): string {
        return this.props.fillColor;
    }

    public set fillColor(value: string) {
        this.props.fillColor = value;
    }

    public get fillOpacity(): number {
        return this.props.fillOpacity;
    }

    public set fillOpacity(value: number) {
        this.props.fillOpacity = value;
    }

    public get strokeColor(): string {
        return this.props.strokeColor;
    }

    public set strokeColor(value: string) {
        this.props.strokeColor = value;
    }

    public get strokeDasharray(): number[] {
        return this.props.strokeDasharray;
    }

    public set strokeDasharray(value: number[]) {
        this.props.strokeDasharray = value;
    }

    public get strokeLinecap(): StrokeLinecap {
        return this.props.strokeLinecap;
    }

    public set strokeLinecap(value: StrokeLinecap) {
        this.props.strokeLinecap = LineCap[value];
    }

    public get strokeLinejoin(): StrokeLinejoin {
        return this.props.strokeLinejoin;
    }

    public set strokeLinejoin(value: StrokeLinejoin) {
        this.props.strokeLinejoin = LineJoin[value];
    }

    public get strokeOpacity(): number {
        return this.props.strokeOpacity;
    }

    public set strokeOpacity(value: number) {
        this.props.strokeOpacity = value;
    }

    public get strokeWidth(): number {
        return this.props.strokeWidth;
    }

    public set strokeWidth(value: number) {
        this.props.strokeWidth = value;
    }

}