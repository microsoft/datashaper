/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Criterion, FilterArgs } from '@data-wrangling-components/core'
import { BooleanOperator } from '@data-wrangling-components/core'
import { EnumDropdown } from '@data-wrangling-components/react-controls'
import { ActionButton } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

import { useDropdownChangeHandler } from '@data-wrangling-components/react-hooks'
import { LeftAlignedRow } from '../../common/styles.js'
import { withLoadedTable } from '@data-wrangling-components/react-hocs'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { FilterFunction } from '../shared/index.js'

/**
 * Provides inputs for a Filter step.
 */
export const Filter: React.FC<StepComponentProps<FilterArgs>> = memo(
	withLoadedTable(function Filter({ step, onChange, dataTable }) {
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
				{filters}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={{ iconName: 'Add' }}
					disabled={!dataTable}
				>
					Add criteria
				</ActionButton>
				{step.args.criteria.length > 1 ? (
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
							selectedKey={step.args.logical}
							onChange={handleLogicalChange}
						/>
					</LeftAlignedRow>
				) : null}
			</Container>
		)
	}),
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
