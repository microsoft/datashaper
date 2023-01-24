/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import type { IDropdownOption } from '@fluentui/react'
import { produce } from 'immer'
import { useCallback } from 'react'

import type { StepChangeFunction } from '../../types.js'

export type DropdownChangeHandler = (
	event: React.FormEvent<HTMLDivElement>,
	option?: IDropdownOption,
	index?: number,
) => void

/**
 * Creates a callback handler for changing the step based on a dropdown value.
 * This only handles basic cases where the dropdown option key can be set on the
 * step using an object path.
 */
export function useDropdownChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, optionKey: string | number | undefined) => void,
	onChange?: StepChangeFunction<T>,
): DropdownChangeHandler {
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	return useCallback(getDropdownChangeHandler(step, updateFn, onChange), [
		step,
		onChange,
		updateFn,
	])
}

function getDropdownChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, optionKey: string | number | undefined) => void,
	onChange?: StepChangeFunction<T>,
): DropdownChangeHandler {
	return (_event, option) => {
		onChange?.(
			produce(step, (draft) => {
				updateFn(draft as Step<T>, option?.key)
			}),
		)
	}
}
