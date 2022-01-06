/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectStep } from '@data-wrangling-components/core'
import { Dropdown, IDropdownOption } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

import React, { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useLoadTable } from '../../common'
import { columnDropdownStyles } from '../../controls/styles'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a Select.
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
		(event?: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
			const { columns = {} } = internal.args
			// the format here is to construct an object where each
			// value has a key of the name, and a value of the name
			// the arquero select operation will only pull those with an entry
			// so deleting is like deselecting.
			// note that we could allow rename at the same time, but are not in this current UX
			if (option) {
				if (option.selected) {
					columns[option.key] = option.key as string
				} else {
					delete columns[option.key]
				}
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

	const options = useMemo(() => {
		const columns = table?.columnNames() || []
		return columns.map(column => {
			const selected = internal.args?.columns && !!internal.args.columns[column]
			return {
				key: column,
				text: column,
				selected,
			}
		})
	}, [table, internal])

	const selectedKeys = useMemo(
		() => options.filter(o => o.selected).map(o => o.key),
		[options],
	)

	return (
		<Container>
			{table ? (
				<Dropdown
					label={'Columns'}
					styles={columnDropdownStyles}
					multiSelect
					options={options}
					selectedKeys={selectedKeys}
					onChange={handleColumnChange}
				/>
			) : null}
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
`
