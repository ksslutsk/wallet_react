import { Dispatch, SetStateAction } from "react";
import { TotalByMoth, TransactionsResponse } from "../../../components/AccountingPage";
import { Category, Transaction } from "../../../shared/libs";
import { getCategoriesRequest, getExpenseTransactionRequest, getIncomeTransactionRequest, getTotalExpensesRequest, getTotalIncomesRequest } from "../../../shared/requests";
import { getIconsRequest } from "../../../shared/requests/icons/getIconsRequest";

export interface ActivePeriod {
    date?: string,
    index?: number
}

export interface Totals {
    incomes: TotalByMoth[],
    expenses: TotalByMoth[]
}

export interface Icon {
    id: number,
    path: string,
    userId?: number
}

interface ReportsPageHookResult {
    getTotals: (setTotals: Dispatch<SetStateAction<Totals>>, token: string) => void,
    getCategories: (setCategories: Dispatch<SetStateAction<Category[]>>, token: string) => void,
    getIcons: (setIcons: Dispatch<SetStateAction<Icon[]>>, token: string) => void,
    getDateForRequest: (dateString: string | undefined) => string,
    getTransactions: (setTransactions: Dispatch<SetStateAction<Transaction[]>>, token: string, date: string) => void,
}

export const useReportsPage = (): ReportsPageHookResult => {
    const getTotalExpenses = (options: RequestInit, setTotals: Dispatch<SetStateAction<Totals>>) => {

        getTotalExpensesRequest(options)
            .then((r: Response) => {
                return r.json();
            })
            .then((t: TotalByMoth[]) => {
                setTotals((prev) => ({ incomes: prev?.incomes || [], expenses: t }));
            })
    }

    const getTotalIncomes = (options: RequestInit, setTotals: Dispatch<SetStateAction<Totals>>) => {

        getTotalIncomesRequest(options)
            .then((r: Response) => {
                return r.json();
            })
            .then((t: TotalByMoth[]) => {
                setTotals((prev) => ({ expenses: prev?.expenses || [], incomes: t }));
            })
    }

    const getTotals = (setTotals: Dispatch<SetStateAction<Totals>>, token: string) => {

        const options: RequestInit = {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        }

        getTotalExpenses(options, setTotals);
        getTotalIncomes(options, setTotals);
    }

    const getCategories = (setCategories: Dispatch<SetStateAction<Category[]>>, token: string) => {
        const options: RequestInit = {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        }

        getCategoriesRequest(options)
            .then((r: Response) => {
                return r.json();
            })
            .then((categories: Category[]) => {
                setCategories(categories);
            })
    }

    const getIcons = (setIcons: Dispatch<SetStateAction<Icon[]>>, token: string) => {
        const options: RequestInit = {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        }

        getIconsRequest(options)
            .then((r: Response) => {
                return r.json()
            })
            .then((icons: Icon[]) => {
                setIcons(icons);
            })
    }

    const getDateForRequest = (dateString: string | undefined): string => {
        let date: Date;

        if (dateString) {
            date = new Date(dateString);
        }
        else {
            date = new Date();
        }

        const month = date.toLocaleString('default', { month: '2-digit' });
        const year = date.toLocaleString('default', { year: 'numeric' });

        return `${year}-${month}`;
    }

    const getTransactions = async (setTransactions: Dispatch<SetStateAction<Transaction[]>>, token: string, date: string) => {
        const options: RequestInit = {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        }

        const expenseResponse: TransactionsResponse = await (await getExpenseTransactionRequest(date, options)).json();
        const expenses: Transaction[] = expenseResponse.data;

        const incomeResponse: TransactionsResponse = await (await getIncomeTransactionRequest(date, options)).json();
        const incomes: Transaction[] = incomeResponse.data;

        setTransactions([...expenses, ...incomes]);
    }

    return {
        getTotals, getCategories, getIcons, getDateForRequest, getTransactions
    }
}