export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export enum SVG_ELEMENTS {
    svg = 'svg',
    group = 'group',
    path = 'path',
    rect = 'rect'
}

export enum SVG_PROPERTIES {
    viewBox = 'viewBox'
}

export const DECIMALS = 6;
export const SQRT3: number = +((Math.sqrt(3) / 2).toFixed(DECIMALS));
export const DEFAULT_WIDTH = 640;
export const DEFAULT_HEIGHT = 480;

const N = '(\\d+(?:\\.\\d+)?|\\.\\d+)'; // Number
const S = '\\s*'; // Space
const MOVE_AND_LINE = `${S}${N}${S}${N}${S}${N}${S}`;
export const COMMANDS_REGEXP = new RegExp(`(M|L)${MOVE_AND_LINE}`, 'g');