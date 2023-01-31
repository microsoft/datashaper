/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type { DataTable } from '@datashaper/workflow'
import { CompoundEditor } from '../../components/editors/CompoundEditor/CompoundEditor.js'
import { DataTableEditor } from '../../components/editors/DataTableEditor/DataTableEditor.js'
import { DataTableTextEditor } from '../../components/editors/DataTableTextEditor/DataTableTextEditor.js'
import { ResourceSchemaEditor } from '../../components/editors/ResourceSchemaEditor/ResourceSchemaEditor.js'
import { useHelpOnMount } from '../../hooks/useHelpOnMount.js'
import type { PluginComponentProps } from '../../types.js'

export const DataTableRenderer: React.FC<PluginComponentProps<DataTable>> =
	memo(function DataTableRenderer({ resource }) {
		useHelpOnMount('resources.datatable.index')
		return <CompoundEditor resource={resource} editors={editors} />
	})

const editors = [
	{
		key: 'data-table-text',
		title: 'View and edit raw table text content',
		iconName: 'PageData',
		renderer: DataTableTextEditor,
	},
	{
		key: 'data-table-json',
		title: 'View and edit table JSON config',
		iconName: 'Code',
		renderer: ResourceSchemaEditor,
	},
	{
		key: 'data-table-ux',
		title: 'View and edit interactive table options',
		iconName: 'PreviewLink',
		renderer: DataTableEditor,
	},
]
