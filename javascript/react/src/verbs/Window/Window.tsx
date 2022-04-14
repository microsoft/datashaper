/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EnumDropdown } from '@data-wrangling-components/controls'
import type { WindowStep } from '@data-wrangling-components/core'
import { WindowFunction } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { LeftAlignedRow, useHandleDropdownChange } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'
/**
 * Just the column/op inputs for an rollup.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Window: React.FC<StepComponentProps> = memo(function Window({
	step,
	onChange,
}) {
	const internal = useMemo(() => step as WindowStep, [step])

	const handleOpChange = useHandleDropdownChange(
		internal,
		'args.operation',
		onChange,
	)

	return (
		<Container>
			<LeftAlignedRow>
				<EnumDropdown
					required
					label={'Function'}
					enumeration={WindowFunction}
					selectedKey={internal.args.operation}
					onChange={handleOpChange}
				/>
			</LeftAlignedRow>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`
