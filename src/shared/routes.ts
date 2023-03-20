const root = 'http://localhost:3001/api';

export const routes = {
    user: `${root}/me`,
    auth: {
        login: `${root}/auth/login`,
        register: `${root}/auth/registration`,
        logout: `${root}/auth/logout`,
        refresh: `${root}/auth/refresh`,
    },
    categories: {
        categories: `${root}/categories`,
    },
    transactions: {
        expense: `${root}/transactions/expense`,
        income: `${root}/transactions/income`,
        totalExpenses: `${root}/transactions/expense/total-by-month`,
        totalIncomes: `${root}/transactions/income/total-by-month`
    },
    icons: `${root}/icons`,
}