import clsx from "clsx";
import { FunctionComponent, InputHTMLAttributes, ReactNode } from "react";
import styles from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    children?: ReactNode
    variant?: InputVariant,
    label?: string,
    type?: InputType,
    inputClassName?: string,
    inputErrorMessage?: string,
}

export enum InputVariant {
    PRIMARY = 'primary',
    SECONDARY = 'secondary'
}

export enum InputType {
    TEXT = 'text',
    EMAIL = 'email',
    PASSWORD = 'password',
    NUMBER = 'number'
}

const getVariant = (variant: InputVariant | undefined) => {
    switch (variant) {
        case InputVariant.PRIMARY:
        default: {
            return styles['input__variant--primary'];
        }

        case InputVariant.SECONDARY: {
            return styles['input__variant--secondary'];
        }
    }
}

export const Input: FunctionComponent<InputProps> = ({
    children,
    variant,
    label,
    inputClassName,
    inputErrorMessage,
    ...props
}) => {

    return (
        <div className={styles['input-wrapper']}>
            {label &&
                <label className={styles['input-wrapper__input-label']}>
                    <span className={clsx([
                        styles['label-empty-space'],
                        { [styles['input--required']]: inputErrorMessage }
                    ])}
                    >*</span>
                    {label}
                </label>
            }
            <input {...props} className={clsx([
                styles['input'],
                getVariant(variant),
                inputClassName
            ])}
            />
            {inputErrorMessage && <label className={styles['input-wrapper__error-message']}>{inputErrorMessage}</label>}
        </div>
    );
}