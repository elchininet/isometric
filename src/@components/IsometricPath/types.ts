import { Point } from '@types';

export enum Command {
    move = 'move',
    line = 'line'
}

export interface CommandPoint {
    command: Command;
    point: Point;
}