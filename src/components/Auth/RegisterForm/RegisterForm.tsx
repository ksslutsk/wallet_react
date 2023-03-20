import { FunctionComponent, MouseEvent, useContext } from "react";
import { FormSwitcher, ActiveLink, InputType } from '../../../shared/components';
import { STORAGE_USER_KEY, UserContext, UserData } from "../../../shared/libs";
import { GoogleLoginGroup, ConfirmButton, Field } from "../components";
import { useAuth, UserAuthData } from '../hooks/useAuthForms';
import styles from './RegisterForm.module.scss'
import { routes } from '../../../shared/routes';
import { useNavigate } from "react-router-dom";
import { registerUserRequest } from "../../../shared/requests";

export const RegisterForm: FunctionComponent = () => {

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const {
        error, userData, isFormValid,
        handleBlurConfirmPassword, handleBlurEmail, handleBlurPassword,
        handleChangeConfirmPassword, handleChangeEmail, handleChangePassword,
        loginUser,
    } = useAuth();

    const registerUser = (): void => {
        const data: UserAuthData = {
            email: userData.email,
            password: userData.password,
            confirm: userData.confirmPassword
        }

        const options: RequestInit = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        registerUserRequest(options)
            .then((response: Response) => {
                if (response.ok) return response.json();
                throw new Error('register failed')
            })
            .then((data: UserData) => {
                setUser?.(data)
            })
            .then(() => {
                loginUser(navigate, setUser);
            })
            .catch((error: Error) => {
                console.error(error);
            });
    }

    const handleClickRigisterButton = (event: MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();

        registerUser();
    }

    return (
        <form className={styles['sign-in-form']}>
            <FormSwitcher activeLink={ActiveLink.REGISTER} />

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

            <Field
                type={InputType.PASSWORD}
                label="Confirm password:" id='confirmPassword'
                inputErrorMessage={error.confirmPassword}
                onChange={handleChangeConfirmPassword}
                onBlur={handleBlurConfirmPassword}
            />

            <ConfirmButton
                //disabled={!isFormValid}
                onClick={handleClickRigisterButton}
            >Registration</ConfirmButton>
        </form>
    )
}