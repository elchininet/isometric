import { Point, Listener, CommandPoint, Command } from '@types';
import { SQRT3, DECIMALS, COMMANDS_REGEXP } from '@constants';
import { IsometricPath } from '@classes/public/IsometricPath';

export interface IsometricPoint {
    x: number;
    y: number;
}

type IsometricControlPoints = [IsometricPoint, IsometricPoint, IsometricPoint, IsometricPoint];

export interface SVGProps {
    [key: string]: string;
}

const round = (n: number, d: number): number => {
    const exp = Math.pow(10, d);
    return Math.round(n * exp) / exp;
};

const getPointFromIsometricPoint = (
    centerX: number,
    centerY: number,
    point: Point,
    scale: number
): IsometricPoint => {
    return {
        x: round(centerX + (point.r - point.l) * scale * SQRT3, DECIMALS),
        y: round(centerY + ((point.r + point.l) / 2 - point.t) * scale, DECIMALS)
    };
};

const getControlPointsFromIsometricPoint = (
    centerX: number,
    centerY: number,
    fromPoint: Point,
    control: Point,
    toPoint: Point,
    scale: number
): IsometricControlPoints => {
    const corner1 = {
        r: control.r + (fromPoint.r - toPoint.r) / 2,
        l: control.l + (fromPoint.l - toPoint.l) / 2,
        t: control.t + (fromPoint.t - toPoint.t) / 2
    };
    const corner2 = {
        r: control.r - (fromPoint.r - toPoint.r) / 2,
        l: control.l - (fromPoint.l - toPoint.l) / 2,
        t: control.t - (fromPoint.t - toPoint.t) / 2
    };
    const isometricControlPoint1 = {
        r: corner1.r - (corner1.r - fromPoint.r) / 2,
        l: corner1.l - (corner1.l - fromPoint.l) / 2,
        t: corner1.t - (corner1.t - fromPoint.t) / 2
    };
    const isometricControlPoint2 = {
        r: control.r + (corner1.r - control.r) / 2,
        l: control.l + (corner1.l - control.l) / 2,
        t: control.t + (corner1.t - control.t) / 2
    };
    const isometricControlPoint3 = {
        r: control.r + (corner2.r - control.r) / 2,
        l: control.l + (corner2.l - control.l) / 2,
        t: control.t + (corner2.t - control.t) / 2
    };    
    const isometricControlPoint4 = {
        r: corner2.r - (corner2.r - toPoint.r) / 2,
        l: corner2.l - (corner2.l - toPoint.l) / 2,
        t: corner2.t - (corner2.t - toPoint.t) / 2
    };
    return [
        getPointFromIsometricPoint(centerX, centerY, isometricControlPoint1, scale),
        getPointFromIsometricPoint(centerX, centerY, isometricControlPoint2, scale),
        getPointFromIsometricPoint(centerX, centerY, isometricControlPoint3, scale),
        getPointFromIsometricPoint(centerX, centerY, isometricControlPoint4, scale)
    ];
};

export const addSVGProperties = (svg: SVGElement, props: SVGProps): void => {
    Object.keys(props).forEach((prop: string): void => {
        svg.setAttributeNS(null, prop, props[prop]);
    });
};

export const getSVGPath = (commands: CommandPoint[], centerX: number, centerY: number, scale: number): string => {
    const svgPaths = commands.map((c: CommandPoint, index: number) => {
        const point = getPointFromIsometricPoint(centerX, centerY, c.point, scale);     
        switch (c.command) {
            case Command.move:
                return `M${point.x} ${point.y}`;
            case Command.line:
                return `L${point.x} ${point.y}`;
            case Command.curve:
                if (index > 0) {
                    const middle = getPointFromIsometricPoint(centerX, centerY, c.control, scale);
                    const controls = getControlPointsFromIsometricPoint(
                        centerX,
                        centerY,
                        commands[index - 1].point,
                        c.control,
                        c.point,
                        scale
                    );
                    const middlePoint = `${middle.x} ${middle.y}`;
                    const finalPoint = `${point.x} ${point.y}`;
                    const control1 = `${controls[0].x} ${controls[0].y}`;
                    const control2 = `${controls[1].x} ${controls[1].y}`;
                    const control3 = `${controls[2].x} ${controls[2].y}`;
                    const control4 = `${controls[3].x} ${controls[3].y}`;
                    return `C${control1},${control2},${middlePoint} C${control3},${control4},${finalPoint}`;
                }
                return '';
            }
    });
    if (svgPaths.length) {
        const svgPathString = svgPaths.join(' ').trim();
        if (svgPathString) {
            return `${svgPathString}z`;
        }
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