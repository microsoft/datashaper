/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	OrderbyInstruction,
	OrderbyStep,
	SortDirection,
	Step,
} from '@data-wrangling-components/core'
import { ActionButton } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import set from 'lodash-es/set.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useLoadTable } from '../../common/index.js'
import { SortInstruction } from '../../controls/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for an OrderBy step.
 */
export const Orderby: React.FC<StepComponentProps> = memo(function Orderby({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const internal = useMemo(() => step as OrderbyStep, [step])

	const tbl = useLoadTable(input || step.input, table, store)

	const sorts = useSorts(internal, tbl, onChange)

	const handleButtonClick = useCallback(() => {
		onChange &&
			onChange({
				...internal,
				args: {
					...internal.args,
					orders: [...(internal.args.orders || []), newSort(tbl)],
				},
			})
	}, [internal, tbl, onChange])

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
})

function newSort(table?: ColumnTable): OrderbyInstruction {
	const column = table?.columnNames()[0] as string
	const direction = SortDirection.Ascending
	return {
		column,
		direction,
	}
}

function useSorts(
	step: OrderbyStep,
	table?: ColumnTable,
	onChange?: (step: Step) => void,
) {
	return useMemo(() => {
		return (step.args.orders || []).map((order, index) => {
			const handleSortChange = (order: OrderbyInstruction) => {
				const update = { ...step }
				set(update, `args.orders[${index}]`, order)
				onChange && onChange(update)
			}

			const handleDeleteClick = () => {
				const update = { ...step }
				update.args.orders.splice(index, 1)
				onChange && onChange(update)
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
