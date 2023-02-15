import { Navigate, Outlet, Route } from "react-router-dom";

function PrivateRoute({ component: Component, authed, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Outlet />
                : <Navigate replace  to={{ pathname: '/login', state: { from: props.location } }} />}
        />
    )
}

export default PrivateRoute;