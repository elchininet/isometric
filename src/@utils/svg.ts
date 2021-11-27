import {
    Listener,
    CommandPoint,
    SVGAnimationProperties,
    SVGNativeProperties,
    SVGProps
} from '@types';
import { COMMANDS_REGEXP, Command } from '@constants';
import {
    getPointFromIsometricPoint,
    getEllipsisSpecs,
    getOrientation
} from '@utils/math';

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

export const parseDrawCommands = (commands: string): CommandPoint[] => {
    const commandsArray: CommandPoint[] = [];
    let array;
    while ((array = COMMANDS_REGEXP.exec(commands)) !== null) {
        const command = array[5] || array[1];
        switch(command) {
            case 'M':
                commandsArray.push({
                    command: Command.move,
                    point: { r: +array[2], l: +array[3], t: +array[4] }
                });
                break;
            case 'L':
                commandsArray.push({
                    command: Command.line,
                    point: { r: +array[2], l: +array[3], t: +array[4] }
                }); 
                break;
            case 'C':
                commandsArray.push({
                    command: Command.curve,
                    control: { r: +array[6], l: +array[7], t: +array[8] },
                    point: { r: +array[9], l: +array[10], t: +array[11] }
                });
        }
    }
    return commandsArray;
};

export const translateCommandPoints = (commands: CommandPoint[], right: number, left: number, top: number): void => {
    commands.forEach((command: CommandPoint): void => {
        command.point.r += right;
        command.point.l += left;
        command.point.t += top;
        if (command.control) {
            command.control.r += right;
            command.control.l += left;
            command.control.t += top;
        }
    });
};

export const getSVGProperty = (property: SVGAnimationProperties): SVGNativeProperties => {
    return {
        fillColor: 'fill',
        fillOpacity: 'fill-opacity',
        strokeColor: 'stroke',
        strokeOpacity: 'stroke-opacity',
        strokeWidth: 'stroke-width',
        path: 'd',
        left: 'd',
        right: 'd',
        top: 'd',
        width: 'd',
        height: 'd',
        radius: 'd'
    }[property] as SVGNativeProperties;
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