"use client"
import Link from "next/link"
import { FaUserPlus, FaUser } from "react-icons/fa"
import { RiLoginBoxLine, RiLogoutBoxRLine } from "react-icons/ri"
import { FaTimesCircle } from "react-icons/fa"
import { loginUserID } from '../utils/useAuth'
import { LoginButton, LogoutButton } from './authButton'
import { Session } from "next-auth";

interface NaviProps {
    session: Session | null;
}

const Navi: React.FC<NaviProps> = ({ session }) => {
//    const userID = loginUserID()
//    const userID = ""
    if (session){
        return(
            <nav>
                <ul className="header-navi">
                    <li className="header-navi-item"><LogoutButton /></li>
                </ul>
            </nav>
        )
    }else{
        return(
            <nav>
                <ul className="header-navi">
                    <li className="header-navi-item"><LoginButton /></li>
                </ul>
            </nav>
        )
    }
}

export default Navi