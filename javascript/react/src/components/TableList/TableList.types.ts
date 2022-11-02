/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'

export interface TableListProps {
	tables: TableContainer[]
	onSelect?: (name: string) => void
	selected?: string
}
