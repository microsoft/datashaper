/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RollupStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { TableColumnDropdown, FieldAggregateOperationDropdown } from '..'
import {
	useLoadTable,
	LeftAlignedRow,
	useHandleDropdownChange,
} from '../../common'
import { StepComponentProps } from '../../types'

/**
 * Just the column/op inputs for an rollup.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const RollupInputs: React.FC<StepComponentProps> = memo(
	function RollupInputs({ step, store, table, onChange, input }) {
		const internal = useMemo(() => step as RollupStep, [step])

		const tbl = useLoadTable(input || internal.input, table, store)

		const handleRollupColumnChange = useHandleDropdownChange(
			internal,
			'args.column',
			onChange,
		)
		const handleOpChange = useHandleDropdownChange(
			internal,
			'args.operation',
			onChange,
		)

		return (
			<Container>
				<LeftAlignedRow>
					<TableColumnDropdown
						required
						table={tbl}
						label={'Column to rollup'}
						selectedKey={internal.args.column}
						onChange={handleRollupColumnChange}
					/>
					<FieldAggregateOperationDropdown
						selectedKey={internal.args.operation}
						onChange={handleOpChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`
