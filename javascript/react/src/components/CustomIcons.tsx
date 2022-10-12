/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Icon } from '@fluentui/react'
import { mergeStyles } from '@fluentui/react/lib/Styling'

interface CustomIconProps {
	fontSize?: number
	color?: string
}

const defaultIconClass = mergeStyles({
	fontSize: 16,
	width: 16,
	height: 16,
	lineHeight: 16,
})

export const HistoryIcon = (props: CustomIconProps): JSX.Element => {
	const { fontSize, color } = props
	return (
		<Icon
			iconName="History"
			className={mergeStyles(defaultIconClass, {
				fontSize,
				color,
			})}
		/>
	)
}
