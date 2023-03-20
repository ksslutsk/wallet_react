import { routes } from "../../routes"

export const registerUserRequest = (options: RequestInit): Promise<Response> => {
    return fetch(routes.auth.register, options);
}