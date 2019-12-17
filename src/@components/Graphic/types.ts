import { LineCap, StrokeLinejoin } from '@types';

export interface GraphicProps {
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeDasharray?: number[];
    strokeLinecap?: LineCap;
    strokeLinejoin?: StrokeLinejoin;
    strokeOpacity?: number;
    strokeWidth?: number;
}