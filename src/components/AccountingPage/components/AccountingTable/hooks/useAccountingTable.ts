import { Dispatch, SetStateAction } from "react";
import { Category, Transaction, UserData, UserDataContext } from "../../../../../shared/libs";
import { deleteExpenseTransactionRequest, deleteIncomeTransactionRequest } from "../../../../../shared/requests";

export enum TableVariant {
    EXPENSE = 'expense',
    INCOME = 'income'
}

interface AccountingTableHookresult {
    getCategoryName: (id: number | undefined, categories: Category[]) => string | undefined,
    deleteTransaction: (item: Transaction, variant: TableVariant, setTransactions?: Dispatch<SetStateAction<Transaction[]>>, data?: UserDataContext) => void
}

export const useTable = (): AccountingTableHookresult => {

    const getCategoryName = (id: number | undefined, categories: Category[]) => {
        if (categories) {
            const curr = categories.find((c: Category) => {
                return c.id === id;
            })

            return curr?.nameCategory;
        }
    }

    const deleteTransactionRequest = (id: number, options: RequestInit, variant: TableVariant) => {
        if (variant === TableVariant.EXPENSE) {
            return deleteExpenseTransactionRequest(id, options);
        }
        else {
            return deleteIncomeTransactionRequest(id, options);
        }
    }

    const deleteTransaction = (item: Transaction, variant: TableVariant, setTransactions?: Dispatch<SetStateAction<Transaction[]>>, data?: UserDataContext) => {
        const token: string = data?.user?.access_token || '';

        const options: RequestInit = {
            method: "DELETE",
            headers: { 'authorization': `Bearer ${token}` }
        }

        if (item.id) {
            deleteTransactionRequest(item.id, options, variant)
                .then((r: Response) => {
                    if (r.ok) {
                        return r.json();
                    }
                })
                .then(({ newBalance }) => {
                    setTransactions?.
                        ((prev: Transaction[]) => (
                            prev.filter((el: Transaction) => {
                                return el.id !== item.id;
                            })
                        ));

                    data?.setUser?.((prev: UserData) => ({
                        access_token: prev.access_token,
                        refresh_token: prev.refresh_token,
                        userData: {
                            ...prev.userData, balance: newBalance
                        }
                    }));
                });
        }
    }

    return {
        getCategoryName, deleteTransaction
    };

}