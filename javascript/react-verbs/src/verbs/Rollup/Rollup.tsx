/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RollupArgs } from '@data-wrangling-components/core'
import { FieldAggregateOperation } from '@data-wrangling-components/core'
import { EnumDropdown } from '@data-wrangling-components/react-controls'
import { memo } from 'react'
import styled from 'styled-components'

import { LeftAlignedRow, useHandleDropdownChange } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'
/**
 * Just the column/op inputs for an rollup.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Rollup: React.FC<StepComponentProps<RollupArgs>> = memo(
	function Rollup({ step, onChange }) {
		const handleOpChange = useHandleDropdownChange(
			step,
			'args.operation',
			onChange,
		)

		return (
			<Container>
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
	flex-direction: row;
	justify-content: flex-start;
`
