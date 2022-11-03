/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps } from '@fluentui/react'

/**
 * Conditionally renders an action button based on
 * whether the onClick handler is defined
 */
export interface ActionButtonProps extends IButtonProps {
	/**
	 * The type of button to render. Default='action'
	 */
	type?: 'action' | 'default' | 'icon'

	/**
	 * The onclick handler. If undefined, no button is rendered
	 */
	onClick?: () => void
}
