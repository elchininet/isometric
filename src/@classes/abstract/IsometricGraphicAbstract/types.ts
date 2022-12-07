import {
    StrokeLinecap,
    StrokeLinejoin,
    Texture
} from '@types';

export interface IsometricGraphicProps {
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeDashArray?: number[];
    strokeLinecap?: StrokeLinecap;
    strokeLinejoin?: StrokeLinejoin;
    strokeOpacity?: number;
    strokeWidth?: number;
    texture?: Texture;
}