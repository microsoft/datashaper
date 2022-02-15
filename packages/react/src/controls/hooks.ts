/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import type { IDropdownOption } from '@fluentui/react'
import { set } from 'lodash'
import { useCallback } from 'react'

function updateStep(
	step: Step,
	path: string,
	value: string | number | undefined,
	onChange?: (update: Step) => void,
) {
	const update = {
		...step,
	}
	set(update, path, value)
	onChange && onChange(update)
}

/**
 * Creates a callback handler for changing the step based on a dropdown value.
 * This only handles basic cases where the dropdown option key can be set on the
 * step using an object path.
 */
export function useHandleDropdownChange(
	step: Step,
	path: string,
	onChange?: (update: Step) => void,
): (
	event: React.FormEvent<HTMLDivElement>,
	option?: IDropdownOption,
	index?: number,
) => void {
	return useCallback(
		(_event, option) => updateStep(step, path, option?.key, onChange),
		[step, path, onChange],
	)
}
