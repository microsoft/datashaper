/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'

import type { ArqueroDetailsList } from '../../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../../ArqueroDetailsList.types.js'
import { Columns } from './Columns.js'

export const ColumnsStory: ComponentStory<typeof ArqueroDetailsList> = (
	_args: ArqueroDetailsListProps,
	{ loaded: { stocks } }: any,
): JSX.Element => <Columns table={stocks} />
