export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export enum SVG_ELEMENTS {
    svg = 'svg',
    group = 'g',
    path = 'path',
    rect = 'rect',
    text = 'text',
    tspan = 'tspan',
    pattern = 'pattern',
    image = 'image',
    animate = 'animate',
    animateTransform = 'animateTransform'
}

export enum SVG_PROPERTIES {
    viewBox = 'viewBox'
}

export const DECIMALS = 6;
export const SQRT3 = +(Math.sqrt(3).toFixed(DECIMALS));
export const HSQRT3 = +((Math.sqrt(3) / 2).toFixed(DECIMALS));
export const DEFAULT_WIDTH = 640;
export const DEFAULT_HEIGHT = 480;

const N = '(-?\\d+(?:\\.\\d+)?|-?\\.\\d+)'; // Number
const S = '\\s*'; // Space
const SS = '\\s+'; // Splicit space
const POINT = `${N}${SS}${N}${SS}${N}`;
const CURVE = `${POINT}${SS}${POINT}`;
export const COMMANDS_REGEXP = new RegExp(`(?:(M|L)${S}${POINT}${S}|(C)${S}${CURVE})${S}`, 'g');

export const SCALE = Math.sqrt(3 / 2);
export const ROT_60 = Math.PI / 3;
export const ROT_45 = Math.PI / 4;
export const ROT_CMA = Math.atan(Math.SQRT2);

export enum Colors {
    white = 'white',
    black = 'black'
}

export enum LineCap {
    butt = 'butt',
    square = 'square',
    round = 'round'
}

export enum LineJoin {
    miter = 'miter',
    round = 'round',
    bevel = 'bevel'
}

export enum Command {
    move = 'move',
    line = 'line',
    curve = 'curve'
}

export enum PlaneView {
    FRONT = 'FRONT',
    SIDE = 'SIDE',
    TOP = 'TOP'
}

export enum Axis {
    RIGHT = 'RIGHT',
    LEFT = 'LEFT',
    TOP = 'TOP'
}

export enum Typeof {
    UNDEFINED = 'undefined',
    NUMBER = 'number'
}

export enum EVENTS {
    MOUSE_MOVE = 'mousemove',
    MOUSE_DOWN = 'mousedown',
    MOUSE_UP = 'mouseup',
    TOUCH_START = 'touchstart',
    TOUCH_MOVE = 'touchmove',
    TOUCH_END = 'touchend'
}

export enum ORIGIN {
    CENTER = 'center',
    LEFT = 'left',
    RIGHT = 'right',
    TOP = 'top',
    BOTTOM = 'bottom'
}