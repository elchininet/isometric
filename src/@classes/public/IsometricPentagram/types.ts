import { IsometricStarPolygonAbstractProps, GetStarPolygonAbstractPathArguments } from '@classes/abstract/IsometricStarPolygonAbstract';

type RemoveProps = 'points' | 'density';
export type IsometricPentagramProps = Omit<IsometricStarPolygonAbstractProps, RemoveProps>
export type GetPentagramPathArguments = Omit<GetStarPolygonAbstractPathArguments, RemoveProps>;