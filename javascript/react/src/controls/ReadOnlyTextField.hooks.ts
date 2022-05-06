/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import merge from 'lodash-es/merge'
import { useMemo } from 'react'

import type { ReadOnlyTextFieldProps } from './ReadOnlyTextField.types.js'

export function useBaseStyles(styles: ReadOnlyTextFieldProps['styles']) {
	const theme = useThematic()
	return useMemo(() => {
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
}
