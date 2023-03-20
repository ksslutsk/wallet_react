import { routes } from "../../routes"

export const addExpenseTransactionRequest = (options: RequestInit) => {
    return fetch(routes.transactions.expense, options);
}