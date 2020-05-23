import { Point } from '@types';

export enum Command {
    move = 'move',
    line = 'line',
    curve = 'curve'
}

export interface LinePoint {
    command: Exclude<Command, Command.curve>;
    point: Point;
}

export interface CurvePoint {
    command: Exclude<Command, Command.move | Command.line>;
    control: Point;
    point: Point;
}

export type CommandPoint = LinePoint | CurvePoint;