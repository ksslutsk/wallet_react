import { routes } from "../../routes";

export const loginUserRequest = (options: RequestInit): Promise<Response> => {
    return fetch(routes.auth.login, options);
}