import { routes } from "../../routes"

export const deleteIncomeTransactionRequest = (id: number, options: RequestInit) => {
    const url = routes.transactions.income + `/${id}`;
    return fetch(url, options);
}