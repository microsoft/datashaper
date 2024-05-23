/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import { memo } from 'react'

import type { CodebookTextFieldProps } from '../types.js'
import { useOnChangeValue } from './CodebookUnitField.hooks.js'

export const CodebookUnitField: React.FC<CodebookTextFieldProps> = memo(
	function CodebookUnitField(props) {
		const { styles, field } = props
		const onChangeValue = useOnChangeValue(props)

		return (
			<TextField
				styles={styles}
				disabled={field.exclude}
				name='unit'
				value={field.unit}
				onChange={onChangeValue}
				{...props}
			/>
		)
	},
)
