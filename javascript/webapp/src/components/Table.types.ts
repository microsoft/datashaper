/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DetailsListFeatures } from '@essex/arquero-react'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export interface ColumnConfig {
	width?: number
	iconName?: string
}

export type ColumnConfigMap = Record<string, ColumnConfig>

export interface TableProps {
	name?: string
	table: ColumnTable
	config: ColumnConfigMap
	features?: DetailsListFeatures
	compact?: boolean
	onRenameTable?: (name: string) => void
}
