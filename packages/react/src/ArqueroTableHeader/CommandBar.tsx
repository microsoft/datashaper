/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	CommandBar as CB,
	ICommandBarItemProps,
	IIconProps,
} from '@fluentui/react'
import { Application } from '@thematic/core'
import { useThematic } from '@thematic/react'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { HEIGHT } from './constants'

interface CommandBarProps {
	commands: ICommandBarItemProps[]
	width?: string
}

export const CommandBar: React.FC<CommandBarProps> = memo(function CommandBar({
	commands,
	width,
}) {
	const overflowButtonProps = useOverflowButtonProps()
	const handleOnDataReduce = useHandleOnDataReduce()
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

const useHandleOnDataGrown = () => {
	const iconProps = useIconProps()
	return useCallback(
		(item: ICommandBarItemProps) => {
			item.iconProps = iconProps(item, 'background')
		},
		[iconProps],
	)
}

const useOverflowButtonProps = () => {
	const theme = useThematic()
	return useMemo(
		() => ({
			styles: {
				root: {
					background: theme.application().accent().hex(),
				},
				menuIcon: {
					color: theme.application().background().hex(),
				},
			},
		}),
		[theme],
	)
}

const useIconProps = (): ((
	item: ICommandBarItemProps,
	color?: string,
) => IIconProps) => {
	const theme = useThematic()
	return useCallback(
		(item: ICommandBarItemProps, color = 'foreground') => ({
			...item.iconProps,
			styles: {
				root: {
					color: theme.application()[color as keyof Application]().hex(),
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
