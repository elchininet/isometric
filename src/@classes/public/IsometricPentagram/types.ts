import { IsometricShapeProps } from '@classes/abstract/IsometricShapeAbstract';

export interface IsometricPentagramProps extends IsometricShapeProps {
    radius: number;
    rotation?: number;
}

export interface GetPentagramPathArguments {
    right: number;
    left: number;
    top: number;
    radius: number;
    rotation: number;
}