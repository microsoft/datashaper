/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs, Step } from '@data-wrangling-components/core'
import {
	ColumnSpread,
	TableColumnDropdown,
} from '@data-wrangling-components/react-controls'
import { NodeInput } from '@essex/dataflow'
import { ActionButton, Label } from '@fluentui/react'
import set from 'lodash-es/set.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { useHandleDropdownChange, useLoadTable } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const Spread: React.FC<StepComponentProps<SpreadArgs>> = memo(
	function Spread({ step, store, table, onChange, input }) {
		const tbl = useLoadTable(
			input || step.input[NodeInput.Source]?.node,
			table,
			store,
		)
		const columns = useColumns(step, onChange)

		const handleButtonClick = useCallback(() => {
			onChange?.({
				...step,
				args: {
					...step.args,
					to: [...step.args.to, next(step.args.to)],
				},
			})
		}, [step, onChange])

		const handleColumnChange = useHandleDropdownChange(
			step,
			'args.column',
			onChange,
		)

		return (
			<Container>
				<TableColumnDropdown
					required
					table={tbl}
					label={'Column to spread'}
					selectedKey={(step.args as SpreadArgs).column}
					onChange={handleColumnChange}
				/>

				<Label>New column names</Label>

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

function next(columns: string[]): string {
	return `New column (${columns.length})`
}

function useColumns(step: Step<SpreadArgs>, onChange?: (step: Step) => void) {
	return useMemo(() => {
		return (step.args.to || []).map((column: string, index: number) => {
			const handleColumnChange = (col: string) => {
				const update = { ...step }
				set(update, `args.to[${index}]`, col)
				onChange?.(update)
			}

			const handleDeleteClick = () => {
				const update = { ...step }
				update.args.to.splice(index, 1)
				onChange?.(update)
			}

			return (
				<ColumnSpread
					key={`column-list-${index}`}
					column={column}
					onChange={handleColumnChange}
					onDelete={handleDeleteClick}
				/>
			)
		})
	}, [step, onChange])
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
`
