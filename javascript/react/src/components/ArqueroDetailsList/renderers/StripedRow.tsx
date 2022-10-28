/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DetailsRow } from '@fluentui/react'
import { memo } from 'react'

import { useStyles } from './StripedRow.styles.js'
import type { RichRowProps } from './types.js'

/**
 * Render a striped DetailsRow
 */
export const StripedRow: React.FC<RichRowProps> = memo(function StripedRow(
	props,
) {
	const customStyles = useStyles(props)
	return <DetailsRow {...props} styles={customStyles} />
})
