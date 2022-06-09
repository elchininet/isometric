import { IsometricPlaneView } from '@types';
import { IsometricElementProps } from '@classes/abstract/IsometricElement';

export interface IsometricShapeProps extends IsometricElementProps {
    planeView: IsometricPlaneView;
}