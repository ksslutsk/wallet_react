import { routes } from "../../routes"

export const addIncomeTransactionRequest = (options: RequestInit) => {
    return fetch(routes.transactions.income, options);
}