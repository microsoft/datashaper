/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ITextFieldProps, TextField } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import merge from 'lodash-es/merge.js'
import { memo, useMemo } from 'react'

/**
 * This is a standard TextField, with default styles overridden
 * to provide some consistent "read only look" that visually
 * indicates the field can't be edited without looking fully disabled.
 */
export const ReadOnlyTextField: React.FC<ITextFieldProps> = memo(
	function ReadOnlyTextField(props) {
		const { styles, ...rest } = props
		const theme = useThematic()
		const baseStyles = useMemo(() => {
			return merge(
				{
					field: {
						color: theme.application().midContrast().hex(),
					},
					fieldGroup: {
						borderColor: theme.application().lowContrast().hex(),
					},
				},
				styles,
			)
		}, [theme, styles])
		return <TextField readOnly styles={baseStyles} {...rest} />
	},
)
