/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseStep } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { LeftAlignedRow, useHandleTextfieldChange } from '../../common'
import type { StepComponentProps } from '../../types'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const EraseInputs: React.FC<StepComponentProps> = memo(
	function EraseInputs({ step, onChange }) {
		const internal = useMemo(() => step as EraseStep, [step])

		const handleValueChange = useHandleTextfieldChange(
			step,
			'args.value',
			onChange,
		)

		return (
			<Container>
				<LeftAlignedRow>
					<TextField
						required
						label={'Value to be erased'}
						value={internal.args.value && `${internal.args.value}`}
						placeholder={'text, number, or boolean'}
						onChange={handleValueChange}
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
