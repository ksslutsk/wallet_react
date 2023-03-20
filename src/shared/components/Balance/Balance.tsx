import { ChangeEvent, FunctionComponent, useContext, useEffect, useState } from "react";
import { grnToPenny, pennyToGrn, User, UserContext, UserData } from "../../libs";
import { userRequest } from "../../requests";
import { Button, ButtonVariant } from "../Button";
import { Input, InputVariant, InputType } from "../Input";
import styles from './Balance.module.scss';

interface PatchUserInterface {
    balance: number,
    firstName?: string,
    lastName?: string
}

export const Balance: FunctionComponent = () => {

    const { user, setUser } = useContext(UserContext)
    const [balance, setBalance] = useState<number | undefined>(user?.userData?.balance);
    const [accessBalance, setAccessBalance] = useState(false);

    useEffect(() => {
        setBalance(pennyToGrn(user?.userData?.balance));
        setAccessBalance(!!balance)
    }, [user]);

    const handeChangeBalanceInput = (event: ChangeEvent<HTMLInputElement>) => {
        setBalance(Number(event.target.value));
    }

    const updateBalance = (token: string) => {
        const newData: PatchUserInterface = {
            firstName: user?.userData?.firstName,
            lastName: user?.userData?.lastName,
            balance: Number(grnToPenny(balance))
        }

        const options: RequestInit = {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` },
            body: JSON.stringify(newData)
        }

        userRequest(options)
            .then((r: Response) => {
                if (!r.ok) throw new Error('Balance updating failed');
                return r.json();
            })
            .then((data: PatchUserInterface) => {
                setUser?.((prev: UserData) => {
                    const updatedUser: UserData = {
                        access_token: prev.access_token,
                        refresh_token: prev.refresh_token,
                        userData: { ...prev.userData, ...data }
                    }

                    return updatedUser;
                });
            });
    }

    const handleClickConfirm = () => {
        updateBalance(user?.access_token || '');
    }

    return (
        <div className={styles['balance__container']}>
            <div className={styles['balance-group']}>
                <label htmlFor="balance-input" className={styles['balance__label']}>Balance: </label>
                <div className={styles['balance-group__items']}>
                    <div className={styles['balance-group__item']}>
                        <Input id="balance-input"
                            value={balance || ''}
                            inputClassName={styles['balance-input']}
                            variant={InputVariant.SECONDARY}
                            type={InputType.TEXT}
                            pattern="[1-9]"
                            onChange={handeChangeBalanceInput}
                            disabled={accessBalance}
                            placeholder='0.00'
                        />
                        <span className={styles['balance-input__valuta']}>UAH</span>
                    </div>
                    <div className={styles['balance-group__item']}>
                        <Button color={ButtonVariant.WHITEBORDER}
                            rounded buttonClassName={styles['balance-group__button']}
                            onClick={handleClickConfirm}
                            disabled={accessBalance}
                        >Confirm</Button>
                    </div>
                </div>
            </div>
        </div>
    )
} 