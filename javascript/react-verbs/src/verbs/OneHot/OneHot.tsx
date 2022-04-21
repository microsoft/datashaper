/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs } from '@data-wrangling-components/core'
import { dropdownStyles } from '@data-wrangling-components/react-controls'
import { TextField } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { LeftAlignedRow, useHandleTextFieldChange } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a OneHot step.
 */
export const OneHot: React.FC<StepComponentProps<OnehotArgs>> = memo(
	function OneHot({ step, onChange }) {
		const handlePrefixChange = useHandleTextFieldChange(
			step,
			'args.prefix',
			onChange,
		)

		return (
			<Container>
				<LeftAlignedRow>
					<TextField
						label={'Prefix'}
						value={step.args.prefix && `${step.args.prefix}`}
						styles={dropdownStyles}
						onChange={handlePrefixChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
