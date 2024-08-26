"use client"
import styled from 'styled-components';

const FooterContainer = styled.footer`
    background-color: #e0e0e0;
    padding: 1rem 2rem;
    text-align: center;
`;

const FooterText = styled.p`
    font-family: 'Arial, sans-serif';
    font-size: 1rem;
    color: #333;
`;


const Footer = () => {
    return(
        <footer>
            <p className="footer-text">HFPO</p>
        </footer>
    )
}

export default Footer