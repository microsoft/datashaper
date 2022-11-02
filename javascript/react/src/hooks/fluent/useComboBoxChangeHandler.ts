/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import type { IComboBox, IComboBoxOption } from '@fluentui/react'
import { produce } from 'immer'
import { useCallback } from 'react'

import type { StepChangeFunction } from '../../types.js'

export type ComboBoxChangeHandler = (
	event: React.FormEvent<IComboBox>,
	option: IComboBoxOption | undefined,
	index: number | undefined,
	value?: string | undefined,
) => void

/**
 * Creates a callback handler for changing the step based on a combobox value.
 * This only handles basic cases where the combobox option key can be set on the
 * step using an object path.
 */
export function useComboBoxChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (
		step: Step<T>,
		optionKey: string | number | undefined,
		value: string | undefined,
	) => void,
	onChange?: StepChangeFunction<T>,
): ComboBoxChangeHandler {
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	return useCallback(getComboBoxChangeHandler(step, updateFn, onChange), [
		step,
		onChange,
		updateFn,
	])
}

function getComboBoxChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (
		step: Step<T>,
		optionKey: string | number | undefined,
		value: string | undefined,
	) => void,
	onChange?: StepChangeFunction<T>,
): ComboBoxChangeHandler {
	return (_event, option, _index, value) => {
		onChange?.(
			produce(step, draft => {
				updateFn(draft as Step<T>, option?.key, value)
			}),
		)
	}
}
