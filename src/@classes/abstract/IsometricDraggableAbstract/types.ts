import {
    IsometricPlaneView,
    Position
} from '@types';

export interface IsometricDraggableProps {
    right?: number;
    left?: number;
    top?: number;
}

export type Bounds = [number, number];

export type Drag = IsometricPlaneView | false;

export type Boundaries = Partial<Record<keyof Position, Bounds>> | false;

export type ClientCoords = {
    clientX: number;
    clientY: number;
};