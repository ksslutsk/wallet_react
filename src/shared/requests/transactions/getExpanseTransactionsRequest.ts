import { routes } from "../../routes"

//date in format yyyy-mm
export const getExpenseTransactionRequest = (date: string, options: RequestInit) => {
    return fetch(routes.transactions.expense + `?date=${date}&perPage=${100}`, options);
}