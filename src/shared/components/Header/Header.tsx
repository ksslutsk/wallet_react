import { FunctionComponent, useContext, useEffect, useState } from "react";
import styles from './Header.module.scss';
import logo from '../../../assets/logo.svg';
import { Avatar } from "../Avatar";
import { STORAGE_USER_KEY, UserContext, UserData } from "../../libs";
import { useNavigate } from "react-router-dom";
import { logoutUserRequest } from "../../requests";

type LogoutData = Pick<UserData, 'access_token' | 'refresh_token'>;

export const Header: FunctionComponent = () => {

    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext);

    const [isLogined, setIsLogined] = useState(!!user?.userData);

    useEffect(() => {
        const storageUser: UserData | undefined = JSON.parse(localStorage[STORAGE_USER_KEY] || "{}");

        if (user?.userData) {
            localStorage[STORAGE_USER_KEY] = JSON.stringify(user);
        }

        if (!user?.userData && storageUser?.userData) {
            setUser?.(storageUser);
        }

        setIsLogined(!!user?.userData);

    }, [user])

    const logOut = () => {
        const data: LogoutData = {
            access_token: user?.access_token,
            refresh_token: user?.refresh_token
        };

        const options: RequestInit = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${data.access_token}` },
            body: JSON.stringify(data)
        };

        logoutUserRequest(options)
            .then((resp: Response) => {
                localStorage.clear();
                setUser?.(prev => ({}));
                return resp;
            }).then((resp: Response) => {
                navigate('/auth');
            });

    }

    const handleClickExit = () => {
        logOut();
    }

    const getFirstCharacter = (): string => {
        const firstName = user?.userData?.firstName;
        const lastName = user?.userData?.lastName;
        const email = user?.userData?.email;

        return firstName?.at(0) || lastName?.at(0) || email?.at(0) || "A";
    }

    const getFullName = (): string => {
        const firstName = user?.userData?.firstName;
        const lastName = user?.userData?.lastName;

        if (firstName) return `${firstName} ${lastName}`;

        return '';
    }

    return (
        <div className={styles['header__container']}>
            <img src={logo} alt="logo" />

            {
                isLogined &&
                <div className={styles['header__buttons']}>
                    <Avatar character={getFirstCharacter()} />
                    <div className={styles['header__text']}>
                        <label>{getFullName() || user?.userData?.email}</label>
                        <div className={styles['header__separator']}></div>
                        <label className={styles['header__exit']} onClick={handleClickExit}>Exit</label>
                    </div>
                    <span className={styles['header__exit-icon']} onClick={handleClickExit}></span>
                </div>
            }
        </div>
    )
}