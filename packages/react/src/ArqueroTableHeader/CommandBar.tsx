/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	CommandBar as CB,
	ICommandBarItemProps,
	IIconProps,
} from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { HEIGHT } from './constants.js'

interface CommandBarProps {
	commands: ICommandBarItemProps[]
	width?: string
	bgColor?: string
	color?: string
}

export const CommandBar: React.FC<CommandBarProps> = memo(function CommandBar({
	commands,
	width,
	bgColor,
	color,
}) {
	const overflowButtonProps = useOverflowButtonProps(bgColor, color)
	const handleOnDataReduce = useHandleOnDataReduce(color)
	const handleOnDataGrown = useHandleOnDataGrown()

	return (
		<CommandBarWrapper width={width}>
			<CB
				items={commands}
				styles={commandStyles}
				overflowButtonProps={overflowButtonProps}
				onDataReduced={handleOnDataReduce}
				onDataGrown={handleOnDataGrown}
			/>
		</CommandBarWrapper>
	)
})

const useHandleOnDataReduce = (color?: string) => {
	const iconProps = useIconProps()
	return useCallback(
		(item: ICommandBarItemProps) => {
			item.iconProps = iconProps(item, color)
			item.text = item.text || item.title || ''
		},
		[iconProps, color],
	)
}

const useHandleOnDataGrown = () => {
	const iconProps = useIconProps()
	const theme = useThematic()
	return useCallback(
		(item: ICommandBarItemProps) => {
			item.iconProps = iconProps(item, theme.application().foreground().hex())
		},
		[iconProps, theme],
	)
}

const useOverflowButtonProps = (bgColor?: string, color?: string) => {
	const theme = useThematic()
	return useMemo(
		() => ({
			styles: {
				root: {
					background: bgColor || theme.application().accent().hex(),
				},
				menuIcon: {
					color: color || theme.application().background().hex(),
				},
			},
		}),
		[theme, bgColor, color],
	)
}

const useIconProps = (): ((
	item: ICommandBarItemProps,
	color?: string,
) => IIconProps) => {
	const theme = useThematic()
	return useCallback(
		(item: ICommandBarItemProps, color?: string) => ({
			...item.iconProps,
			styles: {
				root: {
					color: color || theme.application().foreground().hex(),
				},
			},
		}),
		[theme],
	)
}

const commandStyles = {
	root: {
		float: 'right',
		height: HEIGHT,
		background: 'none',
		padding: 0,
	},
}

const CommandBarWrapper = styled.div<{ width?: string }>`
	width: ${({ width }) => width || '25%'};
`
