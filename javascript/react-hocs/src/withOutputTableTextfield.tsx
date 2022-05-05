/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NamedOutputPortBinding } from '@data-wrangling-components/core'
import { dropdownStyles } from '@data-wrangling-components/react-controls'
import { useTextFieldChangeHandler } from '@data-wrangling-components/react-hooks'
import { LeftAlignedRow } from '@data-wrangling-components/react-styled-components'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { TextField } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import type { HOCFunction } from './types.js'

/**
 * Higher order component generator to wrap a Step in the output column text field.
 * @param label - optional label to use for the textfield instead of the default.
 * @returns
 */
export const withOutputTableTextfield = (
	onOutputChanged: (output: NamedOutputPortBinding) => void,
	label?: string,
	disabled?: boolean,
): HOCFunction<StepComponentProps> => {
	return Component => {
		const WithOutputTableTextfield: React.FC<StepComponentProps> = props => {
			const { step, onChange } = props
			const handleOutputChange = useTextFieldChangeHandler(
				step,
				(_s, val) => onOutputChanged({ name: val as string, node: step.id }),
				onChange,
			)

			return (
				<Container className="with-output-column-textfield">
					<Component {...props} />
					<LeftAlignedRow>
						<TextField
							required
							disabled={disabled}
							label={label || 'Output table'}
							placeholder={'Table name'}
							value={step.id}
							styles={dropdownStyles}
							onChange={handleOutputChange}
						/>
					</LeftAlignedRow>
				</Container>
			)
		}
		return memo(WithOutputTableTextfield)
	}
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-content: flex-start;
	justify-content: flex-start;
`
