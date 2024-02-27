/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from 'styled-components'

export const Container = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.palette.neutralQuaternary};
    padding: 8px;
    display: flex;
    text-align: right;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
`
