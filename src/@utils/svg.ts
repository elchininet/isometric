import {
    Listener,
    IsometricPoint,
    CommandPoint,
    IsometricPlaneView,
    Rotation,
    Position,
    SVGAnimationProperties,
    SVGNativeProperties,
    SVGProps,
} from '@types';
import {
    COMMANDS_REGEXP,
    Command,
    DECIMALS,
    SCALE,
    PlaneView,
    Typeof
} from '@constants';
import {
    getPointFromIsometricPoint,
    getEllipsisSpecs,
    getOrientation,
    getTopPlanePointFromCoordinates,
    getFrontPlanePointFromCoordinates,
    getSidePlanePointFromCoordinates,
    round
} from '@utils/math';
import { getViewMatrix } from '@utils/matrix';
import { Positionable } from '@interfaces/Positionable';
import { DragLimit } from '@interfaces/Draggable';

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

export function addEventListenerToElement(
    element: SVGElement,
    listeners: Listener[],
    event: string,
    callback: VoidFunction,
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
    callback: VoidFunction,
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

export const getDraggableMethods = (
    element: SVGElement,
    instance: Positionable,
) => {

    const requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    const NO_LIMITS = [
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER
    ] as const;

    enum EVENTS {
        MOUSE_MOVE = 'mousemove',
        MOUSE_DOWN = 'mousedown',
        MOUSE_UP = 'mouseup'
    }

    const store = {
        right: 0,
        left: 0,
        top: 0,
        x: 0,
        y: 0
    };

    let _drag: IsometricPlaneView = PlaneView.TOP;
    let _limit: DragLimit = false;
    let _coords: Partial<Position> = {};
    let _update = false;
    
    const betweenBounds = (value: number, bounds: readonly [number, number]): number => {
        const orderedBounds = [...bounds].sort();
        return round(
            Math.min(
                Math.max(value, orderedBounds[0]),
                orderedBounds[1]
            ),
            DECIMALS
        );
    };
    const getRight = (right: number): number => {
        const bounds = _limit && _limit.right || NO_LIMITS;
        return betweenBounds(
            store.right + right / instance.data.scale,
            bounds
        );
    };
    const getLeft = (left: number): number => {
        const bounds = _limit && _limit.left || NO_LIMITS;
        return betweenBounds(
            store.left + left / instance.data.scale,
            bounds,
        );
    };
    const getTop = (top: number): number => {
        const bounds = _limit && _limit.top || NO_LIMITS;
        return betweenBounds(
            store.top + top / instance.data.scale,
            bounds
        );
    };
    const animate = () => {
        if (_update) {
            if (typeof _coords.right === Typeof.NUMBER) {
                instance.right = getRight(_coords.right);
            }
            if (typeof _coords.left === Typeof.NUMBER) {
                instance.left = getLeft(_coords.left);
            }
            if (typeof _coords.top === Typeof.NUMBER) {
                instance.top = getTop(_coords.top);
            }
            requestAnimationFrame(animate);
        }
    };
    const dropElement = (): void => {
        _update = false;
        document.removeEventListener(EVENTS.MOUSE_MOVE, moveElement, true);
        document.removeEventListener(EVENTS.MOUSE_UP, dropElement, true);
    };
    const moveElement = (event: MouseEvent): void => {
        const diffX = event.pageX - store.x;
        const diffY = event.pageY - store.y;
        if (_drag === PlaneView.TOP) {
            _coords = getTopPlanePointFromCoordinates(diffX, diffY);
        } else if (_drag === PlaneView.FRONT) {
            _coords = getFrontPlanePointFromCoordinates(diffX, diffY);
        } else {
            _coords = getSidePlanePointFromCoordinates(diffX, diffY);
        }       
    };
    const startDrag = (event: MouseEvent): void => {
        store.x = event.pageX;
        store.y = event.pageY;
        store.right = instance.right;
        store.left = instance.left;
        store.top = instance.top;
        _update = true;
        document.addEventListener(EVENTS.MOUSE_MOVE, moveElement, true);
        document.addEventListener(EVENTS.MOUSE_UP, dropElement, true);
        requestAnimationFrame(animate);
    };
    const beginDrag = (): void => {
        element.addEventListener(EVENTS.MOUSE_DOWN, startDrag, true);
    };
    const stopDrag = (): void => {
        element.removeEventListener(EVENTS.MOUSE_DOWN, startDrag, true);
        document.removeEventListener(EVENTS.MOUSE_MOVE, moveElement, true);
        document.removeEventListener(EVENTS.MOUSE_UP, dropElement, true);
    };
    const updateDrag = (drag: IsometricPlaneView): void => {
        _drag = drag;
    };
    const updateDragLimit = (limit: DragLimit): void => {
        _limit = limit;
    };
    return {
        beginDrag,
        stopDrag,
        updateDrag,
        updateDragLimit
    };
};

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
        if (element.parentNode instanceof SVGSVGElement) {
            return true;
        }
        return elementHasSVGParent(element.parentNode);
    }
    return false;
};