import { IsometricShapeProps } from '@classes/abstract/IsometricShape';

export interface IsometricCircleProps extends IsometricShapeProps {
    radius: number;
}

export interface GetCirclePathArguments {
    right: number;
    left: number;
    top: number;
    radius: number;
}