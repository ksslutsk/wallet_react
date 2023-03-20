import { Dispatch, FunctionComponent, SetStateAction, useContext, useEffect, useState } from "react";
import { TransactionsResponse } from "../../components/AccountingPage";
import { CategoriesTotals, Charts, Header, TotalsComponent } from "../../components/Reports";
import { Category, STORAGE_USER_KEY, Transaction, UserContext, UserData } from "../../shared/libs";
import { getCategoriesRequest, getExpenseTransactionRequest, getIncomeTransactionRequest } from "../../shared/requests";
import { ActivePeriod, Icon, Totals, useReportsPage } from "./hooks";
import styles from './ReportsPage.module.scss';


export const ReportsPage: FunctionComponent = () => {

    const { getTotals, getCategories, getIcons, getDateForRequest, getTransactions } = useReportsPage();

    const [activePeriod, setActivePeriod] = useState<ActivePeriod>({});

    //for TotalsComponent
    const [totals, setTotals] = useState<Totals>({ incomes: [], expenses: [] });

    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [icons, setIcons] = useState<Icon[]>([]);

    const [activeCategoryId, setActiveCategoryId] = useState<number>(0);

    const [chartTransactions, setChartTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const user: UserData = JSON.parse(localStorage[STORAGE_USER_KEY] ?? '{}');
        if (user?.access_token) {
            getTotals(setTotals, user.access_token);
            getIcons(setIcons, user.access_token);
            getCategories(setCategories, user.access_token);
        }
    }, []);

    useEffect(() => {
        const user: UserData = JSON.parse(localStorage[STORAGE_USER_KEY] ?? '{}');

        if (user?.access_token) {
            const date = getDateForRequest(activePeriod.date);
            getTransactions(setTransactions, user.access_token, date);
        }

    }, [activePeriod]);

    useEffect(() => {
        setChartTransactions(
            transactions.filter((t: Transaction) => {
                return t.categoryId === activeCategoryId
            })
        );
    }, [activeCategoryId]);

    return (
        <div className={styles['reports']}>
            <div className={styles['reports__header']}>
                <Header totals={totals.expenses} setPeriod={setActivePeriod}></Header>
            </div>

            <div className={styles['reports__period-totals']}>
                <TotalsComponent
                    income={totals.incomes[activePeriod.index || 0]?.total || 0}
                    expence={totals.expenses[activePeriod.index || 0]?.total || 0}
                ></TotalsComponent>
            </div>

            <CategoriesTotals categories={categories} transactions={transactions} icons={icons}
                setActiveCategoryOnParent={setActiveCategoryId}></CategoriesTotals>

            <Charts
                transactions={chartTransactions}
            ></Charts>
        </div>
    )
}