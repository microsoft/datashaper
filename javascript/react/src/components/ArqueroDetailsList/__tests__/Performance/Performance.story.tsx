/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'

import type { ArqueroDetailsList } from '../../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../../ArqueroDetailsList.types.js'
import { Performance } from './Performance.js'

export const PerformanceStory: ComponentStory<typeof ArqueroDetailsList> = (
	args: ArqueroDetailsListProps,
	{ loaded: { stocks } }: any,
): JSX.Element => <Performance {...args} table={stocks} />

PerformanceStory.storyName = 'Performance Test (slow!)'
