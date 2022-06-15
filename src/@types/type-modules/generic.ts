export type StringOrNumber = string | number;

type RequestAnimationFrame = typeof window.requestAnimationFrame;

declare global {
    interface Window {
        mozRequestAnimationFrame: RequestAnimationFrame;
        webkitRequestAnimationFrame: RequestAnimationFrame;
        msRequestAnimationFrame: RequestAnimationFrame;
    }
  }