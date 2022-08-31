/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

export const addButtonStyles = {
	root: { padding: '0 4px 0 6px', whiteSpace: 'nowrap', width: '100%' },
}

export const icons = {
	add: { iconName: 'Add' },
	chevronRight: { iconName: 'ChevronRight' },
	chevronDown: { iconName: 'ChevronDown' },
}

export const Container = styled.div`
	display: block;
	overflow: auto;
	padding: 0.1rem;
`

export const ButtonContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 18px;
	margin-top: 1rem;
`
export const PanelHeader = styled.div`
	font-weight: 500;
	display: flex;
	gap: 0.5rem;
`
export const Verb = styled.span`
	text-transform: uppercase;
`

export const stepCardStyle = {
	card: {
		root: {
			border: 'none',
		},
	},
	actions: {
		root: {
			display: 'flex',
			justifyContent: 'space-between',
		},
	},
}

export const tableTransformStyle: React.CSSProperties = {
	padding: '1rem 0',
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
}
