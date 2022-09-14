/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroTableHeader as ArqueroTableHeaderComponent } from '@datashaper/react'
import { Checkbox } from '@fluentui/react'
import type { ComponentStory } from '@storybook/react'
import styled from 'styled-components'

import type { ArqueroTableHeaderProps } from '../../ArqueroTableheader.types.js'
import {
	useCheckboxes,
	useCommandBar,
	useFarCommandBar,
} from './CommandBars.hooks.js'

export const CommandBarsStory: ComponentStory<
	typeof ArqueroTableHeaderComponent
> = (args: ArqueroTableHeaderProps, { loaded: { stocks } }: any) => {
	const commandBar = useCommandBar()
	const farCommandBar = useFarCommandBar()
	const { near, far, checkboxes } = useCheckboxes()
	return (
		<>
			<Checkboxes>
				{checkboxes.map(checkbox => (
					<Checkbox key={checkbox.label} {...checkbox} />
				))}
			</Checkboxes>
			<ArqueroTableHeaderComponent
				{...args}
				table={stocks}
				commandBar={near ? commandBar : undefined}
				farCommandBar={far ? farCommandBar : undefined}
			/>
		</>
	)
}

const Checkboxes = styled.div`
	margin: 12px 0 12px 0;
	display: flex;
	gap: 32px;
`
