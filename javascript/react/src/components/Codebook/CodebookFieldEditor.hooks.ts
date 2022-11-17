/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDropdownOption } from '@fluentui/react'
import type { FormEvent } from 'react'
import { useCallback } from 'react'

export function useTextChange(
	onChange: (params: any) => void,
): (
	event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
	value?: string | undefined,
) => void {
	return useCallback(
		(
			event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
			value?: string | undefined,
		) => {
			onChange({ [event.currentTarget.name]: value })
		},
		[onChange],
	)
}
export function useDropdownChange(
	onChange: (params: any) => void,
): (name: string, option?: IDropdownOption<any> | undefined) => void {
	return useCallback(
		(name: string, option?: IDropdownOption<any> | undefined) => {
			onChange({ [name]: option?.key })
		},
		[onChange],
	)
}
