import { IsometricPlaneView } from '@types';
import { GraphicProps } from '@classes/abstract/Graphic';

export interface IsometricShapeProps extends GraphicProps {
    planeView: IsometricPlaneView;
}