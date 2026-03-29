import { SVGAnimationProps, SVGAnimationPropsValues } from '@types';
import { Typeof } from '@constants';

export const isString = (value: unknown): value is string => typeof value === Typeof.STRING;
export const isNumber = (value: unknown): value is number => typeof value === Typeof.NUMBER;
export const isUndefined = (value: unknown): value is undefined => typeof value === Typeof.UNDEFINED;
export const isBoolean = (value: unknown): value is boolean => typeof value === Typeof.BOOLEAN;

export const isSVGAnimationPropsValues = (animation: SVGAnimationProps): animation is SVGAnimationPropsValues => {
    return 'values' in animation;
};