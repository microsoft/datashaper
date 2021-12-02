/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RenameStep } from '@data-wrangling-components/core'
import { Icon, TextField } from '@fluentui/react'
import { internal as ArqueroTypes } from 'arquero'
import React, { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useLoadTable } from '../../common'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a RenameStep.
 * TODO: this lists _all_ columns for a table. Should we (a) provide a filter function, and/or (b) use a + like the orderby?
 * As is this makes it really easy but requires as much space as all of the columns need.
 */
export const Rename: React.FC<StepComponentProps> = memo(function Rename({
	step,
	store,
	onChange,
}) {
	const internal = useMemo(() => step as RenameStep, [step])

	const [table, setTable] = useState<ArqueroTypes.ColumnTable | undefined>()
	useLoadTable(internal.input, store, setTable)

	const handleColumnChange = useCallback(
		(oldColumn, newColumn) => {
			const { columns = {} } = internal.args
			columns[oldColumn] = newColumn
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
	table: ArqueroTypes.ColumnTable | undefined,
	internal: RenameStep,
	onChange: (oldName: string, newName: string) => void,
) {
	return useMemo(() => {
		const columns = table?.columnNames() || []
		return columns.map(column => {
			const handleChange = (
				e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
				newValue?: string,
			) => {
				onChange(column, newValue ?? '')
			}
			const existing = internal.args?.columns
				? internal.args.columns[column]
				: ''
			return (
				<ColumnPair key={`column-rename-${column}`}>
					<TextField readOnly value={column} />
					<Icon
						iconName={'Forward'}
						styles={{ root: { marginLeft: 4, marginRight: 4 } }}
					/>
					<TextField
						placeholder={'New name'}
						value={existing}
						onChange={handleChange}
					/>
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
	justify-content: space-between;
	align-items: center;
`
