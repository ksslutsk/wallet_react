import { ButtonHTMLAttributes, FunctionComponent, ReactNode } from "react";
import clsx from 'clsx';
import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode,
    color?: ButtonVariant,
    rounded?: boolean,
    buttonClassName?: string
}

export enum ButtonVariant {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    TRANSPARENT = 'transparent',
    WHITEBORDER = 'whiteborder'
}

const getColor = (color: ButtonVariant | undefined) => {
    switch (color) {
        case ButtonVariant.PRIMARY:
        default: {
            return styles['button__color--primary'];
        }
        case ButtonVariant.SECONDARY: {
            return styles['button__color--secondary'];
        }
        case ButtonVariant.TRANSPARENT: {
            return styles['button__color--transparent'];
        }
        case ButtonVariant.WHITEBORDER: {
            return styles['button__color--white-border']
        }
    }
}

export const Button: FunctionComponent<ButtonProps> = ({
    children,
    rounded,
    color,
    buttonClassName,
    ...props
}) => {

    return <button {...props}
        className={clsx({
            [styles['button--rounded']]: rounded
        },
        [
            styles['button'],
            getColor(color),
            buttonClassName
        ], )}
    >
        {children}
    </button>
}