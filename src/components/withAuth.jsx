// HOC - withAuth that gives access to user logged in and the setter function
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function withAuth(Component) {
    return function (props) {
        //get attributes to a reference using the useContext
        const { loggedInUser, setLoggedInUser } = useContext(AuthContext);
        return (
            //allowing every component that uses this HOC to have access to all the attributes of the reference
            <Component loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} {...props}>

            </Component>
        )
    }
}

export default withAuth