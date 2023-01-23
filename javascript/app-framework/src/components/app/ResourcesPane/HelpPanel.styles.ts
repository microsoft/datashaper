import styled from 'styled-components'

export const Container = styled.div`
    height: 100%;
`

export const Header = styled.div`
    height: 37px;
    display: flex;
    align-items: center;
    padding: 0 4px;
    gap: 4px;
    border-top: 2px solid;
    border-bottom: 1px solid;
    border-color: ${({ theme }) => theme.palette.neutralTertiaryAlt};
    background: ${({ theme }) => theme.palette.neutralLighterAlt};
    color: ${({ theme }) => theme.palette.neutralSecondary};
    font-size: 12px;
    font-weight: bold;
`

export const Content = styled.div`
    padding: 10px;
`
