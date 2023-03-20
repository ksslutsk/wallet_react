import { Context, createContext, Dispatch, FunctionComponent, ReactNode, SetStateAction, useEffect, useState } from "react"

export interface Category {
    typeCategory?: string,
    nameCategory?: string,
    iconId?: number,
    userId?: number,
    id?: number
}
export interface Transaction {
    description?: string,
    amount?: number,
    date?: string,
    categoryId?: number,
    userId?: number,
    id?: number
}

interface DataContext {
    categories?: Category[]
    setCategories?: Dispatch<SetStateAction<Category[]>>,
    transactions?: Transaction[],
    setTransactions?: Dispatch<SetStateAction<Transaction[]>>
}

export const TransactionsDataContext: Context<DataContext> = createContext({});

interface ProviderProps {
    children: ReactNode
}

export const DataContextProvider: FunctionComponent<ProviderProps> = ({ children }) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([])

    return (
        <TransactionsDataContext.Provider value={{
            categories: categories, setCategories: setCategories,
            transactions: transactions, setTransactions: setTransactions
        }}>
            {children}
        </TransactionsDataContext.Provider>
    )
}