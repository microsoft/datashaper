/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@data-wrangling-components/core'
import { DefaultButton, Dropdown } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { DetailText } from '../DetailText/DetailText.js'
import { useOutputPreview, useTableSelection } from './TableListBar.hooks.js'

export const TableListBar: React.FC<{
	inputs: TableContainer[]
	derived: TableContainer[]
	onSelect?: (name: string) => void
	selected?: string
}> = memo(function TableListBar({ inputs, derived, onSelect, selected }) {
	const { options, onChange } = useTableSelection(inputs, derived, onSelect)

	const { onClick } = useOutputPreview(derived, onSelect)

	return (
		<ListContainer>
			<Dropdown
				styles={{
					root: {
						width: 200,
					},
				}}
				placeholder={'Choose table'}
				selectedKey={selected}
				options={options}
				onChange={onChange}
			/>
			{derived.length > 0 ? (
				<DefaultButton
					styles={viewButtonStyles}
					iconProps={iconProps.view}
					onClick={onClick}
				>
					View output
				</DefaultButton>
			) : null}

			{!selected && (
				<DetailText text="Select an input or derived table to preview" />
			)}
		</ListContainer>
	)
})

const viewButtonStyles = { root: { padding: '0 4px 0 6px' } }

const iconProps = {
	view: { iconName: 'View' },
}

const ListContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	gap: 18px;
`
