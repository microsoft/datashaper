/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IButtonStyles } from '@fluentui/react'

export interface HistoryButtonProps {
	onClick?: () => void
	steps?: number
	showText?: boolean
	styles?: IButtonStyles
}
