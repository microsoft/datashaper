/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import { memo, useCallback } from 'react'

import type { CodebookTextFieldProps } from './Codebook.types.js'

export const CodebookUnitField: React.FC<CodebookTextFieldProps> = memo(
	function CodebookUnitField(props) {
		const { styles, field, onChange, onChangeField } = props

		const onChangeValue = useCallback(
			(
				_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
				unit?: string,
			) => {
				onChangeField?.({ ...field, unit })
				onChange?.(_, unit)
			},
			[onChangeField, onChange, field],
		)

		return (
			<TextField
				styles={styles}
				disabled={field.exclude}
				name="unit"
				value={field.unit}
				onChange={onChangeValue}
				{...props}
			/>
		)
	},
)
