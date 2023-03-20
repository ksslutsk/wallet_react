import { FunctionComponent } from "react"
import { pennyToGrn } from "../../../../shared/libs";
import styles from './Totals.module.scss';

interface TotalsProps {
    expence: number,
    income: number
}

export const TotalsComponent: FunctionComponent<TotalsProps> = ({ expence, income }) => {
    return (
        <div className={styles['totals']}>
            <div className={styles['totals__text']}>
                Expences: <span className={styles['totals__text--expense']}>- {pennyToGrn(expence)?.toFixed(2)} uah</span>
            </div>
            <div className={styles['totals__separator']}></div>
            <div className={styles['totals__text']}>
                Incomes: <span className={styles['totals__text--incomes']}>+ {pennyToGrn(income)?.toFixed(2)} uah</span>
            </div>
        </div>
    )
}