/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'

import { TableCommands } from '../../../TableCommands.js'
import { ArqueroTableHeader } from '../../ArqueroTableHeader.js'
import type { ArqueroTableHeaderProps } from '../../ArqueroTableheader.types1.js'
import { useParameters } from './TableCommands.hooks.js'

export const TableCommandsStory: ComponentStory<typeof ArqueroTableHeader> = (
	args: ArqueroTableHeaderProps,
	{ loaded: { companies, products } }: any,
) => {
	const { workflow } = useParameters([companies, products])
	// this is an adjustment for the custom height story
	const height = args?.styles?.root?.height as number
	return (
		<ArqueroTableHeader
			{...args}
			table={companies}
			commandBar={
				<TableCommands
					inputTable={companies}
					workflow={workflow}
					selectedColumn={'Employees'}
					color={args.color}
					background={args.background}
					commandBarProps={{
						styles: {
							root: {
								height: height ? height - 1 : undefined,
							},
						},
					}}
				/>
			}
		/>
	)
}
