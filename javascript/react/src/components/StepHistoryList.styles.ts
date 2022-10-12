/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

export const buttonStyles = { width: 100 }

export const icons = {
	preview: { iconName: 'View' },
	add: { iconName: 'Add' },
	chevronRight: { iconName: 'ChevronRight' },
	chevronDown: { iconName: 'ChevronDown' },
}

export const Container = styled.div`
	width: 100%;
	height: 100%;
`

export const ButtonContainer = styled.div`
	padding: 8px;
	display: flex;
	justify-content: space-around;
	border-bottom: 1px solid ${({ theme }) => theme.palette.neutralQuaternaryAlt};
`

export const StepsContainer = styled.div`
	overflow: auto;
	height: 100%;
`

export const PanelHeader = styled.div`
	display: flex;
	gap: 4px;
	align-items: center;
`

export const StepIndex = styled.span`
	color: ${({ theme }) => theme.palette.neutralTertiary};
	font-size: 12px;
`

export const Verb = styled.span`
	text-transform: uppercase;
	font-weight: bold;
	color: ${({ theme }) => theme.palette.neutralSecondary};
`

export const Columns = styled.span`
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	color: ${({ theme }) => theme.palette.neutralSecondaryAlt};
`

export const tableTransformStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
	overflow: 'auto',
	border: 'none',
	width: 'auto',
}
