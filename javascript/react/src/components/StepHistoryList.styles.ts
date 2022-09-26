/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import type { Theme } from '@thematic/core'

export const addButtonStyles = {
	root: {
		padding: '0 4px 0 6px',
		whiteSpace: 'nowrap',
		width: '90%',
		margin: '0 5%',
	},
}

export const icons = {
	add: { iconName: 'Add' },
	chevronRight: { iconName: 'ChevronRight' },
	chevronDown: { iconName: 'ChevronDown' },
}

export const Container = styled.div`
	overflow: hidden;
	padding: 0.1rem;
	height: 100%;
	display: grid;
	grid-template-rows: calc(100% - 4rem) 4rem;
	width: 100%;
	border-top: 1px solid
		${({ theme }: { theme: Theme }) => theme.application().border().hex()};

	> div {
		overflow: hidden auto;
		height: 100%;
	}
`

export const ButtonContainer = styled.section`
	display: flex;
	align-items: flex-end;
	gap: 18px;
`
export const PanelHeader = styled.div`
	font-weight: 500;
	display: flex;
	gap: 0.5rem;
	width: 95%;
`
export const Verb = styled.b`
	text-transform: uppercase;
`

export const Columns = styled.span`
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	color: ${({ theme }: { theme: Theme }) =>
		theme.application().midContrast().hex()};
`

export const tableTransformStyle: React.CSSProperties = {
	padding: '1rem 0.5rem',
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
	overflow: 'auto',
	border: 'none',
	width: 'fit-content',
}

export const ListWrapper = styled.div`
	overflow: hidden auto;
	border-bottom: ${({ theme }: { theme: Theme }) =>
		theme.application().border().hex()};
`
