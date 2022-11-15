/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'

import { DataShaperApp } from '../DataShaperApp.js'
import type { DataShaperAppProps } from '../DataShaperApp.types.js'

export const BasicStory: ComponentStory<typeof DataShaperApp> = (
	args: DataShaperAppProps,
): JSX.Element => (
	<DataShaperApp {...args} style={{ flex: 1, height: '100%', width: '100%' }}>
		<div style={{ flex: 1 }}>test content</div>
	</DataShaperApp>
)
