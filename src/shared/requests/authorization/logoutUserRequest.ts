import { routes } from "../../routes"

export const logoutUserRequest = (options: RequestInit) => {
    return fetch(routes.auth.logout, options);
}