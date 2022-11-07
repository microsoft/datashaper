/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { produce } from 'immer'
import { useCallback } from 'react'

import type { StepChangeFunction } from '../../types.js'
export type ComboBoxInputValueChangeHandler = (
	value?: string | undefined,
) => void

/**
 * Creates a callback handler for changing the step based on a combobox value.
 * This only handles basic cases where the combobox option key can be set on the
 * step using an object path.
 */
export function useComboBoxInputValueChangeHandler<
	T extends object | void | unknown,
>(
	step: Step<T>,
	updateFn: (step: Step<T>, value: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): ComboBoxInputValueChangeHandler {
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	return useCallback(
		getComboBoxInputValueChangeHandler(step, updateFn, onChange),
		[step, onChange, updateFn],
	)
}

function getComboBoxInputValueChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, value: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): ComboBoxInputValueChangeHandler {
	return value => {
		onChange?.(
			produce(step, draft => {
				updateFn(draft as Step<T>, value)
			}),
		)
	}
}
