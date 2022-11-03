/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton } from '@fluentui/react'
import { memo } from 'react'

import { icons, SaveButtonWrapper } from './SaveButton.styles.js'
import type { SaveButtonProps } from './SaveButton.types.js'

export const SaveButton: React.FC<SaveButtonProps> = memo(function SaveButton({
	onClick,
	disabled,
}) {
	return (
		<SaveButtonWrapper>
			{onClick ? (
				<ActionButton
					onClick={onClick}
					iconProps={icons.checkMark}
					disabled={disabled}
				>
					Save
				</ActionButton>
			) : null}
		</SaveButtonWrapper>
	)
})
