/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OneHotStep } from '@data-wrangling-components/core'
import { dropdownStyles } from '@data-wrangling-components/react-controls'
import { TextField } from '@fluentui/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { LeftAlignedRow, useHandleTextfieldChange } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a OneHot step.
 */
export const OneHot: React.FC<StepComponentProps> = memo(function OneHot({
	step,
	onChange,
}) {
	const internal = useMemo(() => step as OneHotStep, [step])

	const handlePrefixChange = useHandleTextfieldChange(
		internal,
		'args.prefix',
		onChange,
	)

	return (
		<Container>
			<LeftAlignedRow>
				<TextField
					label={'Prefix'}
					value={internal.args.prefix && `${internal.args.prefix}`}
					styles={dropdownStyles}
					onChange={handlePrefixChange}
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
