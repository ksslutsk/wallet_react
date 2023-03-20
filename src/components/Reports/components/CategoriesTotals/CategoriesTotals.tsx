import clsx from "clsx";
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from "react";
import { Icon } from "../../../../pages";
import { Category, pennyToGrn, Transaction } from "../../../../shared/libs";
import styles from './CategoriesTotals.module.scss';

interface CategoriesTotalsProps {
    transactions: Transaction[],
    categories: Category[],
    icons: Icon[],
    setActiveCategoryOnParent: Dispatch<SetStateAction<number>>
}
interface CategoryTotal {
    category: Category,
    total: number,
}
export const CategoriesTotals: FunctionComponent<CategoriesTotalsProps> = ({ transactions = [], categories = [], icons = [], setActiveCategoryOnParent }) => {

    const [activeTab, setActiveTab] = useState(false);
    const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<number>();

    const summarize = () => {
        const total: CategoryTotal[] = [];
        categories.forEach((c: Category) => {
            total[c.id || 0] = ({ category: c, total: 0 })
        });

        transactions.forEach((t: Transaction) => {
            total[t.categoryId || 0].total += t.amount || 0;
        })

        setCategoryTotals(total);
    }

    const getIconPath = (id: number): string => {
        const result: Icon | undefined = icons.find((i: Icon) => {
            return i.id === id
        });

        if (result) {
            return result.path;
        }

        return '';
    }

    const handleItemClick = (categoryId: number) => {
        setActiveCategoryId(categoryId);
        setActiveCategoryOnParent(categoryId);
    }

    useEffect(() => {
        summarize();
    }, [transactions]);

    return (
        <div className={styles['container']}>
            <div className={styles['switcher']}>
                <span className={styles['switcher__left-arrow']} onClick={() => { setActiveTab(prev => !prev); }}>left</span>
                <p className={styles['switcher__description']}>{activeTab ? 'expenses' : 'incomes'}</p>
                <span className={styles['switcher__right-arrow']} onClick={() => { setActiveTab(prev => !prev); }}>right</span>
            </div>

            <div className={styles['categories']}>
                {categoryTotals.filter((c: CategoryTotal) => c.category.typeCategory === (activeTab ? 'expense' : 'income'))
                    .map((c: CategoryTotal) => {
                        return (
                            <div className={styles['categories-item__wrapper']}>
                                <div className={styles['categories-item']} key={c.category.id} onClick={() => handleItemClick(c.category.id || 0)}>
                                    <p className={styles['categories-item__amount']}>{pennyToGrn(c.total)?.toFixed(2)}</p>
                                    <div className={styles['categories-item__icon-container']} >
                                        <img
                                            className={clsx([
                                                styles['categories-item__icon'],
                                                { [styles['categories-item__icon--active']]: activeCategoryId === c.category.id }
                                            ])}
                                            src={`http://localhost:3001/${getIconPath(c.category.iconId!)}`}
                                        />
                                        <div className={clsx([
                                            styles['categories-item__icon-background'],
                                            { [styles['categories-item__icon-background--active']]: activeCategoryId === c.category.id }
                                        ])}></div>
                                    </div>
                                    <p className={styles['categories-item__name']}>{c.category.nameCategory}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}