/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

import type { CodebookTextFieldProps } from '../types.js'

export function useOnChangeValue({
	onChange,
	onChangeField,
	field,
}: CodebookTextFieldProps) {
	return useCallback(
		(
			_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
			unit?: string,
		) => {
			onChangeField?.({ ...field, unit })
			onChange?.(_ev, unit)
		},
		[onChangeField, onChange, field],
	)
}
