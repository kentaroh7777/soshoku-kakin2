import styled from 'styled-components'

export const SignContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const StyledInput = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
`

export const StyledButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
  font-size: 1.0rem;

  &:hover {
    background-color: #45a049;
  }
`