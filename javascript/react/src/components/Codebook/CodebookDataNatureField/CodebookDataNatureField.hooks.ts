/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { VariableNature } from '@datashaper/schema'
import type { IDropdownOption } from '@fluentui/react'
import type { FormEvent} from 'react';
import { useCallback } from 'react'

import type { CodebookEnumDropdownFieldProps } from '../types.js'

export function useOnChangeValue({
	field,
	onChange,
	onChangeField,
}: CodebookEnumDropdownFieldProps) {
	return useCallback(
		(
			event: FormEvent<HTMLDivElement>,
			option?: IDropdownOption<any>,
			index?: number | undefined,
		) => {
			onChangeField?.({ ...field, nature: option?.key as VariableNature })
			onChange?.(event, option, index)
		},
		[onChange, onChangeField, field],
	)
}
