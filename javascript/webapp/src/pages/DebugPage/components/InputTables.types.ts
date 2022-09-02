/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DetailsListFeatures } from '@datashaper/react'
import type { TableContainer } from '@datashaper/tables'

import type { ColumnConfigMap } from './Table.types.js'

export interface InputTablesProps {
	tables: TableContainer[]
	config?: ColumnConfigMap
	features?: DetailsListFeatures
	compact?: boolean
}
