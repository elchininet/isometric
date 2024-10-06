import { IsometricStarPolygonAbstract } from '@classes/abstract/IsometricStarPolygonAbstract';
import { IsometricPentagramProps } from './types';

export class IsometricPentagram extends IsometricStarPolygonAbstract {

    public constructor(props: IsometricPentagramProps) {
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        super({
            ...props,
            points: 5,
            density: 2
        });
    }

}