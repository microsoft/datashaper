/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AggregateStep } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import {
	useHandleTextfieldChange,
	LeftAlignedRow,
	VerbContainer,
} from '../../common'
import { AggregateInputs } from '../../controls'
import { columnDropdownStyles } from '../../controls/styles'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for an aggregation step.
 */
export const Aggregate: React.FC<StepComponentProps> = memo(function Aggregate({
	step,
	store,
	table,
	onChange,
}) {
	const internal = useMemo(() => step as AggregateStep, [step])

	const handleToChange = useHandleTextfieldChange(internal, 'args.to', onChange)

	return (
		<VerbContainer>
			<LeftAlignedRow>
				<TextField
					required
					label={'New column name'}
					placeholder={'Column name'}
					value={internal.args.to}
					styles={columnDropdownStyles}
					onChange={handleToChange}
				/>
			</LeftAlignedRow>
			<AggregateInputs
				step={step}
				store={store}
				table={table}
				onChange={onChange}
			/>
		</VerbContainer>
	)
})
