/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FillStep } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { useHandleTextfieldChange, LeftAlignedRow } from '../../common'
import { columnDropdownStyles } from '../../controls/styles'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a Fill step.
 */
export const Fill: React.FC<StepComponentProps> = memo(function Fill({
	step,
	onChange,
}) {
	const internal = useMemo(() => step as FillStep, [step])

	const handleAsChange = useHandleTextfieldChange(internal, 'args.as', onChange)

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
					label={'New column name'}
					placeholder={'Column name'}
					value={internal.args.as}
					styles={columnDropdownStyles}
					onChange={handleAsChange}
				/>
				<TextField
					required
					label={'Fill value'}
					value={`${internal.args.value}`}
					placeholder={'text, number, or boolean'}
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
