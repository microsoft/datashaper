/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'

import { ArqueroDetailsList } from '../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../ArqueroDetailsList.types.js'

export const BasicStory: ComponentStory<typeof ArqueroDetailsList> = (
	_args: ArqueroDetailsListProps,
	{ loaded: { stocks } }: any,
): JSX.Element => <ArqueroDetailsList table={stocks} />
