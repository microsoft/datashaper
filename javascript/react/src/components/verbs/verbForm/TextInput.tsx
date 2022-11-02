/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { TextField } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { Fragment, memo } from 'react'

import { useTextFieldChangeHandler } from '../../../hooks/index.js'
import type { StepChangeFunction } from '../../../types.js'
import { dropdownStyles } from '../../styles.js'
import type { TextFormInput } from './TextInput.types.js'

export const TextInput: React.FC<{
	input: TextFormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function TextInput({
	step,
	input: {
		label,
		placeholder,
		required,
		current,
		wrapper: Wrapper = Fragment,
		onChange: updater,
		disabled,
		styles,
	},
	onChange,
}) {
	const changeHandler = useTextFieldChangeHandler(step, updater, onChange)
	return (
		<Wrapper>
			<TextField
				label={label}
				placeholder={placeholder}
				required={required}
				value={current}
				onChange={changeHandler}
				disabled={disabled}
				styles={merge({}, dropdownStyles, styles)}
			/>
		</Wrapper>
	)
})
