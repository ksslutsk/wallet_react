import { FunctionComponent, MouseEvent, useContext, useEffect } from "react";
import { FormSwitcher, ActiveLink, InputType } from '../../../shared/components';
import { useAuth } from '../hooks/useAuthForms';
import styles from './LogInForm.module.scss';
import { ConfirmButton, Field, GoogleLoginGroup } from '../components';
import { UserContext } from "../../../shared/libs";
import { useNavigate } from "react-router-dom";

export const LogInForm: FunctionComponent = () => {

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const {
        error, isFormValid, userData, touched,
        handleBlurEmail, handleChangeEmail,
        handleBlurPassword, handleChangePassword,
        loginUser
    } = useAuth();

    useEffect(() => {
        touched.confirmPassword = true
    }, []);

    const handleClickRegistrationButton = (event: MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();

        loginUser(navigate, setUser);
    }

    return (
        <form className={styles['sign-in-form']}>
            <FormSwitcher activeLink={ActiveLink.LOGIN} />

            <GoogleLoginGroup />

            <Field
                inputErrorMessage={error.email}
                type={InputType.EMAIL}
                id='email' placeholder="your@email.com"
                label="Email:"
                onChange={handleChangeEmail}
                onBlur={handleBlurEmail}
            />

            <Field
                type={InputType.PASSWORD}
                label="Password:" id='password'
                inputErrorMessage={error.password}
                onChange={handleChangePassword}
                onBlur={handleBlurPassword}
            />

            <ConfirmButton 
            //disabled={!isFormValid} 
            onClick={handleClickRegistrationButton}>Log in</ConfirmButton>
        </form>
    )
}