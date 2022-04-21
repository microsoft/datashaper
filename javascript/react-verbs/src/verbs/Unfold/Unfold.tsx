/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotArgs } from '@data-wrangling-components/core'
import { TableColumnDropdown } from '@data-wrangling-components/react-controls'
import { NodeInput } from '@essex/dataflow'
import { memo } from 'react'
import styled from 'styled-components'

import { useLoadTable } from '../../common/hooks.js'
import { LeftAlignedRow, useHandleDropdownChange } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Unfold: React.FC<StepComponentProps<PivotArgs>> = memo(
	function Unfold({ step, store, table, onChange, input }) {
		const tbl = useLoadTable(
			input || step.input[NodeInput.Source]?.node,
			table,
			store,
		)

		const handleKeyColumnChange = useHandleDropdownChange(
			step,
			'args.key',
			onChange,
		)

		const handleValueColumnChange = useHandleDropdownChange(
			step,
			'args.value',
			onChange,
		)

		return (
			<Container>
				<LeftAlignedRow>
					<TableColumnDropdown
						required
						table={tbl}
						label={'Column used as key'}
						selectedKey={step.args.key}
						onChange={handleKeyColumnChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<TableColumnDropdown
						required
						table={tbl}
						label={'Column used as value'}
						selectedKey={step.args.value}
						onChange={handleValueColumnChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-content: flex-start;
	justify-content: flex-start;
`
