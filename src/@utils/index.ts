import { Point, Listener } from '@types';
import { SQRT3, DECIMALS } from '@constants';
import { CommandPoint, Command } from '@components/IsometricPath';

export interface IsometricPoint {
    x: number;
    y: number;
}

export interface SVGProps {
    [key: string]: string;
}

export const round = (n: number, d: number): number => {
    const exp = Math.pow(10, d);
    return Math.round(n * exp) / exp;
};

export const getPointFromIsometricPoint = (point: Point, scale: number): IsometricPoint => {
    return {
        x: (point.r - point.l) * scale * SQRT3,
        y: ((point.r + point.l) / 2 - point.t) * scale
    };
};

export const addSVGProperties = (svg: SVGElement, props: SVGProps): void => {
    Object.keys(props).forEach((prop: string): void => {
        svg.setAttributeNS(null, prop, props[prop]);
    });
};

export const getSVGPath = (commands: CommandPoint[], centerX: number, centerY: number, scale: number): string => {
    const svgPaths = commands.map((c: CommandPoint) => {
        const point = getPointFromIsometricPoint(c.point, scale);
        const x = round(centerX + point.x, DECIMALS);
        const y = round(centerY + point.y, DECIMALS);
        switch (c.command) {
            case Command.move:
                return `M${x},${y}`;
            case Command.line:
                return `L${x},${y}`;
        }
    });
    if (svgPaths.length) {
        return `${svgPaths.join(' ')}z`;
    }
    return '';
};

export function addEventListenerToElement(element: SVGElement, listeners: Listener[], event: string, callback: VoidFunction, useCapture = false): void {
    const listener = {
        fn: callback,
        fnBind: callback.bind(this)
    };
    listeners.push(listener);
    element.addEventListener(event, listener.fnBind, useCapture);
}

export function removeEventListenerFromElement(element: SVGElement, listeners: Listener[], event: string, callback: VoidFunction, useCapture = false): void {
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