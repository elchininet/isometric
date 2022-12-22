import {
    Listener,
    IsometricPoint,
    CommandPoint,
    IsometricPlaneView,
    Rotation,
    SVGProperties,
    SVGNativeProperties,
    SVGProps,
    AddEventListenerCallback
} from '@types';
import {
    COMMANDS_REGEXP,
    Command,
    DECIMALS,
    SCALE
} from '@constants';
import {
    getPointFromIsometricPoint,
    getEllipsisSpecs,
    getOrientation,
    round
} from '@utils/math';
import { getViewMatrix } from '@utils/matrix';

export const addSVGProperties = (svg: SVGElement, props: SVGProps): void => {
    Object.keys(props).forEach((prop: string): void => {
        svg.setAttributeNS(null, prop, props[prop]);
    });
};

const getCommandsWithStart = (commands: CommandPoint[]): CommandPoint[] => {
    return commands.length === 0 || commands[0].command === Command.move
        ? [...commands]
        : [
            {
                command: Command.move,
                point: { r: 0, l: 0, t: 0 }
            },
            ...commands
        ];
};

export const getSVGPath = (
    commands: CommandPoint[],
    centerX: number,
    centerY: number,
    scale: number,
    autoclose: boolean
): string => {
    const drawCommands = getCommandsWithStart(commands);
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
        const pathEnd = autoclose ? 'z' : '';
        return `${svgPaths.join(' ').trim()}${pathEnd}`;
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

export const translateCommandPoints = (
    commands: CommandPoint[],
    right: number,
    left: number,
    top: number
): void => {
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

export const getTextureCorner = (
    commands: CommandPoint[],
    centerX: number,
    centerY: number,
    scale: number
): IsometricPoint => {
    const corner = {
        x: Number.MAX_SAFE_INTEGER,
        y: Number.MAX_SAFE_INTEGER
    };
    getCommandsWithStart(commands)
        .forEach((c: CommandPoint) => {
            const point = getPointFromIsometricPoint(
                centerX,
                centerY,
                c.point,
                scale
            );
            if (
                point.x < corner.x ||
                (
                    point.x === corner.x &&
                    point.y < corner.y
                )
            ) {
                corner.x = point.x;
                corner.y = point.y;
            }
        });
    return corner;
};

export const isSVGProperty = (property: string): property is SVGProperties => {
    return [
        'fillColor',
        'fillOpacity',
        'strokeColor',
        'strokeOpacity',
        'strokeWidth'
    ].includes(property);
};

export const getSVGProperty = (property: string): SVGNativeProperties => {
    return {
        fillColor: 'fill',
        fillOpacity: 'fill-opacity',
        strokeColor: 'stroke',
        strokeOpacity: 'stroke-opacity',
        strokeWidth: 'stroke-width'
    }[property] as SVGNativeProperties;
};

export function addEventListenerToElement(
    element: SVGElement,
    listeners: Listener[],
    event: string,
    callback: AddEventListenerCallback,
    useCapture: boolean
): void {
    const listener = {
        fn: callback,
        fnBind: callback.bind(this)
    };
    listeners.push(listener);
    element.addEventListener(event, listener.fnBind, useCapture);
}

export function removeEventListenerFromElement(
    element: SVGElement,
    listeners: Listener[],
    event: string,
    callback: AddEventListenerCallback,
    useCapture: boolean
): void {
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

export const getPatternTransform = (
    corner: IsometricPoint,
    planeView?: IsometricPlaneView,
    scale?: number,
    rotation?: Rotation
): string => {
    const matrix = getViewMatrix(planeView, rotation);
    let transform = `translate(${corner.x} ${corner.y})`;
    if (matrix) {
        const m1 = round(matrix[0][0], DECIMALS);
        const m2 = round(matrix[1][0], DECIMALS);
        const m3 = round(matrix[0][1], DECIMALS);
        const m4 = round(matrix[1][1], DECIMALS);
        transform += ` matrix(${m1},${m2},${m3},${m4},0,0)`;
        transform += ` scale(${round(SCALE * (scale || 1), DECIMALS)})`;
    } else if (scale) {
        transform += ` scale(${round(scale, DECIMALS)})`;
    }
    return transform;
};

export const elementHasSVGParent = (element: Node): boolean => {
    if (element.parentNode) {
        if (element.parentNode.constructor.name === 'SVGSVGElement') {
            return true;
        }
        return elementHasSVGParent(element.parentNode);
    }
    return false;
};