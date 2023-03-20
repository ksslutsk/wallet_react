import { routes } from "../../routes"

export const userRequest = (options: RequestInit) => {
    return fetch(routes.user, options);
}