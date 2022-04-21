/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AggregateArgs } from '@data-wrangling-components/core'
import { FieldAggregateOperation } from '@data-wrangling-components/core'
import {
	EnumDropdown,
	TableColumnDropdown,
} from '@data-wrangling-components/react-controls'
import { NodeInput } from '@essex/dataflow'
import { memo } from 'react'
import styled from 'styled-components'

import {
	LeftAlignedRow,
	useHandleDropdownChange,
	useLoadTable,
} from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Aggregate: React.FC<StepComponentProps<AggregateArgs>> = memo(
	function Aggregate({ step, store, table, onChange, input }) {
		const tbl = useLoadTable(
			input || step.input[NodeInput.Source]?.node,
			table,
			store,
		)

		const handleGroupColumnChange = useHandleDropdownChange(
			step,
			'args.groupby',
			onChange,
		)

		const handleOpChange = useHandleDropdownChange(
			step,
			'args.operation',
			onChange,
		)

		return (
			<Container>
				<LeftAlignedRow>
					<TableColumnDropdown
						required
						table={tbl}
						label={'Column to group by'}
						selectedKey={step.args.groupby}
						onChange={handleGroupColumnChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<EnumDropdown
						required
						enumeration={FieldAggregateOperation}
						label={'Function'}
						selectedKey={step.args.operation}
						onChange={handleOpChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
`
