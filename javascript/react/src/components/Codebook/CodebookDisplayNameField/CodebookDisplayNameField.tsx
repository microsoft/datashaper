/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import { memo } from 'react'

import type { CodebookTextFieldProps } from '../types.js'
import { useOnChange } from './CodebookDisplayNameField.hooks.js'

export const CodebookDisplayNameField: React.FC<CodebookTextFieldProps> = memo(
	function CodebookDisplayNameField(props) {
		const { styles, field } = props
		const onChange = useOnChange(props)

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
