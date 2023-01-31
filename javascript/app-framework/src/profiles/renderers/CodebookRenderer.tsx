/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import type { Codebook } from '@datashaper/workflow'
import { CompoundEditor } from '../../components/editors/CompoundEditor/index.js'
import { CodebookEditor } from '../../components/editors/CodebookEditor/index.js'
import { ResourceSchemaEditor } from '../../components/editors/ResourceSchemaEditor/index.js'
import { useHelpOnMount } from '../../hooks/useHelpOnMount.js'
import type { PluginComponentProps } from '../../types.js'

export const CodebookRenderer: React.FC<PluginComponentProps<Codebook>> = memo(
	function CodebookRenderer({ resource }) {
		useHelpOnMount('resources.codebook.index')
		return <CompoundEditor resource={resource} editors={editors} />
	},
)

const editors = [
	{
		key: 'codebook-json',
		title: 'View and edit codebook JSON config',
		iconName: 'Code',
		renderer: ResourceSchemaEditor,
	},
	{
		key: 'codebook-ux',
		title: 'View and edit interactive codebook options',
		iconName: 'PreviewLink',
		renderer: CodebookEditor,
	},
]
