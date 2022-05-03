/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { GraphManager } from '@data-wrangling-components/core'
import type { TableMetadata } from '@essex/arquero'
import { useCallback } from 'react'

export function useOnUpdateMetadata(
	store: GraphManager,
	selectedTableName?: string,
): (meta: TableMetadata) => void {
	return useCallback(
		(meta: TableMetadata) => {
			const _table = store.latest(selectedTableName as string)
			if (_table) {
				_table.metadata = meta
			}
		},
		[store, selectedTableName],
	)
}
