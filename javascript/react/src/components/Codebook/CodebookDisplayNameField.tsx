/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import { memo, useCallback } from 'react'

import type { CodebookTextFieldProps } from './Codebook.types.js'

export const CodebookDisplayNameField: React.FC<CodebookTextFieldProps> = memo(
	function CodebookDisplayNameField(props) {
		const { styles, field, onChangeField } = props

		const onChange = useCallback(
			(
				_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
				title?: string,
			) => {
				onChangeField?.({ ...field, title })
				props.onChange?.(_, title)
			},
			[onChangeField, props, field],
		)

		return (
			<TextField
				styles={styles}
				disabled={field.exclude}
				name="displayName"
				value={field.title}
				{...props}
				onChange={onChange}
			/>
		)
	},
)
