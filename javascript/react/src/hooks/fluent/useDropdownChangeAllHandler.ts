/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import type { IDropdownOption } from '@fluentui/react'
import { produce } from 'immer'
import { useCallback } from 'react'

import type { StepChangeFunction } from '../../types.js'

export type DropdownChangeAllHandler = (
	event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLElement>,
	options?: IDropdownOption[],
) => void

export function useDropdownChangeAllHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, optionKeys: (string | number)[]) => void,
	onChange?: StepChangeFunction<T>,
): DropdownChangeAllHandler {
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	return useCallback(getDropdownChangeAllHandler(step, updateFn, onChange), [
		step,
		onChange,
		updateFn,
	])
}

function getDropdownChangeAllHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, optionKeys: (string | number)[]) => void,
	onChange?: StepChangeFunction<T>,
): DropdownChangeAllHandler {
	return (_event, options) => {
		onChange?.(
			produce(step, draft => {
				updateFn(
					draft as Step<T>,
					options ? options.map(option => option.key) : [],
				)
			}),
		)
	}
}
