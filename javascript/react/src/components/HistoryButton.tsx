/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { HistoryIcon } from '@datashaper/react'
import { Button } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import React, { memo } from 'react'

import { buttonStyles } from './HistoryButton.styles.js'
import type { HistoryButtonProps } from './HistoryButton.types.js'

export const HistoryButton: React.FC<HistoryButtonProps> = memo(
	function HistoryButton({ onClick }) {
		const theme = useThematic()
		return (
			<Button onClick={onClick} styles={buttonStyles}>
				<HistoryIcon color={theme.application().accent().hex()} />
			</Button>
		)
	},
)
