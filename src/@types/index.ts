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

export interface Listener {
    fn: VoidFunction;
    fnBind: VoidFunction;
}

export enum Command {
    move = 'move',
    line = 'line',
    curve = 'curve'
}

export interface LinePoint {
    command: Exclude<Command, Command.curve>;
    control?: never;
    point: Point;
}

export interface CurvePoint {
    command: Exclude<Command, Command.move | Command.line>;
    control: Point;
    point: Point;
}

export type CommandPoint = LinePoint | CurvePoint;

export enum PlaneView {
    FRONT = 'FRONT',
    SIDE = 'SIDE',
    TOP = 'TOP'
}

export type IsometricPlaneView = keyof typeof PlaneView;