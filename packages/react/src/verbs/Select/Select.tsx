/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectStep } from '@data-wrangling-components/core'
import { Checkbox, TextField } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

import React, { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useLoadTable } from '../../common'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a Select.
 * TODO: much like rename, this displays all columns, with a checkbox to include/exclude from the new table.
 * This could potentially be much more compact.
 */
export const Select: React.FC<StepComponentProps> = memo(function Select({
	step,
	store,
	onChange,
}) {
	const [table, setTable] = useState<ColumnTable | undefined>()
	useLoadTable(step.input, store, setTable)

	// default to selecting all columns if none are (this is what we want, right?)
	const internal = useMemo(() => {
		const { columns = {} } = (step as SelectStep).args
		const defaults =
			Object.keys(columns).length === 0
				? table
						?.columnNames()
						.reduce((acc: Record<string, string>, cur: string) => {
							acc[cur] = cur
							return acc
						}, {})
				: columns
		return {
			...step,
			args: {
				columns: defaults,
			},
		} as SelectStep
	}, [step, table])

	const handleColumnChange = useCallback(
		(name, checked?) => {
			const { columns = {} } = internal.args
			// the format here is to construct an object where each
			// value has a key of the name, and a value of the name
			// the arquero select operation will only pull those with an entry
			// so deleting is like delselecting.
			// note that we could allow rename at the same time, but are not in this current UX
			if (checked) {
				columns[name] = name
			} else {
				delete columns[name]
			}
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

	const columnPairs = useColumnPairs(table, internal, handleColumnChange)

	return <Container>{columnPairs}</Container>
})

function useColumnPairs(
	table: ColumnTable | undefined,
	internal: SelectStep,
	onChange: (oldName: string, selected?: boolean) => void,
) {
	return useMemo(() => {
		const columns = table?.columnNames() || []
		return columns.map(column => {
			const handleChange = (
				e: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
				checked: boolean | undefined,
			) => {
				onChange(column, checked)
			}
			const existing = internal.args?.columns && !!internal.args.columns[column]
			return (
				<ColumnPair key={`column-rename-${column}`}>
					<Checkbox checked={existing} onChange={handleChange} />
					<TextField readOnly value={column} />
				</ColumnPair>
			)
		})
	}, [table, internal, onChange])
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
`

const ColumnPair = styled.div`
	display: flex;
	align-content: flex-start;
	align-items: center;
`
