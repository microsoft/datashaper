/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/tables'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { ReactElement } from 'react'

import type { SaveMetadataFunction } from './ArqueroDetailsList/ArqueroDetailsList.types.js'

export interface PreviewTableProps {
	table?: ColumnTable
	name?: string
	metadata?: TableMetadata
	outputHeaderCommandBar?: ReactElement<any, any>
	onChangeMetadata?: SaveMetadataFunction
	showColumnCount?: boolean
	showRowCount?: boolean
}
