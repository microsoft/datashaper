/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RollupStep } from '@data-wrangling-components/core'
import { FieldAggregateOperation } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { LeftAlignedRow, useHandleDropdownChange } from '../../common/index.js'
import { EnumDropdown } from '../../controls/EnumDropdown.js'
import type { StepComponentProps } from '../../types.js'
/**
 * Just the column/op inputs for an rollup.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Rollup: React.FC<StepComponentProps> = memo(function Rollup({
	step,
	onChange,
}) {
	const internal = useMemo(() => step as RollupStep, [step])

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
	flex-direction: row;
	justify-content: flex-start;
`
