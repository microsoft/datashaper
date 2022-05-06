/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import { memo, useEffect } from 'react'
import styled from 'styled-components'

import { useTextFieldChangeHandler } from '../hooks/index.js'
import { dropdownStyles, LeftAlignedRow } from '../styles.js'
import type { StepComponentProps } from '../types.js'
import type { HOCFunction } from './types.js'

/**
 * Higher order component generator to wrap a Step in the output column text field.
 * @param label - optional label to use for the textfield instead of the default.
 * @returns
 */
export function withOutputTableTextfield(
	label?: string,
	disabled?: boolean,
): HOCFunction<StepComponentProps> {
	return Component => {
		const WithOutputTableTextfield: React.FC<StepComponentProps> = props => {
			const { step, onChange, onChangeOutput, output } = props
			const handleOutputChange = useTextFieldChangeHandler(
				step,
				(_s, val) => onChangeOutput(val as string),
				onChange,
			)

			useEffect(
				function useDefaultOutputNameInitially() {
					onChangeOutput(output ?? step.id)
				},
				[
					/* only on initial render */
				],
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
							value={output ?? step.id}
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
