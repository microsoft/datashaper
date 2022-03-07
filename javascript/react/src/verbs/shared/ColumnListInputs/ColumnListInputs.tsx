/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnListStep, Step } from '@data-wrangling-components/core'
import { ActionButton, Label } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import set from 'lodash-es/set.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { ColumnInstruction } from '../../../controls/ColumnInstruction.js'
import { LeftAlignedRow, useLoadTable } from '../../../index.js'
import type { StepSubcomponentProps } from '../../../types.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const ColumnListInputs: React.FC<StepSubcomponentProps> = memo(
	function ColumnListInputs({ step, store, table, onChange, input, label }) {
		const internal = useMemo(() => step as ColumnListStep, [step])

		const tbl = useLoadTable(input || step.input, table, store)

		const columns = useColumns(internal, tbl, onChange)

		const handleButtonClick = useCallback(() => {
			onChange &&
				onChange({
					...internal,
					args: {
						...internal.args,
						columns: [...internal.args.columns, first(tbl)],
					},
				})
		}, [internal, tbl, onChange])

		return (
			<Container>
				<Label>{label || 'Columns'}</Label>
				{columns}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={{ iconName: 'Add' }}
					disabled={!tbl}
				>
					Add column
				</ActionButton>
			</Container>
		)
	},
)

function first(table?: ColumnTable): string {
	return table?.columnNames()[0] as string
}

function useColumns(
	step: ColumnListStep,
	table?: ColumnTable,
	onChange?: (step: Step) => void,
) {
	return useMemo(() => {
		return (step.args.columns || []).map((column: string, index: number) => {
			const handleColumnChange = (col: string) => {
				const update = { ...step }
				set(update, `args.columns[${index}]`, col)
				onChange && onChange(update)
			}

			const handleDeleteClick = () => {
				const update = { ...step }
				update.args.columns.splice(index, 1)
				onChange && onChange(update)
			}

			return (
				<LeftAlignedRow key={`column-list-${column}-${index}`}>
					<ColumnInstruction
						table={table}
						column={column}
						onChange={handleColumnChange}
						onDelete={handleDeleteClick}
					/>
				</LeftAlignedRow>
			)
		})
	}, [step, table, onChange])
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`
