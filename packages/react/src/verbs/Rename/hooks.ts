/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RenameStep } from '@data-wrangling-components/core'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'
import { StepChangeFunction } from '../../types'

export function useHandleColumnChange(
	internal: RenameStep,
	onChange?: StepChangeFunction,
): (previous: string, oldName: string, newName: string) => void {
	return useCallback(
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
}

// find the next column from the table to suggest
function next(internal: RenameStep, table?: ColumnTable): string | undefined {
	return table?.columnNames().find(name => {
		if (!internal.args.columns) {
			return true
		}
		return !internal.args.columns[name]
	})
}

export function useHandleAddButtonClick(
	internal: RenameStep,
	table?: ColumnTable,
	onChange?: StepChangeFunction,
): () => void {
	return useCallback(() => {
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
}

export function useDisabled(
	internal: RenameStep,
	table?: ColumnTable,
): boolean {
	if (!table) {
		return true
	}
	return (
		table.columnNames().length ===
		Object.keys(internal.args.columns || {}).length
	)
}
