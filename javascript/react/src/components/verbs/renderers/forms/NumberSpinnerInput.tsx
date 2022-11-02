/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { Position, SpinButton } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { Fragment, memo } from 'react'

import { useSpinButtonChangeHandler } from '../../../../hooks/index.js'
import type { StepChangeFunction } from '../../../../types.js'
import { dropdownStyles } from '../styles.js'
import type { NumberSpinnerFormInput } from './NumberSpinnerInput.types.js'

export const NumberSpinnerInput: React.FC<{
	input: NumberSpinnerFormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function NumberSpinnerInput({
	step,
	input: {
		label,
		placeholder,
		current,
		min,
		max,
		step: spinStep,
		disabled,
		wrapper: Wrapper = Fragment,
		onChange: updater,
		styles,
	},
	onChange,
}) {
	const changeHandler = useSpinButtonChangeHandler(step, updater, onChange)
	return (
		<Wrapper>
			<SpinButton
				label={label}
				labelPosition={Position.top}
				placeholder={placeholder}
				min={min}
				max={max}
				step={spinStep}
				value={current ? `${current}` : ''}
				onChange={changeHandler}
				disabled={disabled}
				styles={merge({}, dropdownStyles, styles)}
			/>
		</Wrapper>
	)
})
