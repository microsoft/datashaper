import { useMemo } from 'react'
import { useThematic } from '@thematic/react'
import type { ReadOnlyTextFieldProps } from './ReadOnlyTextField.types.js'

import merge from 'lodash-es/merge'

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
