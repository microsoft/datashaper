/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnListStep, Step } from '@data-wrangling-components/core'
import { ActionButton } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { set } from 'lodash'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useLoadTable } from '../../common'
import { ColumnInstruction } from '../../controls'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const ColumnListInputs: React.FC<StepComponentProps> = memo(
	function ColumnListInputs({ step, store, table, onChange, input }) {
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
				<ColumnInstruction
					key={`column-list-${column}-${index}`}
					table={table}
					column={column}
					onChange={handleColumnChange}
					onDelete={handleDeleteClick}
				/>
			)
		})
	}, [step, table, onChange])
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
`
