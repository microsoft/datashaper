/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, DefaultButton, IconButton } from '@fluentui/react'
import { memo, useMemo } from 'react'

import type { ActionButtonProps } from './Action.types.js'

export const Action: React.FC<ActionButtonProps> = memo(function MaybeButton({
	onClick,
	type,
	...props
}) {
	const Button = useMemo(() => getButtonType(type), [type])
	return onClick ? <Button {...props} onClick={onClick} /> : null
})

function getButtonType(type: ActionButtonProps['type']) {
	switch (type) {
		case 'icon':
			return IconButton
		case 'default':
			return DefaultButton
		case 'action':
			return ActionButton
		default:
			return ActionButton
	}
}
