/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Criterion, FilterArgs } from '@datashaper/schema'
import { BooleanOperator } from '@datashaper/schema'
import { ActionButton, Label } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback } from 'react'

import { EnumDropdown } from '../controls/index.js'
import { useDropdownChangeHandler, useStepDataTable } from '../hooks/index.js'
import { LeftAlignedRow } from '../styles.js'
import type { StepComponentProps } from '../types.js'
import { Container, Vertical } from './Filter.styles.js'
import { FilterFunction } from './shared/index.js'

/**
 * Provides inputs for a Filter step.
 */
export const Filter: React.FC<StepComponentProps<FilterArgs>> = memo(
	function Filter({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
		const handleButtonClick = useCallback(() => {
			onChange?.({
				...step,
				args: {
					...step.args,
					criteria: [...(step.args.criteria || []), {} as Criterion],
				},
			})
		}, [step, onChange])

		const handleFilterChange = useCallback(
			(criterion: Criterion | undefined, index: number) => {
				const criteria = [...step.args.criteria]
				if (criterion === undefined) {
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
