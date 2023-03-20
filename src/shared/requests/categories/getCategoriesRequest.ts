import { routes } from "../../routes"

export const getCategoriesRequest = (options: RequestInit) => {
    return fetch(routes.categories.categories, options);
}