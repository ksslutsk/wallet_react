import { routes } from "../../routes"

export const getIconsRequest = (options: RequestInit) => {
    return fetch(routes.icons, options);
}