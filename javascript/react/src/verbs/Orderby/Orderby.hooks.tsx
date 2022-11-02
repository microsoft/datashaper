/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OrderbyArgs, OrderbyInstruction } from '@datashaper/schema'
import { SortDirection } from '@datashaper/schema'
import type { Step } from '@datashaper/workflow'
import type { IDropdownOption } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import set from 'lodash-es/set.js'
import { useCallback, useMemo } from 'react'

import { SortInstruction } from '../../controls/index.js'
import { EMPTY_ARRAY } from '../../empty.js'

export function useSorts(
	step: Step<OrderbyArgs>,
	columnOptions: IDropdownOption[],
	onChange?: (step: Step<OrderbyArgs>) => void,
): JSX.Element[] {
	return useMemo(() => {
		return (step.args.orders || EMPTY_ARRAY).map((order, index) => {
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
					columnOptions={columnOptions}
					order={order}
					onChange={handleSortChange}
					onDelete={handleDeleteClick}
				/>
			)
		})
	}, [step, columnOptions, onChange])
}

export function useAddButtonClickedHandler(
	dataTable: ColumnTable | undefined,
	step: Step<OrderbyArgs>,
	onChange: ((step: Step<OrderbyArgs>) => void) | undefined,
): () => void {
	return useCallback(() => {
		onChange?.({
			...step,
			args: {
				...step.args,
				orders: [...(step.args.orders || EMPTY_ARRAY), newSort(dataTable)],
			},
		})
	}, [step, dataTable, onChange])
}

function newSort(table?: ColumnTable): OrderbyInstruction {
	const column = table?.columnNames()[0] as string
	const direction = SortDirection.Ascending
	return {
		column,
		direction,
	}
}
