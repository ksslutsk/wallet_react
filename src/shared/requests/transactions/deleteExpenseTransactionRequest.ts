import { routes } from "../../routes"

export const deleteExpenseTransactionRequest = (id: number, options: RequestInit) => {
    const url = routes.transactions.expense + `/${id}`;
    return fetch(url, options);
}