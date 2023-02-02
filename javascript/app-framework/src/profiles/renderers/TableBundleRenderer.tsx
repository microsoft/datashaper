/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import type { TableBundle } from '@datashaper/workflow'
import { CompoundEditor } from '../../components/editors/CompoundEditor/index.js'
import { ResourceSchemaEditor } from '../../components/editors/ResourceSchemaEditor/index.js'
import { TableBundleEditor } from '../../components/editors/TableBundleEditor/index.js'
import { useHelpOnMount } from '../../hooks/useHelpOnMount.js'
import type { ProfileComponentProps } from '../../types.js'
import { profileIcons } from '../icons.js'

export const TableBundleRenderer: React.FC<ProfileComponentProps<TableBundle>> =
	memo(function TableBundleRenderer({ resource }) {
		useHelpOnMount('resources.tablebundle.index')
		return <CompoundEditor resource={resource} editors={editors} />
	})

const editors = [
	{
		key: 'tablebundle-json',
		title: 'View and edit table bundle JSON config',
		iconName: profileIcons.json,
		renderer: ResourceSchemaEditor,
	},
	{
		key: 'tablebundle-interactive',
		title: 'View and edit interactive table',
		iconName: profileIcons.interactive,
		renderer: TableBundleEditor,
	},
]
