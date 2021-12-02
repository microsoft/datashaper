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
import { internal as ArqueroTypes } from 'arquero'
import { set } from 'lodash'
import React, { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useLoadTable } from '../../common'
import { SortInstruction } from '../../controls'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for an OrderBy step.
 */
export const Orderby: React.FC<StepComponentProps> = memo(function Orderby({
	step,
	store,
	onChange,
}) {
	const internal = useMemo(() => step as OrderbyStep, [step])

	const [table, setTable] = useState<ArqueroTypes.ColumnTable | undefined>()
	useLoadTable(internal.input, store, setTable)

	const sorts = useSorts(internal, table, onChange)

	const handleButtonClick = useCallback(() => {
		onChange &&
			onChange({
				...internal,
				args: {
					...internal.args,
					orders: [...(internal.args.orders || []), newSort(table)],
				},
			})
	}, [internal, table, onChange])

	return (
		<Container>
			{sorts}
			<ActionButton
				onClick={handleButtonClick}
				iconProps={{ iconName: 'Add' }}
				disabled={!table}
			>
				Add sort
			</ActionButton>
		</Container>
	)
})

function newSort(table?: ArqueroTypes.ColumnTable): OrderbyInstruction {
	const column = table?.columnNames()[0] as string
	const direction = SortDirection.Ascending
	return {
		column,
		direction,
	}
}

function useSorts(
	step: OrderbyStep,
	table?: ArqueroTypes.ColumnTable,
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
