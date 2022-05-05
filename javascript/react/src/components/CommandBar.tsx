/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CommandBar as CB } from '@fluentui/react'
import { memo } from 'react'

import {
	useColorDefaults,
	useCommands,
	useCommandStyles,
	useHandleOnDataGrown,
	useHandleOnDataReduce,
	useOverflowButtonProps,
} from './CommandBar.hooks.js'
import type { CommandBarProps } from './CommandBar.types.js'
import { CommandBarWrapper } from './CommandBar.styles.js'

/**
 * Extends the fluent command bar to override styles and collapsing for our inverted header
 */
export const CommandBar: React.FC<CommandBarProps> = memo(function CommandBar({
	items,
	height,
	bgColor,
	color,
	styles,
	...props
}) {
	const { foreground, background } = useColorDefaults(color, bgColor)
	const overflowButtonProps = useOverflowButtonProps(background, foreground)
	const handleOnDataReduce = useHandleOnDataReduce(foreground)
	const handleOnDataGrown = useHandleOnDataGrown(foreground)
	const commandStyles = useCommandStyles(styles)
	const fixedItems = useCommands(items, background, foreground)
	return (
		<CommandBarWrapper bgColor={background} color={foreground}>
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
