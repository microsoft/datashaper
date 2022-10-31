/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

// TODO: this calc is because the CollapsiblePanel doesn't flex properly to constrain the width.
// so the total width ends up offset by the width of the chevron
export const Container = styled.div`
	width: calc(100% - 24px);
	display: flex;
	gap: 4px;
	align-items: center;
	justify-content: flex-start;
`

export const Index = styled.div`
	color: ${({ theme }) => theme.palette.neutralTertiaryAlt};
	font-size: 12px;
	text-align: right;
	min-width: 20px;
`

export const Verb = styled.div`
	text-transform: uppercase;
	font-weight: bold;
	color: ${({ theme }) => theme.palette.neutralSecondary};
	white-space: nowrap;
`

export const Details = styled.div`
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	text-align: left;
	color: ${({ theme }) => theme.palette.neutralSecondaryAlt};
`
