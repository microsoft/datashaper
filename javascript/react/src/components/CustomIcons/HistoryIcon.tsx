/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Icon } from '@fluentui/react'
import { mergeStyles } from '@fluentui/react/lib/Styling'
import { memo } from 'react'

import { defaultIconClass } from './CustomIcons.styles.js'
import type { CustomIconProps } from './CustomIcons.types.js'

export const HistoryIcon: React.FC<CustomIconProps> = memo(
	function HistoryIcon({ fontSize, color }) {
		return (
			<Icon
				iconName="History"
				className={mergeStyles(defaultIconClass, {
					fontSize,
					color,
				})}
			/>
		)
	},
)
