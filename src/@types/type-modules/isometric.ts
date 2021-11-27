import { PlaneView, Command } from '@constants';

export type IsometricPlaneView = keyof typeof PlaneView;

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