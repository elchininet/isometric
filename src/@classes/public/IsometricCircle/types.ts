import { IsometricShapeProps } from '@classes/abstract/IsometricShapeAbstract';

export interface IsometricCircleProps extends IsometricShapeProps {
    radius: number;
}

export interface GetCirclePathArguments {
    right: number;
    left: number;
    top: number;
    radius: number;
}