/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITooltipHostProps } from '@fluentui/react'
import { DirectionalHint } from '@fluentui/react'
import { memo } from 'react'

import { Tooltip } from '../Tooltip/index.js'
import { tooltipStyles } from './FileTreeTooltip.styles.js'

export const FileTreeTooltip: React.FC<ITooltipHostProps> = memo(
	function FileTreeTooltip({
		content,
		children,
		directionalHint = DirectionalHint.rightCenter,
		styles = tooltipStyles,
		...props
	}) {
		return (
			<Tooltip
				directionalHint={directionalHint}
				styles={styles}
				content={content}
				{...props}
			>
				{children}
			</Tooltip>
		)
	},
)
