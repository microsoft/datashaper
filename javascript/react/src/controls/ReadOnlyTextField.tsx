/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import { memo } from 'react'
import type { ReadOnlyTextFieldProps } from './ReadOnlyTextField.types.js'
import { useBaseStyles } from './ReadOnlyTextField.hooks.js'

/**
 * This is a standard TextField, with default styles overridden
 * to provide some consistent "read only look" that visually
 * indicates the field can't be edited without looking fully disabled.
 */
export const ReadOnlyTextField: React.FC<ReadOnlyTextFieldProps> = memo(
	function ReadOnlyTextField({ styles, ...props }) {
		const baseStyles = useBaseStyles(styles)
		return <TextField readOnly styles={baseStyles} {...props} />
	},
)
