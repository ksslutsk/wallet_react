import { ChangeEvent, FunctionComponent, useContext, useEffect, useState } from "react";
import { pennyToGrn, UserContext } from "../../libs";
import { Input, InputType, InputVariant } from "../Input";
import styles from './PrimaryBalance.module.scss';

export const PrimaryBalance: FunctionComponent = () => {
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

    return (
        <div className={styles['balance-group']}>
            <label className={styles['balance-label']}>Balance:</label>
            <Input id="balance"
                value={`${balance || ''} UAH`}
                inputClassName={styles['balance']}
                variant={InputVariant.SECONDARY}
                type={InputType.TEXT}
                pattern="[1-9]"
                onChange={handeChangeBalanceInput}
                disabled
                placeholder='0.00'
            />
        </div>
    )
}