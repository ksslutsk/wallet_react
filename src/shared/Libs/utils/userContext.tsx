import { Context, createContext, Dispatch, FunctionComponent, ReactNode, SetStateAction, useEffect, useState } from "react"
import { STORAGE_USER_KEY } from "./constants";

export interface User {
    id?: number,
    createAt?: Date,
    updateAt?: Date,
    email?: string,
    balance?: number,
    firstName?: string,
    lastName?: string,
}

export interface UserData {
    access_token?: string,
    refresh_token?: string,
    userData?: User
}

export interface UserDataContext {
    user?: UserData,
    setUser?: Dispatch<SetStateAction<UserData>>,
    isLogined?: () => boolean
}

export const UserContext: Context<UserDataContext> = createContext({});

interface ProviderProps {
    children: ReactNode
}

export const UserContextProvider: FunctionComponent<ProviderProps> = ({ children }) => {

    const [userDataContext, setUserDataContext] = useState<UserData>({});

    return (
        <UserContext.Provider value={{
            user: userDataContext, setUser: setUserDataContext, isLogined: () => {
                const user: UserData = JSON.parse(localStorage[STORAGE_USER_KEY] ?? '{}')
                return !!user.access_token;
            }
        }}>
            {children}
        </UserContext.Provider>
    );
}