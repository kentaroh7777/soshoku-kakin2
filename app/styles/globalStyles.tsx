"use client"
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
    padding: 2rem;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  button {
    cursor: pointer;
  }

  @media (min-width: 769px) {
    body {
      font-size: 16px;
    }
  }
`;

export default GlobalStyle;
