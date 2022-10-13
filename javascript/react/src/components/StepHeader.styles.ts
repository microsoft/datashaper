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
`

export const Index = styled.span`
	color: ${({ theme }) => theme.palette.neutralTertiary};
	font-size: 12px;
`

export const Verb = styled.span`
	text-transform: uppercase;
	font-weight: bold;
	color: ${({ theme }) => theme.palette.neutralSecondary};
`

export const Details = styled.span`
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	color: ${({ theme }) => theme.palette.neutralSecondaryAlt};
`
