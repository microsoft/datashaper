/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
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
export const withOutputTableTextField = (
	label?: string,
): HOCFunction<StepComponentProps> => {
	return Component => {
		const withOutputTableTextField: React.FC<StepComponentProps> = props => {
			const { step, onChange } = props
			const handleOutputChange = useHandleTextfieldChange(
				step,
				'output',
				onChange,
			)

			return (
				<Container className="with-output-column-textfield">
					<Component {...props} />
					<LeftAlignedRow>
						<TextField
							required
							label={label || 'Output table name'}
							placeholder={'Table name'}
							value={step.output}
							styles={columnDropdownStyles}
							onChange={handleOutputChange}
						/>
					</LeftAlignedRow>
				</Container>
			)
		}
		return memo(withOutputTableTextField)
	}
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-content: flex-start;
	justify-content: flex-start;
`
