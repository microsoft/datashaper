/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CommandBar as CommandBarComponent } from '@fluentui/react'
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

/**
 * Extends the fluent command bar to override styles and collapsing for our inverted header
 */
export const CommandBar: React.FC<CommandBarProps> = memo(function CommandBar({
	items,
	height,
	background,
	color,
	styles,
	...props
}) {
	const { foreground, background: bg } = useColorDefaults(color, background)
	const overflowButtonProps = useOverflowButtonProps(bg, foreground)
	const handleOnDataReduce = useHandleOnDataReduce(foreground)
	const handleOnDataGrown = useHandleOnDataGrown(foreground)
	const commandStyles = useCommandStyles(styles)
	const fixedItems = useCommands(items, bg, foreground)
	return (
		<CommandBarComponent
			items={fixedItems}
			styles={commandStyles}
			overflowButtonProps={overflowButtonProps}
			onDataReduced={handleOnDataReduce}
			onDataGrown={handleOnDataGrown}
			{...props}
		/>
	)
})
