"use client"
import Link from "next/link"
import Navi from './navi'
import { Session } from "next-auth";

interface HeaderProps {
    session: Session | null;
}

const Header: React.FC<HeaderProps> = ({ session }) => {
    return(
        <header>
            <Navi session={session} />
        </header>
    )
}

export default Header