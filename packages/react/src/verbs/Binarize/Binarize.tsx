/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BinarizeStep } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { useHandleTextfieldChange, LeftAlignedRow } from '../../common'
import { FilterInputs } from '../../controls'
import { columnDropdownStyles } from '../../controls/styles'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a Binarize step.
 */
export const Binarize: React.FC<StepComponentProps> = memo(function Binarize({
	step,
	store,
	onChange,
}) {
	const internal = useMemo(() => step as BinarizeStep, [step])

	const handleAsChange = useHandleTextfieldChange(internal, 'args.as', onChange)

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
			</LeftAlignedRow>
			<FilterInputs step={step} store={store} onChange={onChange} />
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
