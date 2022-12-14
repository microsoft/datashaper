/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

import type { CodebookTextFieldProps } from '../types.js'

export function useOnChangeValue({
	field,
	onChange,
	onChangeField,
}: CodebookTextFieldProps): (
	_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
	unit?: string,
) => void {
	return useCallback(
		(
			_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
			description?: string,
		) => {
			onChangeField?.({ ...field, description })
			onChange?.(_ev, description)
		},
		[onChangeField, onChange, field],
	)
}
