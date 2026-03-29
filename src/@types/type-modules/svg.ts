import type { LineCap, LineJoin } from '@constants';
import { StringOrNumber, AddEventListenerCallback } from './generic';

export type StrokeLinecap = keyof typeof LineCap;
export type StrokeLinejoin = keyof typeof LineJoin;

export type SVGProperties = 'fillColor' | 'fillOpacity' | 'strokeColor' | 'strokeOpacity' | 'strokeWidth';
export type SVGPathProperties = 'path';
export type SVGPositionableProperties = 'left' | 'right' | 'top';
export type SVGRectangleProperties = 'width' | 'height';
export type SVGCircleProperties = 'radius';
export type SVGPentagramProperties = 'radius' | 'rotation';
export type SVGStarPolygonProperties = 'radius' | 'density' | 'rotation';
export type SVGTextProperties = 'rotation';
export type SVGAnimationProperties = SVGProperties | SVGPathProperties | SVGPositionableProperties | SVGRectangleProperties | SVGCircleProperties | SVGTextProperties;
export type SVGNativeProperties = 'fill' | 'fill-opacity' | 'stroke' | 'stroke-opacity' | 'stroke-width' | 'd';

export type SVGProps = {
    [key: string]: string;
};

type SVGAnimationBase = {
    property: SVGAnimationProperties;
    duration?: number;
    repeat?: number;
};

export type SVGAnimationPropsFromTo = {
    from: StringOrNumber;
    to: StringOrNumber;
    values?: never;
};

export type SVGAnimationPropsValues = {
    from?: never;
    to?: never;
    values: StringOrNumber | StringOrNumber[];
};

export type SVGAnimationProps = SVGAnimationPropsFromTo | SVGAnimationPropsValues;

export type SVGAnimation = SVGAnimationBase & SVGAnimationProps;

export type SVGPathAnimation = SVGAnimation & {
    property: SVGProperties | SVGPathProperties;
};

export type SVGRectangleAnimation = SVGAnimation & {
    property: SVGProperties | SVGPositionableProperties | SVGRectangleProperties;
}

export type SVGCircleAnimation = SVGAnimation & {
    property: SVGProperties | SVGPositionableProperties | SVGCircleProperties;
}

export type SVGPentagramAnimation = SVGAnimation & {
    property: SVGProperties | SVGPositionableProperties | SVGPentagramProperties;
}

export type SVGStarPolygonAnimation = SVGAnimation & {
    property: SVGProperties | SVGPositionableProperties | SVGStarPolygonProperties;
}

export type SVGTextAnimation = SVGAnimation & {
    property: SVGProperties | SVGPositionableProperties | SVGTextProperties;
}

export type SVGAnimationObject = SVGAnimation &  {
    element?: SVGAnimateElement;
};

export type Listener = {
    fn: AddEventListenerCallback;
    fnBind: AddEventListenerCallback;
};