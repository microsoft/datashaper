/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton } from '@fluentui/react'
import { memo } from 'react'

import { icons } from './DeleteButton.styles.js'
import type { DeleteButtonProps } from './DeleteButton.types.js'

export const DeleteButton: React.FC<DeleteButtonProps> = memo(
	function DeleteButton({ onClick }) {
		return onClick ? (
			<ActionButton onClick={onClick} iconProps={icons.delete}>
				Delete
			</ActionButton>
		) : null
	},
)
