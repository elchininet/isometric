import { IsometricPlaneView } from '@types';
import { IsometricGraphicProps } from '@classes/abstract/IsometricGraphic';
import { IsometricDraggableProps } from '@classes/abstract/IsometricDraggable';

export interface IsometricShapeProps extends IsometricGraphicProps, IsometricDraggableProps {
    planeView: IsometricPlaneView;
}