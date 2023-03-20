import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { isRequiredValidation, isEmailValidation, isEqualValidation, STORAGE_USER_KEY, UserData as UserDataContext } from "../../../shared/libs";
import { loginUserRequest } from "../../../shared/requests";
import { routes } from "../../../shared/routes";

enum Field {
    email = 'email',
    password = 'password',
    confirmPassword = 'confirmPassword'
}

type ValidationError = Record<Field, string>;

type InputTouched = Record<Field, boolean>;

type UserData = Record<Field, string>

export interface UserAuthData {
    email?: string,
    password?: string,
    confirm?: string
}

interface RegisterFormHookResult {
    error: ValidationError,
    touched: InputTouched,
    userData: UserData,
    isFormValid: boolean,
    handleBlurEmail: (event: React.FocusEvent<HTMLInputElement, Element>) => void,
    handleBlurPassword: (event: React.FocusEvent<HTMLInputElement, Element>) => void,
    handleBlurConfirmPassword: (event: React.FocusEvent<HTMLInputElement, Element>) => void,
    handleChangeConfirmPassword: (event: ChangeEvent<HTMLInputElement>) => void,
    handleChangeEmail: (event: ChangeEvent<HTMLInputElement>) => void,
    handleChangePassword: (event: ChangeEvent<HTMLInputElement>) => void,
    loginUser: (navigate: NavigateFunction, setUser: Dispatch<SetStateAction<UserDataContext>> | undefined) => void,
    saveUserData: (data: UserDataContext, setUser: Dispatch<SetStateAction<UserDataContext>> | undefined) => void
}

export const useAuth = (): RegisterFormHookResult => {

    const passwordValidation = (value: string,
        setError: (value: SetStateAction<ValidationError>) => void
    ) => {
        const isRequiredError = isRequiredValidation(value)
        if (isRequiredError) {
            setError(prevState => (
                {
                    ...prevState,
                    password: isRequiredError
                }
            ));

            return;
        }

        setError(prevState => (
            {
                ...prevState,
                password: ''
            }
        ));
    }

    const emailValidation = (value: string,
        setError: (value: SetStateAction<ValidationError>) => void
    ) => {
        const isRequiredError = isRequiredValidation(value)

        if (isRequiredError) {
            setError(prevState => (
                {
                    ...prevState,
                    email: isRequiredError
                }
            ));

            return;
        }

        const isEmail = isEmailValidation(value);

        if (isEmail) {
            setError(prevState => (
                {
                    ...prevState,
                    email: isEmail
                }
            ));

            return;
        }

        setError(prevState => (
            {
                ...prevState,
                email: ''
            }
        ));
    }

    const confirmPasswordValidation = (confirmPassword: string, currPassword: string,
        setError: (value: SetStateAction<ValidationError>) => void
    ) => {
        const isRequiredError = isRequiredValidation(confirmPassword);

        if (isRequiredError) {
            setError(prevState => (
                {
                    ...prevState,
                    confirmPassword: isRequiredError
                }
            ));

            return;
        }

        const isEqualError = isEqualValidation(confirmPassword, currPassword);

        if (isEqualError) {
            setError(prevState => (
                {
                    ...prevState,
                    confirmPassword: isEqualError
                }
            ));

            return;
        }

        setError(prevState => (
            {
                ...prevState,
                confirmPassword: ''
            }
        ));
    }

    const [error, setError] = useState<ValidationError>({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [touched, setTouched] = useState<InputTouched>({
        email: false,
        password: false,
        confirmPassword: false
    });

    const [userData, setUserData] = useState<UserData>({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [isFormValid, setIsFomValid] = useState(false);

    useEffect(() => {
        setIsFomValid(!(!(touched.email && touched.password && touched.confirmPassword) || !(!error.password && !error.email && !error.confirmPassword)));
    }, [error, touched]);

    const handleChangePassword = (event: ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;

        passwordValidation(value, setError);

        setUserData(prevState => (
            {
                ...prevState,
                password: value
            }
        ));
    }

    const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;

        emailValidation(value, setError);

        setUserData(prevState => (
            {
                ...prevState,
                email: value
            }
        ));
    }
    const handleChangeConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        confirmPasswordValidation(value, userData.password, setError);

        setUserData(prevState => (
            {
                ...prevState,
                confirmPassword: value
            }
        ))
    }

    const handleBlurEmail = (event: React.FocusEvent<HTMLInputElement, Element>): void => {
        if (!touched.email) {
            setTouched(prevState => (
                {
                    ...prevState,
                    email: true
                }
            ));

            const value = event.target.value;
            emailValidation(value, setError);
        }
    }

    const handleBlurPassword = (event: React.FocusEvent<HTMLInputElement, Element>): void => {
        if (!touched.password) {
            setTouched(prevState => (
                {
                    ...prevState,
                    password: true
                }
            ));

            const value = event.target.value;
            passwordValidation(value, setError);
        }
    }

    const handleBlurConfirmPassword = (event: React.FocusEvent<HTMLInputElement, Element>): void => {
        if (!touched.confirmPassword) {
            setTouched(prevState => (
                {
                    ...prevState,
                    confirmPassword: true
                }
            ));

            const value = event.target.value;
            confirmPasswordValidation(value, userData.password, setError);
        }
    }

    const saveUserData = (data: UserDataContext, setUser: Dispatch<SetStateAction<UserDataContext>> | undefined): void => {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data));

        setUser?.(data);
    }

    const loginUser = (navigate: NavigateFunction, setUser: Dispatch<SetStateAction<UserDataContext>> | undefined): void => {
        const data: UserAuthData = { email: userData.email, password: userData.password };

        const options: RequestInit = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        loginUserRequest(options).then(
            (resp: Response) => {
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error("Login failed");
            })
            .then((data: UserDataContext) => {
                saveUserData(data, setUser);
                navigate('/main');
            })
            .catch((error: Error) => {
                console.error(error);
            });
    }

    return {
        error, touched, userData, isFormValid,
        handleBlurEmail, handleBlurPassword, handleBlurConfirmPassword,
        handleChangeConfirmPassword, handleChangeEmail, handleChangePassword,
        loginUser, saveUserData
    };
}