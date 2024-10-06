import { IsometricShapeProps } from '@classes/abstract/IsometricShapeAbstract';

export interface IsometricStarPolygonAbstractProps extends IsometricShapeProps {
    radius: number;
    points: number;
    density: number;
    rotation?: number;
}

export interface GetStarPolygonAbstractPathArguments {
    right: number;
    left: number;
    top: number;
    radius: number;
    points: number;
    density: number;
    rotation: number;
}