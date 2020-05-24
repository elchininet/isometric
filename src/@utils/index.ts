import { Point, Listener, CommandPoint, Command } from '@types';
import { HSQRT3, DECIMALS, COMMANDS_REGEXP } from '@constants';
import { IsometricPath } from '@classes/public/IsometricPath';

export interface IsometricPoint {
    x: number;
    y: number;
}

type EllipsisSpecs = [number, number, number];

export interface SVGProps {
    [key: string]: string;
}

const round = (n: number, d: number): number => {
    const exp = Math.pow(10, d);
    return Math.round(n * exp) / exp;
};

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

const getOrientation = (p1: IsometricPoint, p2: IsometricPoint, p3: IsometricPoint): number => {
    const value = (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y);
    return value >= 0 ? 0 : 1;
};

const getEllipsisSpecs = (pointA: IsometricPoint, pointB: IsometricPoint, control: IsometricPoint): EllipsisSpecs => {
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

const getPointFromIsometricPoint = (
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

export const addSVGProperties = (svg: SVGElement, props: SVGProps): void => {
    Object.keys(props).forEach((prop: string): void => {
        svg.setAttributeNS(null, prop, props[prop]);
    });
};

export const getSVGPath = (commands: CommandPoint[], centerX: number, centerY: number, scale: number): string => {
    const drawCommands = commands.length === 0 || commands[0].command === Command.move
        ? [...commands]
        : [
            {
                command: Command.move,
                point: { r: 0, l: 0, t: 0 }
            },
            ...commands
        ];
    const svgPaths = drawCommands.map((c: CommandPoint, index: number) => {
        const point = getPointFromIsometricPoint(centerX, centerY, c.point, scale);     
        switch (c.command) {
            case Command.move:
                return `M${point.x} ${point.y}`;
            case Command.line:
                return `L${point.x} ${point.y}`;
            case Command.curve: {                
                const start = getPointFromIsometricPoint(
                    centerX,
                    centerY,
                    commands[index - 1].point,
                    scale
                );
                const control = getPointFromIsometricPoint(centerX, centerY, c.control, scale);
                const ellipsisSpecs = getEllipsisSpecs(start, point, control);
                const sweepFlag = getOrientation(start, control, point);
                return `A ${ellipsisSpecs[0]} ${ellipsisSpecs[1]} ${ellipsisSpecs[2]} 0 ${sweepFlag} ${point.x} ${point.y}`;
            }
        }
    });
    if (svgPaths.length) {
        return `${svgPaths.join(' ').trim()}z`;
    }
    return '';
};

export const drawCommands = (pathInstance: IsometricPath, commands: string): IsometricPath => {
    let array;
    while ((array = COMMANDS_REGEXP.exec(commands)) !== null) {
        const command = array[5] || array[1];
        switch(command) {
            case 'M':
                pathInstance.moveTo(+array[2], +array[3], +array[4]);
                break;
            case 'L':
                pathInstance.lineTo(+array[2], +array[3], +array[4]);
                break;
            case 'C':
                pathInstance.curveTo(+array[6], +array[7], +array[8], +array[9], +array[10], +array[11]);
        }
    }
    return pathInstance;
};

export const translateCommandPoints = (commands: CommandPoint[], right: number, left: number, top: number): void => {
    commands.forEach((command: CommandPoint): void => {
        command.point.r += right;
        command.point.l += left;
        command.point.t += top;
        // Comment for now because curves are not translated at the moment
        /*if (command.control) {
            command.control.r += right;
            command.control.l += left;
            command.control.t += top;
        }*/
    });
};

export function addEventListenerToElement(element: SVGElement, listeners: Listener[], event: string, callback: VoidFunction, useCapture: boolean): void {
    const listener = {
        fn: callback,
        fnBind: callback.bind(this)
    };
    listeners.push(listener);
    element.addEventListener(event, listener.fnBind, useCapture);
}

export function removeEventListenerFromElement(element: SVGElement, listeners: Listener[], event: string, callback: VoidFunction, useCapture: boolean): void {
    let listener: Listener;
    listeners.find((ln: Listener, index: number): boolean => {
        if (ln.fn === callback) {
            listener = listeners.splice(index, 1)[0];
            return true;
        }
    });
    if (listener) {
        element.removeEventListener(event, listener.fnBind, useCapture);
    }
}