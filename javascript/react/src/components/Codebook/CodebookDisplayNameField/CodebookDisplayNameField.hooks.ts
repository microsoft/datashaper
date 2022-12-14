/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

import type { CodebookTextFieldProps } from '../types.js'

export function useOnChange({
	onChangeField,
	onChange,
	field,
}: CodebookTextFieldProps): (
	_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
	unit?: string,
) => void {
	return useCallback(
		(
			_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
			title?: string,
		) => {
			onChangeField?.({ ...field, title })
			onChange?.(_ev, title)
		},
		[onChangeField, onChange, field],
	)
}
