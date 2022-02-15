/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { merge } from 'lodash'
import { useMemo } from 'react'

/**
 * This hooks just centralizes default command item styling for the header
 * @param commands
 * @returns
 */
export function useCommands(
	commands: ICommandBarItemProps[] = [],
): ICommandBarItemProps[] {
	const theme = useThematic()
	return useMemo(() => {
		return commands.map(command =>
			merge(
				{},
				{
					iconProps: {
						styles: {
							root: {
								color: theme.application().background().hex(),
							},
						},
					},
					buttonStyles: {
						root: {
							background: theme.application().accent().hex(),
							color: theme.application().background().hex(),
						},
						menuIcon: {
							color: theme.application().background().hex(),
						},
					},
				},
				command,
			),
		)
	}, [theme, commands])
}
