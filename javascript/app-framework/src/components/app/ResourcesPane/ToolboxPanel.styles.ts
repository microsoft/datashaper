/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const Container = styled.div`
    height: 100%;
`

export const Header = styled.div`
    height: 37px;
    display: flex;
    align-items: center;
    padding: 0 4px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
    background: ${({ theme }) => theme.palette.neutralLighterAlt};
    color: ${({ theme }) => theme.palette.neutralSecondary};
    font-size: 12px;
    font-weight: bold;
`

export const Content = styled.div`
    height: 100%;
    overflow-y: auto;
    padding: 0;
`

export const ToolboxList = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
`

export const ToolboxListItem = styled.li`
`