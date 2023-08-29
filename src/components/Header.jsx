import Image from "next/image"
import { ThemeContext } from "../contexts/ThemeContext"
import { useContext } from "react"


function Header() {

    const { theme } = useContext(ThemeContext);

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
                    Hello Mr. John &nbsp;&nbsp;
                    <span>
                        <a href="#">sign out</a>
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Header