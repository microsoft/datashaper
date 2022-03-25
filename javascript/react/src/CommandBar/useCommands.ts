/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

/**
 * This hooks just centralizes default command item styling for the header
 * @param commands -
 * @returns
 */
export function useCommands(
	commands: ICommandBarItemProps[] = [],
	background: string,
	color: string,
): ICommandBarItemProps[] {
	return useMemo(() => {
		return commands.map(command =>
			merge(
				{},
				{
					iconProps: {
						styles: {
							root: {
								color,
							},
						},
					},
					buttonStyles: {
						root: {
							background,
							color,
						},
						menuIcon: {
							color,
						},
					},
				},
				command,
			),
		)
	}, [commands, background, color])
}
