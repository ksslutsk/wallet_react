import { originalFetch } from "../../../App"
import { routes } from "../../routes"

export const refreshUserRequest = (options: RequestInit) => {
    return originalFetch(routes.auth.refresh, options)
}