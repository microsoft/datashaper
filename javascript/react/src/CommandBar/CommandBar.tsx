/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	ICommandBarItemProps,
	ICommandBarStyles,
	IIconProps,
} from '@fluentui/react'
import { CommandBar as CB } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import merge from 'lodash-es/merge.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { useCommands } from './useCommands.js'

interface CommandBarProps {
	commands: ICommandBarItemProps[]
	width?: string
	height?: string
	bgColor?: string
	color?: string
	styles?: ICommandBarStyles
}

export const CommandBar: React.FC<CommandBarProps> = memo(function CommandBar({
	commands,
	width,
	height,
	bgColor,
	color,
	styles,
}) {
	const overflowButtonProps = useOverflowButtonProps(bgColor, color)
	const handleOnDataReduce = useHandleOnDataReduce()
	const handleOnDataGrown = useHandleOnDataGrown(color)
	const commandStyles = useCommandStyles(height, styles)
	const items = useCommands(commands, bgColor, color)

	return (
		<CommandBarWrapper
			width={width}
			height={height}
			bgColor={bgColor}
			color={color}
		>
			<CB
				items={items}
				styles={commandStyles}
				overflowButtonProps={overflowButtonProps}
				onDataReduced={handleOnDataReduce}
				onDataGrown={handleOnDataGrown}
			/>
		</CommandBarWrapper>
	)
})

const useHandleOnDataReduce = () => {
	const iconProps = useIconProps()
	return useCallback(
		(item: ICommandBarItemProps) => {
			item.iconProps = iconProps(item)
			item.text = item.text || item.title || ''
		},
		[iconProps],
	)
}

const useHandleOnDataGrown = (color?: string) => {
	const iconProps = useIconProps()
	const theme = useThematic()
	return useCallback(
		(item: ICommandBarItemProps) => {
			item.iconProps = iconProps(
				item,
				color || theme.application().background().hex(),
			)
		},
		[iconProps, theme, color],
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

const useCommandStyles = (height?: string, styles: ICommandBarStyles = {}) => {
	return useMemo(
		() =>
			merge(
				{},
				{
					root: {
						float: 'right',
						height,
						background: 'none',
						padding: 0,
					},
				},
				styles,
			),
		[height, styles],
	)
}

const CommandBarWrapper = styled.div<{
	width?: string
	height?: string
	bgColor?: string
	color?: string
}>`
	width: ${({ width }) => width || '25%'};
	background-color: ${({ bgColor, theme }) =>
		bgColor || theme.application().accent().hex()};
	color: ${({ color }) => color || 'inherit'};
	height: ${({ height }) => height};
`
