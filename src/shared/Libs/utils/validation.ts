import { regExEmail, regExPrice } from './constants';

export const isRequiredValidation = (value: string): string => {
    if (!value) {
        return 'This field is required';
    }

    return '';
}

export const isEmailValidation = (value: string): string => {

    if (!regExEmail.test(value)) {
        return 'Email is invalid';
    }

    return '';
}

export const isEqualValidation = (value1: string, value2: string) => {
    if (value1 !== value2) {
        return "Values don't match";
    }

    return '';
}

export const isPriceValid = (value: string): boolean => {
    return regExPrice.test(value);
}