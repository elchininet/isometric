import {
    Matrix,
    IsometricPlaneView,
    Rotation
} from '@types';
import {
    PlaneView,
    Axis,
    ROT_45,
    ROT_60,
    ROT_CMA
} from '@constants';
import { sincos, radian } from '@utils/math';

const multiplyMatrix = (m1: Matrix, m2: Matrix): Matrix => (
    m1.map((row, i): number[] => (
        m2[0].map((_: number, j: number): number =>
            row.reduce((acc: number, _: number, n: number): number =>
                acc + m1[i][n] * m2[n][j],
                0
            )
        )
    )
));

const multiplyMatrices = (...m: Matrix[]): Matrix => {
    let matrix = m[0];
    for (let i = 1; i < m.length; i++) {
        matrix = multiplyMatrix(matrix, m[i]);
    }
    return matrix;
};

const rotateX = (r: number): Matrix => {
    const sc = sincos(r);
    return [
        [1,        0,        0     ],
        [0,        sc.cos, - sc.sin],
        [0,        sc.sin,   sc.cos]
    ];
};

const rotateY = (r: number): Matrix => {
    const sc = sincos(r);
    return [
        [sc.cos,   0,      sc.sin],
        [0,        1,      0     ],
        [- sc.sin, 0,      sc.cos]
    ];
};

const rotateZ = (r: number): Matrix => {
    const sc = sincos(r);
    return [
        [sc.cos, - sc.sin,  0],
        [sc.sin,   sc.cos,  0],
        [0,        0,       1]
    ];
};

const topMatrix = multiplyMatrices(
    rotateX(ROT_CMA),
    rotateZ(-ROT_45)
);

const frontMatrix = multiplyMatrices(
    rotateZ(-ROT_60),
    rotateX(ROT_CMA),
    rotateZ(ROT_45)
);

const sideMatrix = multiplyMatrices(
    rotateZ(ROT_60),
    rotateX(ROT_CMA),
    rotateZ(-ROT_45)
);

const rotationToRotationMatrix = (view: IsometricPlaneView, rotation: Rotation): Matrix | null => {
    const value = radian(rotation.value);
    switch(view) {
        case PlaneView.TOP: {
            switch(rotation.axis) {
                case Axis.TOP:
                    return rotateZ(value);
                case Axis.LEFT:
                    return rotateX(-value);
                case Axis.RIGHT:
                    return rotateY(value);
                default:
                    return null;
            }
        }
        case PlaneView.FRONT: {
            switch(rotation.axis) {
                case Axis.TOP:
                    return rotateY(value);
                case Axis.LEFT:
                    return rotateX(value);
                case Axis.RIGHT:
                    return rotateZ(value);
                default:
                    return null;
            }
        }
        case PlaneView.SIDE: {
            switch(rotation.axis) {
                case Axis.TOP:
                    return rotateY(value);
                case Axis.LEFT:
                    return rotateZ(value);
                case Axis.RIGHT:
                    return rotateX(-value);
                default:
                    return null;
            }
        }
        default:
            return null;
    }
};

export const getViewMatrix = (
    planeView?: IsometricPlaneView,
    rotation?: Rotation
): Matrix | null => {

    const rotationMatrices: Matrix[]  = [];

    const rotationMatrix = rotation
        ? rotationToRotationMatrix(planeView, rotation)
        : null;

    if (rotationMatrix) rotationMatrices.push(rotationMatrix);

    switch(planeView) {
        case PlaneView.TOP: {
            return multiplyMatrices(topMatrix, ...rotationMatrices);
        }
        case PlaneView.FRONT: {
            return multiplyMatrices(frontMatrix, ...rotationMatrices);
        }
        case PlaneView.SIDE: {
            return multiplyMatrices(sideMatrix, ...rotationMatrices);
        }
    }

    return null;
};