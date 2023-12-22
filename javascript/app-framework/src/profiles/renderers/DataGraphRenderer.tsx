/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import type { DataGraph } from '@datashaper/workflow'
import { CompoundEditor } from '../../components/editors/CompoundEditor/index.js'
import { ResourceSchemaEditor } from '../../components/editors/ResourceSchemaEditor/index.js'
import { DataGraphEditor } from '../../components/editors/DataGraphEditor/index.js'
import { useHelpOnMount } from '../../hooks/useHelpOnMount.js'
import type { ProfileComponentProps } from '../../types.js'
import { profileIcons } from '../icons.js'

export const DataGraphRenderer: React.FC<ProfileComponentProps<DataGraph>> =
	memo(function DataGraphRenderer({ resource }) {
		useHelpOnMount('resources.Graph.index')
		return <CompoundEditor resource={resource} editors={editors} />
	})

const editors = [
	{
		key: 'graph-json',
		title: 'View and edit table bundle JSON config',
		iconName: profileIcons.json,
		renderer: ResourceSchemaEditor,
	},
	{
		key: 'graph-interactive',
		title: 'View and edit interactive table',
		iconName: profileIcons.interactive,
		renderer: DataGraphEditor,
	},
]
