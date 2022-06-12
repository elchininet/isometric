import { IsometricPlaneView } from '@types';
import { IsometricGraphicProps } from '@classes/abstract/IsometricGraphic';

export interface IsometricShapeProps extends IsometricGraphicProps {
    planeView: IsometricPlaneView;
    right?: number;
    left?: number;
    top?: number;
}