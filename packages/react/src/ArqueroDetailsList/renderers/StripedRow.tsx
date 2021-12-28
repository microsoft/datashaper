/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DetailsRow } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import React, { memo, useMemo } from 'react'

import { RichRowProps } from './types'

/**
 * Render a striped DetailsRow
 */
export const StripedRow: React.FC<RichRowProps> = memo(function StripedRow(
	props,
) {
	const theme = useThematic()
	const { striped, styles, ...rest } = props
	const index = props.itemIndex
	const customStyles = useMemo(() => {
		if (striped && index % 2 === 0) {
			return {
				root: {
					width: '100%',
					background: theme.application().faint().hex(),
				},
				...styles,
			}
		}
		return styles
	}, [theme, striped, styles, index])

	return <DetailsRow {...rest} styles={customStyles} />
})
