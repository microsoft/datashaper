/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ICommandBarProps } from '@fluentui/react'
import { CommandBar as CB } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import {
	useColorDefaults,
	useCommands,
	useCommandStyles,
	useHandleOnDataGrown,
	useHandleOnDataReduce,
	useOverflowButtonProps,
} from './CommandBar.hooks.js'

interface CommandBarProps extends ICommandBarProps {
	height?: string
	bgColor?: string
	color?: string
	far?: boolean
}

/**
 * Extends the fluent command bar to override styles and collapsing for our inverted header
 */
export const CommandBar: React.FC<CommandBarProps> = memo(function CommandBar({
	items,
	height,
	bgColor,
	color,
	far = false,
	styles,
	...props
}) {
	const { foreground, background } = useColorDefaults(color, bgColor)
	const overflowButtonProps = useOverflowButtonProps(background, foreground)
	const handleOnDataReduce = useHandleOnDataReduce(foreground)
	const handleOnDataGrown = useHandleOnDataGrown(foreground)
	const commandStyles = useCommandStyles(height, styles)
	const fixedItems = useCommands(items, background, foreground)

	return (
		<CommandBarWrapper
			height={height}
			far={far}
			bgColor={background}
			color={foreground}
		>
			<CB
				items={fixedItems}
				styles={commandStyles}
				overflowButtonProps={overflowButtonProps}
				onDataReduced={handleOnDataReduce}
				onDataGrown={handleOnDataGrown}
				{...props}
			/>
		</CommandBarWrapper>
	)
})

const CommandBarWrapper = styled.div<{
	height?: string
	bgColor: string
	color: string
	far?: boolean
}>`
	width: 100%;
	background-color: ${({ bgColor }) => bgColor};
	color: ${({ color }) => color || 'inherit'};
	height: ${({ height }) => height};
	display: flex;
	justify-content: ${({ far }) => (far ? 'flex-end' : 'flex-start')};
`
