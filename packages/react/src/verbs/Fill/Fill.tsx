/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FillStep } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { useHandleTextfieldChange, LeftAlignedRow } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a Fill step.
 */
export const Fill: React.FC<StepComponentProps> = memo(function Fill({
	step,
	onChange,
}) {
	const internal = useMemo(() => step as FillStep, [step])

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
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
