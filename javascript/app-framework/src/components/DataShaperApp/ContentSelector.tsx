/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTable } from '@datashaper/workflow'
import { Spinner } from '@fluentui/react'
import { memo } from 'react'

import { useDataTable } from '../../hooks/useDataTable.js'
import {
	CodebookEditor,
	DataSourceEditor,
	RawTableViewer,
	TableEditor,
	WorkflowEditor,
} from '../editors/index.js'
import type { ContentSelectorProps } from './ContentSelector.types.js'

export const ContentSelector: React.FC<ContentSelectorProps> = memo(
	function ContentSelector({
		handler,
		args,
		plugins,
		pluginInstance,
		children,
	}) {
		if (handler == null) {
			if (children != null) {
				return <>{children}</>
			}
			return null
		} else {
			const defaultHandler = DEFAULT_HANDLERS[handler]
			if (defaultHandler != null) {
				if (args == null || args.length === 0) {
					throw new Error('no table name provided')
				}
				return (
					<DataTableHandler
						renderer={defaultHandler}
						tableName={args[0] as string}
					/>
				)
			} else if (plugins.length != null) {
				const CustomHandler = plugins.find(p => p.profile === handler)
				if (CustomHandler != null) {
					return CustomHandler.render(instance)
				}
			}
			return <div>Could not render content for handler type {handler}.</div>
		}
	},
)

interface DataTableHandlerProps {
	tableName: string
	renderer: React.ComponentType<{ dataTable: DataTable }>
}
const DataTableHandler: React.FC<DataTableHandlerProps> = memo(
	function DataTableHandler({ tableName, renderer: R }) {
		const dataTable = useDataTable(tableName)
		return dataTable ? <R dataTable={dataTable} /> : <Spinner />
	},
)

const DEFAULT_HANDLERS: Record<
	string,
	React.ComponentType<{ dataTable: DataTable }>
> = {
	'table.codebook': CodebookEditor,
	'table.source': DataSourceEditor,
	'table.bundle': TableEditor,
	'table.workflow': WorkflowEditor,
	'table.datasource': RawTableViewer,
}
