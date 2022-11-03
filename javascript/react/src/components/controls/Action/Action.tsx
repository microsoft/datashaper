/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, DefaultButton } from '@fluentui/react'
import { memo } from 'react'

import type { ActionButtonProps } from './Action.types.js'

export const Action: React.FC<ActionButtonProps> = memo(function MaybeButton({
	onClick,
	type,
	...props
}) {
	const Button = type === 'default' ? DefaultButton : ActionButton
	return onClick ? <Button {...props} onClick={onClick} /> : null
})
