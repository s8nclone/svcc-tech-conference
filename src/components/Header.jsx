import Image from "next/image"
import { ThemeContext } from "../contexts/ThemeContext"
import { useContext } from "react"
import withAuth from "./withAuth";


function Header({ loggedInUser, setLoggedInUser }) {

    const { theme } = useContext(ThemeContext);

    function LoggedIn({ loggedInUser, setLoggedInUser }) {
        return (
            <div>
                <span>Welcome back {loggedInUser} </span>
                <button className="btn btn-secondary btn-sm"
                    onClick={()=> { //onclick, logs user out
                        setLoggedInUser("");
                    }}
                >Logout</button>
            </div>
        )
    }

    function NotLoggedIn({ loggedInUser, setLoggedInUser }) {
        return (
            <button className="btn btn-primary btn-sm"
                onClick={(e)=> {
                    e.preventDefault();
                    const username = window.prompt("Enter a username:", "");
                    setLoggedInUser(username);
                }}
            >Login</button>
        )
    }

  return (
    <div className="padT4 padB4">
        <div className="container mobile-container">
            <div className="d-flex justify-content-between">
                <div>
                    <Image 
                        alt="SVCC home logo"
                        src="/images/SVCClogo.png"
                        width="50" 
                        height="20"
                    />
                </div>
                <div className="light">
                    <h4 className={
                    theme === "light" ? "" : "header-title text-info"
                }>
                        SASS & Vite Code Camp
                    </h4>
                </div>
                <div className={
                    theme === "light" ? "" : "text-info"
                }>
                    {loggedInUser && loggedInUser.length > 0
                        ? <LoggedIn loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} /> 
                        : <NotLoggedIn loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default withAuth(Header)