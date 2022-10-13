/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

export const buttonStyles = { width: '100%' }

export const icons = {
	preview: { iconName: 'View' },
	add: { iconName: 'Add' },
	chevronRight: { iconName: 'ChevronRight' },
	chevronDown: { iconName: 'ChevronDown' },
}

export const Container = styled.div`
	overflow: hidden;
	height: 100%;
	display: grid;
	grid-template-rows: calc(100% - 4rem) 4rem;
	width: 100%;

	> div {
		overflow: hidden auto;
		height: 100%;
	}
`

export const ButtonContainer = styled.div`
	display: flex;
`
export const PanelHeader = styled.div`
	font-weight: 500;
	display: flex;
	gap: 0.5rem;
	width: 100%;
`
export const Verb = styled.b`
	text-transform: uppercase;
`

export const Columns = styled.span`
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	color: ${({ theme }) => theme.palette.neutralTertiary};
`

export const tableTransformStyle: React.CSSProperties = {
	padding: '1rem 0.5rem',
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
	overflow: 'auto',
	border: 'none',
	width: 'auto',
}

export const ListWrapper = styled.div`
	overflow: hidden auto;
	border-bottom: ${({ theme }) => theme.palette.neutralTertiaryAlt};
`

export const StepIndex = styled.span`
	color: ${({ theme }) => theme.palette.neutralTertiaryAlt};
`
