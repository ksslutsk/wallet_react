import clsx from "clsx";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import styles from './FormSwitcher.module.scss';

interface FormSwitcherProps {
    activeLink: ActiveLink
}

export enum ActiveLink {
    REGISTER = 'register',
    LOGIN = 'login'
}

export const FormSwitcher: FunctionComponent<FormSwitcherProps> = ({ activeLink }) => {
    return (
        <div className={styles['form-switcher']}>
            <Link to='?form=register'
                className={clsx([
                    styles['form-switcher__link'],
                    { [styles['form-switcher__link--active']]: activeLink === ActiveLink.REGISTER }
                ])}
            >Registration</Link>
            <span> | </span>
            <Link to='?form=login' className={clsx([
                    styles['form-switcher__link'],
                    { [styles['form-switcher__link--active']]: activeLink === ActiveLink.LOGIN }
                ])}>Log in</Link>
        </div>
    )
}