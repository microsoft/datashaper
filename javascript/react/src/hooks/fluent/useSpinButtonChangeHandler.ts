/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { produce } from 'immer'
import { useCallback } from 'react'

import type { StepChangeFunction } from '../../types.js'

export type SpinButtonChangeHandler = (
	event: React.SyntheticEvent<HTMLElement>,
	newValue?: string,
) => void

/**
 * Enforces numeric values for a SpinButton onChange.
 * @param step - the step object
 * @param updateFn - the update function
 * @param onChange -the onchange handler
 * @returns
 */
export function useSpinButtonChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, newValue: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): SpinButtonChangeHandler {
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	return useCallback(getSpinButtonChangeHandler(step, updateFn, onChange), [
		step,
		onChange,
		updateFn,
	])
}
function getSpinButtonChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, newValue: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): SpinButtonChangeHandler {
	return (_event, newValue) => {
		onChange?.(
			produce(step, draft => {
				updateFn(draft as Step<T>, newValue)
			}),
		)
	}
}
