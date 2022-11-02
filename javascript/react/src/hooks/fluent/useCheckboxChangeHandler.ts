/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { produce } from 'immer'
import { useCallback } from 'react'

import type { StepChangeFunction } from '../../types.js'

export type CheckboxChangeHandler = (
	event?: React.FormEvent<HTMLElement | HTMLInputElement>,
	checked?: boolean,
) => void

export function useCheckboxChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, newValue: boolean | undefined) => void,
	onChange?: StepChangeFunction<T>,
): CheckboxChangeHandler {
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	return useCallback(getCheckboxChangeHandler(step, updateFn, onChange), [
		step,
		updateFn,
		onChange,
	])
}
function getCheckboxChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, newValue: boolean | undefined) => void,
	onChange?: StepChangeFunction<T>,
): CheckboxChangeHandler {
	return (_event, checked) => {
		onChange?.(
			produce(step, draft => {
				updateFn(draft as Step<T>, checked)
			}),
		)
	}
}
