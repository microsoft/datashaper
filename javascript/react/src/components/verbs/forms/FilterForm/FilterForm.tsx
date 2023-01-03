/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Criterion, FilterArgs } from '@datashaper/schema'
import { BooleanOperator } from '@datashaper/schema'
import { EnumDropdown } from '@essex/components'
import { ActionButton, Label } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback } from 'react'

import { EMPTY_ARRAY } from '../../../../empty.js'
import {
	useDropdownChangeHandler,
	useStepInputTable,
} from '../../../../hooks/index.js'
import { FilterFunction } from '../shared/index.js'
import { LeftAlignedRow } from '../styles.js'
import type { StepFormProps } from '../types.js'
import { Container, Vertical } from './FilterForm.styles.js'

/**
 * Provides inputs for a Filter step.
 */
export const FilterForm: React.FC<StepFormProps<FilterArgs>> = memo(
	function FilterForm({ step, workflow, input, table, onChange }) {
		const dataTable = useStepInputTable(step, workflow, input, table)
		const handleButtonClick = useCallback(() => {
			onChange?.({
				...step,
				args: {
					...step.args,
					criteria: [...(step.args.criteria || EMPTY_ARRAY), {} as Criterion],
				},
			})
		}, [step, onChange])

		const handleFilterChange = useCallback(
			(criterion: Criterion | undefined, index: number) => {
				const criteria = [...step.args.criteria]
				if (criterion == null) {
					criteria.splice(index, 1)
				} else {
					criteria[index] = criterion
				}
				onChange?.({
					...step,
					args: {
						...step.args,
						criteria,
					},
				})
			},
			[step, onChange],
		)

		const handleLogicalChange = useDropdownChangeHandler(
			step,
			(s, val) => (s.args.logical = val as BooleanOperator),
			onChange,
		)
		const filters = useFilters(
			dataTable,
			step.args.column,
			step.args.criteria,
			handleFilterChange,
		)

		return (
			<Container>
				<Label>Function</Label>
				{filters}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={addIconProps}
					disabled={!dataTable}
				>
					Add criteria
				</ActionButton>
				{step.args.criteria.length > 1 ? (
					<LeftAlignedRow>
						<EnumDropdown
							label={'Logical combination'}
							placeholder={'Choose boolean'}
							enumeration={BooleanOperator}
							labels={{
								or: 'OR',
								and: 'AND',
								nor: 'NOR',
								nand: 'NAND',
								xor: 'XOR',
							}}
							selectedKey={step.args.logical}
							onChange={handleLogicalChange}
						/>
					</LeftAlignedRow>
				) : null}
			</Container>
		)
	},
)

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
				/>
			</Vertical>
		)
	})
}

const addIconProps = { iconName: 'Add' }
