import { IsometricStarPolygonAbstract } from '@classes/abstract/IsometricStarPolygonAbstract';
import { IsometricStarPolygonProps } from './types';

export class IsometricStarPolygon extends IsometricStarPolygonAbstract {

    public constructor(props: IsometricStarPolygonProps) {
        // Exclude the next line from the coverage reports
        // Check https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        super(props);
    }

    public get points(): number {
        return this._points;
    }

    public set points(value: number) {
        this._points = value;
        this._sector =  2 * Math.PI / this._points;
        this._halfSector = this._sector / 2;
        this.update();
    }

    public get density(): number {
        return this._density;
    }

    public set density(value: number) {
        this._density = value;
        this.update();
    }

}