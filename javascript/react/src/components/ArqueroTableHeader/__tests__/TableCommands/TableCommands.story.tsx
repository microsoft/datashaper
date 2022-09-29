/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroTableHeader as ArqueroTableHeaderComponent,
	TableCommands,
} from '@datashaper/react'
import type { ComponentStory } from '@storybook/react'

import type { ArqueroTableHeaderProps } from '../../ArqueroTableheader.types.js'
import { useParameters } from './TableCommands.hooks.js'

export const TableCommandsStory: ComponentStory<
	typeof ArqueroTableHeaderComponent
> = (
	args: ArqueroTableHeaderProps,
	{ loaded: { companies, products } }: any,
) => {
	const { workflow } = useParameters([companies, products])
	return (
		<ArqueroTableHeaderComponent
			{...args}
			table={companies}
			commandBar={
				<TableCommands
					inputTable={companies}
					workflow={workflow}
					selectedColumn={'Employees'}
				/>
			}
		/>
	)
}
