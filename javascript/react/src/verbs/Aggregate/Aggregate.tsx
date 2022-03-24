/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AggregateStep } from '@data-wrangling-components/core'
import { FieldAggregateOperation , NodeInput } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import {
	LeftAlignedRow,
	useHandleDropdownChange,
	useLoadTable,
} from '../../common/index.js'
import { EnumDropdown } from '../../controls/EnumDropdown.js'
import { TableColumnDropdown } from '../../controls/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Aggregate: React.FC<StepComponentProps> = memo(function Aggregate({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const internal = useMemo(() => step as AggregateStep, [step])

	const tbl = useLoadTable(
		input || internal.inputs[NodeInput.Input]?.node,
		table,
		store,
	)

	const handleGroupColumnChange = useHandleDropdownChange(
		internal,
		'args.groupby',
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
					label={'Column to group by'}
					selectedKey={internal.args.groupby}
					onChange={handleGroupColumnChange}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
				<EnumDropdown
					required
					enumeration={FieldAggregateOperation}
					label={'Function'}
					selectedKey={internal.args.operation}
					onChange={handleOpChange}
				/>
			</LeftAlignedRow>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
`
