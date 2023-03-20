import { FunctionComponent, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: ReactNode
    isLogined: boolean
}
export const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({ children, isLogined }) => {
    if (isLogined) {
        return <>{children}</>
    }
    else {
        return <Navigate to='/auth' />;
    }
}