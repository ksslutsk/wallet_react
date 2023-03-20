import clsx from "clsx";
import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { Button, ButtonVariant } from "../../../../shared/components";
import { UserContext } from "../../../../shared/libs";
import { AccountingHeader } from "../AccountingHeader";
import { AccountingTable, TableVariant } from "../AccountingTable";
import styles from './Accounting.module.scss';
import { getCategoriesRequest, getExpenseTransactionRequest, getIncomeTransactionRequest, getTotalExpensesRequest, getTotalIncomesRequest } from "../../../../shared/requests";
import { Category, Transaction, TransactionsDataContext } from "../../../../shared/libs/utils/dataContext";
import { SummaryWrapper, TotalByMoth } from "../Summary";

export interface TransactionsResponse {
    data: Transaction[]
    meta: any
}

export const Accounting: FunctionComponent = () => {
    //true - expenses, false - incomes
    const [activeTab, setActiveTab] = useState(true);

    const [totals, setTotals] = useState<TotalByMoth[]>([]);

    const data = useContext(UserContext);

    const { transactions, setTransactions, setCategories, categories } = useContext(TransactionsDataContext);

    const getDateForRequest = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

        return `${year}-${month}`;
    }

    const getCategories = (token: string) => {

        const options: RequestInit = {
            method: 'GET',
            headers: { 'authorization': `Bearer ${token}` },
        };

        getCategoriesRequest(options)
            .then((resp: Response) => {
                return resp.json()
            })
            .then((categories: Category[]) => {
                setCategories?.(categories.filter((e: Category) => { return e.typeCategory === (activeTab ? "expense" : "income") }))
            })
    }

    const getTransactionsRequest = (transactionType: boolean, date: string, options: RequestInit) => {
        if (transactionType) {
            return getExpenseTransactionRequest(date, options);
        }
        else {
            return getIncomeTransactionRequest(date, options);
        }
    }

    const getTotalsRequest = (options: RequestInit) => {
        if (activeTab) {
            return getTotalExpensesRequest(options);
        }
        else {
            return getTotalIncomesRequest(options);
        }
    }

    const getTotals = () => {
        const options: RequestInit = {
            method: "GET",
            headers: { "Authorization": `Bearer ${data.user?.access_token}` }
        }

        getTotalsRequest(options)
            .then((r: Response) => {
                return r.json()
            })
            .then((totals: TotalByMoth[]) => {
                setTotals(totals.slice(0, 6));
            })
    }

    const getTransactions = () => {
        const options: RequestInit = {
            method: "GET",
            headers: { "Authorization": `Bearer ${data.user?.access_token}` }
        }

        getTransactionsRequest(activeTab, getDateForRequest(), options)
            .then((r: Response) => {
                return r.json();
            })
            .then((t: TransactionsResponse) => {
                setTransactions?.(t.data);
            })
    }

    useEffect(() => {
        if (data.user?.access_token) {
            getTransactions();
            getCategories(data.user?.access_token || '');
            getTotals();
        }
    }, [data.user]);

    useEffect(() => {
        if (data.user?.access_token) {
            getTransactions();
            getCategories(data.user?.access_token || '');
            getTotals();
        }
    }, [activeTab]);


    const desktopRef = useRef<HTMLDivElement>(null);
    const tabletRef = useRef<HTMLDivElement>(null);

    return (
        <div className={styles['accounting']} id="accounting" ref={tabletRef}>
            <div className={styles['accounting__switcher']}>
                <Button color={ButtonVariant.SECONDARY}
                    buttonClassName={clsx(
                        styles['accounting__switcher-item'],
                        { [styles['accounting__switcher-item--active']]: activeTab }
                    )}
                    onClick={() => setActiveTab(true)}
                >Expences</Button>
                <Button color={ButtonVariant.SECONDARY}
                    buttonClassName={clsx(
                        styles['accounting__switcher-item'],
                        { [styles['accounting__switcher-item--active']]: !activeTab }
                    )}
                    onClick={() => setActiveTab(false)}
                >Incomes</Button>
            </div>

            <div className={styles['accounting__desk']}>
                <AccountingHeader transactionVariant={activeTab}></AccountingHeader>
                <div className={styles['accounting__row']} ref={desktopRef} id="acconting-row">
                    <AccountingTable transactions={transactions || []} categories={categories || []}
                        variant={(activeTab ? TableVariant.EXPENSE : TableVariant.INCOME)}></AccountingTable>
                    <SummaryWrapper totals={totals} desktopContainerRef={desktopRef} tabletContainerRef={tabletRef} />
                </div>
            </div>

        </div>
    )
}