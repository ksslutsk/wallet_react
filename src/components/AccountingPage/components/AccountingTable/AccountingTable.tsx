import { FunctionComponent, useContext, useState } from "react";
import styles from './AccountingTable.module.scss';
import { Category, Transaction, TransactionsDataContext } from "../../../../shared/libs";
import clsx from "clsx";
import { pennyToGrn, UserContext } from "../../../../shared/libs";
import { Modal } from "../../../../shared/components/Modal";
import { TableVariant, useTable } from "./hooks/useAccountingTable";

interface TableProps {
    transactions: Transaction[],
    categories: Category[],
    variant: TableVariant
}

const getAmountColor = (variant: TableVariant) => {
    switch (variant) {
        case TableVariant.EXPENSE: {
            return styles['amount--expense'];
        }
        case TableVariant.INCOME: {
            return styles['amount--income'];
        }
    }
}

export const AccountingTable: FunctionComponent<TableProps> = ({ transactions, categories, variant }) => {

    const data = useContext(UserContext);
    const { setTransactions } = useContext(TransactionsDataContext);

    const [showModal, setShowModal] = useState(false);
    const [activeTransaction, setActiveTransaction] = useState<Transaction>({});

    const { getCategoryName, deleteTransaction } = useTable();

    const handleDeleteTransaction = (item: Transaction) => {
        setShowModal(true);
        setActiveTransaction(item);
    }

    return (
        <div className={styles['table']}>
            <div className={styles['table-header']}>
                <div className={clsx([
                    styles['table-header__date'],
                    styles['table-header__text']
                ]
                )}>DATE</div>
                <div className={clsx([
                    styles['table-header__description'],
                    styles['table-header__text']
                ]
                )}>DESCRIPTION</div>
                <div className={clsx([
                    styles['table-header__category'],
                    styles['table-header__text']
                ]
                )}>CATEGORY</div>
                <div className={clsx([
                    styles['table-header__sum'],
                    styles['table-header__text']
                ]
                )}>SUM</div>
                <div className={clsx([
                    styles['table-delete'],
                    styles['table-header__text']
                ]
                )}></div>
            </div>

            {showModal &&
                <Modal closeAfterAction closeModal={() => { setShowModal(false) }}
                    question='Are you sure?'
                    doConfirm={() => deleteTransaction(activeTransaction, variant, setTransactions, data)}
                    doCancel={() => { setActiveTransaction({}) }}
                ></Modal>
            }

            <div className={styles['table-list']}>
                {
                    transactions?.map((item: Transaction) => (
                        <>
                            <div className={styles['table-row']} key={item?.id}>

                                <div className={clsx([
                                    styles['table-field'],
                                    styles['table-date']
                                ])}>{item?.date}</div>

                                <div className={clsx([
                                    styles['table-field'],
                                    styles['table-description']
                                ])}><span className={styles['table-description__text']}>{item?.description}</span></div>

                                <div className={clsx([
                                    styles['table-field'],
                                    styles['table-category']
                                ])}>{getCategoryName(item?.categoryId, categories)}</div>

                                <div className={clsx([
                                    styles['table-field'],
                                    styles['table-sum'],
                                    getAmountColor(variant)
                                ])}>{pennyToGrn(item?.amount)?.toFixed(2)} грн</div>

                                <div className={clsx([
                                    styles['table-field'],
                                    styles['table-delete']
                                ])}>
                                    <div className={styles['table-delete__shadow']}>
                                        <div className={styles['table-delete__icon']}
                                            onClick={() => handleDeleteTransaction(item)}
                                        ></div>
                                    </div>
                                </div>

                            </div>

                            <div className={styles['mobile-row']}>
                                <div className={styles['mobile-left']}>
                                    <div className={styles['mobile-description']}>{item?.description}</div>
                                    <div className={styles['mobile-date-cat']}>
                                        <div className={styles['mobile-date-cat__date']}>{item?.date}</div>
                                        <div className={styles['mobile-date-cat__category']}>{getCategoryName(item?.categoryId, categories)}</div>
                                    </div>
                                </div>

                                <div className={clsx([
                                    styles['mobile-amount'],
                                    getAmountColor(variant)
                                ])}>{pennyToGrn(item?.amount)?.toFixed(2)} грн</div>
                                <div className={styles['mobile-delete']} onClick={() => handleDeleteTransaction(item)}></div>
                            </div>
                        </>

                    ))
                }
            </div>
        </div>
    )
}