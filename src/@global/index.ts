import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@constants';

const store = {
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
    centerX: DEFAULT_WIDTH / 2,
    centerY: DEFAULT_HEIGHT / 2,
    scale: 1
};

interface Sizes {
    height: number;
    width: number;
}

export class GlobalData {

    public static setSizes(width: number, height: number): void {
        GlobalData.height = height;
        GlobalData.width = width;
    }
 
    public static get width(): number {
        return store.width;
    }

    public static set width(value: number) {
        store.width = value;
        store.centerX = value / 2;
    }

    public static get height(): number {
        return store.height;
    }

    public static set height(value: number) {
        store.height = value;
        store.centerY = value / 2;
    }

    public static get scale(): number {
        return store.scale;
    }

    public static set scale(value: number) {
        store.scale = value;
    }

    public static get centerX(): number {
        return store.centerX;
    }

    public static get centerY(): number {
        return store.centerY;
    }

}

