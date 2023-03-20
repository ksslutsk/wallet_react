import { FunctionComponent, useEffect, useState } from "react";
import styles from './Charts.module.scss';
import { pennyToGrn, Transaction } from "../../../../shared/libs";

interface BarProps {
    amount: string,
    description: string,
    height?: number,
    width?: number,
    color: string
}

const Bar: FunctionComponent<BarProps> = ({ amount, description, height, color }) => {
    return (
        <div className={styles['bar__container']}>
            <label className={styles["bar__amount"]}>{amount} грн</label>
            <div className={styles['bar']} style={{ height: height, backgroundColor: color }}></div>
            <label className={styles['bar__description']}>{description}</label>
        </div>
    )
}

const HorizontalBar: FunctionComponent<BarProps> = ({ amount, description, width, color }) => {
    return (
        <div className={styles['horizontal-bar__container']}>
            <div className={styles['horizontal-bar__head']}>
                <label className={styles['horizontal-bar__description']}>{description}</label>
                <label className={styles["horizontal-bar__amount"]}>{amount} грн</label>
            </div>
            <div className={styles['horizontal-bar']} style={{ width: width, backgroundColor: color }}></div>
        </div>
    )
}

interface ChartProps {
    transactions?: Transaction[]
}

export const Charts: FunctionComponent<ChartProps> = ({ transactions }) => {

    const findMax = (transactions: Transaction[] = []): Transaction => {
        let temp: Transaction = { amount: -Infinity };

        transactions.forEach((t: Transaction) => {
            if (t.amount! > temp.amount!) {
                temp = t;
            }
        });

        return temp;
    }

    const findHeight = (currAmount: number = 0, maxAmount: number = -Infinity, fullHeight: number) => {
        return fullHeight * (currAmount / maxAmount);
    }

    const findWidth = (currAmount: number = 0, maxAmount: number = -Infinity, width: number) => {
        return (width - 50) * (currAmount / maxAmount);
    }

    const fullHeight: number = 328;
    const maxTransaction: Transaction = findMax(transactions);

    const [width, setWidth] = useState(window.innerWidth);
    const minTablet = 768;

    useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleWindowResize);

        return () => window.removeEventListener("resize", handleWindowResize);
    }, [])

    return (
        <div className={styles['chart__container']}>

            <div className={styles['chart__background']}>
                {[...Array(8)].map(() => {
                    return <div className={styles['chart__background-line']}></div>
                })}
            </div>

            {transactions?.map((t: Transaction, index: number) => {
                return minTablet < width ?
                    <Bar
                        amount={pennyToGrn(t.amount)?.toFixed(2) || ''}
                        description={t.description || ''}
                        color={index / 3 !== 0 ? "#FFDAC0" : "#FF751D"}
                        height={findHeight(t.amount, maxTransaction.amount, fullHeight)}
                    />
                    :
                    <HorizontalBar
                        amount={pennyToGrn(t.amount)?.toFixed(2) || ''}
                        description={t.description || ''}
                        color={index / 3 !== 0 ? "#FFDAC0" : "#FF751D"}
                        width={findWidth(t.amount, maxTransaction.amount, width)}
                    />
            })}
        </div>
    )
}