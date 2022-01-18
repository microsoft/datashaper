/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ImputeStep, ImputeArgs } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { LeftAlignedRow, useHandleTextfieldChange } from '../../common'
import { StepComponentProps } from '../../types'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const ImputeInputs: React.FC<StepComponentProps> = memo(
	function ImputeInputs({ step, onChange }) {
		// always match the input column and output - impute is an inline replacement verb
		const internal = useMemo(() => {
			const a = {
				...(step.args as ImputeArgs),
			}
			return {
				...step,
				args: {
					...a,
					to: a.column,
				},
			} as ImputeStep
		}, [step])

		const handleValueChange = useHandleTextfieldChange(
			internal,
			'args.value',
			onChange,
		)

		return (
			<Container>
				<LeftAlignedRow>
					<TextField
						required
						label={'Fill value'}
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
