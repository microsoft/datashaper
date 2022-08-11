/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import type { DetailsListFeatures } from '@essex/arquero-react'

import type { ColumnConfigMap } from './Table.types.js'

export interface InputTablesProps {
	tables: TableContainer[]
	config: ColumnConfigMap
	features?: DetailsListFeatures
	compact?: boolean
}
