import { IsometricShapeProps } from '@classes/abstract/IsometricShapeAbstract';

export interface IsometricRectangleProps extends IsometricShapeProps {
    height: number;
    width: number;
}

export interface GetRectanglePathArguments {
    right: number;
    left: number;
    top: number;
    width: number;
    height: number;
}