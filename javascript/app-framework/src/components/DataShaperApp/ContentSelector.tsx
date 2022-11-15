/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTable } from '@datashaper/workflow'
import { Spinner } from '@fluentui/react'
import React, { memo } from 'react'

import { useDataTable } from '../../hooks/useDataTable.js'
import {
	CodebookEditor,
	DataSourceEditor,
	RawTableViewer,
	TableEditor,
	WorkflowEditor,
} from '../editors/index.js'

export interface ContentSelectorProps {
	handler?: string
	args?: string[]
	handlers?: Record<string, React.ComponentType<{ args: string[] }>>
}
export const ContentSelector: React.FC<ContentSelectorProps> = memo(
	function ContentSelector({ handler, args, handlers }) {
		if (handler != null) {
			const defaultHandler = DEFAULT_HANDLERS[handler]
			if (args == null || args.length === 0) {
				throw new Error('no table name provided')
			}
			if (defaultHandler != null) {
				return (
					<DataTableHandler
						renderer={defaultHandler}
						tableName={args[0] as string}
					/>
				)
			} else if (handlers != null) {
				const CustomHandler = handlers[handler]
				if (CustomHandler != null) {
					return <CustomHandler args={args} />
				}
			}
			return <div>Could not render content for handler type {handler}.</div>
		}
		return null
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