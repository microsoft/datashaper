/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AggregateStep } from '@data-wrangling-components/core'
import ColumnTable from 'arquero/dist/types/table/column-table'

import React, { memo, useMemo, useState } from 'react'
import styled from 'styled-components'
import { TableColumnDropdown, FieldAggregateOperationDropdown } from '..'
import {
	useLoadTable,
	LeftAlignedRow,
	useHandleDropdownChange,
} from '../../common'
import { StepComponentProps } from '../../types'

/**
 * Just the group/field/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const AggregateInputs: React.FC<StepComponentProps> = memo(
	function AggregateInputs({ step, store, onChange, input }) {
		const internal = useMemo(() => step as AggregateStep, [step])

		const [table, setTable] = useState<ColumnTable | undefined>()
		useLoadTable(input || internal.input, store, setTable)

		const handleGroupColumnChange = useHandleDropdownChange(
			internal,
			'args.groupby',
			onChange,
		)
		const handleAggregateColumnChange = useHandleDropdownChange(
			internal,
			'args.field',
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
						table={table}
						label={'Column to group by'}
						selectedKey={internal.args.groupby}
						onChange={handleGroupColumnChange}
					/>

					<TableColumnDropdown
						required
						table={table}
						label={'Column to aggregate'}
						selectedKey={internal.args.field}
						onChange={handleAggregateColumnChange}
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
