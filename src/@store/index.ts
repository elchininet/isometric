interface Sizes {
    centerX: number;
    centerY: number;
    height: number;
    width: number;
    scale: number;
}

export class Store {

    constructor(width: number, height: number, scale: number) {
        this.sizes = {
            centerX: width / 2,
            centerY: height / 2,
            height,
            width,
            scale
        };
    }

    private sizes: Sizes;

    public get width(): number {
        return this.sizes.width;
    }

    public set width(value: number) {
        this.sizes.width = value;
        this.sizes.centerX = value / 2;
    }

    public get height(): number {
        return this.sizes.height;
    }

    public set height(value: number) {
        this.sizes.height = value;
        this.sizes.centerY = value / 2;
    }

    public get scale(): number {
        return this.sizes.scale;
    }

    public set scale(value: number) {
        this.sizes.scale = value;
    }

    public get centerX(): number {
        return this.sizes.centerX;
    }

    public get centerY(): number {
        return this.sizes.centerY;
    }

}

