/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import type { UnknownResource } from '@datashaper/workflow'
import { CompoundEditor } from '../../components/editors/CompoundEditor/index.js'
import { ResourceSchemaEditor } from '../../components/editors/ResourceSchemaEditor/index.js'
import type { ProfileComponentProps } from '../../types.js'
import { profileIcons } from '../icons.js'

export const UnknownResourceRenderer: React.FC<
	ProfileComponentProps<UnknownResource>
> = memo(function UnknownResourceRenderer({ resource }) {
	return <CompoundEditor resource={resource} editors={editors} />
})

const editors = [
	{
		key: 'unkown-json',
		title: 'View and edit raw JSON for unknown schemas',
		iconName: profileIcons.json,
		renderer: ResourceSchemaEditor,
	},
]
