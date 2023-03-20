import { routes } from "../../routes"

export const getTotalExpensesRequest = (options: RequestInit) => {
    return fetch(routes.transactions.totalExpenses, options);
}