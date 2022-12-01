/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import { memo, useCallback } from 'react'

import type { CodebookTextFieldProps } from './Codebook.types.js'

export const CodebookDescriptionField: React.FC<CodebookTextFieldProps> = memo(
	function CodebookDescriptionField(props) {
		const { styles, field, onChangeInput, onChange } = props

		const onChangeValue = useCallback(
			(
				_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
				description?: string,
			) => {
				onChangeInput?.({ ...field, description })
				onChange?.(_, description)
			},
			[onChangeInput, onChange, field],
		)

		return (
			<TextField
				multiline
				styles={styles}
				disabled={field.exclude}
				name="displayName"
				value={field.description}
				onChange={onChangeValue}
				rows={3}
				resizable={false}
				{...props}
			/>
		)
	},
)
