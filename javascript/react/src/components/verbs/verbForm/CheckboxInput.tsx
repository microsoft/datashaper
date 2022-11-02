/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { Checkbox } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { Fragment, memo } from 'react'

import { useCheckboxChangeHandler } from '../../../hooks/index.js'
import type { StepChangeFunction } from '../../../types.js'
import { checkboxStyles } from '../../styles.js'
import type { CheckboxFormInput } from './CheckboxInput.types.js'

export const CheckboxInput: React.FC<{
	input: CheckboxFormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function CheckboxInput({
	step,
	input: {
		label,
		required,
		current,
		wrapper: Wrapper = Fragment,
		onChange: updater,
		disabled,
		styles,
	},
	onChange,
}) {
	const changeHandler = useCheckboxChangeHandler(step, updater, onChange)
	return (
		<Wrapper>
			<Checkbox
				label={label}
				required={required}
				checked={current}
				onChange={changeHandler}
				disabled={disabled}
				styles={merge({}, checkboxStyles, styles)}
			/>
		</Wrapper>
	)
})
