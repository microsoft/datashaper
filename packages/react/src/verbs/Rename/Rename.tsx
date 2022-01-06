/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RenameStep } from '@data-wrangling-components/core'
import {
	ActionButton,
	Icon,
	IconButton,
	IDropdownOption,
	TextField,
} from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

import React, { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useLoadTable } from '../../common'
import { TableColumnDropdown } from '../../controls'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a RenameStep.
 */
export const Rename: React.FC<StepComponentProps> = memo(function Rename({
	step,
	store,
	onChange,
}) {
	const internal = useMemo(() => step as RenameStep, [step])

	const [table, setTable] = useState<ColumnTable | undefined>()
	useLoadTable(internal.input, store, setTable)

	const handleColumnChange = useCallback(
		(previous, oldName, newName) => {
			const columns = {
				...internal.args.columns,
			}
			// this is the previous column mapping - remove it in case we
			// selected a different one to rename
			delete columns[previous]
			columns[oldName] = newName
			onChange &&
				onChange({
					...internal,
					args: {
						...internal.args,
						columns,
					},
				})
		},
		[internal, onChange],
	)

	const handleColumnDelete = useCallback(
		column => {
			const columns = {
				...internal.args.columns,
			}
			delete columns[column]
			onChange &&
				onChange({
					...internal,
					args: {
						...internal.args,
						columns,
					},
				})
		},
		[internal, onChange],
	)

	const columnPairs = useColumnPairs(
		table,
		internal,
		handleColumnChange,
		handleColumnDelete,
	)

	const handleButtonClick = useCallback(() => {
		const nextName = next(internal, table)
		if (nextName) {
			onChange &&
				onChange({
					...internal,
					args: {
						...internal.args,
						columns: {
							...internal.args.columns,
							[nextName]: nextName,
						},
					},
				})
		}
	}, [internal, table, onChange])

	const disabled = useDisabled(internal, table)

	return (
		<Container>
			{columnPairs}
			<ActionButton
				onClick={handleButtonClick}
				iconProps={{ iconName: 'Add' }}
				disabled={disabled}
			>
				Add rename
			</ActionButton>
		</Container>
	)
})

// find the next column from the table to suggest
function next(internal: RenameStep, table?: ColumnTable): string | undefined {
	return table?.columnNames().find(name => {
		if (!internal.args.columns) {
			return true
		}
		return !internal.args.columns[name]
	})
}

function useDisabled(internal: RenameStep, table?: ColumnTable) {
	if (!table) {
		return true
	}
	return (
		table.columnNames().length ===
		Object.keys(internal.args.columns || {}).length
	)
}

function useColumnPairs(
	table: ColumnTable | undefined,
	internal: RenameStep,
	onChange: (previous: string, oldName: string, newName: string) => void,
	onDelete: (name: string) => void,
) {
	return useMemo(() => {
		const { columns } = internal.args
		return Object.entries(columns || {}).map((column, index) => {
			const [oldname, newname] = column
			const columnFilter = (name: string) => {
				if (name === oldname) {
					return true
				}
				if (internal.args.columns && internal.args.columns[name]) {
					return false
				}
				return true
			}
			const handleColumnChange = (
				e: React.FormEvent<HTMLDivElement>,
				opt?: IDropdownOption<any> | undefined,
			) => onChange(oldname, (opt?.key as string) || oldname, newname)
			const handleTextChange = (
				e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
				newValue?: string,
			) => {
				onChange(oldname, oldname, newValue ?? '')
			}
			const handleDeleteClick = () => onDelete(oldname)
			return (
				<ColumnPair key={`column-rename-${oldname}-${index}`}>
					<TableColumnDropdown
						table={table}
						filter={columnFilter}
						label={undefined}
						selectedKey={oldname}
						onChange={handleColumnChange}
						styles={{
							root: {
								width: 120,
							},
						}}
					/>
					<Icon
						iconName={'Forward'}
						styles={{ root: { marginLeft: 4, marginRight: 4 } }}
					/>
					<TextField
						placeholder={'New name'}
						value={newname}
						onChange={handleTextChange}
						styles={{ root: { width: 120 } }}
					/>
					<IconButton
						title={'Remove this rename'}
						iconProps={{ iconName: 'Delete' }}
						onClick={handleDeleteClick}
					/>
				</ColumnPair>
			)
		})
	}, [table, internal, onChange, onDelete])
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
`

const ColumnPair = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`
