/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import React, { memo } from 'react'

import { HistoryIcon } from './CustomIcons.js'
import { buttonStyles } from './HistoryButton.styles.js'
import type { HistoryButtonProps } from './HistoryButton.types.js'

export const HistoryButton: React.FC<HistoryButtonProps> = memo(
	function HistoryButton({
		onClick,
		steps = 0,
		showText = false,
		styles = {},
		title = 'History',
	}) {
		const theme = useTheme()
		return (
			<ActionButton onClick={onClick} styles={merge({}, buttonStyles, styles)}>
				<HistoryIcon color={theme.palette.themePrimary} />
				{showText ? `${title} ${steps ? `(${steps})` : ''}` : null}
			</ActionButton>
		)
	},
)
