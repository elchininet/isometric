import { IsometricPlaneView } from '@types';
import { ORIGIN } from '@constants';
import { IsometricGraphicProps } from '@classes/abstract/IsometricGraphicAbstract';
import { IsometricDraggableProps } from '@classes/abstract/IsometricDraggableAbstract';

export interface IsometricTextProps extends IsometricGraphicProps, IsometricDraggableProps {
    planeView: IsometricPlaneView;
    text?: string;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: 'normal' | 'italic' | 'oblique';
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
    rotation?: number;
    selectable?: boolean;
    origin?: [
        `${Extract<ORIGIN.LEFT | ORIGIN.CENTER | ORIGIN.RIGHT, ORIGIN>}`,
        `${Extract<ORIGIN.TOP | ORIGIN.CENTER | ORIGIN.BOTTOM, ORIGIN>}`
    ]
}