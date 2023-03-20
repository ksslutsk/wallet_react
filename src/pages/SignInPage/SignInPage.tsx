import { FunctionComponent } from "react"
import styles from './SignInPage.module.scss';
import twoKapustas from '../../assets/twoKapustas.svg';
import { LogInForm, RegisterForm } from '../../components';
import { useSearchParams } from "react-router-dom";

export const SignInPage: FunctionComponent = () => {

    const [searchParams, setSerachParams] = useSearchParams();

    const authQuery = searchParams.get('form') || '';

    return (
        <>
            <div className={styles['lot-of-kapusta']}>
                <img />
            </div>
            <div className={styles['sign-in-container']}>
                <div className={styles['main-image__wrapper']}>
                    <img className={styles['main-image']} />
                </div>
                <div className={styles['sign-in-form__wrapper']}>
                    {authQuery === 'register' ? <RegisterForm /> : <LogInForm />}
                </div>
            </div>

            <img src={twoKapustas} className={styles['two-kapustas']} />
        </>
    )
}