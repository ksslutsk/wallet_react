import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { Accounting } from "../../components/AccountingPage";
import { Balance } from "../../shared/components";
import { DataContextProvider } from "../../shared/libs/utils/dataContext";
import styles from './MainPage.module.scss';

export const MainPage: FunctionComponent = () => {

    const navigate = useNavigate();

    const goToReports = () => {
        navigate('/reports');
    }

    return (
        <div className={styles['main']}>
            <div className={styles['balance-group']}>
                <Balance></Balance>
                <div className={styles['balance__header']} onClick={goToReports}>
                    Reports <span className={styles['balance__icon']}></span>
                </div>
            </div>

            <div className={styles['main__accounting']}>
                <DataContextProvider>
                    <Accounting></Accounting>
                </DataContextProvider>
            </div>
        </div >
    )
}