/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import type { Workflow } from '@datashaper/workflow'
import { CompoundEditor } from '../../components/editors/CompoundEditor/index.js'
import { ResourceSchemaEditor } from '../../components/editors/ResourceSchemaEditor/index.js'
import { useHelpOnMount } from '../../hooks/useHelpOnMount.js'
import type { ProfileComponentProps } from '../../types.js'

export const WorkflowRenderer: React.FC<ProfileComponentProps<Workflow>> = memo(
	function WorkflowRenderer({ resource }) {
		useHelpOnMount('resources.workflow.index')
		return <CompoundEditor resource={resource} editors={editors} />
	},
)

const editors = [
	{
		key: 'workflow-json',
		title: 'View and edit workflow JSON',
		iconName: 'Code',
		renderer: ResourceSchemaEditor,
	},
]
