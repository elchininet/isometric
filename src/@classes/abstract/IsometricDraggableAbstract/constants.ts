export const NO_LIMITS = [
    Number.MIN_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER
] as const;

export enum DRAG_EVENT {
    DRAG_START = 'dragstart',
    DRAG = 'drag',
    DRAG_END = 'dragend'
}