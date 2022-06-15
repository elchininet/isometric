import {
    Point,
    Position,
    IsometricPoint,
    EllipsisSpecs,
    SinCos
} from '@types';
import {
    HSQRT3,
    DECIMALS
} from '@constants';

export const round = (n: number, d: number): number => {
    const exp = Math.pow(10, d);
    return Math.round(n * exp) / exp;
};

export const radian = (a: number): number => a * Math.PI / 180;

export const sincos = (r: number): SinCos => ({
    sin: round(Math.sin(r), DECIMALS),
    cos: round(Math.cos(r), DECIMALS)
});

const getPointsDiff = (pointA: IsometricPoint, pointB: IsometricPoint): IsometricPoint => ({
    x: pointA.x - pointB.x,
    y: pointA.y - pointB.y
});

const getPointsDistance = (pointA: IsometricPoint, pointB: IsometricPoint): number => {
    const diff = getPointsDiff(pointA, pointB);
    return Math.sqrt(
        Math.pow(diff.x, 2) + Math.pow(diff.y, 2)
    );
};

const translatePoint = (point: IsometricPoint, angle: number, distance: number): IsometricPoint => ({
    x: point.x + Math.cos(angle) * distance,
    y: point.y + Math.sin(angle) * distance
});

const rotate = (point: IsometricPoint, center: IsometricPoint, angle: number): IsometricPoint => {
    const diff = getPointsDiff(point, center);
    const x = diff.x * Math.cos(angle) - diff.y * Math.sin(angle);
    const y = diff.x * Math.sin(angle) + diff.y * Math.cos(angle);
    return {
        x: center.x + x,
        y: center.y + y
    };
};

const getPointsAngle = (pointA: IsometricPoint, pointB: IsometricPoint): number => {
    const diff = getPointsDiff(pointB, pointA);
    return Math.atan2(diff.y, diff.x);
};

export const getOrientation = (p1: IsometricPoint, p2: IsometricPoint, p3: IsometricPoint): number => {
    const value = (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y);
    return value >= 0 ? 0 : 1;
};

export const getPointFromIsometricPoint = (
    centerX: number,
    centerY: number,
    point: Point,
    scale: number
): IsometricPoint => {
    return {
        x: round(centerX + (point.r - point.l) * scale * HSQRT3, DECIMALS),
        y: round(centerY + ((point.r + point.l) / 2 - point.t) * scale, DECIMALS)
    };
};

export const getTopPlanePointFromCoordinates = (x: number, y: number): Omit<Position, 'top'> => {
    const XHSQRT3 = x / HSQRT3;
    const right = (y * 2 + XHSQRT3) / 2;
    const left = right - XHSQRT3;
    return {
        right,
        left
    };
};

export const getFrontPlanePointFromCoordinates = (x: number, y: number): Omit<Position, 'right'> => {
    const left = - x / HSQRT3;
    const top = left / 2 - y;
    return {
        left,
        top
    };
};

export const getSidePlanePointFromCoordinates = (x: number, y: number): Omit<Position, 'left'> => {
    const right = x / HSQRT3;
    const top = right / 2 - y;
    return {
        right,
        top
    };
};

export const getEllipsisSpecs = (pointA: IsometricPoint, pointB: IsometricPoint, control: IsometricPoint): EllipsisSpecs => {
    const diff = getPointsDiff(pointB, pointA);
    const center = { x: pointA.x + diff.x / 2, y: pointA.y + diff.y / 2 };
    const P = rotate(pointB, center, Math.PI / 2);
    const D = { x: P.x + (control.x - P.x) / 2, y: P.y + (control.y - P.y) / 2};
    const radius = getPointsDistance(D, center);
    const U = translatePoint(D, getPointsAngle(D, P), radius);
    const V = translatePoint(D, getPointsAngle(D, control), radius);
    return [
        round(getPointsDistance(control, U), DECIMALS),
        round(getPointsDistance(control, V), DECIMALS),
        round(getPointsAngle(center, V) * 180 / Math.PI, DECIMALS)
    ];
};

const randomId = () => Math.random().toString(16).slice(2);

export const uuid = (): string => Array.from(Array(3)).map(() => randomId()).join('-');