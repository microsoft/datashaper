/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FillArgs } from '@data-wrangling-components/core'
import { dropdownStyles } from '@data-wrangling-components/react-controls'
import { TextField } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { LeftAlignedRow, useHandleTextFieldChange } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a Fill step.
 */
export const Fill: React.FC<StepComponentProps<FillArgs>> = memo(function Fill({
	step,
	onChange,
}) {
	const handleValueChange = useHandleTextFieldChange(
		step,
		(s, val) => (s.args.value = val),
		onChange,
	)

	return (
		<Container>
			<LeftAlignedRow>
				<TextField
					required
					label={'Fill value'}
					value={step.args.value && `${step.args.value}`}
					placeholder={'text, number, or boolean'}
					styles={dropdownStyles}
					onChange={handleValueChange}
				/>
			</LeftAlignedRow>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
