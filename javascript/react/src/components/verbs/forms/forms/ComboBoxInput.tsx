/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { ComboBox } from '@fluentui/react'
import noop from 'lodash-es/noop.js'
import { Fragment, memo } from 'react'

import {
	useComboBoxChangeHandler,
	useComboBoxInputValueChangeHandler,
} from '../../../../hooks/index.js'
import type { StepChangeFunction } from '../../../../types.js'
import { dropdownStyles } from '../styles.js'
import type { ComboBoxFormInput } from './ComboBoxInput.types.js'

export const ComboBoxInput: React.FC<{
	input: ComboBoxFormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function ComboBoxInput({
	step,
	input: {
		label,
		placeholder,
		current,
		required,
		options,
		disabled,
		wrapper: Wrapper = Fragment,
		onChange: updater,
		onInputValueChange,
		allowFreeform,
	},
	onChange,
}) {
	const changeHandler = useComboBoxChangeHandler(step, updater, onChange)
	const valueChangeHandler = useComboBoxInputValueChangeHandler(
		step,
		onInputValueChange || noop,
		onChange,
	)
	return (
		<Wrapper>
			<ComboBox
				required={required}
				label={label}
				placeholder={placeholder}
				styles={dropdownStyles}
				selectedKey={current as number | string}
				text={allowFreeform === true ? (current as string) : ''}
				options={options}
				disabled={disabled}
				onChange={changeHandler}
				onInputValueChange={valueChangeHandler}
				allowFreeform={allowFreeform}
				autoComplete={'off'}
			/>
		</Wrapper>
	)
})
