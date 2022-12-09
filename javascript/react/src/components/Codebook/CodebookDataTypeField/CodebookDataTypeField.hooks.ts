/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataType } from '@datashaper/schema'
import type { IDropdownOption } from '@fluentui/react'
import type { FormEvent } from 'react'
import { useCallback } from 'react'

import type { CodebookEnumDropdownFieldProps } from '../types.js'
export function useOnChangeValue({
	field,
	onChange,
	onChangeField,
}: CodebookEnumDropdownFieldProps): (
	_ev: React.FormEvent<HTMLDivElement>,
	option?: IDropdownOption<any>,
	index?: number | undefined,
) => void {
	return useCallback(
		(
			event: FormEvent<HTMLDivElement>,
			option?: IDropdownOption<any>,
			index?: number | undefined,
		) => {
			onChangeField?.({ ...field, type: option?.key as DataType })
			onChange?.(event, option, index)
		},
		[onChange, onChangeField, field],
	)
}
