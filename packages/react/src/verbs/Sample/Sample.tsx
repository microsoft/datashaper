/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SampleStep } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { useHandleTextfieldChange, LeftAlignedRow } from '../../common'
import { columnDropdownStyles } from '../../controls/styles'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a Sample step.
 */
export const Sample: React.FC<StepComponentProps> = memo(function Sample({
	step,
	store,
	onChange,
}) {
	const internal = useMemo(() => step as SampleStep, [step])

	const handleSizeChange = useHandleTextfieldChange(
		internal,
		'args.size',
		onChange,
	)

	const handlePercentChange = useHandleTextfieldChange(
		internal,
		'args.proportion',
		onChange,
		val => +(val as string) / 100,
	)

	return (
		<Container>
			<LeftAlignedRow>
				<TextField
					label={'Number of rows'}
					placeholder={'count'}
					disabled={!!internal.args.proportion}
					value={internal.args.size ? `${internal.args.size}` : ''}
					styles={columnDropdownStyles}
					onChange={handleSizeChange}
				/>
				<Or>or</Or>
				<TextField
					label={'Percentage of rows'}
					disabled={!!internal.args.size}
					value={
						internal.args.proportion ? `${internal.args.proportion * 100}` : ''
					}
					placeholder={'percent'}
					styles={columnDropdownStyles}
					onChange={handlePercentChange}
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

const Or = styled.div`
	margin-right: 8px;
	height: 100%;
`
