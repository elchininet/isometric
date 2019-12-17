export enum Colors {
    white = 'white',
    black = 'black'
}

export enum LineCap {
    butt = 'butt',
    square = 'square',
    round = 'round'
}

export enum LineJoin {
    miter = 'miter',
    round = 'round',
    bevel = 'bevel'
}

export type StrokeLinecap = keyof typeof LineCap;
export type StrokeLinejoin = keyof typeof LineJoin;

export interface Point {
    r?: number;
    l?: number;
    t?: number;
}