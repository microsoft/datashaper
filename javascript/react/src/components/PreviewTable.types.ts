/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@essex/arquero'
import type { SaveMetadataFunction } from '@essex/arquero-react'
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export interface PreviewTableProps {
	table?: ColumnTable
	name?: string
	metadata?: TableMetadata
	headerCommandBar?: IRenderFunction<IDetailsColumnProps>[]
	onChangeMetadata?: SaveMetadataFunction
}
