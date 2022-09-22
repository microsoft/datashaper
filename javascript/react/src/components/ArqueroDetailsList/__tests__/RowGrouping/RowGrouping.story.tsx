/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'

import type { ArqueroDetailsList } from '../../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../../ArqueroDetailsList.types.js'
import { RowGrouping } from './RowGrouping.js'

export const RowGroupingStory: ComponentStory<typeof ArqueroDetailsList> = (
	args: ArqueroDetailsListProps,
	{ loaded: { stocks } }: any,
): JSX.Element => <RowGrouping {...args} table={stocks} />
