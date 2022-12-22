/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import { useDefaultCodebookStyles } from '../styles.js'
import type { CodebookStyles } from '../types.js'

export function useFieldEditorStyles(styles?: CodebookStyles): CodebookStyles {
	const theme = useTheme()
	const defaults = useDefaultCodebookStyles()
	return useMemo(() => {
		return merge(
			{
				root: {
					border: `1px solid ${theme.palette.neutralTertiaryAlt}`,
				},
			},
			defaults,
			styles,
		)
	}, [theme, styles, defaults])
}
