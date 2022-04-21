/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	OrderbyInstruction,
	OrderbyArgs,
	Step,
} from '@data-wrangling-components/core'
import { SortInstruction } from '@data-wrangling-components/react-controls'
import { SortDirection } from '@essex/arquero'
import { NodeInput } from '@essex/dataflow'
import { ActionButton } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import set from 'lodash-es/set.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { useLoadTable } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for an OrderBy step.
 */
export const Orderby: React.FC<StepComponentProps<OrderbyArgs>> = memo(
	function Orderby({ step, store, table, onChange, input }) {
		const tbl = useLoadTable(
			input || step.input[NodeInput.Source]?.node,
			table,
			store,
		)

		const sorts = useSorts(step, tbl, onChange)

		const handleButtonClick = useCallback(() => {
			onChange?.({
				...step,
				args: {
					...step.args,
					orders: [...(step.args.orders || []), newSort(tbl)],
				},
			})
		}, [step, tbl, onChange])

		return (
			<Container>
				{sorts}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={{ iconName: 'Add' }}
					disabled={!tbl}
				>
					Add sort
				</ActionButton>
			</Container>
		)
	},
)

function newSort(table?: ColumnTable): OrderbyInstruction {
	const column = table?.columnNames()[0] as string
	const direction = SortDirection.Ascending
	return {
		column,
		direction,
	}
}

function useSorts(
	step: Step<OrderbyArgs>,
	table?: ColumnTable,
	onChange?: (step: Step) => void,
) {
	return useMemo(() => {
		return (step.args.orders || []).map((order, index) => {
			const handleSortChange = (order: OrderbyInstruction) => {
				const update = { ...step }
				set(update, `args.orders[${index}]`, order)
				onChange?.(update)
			}

			const handleDeleteClick = () => {
				const update = { ...step }
				update.args.orders.splice(index, 1)
				onChange?.(update)
			}

			return (
				<SortInstruction
					key={`orderby-${order.column}-${index}`}
					table={table}
					order={order}
					onChange={handleSortChange}
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
