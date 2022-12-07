import { IsometricPlaneView } from '@types';
import { IsometricGraphicProps } from '@classes/abstract/IsometricGraphicAbstract';
import { IsometricDraggableProps } from '@classes/abstract/IsometricDraggableAbstract';

export interface IsometricShapeProps extends IsometricGraphicProps, IsometricDraggableProps {
    planeView: IsometricPlaneView;
}