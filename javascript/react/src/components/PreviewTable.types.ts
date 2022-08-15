/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/arquero'
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { SaveMetadataFunction } from './ArqueroDetailsList/ArqueroDetailsList.types.js'

export interface PreviewTableProps {
	table?: ColumnTable
	name?: string
	metadata?: TableMetadata
	headerCommandBar?: IRenderFunction<IDetailsColumnProps>[]
	onChangeMetadata?: SaveMetadataFunction
}
