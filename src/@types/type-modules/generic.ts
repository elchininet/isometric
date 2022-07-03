export type StringOrNumber = string | number;

export type AddEventListenerCallback = (event?: Event) => void;

type RequestAnimationFrame = typeof window.requestAnimationFrame;

declare global {
    interface Window {
        mozRequestAnimationFrame: RequestAnimationFrame;
        webkitRequestAnimationFrame: RequestAnimationFrame;
        msRequestAnimationFrame: RequestAnimationFrame;
    }
}