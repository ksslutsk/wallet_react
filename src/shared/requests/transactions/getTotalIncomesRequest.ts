import { routes } from "../../routes"

export const getTotalIncomesRequest = (options: RequestInit) => {
    return fetch(routes.transactions.totalIncomes, options);
}