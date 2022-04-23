/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WindowArgs } from '@data-wrangling-components/core'
import { WindowFunction } from '@data-wrangling-components/core'
import { EnumDropdown } from '@data-wrangling-components/react-controls'
import { memo } from 'react'
import styled from 'styled-components'

import { LeftAlignedRow, useHandleDropdownChange } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'
/**
 * Just the column/op inputs for an rollup.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Window: React.FC<StepComponentProps<WindowArgs>> = memo(
	function Window({ step, onChange }) {
		const handleOpChange = useHandleDropdownChange(
			step,
			(s, val) => (s.args.operation = val as WindowFunction),
			onChange,
		)

		return (
			<Container>
				<LeftAlignedRow>
					<EnumDropdown
						required
						label={'Function'}
						enumeration={WindowFunction}
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
