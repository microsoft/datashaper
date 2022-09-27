/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { HistoryIcon } from '@datashaper/react'
import { ActionButton } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import merge from 'lodash-es/merge.js'
import React, { memo } from 'react'

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
		const theme = useThematic()
		return (
			<ActionButton onClick={onClick} styles={merge({}, buttonStyles, styles)}>
				<HistoryIcon color={theme.application().accent().hex()} />
				{showText ? `${title} ${steps ? `(${steps})` : ''}` : null}
			</ActionButton>
		)
	},
)
