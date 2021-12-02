/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import { internal as ArqueroTypes } from 'arquero'
import React, { memo, useMemo, useState, useCallback } from 'react'
import styled from 'styled-components'
import { LeftAlignedRow, useLoadTable } from '../../common'
import {
	FieldAggregateOperationDropdown,
	FilterFunction,
	ReadOnlyTextField,
	TableColumnDropdown,
	TableDropdown,
} from '../../controls'
import { columnDropdownStyles } from '../../controls/styles'
import { StepComponentProps } from '../../types'
import {
	getAggregate,
	defaults,
	getFilter,
	getJoin,
	updateAggregateOperation,
	updateFilter,
	updateIdentifierColumn,
	updateLookupColumn,
	updateLookupTable,
	updateAs,
} from '../generators/filter-aggregate-lookup'

/**
 * Provides the essential inputs for a multi-step join + filter + aggregate.
 */
export const FilterAggregateLookup: React.FC<StepComponentProps> = memo(
	function FilterAggregateLookup({ step, store, onChange }) {
		const internal = useMemo(() => defaults(step), [step])

		const [leftTable, setLeftTable] = useState<
			ArqueroTypes.ColumnTable | undefined
		>()
		useLoadTable(internal.input, store, setLeftTable)

		const join = useMemo(() => getJoin(internal), [internal])
		const filter = useMemo(() => getFilter(internal), [internal])
		const aggregate = useMemo(() => getAggregate(internal), [internal])

		const [rightTable, setRightTable] = useState<
			ArqueroTypes.ColumnTable | undefined
		>()
		useLoadTable(join.args.other, store, setRightTable)

		const handleLookupTableChange = useCallback(
			(e, opt) => {
				const updated = updateLookupTable(internal, opt.key)
				onChange && onChange(updated)
			},
			[internal, onChange],
		)

		const handleIdentifierColumnChange = useCallback(
			(e, opt) => {
				const updated = updateIdentifierColumn(internal, opt.key)
				onChange && onChange(updated)
			},
			[internal, onChange],
		)

		const handleLookupColumnChange = useCallback(
			(e, opt) => {
				const updated = updateLookupColumn(internal, opt.key)
				onChange && onChange(updated)
			},
			[internal, onChange],
		)

		const handleAsChange = useCallback(
			(e, as) => {
				const updated = updateAs(internal, as)
				onChange && onChange(updated)
			},
			[internal, onChange],
		)

		const handleFilterChange = useCallback(
			s => {
				const updated = updateFilter(internal, s)
				onChange && onChange(updated)
			},
			[internal, onChange],
		)

		const handleAggregateChange = useCallback(
			(e, opt) => {
				const updated = updateAggregateOperation(internal, opt.key)
				onChange && onChange(updated)
			},
			[internal, onChange],
		)

		return (
			<Container>
				<LeftAlignedRow>
					<TableDropdown
						label={'Lookup table'}
						store={store}
						onChange={handleLookupTableChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<TableColumnDropdown
						label={'Identifier column'}
						table={leftTable}
						onChange={handleIdentifierColumnChange}
					/>
					<TableColumnDropdown
						label={'Lookup column'}
						table={rightTable}
						onChange={handleLookupColumnChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<ReadOnlyTextField
						label={'Filter'}
						value={filter.args.column}
						styles={columnDropdownStyles}
					/>

					<FilterFunction
						input={join.args.other}
						step={filter}
						store={store}
						onChange={handleFilterChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<FieldAggregateOperationDropdown
						label={'Aggregate function'}
						selectedKey={aggregate.args.operation}
						onChange={handleAggregateChange}
						styles={{ root: { width: 180 } }}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<TextField
						required
						label={'New column name'}
						placeholder={'Column name'}
						value={aggregate.args.as}
						styles={columnDropdownStyles}
						onChange={handleAsChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
