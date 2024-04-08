export const applyMixins = (BaseClass: any, constructor: any) => {
    Object.getOwnPropertyNames(constructor.prototype).forEach((name) => {
        Object.defineProperty(
            BaseClass.prototype,
            name,
            Object.getOwnPropertyDescriptor(constructor.prototype, name)
        );
    });
};