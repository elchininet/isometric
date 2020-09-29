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

type StringOrNumber = string | number;
export type SVGProperties = 'fillColor' | 'fillOpacity' | 'strokeColor' | 'strokeOpacity' | 'strokeWidth';
export type SVGPathProperties = 'path';
export type SVGShapeProperties = 'left' | 'right' | 'top';
export type SVGRectangleProperties = 'width' | 'height';
export type SVGCircleProperties = 'radius';
export type SVGAnimationProperties = SVGProperties | SVGPathProperties | SVGShapeProperties | SVGRectangleProperties | SVGCircleProperties ; 
export type SVGNativeProperties = 'fill' | 'fill-opacity' | 'stroke' | 'stroke-opacity' | 'stroke-width' | 'd' | 'left' | 'right' | 'top';

type SVGAnimationBase = {
    property: SVGAnimationProperties;
    duration?: number;
    repeat?: number;
};

type SVGAnimationProps = {
    from: StringOrNumber;
    to: StringOrNumber;
    values?: never;
} | {
    from?: never;
    to?: never;
    values: StringOrNumber | StringOrNumber[];
};

export type SVGAnimation = SVGAnimationBase & SVGAnimationProps;

export type SVGPathAnimation = SVGAnimation & {
    property: SVGProperties | SVGPathProperties;
};

export type SVGRectangleAnimation = SVGAnimation & {
    property: SVGProperties | SVGShapeProperties | SVGRectangleProperties;
}

export type SVGCircleAnimation = SVGAnimation & {
    property: SVGProperties | SVGShapeProperties | SVGCircleProperties;
}

export type SVGAnimationObject = SVGAnimation &  {
    element?: SVGAnimateElement;
};