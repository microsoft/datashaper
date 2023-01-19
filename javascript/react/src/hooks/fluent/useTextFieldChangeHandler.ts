/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { produce } from 'immer'
import { useCallback } from 'react'

import type { StepChangeFunction } from '../../types.js'

export type TextFieldChangeHandler = (
	event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
	newValue?: string,
) => void

export function useTextFieldChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, updated: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): TextFieldChangeHandler {
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	return useCallback(getTextFieldChangeHandler(step, updateFn, onChange), [
		step,
		updateFn,
		onChange,
	])
}
function getTextFieldChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, updated: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): TextFieldChangeHandler {
	return (_event, newValue) => {
		onChange?.(
			produce(step, (draft) => {
				updateFn(draft as Step<T>, newValue)
			}),
		)
	}
}
