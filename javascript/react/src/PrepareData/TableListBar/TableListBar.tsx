/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@data-wrangling-components/core'
import { DefaultButton, Dropdown, IDropdownOption } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { DetailText } from '../DetailText/DetailText.js'

export const TableListBar: React.FC<{
	inputs: TableContainer[]
	derived: TableContainer[]
	onSelect?: (name: string) => void
	selected?: string
}> = memo(function TableListBar({ inputs, derived, onSelect, selected }) {
	const inputOptions = useOptions(inputs)
	const derivedOptions = useOptions(derived)

	const handleDropdownChange = useCallback(
		(_evt, opt) => {
			onSelect && onSelect(opt.key)
		},
		[onSelect],
	)

	const lastId = useMemo(() => {
		if (derived && derived.length > 0) {
			return derived[derived.length - 1]!.id
		}
	}, [derived])

	const handleViewClick = useCallback(() => {
		lastId && onSelect && onSelect(lastId)
	}, [lastId, onSelect])

	return (
		<ListContainer>
			<Dropdown
				styles={{
					root: {
						width: 200,
					},
				}}
				label={'Inputs'}
				placeholder={'Choose table'}
				selectedKey={selected}
				options={inputOptions}
				onChange={handleDropdownChange}
			/>
			{derived.length > 0 ? (
				<>
					<Dropdown
						styles={{
							root: {
								width: 200,
							},
						}}
						label={'Derived'}
						placeholder={'Choose table'}
						selectedKey={selected}
						options={derivedOptions}
						onChange={handleDropdownChange}
					/>
					<DefaultButton
						styles={viewButtonStyles}
						iconProps={iconProps.view}
						onClick={handleViewClick}
					>
						View output
					</DefaultButton>
				</>
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

function useOptions(tables: TableContainer[]): IDropdownOption[] {
	return useMemo(() => {
		return tables.map(table => ({
			key: table.id,
			text: table.name || table.id,
		}))
	}, [tables])
}
const ListContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-end;
	width: 100%;
	gap: 18px;
`
