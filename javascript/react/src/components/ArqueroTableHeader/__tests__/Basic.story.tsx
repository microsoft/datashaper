/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroTableHeader as ArqueroTableHeaderComponent } from '@datashaper/react'
import type { ComponentStory } from '@storybook/react'

import type { ArqueroTableHeaderProps } from '../ArqueroTableheader.types.js'

export const BasicStory: ComponentStory<typeof ArqueroTableHeaderComponent> = (
	args: ArqueroTableHeaderProps,
	{ loaded: { stocks } }: any,
) => <ArqueroTableHeaderComponent {...args} table={stocks} />
