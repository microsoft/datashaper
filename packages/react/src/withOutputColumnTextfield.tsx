/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	OutputColumnArgs,
	isOutputColumnStep,
} from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { LeftAlignedRow, useHandleTextfieldChange } from './common'
import { columnDropdownStyles } from './controls/styles'
import { HOCFunction, StepComponentProps } from './types'
/**
 * Higher order component generator to wrap a Step in the output column text field.
 * @param label optional label to use for the textfield instead of the default.
 * @returns
 */
export const withOutputColumnTextfield = (
	label?: string,
): HOCFunction<StepComponentProps> => {
	return Component => {
		const WithOutputColumnTextfield: React.FC<StepComponentProps> = props => {
			const { step, onChange } = props
			const handleToChange = useHandleTextfieldChange(step, 'args.to', onChange)
			if (!isOutputColumnStep(step)) {
				return <Component {...props} />
			}
			return (
				<Container className="with-output-column-textfield">
					<LeftAlignedRow>
						<TextField
							required
							label={label || 'New column name'}
							placeholder={'Column name'}
							value={(step.args as OutputColumnArgs).to}
							styles={columnDropdownStyles}
							onChange={handleToChange}
						/>
					</LeftAlignedRow>
					<Component {...props} />
				</Container>
			)
		}
		return memo(WithOutputColumnTextfield)
	}
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-content: flex-start;
	justify-content: flex-start;
`
