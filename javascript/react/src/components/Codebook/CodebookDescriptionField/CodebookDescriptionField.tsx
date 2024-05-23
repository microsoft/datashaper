/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import { memo } from 'react'

import type { CodebookTextFieldProps } from '../types.js'
import { useOnChangeValue } from './CodebookDescriptionField.hooks.js'

export const CodebookDescriptionField: React.FC<CodebookTextFieldProps> = memo(
	function CodebookDescriptionField(props) {
		const { styles, field } = props
		const onChangeValue = useOnChangeValue(props)

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
