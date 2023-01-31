/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type { DataTable } from '@datashaper/workflow'
import { CompoundEditor } from '../../components/editors/CompoundEditor/index.js'
import { DataTableEditor } from '../../components/editors/DataTableEditor/index.js'
import { DataTableTextEditor } from '../../components/editors/DataTableTextEditor/index.js'
import { ResourceSchemaEditor } from '../../components/editors/ResourceSchemaEditor/index.js'
import { useHelpOnMount } from '../../hooks/useHelpOnMount.js'
import type { PluginComponentProps } from '../../types.js'

export const DataTableRenderer: React.FC<PluginComponentProps<DataTable>> =
	memo(function DataTableRenderer({ resource }) {
		useHelpOnMount('resources.datatable.index')
		return <CompoundEditor resource={resource} editors={editors} />
	})

const editors = [
	{
		key: 'datatable-text',
		title: 'View and edit raw table text content',
		iconName: 'PageData',
		renderer: DataTableTextEditor,
	},
	{
		key: 'datatable-json',
		title: 'View and edit table JSON config',
		iconName: 'Code',
		renderer: ResourceSchemaEditor,
	},
	{
		key: 'datatable-interactive',
		title: 'View and edit interactive table options',
		iconName: 'PreviewLink',
		renderer: DataTableEditor,
	},
]
