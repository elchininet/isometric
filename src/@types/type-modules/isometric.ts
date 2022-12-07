import {
    PlaneView,
    Command,
    Axis
} from '@constants';

export type IsometricPlaneView = keyof typeof PlaneView;

export type IsometricAxis = keyof typeof Axis;

export type IsometricPoint = {
    x: number;
    y: number;
};

export interface Point {
    r?: number;
    l?: number;
    t?: number;
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

export type EllipsisSpecs = [number, number, number];

export interface Rotation {
    axis: IsometricAxis;
    value: number;
}

export interface Texture {
    url: string;
    planeView?: IsometricPlaneView;
    height?: number;
    width?: number;
    scale?: number;
    shift?: {
        right?: number,
        left?: number,
        top?: number
    },
    rotation?: Rotation;
    pixelated?: boolean;
}

export interface Position {
    right: number;
    left: number;
    top: number;
}