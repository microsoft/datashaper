/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import type { Codebook } from '@datashaper/workflow'
import { CodebookEditor } from '../../components/editors/CodebookEditor/index.js'
import { CompoundEditor } from '../../components/editors/CompoundEditor/index.js'
import { ResourceSchemaEditor } from '../../components/editors/ResourceSchemaEditor/index.js'
import { useHelpOnMount } from '../../hooks/useHelpOnMount.js'
import type { ProfileComponentProps } from '../../types.js'
import { profileIcons } from '../icons.js'

export const CodebookRenderer: React.FC<ProfileComponentProps<Codebook>> = memo(
	function CodebookRenderer({ resource }) {
		useHelpOnMount('resources.codebook.index')
		return <CompoundEditor resource={resource} editors={editors} />
	},
)

const editors = [
	{
		key: 'codebook-json',
		title: 'View and edit codebook JSON config',
		iconName: profileIcons.json,
		renderer: ResourceSchemaEditor,
	},
	{
		key: 'codebook-interactive',
		title: 'View and edit interactive codebook options',
		iconName: profileIcons.interactive,
		renderer: CodebookEditor,
	},
]
