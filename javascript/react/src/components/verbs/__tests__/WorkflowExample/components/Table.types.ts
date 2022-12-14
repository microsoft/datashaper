/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/tables'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { ArqueroDetailsListFeatures } from '../../../../ArqueroDetailsList/ArqueroDetailsList.types.js'

export interface ColumnConfig {
	width?: number
	iconName?: string
}

export type ColumnConfigMap = Record<string, ColumnConfig>

export interface TableProps {
	name?: string
	table: ColumnTable
	metadata?: TableMetadata
	config?: ColumnConfigMap
	features?: ArqueroDetailsListFeatures
	compact?: boolean
	onRenameTable?: (name: string) => void
}
