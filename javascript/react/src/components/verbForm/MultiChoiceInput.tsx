/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { MultiDropdown } from '@essex/components'
import { Fragment, memo } from 'react'

import {
	useDropdownChangeAllHandler,
	useDropdownChangeHandler,
} from '../../hooks/index.js'
import type { StepChangeFunction } from '../../types.js'
import { dropdownStyles } from '../styles.js'
import type { MultiChoiceFormInput } from './MultiChoiceInput.types.js'

export const MultiChoiceInput: React.FC<{
	input: MultiChoiceFormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function MultiChoiceInput({
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
		onChangeAll: allUpdater,
	},
	onChange,
}) {
	const dropdownChangeHandler = useDropdownChangeHandler(
		step,
		updater,
		onChange,
	)
	const dropdownChangeAllHandler = useDropdownChangeAllHandler(
		step,
		allUpdater,
		onChange,
	)
	return (
		<Wrapper>
			<MultiDropdown
				required={required}
				label={label}
				placeholder={placeholder}
				styles={dropdownStyles}
				selectedKeys={current}
				options={options!}
				disabled={disabled}
				onChange={dropdownChangeHandler}
				onChangeAll={dropdownChangeAllHandler}
			/>
		</Wrapper>
	)
})
