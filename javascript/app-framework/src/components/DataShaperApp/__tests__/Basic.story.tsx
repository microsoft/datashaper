/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'allotment/dist/style.css'

import type { ComponentStory } from '@storybook/react'
import styled from 'styled-components'

import { DataShaperApp } from '../DataShaperApp.js'
import type { DataShaperAppProps } from '../DataShaperApp.types.js'

export const BasicStory: ComponentStory<typeof DataShaperApp> = (
	args: DataShaperAppProps,
): JSX.Element => (
	<Container>
		<DataShaperApp {...args}>
			<div style={{ flex: 1, height: '100%', width: '100%' }}>test content</div>
		</DataShaperApp>
	</Container>
)

const Container = styled.div`
	flex: 1;
	display: flex;
	height: 100%;
	width: 100%;
`
