/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { useHelpOnMount } from '../../../hooks/useHelpOnMount.js'
import { CompoundEditor } from '../CompoundEditor/index.js'
import { DataTableTextEditor } from '../DataTableTextEditor/index.js'
import { ResourceSchemaEditor } from '../ResourceSchemaEditor/index.js'

import type { DataTableEditorProps } from './DataTableEditor.types.js'
import { TableEditor } from './TableEditor.js'

export const DataTableEditor: React.FC<DataTableEditorProps> = memo(
	function DataTableEditor({ resource }) {
		useHelpOnMount('resources.datatable.index')
		return <CompoundEditor resource={resource} editors={editors} />
	},
)

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
		renderer: TableEditor,
	},
]
