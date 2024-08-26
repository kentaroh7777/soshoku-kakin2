"use client"
import Link from "next/link"
import { FaUserPlus, FaUser } from "react-icons/fa"
import { RiLoginBoxLine, RiLogoutBoxRLine, RiUserEditLine } from "react-icons/ri"
import { FaTimesCircle } from "react-icons/fa"
import { loginUserID } from '../utils/useAuth'

const Navi = () => {
    const userID = loginUserID()
    if (userID === ""){
        return(
            <nav>
                <ul className="header-navi">
                    <li className="header-navi-item"><Link href="/user/signup"><FaUserPlus className="header-navi-icon" />新規登録</Link></li>
                    <li className="header-navi-item"><Link href="/user/login"><RiLoginBoxLine className="header-navi-icon" />ログイン</Link></li>
                </ul>
            </nav>
        )
    }else{
        return(
            <nav>
                <ul className="header-navi">
                    <li className="header-navi-item"><Link href={`/user/profile/${userID}`}><FaUser className="header-navi-icon" />プロフィール</Link></li>
                    <li className="header-navi-item"><Link href="/user/logout"><RiLogoutBoxRLine className="header-navi-icon" />ログアウト</Link></li>
                    <li className="header-navi-item"><Link href={`/user/delete/${userID}`}><FaTimesCircle className="header-navi-icon" />ユーザー削除</Link></li>
                </ul>
            </nav>
        )
    }
}

export default Navi