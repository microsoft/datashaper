/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Criterion, FilterStep } from '@data-wrangling-components/core'
import { BooleanOperator } from '@data-wrangling-components/core'
import { EnumDropdown } from '@data-wrangling-components/react-controls'
import { NodeInput } from '@essex/dataflow'
import { ActionButton } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { useHandleDropdownChange, useLoadTable } from '../../common/hooks.js'
import { LeftAlignedRow } from '../../common/styles.js'
import type { StepComponentProps } from '../../types.js'
import { FilterFunction } from '../shared/index.js'

/**
 * Provides inputs for a Filter step.
 */
export const Filter: React.FC<StepComponentProps> = memo(function Filter({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const internal = useMemo(() => step as FilterStep, [step])
	const tbl = useLoadTable(
		input || internal.input[NodeInput.Source]?.node,
		table,
		store,
	)

	const handleButtonClick = useCallback(() => {
		onChange &&
			onChange({
				...internal,
				args: {
					...internal.args,
					criteria: [...(internal.args.criteria || []), {}],
				},
			})
	}, [internal, onChange])

	const handleFilterChange = useCallback(
		(criterion: Criterion | undefined, index: number) => {
			const criteria = [...internal.args.criteria]
			if (criterion === undefined) {
				criteria.splice(index, 1)
			} else {
				criteria[index] = criterion
			}
			onChange &&
				onChange({
					...internal,
					args: {
						...internal.args,
						criteria,
					},
				})
		},
		[internal, onChange],
	)

	const handleLogicalChange = useHandleDropdownChange(
		internal,
		'args.logical',
		onChange,
	)
	const filters = useFilters(
		tbl,
		internal.args.column,
		internal.args.criteria,
		handleFilterChange,
	)
	return (
		<Container>
			{filters}
			<ActionButton
				onClick={handleButtonClick}
				iconProps={{ iconName: 'Add' }}
				disabled={!tbl}
			>
				Add criteria
			</ActionButton>
			{internal.args.criteria.length > 1 ? (
				<LeftAlignedRow>
					<EnumDropdown
						label={'Logical combination'}
						enumeration={BooleanOperator}
						labels={{
							or: 'OR',
							and: 'AND',
							nor: 'NOR',
							nand: 'NAND',
							xor: 'XOR',
						}}
						selectedKey={internal.args.logical}
						onChange={handleLogicalChange}
					/>
				</LeftAlignedRow>
			) : null}
		</Container>
	)
})

function useFilters(
	table: ColumnTable | undefined,
	column: string,
	criteria: Criterion[],
	onChange: any,
) {
	if (!table) {
		return null
	}

	return criteria.map((criterion, index) => {
		const handleChange = (f?: Criterion) => onChange(f, index)
		return (
			<Vertical key={`filter-function-${index}`} index={index}>
				<FilterFunction
					table={table}
					column={column}
					criterion={criterion}
					onChange={handleChange}
					suppressLabels={index > 0}
				/>
			</Vertical>
		)
	})
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`

const Vertical = styled.div<{ index: number }>`
	display: flex;
	flex-direction: column;
	margin-top: ${({ index }) => (index > 0 ? 6 : 0)}px;
`
