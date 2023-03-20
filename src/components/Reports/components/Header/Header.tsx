import { Dispatch, FunctionComponent, SetStateAction, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActivePeriod } from "../../../../pages";
import { Balance, PrimaryBalance } from "../../../../shared/components";
import { UserContext } from "../../../../shared/libs";
import { TotalByMoth } from "../../../AccountingPage";
import styles from './Header.module.scss';

interface CurrentPeriod {
    total?: TotalByMoth,
    index?: number
}

interface HeaderProps {
    setPeriod: Dispatch<SetStateAction<ActivePeriod>>,
    totals: TotalByMoth[]
}

export const Header: FunctionComponent<HeaderProps> = ({ totals, setPeriod }) => {

    const [currentPeriod, setCurrentPeriod] = useState<CurrentPeriod>({});

    const navigate = useNavigate();
    const goToMainPage = () => {
        navigate('/main');
    }

    useEffect(() => {
        if (totals) {
            setCurrentPeriod({ total: totals[0], index: 0 });
        }
    }, [totals]);

    const getCurrPeriod = (dateString: string) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.toLocaleString('default', { year: 'numeric' });

        return `${month} ${year}`;
    }

    const getNextMonth = () => {
        if (currentPeriod?.index !== 0) {
            const newIndex = currentPeriod?.index! - 1;
            setCurrentPeriod({ total: totals[newIndex], index: newIndex });
            setPeriod({ index: newIndex, date: totals[newIndex]?.group_month });
        }
    }

    const getPrevMonth = () => {
        if (currentPeriod?.index !== (totals.length - 1)) {
            const newIndex = currentPeriod?.index! + 1;
            setCurrentPeriod({ total: totals[newIndex], index: newIndex });
            setPeriod({ index: newIndex, date: totals[newIndex]?.group_month });
        }
    }

    const [width, setWidth] = useState(window.innerWidth);
    const minDesktop = 1280;

    useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleWindowResize);

        return () => window.removeEventListener("resize", handleWindowResize);
    }, [])


    return (
        <div className={styles['header']}>
            <div className={styles['header__go-back']}>
                <span className={styles['header__go-back-icon']} onClick={goToMainPage}></span>
                <span className={styles['header__go-back-text']} onClick={goToMainPage}>Main page</span>
            </div>

            <div className={styles['header-wrapper']}>
                <div className={styles['header-balance']}>
                    {width < 1280 ? <PrimaryBalance /> : <Balance />}
                </div>

                <div className={styles['header__curr-period']}>
                    Current period:
                    <div className={styles['switcher']}>
                        <span className={styles['switcher__left-arrow']} onClick={getNextMonth}></span>
                        <p className={styles['switcher__date']}>{getCurrPeriod(currentPeriod?.total?.group_month || '')}</p>
                        <span className={styles['switcher__right-arrow']} onClick={getPrevMonth}></span>
                    </div>
                </div>
            </div>
        </div>
    )
}