"use client"
import Link from "next/link"
import { FaUserPlus, FaUser } from "react-icons/fa"
import { RiLoginBoxLine, RiLogoutBoxRLine } from "react-icons/ri"
import { FaTimesCircle } from "react-icons/fa"
import { loginUserID } from '../utils/useAuth'

const Navi = () => {
    const userID = loginUserID()
//    const userID = ""
    if (userID === ""){
        return(
            <nav>
                <ul className="header-navi">
                    <li className="header-navi-item"><Link href="/user/login"><RiLoginBoxLine className="header-navi-icon" />ログイン</Link></li>
                </ul>
            </nav>
        )
    }else{
        return(
            <nav>
                <ul className="header-navi">
                    <li className="header-navi-item"><Link href="/user/logout"><RiLogoutBoxRLine className="header-navi-icon" />ログアウト</Link></li>
                </ul>
            </nav>
        )
    }
}

export default Navi