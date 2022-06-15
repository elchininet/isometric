import {
    IsometricPlaneView,
    Position
} from "@types";

export type Limit = [number, number];

export type Drag = IsometricPlaneView | false;

export type DragLimitProps = Record<keyof Position, Limit>;

export type DragLimit = Partial<DragLimitProps> | false;

export interface Draggable {
    drag: Drag;
    dragLimit: DragLimit;
}