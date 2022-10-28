/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, CommandBar } from '@fluentui/react'
import type { ComponentStory } from '@storybook/react'
import styled from 'styled-components'

import { ArqueroTableHeader } from '../../ArqueroTableHeader.js'
import type { ArqueroTableHeaderProps } from '../../ArqueroTableheader.types1.js'
import {
	useCheckboxes,
	useCommandBar,
	useFarCommandBar,
} from './CommandBars.hooks.js'

export const CommandBarsStory: ComponentStory<typeof ArqueroTableHeader> = (
	args: ArqueroTableHeaderProps,
	{ loaded: { stocks } }: any,
) => {
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
			<ArqueroTableHeader
				{...args}
				table={stocks}
				commandBar={near ? <CommandBar {...commandBar} /> : undefined}
				farCommandBar={far ? <CommandBar {...farCommandBar} /> : undefined}
			/>
		</>
	)
}

const Checkboxes = styled.div`
	margin: 12px 0 12px 0;
	display: flex;
	gap: 32px;
`
