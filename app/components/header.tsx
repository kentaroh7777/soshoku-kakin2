"use client"
import Link from "next/link"
import styled from 'styled-components';
import Navi from './navi'

const HeaderContainer = styled.header`
    background-color: #e0e0e0;
    padding: 0.5rem 2rem;
    display: flex;
    justify-content: space-between;
`;

const HeaderTitle = styled.div`
    font-family: 'Arial, sans-serif';
    font-size: 2rem;
    font-weight: bold;
`;

const NavUL = styled.ul`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding: 0.5rem;
`;

const NavItem = styled.li`
    list-style: none;
    padding: 0.5rem 1rem;
`;

const Header = () => {
    return(
        <header>
            <div className="header-title">
                <Link href="/">
                    <p>UserManager</p>
                </Link>
            </div>
            <Navi />
        </header>
    )
}

export default Header