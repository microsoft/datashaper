/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IIconProps } from '@fluentui/react'
import type React from 'react'

export interface ToolPanelProps {
	onDismiss?: () => void
	headerText?: string
	headerIconProps?: IIconProps
	hasCloseButton?: boolean
	closeIconProps?: IIconProps
	styles?: {
		root?: React.CSSProperties
		header?: React.CSSProperties
		title?: React.CSSProperties
		content?: React.CSSProperties
	}
}
