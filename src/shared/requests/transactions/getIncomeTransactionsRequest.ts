import { routes } from "../../routes"

//date in format yyyy-mm
export const getIncomeTransactionRequest = (date: string, options: RequestInit) => {
    return fetch(routes.transactions.income + `?date=${date}&perPage=${100}`, options);
}